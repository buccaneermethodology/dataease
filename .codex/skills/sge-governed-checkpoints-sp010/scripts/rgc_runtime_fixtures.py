"""本地 fixtures 来源工具；当前 lane 不拥有 worker / fault 执行权限。"""
import os
from pathlib import Path
from rgc_runtime_consumer import ConsumerError, canonical, sha, read_ref, read_bytes, immutable
from rgc_runtime_observer import process_identity
_LOADED_PATH=Path(__file__).absolute()
_LOADED_SHA=sha(_LOADED_PATH.read_bytes())
def loaded_source_identity(): return {'path':str(_LOADED_PATH),'sha256':_LOADED_SHA}
class FixtureExecutor:
    def __init__(self,driver): self.driver=driver
    def run_bounded_registered_worker(self,spec_ref):
        read_ref(self.driver.root,spec_ref)
        raise ConsumerError('LOCAL_PHASE_WORKER_DISABLED')
    def inject_private_fault(self,spec_ref):
        read_ref(self.driver.root,spec_ref)
        raise ConsumerError('P4_INDEPENDENT_ENTRY_REQUIRED_FAULT_DISABLED')
    def collect_os_and_effect_sources(self,owned_ref):
        import json
        owned=json.loads(read_ref(self.driver.root,owned_ref))
        if owned['run_id'] != self.driver.run_id or owned.get('quarantined'): raise ConsumerError('RESOURCE_NOT_OWNED')
        result=[]
        for key in owned['resources']:
            entry=self.driver.owned.assert_owned(key)
            if entry['kind']=='file': result.append({'resource':key,'sha256':sha(read_bytes(self.driver.root,entry['identity']))})
            elif entry['kind']=='pid': result.append({'resource':key,'process_identity':process_identity(entry['identity'])})
        return {'run_id':self.driver.run_id,'samples':result,'worker_started':False,'runtime_acceptance':'not_evaluated'}

# A fixed process program, not arbitrary shell/code execution. The parent owns
# argv, pipes, OS generation, wait status and source registration.
import json
import sys
import time
import subprocess
MODES=frozenset({'new_finding','new_artifact','new_code_delta','new_decision','new_blocker','next_action_convergence','new_command_result','new_test_result','status_only','long_control'})

def validate_worker_spec(driver,spec_ref):
    spec=json.loads(read_ref(driver.root,spec_ref))
    required={'mode','unit_id','action_token','input_refs','open_item_ref','deadline_seconds','output_path'}
    if set(spec)!=required or spec['mode'] not in MODES or type(spec['unit_id']) is not int or not 1<=spec['unit_id']<=128 or spec['action_token'] not in {driver.token,getattr(driver,'_worker_action_token',None)}:raise ConsumerError('WORKER_SPEC_NOT_CLOSED')
    if type(spec['deadline_seconds']) not in {int,float} or not 0<spec['deadline_seconds']<=720:raise ConsumerError('WORKER_DEADLINE_INVALID')
    if not isinstance(spec['input_refs'],list) or not spec['input_refs']:raise ConsumerError('WORKER_INPUTS_REQUIRED')
    for r in spec['input_refs']:read_ref(driver.root,r)
    opened=json.loads(read_ref(driver.root,spec['open_item_ref']))
    if spec['unit_id'] not in opened.get('open_unit_ids',[]):raise ConsumerError('WORKER_UNIT_NOT_OPEN')
    from rgc_runtime_consumer import confined
    output=confined(driver.root,spec['output_path'])
    if output.exists():raise ConsumerError('WORKER_OUTPUT_ALREADY_EXISTS')
    return spec

