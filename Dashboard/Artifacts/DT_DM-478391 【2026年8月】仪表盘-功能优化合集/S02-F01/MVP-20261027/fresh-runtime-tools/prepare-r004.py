import collections
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import selectors
import shutil
import subprocess
import time
import uuid

ROOT = Path('/private/tmp/s02-symbolic-runtime-r001')
SOURCE = 'dataeasev3'
TARGET = 's02_symbolic_20261029'
MYSQL = '/opt/homebrew/opt/mysql@8.4/bin/mysql'
DUMP = '/opt/homebrew/opt/mysql@8.4/bin/mysqldump'
DEFAULTS = '--defaults-extra-file=/Users/xiaomei/opt/dataease3.0/config/mysql-root.cnf'
REPO = Path('/Users/xiaomei/Documents/projects/dataease')
EVIDENCE = next((REPO / 'Dashboard/Artifacts').glob('DT_DM-478391*/S02-F01/MVP-20261027/evidence'))
TOOLS = EVIDENCE.parent / 'fresh-runtime-tools'


def check(ok, reason):
    if not ok:
        raise RuntimeError(reason)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def mysql(sql, schema=None, raw=False):
    command = [MYSQL, DEFAULTS, '--batch', '--skip-column-names']
    if raw:
        command.append('--raw')
    if schema:
        command += ['--database=' + schema]
    result = subprocess.run(command, input=sql, capture_output=True, text=True, timeout=60)
    if result.returncode:
        if ROOT.exists():
            (ROOT / 'mysql-last-error.log').write_text(result.stderr)
        raise RuntimeError('MYSQL_FAILED_PRIVATE_LOG')
    return result.stdout


def scalar(sql, schema=None):
    return mysql(sql, schema).strip()


def table_list(schema):
    return mysql("SELECT table_name FROM information_schema.tables WHERE table_schema='" + schema
                 + "' ORDER BY table_name").splitlines()


def table_hashes(schema, names):
    hashes = {}
    for name in names:
        check(re.fullmatch(r'[A-Za-z0-9_]+', name), 'UNEXPECTED_TABLE_IDENTIFIER')
        suffix = " WHERE version<>'985188400292302848'" if name == 'de_template_version' else ''
        if name in ['core_datasource', 'core_de_engine']:
            continue
        statement='SELECT * FROM `' + name + '`' + suffix
        raw=subprocess.run([MYSQL,DEFAULTS,'--batch','--skip-column-names','--database='+schema],input=statement.encode(),capture_output=True,timeout=60)
        check(raw.returncode==0,'BINARY_TABLE_HASH_QUERY_FAILED')
        hashes[name] = hashlib.sha256(raw.stdout).hexdigest()
    return hashes


class Session:
    def __init__(self):
        self.error_file = (ROOT / 'mysql-session-errors.log').open('wb')
        self.process = subprocess.Popen([MYSQL, DEFAULTS, '--database=' + TARGET,
            '--batch', '--skip-column-names', '--raw', '--unbuffered'], stdin=subprocess.PIPE,
            stdout=subprocess.PIPE, stderr=self.error_file)
        self.buffer = b''

    def query(self, sql, commit=False):
        marker = uuid.uuid4().hex
        ending = "SELECT JSON_OBJECT('_s02_marker','" + marker + "');\n"
        deadline = time.monotonic() + 10
        try:
            self.process.stdin.write((sql + '\n' + ending).encode())
            self.process.stdin.flush()
            selector = selectors.DefaultSelector()
            selector.register(self.process.stdout, selectors.EVENT_READ)
            rows = []
            total = 0
            try:
                while True:
                    if b'\n' in self.buffer:
                        line, self.buffer = self.buffer.split(b'\n', 1)
                        if not line:
                            continue
                        item = json.loads(line.decode())
                        if item.get('_s02_marker') == marker:
                            return rows
                        rows.append(item)
                        continue
                    remaining = deadline - time.monotonic()
                    if remaining <= 0 or not selector.select(remaining):
                        raise RuntimeError('DB_RESPONSE_DEADLINE')
                    chunk = os.read(self.process.stdout.fileno(), 65536)
                    if not chunk:
                        raise RuntimeError('DB_RESPONSE_EOF')
                    total += len(chunk)
                    check(total <= 2 * 1024 * 1024, 'DB_RESPONSE_LIMIT')
                    self.buffer += chunk
            finally:
                selector.close()
        except BaseException as error:
            if commit:
                raise RuntimeError('COMMIT_OUTCOME_UNKNOWN_NO_RETRY') from error
            raise

    def close(self):
        try:
            try:
                self.process.stdin.close()
            except (OSError, BrokenPipeError):
                pass
            try:
                self.process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.process.terminate()
                try:
                    self.process.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    self.process.kill()
                    self.process.wait(timeout=2)
        finally:
            self.error_file.close()


