#!/usr/bin/env python3
"""仅管理自己创建的子进程组；运行配置与日志留在任务私密目录。"""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True, type=Path)
    parser.add_argument('--jar', type=Path)
    parser.add_argument('--jar-sha256')
    parser.add_argument('--lease', type=float, default=3600)
    parser.add_argument('--simulate', choices=['stop', 'exception', 'term', 'timeout'])
    args = parser.parse_args()
    os.umask(0o077)
    root = args.root.resolve(strict=True)
    if args.root.is_symlink() or (root.stat().st_mode & 0o777) != 0o700:
        raise RuntimeError('TASK_ROOT_IDENTITY_REFUSED')
    if not (0 < args.lease <= 3600):
        raise RuntimeError('LEASE_REFUSED')
    identity, result_file, stop_file = root / 'process-identity-reopen-r001.json', root / 'process-result-reopen-r001.json', root / 'stop-reopen-r001'
    if identity.exists() or result_file.exists() or stop_file.exists():
        raise RuntimeError('PROCESS_SLOT_ALREADY_USED')
    if args.simulate:
        command = [sys.executable, '-c', 'import time; time.sleep(90)']
        jar_sha = None
    else:
        if not args.jar or not args.jar_sha256:
            raise RuntimeError('JAR_IDENTITY_REQUIRED')
        jar = args.jar.resolve(strict=True)
        jar_sha = hashlib.sha256(jar.read_bytes()).hexdigest()
        if jar_sha != args.jar_sha256:
            raise RuntimeError('JAR_DIGEST_MISMATCH')
        home = root / 'home'
        config = home / 'opt/dataease3.0/config/application.yml'
        if not config.is_file() or config.is_symlink() or (config.stat().st_mode & 0o777) != 0o600:
            raise RuntimeError('PRIVATE_CONFIG_REQUIRED')
        command = ['java', '-Duser.home=' + str(home), '-jar', str(jar),
                   '--spring.config.additional-location=file:' + str(config),
                   '--spring.profiles.active=standalone', '--server.address=127.0.0.1', '--server.port=8110']
    allowed_env = ['PATH', 'JAVA_HOME', 'LANG', 'LC_ALL', 'LC_CTYPE', 'TZ', 'TMPDIR']
    child_env = {key: value for key, value in os.environ.items() if key in allowed_env}
    reason = None
    signal_seen = []
    def on_signal(number, _frame):
        signal_seen.append(number)
    signal.signal(signal.SIGTERM, on_signal)
    signal.signal(signal.SIGINT, on_signal)
    child = None
    start = time.monotonic()
    started_at = utc()
    error_type = None
    term_sent = kill_sent = False
    child_reaped = False
    cleanup_started_at = None
    try:
        with (root / 'runtime-reopen-r001.log').open('xb') as output:
            child = subprocess.Popen(command, cwd=root, env=child_env, stdout=output,
                                     stderr=subprocess.STDOUT, start_new_session=True)
            # 租约从实际spawn后开始，准备配置不混入运行租约。
            start = time.monotonic()
            identity.write_text(json.dumps({'created_at': started_at, 'pid': child.pid,
                'process_group': child.pid, 'parent_pid': os.getpid(), 'jar_sha256': jar_sha,
                'root': str(root), 'lease_seconds': args.lease, 'cleanup_grace_seconds': 15,
                'simulation': args.simulate, 'environment_keys': sorted(child_env)}, indent=2) + '\n')
            while True:
                elapsed = time.monotonic() - start
                if args.simulate == 'stop' and elapsed >= 0.2:
                    stop_file.write_text('simulation stop\n')
                if args.simulate == 'exception' and elapsed >= 0.2:
                    raise RuntimeError('SIMULATED_PARENT_ERROR')
                if args.simulate == 'term' and elapsed >= 0.2 and not signal_seen:
                    os.kill(os.getpid(), signal.SIGTERM)
                if signal_seen:
                    reason = 'parent_signal'
                    break
                if stop_file.exists():
                    reason = 'explicit_stop'
                    break
                if child.poll() is not None:
                    reason = 'child_exited'
                    break
                if elapsed >= args.lease:
                    reason = 'lease_expired'
                    break
                time.sleep(0.05)
    except BaseException as error:
        error_type = type(error).__name__
        reason = reason or 'parent_error'
    finally:
        cleanup_started_at = utc()
        if child is not None:
            if child.poll() is None:
                try:
                    if os.getpgid(child.pid) != child.pid:
                        raise RuntimeError('CHILD_PROCESS_GROUP_IDENTITY_CHANGED')
                    os.killpg(child.pid, signal.SIGTERM)
                    term_sent = True
                except ProcessLookupError:
                    pass
                try:
                    child.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    os.killpg(child.pid, signal.SIGKILL)
                    kill_sent = True
                    child.wait(timeout=5)
            else:
                child.wait(timeout=1)
            child_reaped = child.returncode is not None
        result = {'started_at': started_at, 'cleanup_started_at': cleanup_started_at,
            'ended_at': utc(), 'reason': reason, 'error_type': error_type,
            'pid': child.pid if child else None, 'term_sent': term_sent, 'kill_sent': kill_sent,
            'child_reaped': child_reaped, 'returncode': child.returncode if child else None,
            'elapsed_seconds': time.monotonic() - start,
            'claim': '仅本Popen创建的进程组；SIGKILL父进程/系统崩溃无法执行finally，未宣称覆盖'}
        result_file.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
        print(json.dumps({'reason': reason, 'child_reaped': child_reaped,
                          'result_path': str(result_file)}, ensure_ascii=False), flush=True)
    return 0 if child_reaped and reason != 'parent_error' else 2


if __name__ == '__main__':
    sys.exit(main())