def worker_compute(root,spec):
    """Fixed bounded fixture output. Its self-report is never progress authority."""
    mode=spec['mode'];inputs=[read_ref(root,r) for r in spec['input_refs']]
    if mode=='new_finding':
        facts=json.loads(inputs[0])
        if set(facts)!={'left','right'} or any(type(facts[k]) is not int for k in facts):raise ConsumerError('FINDING_INPUT_INVALID')
        return canonical({'sum':facts['left']+facts['right']})
    if mode=='new_artifact':return inputs[0]+b'\nowned fixture artifact\n'
    if mode=='new_code_delta':return inputs[0]+b'\n# private fixture code delta\n'
    if mode=='new_decision':
        basis=json.loads(inputs[0])
        if not {'candidate_actions','scope_id'}<=set(basis) or not basis['candidate_actions']:raise ConsumerError('DECISION_BASIS_INVALID')
        return canonical({'decision':basis['candidate_actions'][0],'basis_refs':spec['input_refs'],'unit_id':spec['unit_id'],'scope_id':basis['scope_id']})
    if mode=='new_blocker':
        dependency=json.loads(inputs[0])
        if dependency.get('satisfied') is not False or not dependency.get('dependency_id'):raise ConsumerError('BLOCKER_DEPENDENCY_INVALID')
        return canonical({'dependency_ids':[dependency['dependency_id']],'basis_refs':spec['input_refs'],'unit_id':spec['unit_id']})
    if mode=='next_action_convergence':
        old=json.loads(inputs[0])
        if not {'candidate_actions','scope_id'}<=set(old) or not old['candidate_actions']:raise ConsumerError('CONVERGENCE_BASIS_INVALID')
        return canonical({'next_action':old['candidate_actions'][0],'scope_id':old['scope_id'],'basis_refs':spec['input_refs']})
    if mode=='new_test_result':
        facts=json.loads(inputs[0]);passed=type(facts.get('left')) is int and type(facts.get('right')) is int
        return canonical({'case_input_ref':spec['input_refs'][0],'case_input_sha256':sha(inputs[0]),'computed_sum':facts['left']+facts['right'] if passed else None,'test_passed':passed})
    if mode=='new_command_result':return canonical({'input_sha256':sha(inputs[0]),'byte_count':len(inputs[0])})
    if mode in {'status_only','long_control'}:return canonical({'state':'running','meaningful':False})
    raise ConsumerError('WORKER_MODE_UNKNOWN')

def _run_registered_worker(self,spec_ref,*,capability=None):
    # Local refuses before reading malformed spec: zero actuator guaranteed.
    if capability is None:raise ConsumerError('LOCAL_PHASE_WORKER_DISABLED')
    self.driver.require_runtime_capability(capability)
    spec=validate_worker_spec(self.driver,spec_ref)
    from rgc_runtime_driver import OwnedProcessBoundary
    owned=getattr(self.driver,'worker_processes',None)
    if owned is None:owned=OwnedProcessBoundary(self.driver,capability);self.driver.worker_processes=owned
    argv=[str(Path(sys.executable).resolve()),str(Path(__file__).resolve()),'--worker-mode',spec['mode'],'--root',str(self.driver.root),'--spec-ref',json.dumps(spec_ref,sort_keys=True)]
    before=time.monotonic_ns()
    process=owned.launch(argv,cwd=str(self.driver.repo),stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=False,bufsize=0,writable=True)
    identity=process_identity(process.pid)
    try:stdout,stderr=process.communicate(timeout=spec['deadline_seconds'])
    except subprocess.TimeoutExpired:
        termination=owned.terminate_owned('pid:'+str(process.pid));raise ConsumerError('WORKER_DEADLINE_EXCEEDED')
    from rgc_runtime_consumer import confined
    outcome={'spec_ref':spec_ref,'pid':process.pid,'process_identity_at_launch':identity,'actual_exit_code':process.returncode,'stdout_sha256':sha(stdout),'stderr_sha256':sha(stderr),'stdout_byte_length':len(stdout),'stderr_byte_length':len(stderr),'start_ns':before,'end_ns':time.monotonic_ns(),'action_token':spec['action_token'],'unit_id':spec['unit_id'],'output_ref':None,'dispatch_authority':False}
    if process.returncode==0:
        output=confined(self.driver.root,spec['output_path'])
        outcome['output_ref']={'path':str(output),'sha256':sha(read_bytes(self.driver.root,output))}
    receipt=immutable(self.driver.root,self.driver.root/'creation'/(str(process.pid)+'.wait.json'),canonical(outcome))
    observer_ref=self.driver.observer.capture_worker_execution(owned,'pid:'+str(process.pid),spec_ref,receipt) if outcome['output_ref'] is not None else None
    owned.terminate_owned('pid:'+str(process.pid))
    return {'wait_receipt_ref':receipt,'worker_outcome':outcome,'observer_execution_ref':observer_ref,'progress_acceptance':'requires_source_registered_delta_and_open_item_roundtrip'}