def main():
    os.umask(0o077)
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    check(ROOT.is_dir() and not ROOT.is_symlink() and (ROOT.stat().st_mode & 0o777)==0o700, 'OWNED_IMPORTED_ROOT_REQUIRED')
    owner=json.loads((ROOT/'ownership.json').read_text())
    check(owner.get('task')=='DE-S02-F01/DE-EXEC-S038' and owner.get('target_schema')==TARGET and owner.get('source_schema')==SOURCE and owner.get('schema_created') is True, 'OWNED_IMPORTED_RECOVERY_REFUSED')
    check(scalar("SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='"+TARGET+"'")== '1', 'OWNED_CLONE_SCHEMA_MISSING')
    check(scalar('SELECT @@port')=='3307', 'PORT_MISMATCH')
    dump_file=ROOT/'source-r002.sql'
    check(digest(dump_file)==owner.get('dump_sha256'), 'DUMP_OWNERSHIP_DIGEST_MISMATCH')
    config_file=ROOT/'home/opt/dataease3.0/config/application.yml'
    check(digest(config_file)=='e9ddaa8f79579f6fbc88129fcdc52406559a424ab03ede9ac3cd8d71dbd8180e', 'CONFIG_IDENTITY_DRIFT')
    for path in ROOT.rglob('*'):
        check(not path.is_symlink() and path.resolve().is_relative_to(ROOT.resolve()), 'PRIVATE_PATH_ESCAPE')
    sql_text=dump_file.read_text()
    check(not re.search(r'(?im)^\s*(?:/\*!\d+\s+)?(?:CREATE\s+(?:DATABASE|VIEW|TRIGGER)\b|USE\s+)',sql_text),'DUMP_REDIRECTION_REFUSED')
    counts={name:0 for name in re.findall(r'(?m)^CREATE TABLE `([^`]+)`',sql_text)}
    for name in re.findall(r'(?m)^INSERT INTO `([^`]+)` VALUES ',sql_text):
        check(name in counts,'DUMP_INSERT_WITHOUT_TABLE')
        counts[name]+=1
    check(len(counts)==72,'DUMP_TABLE_COUNT_MISMATCH')
    schema_cmd=[DUMP,DEFAULTS,'--no-data','--skip-comments','--skip-dump-date','--hex-blob','--set-gtid-purged=OFF','--no-tablespaces',SOURCE]
    current=subprocess.run(schema_cmd,capture_output=True,text=True,timeout=60)
    check(current.returncode==0,'SOURCE_SCHEMA_READ_FAILED')
    pattern=r'(?ms)^CREATE TABLE `([^`]+)`(.*?);\n'
    current_defs=dict(re.findall(pattern,current.stdout))
    dump_defs=dict(re.findall(pattern,sql_text))
    check(len(current_defs)==72 and current_defs==dump_defs,'SOURCE_SCHEMA_CURRENT_DIFFERS_FROM_DUMP')
    (ROOT/'schema-current-ddl.sql').write_text(current.stdout)
    check(sorted(table_list(TARGET)) == sorted(counts), 'CLONE_TABLE_LIST_MISMATCH')
    for name, count in counts.items():
        check(scalar('SELECT COUNT(*) FROM `' + name + '`', TARGET) == str(count), 'CLONE_ROW_COUNT_MISMATCH')
    check(scalar('SELECT COUNT(*) FROM core_dataset_table_field WHERE dataset_group_id=1312472054565572608', TARGET) == '19', 'FIXTURE_FIELD_COUNT_MISMATCH')
    check(scalar('SELECT COUNT(*) FROM core_dataset_table WHERE id=7520739241744142336 AND dataset_group_id=1312472054565572608 AND datasource_id=985188400292302848', TARGET) == '1', 'FIXTURE_TABLE_IDENTITY_MISMATCH')
    before_hashes = table_hashes(TARGET, sorted(counts))
    session = Session()
    commit_state = 'not_sent'
    main_error = None
    try:
        identity = session.query("SELECT JSON_OBJECT('port',@@port,'db',DATABASE());")[0]
        check(identity == {'port': 3307, 'db': TARGET}, 'CLONE_SESSION_IDENTITY_MISMATCH')
        session.query('START TRANSACTION;')
        sources = session.query("SELECT JSON_OBJECT('id',CAST(id AS CHAR),'type',type) FROM core_datasource ORDER BY id FOR UPDATE;")
        engines = session.query("SELECT JSON_OBJECT('id',CAST(id AS CHAR),'type',type) FROM core_de_engine ORDER BY id FOR UPDATE;")
        marker = session.query("SELECT JSON_OBJECT('version',version) FROM de_template_version WHERE version='985188400292302848' FOR UPDATE;")
        check(sources == [{'id':'985188400292302848','type':'mysql'},{'id':'1308230587517112320','type':'mysql'}], 'CLONE_SOURCE_IDENTITY_DRIFT')
        check(engines == [{'id':'1307768503922724864','type':'mysql'}], 'CLONE_ENGINE_IDENTITY_DRIFT')
        check(marker == [{'version':'985188400292302848'}], 'CLONE_DEMO_MARKER_DRIFT')
        changes = [
            ("DELETE FROM core_datasource WHERE id IN (985188400292302848,1308230587517112320) AND type='mysql';",2),
            ("DELETE FROM core_de_engine WHERE id=1307768503922724864 AND type='mysql';",1),
            ("DELETE FROM de_template_version WHERE version='985188400292302848';",1)]
        for statement, expected in changes:
            result = session.query(statement + " SELECT JSON_OBJECT('affected',ROW_COUNT());")
            check(result == [{'affected':expected}], 'CLONE_DELETE_ROWCOUNT_MISMATCH')
        zero = session.query("SELECT JSON_OBJECT('sources',(SELECT COUNT(*) FROM core_datasource),'engines',(SELECT COUNT(*) FROM core_de_engine),'marker',(SELECT COUNT(*) FROM de_template_version WHERE version='985188400292302848')); ")[0]
        check(zero == {'sources':0,'engines':0,'marker':0}, 'CLONE_PRECOMMIT_MISMATCH')
        check(table_hashes(TARGET, sorted(counts)) == before_hashes, 'PROTECTED_FIXTURE_CHANGED')
        commit_state = 'sent_unconfirmed'
        session.query('COMMIT;', commit=True)
        commit_state = 'confirmed'
    except BaseException as error:
        main_error = error
        if commit_state == 'not_sent':
            try:
                session.query('ROLLBACK;')
            except BaseException:
                pass
        raise
    finally:
        try:
            session.close()
        except BaseException:
            if main_error is None:
                raise
    check(table_hashes(TARGET, sorted(counts)) == before_hashes, 'POSTCOMMIT_PROTECTED_FIXTURE_CHANGED')
    check(scalar('SELECT COUNT(*) FROM core_datasource', TARGET) == '0', 'POSTCOMMIT_SOURCE_MISMATCH')
    check(scalar('SELECT COUNT(*) FROM core_de_engine', TARGET) == '0', 'POSTCOMMIT_ENGINE_MISMATCH')
    check(scalar("SELECT COUNT(*) FROM de_template_version WHERE version='985188400292302848'", TARGET) == '0', 'POSTCOMMIT_MARKER_MISMATCH')
    shutil.copyfile(TOOLS / 'watch_runtime-r001.py', ROOT / 'watch_runtime.py')
    result = {'started_at':started,'ended_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'root':str(ROOT),'source_schema':SOURCE,'target_schema':TARGET,'schema_created':True,
        'dump_sha256':digest(dump_file),'dump_table_rows':counts,'table_counts_equal':True,
        'source_ddl_before_after_equal':None,'source_current_ddl_matches_frozen_dump':True,'ddl_evidence_limit':'r002 before/after equality guard executed but raw snapshots not persisted; r003 binds current source CREATE definitions to frozen dump instead, no historical reconstruction','protected_table_hashes_before_after_equal':True,
        'protected_table_hashes':before_hashes,'fixture_fields':19,'fixture_table_id':'7520739241744142336',
        'metadata_delta':{'deleted_sources':['985188400292302848','1308230587517112320'],
            'deleted_engine':'1307768503922724864','deleted_demo_marker':'985188400292302848',
            'rowcounts':[2,1,1],'commit_state':commit_state},
        'config_path':str(config_file),'config_sha256':digest(config_file),
        'private_modes':{'root':'0700','config':'0600','dump':'0600','substitule':'0600'},
        'application_started':False,'read_model_verification':'NEXT_STEP_BEFORE_START',
        'watchdog_simulation':'separate evidence','claim':'仅新schema准备；未读写原元库/服务，未启动Spring，真实连接身份待正常重建后验证'}
    (EVIDENCE / 'SymbolicFreshPreparation-r004.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'prepared':True,'table_count':len(counts),'metadata_delta_rowcounts':[2,1,1],
                      'commit_state':commit_state,'app_started':False},ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except BaseException as error:
        if ROOT.exists():
            (ROOT / 'prepare-failure-r004.json').write_text(json.dumps({'type':type(error).__name__,
                'reason':str(error) if isinstance(error,RuntimeError) else 'DETAILS_REDACTED',
                'at':datetime.datetime.now(datetime.timezone.utc).isoformat()},indent=2)+'\n')
        print(json.dumps({'prepared':False,'reason':str(error) if isinstance(error,RuntimeError) else 'DETAILS_REDACTED'},ensure_ascii=False))
        raise SystemExit(1)