FixtureExecutor.run_bounded_registered_worker=_run_registered_worker

def _validate_fault_spec(self,spec_ref,*,capability=None):
    if capability is None:raise ConsumerError('P4_INDEPENDENT_ENTRY_REQUIRED_FAULT_DISABLED')
    self.driver.require_runtime_capability(capability)
    if capability.phase!='P4_actual_runtime_only':raise ConsumerError('P4_INDEPENDENT_ENTRY_REQUIRED_FAULT_DISABLED')
    spec=json.loads(read_ref(self.driver.root,spec_ref))
    if set(spec)!={'fault_id','actors','sink','max_seconds','nonce'} or spec['fault_id']!='FI-F4-DOUBLE-WRITE' or spec['actors']!=['FI-F4-A','FI-F4-B'] or spec['sink']!='private-fixtures/fault-v7/FI-F4-DOUBLE-WRITE/effect.jsonl' or type(spec['max_seconds']) is not int or not 0<spec['max_seconds']<=120 or not isinstance(spec['nonce'],str) or not spec['nonce']:raise ConsumerError('FAULT_SPEC_NOT_EXACT_APPROVED')
    # F4 must never reuse normal owner capability; reserved isolated actor
    # process path and independent fault observer are an explicit remaining slice.
    raise ConsumerError('F4_ISOLATED_ACTOR_CAPABILITY_REQUIRED_FAULT_DISABLED')
FixtureExecutor.inject_private_fault=_validate_fault_spec


def _verify_child_launch(root):
    import execution_admission
    first=sys.stdin.buffer.readline()
    if not first:raise ConsumerError('CHILD_CREATION_HANDSHAKE_REQUIRED')
    handshake=json.loads(first)
    if set(handshake)!={'creation_request_ref'}:raise ConsumerError('CHILD_CREATION_HANDSHAKE_NOT_CLOSED')
    request=json.loads(read_ref(root,handshake['creation_request_ref']))
    if request['creator_process_identity']!=process_identity(os.getppid()):raise ConsumerError('CHILD_PARENT_GENERATION_DRIFT')
    argv=[str(Path(sys.executable).resolve()),str(Path(__file__).resolve())]+sys.argv[1:]
    if request['argv_sha256']!=sha(canonical(argv)):raise ConsumerError('CHILD_ACTUAL_ARGV_DRIFT')
    repo=Path(__file__).resolve().parents[4]
    admission=json.loads(read_ref(repo,request['admission_ref']))
    result=execution_admission.validate(admission,repo,expected_action='builder',expected_target='SP-010/P3')
    topology=json.loads(read_ref(repo,result['references']['topology']))
    if topology.get('host_enabled') is not True or topology.get('phase') not in {'P3_actual_runtime_only','P4_actual_runtime_only'}:raise ConsumerError('CHILD_RUNTIME_PHASE_NOT_ADMITTED')
    return request

def _worker_main():
    import argparse
    from rgc_runtime_consumer import confined
    parser=argparse.ArgumentParser();parser.add_argument('--worker-mode',choices=sorted(MODES),required=True);parser.add_argument('--root',type=Path,required=True);parser.add_argument('--spec-ref',required=True)
    args=parser.parse_args();root=args.root.absolute();_verify_child_launch(root);ref=json.loads(args.spec_ref);spec=json.loads(read_ref(root,ref))
    if spec['mode']!=args.worker_mode:raise ConsumerError('WORKER_MODE_BINDING_DRIFT')
    if spec['mode']=='long_control':run_long_worker(root,spec)
    elif spec['mode']=='status_only':
        deadline=time.monotonic()+spec['deadline_seconds']
        while time.monotonic()<deadline:
            sys.stdout.buffer.write(canonical({'state':'running','unit_id':spec['unit_id'],'action_token':spec['action_token'],'meaningful':False})+b'\n');sys.stdout.buffer.flush()
            time.sleep(min(1,max(0,deadline-time.monotonic())))
    result=worker_compute(root,spec)
    output=confined(root,spec['output_path'])
    immutable(root,output,result)
    sys.stdout.buffer.write(canonical({'output_sha256':sha(result),'byte_count':len(result)})+b'\n');sys.stdout.buffer.flush()
    return 0


import uuid

def validate_f4_spec(driver,spec_ref):
    spec=json.loads(read_ref(driver.root,spec_ref))
    if set(spec)!={'fault_id','actors','sink','max_seconds','nonce'} or spec['fault_id']!='FI-F4-DOUBLE-WRITE' or spec['actors']!=['FI-F4-A','FI-F4-B'] or spec['sink']!='private-fixtures/fault-v7/FI-F4-DOUBLE-WRITE/effect.jsonl' or type(spec['max_seconds']) is not int or not 0<spec['max_seconds']<=120 or not isinstance(spec['nonce'],str) or not spec['nonce']:raise ConsumerError('FAULT_SPEC_NOT_EXACT_APPROVED')
    return spec

def _fault_actor_main(actor,root,spec_ref):
    from rgc_runtime_consumer import opened,confined
    request=_verify_child_launch(root)
    spec=json.loads(read_ref(root,spec_ref))
    if actor not in {'FI-F4-A','FI-F4-B'} or spec.get('actors')!=['FI-F4-A','FI-F4-B'] or spec.get('sink')!='private-fixtures/fault-v7/FI-F4-DOUBLE-WRITE/effect.jsonl' or not 0<spec.get('max_seconds',0)<=120:raise ConsumerError('FAULT_ACTOR_NOT_APPROVED')
    received=sys.stdin.buffer.readline().strip().decode()
    if received!=spec['nonce']:raise ConsumerError('FAULT_NONCE_MISMATCH')
    sink=confined(root,Path(root)/spec['sink']);start=time.monotonic_ns()
    with opened(root,sink,os.O_WRONLY|os.O_CREAT|os.O_APPEND) as fd:
        payload=canonical({'fixed_fault_payload':'same-effect'})
        entry={'kind':'effect','generation':spec['nonce'],'logical_effect_id':'FI-F4-SAME-EFFECT','payload_sha256':sha(payload),'actor':actor,'pid':os.getpid(),'observed_monotonic_ns':time.monotonic_ns()}
        os.write(fd,canonical(entry)+b'\n');os.fsync(fd)
        sys.stdout.buffer.write(canonical({'actor':actor,'pid':os.getpid(),'nonce':received,'opened_ns':start,'write_ns':entry['observed_monotonic_ns']})+b'\n');sys.stdout.buffer.flush()
        deadline=time.monotonic()+spec['max_seconds']
        while time.monotonic()<deadline:time.sleep(min(0.2,max(0,deadline-time.monotonic())))
        sys.stdout.buffer.write(canonical({'actor':actor,'closed_ns':time.monotonic_ns()})+b'\n');sys.stdout.buffer.flush()
    return 0

def _inject_f4(self,spec_ref,*,capability=None):
    from rgc_runtime_driver import OwnedProcessBoundary
    from rgc_runtime_consumer import confined
    if capability is None:raise ConsumerError('P4_INDEPENDENT_ENTRY_REQUIRED_FAULT_DISABLED')
    self.driver.require_runtime_capability(capability)
    if capability.phase!='P4_actual_runtime_only':raise ConsumerError('P4_INDEPENDENT_ENTRY_REQUIRED_FAULT_DISABLED')
    spec=validate_f4_spec(self.driver,spec_ref);sink=confined(self.driver.root,self.driver.root/spec['sink'])
    if sink.exists():raise ConsumerError('FAULT_SINK_ALREADY_EXISTS')
    sink.parent.mkdir(parents=True,exist_ok=True)
    boundary=OwnedProcessBoundary(self.driver,capability);self.driver.fault_processes=boundary
    actors=[];first=[];start=time.monotonic_ns()
    try:
        for actor in spec['actors']:
            argv=[str(Path(sys.executable).resolve()),str(Path(__file__).resolve()),'--fault-actor-mode',actor,'--root',str(self.driver.root),'--fault-spec-ref',json.dumps(spec_ref,sort_keys=True)]
            process=boundary.launch(argv,cwd=str(self.driver.repo),stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=False,bufsize=0,writable=False)
            process.stdin.write(spec['nonce'].encode()+b'\n');process.stdin.flush();actors.append((actor,process))
        # These live OS samples are independent of actor's JSON stdout claims.
        live=[{'actor':actor,'pid':process.pid,'process_identity':process_identity(process.pid),'sampled_ns':time.monotonic_ns()} for actor,process in actors]
        for actor,process in actors:
            import selectors
            selector=selectors.DefaultSelector();selector.register(process.stdout,selectors.EVENT_READ)
            try:
                if not selector.select(timeout=min(5,spec['max_seconds'])):raise ConsumerError('FAULT_ACTOR_HANDSHAKE_TIMEOUT')
                line=process.stdout.readline();message=json.loads(line)
            finally:selector.close()
            if message['actor']!=actor or message['pid']!=process.pid or message['nonce']!=spec['nonce']:raise ConsumerError('FAULT_ACTOR_HANDSHAKE_MISMATCH')
            first.append(message)
        observed=time.monotonic_ns()
        for _,process in actors:
            if process.poll() is not None:raise ConsumerError('FAULT_OVERLAP_NOT_OBSERVED')
            if process_identity(process.pid)!=boundary.proofs['pid:'+str(process.pid)]['identity']:raise ConsumerError('FAULT_ACTOR_PID_DRIFT')
        raw_sink=read_bytes(self.driver.root,sink);effects=[json.loads(line) for line in raw_sink.splitlines()]
        if {e.get('actor') for e in effects}!={'FI-F4-A','FI-F4-B'} or len(effects)!=2:raise ConsumerError('FAULT_WRITES_NOT_OBSERVED')
        closures=[]
        for actor,process in actors:
            remaining=max(0.01,spec['max_seconds']+5-(time.monotonic_ns()-start)/1e9)
            rest,stderr=process.communicate(timeout=remaining)
            rows=[json.loads(line) for line in rest.splitlines()]
            if process.returncode!=0 or len(rows)!=1 or rows[0].get('actor')!=actor or type(rows[0].get('closed_ns')) is not int:raise ConsumerError('FAULT_ACTOR_EXIT_UNKNOWN')
            closures.append({'actor':actor,'actual_exit_code':process.returncode,'closed_ns':rows[0]['closed_ns'],'stderr_sha256':sha(stderr)})
        observed_receipt={'actual_actor_closures':closures,'spec_ref':spec_ref,'observer_ns':observed,'live_os_samples':live,'actual_pipe_handshakes':first,'sink_sha256':sha(raw_sink),'effect_rows':effects,'normal_owner_limit':1,'fault_actor_namespace':spec['nonce'],'runtime_acceptance':'requires_independent_fault_validation'}
        result_ref=immutable(self.driver.root,self.driver.root/'creation'/(uuid.uuid4().hex+'.f4-observed.json'),canonical(observed_receipt))
        sink_ref=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.actual-f4-sink.jsonl'),raw_sink)
        index=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.actual-f4-index.json'),canonical({'raw_sink_ref':sink_ref,'entries':effects}))
        capabilities=[];challenges=[]
        for message in first:
            actor=message['actor'];process=next(p for a,p in actors if a==actor);proof=boundary.proofs['pid:'+str(process.pid)]
            nonce_ref=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.actual-f4-nonce.json'),canonical(message))
            ending=next(row for row in closures if row['actor']==actor)
            close_ref=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.actual-f4-exit.json'),canonical({'actual_exit_code':process.returncode,'closed_ns':ending['closed_ns'],'creation_proof_ref':proof['proof_ref'],'pid':process.pid,'reaped':process.poll() is not None}))
            capabilities.append({'actor':actor,'pid':process.pid,'nonce':message['nonce'],'opened_ns':message['opened_ns'],'closed_ns':ending['closed_ns'],'creation_proof_ref':proof['proof_ref'],'nonce_ipc_ref':nonce_ref,'fd_close_ref':close_ref})
            challenges.append({'actor':actor,'nonce':spec['nonce'],'actual_pipe_handshake_ref':nonce_ref})
        caps=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.actual-f4-capabilities.json'),canonical({'nonce_challenges':challenges,'live_capabilities':capabilities,'actual_live_os_samples':live,'overlap_observed_ns':observed,'fault_namespace':spec['nonce']}))
        lease=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.fault-observation-store.json'),self.driver.resume_store.path.read_bytes())
        self.driver.capture_bound_event('guard_sink','ownership_sample',canonical({'observation_ref':result_ref,'raw_sink_ref':sink_ref}),lambda ref:{'lease_ref':lease,'write_capability_ref':caps,'effect_index_ref':index},None)
        return {'fault_observation_ref':result_ref,'fault_observed':True,'dispatch_authority':False}
    finally:
        # Normal authority is revoked before cleanup by caller; these handles are
        # isolated fault resources and always quarantined on receipt or error.
        for _,process in actors:
            boundary.terminate_owned('pid:'+str(process.pid))
FixtureExecutor.inject_private_fault=_inject_f4

def _start_async_worker(self,spec_ref,*,capability=None):
    if capability is None:raise ConsumerError('LOCAL_PHASE_WORKER_DISABLED')
    self.driver.require_runtime_capability(capability);spec=validate_worker_spec(self.driver,spec_ref)
    from rgc_runtime_driver import OwnedProcessBoundary
    boundary=getattr(self.driver,'worker_processes',None)
    if boundary is None:boundary=OwnedProcessBoundary(self.driver,capability);self.driver.worker_processes=boundary
    argv=[str(Path(sys.executable).resolve()),str(Path(__file__).resolve()),'--worker-mode',spec['mode'],'--root',str(self.driver.root),'--spec-ref',json.dumps(spec_ref,sort_keys=True)]
    process=boundary.launch(argv,cwd=str(self.driver.repo),stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=False,bufsize=0,writable=True)
    return {'spec_ref':spec_ref,'key':'pid:'+str(process.pid),'pid':process.pid,'process_identity':process_identity(process.pid),'started_ns':time.monotonic_ns(),'boundary':boundary,'handle':process}
FixtureExecutor.start_bounded_registered_worker=_start_async_worker


def _sample_async_worker(self,worker):
    import selectors
    if worker['boundary'] is not self.driver.worker_processes or worker['boundary'].handles.get(worker['key']) is not worker['handle']:raise ConsumerError('WORKER_HANDLE_NOT_OWNED')
    process=worker['handle'];identity=process_identity(process.pid)
    if identity!=worker['process_identity'] or process.poll() is not None:raise ConsumerError('WORKER_GENERATION_NOT_RUNNING')
    selector=selectors.DefaultSelector();selector.register(process.stdout,selectors.EVENT_READ)
    try:
        if not selector.select(timeout=1):raise ConsumerError('WORKER_IPC_NOT_OBSERVED')
        raw=process.stdout.readline()
    finally:selector.close()
    value=json.loads(raw);spec=json.loads(read_ref(self.driver.root,worker['spec_ref']))
    if value.get('state')!='running' or value.get('action_token')!=spec['action_token'] or value.get('unit_id')!=spec['unit_id']:raise ConsumerError('WORKER_IPC_BINDING_DRIFT')
    ipc=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.worker-ipc.json'),raw)
    launches=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.worker-launches.json'),canonical([{'pid':int(k.split(':')[1]),'creation_proof_ref':v['proof_ref']} for k,v in worker['boundary'].proofs.items()]))
    sample=immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.worker-os.json'),canonical({'owned_launch_journal_ref':launches,'creation_proof_ref':worker['boundary'].proofs[worker['key']]['proof_ref'],'stdout_fd_open':not process.stdout.closed,'pid':process.pid,'process_identity':identity,'observed_monotonic_ns':time.monotonic_ns(),'executor_inventory':[{'pid':process.pid}],'ipc_ref':ipc,'action_token':spec['action_token']}))
    result={'os_sample_ref':sample,'ipc_ref':ipc,'pid':process.pid,'process_start_identity':identity,'observed_ns':time.monotonic_ns()}
    self.driver.capture_bound_event('os_sampler','worker_sample',read_ref(self.driver.root,sample),lambda ref:{'pid':process.pid,'process_start_identity':identity,'os_sample_ref':ref,'ipc_ref':ipc},spec['action_token'])
    return result
FixtureExecutor.sample_bounded_worker=_sample_async_worker


LONG_STAGE_KINDS=('new_finding','new_command_result','new_artifact','new_code_delta','new_test_result','new_decision','new_blocker','next_action_convergence')
LONG_STAGE_OFFSETS=(30,90,150,210,270,330,390,450)

def long_stage_specs(root,spec):
    manifest=json.loads(read_ref(root,spec['input_refs'][0]))
    if set(manifest)!={'stage_spec_refs'} or len(manifest['stage_spec_refs'])!=8:raise ConsumerError('LONG_EIGHT_STAGE_SOURCES_REQUIRED')
    stages=[]
    for kind,reference in zip(LONG_STAGE_KINDS,manifest['stage_spec_refs']):
        stage=json.loads(read_ref(root,reference))
        if set(stage)!=set(spec) or stage['mode']!=kind or stage['unit_id']!=spec['unit_id'] or stage['action_token']!=spec['action_token']:raise ConsumerError('LONG_STAGE_SPEC_BINDING_DRIFT')
        for source in stage['input_refs']+[stage['open_item_ref']]:read_ref(root,source)
        if stage['unit_id'] not in json.loads(read_ref(root,stage['open_item_ref']))['open_unit_ids']:raise ConsumerError('LONG_STAGE_UNIT_NOT_OPEN')
        if not 0<stage['deadline_seconds']<=spec['deadline_seconds']:raise ConsumerError('LONG_STAGE_DEADLINE_DRIFT')
        stages.append((reference,stage))
    return stages

def run_long_worker(root,spec):
    from rgc_runtime_consumer import confined
    stages=long_stage_specs(root,spec)
    if spec['deadline_seconds']!=600:raise ConsumerError('LONG_CONTROL_DEADLINE_NOT_FIXED')
    started=time.monotonic();index=0
    while time.monotonic()-started<spec['deadline_seconds']:
        payload={'state':'running','unit_id':spec['unit_id'],'action_token':spec['action_token'],'meaningful':False}
        if index<len(stages) and time.monotonic()-started>=LONG_STAGE_OFFSETS[index]:
            ref,stage=stages[index];raw=worker_compute(root,stage);output_ref=immutable(root,confined(root,stage['output_path']),raw)
            payload.update(stage_index=index,stage_spec_ref=ref,stage_output_ref=output_ref)
            index+=1
        sys.stdout.buffer.write(canonical(payload)+b'\n');sys.stdout.buffer.flush();time.sleep(1)
    if index!=8:raise ConsumerError('LONG_STAGES_INCOMPLETE')
    return stages

if __name__=='__main__':
    if '--fault-actor-mode' in sys.argv:
        import argparse
        parser=argparse.ArgumentParser();parser.add_argument('--fault-actor-mode',choices=['FI-F4-A','FI-F4-B'],required=True);parser.add_argument('--root',type=Path,required=True);parser.add_argument('--fault-spec-ref',required=True)
        args=parser.parse_args();sys.exit(_fault_actor_main(args.fault_actor_mode,args.root.absolute(),json.loads(args.fault_spec_ref)))
    sys.exit(_worker_main())
