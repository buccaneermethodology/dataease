"""本地 L1/L2 运行驱动。phase 准入前绝不启动 host 或 fault worker。"""
from __future__ import annotations
import copy
import json
import os
import time
import uuid
import sys
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from rgc_runtime_consumer import ConsumerError, canonical, sha, confined, read_ref, read_bytes, immutable, DurableState, OwnedResourceLedger
from rgc_runtime_observer import RuntimeObserver, process_identity, validate_loaded_manifest
import execution_admission
from rgc_runtime_consumer import admitted_topology, validate_current_package, validate_p3_prerequisite, validate_inherited_budget, CURRENT_HOST_ROUTE

_LOADED_PATH=Path(__file__).absolute()
_LOADED_SHA=sha(_LOADED_PATH.read_bytes())

def loaded_source_identity(): return {'path':str(_LOADED_PATH),'sha256':_LOADED_SHA}

class RuntimeDriver:
    def __init__(self, repo, source_root, evidence_root, admission_ref, profile_ref, source_manifest_ref):
        self.repo=Path(repo).absolute(); self.root=Path(source_root).absolute(); self.evidence=Path(evidence_root).absolute()
        self.admission_ref=admission_ref; self.profile_ref=profile_ref; self.source_manifest_ref=source_manifest_ref
        self._admit_local()
        read_ref(self.repo,profile_ref); validate_loaded_manifest(self.repo,source_manifest_ref)
        self.root.mkdir(parents=True,exist_ok=True); self.evidence.mkdir(parents=True,exist_ok=True)
        self.run_id=uuid.uuid4().hex; self.producer_id='driver:'+self.run_id
        self.observer_id='observer:'+self.run_id; self.token='action:'+uuid.uuid4().hex; self.fence='fence:'+uuid.uuid4().hex
        self.owned=OwnedResourceLedger(self.root,self.root/'owned.json',self.run_id)
        self.registry_path=self.root/'registry.json'; self.registered=[]; self.events=[]
        self.observer=RuntimeObserver(self.repo,self.root,self.evidence,self.registry_path,profile_ref,source_manifest_ref)
        self.quarantined=False

    def _admit_local(self):
        admission=json.loads(read_ref(self.repo,self.admission_ref))
        result=execution_admission.validate(admission,self.repo,expected_action='builder',expected_target='SP-010/P3')
        context=json.loads(read_ref(self.repo,result['references']['context']))
        topology=json.loads(read_ref(self.repo,result['references']['topology']))
        if topology.get('host_enabled') is not False or topology.get('phase') not in {'L1_L2_local_source_implementation_only','B1_B4_local_repair_only','L2_remaining_local_implementation_only'} or topology.get('canonical_target')!='SP-010/P3' or topology.get('role')!='builder' or context['change_impact'].get('external_side_effect') is not False: raise ConsumerError('LOCAL_PHASE_NOT_BOUND')
        return result

    def register_source(self, origin_path, role):
        self._admit_local()
        if role not in {'driver','store','guard','fixture_controller','observer','classifier','os_sampler'}: raise ConsumerError('LOCAL_SOURCE_ROLE_FORBIDDEN')
        origin=confined(self.root,origin_path); raw=read_bytes(self.root,origin)
        provenance={'run_id':self.run_id,'creator_pid':os.getpid(),'kind':'file','identity':str(origin),'parent':None}
        provenance_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.owned.json'),canonical(provenance))
        existing=self.owned.state.snapshot()['resources'].get('file:'+str(origin))
        if existing is None:self.owned.register_owned_file(origin,None,provenance_ref)
        else:self.owned.assert_owned('file:'+str(origin))
        snapshot=immutable(self.root,self.root/(uuid.uuid4().hex+'.source'),raw)
        receipt={'run_id':self.run_id,'producer_id':self.producer_id,'role':role,'source_ref':snapshot,'creator_pid':os.getpid(),'process_identity':process_identity(os.getpid()),'created_ns':time.monotonic_ns(),'origin_path':str(origin)}
        receipt_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.creator.json'),canonical(receipt))
        self.registered.append({'ref':snapshot,'producer_id':self.producer_id,'role':role,'creator_receipt_ref':receipt_ref})
        return snapshot

    def freeze_registry(self):
        return self._registry_at(self.registry_path)

    def _registry_at(self, registry_path):
        authority=json.loads(read_ref(self.repo,self.profile_ref))['approved_authority']
        owned_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.ledger.json'),read_bytes(self.root,self.owned.state.path))
        registry={'schema_version':'rgc_runtime_source_registry_v20','run_id':self.run_id,'clock_owner_id':self.observer_id,'observer_id':self.observer_id,'observer_process_identity':process_identity(os.getpid()),'registered_sources':self.registered,'current_action_token':self.token,'issued_tokens':[self.token,self.fence],'current_control_revision':0,'current_fencing_token':self.fence,'authority_ref':authority,'owned_ledger_ref':owned_ref}
        self.observer.schema('RuntimeSourceRegistry',registry)
        if registry_path.exists(): raise ConsumerError('REGISTRY_ALREADY_FROZEN')
        return immutable(self.root,registry_path,canonical(registry))

    def issue_registered_progress_receipt(self, delta_ref, open_item_ref):
        """在最终窗口前签发；临时registry不可变，最终registry包含实际观察器收据。"""
        if self.registry_path.exists(): raise ConsumerError('REGISTRY_ALREADY_FROZEN')
        provisional=self.root/(uuid.uuid4().hex+'.progress-registry.json')
        registry_ref=self._registry_at(provisional)
        observer=RuntimeObserver(self.repo,self.root,self.evidence,provisional,self.profile_ref,self.source_manifest_ref)
        observer.observed_executions=copy.deepcopy(getattr(self.observer,"observed_executions",{}))
        issued=observer.issue_progress_receipt(delta_ref,open_item_ref,registry_ref)
        origin=self.root/(uuid.uuid4().hex+'.observer-receipt.json')
        immutable(self.root,origin,read_ref(self.evidence,issued))
        registered=self.register_source(origin,'observer')
        return {'kind':'classifier_receipt','payload':{'source_ref':delta_ref,'receipt_ref':registered,'assessor_source_ref':loaded_source_identity_for_observer()},'source_refs':[delta_ref,registered]}

    def event(self,kind,payload,source_refs=()):
        if self.quarantined: raise ConsumerError('RUN_QUARANTINED')
        event={'schema_version':'rgc_runtime_event_v20','run_id':self.run_id,'sequence':len(self.events)+1,'observed_monotonic_ns':time.monotonic_ns(),'observed_utc':datetime.now(timezone.utc).isoformat(),'clock_owner_id':self.observer_id,'observer_id':self.observer_id,'producer_id':self.producer_id,'action_token':self.token,'kind':kind,'source_refs':list(source_refs),'payload':payload}
        self.observer.schema('RuntimeEvent',event); self.events.append(event);return copy.deepcopy(event)

    def run_local_source_control(self, config_ref):
        self._admit_local(); config=json.loads(read_ref(self.root,config_ref))
        if set(config) != {'operation','event_payloads'} or config['operation'] not in {'detect_failure','runtime_replay'}: raise ConsumerError('LOCAL_CONFIG_NOT_CLOSED')
        from rgc_runtime_consumer import RuntimeNamespaceConsumer
        registry_ref=self.freeze_registry(); self.observer.open_window(registry_ref)
        raw_refs=[s['ref'] for s in self.registered]
        self.event('ingress_open',{'registered_source_refs':raw_refs},raw_refs)
        for item in config['event_payloads']:
            if set(item) != {'kind','payload','source_refs'} or item['kind'] in {'ingress_open','ingress_close','source_gap'}: raise ConsumerError('LOCAL_EVENT_CONFIG_INVALID')
            self.event(item['kind'],item['payload'],item['source_refs'])
        self.event('ingress_close',{'last_sequence':len(self.events)+1,'terminal_reason':'normal'},raw_refs)
        stream_ref=immutable(self.root,self.root/'events.json',canonical(self.events))
        window={'clock_owner_id':self.observer_id,'start_ns':self.events[0]['observed_monotonic_ns'],'end_ns':self.events[-1]['observed_monotonic_ns'],'first_sequence':1,'last_sequence':len(self.events)}
        bundle={'schema_version':'rgc_runtime_source_bundle_v20','run_id':self.run_id,'profile_ref':self.profile_ref,'execution_source_manifest_ref':self.source_manifest_ref,'registry_ref':registry_ref,'observer_source_ref':loaded_source_identity_for_observer(),'event_stream_ref':stream_ref,'raw_sources':raw_refs,'window':window}
        bundle_ref=immutable(self.root,self.root/'bundle.json',canonical(bundle))
        request={'schema_version':'rgc_runtime_request_v20','contract_revision':'P3-runtime-driver-design-v20','context':{'run_id':self.run_id,'profile_ref':self.profile_ref,'current_registry_ref':registry_ref,'execution_source_manifest_ref':self.source_manifest_ref},'parameters':{'source_bundle_ref':bundle_ref,'window':window}}
        consumer=RuntimeNamespaceConsumer(self.observer)
        frozen=consumer.freeze_runtime_invocation(config['operation'],request)
        observed=consumer.consume_runtime_frozen(frozen['audit_ref'])
        return {'audit_ref':frozen['audit_ref'],'observed':observed,'host_enabled':False,'runtime_acceptance':'not_evaluated','dispatch_authority':False}

    def create_budget_ledger(self, state_path):
        from rgc_runtime_consumer import BudgetLedger
        clock=json.loads(read_ref(self.repo,{'path':'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/ClockBudgetAndResources.json','sha256':'c38c20758e39758636985d0edec4e2586718ddae76bbe672b6911fb50363bfae'}))
        runtime_ref=getattr(self,'runtime_admission_ref',None)
        if runtime_ref is not None:
            topology=admitted_topology(self.repo,runtime_ref)
            inherited=validate_inherited_budget(self.repo,topology)
        else:inherited=json.loads(read_ref(self.repo,clock['budget']['inherited_ref']))
        pack=json.loads(read_ref(self.repo,{'path':'Dashboard/Artifacts/Stage-Plan-SP-010/P3_EffectivePreAuthorityExecutionPack_v10.json','sha256':'7bcdfcf5c4bac68be5c0dc07fcd2e5dff0676ce954fd6fc0fa669949b6020f39'}))
        return BudgetLedger(self.root,state_path,pack,inherited)

    def evaluate_action(self, source_refs):
        """真实来源逐项核验；不把 Supervisor 默认 true 作为权限来源。"""
        required={'goal','authority','control','unit','ownership','saved_identity','current_identity','evidence','admission'}
        if set(source_refs) != required: raise ConsumerError('ACTION_SOURCE_SET_INCOMPLETE')
        values={k:json.loads(read_ref(self.root,r)) for k,r in source_refs.items() if k!='admission'}
        admission=json.loads(read_ref(self.repo,source_refs['admission']))
        execution_admission.validate(admission,self.repo,expected_action='builder',expected_target='SP-010/P3')
        g,a,c,u,o,saved,current,e= [values[k] for k in ('goal','authority','control','unit','ownership','saved_identity','current_identity','evidence')]
        def deny(action,reason): return {'eligible':False,'action':action,'reason_codes':[reason],'source_refs':source_refs,'dispatch_authority':False}
        if c.get('paused') is True or c.get('user_intent') in {'control_pause','control_stop','control_cancel','control_goal_change','control_wait_confirm'}: return deny('STOP_USER_CONTROL','USER_PAUSE_ACTIVE')
        if a.get('status') != 'valid_for_requested_action': return deny('BLOCK_AUTHORITY',{'revoked':'AUTHORITY_REVOKED','expired':'AUTHORITY_EXPIRED','scope_mismatch':'AUTHORITY_SCOPE_MISMATCH'}.get(a.get('status'),'AUTHORITY_UNKNOWN'))
        if type(g.get('completion_predicate_satisfied')) is not bool or g.get('state') not in {'active','complete','stopped'}: return deny('REBUILD_STATE','GOAL_STATE_UNKNOWN')
        if g['completion_predicate_satisfied'] or g['state'] != 'active': return deny('STOP_COMPLETE','GOAL_ALREADY_COMPLETE')
        if type(c.get('paused')) is not bool or c.get('user_intent') not in {'none','observation','control_resume'}: return deny('BLOCK_AUTHORITY','CONTROL_STATE_UNKNOWN')
        if any(type(d.get(key)) is not int for d,key in [(a,'revision'),(a,'current_revision'),(c,'revision'),(c,'current_revision')]) or a['revision']!=a['current_revision'] or c['revision']!=c['current_revision']: return deny('BLOCK_AUTHORITY','AUTHORITY_OR_CONTROL_REVISION_STALE')
        if not {'ref'} <= set(e): return deny('REBUILD_STATE','EVIDENCE_UNKNOWN')
        read_ref(self.root,e['ref'])
        actual=self.sample_action_identity(e['ref'])
        if set(saved)!={'repository','runtime','evidence'} or set(current)!=set(saved) or saved!=current or current!=actual: return deny('REBUILD_STATE','IDENTITY_STALE')
        if o.get('state') not in {'absent','same_owner'} or o.get('fencing_token')!=self.fence or o.get('current_fencing_token')!=self.fence: return deny('OBSERVE_EXISTING','OWNERSHIP_UNKNOWN')
        if o['state']=='same_owner' and (o.get('owner_id')!=self.producer_id or o.get('current_owner_id')!=self.producer_id): return deny('OBSERVE_EXISTING','OWNERSHIP_CONFLICT')
        if type(u.get('ready')) is not bool or u.get('state')!='ready' or not u['ready']: return deny('WAIT_UNIT_NOT_READY','UNIT_READINESS_UNKNOWN')
        if not isinstance(u.get('blocking_dependency_ids'),list): return deny('WAIT_DEPENDENCY','DEPENDENCY_STATE_UNKNOWN')
        if u['blocking_dependency_ids']: return deny('WAIT_DEPENDENCY','BLOCKING_DEPENDENCY:'+u['blocking_dependency_ids'][0])
        return {'eligible':True,'action':'ACQUIRE_AND_DISPATCH','reason_codes':['RGC_ELIGIBLE'],'source_refs':source_refs,'dispatch_authority':False}

    def sample_action_identity(self, evidence_ref):
        """只读实际仓库/运行代码/证据；自己的来源与证据目录是显式执行scratch。"""
        def git(*args):
            p=subprocess.run(['git','-C',str(self.repo),*args],capture_output=True,check=False)
            if p.returncode: raise ConsumerError('REPOSITORY_IDENTITY_UNREADABLE')
            return p.stdout
        paths=sorted(set(git('ls-files','--cached','--others','--exclude-standard','-z').split(b'\0'))-{b''})
        inventory=[]
        for rawpath in paths:
            name=os.fsdecode(rawpath);path=self.repo/name
            if any(path.is_relative_to(scratch) for scratch in (self.root,self.evidence)): continue
            if path.is_symlink():value={'kind':'symlink','target':os.readlink(path)}
            elif path.is_file():value={'kind':'file','sha256':sha(path.read_bytes())}
            elif not path.exists():value={'kind':'deleted'}
            else:raise ConsumerError('REPOSITORY_IDENTITY_UNREADABLE')
            inventory.append({'path':name,**value})
        validate_loaded_manifest(self.repo,self.source_manifest_ref)
        runtime={'profile_sha256':sha(read_ref(self.repo,self.profile_ref)),'execution_source_manifest_sha256':sha(read_ref(self.repo,self.source_manifest_ref)),'python_sha256':sha(Path(sys.executable).read_bytes())}
        repository={'head':git('rev-parse','HEAD').decode().strip(),'index_tree_sha256':sha(git('ls-files','--stage','-z')),'worktree_state_sha256':sha(canonical(inventory)),'inventory_count':len(inventory),'execution_scratch_exclusions':[str(self.root),str(self.evidence)]}
        return {'repository':repository,'runtime':runtime,'evidence':{'ref':copy.deepcopy(evidence_ref),'sha256':sha(read_ref(self.root,evidence_ref))}}

    def _runtime_entry(self, runtime_admission_ref=None):
        # Current local bootstrap can never activate host even with a bool passed
        # by config. Future phase requires its independently signed entry package.
        self._admit_local()
        raise ConsumerError('RUNTIME_PHASE_NOT_ADMITTED_HOST_DISABLED')

    def run_p3(self, config_ref, runtime_admission_ref):
        self._runtime_entry(runtime_admission_ref)
    def run_variant(self, approved_row_ref):
        self._runtime_entry()
    def dispatch_host(self, action_ref, audit_ref):
        self._runtime_entry()
    def recover_owned(self, trigger_ref):
        self._runtime_entry()
    def cleanup_owned(self, run_id):
        if run_id != self.run_id: raise ConsumerError('EXTERNAL_RUN')
        self.token='invalidated:'+uuid.uuid4().hex; self.fence='invalidated:'+uuid.uuid4().hex;self.quarantined=True
        result=self.owned.quarantine_owned(run_id)
        return result|{'host_started':False,'worker_started':False,'runtime_acceptance':'not_evaluated'}


def loaded_source_identity_for_observer():
    from rgc_runtime_observer import loaded_source_identity as observer_identity
    return observer_identity()

class ExistingHostAPI:
    """绑定现有 adapter 身份；本地阶段拒绝，不返回模拟 ACK。"""
    METHODS={'start_thread','read_thread','resume_thread','start_turn','steer_turn','interrupt_turn','next_event','close'}
    def __init__(self,driver,adapter):
        from rgc_app_server_adapter import AppServerAdapter
        if type(adapter) is not AppServerAdapter: raise ConsumerError('ADAPTER_SOURCE_NOT_ACTUAL')
        self.driver=driver;self.adapter=adapter
    def call(self,method,*args,**kwargs):
        if method not in self.METHODS: raise ConsumerError('HOST_METHOD_UNKNOWN')
        self.driver._runtime_entry()
        # Unreachable with local phase; no fake success or fallback permitted.
        return getattr(self.adapter,method)(*args,**kwargs)

class RuntimeClock:
    """同进程 generation 的 monotonic；无 elapsed 注入入口。"""
    def __init__(self,capture_journal=None):
        self.process=process_identity(os.getpid());self.start_ns=time.monotonic_ns();self.last_ns=self.start_ns;self.checkpoints={};self.capture_journal=capture_journal
    def tick(self):
        now=time.monotonic_ns()
        if self.process != process_identity(os.getpid()) or now < self.last_ns: raise ConsumerError('CLOCK_OWNER_OR_GAP')
        self.last_ns=now;return (now-self.start_ns)/1e9
    def checkpoint(self,index,turn_id,start_source_ref=None,root=None):
        elapsed=self.tick();observed_start=self.last_ns
        if start_source_ref is not None:
            if type(self.capture_journal) is not CaptureJournal:raise ConsumerError('CHECKPOINT_ACTUAL_START_REQUIRED')
            captured=json.loads(read_ref(root,start_source_ref))
            if start_source_ref not in self.capture_journal.frames or captured['direction']!='client_to_server' or captured['frame_facts'].get('method')!='turn/start':raise ConsumerError('CHECKPOINT_ACTUAL_START_REQUIRED')
            observed_start=captured['observed_monotonic_ns'];elapsed=(observed_start-self.start_ns)/1e9
        if index not in {1,2} or index in self.checkpoints: raise ConsumerError('CHECKPOINT_DUPLICATE_OR_UNKNOWN')
        if index == 1 and not 135 <= elapsed <= 195: raise ConsumerError('CP1_WINDOW')
        if index == 2 and (not 210 <= elapsed < 270 or not self.checkpoints.get(1,{}).get('quiescent_ns')): raise ConsumerError('CP2_ORDER_OR_WINDOW')
        self.checkpoints[index]={'turn_id':turn_id,'start_ns':observed_start,'quiescent_ns':None}
    def quiescent(self,index,turn_id,actual_terminal_ref,root):
        receipt=json.loads(read_ref(root,actual_terminal_ref));cp=self.checkpoints.get(index)
        if not cp or cp['turn_id']!=turn_id or type(self.capture_journal) is not CaptureJournal:raise ConsumerError('QUIESCENCE_NOT_OBSERVED')
        actual=self.capture_journal.terminal_binding(receipt.get('thread_id'),turn_id)
        if receipt!=actual or not actual.get('action_token'):raise ConsumerError('QUIESCENCE_NOT_OBSERVED')
        elapsed=self.tick()
        if elapsed>(210 if index==1 else 270):raise ConsumerError('QUIESCENCE_LATE')
        cp['quiescent_ns']=self.last_ns
    def route(self):
        elapsed=self.tick()
        if elapsed >= 330: return 'ROW_BUDGET_EXHAUSTED'
        if 1 in self.checkpoints and not self.checkpoints[1]['quiescent_ns']:
            return 'INTERRUPT_CHECKPOINT' if elapsed >= 195 else 'WAIT_CHECKPOINT'
        if 2 in self.checkpoints and not self.checkpoints[2]['quiescent_ns']: return 'WAIT_CHECKPOINT' if elapsed < 270 else 'QUARANTINE_CHECKPOINT'
        if 2 in self.checkpoints and self.checkpoints[2]['quiescent_ns'] and elapsed >= 270: return 'RECOVERY_REQUIRES_FRESH_PREDICATE'
        return 'OBSERVE'

# L2 production bridges. Local admission never creates a runtime capability.
import threading
from dataclasses import dataclass

@dataclass(frozen=True)
class _PhaseCapability:
    driver_identity: int
    admission_ref: dict
    phase: str
    source_manifest_ref: dict
    nonce: str

class CaptureJournal:
    """Capture the actual adapter raw boundary, including internally consumed ACKs.

    The original redacting writer remains authoritative for public journals.
    Frame facts retain only known lifecycle fields; unknown payloads have hashes.
    """
    def __init__(self, driver, adapter, delegate, send_guard):
        self.driver=driver; self.adapter=adapter; self.delegate=delegate
        self.send_guard=send_guard; self.frames=[]; self.requests={}; self.lock=threading.RLock()
        self.last_sequence=0; self.gap=False; self.context=None
        self.directory=confined(driver.root,driver.root/'capture'/adapter.session_id);self.directory.mkdir(parents=True,exist_ok=True)
        self.last_sequence=getattr(adapter,'last_sequence',0)
    @staticmethod
    def safe_frame(frame):
        from rgc_app_server_adapter import IDENTIFIER_RE
        def identifier(value):
            return value if isinstance(value,str) and IDENTIFIER_RE.fullmatch(value) else None
        known={'turn/start','turn/steer','turn/interrupt','thread/read','thread/start','thread/resume','initialize','initialized','model/list','account/read','turn/started','turn/completed','thread/status/changed','thread/started','item/started','item/completed','error'}
        result={}
        if frame.get('jsonrpc')=='2.0':result['jsonrpc']='2.0'
        if type(frame.get('id')) is int or identifier(frame.get('id')):result['id']=frame['id']
        if frame.get('method') in known:result['method']=frame['method']
        params=frame.get('params',{}); body=frame.get('result',{})
        method=frame.get('method')
        if method in {'turn/start','turn/steer','turn/interrupt','thread/read'}:
            result['params']={k:v for k,v in params.items() if k in {'threadId','turnId','expectedTurnId','includeTurns'} and (type(v) is bool or identifier(v))}
        elif method in {'turn/started','turn/completed'}:
            t=params.get('turn',{})
            result['params']={'threadId':identifier(params.get('threadId')),'turn':{'id':identifier(t.get('id')),'status':t.get('status') if t.get('status') in {'inProgress','completed','interrupted','failed'} else None,'items':[]}}
        elif method=='thread/status/changed':
            result['params']={'threadId':identifier(params.get('threadId')),'status':{'type':params.get('status',{}).get('type') if params.get('status',{}).get('type') in {'idle','active','notLoaded','systemError'} else None}}
        elif isinstance(body,dict):
            if isinstance(body.get('turn'),dict):
                t=body['turn'];result['result']={'turn':{'id':identifier(t.get('id')),'status':t.get('status') if t.get('status') in {'inProgress','completed','interrupted','failed'} else None,'items':[]}}
            elif isinstance(body.get('thread'),dict):
                t=body['thread'];turns=t.get('turns');result['result']={'thread':{'id':identifier(t.get('id')),'status':{'type':t.get('status',{}).get('type') if isinstance(t.get('status'),dict) and t['status'].get('type') in {'idle','active','notLoaded','systemError'} else None},'turns':[{'id':identifier(x.get('id')),'status':x.get('status') if x.get('status') in {'inProgress','completed','interrupted','failed'} else None} for x in turns] if isinstance(turns,list) else None}}
        return result
    def raw(self, *, sequence, direction, frame, raw_bytes):
        with self.lock:
            if sequence!=self.last_sequence+1: self.gap=True; raise ConsumerError('ADAPTER_CAPTURE_SEQUENCE_GAP')
            if direction=='client_to_server' and frame.get('method') in {'turn/start','turn/steer','turn/interrupt'}:
                self.send_guard(frame,self.context)
            facts=self.safe_frame(frame)
            row={'adapter_session_id':self.adapter.session_id,'adapter_sequence':sequence,'direction':direction,'frame_sha256':sha(raw_bytes),'frame_byte_length':len(raw_bytes),'frame_facts':facts,'observed_monotonic_ns':time.monotonic_ns(),'sensitive_content_retained':False}
            facts_ref=immutable(self.driver.root,self.directory/('%08d.frame.json'%sequence),canonical(facts))
            row['frame_source_ref']=facts_ref
            ref=immutable(self.driver.root,self.directory/('%08d.json'%sequence),canonical(row))
            self.frames.append(ref);self.last_sequence=sequence
            if direction=='client_to_server' and 'id' in frame and 'method' in frame:
                self.requests[frame['id']]={'method':frame['method'],'ref':ref,'frame_ref':facts_ref,'context':self.context}
            self.delegate.raw(sequence=sequence,direction=direction,frame=frame,raw_bytes=raw_bytes)
            if getattr(self.driver,'row_capture',None) is not None:self.driver.capture_host_boundary(row,facts_ref,self.context)
    def normalized(self,value): self.delegate.normalized(value)
    def terminal_binding(self,thread_id,turn_id,after_sequence=0):
        with self.lock:
            rows=[json.loads(read_ref(self.driver.root,r)) for r in self.frames]
        terminals=[r for r in rows if r['adapter_sequence']>after_sequence and r['direction']=='server_to_client' and r['frame_facts'].get('method')=='turn/completed' and r['frame_facts'].get('params',{}).get('threadId')==thread_id and r['frame_facts'].get('params',{}).get('turn',{}).get('id')==turn_id and r['frame_facts']['params']['turn'].get('status') in {'completed','interrupted','failed'}]
        if self.gap or len(terminals)!=1: raise ConsumerError('QUIESCENCE_NOT_OBSERVED')
        terminal=terminals[0]
        starts=[r for r in rows if r['adapter_sequence']<terminal['adapter_sequence'] and r['direction']=='client_to_server' and r['frame_facts'].get('method')=='turn/start' and r['frame_facts'].get('params',{}).get('threadId')==thread_id]
        bound=[]
        for start in starts:
            replies=[r for r in rows if start['adapter_sequence']<r['adapter_sequence']<terminal['adapter_sequence'] and r['direction']=='server_to_client' and r['frame_facts'].get('id')==start['frame_facts'].get('id') and r['frame_facts'].get('result',{}).get('turn',{}).get('id')==turn_id]
            if len(replies)==1:bound.append((start,replies[0]))
        if len(bound)!=1:raise ConsumerError('QUIESCENCE_START_BINDING_UNKNOWN')
        start,reply=bound[0];issued=self.requests[start['frame_facts']['id']].get('context')
        matching=[]
        for r in rows:
            t=r['frame_facts'].get('result',{}).get('thread',{})
            req=self.requests.get(r['frame_facts'].get('id'),{})
            if r['adapter_sequence']>terminal['adapter_sequence'] and req.get('method')=='thread/read' and t.get('id')==thread_id and t.get('status',{}).get('type')=='idle':
                turns=t.get('turns')
                if isinstance(turns,list) and all(x.get('status') in {'completed','interrupted','failed'} for x in turns) and len([x for x in turns if x.get('id')==turn_id and x.get('status')==terminal['frame_facts']['params']['turn']['status']])==1: matching.append(r)
        if len(matching)!=1: raise ConsumerError('QUIESCENCE_READBACK_UNKNOWN')
        readback=matching[0]
        if any(r['adapter_sequence']>readback['adapter_sequence'] and r['frame_facts'].get('method')=='turn/start' and r['frame_facts'].get('params',{}).get('threadId')==thread_id for r in rows):raise ConsumerError('QUIESCENCE_LATE_RESTART')
        return {'action_token':issued.action_token if issued is not None else None,'start_request_sequence':start['adapter_sequence'],'start_response_sequence':reply['adapter_sequence'],'thread_id':thread_id,'turn_id':turn_id,'adapter_session_id':self.adapter.session_id,'status':terminal['frame_facts']['params']['turn']['status'],'terminal_sequence':terminal['adapter_sequence'],'readback_sequence':readback['adapter_sequence'],'dispatch_authority':False}

class FencedSupervisorBridge:
    """Fresh driver facts guard the existing Supervisor at the physical send hook."""
    def __init__(self,driver,store_path,adapter,source_refs,capability):
        from rgc_supervisor import Supervisor
        from rgc_resume_store import ResumeStore
        self.driver=driver;self.source_refs=source_refs;self.capability=capability
        self.store=ResumeStore(confined(driver.root,store_path));self.lock=threading.RLock()
        self.sent=[];self.snapshots=[]
        self.adapter=adapter
        for dirname in ("guard","store"):confined(driver.root,driver.root/dirname).mkdir(exist_ok=True)
        if type(adapter.journal) is CaptureJournal:
            self.journal=adapter.journal;self.journal.send_guard=self.guard_send
        else:self.journal=CaptureJournal(driver,adapter,adapter.journal,self.guard_send)
        adapter.journal=self.journal
        def facts():
            driver.require_runtime_capability(capability)
            observed=driver.evaluate_action(self.source_refs)
            if observed['eligible'] is not True:raise ConsumerError('CONTINUATION_INELIGIBLE:'+','.join(observed['reason_codes']))
            return observed
        def authority():
            facts();a=json.loads(read_ref(driver.root,self.source_refs['authority']))
            return {**a,'status':'valid_for_action','status_source_namespace':'valid_for_requested_action'}
        def runtime():facts();return {'identity_fresh':True}
        def repository():facts();return {'identity_fresh':True}
        def admission():return driver.require_runtime_capability(capability)
        self.supervisor=Supervisor(store_path=self.store.path,adapter=adapter,owner_id=driver.producer_id,authority_reader=authority,runtime_reader=runtime,repository_reader=repository,admission_reader=admission)
    def guard_send(self,frame,context):
        with self.lock:
            self.driver.require_runtime_capability(self.capability)
            if context is None:raise ConsumerError('SEND_CONTEXT_REQUIRED')
            context.validate();record=self.store.read();a=json.loads(read_ref(self.driver.root,self.source_refs['authority']))
            if not record['continuation']['eligible'] or record['continuation'].get('stop_reason'):raise ConsumerError('USER_PAUSE_ACTIVE')
            checks={'authority':a.get('status')=='valid_for_requested_action' and a.get('revision')==context.authority_revision and a.get('revision')==a.get('current_revision'),'control':record['goal_binding']['control_revision']==context.control_revision,'token':record['continuation']['action_token']==context.action_token,'record':record['record_revision']==context.record_revision,'request':sha(canonical({'method':frame['method'],'params':frame['params']}))==context.request_sha256}
            action=record['idempotency_state']['logical_actions'].get(context.logical_action_id,{})
            checks['started']=action.get('execution_state')=='started'
            lease=record['executor_lease']
            checks['fence']=lease.get('fencing_token')==self.driver.fence and lease.get('state')=='active' and lease.get('owner_id')==self.driver.producer_id
            if not all(checks.values()):raise ConsumerError('PRE_SEND_GUARD_FAILED:'+','.join(k for k,v in checks.items() if not v))
            current=self.driver.evaluate_action(self.source_refs)
            if not current['eligible']:raise ConsumerError('PRE_SEND_CONTINUATION_INELIGIBLE')
            ref=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.json'),canonical({'request_sha256':context.request_sha256,'logical_action_id':context.logical_action_id,'control_revision':context.control_revision,'record_revision':context.record_revision,'action_token':context.action_token,'checks':checks,'store_sha256':sha(self.store.path.read_bytes()),'observed_monotonic_ns':time.monotonic_ns()}))
            self.sent.append(ref)
    def drain(self,ingress):
        with self.lock:
            for item in ingress:self.supervisor.enqueue(item['category'],item['kind'],item.get('payload',{}))
            result=self.supervisor.drain_batch()
            self.snapshots.append(immutable(self.driver.root,self.driver.root/'store'/(uuid.uuid4().hex+'.json'),self.store.path.read_bytes()))
            return result
    def dispatch(self,**kwargs):
        with self.lock:
            self.driver.require_runtime_capability(self.capability)
            self.journal.context=None
            # Supervisor creates RequestContext internally; guarded adapter shim keeps
            # its original transport implementations intact.
            adapter=self.adapter
            class Guarded:
                def __getattr__(_,name):return getattr(adapter,name)
                def start_turn(_,params,context):self.journal.context=context;return adapter.start_turn(params,context)
                def steer_turn(_,params,context):self.journal.context=context;return adapter.steer_turn(params,context)
                def interrupt_turn(_,params,context):self.journal.context=context;return adapter.interrupt_turn(params,context)
            self.supervisor.adapter=Guarded()
            before=len(self.sent)
            try:result=self.supervisor.dispatch_authorized_action(**kwargs)
            except Exception:
                self.driver.quarantined=True
                raise
            finally:self.journal.context=None
            return {**result,'actual_guarded_send_count':len(self.sent)-before,'send_receipt_refs':self.sent[before:]}


def _admit_runtime(self,runtime_admission_ref=None):
    self._admit_local()
    if runtime_admission_ref is None:raise ConsumerError('RUNTIME_PHASE_NOT_ADMITTED_HOST_DISABLED')
    try:
        admission=json.loads(read_ref(self.repo,runtime_admission_ref))
        valid=execution_admission.validate(admission,self.repo,expected_action='builder',expected_target='SP-010/P3')
    except (ValueError,KeyError,TypeError) as exc:
        raise ConsumerError('RUNTIME_PHASE_NOT_ADMITTED_HOST_DISABLED') from exc
    topo=json.loads(read_ref(self.repo,valid['references']['topology']))
    context=json.loads(read_ref(self.repo,valid['references']['context']))
    if topo.get('host_enabled') is not True or topo.get('phase') not in {'P3_actual_runtime_only','P4_actual_runtime_only'} or context['change_impact'].get('external_side_effect') is not True:raise ConsumerError('RUNTIME_PHASE_NOT_ADMITTED_HOST_DISABLED')
    # Runtime topology must pin source freeze AND independent Validation/Semantic.
    required={'execution_source_manifest_ref','independent_validation_ref','pre_runtime_semantic_ref','authority_ref','profile_ref'}
    if not required<=set(topo):raise ConsumerError('RUNTIME_PHASE_REVIEWS_REQUIRED_HOST_DISABLED')
    if topo['execution_source_manifest_ref']!=self.source_manifest_ref or topo['profile_ref']!=self.profile_ref:raise ConsumerError('RUNTIME_PHASE_SOURCE_OR_PROFILE_DRIFT_HOST_DISABLED')
    validate_loaded_manifest(self.repo,self.source_manifest_ref)
    for k in required:read_ref(self.repo,topo[k])
    _validate_runtime_reviews(self,topo)
    if topo.get('host_binding_route')==CURRENT_HOST_ROUTE:
        validate_current_package(self.repo,topo,self.profile_ref,self.source_manifest_ref,live=True)
        validate_inherited_budget(self.repo,topo)
    validate_p3_prerequisite(self.repo,topo,self.producer_id)
    self.runtime_admission_ref=copy.deepcopy(runtime_admission_ref)
    phase=_PhaseCapability(id(self),copy.deepcopy(runtime_admission_ref),topo['phase'],copy.deepcopy(self.source_manifest_ref),uuid.uuid4().hex)
    self._runtime_capability=phase
    return phase

def _require_runtime_environment(self,capability):
    if type(capability) is not _PhaseCapability or getattr(self,'_runtime_capability',None) is not capability or capability.driver_identity!=id(self) or self.quarantined:raise ConsumerError('RUNTIME_CAPABILITY_INVALID_HOST_DISABLED')
    admission=json.loads(read_ref(self.repo,capability.admission_ref));result=execution_admission.validate(admission,self.repo,expected_action='builder',expected_target='SP-010/P3')
    topo=json.loads(read_ref(self.repo,result['references']['topology']))
    if topo.get('host_enabled') is not True or topo.get('phase')!=capability.phase or topo.get('execution_source_manifest_ref')!=self.source_manifest_ref:raise ConsumerError('RUNTIME_CAPABILITY_STALE_HOST_DISABLED')
    for k in ('independent_validation_ref','pre_runtime_semantic_ref','authority_ref','profile_ref'):read_ref(self.repo,topo[k])
    _validate_runtime_reviews(self,topo)
    if topo.get('host_binding_route')==CURRENT_HOST_ROUTE:
        validate_current_package(self.repo,topo,self.profile_ref,self.source_manifest_ref,live=True)
        validate_inherited_budget(self.repo,topo)
    validate_p3_prerequisite(self.repo,topo,self.producer_id)
    validate_loaded_manifest(self.repo,self.source_manifest_ref)
    return result
def _require_runtime_capability(self,capability):
    result=self.require_runtime_environment(capability)
    topology=json.loads(read_ref(self.repo,result['references']['topology']))
    validate_current_package(self.repo,topology,self.profile_ref,self.source_manifest_ref,live=True)
    validate_inherited_budget(self.repo,topology)
    if hasattr(self,'resume_store'):
        record=self.resume_store.read()
        if not record['continuation']['eligible'] or record['continuation'].get('stop_reason'):raise ConsumerError('USER_PAUSE_ACTIVE')
    return result
RuntimeDriver.require_runtime_environment=_require_runtime_environment
RuntimeDriver._runtime_entry=_admit_runtime
RuntimeDriver.require_runtime_capability=_require_runtime_capability


def _prepare_variant(self,approved_row_ref):
    from rgc_runtime_consumer import pointer
    row=json.loads(read_ref(self.repo,approved_row_ref))
    matrix_path=self.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/VariantMatrix.json'
    variants=json.loads(matrix_path.read_bytes())['variants']
    matches=[v for v in variants if v['approved_row']==row]
    if len(matches)!=1:raise ConsumerError('ROW_NOT_EXACT_APPROVED')
    mapping=matches[0]
    approved=json.loads(read_ref(self.repo,{k:v for k,v in mapping['source'].items() if k!='json_pointer'}))
    if pointer(approved,mapping['source']['json_pointer'])!=row:raise ConsumerError('APPROVED_ROW_SOURCE_DRIFT')
    actions=json.loads((matrix_path.parent/'ActionMatrix.json').read_bytes())['actions']
    bound=[a for a in actions if a['approved_action']['logical_action_id'] in mapping['logical_action_ids']]
    if len(bound)!=len(mapping['logical_action_ids']) or any(a['approved_action']['variant_id']!=row['variant_id'] for a in bound):raise ConsumerError('ACTION_ROW_BINDING_INVALID')
    return {'approved_row':row,'actions':bound,'mapping_ids':mapping['mapping_ids'],'host_started':False,'runtime_acceptance':'not_evaluated','dispatch_authority':False}
RuntimeDriver.prepare_variant=_prepare_variant


def _api_call(self,method,*args,**kwargs):
    if method not in self.METHODS:raise ConsumerError('HOST_METHOD_UNKNOWN')
    capability=kwargs.pop('capability',None)
    self.driver.require_runtime_capability(capability)
    if method in {'start_turn','steer_turn','interrupt_turn'}:raise ConsumerError('SUPERVISOR_DISPATCH_REQUIRED')
    if method in {'read_thread','resume_thread','next_event','close'}:
        if method in {'read_thread','resume_thread'}:
            ident=args[0] if method=='read_thread' else args[0].get('threadId')
            self.driver.owned.assert_owned('thread:'+str(ident))
        elif method=='close' and self.adapter.process:
            self.driver.owned.assert_owned('pid:'+str(self.adapter.process.pid))
    return getattr(self.adapter,method)(*args,**kwargs)
ExistingHostAPI.call=_api_call

class CheckpointSchedulerBridge:
    """One row clock; CP ACK cannot establish quiescence or reset worker time."""
    def __init__(self,driver,clock,budget,bridge,worker_key,worker_token):
        self.driver=driver;self.clock=clock;self.budget=budget;self.bridge=bridge
        self.worker_key=worker_key;self.worker_token=worker_token;self.worker_started_ns=None
        self.cp={};self.interrupted=set();self.closed=False
    def start_worker(self,launch):
        elapsed=self.clock.tick()
        if elapsed<15 or self.worker_started_ns is not None:raise ConsumerError('WORKER_START_WINDOW')
        self.worker_started_ns=self.clock.last_ns
        return launch()
    def checkpoint(self,index,dispatch):
        elapsed=self.clock.tick()
        if self.closed or index in self.cp:raise ConsumerError('CHECKPOINT_DUPLICATE_OR_CLOSED')
        if index==1 and not 135<=elapsed<195:raise ConsumerError('CP1_WINDOW')
        if index==2:
            if not 210<=elapsed<270 or not self.cp.get(1,{}).get('quiescence_ref'):raise ConsumerError('CP2_ORDER_OR_WINDOW')
            self.budget.reserve_supplemental_subaction('P3-CHECKPOINT-START-01','P3-CHECKPOINT-START-01:sub:CP2',{'threads':0,'turn_starts':1,'wall_clock_seconds':0},self.budget.remaining())
        if index not in {1,2}:raise ConsumerError('CHECKPOINT_UNKNOWN')
        result=dispatch(index)
        if not result.get('thread_id') or not result.get('turn_id'):raise ConsumerError('CHECKPOINT_ACK_BINDING_UNKNOWN')
        self.cp[index]={**result,'started_ns':self.clock.last_ns,'quiescence_ref':None}
        return result
    def observe_quiescence(self,index):
        cp=self.cp.get(index)
        if cp is None:raise ConsumerError('CHECKPOINT_NOT_STARTED')
        elapsed=self.clock.tick();deadline=210 if index==1 else 270
        if elapsed>deadline:raise ConsumerError('CHECKPOINT_QUIESCENCE_LATE')
        binding=self.bridge.journal.terminal_binding(cp['thread_id'],cp['turn_id'],cp.get('after_sequence',0))
        ref=immutable(self.driver.root,self.driver.root/'quiescence'/(uuid.uuid4().hex+'.json'),canonical(binding))
        cp['quiescence_ref']=ref;return ref
    def route(self,interrupt):
        elapsed=self.clock.tick()
        if elapsed>=330:self.closed=True;return 'ROW_BUDGET_EXHAUSTED'
        if self.worker_started_ns is None:return 'WAIT_WORKER_START'
        if 1 in self.cp and not self.cp[1]['quiescence_ref']:
            if elapsed>=210:self.closed=True;return 'QUARANTINE_CP1'
            if elapsed>=195 and 1 not in self.interrupted:
                interrupt(self.cp[1]);self.interrupted.add(1);return 'INTERRUPT_CP1'
            return 'WAIT_CP1'
        if 2 in self.cp and not self.cp[2]['quiescence_ref']:
            if elapsed>=270:self.closed=True;return 'QUARANTINE_CP2'
            return 'WAIT_CP2'
        if 2 in self.cp and self.cp[2]['quiescence_ref'] and (self.clock.last_ns-self.worker_started_ns)>=255*10**9:return 'DIAGNOSE_WITH_FRESH_PREDICATE'
        return 'OBSERVE'

class OwnedProcessBoundary:
    """A creator owns actual Popen handles, not caller-supplied PID labels."""
    def __init__(self,driver,capability):
        self.driver=driver;self.capability=capability;self.handles={};self.proofs={}
        confined(driver.root,driver.root/'creation').mkdir(exist_ok=True)
    def launch(self,argv,*,cwd,stdin,stdout,stderr,text,bufsize,writable=False):
        self.driver.require_runtime_capability(self.capability)
        if not isinstance(argv,list) or not argv or Path(cwd).absolute()!=self.driver.repo:raise ConsumerError('OWNED_LAUNCH_INVALID')
        profile=json.loads(read_ref(self.driver.repo,self.driver.profile_ref))
        host=[str(Path(profile['actual_executable']['path']).resolve()),'app-server','--stdio']
        worker=[str(Path(sys.executable).resolve()),str(Path(__file__).with_name('rgc_runtime_fixtures.py').resolve()),'--worker-mode']
        if argv!=host:
            if len(argv)!=8 or argv[:2]!=worker[:2] or argv[4]!='--root' or argv[5]!=str(self.driver.root):raise ConsumerError('OWNED_ARGV_NOT_ALLOWLISTED')
            if argv[2]=='--fault-actor-mode':
                if self.capability.phase!='P4_actual_runtime_only' or argv[6]!='--fault-spec-ref' or writable:raise ConsumerError('F4_ISOLATED_PHASE_REQUIRED')
                from rgc_runtime_fixtures import validate_f4_spec
                spec=validate_f4_spec(self.driver,json.loads(argv[7]))
                if argv[3] not in spec['actors']:raise ConsumerError('F4_ACTOR_NOT_APPROVED')
            else:
                if argv[:3]!=worker or argv[6]!='--spec-ref':raise ConsumerError('OWNED_ARGV_NOT_ALLOWLISTED')
                from rgc_runtime_fixtures import validate_worker_spec
                spec=validate_worker_spec(self.driver,json.loads(argv[7]))
                if argv[3]!=spec['mode']:raise ConsumerError('OWNED_WORKER_MODE_DRIFT')
        nonce=uuid.uuid4().hex
        req={'run_id':self.driver.run_id,'nonce':nonce,'creator_process_identity':process_identity(os.getpid()),'admission_ref':self.capability.admission_ref,'argv_sha256':sha(canonical(argv)),'executable_sha256':sha(Path(argv[0]).read_bytes()),'requested_monotonic_ns':time.monotonic_ns()}
        req_ref=immutable(self.driver.root,self.driver.root/'creation'/(nonce+'.request.json'),canonical(req))
        process=subprocess.Popen(argv,cwd=cwd,stdin=stdin,stdout=stdout,stderr=stderr,text=text,bufsize=bufsize)
        identity=process_identity(process.pid)
        proof={'request_ref':req_ref,'process_identity':identity,'pid':process.pid,'creator_pid':os.getpid(),'created_monotonic_ns':time.monotonic_ns(),'parent_observed':True}
        # actual ps identity includes PID/PPID/start generation; verify parent.
        identity_fields=str(identity).split()
        if str(os.getpid()) not in identity_fields[:2]:
            self.driver.quarantined=True;raise ConsumerError('OWNED_PROCESS_PARENT_UNKNOWN')
        proof_ref=immutable(self.driver.root,self.driver.root/'creation'/(nonce+'.response.json'),canonical(proof))
        projection={'run_id':self.driver.run_id,'creator_pid':os.getpid(),'kind':'pid','identity':process.pid,'parent':None}
        provenance_ref=immutable(self.driver.root,self.driver.root/'creation'/(nonce+'.ledger.json'),canonical(projection))
        key=self.driver.owned.register_owned_pid(process.pid,None,provenance_ref,writable=writable)
        self.handles[key]=process;self.proofs[key]={'identity':identity,'request_ref':req_ref,'proof_ref':proof_ref}
        if argv!=host:
            process.stdin.write(canonical({'creation_request_ref':req_ref})+b'\n');process.stdin.flush()
        return process
    def terminate_owned(self,key):
        if key not in self.handles or key not in self.proofs:raise ConsumerError('OWNED_HANDLE_REQUIRED')
        process=self.handles[key];proof=self.proofs[key]
        if process.poll() is None:
            if process_identity(process.pid)!=proof['identity']:raise ConsumerError('OWNED_PID_GENERATION_DRIFT')
            process.terminate()
            try:process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                if process_identity(process.pid)!=proof['identity']:raise ConsumerError('OWNED_PID_GENERATION_DRIFT')
                process.kill();process.wait(timeout=5)
        for stream in (process.stdin,process.stdout,process.stderr):
            if stream is not None:stream.close()
        with self.driver.owned.state.edit() as state:
            if key not in state['resources']:raise ConsumerError('OWNED_RESOURCE_DISAPPEARED')
            state['resources'][key]['writable']=False;state['resources'][key]['quarantined']=True
        return {'key':key,'exit_code':process.returncode,'creation_proof_ref':proof['proof_ref'],'quarantined':True}


def _start_host(self,capability):
    from rgc_app_server_adapter import AppServerAdapter,RuntimeProfile
    self.require_runtime_capability(capability)
    profile=json.loads(read_ref(self.repo,self.profile_ref));binary=profile['actual_executable'];protocol=profile['protocol']['codex_app_server_protocol.v2.schemas.json']
    for reference in (binary,protocol):
        if sha(Path(reference['path']).read_bytes())!=reference['sha256']:raise ConsumerError('ACTUAL_PROFILE_IDENTITY_DRIFT')
    owned=OwnedProcessBoundary(self,capability)
    adapter=AppServerAdapter(raw_journal=self.root/'raw.jsonl',normalized_journal=self.root/'normalized.jsonl',process_factory=owned.launch)
    journal=CaptureJournal(self,adapter,adapter.journal,lambda frame,context:(_ for _ in ()).throw(ConsumerError('SUPERVISOR_DISPATCH_REQUIRED')))
    adapter.journal=journal
    actual=RuntimeProfile(binary['path'],binary['sha256'],protocol['path'],protocol['sha256'],profile['cwd'],required_model_id='gpt-6-astra')
    adapter.start(actual);adapter.require_model('gpt-6-astra')
    account=adapter._request('account/read',{'refreshToken':False})
    expected=profile['account_identity_non_sensitive']
    # Account contents are not retained; exact approved non-sensitive response hash.
    if sha(canonical(account))!=expected['response_sha256']:raise ConsumerError('ACCOUNT_IDENTITY_DRIFT')
    self.host=adapter;self.host_processes=owned;self.capture_journal=journal
    return ExistingHostAPI(self,adapter)
RuntimeDriver.start_host=_start_host


def _fixed_thread_spec(self):
    profile=json.loads(read_ref(self.repo,self.profile_ref))
    return {'model':profile['model'],'cwd':profile['cwd'],'approvalPolicy':'never','sandbox':'read-only','ephemeral':False}
RuntimeDriver.fixed_thread_spec=_fixed_thread_spec


def _render_fixed_prompt(self,fixture_id,unit_id=None,query_id=None):
    profile=json.loads(read_ref(self.repo,self.profile_ref))
    rows=[r for r in profile['fixture_allowlist'] if r['id']==fixture_id]
    if len(rows)!=1:raise ConsumerError('FIXTURE_NOT_APPROVED')
    row=rows[0];text=row['text']
    if fixture_id=='unit':
        if type(unit_id) is not int or not 1<=unit_id<=128 or query_id is not None:raise ConsumerError('UNIT_NOT_PRE_REGISTERED')
        text=text.replace('{UNIT_ID}',str(unit_id))
    elif fixture_id=='checkpoint':
        if not isinstance(query_id,str) or query_id not in {'CP%02d'%x for x in range(1,129)} or unit_id is not None:raise ConsumerError('QUERY_NOT_PRE_REGISTERED')
        text=text.replace('{QUERY_ID}',query_id)
    elif unit_id is not None or query_id is not None:raise ConsumerError('FIXTURE_FREE_SUBSTITUTION_FORBIDDEN')
    return text
RuntimeDriver.render_fixed_prompt=_render_fixed_prompt

_previous_api_call=ExistingHostAPI.call
def _owned_api_call(self,method,*args,**kwargs):
    if method=='start_thread':
        if len(args)!=1 or args[0]!=self.driver.fixed_thread_spec():raise ConsumerError('THREAD_SPEC_NOT_FIXED_PROFILE')
        self.driver.require_runtime_capability(kwargs.get('capability'))
        if self.adapter.process is None:raise ConsumerError('OWNED_HOST_REQUIRED')
        parent=self.driver.owned.assert_owned('pid:'+str(self.adapter.process.pid))
        request_ref=immutable(self.driver.root,self.driver.root/'creation'/(uuid.uuid4().hex+'.thread-request.json'),canonical({'method':'thread/start','spec':args[0],'parent_pid':self.adapter.process.pid,'adapter_session_id':self.adapter.session_id}))
        result=_previous_api_call(self,method,*args,**kwargs)
        self.driver.validate_protocol_response('ThreadStartResponse',result)
        if result.get('model')!='gpt-6-astra' or result.get('cwd')!=str(self.driver.repo) or result.get('approvalPolicy')!='never' or result.get('sandbox')!={'type':'readOnly'}:raise ConsumerError('ACTUAL_THREAD_PARAMETERS_REJECTED')
        thread_id=result.get('thread',{}).get('id')
        if not isinstance(thread_id,str) or not thread_id:raise ConsumerError('THREAD_CREATION_RESPONSE_UNKNOWN')
        response_ref=immutable(self.driver.root,self.driver.root/'creation'/(uuid.uuid4().hex+'.thread-response.json'),canonical({'request_ref':request_ref,'thread_id':thread_id,'adapter_session_id':self.adapter.session_id,'captured_response_refs':self.adapter.journal.frames[-1:]}))
        proof=immutable(self.driver.root,self.driver.root/'creation'/(uuid.uuid4().hex+'.thread-ledger.json'),canonical({'run_id':self.driver.run_id,'creator_pid':os.getpid(),'kind':'thread','identity':thread_id,'parent':'pid:'+str(self.adapter.process.pid)}))
        self.driver.owned.register_owned_thread(thread_id,'pid:'+str(self.adapter.process.pid),proof)
        return {'thread':result['thread'],'creation_response_ref':response_ref}
    if method=='resume_thread':
        if len(args)!=1 or not isinstance(args[0],dict):raise ConsumerError('RESUME_SPEC_NOT_FIXED')
        spec={k:v for k,v in self.driver.fixed_thread_spec().items() if k!='ephemeral'}
        spec['threadId']=args[0].get('threadId')
        if args[0]!=spec:raise ConsumerError('RESUME_SPEC_NOT_FIXED')
    result=_previous_api_call(self,method,*args,**kwargs)
    if method in {'read_thread','resume_thread'}:self.driver.validate_protocol_response('ThreadReadResponse' if method=='read_thread' else 'ThreadResumeResponse',result)
    return result
ExistingHostAPI.call=_owned_api_call

def _initialize_resume(self,record_ref,source_refs,capability,record_path=None):
    from rgc_resume_store import ResumeStore
    from datetime import timedelta
    self.require_runtime_environment(capability)
    admission=execution_admission.validate(json.loads(read_ref(self.repo,capability.admission_ref)),self.repo,expected_action='builder',expected_target='SP-010/P3')
    record=json.loads(read_ref(self.root,record_ref));goal=admission['references']['goal'];completion=admission['references']['completion_contract']
    binding=record.get('goal_binding',{})
    if binding.get('goal_sha256')!=goal['sha256'] or binding.get('completion_predicate_sha256')!=completion['sha256']:raise ConsumerError('RESUME_GOAL_BINDING_NOT_ACTUAL')
    if record.get('runtime_profile',{}).get('profile_id')!=json.loads(read_ref(self.repo,self.profile_ref))['profile_id']:raise ConsumerError('RESUME_PROFILE_NOT_ACTUAL')
    result=self.evaluate_action(source_refs)
    if not result['eligible']:raise ConsumerError('RESUME_INITIAL_PREDICATE_INELIGIBLE')
    store=ResumeStore(confined(self.root,record_path) if record_path is not None else self.root/'resume.json');store.create(record)
    current=store.read();now=datetime.now(timezone.utc)
    acquired=store.acquire_lease(current['record_revision'],owner_id=self.producer_id,owner_role='builder',issued_at_utc=now.isoformat(),expires_at_utc=(now+timedelta(seconds=330)).isoformat(),control_revision=current['goal_binding']['control_revision'])
    self.fence=acquired['executor_lease']['fencing_token'];self.token=acquired['continuation']['action_token'];self.resume_store=store
    return {'record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.resume.json'),store.path.read_bytes()),'fencing_token':self.fence,'record_revision':acquired['record_revision']}
RuntimeDriver.initialize_resume=_initialize_resume


def _recover_owned_sources(self,trigger_ref,*,capability=None,bridge=None):
    if capability is None:self._runtime_entry()
    self.require_runtime_capability(capability)
    if bridge is None or bridge.driver is not self:raise ConsumerError('RECOVERY_BOUND_BRIDGE_REQUIRED')
    trigger=json.loads(read_ref(self.root,trigger_ref))
    if set(trigger)!={'trigger','last_valid_record_ref','source_refs'} or trigger['trigger'] not in {'turn_interrupted','executor_lost','client_restart','thread_resumed'}:raise ConsumerError('RECOVERY_TRIGGER_NOT_CLOSED')
    sources=trigger['source_refs'];observed=self.evaluate_action(sources)
    if not observed['eligible']:return {**observed,'trigger':trigger['trigger'],'recovery_performed':False}
    previous=json.loads(read_ref(self.root,trigger['last_valid_record_ref']));current=bridge.store.read()
    checks={'goal':previous['goal_binding']['goal_sha256']==current['goal_binding']['goal_sha256'],'authority':previous['goal_binding']['authority_sha256']==current['goal_binding']['authority_sha256'],'control':previous['goal_binding']['control_revision']==current['goal_binding']['control_revision'],'record':previous['record_id']==current['record_id'],'repository':previous['repository']==current['repository'],'runtime':previous['runtime_profile']==current['runtime_profile'],'evidence':previous['last_progress']==current['last_progress'],'next_action':previous['next_action']==current['next_action']}
    receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.recovery-checks.json'),canonical({'trigger_ref':trigger_ref,'checks':checks,'current_record_sha256':sha(bridge.store.path.read_bytes()),'predicate_result':observed,'dispatch_authority':False}))
    if not all(checks.values()):return {'eligible':False,'recovery_performed':False,'reason_codes':['RECOVERY_SOURCE_DRIFT'],'steps_receipt_ref':receipt,'dispatch_authority':False}
    last=current['last_progress'];read_ref(self.root,{'path':last['evidence_ref'],'sha256':last['evidence_sha256']})
    result=bridge.supervisor.restart_reentry('client' if trigger['trigger']=='client_restart' else 'executor',next_action=current['next_action']['action_id'],observed={'goal_sha256':current['goal_binding']['goal_sha256'],'unfinished':True,'last_evidence_verified':True,'owner_conflict':False,'predicate_recomputed':True})
    return {'source_checks':checks,'steps_receipt_ref':receipt,'supervisor_reentry':result,'next_action':current['next_action'],'recovery_performed':False,'dispatch_authority':False,'required':'fresh lease/token/budget and actual dispatch of bound next_action'}
RuntimeDriver.recover_owned=_recover_owned_sources


_previous_cleanup=RuntimeDriver.cleanup_owned
def _cleanup_actual_owned(self,run_id):
    if run_id!=self.run_id:raise ConsumerError('EXTERNAL_RUN')
    # Token revocation occurs before any TERM. Only creator-held matching handles
    # can be touched; missing/reused identities stay quarantined and untouched.
    result=_previous_cleanup(self,run_id);closures=[];gaps=[]
    for owner in (getattr(self,'host_processes',None),getattr(self,'worker_processes',None),getattr(self,'fault_processes',None)):
        if owner is None:continue
        for key in owner.handles:
            try:closures.append(owner.terminate_owned(key))
            except ConsumerError as exc:gaps.append({'resource':key,'reason':str(exc)})
    result.update(owned_closures=closures,cleanup_gaps=gaps,os_termination_performed=bool(closures),runtime_acceptance='not_evaluated')
    return result
RuntimeDriver.cleanup_owned=_cleanup_actual_owned


def _validate_action_spec(self,action_ref):
    action=json.loads(read_ref(self.root,action_ref))
    required={'method','params','logical_action_id','action_token','authority_revision','owner_attempt_token'}
    if set(action)!=required or action['method'] not in {'turn/start','turn/steer','turn/interrupt'}:raise ConsumerError('HOST_ACTION_NOT_CLOSED')
    matrix=json.loads((self.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/ActionMatrix.json').read_bytes())['actions']
    ids=[r['approved_action']['logical_action_id'] for r in matrix]
    logical=action['logical_action_id'];parent=logical.split(':sub:')[0]
    if parent not in ids or ':sub:' in logical and logical!='P3-CHECKPOINT-START-01:sub:CP2':raise ConsumerError('HOST_ACTION_NOT_APPROVED')
    approved=matrix[ids.index(parent)]['approved_action']
    params=action['params'];thread=params.get('threadId')
    self.owned.assert_owned('thread:'+str(thread))
    if action['method']=='turn/interrupt':
        if set(params)!={'threadId','turnId'}:raise ConsumerError('INTERRUPT_PARAMS_NOT_CLOSED')
        self.owned.assert_owned('turn:'+str(params['turnId']))
    else:
        base={'threadId','input'}
        if action['method']=='turn/start':
            if set(params)!=(base|{'model','cwd','approvalPolicy','sandboxPolicy'}) or params['model']!='gpt-6-astra' or params['cwd']!=str(self.repo) or params['approvalPolicy']!='never' or params['sandboxPolicy']!={'type':'readOnly'}:raise ConsumerError('TURN_PROFILE_NOT_FIXED')
        elif set(params)!=(base|{'expectedTurnId'}):raise ConsumerError('STEER_PARAMS_NOT_CLOSED')
        inputs=params['input']
        if not isinstance(inputs,list) or len(inputs)!=1 or set(inputs[0])!={'type','text'} or inputs[0]['type']!='text':raise ConsumerError('FIXTURE_PROMPT_NOT_CLOSED')
        ordinal=ids.index(parent)+1
        allowed=[]
        for fixture in approved['fixture_ids']:
            if fixture in {'success','active_window'}:allowed.append(self.render_fixed_prompt(fixture))
            elif fixture=='unit':allowed.append(self.render_fixed_prompt('unit',unit_id=ordinal))
            elif fixture=='checkpoint':
                row_ids=[r['approved_action']['logical_action_id'] for r in matrix if r['approved_action']['variant_id']==approved['variant_id'] and r['approved_action']['turn_start_charge']==1]
                round_index=2 if ':sub:CP2' in logical or parent in row_ids and row_ids.index(parent)==1 else 1
                allowed.append(self.render_fixed_prompt('checkpoint',query_id=self.checkpoint_query_id(approved,round_index)))
        if inputs[0]['text'] not in allowed:raise ConsumerError('FIXTURE_PROMPT_NOT_APPROVED_FOR_ACTION')
    return action,approved
RuntimeDriver.validate_action_spec=_validate_action_spec


def _dispatch_host_actual(self,action_ref,audit_ref):
    capability=getattr(self,'_runtime_capability',None)
    if capability is None:self._runtime_entry()
    self.require_runtime_capability(capability)
    action,approved=self.validate_action_spec(action_ref)
    audit=json.loads(read_ref(self.root,audit_ref))
    if set(audit)!={'source_refs','approved_action','source_request_sha256'} or audit['approved_action']!=approved or audit['source_request_sha256']!=sha(read_ref(self.root,action_ref)):raise ConsumerError('HOST_ACTION_AUDIT_BINDING_DRIFT')
    if getattr(self,'bridge',None) is None or self.bridge.source_refs!=audit['source_refs']:raise ConsumerError('HOST_BOUND_SUPERVISOR_REQUIRED')
    observed=self.evaluate_action(audit['source_refs'])
    if not observed['eligible']:return {**observed,'host_dispatched':False}
    budget=self.budget
    if ':sub:CP2' in action['logical_action_id']:
        budget.reserve_supplemental_subaction('P3-CHECKPOINT-START-01',action['logical_action_id'],{'threads':0,'turn_starts':1,'wall_clock_seconds':0},budget.remaining())
    else:budget.reserve_and_persist(approved['variant_id'],action['logical_action_id'],budget.remaining(),0)
    dispatch_start=time.monotonic_ns();sends_before=len(self.bridge.sent)
    try:result=self.bridge.dispatch(**action)
    except Exception:
        elapsed=(time.monotonic_ns()-getattr(self,'_row_start_ns',dispatch_start))/1e9
        budget.record_outcome(action['logical_action_id'],'unknown' if len(self.bridge.sent)>sends_before else 'failed',elapsed);raise
    if result.get('dispatch_granted') is True:
        turn=result.get('response',{}).get('turn',{}).get('id')
        if turn:
            proof=immutable(self.root,self.root/'creation'/(uuid.uuid4().hex+'.turn-ledger.json'),canonical({'run_id':self.run_id,'creator_pid':os.getpid(),'kind':'turn','identity':turn,'parent':'thread:'+action['params']['threadId']}))
            self.owned.register_owned_turn(turn,'thread:'+action['params']['threadId'],proof)
        budget.record_outcome(action['logical_action_id'],'succeeded',(time.monotonic_ns()-getattr(self,'_row_start_ns',dispatch_start))/1e9)
    return {**result,'action_ref':action_ref,'audit_ref':audit_ref,'runtime_acceptance':'requires_independent_runtime_validation'}
RuntimeDriver.dispatch_host=_dispatch_host_actual


def _run_variant_actual(self,approved_row_ref):
    capability=getattr(self,'_runtime_capability',None)
    if capability is None:self._runtime_entry()
    self.require_runtime_capability(capability)
    plan=self.prepare_variant(approved_row_ref);row=plan['approved_row']
    if row['phase']=='P3' and capability.phase!='P3_actual_runtime_only' or row['phase']!='P3' and capability.phase!='P4_actual_runtime_only':raise ConsumerError('ROW_PHASE_MISMATCH')
    config=getattr(self,'_phase_config',None)
    if config is None or row['variant_id'] not in config['row_inputs']:raise ConsumerError('ROW_DURABLE_INPUTS_REQUIRED')
    binding=config['row_inputs'][row['variant_id']]
    if set(binding)!={'approved_row_ref','action_refs','audit_refs'} or binding['approved_row_ref']!=approved_row_ref or len(binding['action_refs'])!=len(plan['actions']) or len(binding['audit_refs'])!=len(plan['actions']):raise ConsumerError('ROW_ACTION_INPUTS_NOT_CLOSED')
    results=[]
    for approved,action_ref,audit_ref in zip(plan['actions'],binding['action_refs'],binding['audit_refs']):
        action=json.loads(read_ref(self.root,action_ref))
        if action['logical_action_id']!=approved['approved_action']['logical_action_id']:raise ConsumerError('ROW_ACTION_ORDER_DRIFT')
        results.append(self.dispatch_host(action_ref,audit_ref))
        if not results[-1].get('dispatch_granted'):break
    return {'variant_id':row['variant_id'],'action_results':results,'mapping_ids':plan['mapping_ids'],'runtime_acceptance':'not_evaluated','dispatch_authority':False}
RuntimeDriver.run_variant=_run_variant_actual


def _run_p3_actual(self,config_ref,runtime_admission_ref):
    capability=self._runtime_entry(runtime_admission_ref)
    self.require_runtime_capability(capability)
    config=json.loads(read_ref(self.root,config_ref))
    if set(config)!={'approved_row_refs','row_inputs','source_refs','record_ref'} or not isinstance(config['approved_row_refs'],list) or not isinstance(config['row_inputs'],dict):raise ConsumerError('RUNTIME_CONFIG_NOT_CLOSED')
    # Bind durable exact runtime inputs in the independently reviewed phase
    # topology. Config never supplies model/argv/prompt/allow-host booleans.
    admission=execution_admission.validate(json.loads(read_ref(self.repo,runtime_admission_ref)),self.repo,expected_action='builder',expected_target='SP-010/P3')
    topo=json.loads(read_ref(self.repo,admission['references']['topology']))
    if topo.get('phase_config_ref')!=config_ref:raise ConsumerError('RUNTIME_CONFIG_NOT_PHASE_BOUND')
    self._phase_config=config
    self.budget=self.create_budget_ledger(self.root/'budget.json')
    rows=[]
    try:
        self.initialize_resume(config['record_ref'],config['source_refs'],capability)
        if not config['approved_row_refs']:raise ConsumerError('RUNTIME_ROWS_EMPTY')
        self.reserve_variant_budget(self.prepare_variant(config['approved_row_refs'][0]))
        api=self.start_host(capability)
        self.bridge=FencedSupervisorBridge(self,self.resume_store.path,api.adapter,self.fresh_store_sources(config['source_refs']),capability)
        for position,row_ref in enumerate(config['approved_row_refs']):
            plan=self.prepare_variant(row_ref);name=plan['approved_row']['variant_id']
            row_input=config['row_inputs'].get(name,{})
            if position and name!='R03-TAKEOVER-RECOVERY':
                if not {'record_ref','source_refs'}<=set(row_input):raise ConsumerError('INDEPENDENT_ROW_C0_SOURCES_REQUIRED')
                self.require_runtime_environment(capability)
                self._phase_source_refs=row_input['source_refs']
                self.initialize_resume(row_input['record_ref'],row_input['source_refs'],capability,self.root/(name+'.resume.json'))
                self.bridge=FencedSupervisorBridge(self,self.resume_store.path,self.host,self.fresh_store_sources(row_input['source_refs']),capability)
            elif name=='R03-TAKEOVER-RECOVERY':
                if row_input.get('inherits_record_from')!='R03-TAKEOVER' or not getattr(self,'takeover_handoff_ref',None):raise ConsumerError('TAKEOVER_LAST_VALID_HANDOFF_REQUIRED')
            else:self._phase_source_refs=config['source_refs']
            self._worker_action_token=None
            rows.append(self.run_variant(row_ref))
    finally:cleanup=self.cleanup_owned(self.run_id)
    return {'rows':rows,'cleanup':cleanup,'host_started':True,'runtime_acceptance':'requires_independent_full_14_condition_validation','p3_all_and':False,'dispatch_authority':False}
RuntimeDriver.run_p3=_run_p3_actual


def _validate_runtime_reviews(driver,topology):
    validation=json.loads(read_ref(driver.repo,topology['independent_validation_ref']))
    semantic=json.loads(read_ref(driver.repo,topology['pre_runtime_semantic_ref']))
    for receipt in (validation,semantic):
        if receipt.get('runtime_entry_ready') is not True or receipt.get('sourcefreeze_ref')!=driver.source_manifest_ref or receipt.get('current_contract_blockers')!=[] or not receipt.get('reviewer_source') or receipt.get('dispatch_authority') is not False:
            raise ConsumerError('RUNTIME_INDEPENDENT_ENTRY_NOT_READY_HOST_DISABLED')
        for ref in receipt.get('evidence_refs',[]):read_ref(driver.repo,ref)
    if validation['reviewer_source']==semantic['reviewer_source'] or validation['reviewer_source']==driver.producer_id:raise ConsumerError('RUNTIME_REVIEW_INDEPENDENCE_REQUIRED_HOST_DISABLED')
    profile=json.loads(read_ref(driver.repo,driver.profile_ref))
    if topology['authority_ref']!=profile['approved_authority']:raise ConsumerError('RUNTIME_AUTHORITY_ROOT_MISMATCH_HOST_DISABLED')


def _validate_protocol_response(self,definition,value):
    import jsonschema
    profile=json.loads(read_ref(self.repo,self.profile_ref));ref=profile['protocol']['codex_app_server_protocol.v2.schemas.json'];raw=Path(ref['path']).read_bytes()
    if sha(raw)!=ref['sha256']:raise ConsumerError('ACTUAL_PROTOCOL_IDENTITY_DRIFT')
    bundle=json.loads(raw)
    if definition not in bundle['definitions']:raise ConsumerError('ACTUAL_PROTOCOL_RESPONSE_UNKNOWN')
    schema={'$ref':'#/definitions/'+definition,'definitions':bundle['definitions']}
    try:jsonschema.Draft7Validator(schema).validate(value)
    except jsonschema.ValidationError as exc:raise ConsumerError('ACTUAL_PROTOCOL_RESPONSE_INVALID') from exc
RuntimeDriver.validate_protocol_response=_validate_protocol_response

class PrivateActionQueue:
    """Actual private queue/dispatcher; drop and query faults affect real routing."""
    def __init__(self,driver):
        self.driver=driver;self.pending=[];self.dispatched=[];self.suppressed=[];self.closed=False
    def enqueue(self,action_ref):
        raw=read_ref(self.driver.root,action_ref);self.pending.append(action_ref)
        return immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.queue-received.json'),canonical({'request_sha256':sha(raw),'received_ns':time.monotonic_ns(),'queued_count':len(self.pending)}))
    def drain(self,callback,fault=None):
        if self.closed:raise ConsumerError('PRIVATE_QUEUE_CLOSED')
        if fault not in {None,'F1','F3'}:raise ConsumerError('PRIVATE_QUEUE_FAULT_UNKNOWN')
        result=[]
        while self.pending:
            reference=self.pending.pop(0)
            if fault in {'F1','F3'}:
                self.suppressed.append(reference);result.append({'request_ref':reference,'callback_invoked':False,'cause':fault});continue
            observed=callback(reference);self.dispatched.append(reference);result.append({'request_ref':reference,'callback_invoked':True,'callback_result':observed})
        return immutable(self.driver.root,self.driver.root/(uuid.uuid4().hex+'.queue-drain.json'),canonical({'actual_dispatch_calls':len(self.dispatched),'actual_suppressed_requests':self.suppressed,'results':result,'observed_monotonic_ns':time.monotonic_ns()}))
    def close(self):self.closed=True


def _fresh_store_sources(self,source_refs):
    """Reopen actual state; preserve the independently frozen saved identity."""
    record=self.resume_store.read();result=copy.deepcopy(source_refs)
    control={'paused':not record['continuation']['eligible'],'user_intent':'none' if record['continuation']['eligible'] else 'control_pause','revision':record['goal_binding']['control_revision'],'current_revision':record['goal_binding']['control_revision']}
    lease=record['executor_lease'];ownership={'state':'same_owner' if lease['state']=='active' and lease['owner_id']==self.producer_id else 'conflicting','fencing_token':lease['fencing_token'],'current_fencing_token':lease['fencing_token'],'owner_id':lease['owner_id'],'current_owner_id':lease['owner_id']}
    for name,value in [('control',control),('ownership',ownership)]:result[name]=immutable(self.root,self.root/(uuid.uuid4().hex+'.'+name+'.json'),canonical(value))
    original_authority=json.loads(read_ref(self.root,source_refs['authority']))
    authority={**original_authority,'status':'valid_for_requested_action' if record['goal_binding']['authority_status']=='valid' else record['goal_binding']['authority_status'],'revision':record['goal_binding']['authority_revision'],'current_revision':record['goal_binding']['authority_revision']}
    result['authority']=immutable(self.root,self.root/(uuid.uuid4().hex+'.private-current-authority.json'),canonical(authority))
    evidence=json.loads(read_ref(self.root,source_refs['evidence']))
    last=record['last_progress']
    accepted=getattr(self,'_accepted_progress_refs',{})
    if last['evidence_sha256'] in accepted:
        evidence={'ref':accepted[last['evidence_sha256']]}
        result['evidence']=immutable(self.root,self.root/(uuid.uuid4().hex+'.current-evidence.json'),canonical(evidence))
        saved=json.loads(read_ref(self.root,source_refs['saved_identity']));saved['evidence']={'ref':evidence['ref'],'sha256':evidence['ref']['sha256']}
        result['saved_identity']=immutable(self.root,self.root/(uuid.uuid4().hex+'.last-valid-saved-identity.json'),canonical(saved))
    result['current_identity']=immutable(self.root,self.root/(uuid.uuid4().hex+'.current-identity.json'),canonical(self.sample_action_identity(evidence['ref'])))
    return result
RuntimeDriver.fresh_store_sources=_fresh_store_sources


def _materialize_live_action(self,approved,fixture_id,thread_id,*,method='turn/start',turn_id=None,logical_id=None,checkpoint_index=None):
    matrix=json.loads((self.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/ActionMatrix.json').read_bytes())['actions']
    ids=[a['approved_action']['logical_action_id'] for a in matrix]
    base=approved['logical_action_id'];logical=logical_id or base
    if base not in ids:raise ConsumerError('MATERIALIZED_ACTION_NOT_APPROVED')
    record=self.resume_store.read();ordinal=ids.index(base)+1
    if method=='turn/start':
        token='host:'+logical+':'+uuid.uuid4().hex
        def mint(c):c['continuation'].update(action_token=token,token_control_revision=c['goal_binding']['control_revision'],token_record_revision=c['record_revision']+1)
        record=self.resume_store.compare_and_swap(record['record_revision'],mint,fencing_token=record['executor_lease']['fencing_token'],control_revision=record['goal_binding']['control_revision'])
        self.token=token
    if method=='turn/interrupt':params={'threadId':thread_id,'turnId':turn_id}
    else:
        text=self.render_fixed_prompt(fixture_id,unit_id=ordinal if fixture_id=='unit' else None,query_id=self.checkpoint_query_id(approved,checkpoint_index or (2 if ':sub:CP2' in logical else 1)) if fixture_id=='checkpoint' else None)
        params={'threadId':thread_id,'input':[{'type':'text','text':text}]}
        if method=='turn/start':params.update(model='gpt-6-astra',cwd=str(self.repo),approvalPolicy='never',sandboxPolicy={'type':'readOnly'})
        else:params['expectedTurnId']=turn_id
    action={'method':method,'params':params,'logical_action_id':logical,'action_token':record['continuation']['action_token'],'authority_revision':record['goal_binding']['authority_revision'],'owner_attempt_token':self.producer_id+':'+uuid.uuid4().hex}
    self.bridge.source_refs=self.fresh_store_sources(getattr(self,'_phase_source_refs',self._phase_config['source_refs']))
    action_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.live-action.json'),canonical(action))
    audit_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.live-audit.json'),canonical({'source_refs':self.bridge.source_refs,'approved_action':approved,'source_request_sha256':sha(read_ref(self.root,action_ref))}))
    # Unit correlation belongs to admitted Store issuance metadata, never extra
    # schema-invalid fields inside a host turn/start request.
    issuance={'logical_action_id':logical,'unit_id':ordinal,'fixture_id':fixture_id,'token':action['action_token'],'adapter_session_id':self.host.session_id,'thread_id':thread_id,'action_ref':action_ref,'audit_ref':audit_ref,'record_revision':record['record_revision'],'issued_ns':time.monotonic_ns()}
    issuance_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.issuance.json'),canonical(issuance))
    self.issuances=getattr(self,'issuances',[])+[issuance_ref]
    return action_ref,audit_ref,issuance_ref
RuntimeDriver.materialize_live_action=_materialize_live_action


def _owned_slot(self,slot,capability,create=False):
    self.thread_slots=getattr(self,'thread_slots',{})
    if slot not in self.thread_slots:
        if not create:raise ConsumerError('OWNED_SLOT_NOT_CREATED')
        api=ExistingHostAPI(self,self.host);result=api.call('start_thread',self.fixed_thread_spec(),capability=capability)
        self.thread_slots[slot]=result['thread']['id']
    self.owned.assert_owned('thread:'+self.thread_slots[slot]);return self.thread_slots[slot]
RuntimeDriver.owned_slot=_owned_slot


def _wait_owned_terminal(self,thread,turn,deadline_ns):
    from rgc_app_server_adapter import AdapterError
    while time.monotonic_ns()<deadline_ns:
        try:value=self.host.next_event(deadline_ns/1e9)
        except AdapterError as exc:
            if exc.error_class=='REQUEST_TIMEOUT':break
            raise
        frame=value['frame']
        if 'id' in frame and frame.get('method'):
            self.host.respond_server_request(frame,{'validated':True,'outcome':'deny'})
        params=frame.get('params',{});body=params.get('turn',{})
        if frame.get('method')=='turn/completed' and params.get('threadId')==thread and body.get('id')==turn and body.get('status') in {'completed','interrupted','failed'}:
            ExistingHostAPI(self,self.host).call('read_thread',thread,include_turns=True,capability=self._runtime_capability)
            return self.host.journal.terminal_binding(thread,turn)
    raise ConsumerError('OWNED_TURN_TERMINAL_NOT_OBSERVED')
RuntimeDriver.wait_owned_terminal=_wait_owned_terminal


def _row_control(self,kind):
    before=immutable(self.root,self.root/(uuid.uuid4().hex+'.control-before.json'),self.resume_store.path.read_bytes())
    messages={fixture:self.render_fixed_prompt(fixture) for fixture in ('pause','stop','cancel','wait_confirm','goal_change')}
    receipt=self.bridge.drain([{'category':'control','kind':kind,'payload':{'message':messages[kind]}}])
    after=immutable(self.root,self.root/(uuid.uuid4().hex+'.control-after.json'),self.resume_store.path.read_bytes())
    return {'before_ref':before,'after_ref':after,'actual_dispatch_receipt':receipt}
RuntimeDriver.apply_row_control=_row_control


def _row_observation(self,fixture):
    before=immutable(self.root,self.root/(uuid.uuid4().hex+'.observation-before.json'),self.resume_store.path.read_bytes())
    result=self.bridge.drain([{'category':'observation','kind':'query','payload':{'message':self.render_fixed_prompt(fixture)}}])
    after=immutable(self.root,self.root/(uuid.uuid4().hex+'.observation-after.json'),self.resume_store.path.read_bytes())
    if read_ref(self.root,before)!=read_ref(self.root,after):raise ConsumerError('OBSERVATION_MUTATED_STORE')
    return {'before_ref':before,'after_ref':after,'report':result,'continuation_retained':True}
RuntimeDriver.observe_row=_row_observation


def _nonstart_row(self,plan,capability):
    row=plan['approved_row'];identifier=row['variant_id']
    if identifier=='P3-IDENTITY':
        profile=json.loads(read_ref(self.repo,self.profile_ref));ref=profile['preflight_manifest_ref'];read_ref(self.repo,ref)
        return {'reused_preflight_ref':ref,'new_host_calls':0,'new_budget_charge':0,'runtime_acceptance':'preflight_only'}
    self.require_runtime_capability(capability)
    if identifier=='P3-RESUME':
        slot=row['thread_slots'][0];thread=self.owned_slot(slot,capability)
        old=self.host_processes;old.terminate_owned('pid:'+str(self.host.process.pid))
        api=self.start_host(capability)
        self.bridge=FencedSupervisorBridge(self,self.resume_store.path,api.adapter,self.fresh_store_sources(getattr(self,'_phase_source_refs',self._phase_config['source_refs'])),capability)
        read=api.call('read_thread',thread,include_turns=True,capability=capability)
        spec={k:v for k,v in self.fixed_thread_spec().items() if k!='ephemeral'};spec['threadId']=thread
        resumed=api.call('resume_thread',spec,capability=capability)
        return {'owned_thread':thread,'actual_read':read,'actual_resume':resumed,'runtime_acceptance':'requires_independent_read_resume_validation'}
    if identifier.startswith('R04-NEG-'):
        # Actual private copies are altered; Goal/authority/frozen inputs never are.
        current=self.resume_store.read();saved=copy.deepcopy(current)
        domain={'R04-NEG-WRONG_GOAL':'goal','R04-NEG-STALE_HEAD':'head','R04-NEG-DIRTY_INVENTORY_DRIFT':'dirty_untracked','R04-NEG-STALE_EVIDENCE':'evidence','R04-NEG-RUNTIME_IDENTITY_DRIFT':'runtime'}[identifier]
        if domain=='goal':saved['goal_binding']['goal_sha256']='0'*64
        elif domain=='head':saved['repository']['head']='stale-private-head'
        elif domain=='dirty_untracked':saved['repository']['untracked_inventory_sha256']='0'*64
        elif domain=='evidence':saved['last_progress']['evidence_sha256']='0'*64
        elif domain=='runtime':saved['runtime_profile']['protocol_digest']='0'*64
        stale=immutable(self.root,self.root/(uuid.uuid4().hex+'.negative-record.json'),canonical(saved))
        trigger=immutable(self.root,self.root/(uuid.uuid4().hex+'.negative-recovery.json'),canonical({'trigger':'thread_resumed','last_valid_record_ref':stale,'source_refs':self.fresh_store_sources(getattr(self,'_phase_source_refs',self._phase_config['source_refs']))}))
        result=self.recover_owned(trigger,capability=capability,bridge=self.bridge)
        return {'identity_domain':domain,'negative_record_ref':stale,'actual_recovery_result':result,'runtime_acceptance':'requires_independent_negative_validation'}
    raise ConsumerError('NONSTART_ROW_NOT_RECOGNIZED')
RuntimeDriver.execute_nonstart_row=_nonstart_row


def _row_live_routes(self,approved_row_ref):
    capability=getattr(self,'_runtime_capability',None)
    if capability is None:self._runtime_entry()
    self.require_runtime_capability(capability);plan=self.prepare_variant(approved_row_ref);row=plan['approved_row'];name=row['variant_id'];self._active_variant=name;self._row_start_ns=time.monotonic_ns()
    if row['phase']=='P3' and capability.phase!='P3_actual_runtime_only' or row['phase']!='P3' and capability.phase!='P4_actual_runtime_only':raise ConsumerError('ROW_PHASE_MISMATCH')
    if name=='P3-IDENTITY' or name=='P3-RESUME' or name.startswith('R04-NEG-'):
        return {'variant_id':name,'row_result':self.execute_nonstart_row(plan,capability),'runtime_acceptance':'not_evaluated'}
    if name=='P3-CHECKPOINT' or name in {'R03-WAIT','R03-BLOCKED','R03-HANDOFF','R03-TAKEOVER'}:
        approved=plan['actions'][0]['approved_action'];thread=self.owned_slot(row['thread_slots'][0],capability,create=True)
        return {'variant_id':name,'row_result':self.execute_checkpoint_row(plan,thread,None,approved,capability),'runtime_acceptance':'not_evaluated'}
    if name.startswith('FI-') or name in {'RECEIPT-COMPOSITION-CONTROL','R03-TAKEOVER-RECOVERY'}:
        return self.execute_private_variant(plan,capability)
    actions=[a['approved_action'] for a in plan['actions']];results=[];observations=[];controls=[]
    for position,approved in enumerate(actions):
        slot=(approved['thread_slot_refs'] or row['thread_slots'])[0]
        thread=self.owned_slot(slot,capability,create=slot not in getattr(self,'thread_slots',{}))
        fixture='active_window' if name in {'P3-STEER','P3-INTERRUPT'} else 'success' if name=='P3-SUCCESS' else 'unit'
        action_ref,audit_ref,issuance=self.materialize_live_action(approved,fixture,thread)
        dispatched=self.dispatch_host(action_ref,audit_ref);turn=dispatched.get('response',{}).get('turn',{}).get('id')
        if not dispatched.get('dispatch_granted') or not turn:results.append(dispatched);break
        if name=='P3-STEER':
            action_ref,audit_ref,_=self.materialize_live_action(approved,'success',thread,method='turn/steer',turn_id=turn,logical_id=approved['logical_action_id']+':sub:STEER')
            dispatched['steer']=self.dispatch_control_subaction(action_ref,audit_ref)
        elif name=='P3-INTERRUPT':
            action_ref,audit_ref,_=self.materialize_live_action(approved,'active_window',thread,method='turn/interrupt',turn_id=turn,logical_id=approved['logical_action_id']+':sub:INTERRUPT')
            dispatched['interrupt']=self.dispatch_control_subaction(action_ref,audit_ref)
        if name=='R04-TURN_INTERRUPTED' and position==0:
            action_ref,audit_ref,_=self.materialize_live_action(approved,'unit',thread,method='turn/interrupt',turn_id=turn,logical_id=approved['logical_action_id']+':sub:RECOVERY-INTERRUPT')
            self._actual_turn_interrupt_actor=self.dispatch_control_subaction(action_ref,audit_ref)
        if name=='R03-LONG-CONTROL':
            dispatched['terminal']=self.wait_owned_terminal(thread,turn,min(self._row_start_ns+100*10**9,time.monotonic_ns()+90*10**9))
            dispatched['issuance_ref']=self.bind_actual_issuance(issuance,turn)
            dispatched['long_control']=self.execute_long_control(approved)
        elif name=='P3-CHECKPOINT' or name.startswith('R03-'):
            dispatched['checkpoint']=self.execute_checkpoint_row(plan,thread,turn,approved,capability)
        else:
            dispatched['terminal']=self.wait_owned_terminal(thread,turn,min(self._row_start_ns+row['wall_clock_seconds']*10**9,time.monotonic_ns()+180*10**9))
            dispatched['issuance_ref']=self.bind_actual_issuance(issuance,turn)
            if fixture=='unit':dispatched['unit_progress']=self.execute_unit_fixture(approved)
        results.append(dispatched)
        if name.startswith('R02-QUERY-') and position==0:observations.append(self.observe_row('observation_'+name[-1]))
        if name.startswith('R05-') or name=='P3-VERTICAL':
            control={'R05-STOP':'stop','R05-WAIT_CONFIRM':'wait_confirm','R05-CANCEL':'cancel','R05-GOAL_CHANGE':'goal_change'}.get(name,'pause')
            controls.append(self.apply_row_control(control))
            if name!='R05-EXPLICIT_REENTRY':break
            self.explicit_private_reentry(capability)
        if name.startswith('R04-') and position==0:
            dispatched['recovery']=self.execute_recovery_trigger(row['injection'],capability)
        if name.startswith('R06-'):
            dispatched['contender']=self.execute_contender_row(name,approved,thread,capability)
    return {'variant_id':name,'action_results':results,'observation_receipts':observations,'control_receipts':controls,'mapping_ids':plan['mapping_ids'],'runtime_acceptance':'not_evaluated','dispatch_authority':False}
RuntimeDriver.run_variant=_row_live_routes

def _dispatch_control_subaction(self,action_ref,audit_ref):
    action=json.loads(read_ref(self.root,action_ref));logical=action['logical_action_id']
    parent,sep,sub=logical.partition(':sub:')
    permitted={'STEER':('P3-STEER-START-01','turn/steer'),'INTERRUPT':('P3-INTERRUPT-START-01','turn/interrupt'),'CP1-INTERRUPT':('P3-CHECKPOINT-START-01','turn/interrupt'),'CP2-INTERRUPT':('P3-CHECKPOINT-START-01','turn/interrupt')}
    if not sep or sub not in set(permitted)|{'RECOVERY-INTERRUPT'}:raise ConsumerError('CONTROL_SUBACTION_NOT_APPROVED')
    if sub=='RECOVERY-INTERRUPT':
        if getattr(self,'_active_variant',None)!='R04-TURN_INTERRUPTED' or parent!='R04-TURN_INTERRUPTED-START-01' or action['method']!='turn/interrupt':raise ConsumerError('CONTROL_SUBACTION_NOT_APPROVED')
    elif sub in {'CP1-INTERRUPT','CP2-INTERRUPT'}:
        active=getattr(self,'_active_variant',None)
        matrix=json.loads((self.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/ActionMatrix.json').read_bytes())['actions']
        allowed={row['approved_action']['logical_action_id'] for row in matrix if row['approved_action']['variant_id']==active}
        if parent not in allowed or action['method']!='turn/interrupt':raise ConsumerError('CONTROL_SUBACTION_NOT_APPROVED')
    elif (parent,action['method'])!=permitted[sub]:raise ConsumerError('CONTROL_SUBACTION_NOT_APPROVED')
    self.require_runtime_capability(self._runtime_capability)
    audit=json.loads(read_ref(self.root,audit_ref))
    if audit['source_request_sha256']!=sha(read_ref(self.root,action_ref)) or audit['source_refs']!=self.bridge.source_refs:raise ConsumerError('CONTROL_SUBACTION_BINDING_DRIFT')
    params=action['params'];self.owned.assert_owned('thread:'+params['threadId'])
    if action['method']=='turn/interrupt':
        if set(params)!={'threadId','turnId'}:raise ConsumerError('CONTROL_SUBACTION_NOT_CLOSED')
        self.owned.assert_owned('turn:'+params['turnId'])
    else:
        if set(params)!={'threadId','expectedTurnId','input'} or params['input']!=[{'type':'text','text':self.render_fixed_prompt('success')}]:raise ConsumerError('CONTROL_SUBACTION_NOT_CLOSED')
    if not self.evaluate_action(audit['source_refs'])['eligible']:raise ConsumerError('CONTROL_SUBACTION_INELIGIBLE')
    return self.bridge.dispatch(**action)
RuntimeDriver.dispatch_control_subaction=_dispatch_control_subaction


def _explicit_private_reentry(self,capability):
    from datetime import timedelta
    from rgc_resume_store import StoreConflict
    self.require_runtime_capability_for_reentry(capability)
    record=self.resume_store.read();fence=record['executor_lease']['fencing_token'];revision=record['goal_binding']['control_revision']
    # Only the exact approved R05-EXPLICIT_REENTRY fixture may re-enter this
    # private probe record. It cannot resume the parent Goal or clear user pause.
    if getattr(self,'_active_variant',None)!='R05-EXPLICIT_REENTRY':raise ConsumerError('EXPLICIT_REENTRY_NOT_APPROVED')
    message=self.render_fixed_prompt('resume')
    source=immutable(self.root,self.root/(uuid.uuid4().hex+'.explicit-reentry-message.json'),canonical({'fixture':'resume','message':message,'profile_ref':self.profile_ref,'authority_ref':json.loads(read_ref(self.repo,self.profile_ref))['approved_authority']}))
    def restore(candidate):
        candidate['continuation'].update(eligible=True,state='eligible',stop_reason=None,reason_codes=['EXPLICIT_PRIVATE_REENTRY'],action_token='reentry:'+uuid.uuid4().hex,token_control_revision=candidate['goal_binding']['control_revision']+1,token_record_revision=candidate['record_revision']+1)
        candidate['goal_binding']['control_revision']+=1
        candidate['executor_lease']['state']='released'
    current=self.resume_store.compare_and_swap(record['record_revision'],restore,fencing_token=fence,control_revision=revision)
    now=datetime.now(timezone.utc)
    acquired=self.resume_store.acquire_lease(current['record_revision'],owner_id=self.producer_id,owner_role='builder',issued_at_utc=now.isoformat(),expires_at_utc=(now+timedelta(seconds=330)).isoformat(),control_revision=current['goal_binding']['control_revision'])
    self.fence=acquired['executor_lease']['fencing_token'];self.token=acquired['continuation']['action_token']
    self.bridge.source_refs=self.fresh_store_sources(getattr(self,'_phase_source_refs',self._phase_config['source_refs']))
    return {'explicit_fixture_message_ref':source,'actual_reentry_record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.reentry-record.json'),self.resume_store.path.read_bytes())}
RuntimeDriver.explicit_private_reentry=_explicit_private_reentry


def _reentry_capability(self,capability):
    # Validate all phase/source/authority/independent-review bindings before
    # private fixture reentry; explicit user pause of the parent is never read
    # from a probe record and is never overwritten here.
    if type(capability) is not _PhaseCapability or getattr(self,'_runtime_capability',None) is not capability or capability.driver_identity!=id(self) or self.quarantined:raise ConsumerError('RUNTIME_CAPABILITY_INVALID_HOST_DISABLED')
    result=execution_admission.validate(json.loads(read_ref(self.repo,capability.admission_ref)),self.repo,expected_action='builder',expected_target='SP-010/P3')
    topo=json.loads(read_ref(self.repo,result['references']['topology']));_validate_runtime_reviews(self,topo);validate_loaded_manifest(self.repo,self.source_manifest_ref)
    if topo.get('phase')!='P4_actual_runtime_only' or topo.get('host_enabled') is not True:raise ConsumerError('REENTRY_RUNTIME_PHASE_REQUIRED')
    return result
RuntimeDriver.require_runtime_capability_for_reentry=_reentry_capability


def _recovery_trigger(self,trigger,capability):
    if trigger not in {'turn_interrupted','executor_lost','client_restart','thread_resumed'}:raise ConsumerError('RECOVERY_TRIGGER_UNKNOWN')
    last=immutable(self.root,self.root/(uuid.uuid4().hex+'.last-valid-record.json'),self.resume_store.path.read_bytes())
    reference=immutable(self.root,self.root/(uuid.uuid4().hex+'.recover-request.json'),canonical({'trigger':trigger,'last_valid_record_ref':last,'source_refs':self.fresh_store_sources(getattr(self,'_phase_source_refs',self._phase_config['source_refs']))}))
    return self.recover_owned(reference,capability=capability,bridge=self.bridge)
RuntimeDriver.execute_recovery_trigger=_recovery_trigger


def _contender_row(self,name,approved,thread,capability):
    from rgc_resume_store import ResumeStore,StoreConflict
    from datetime import timedelta
    original=self.resume_store.read();second=ResumeStore(self.resume_store.path);now=datetime.now(timezone.utc)
    try:
        claimant=second.acquire_lease(original['record_revision'],owner_id='contender:'+uuid.uuid4().hex,owner_role='builder',issued_at_utc=now.isoformat(),expires_at_utc=(now+timedelta(seconds=60)).isoformat(),control_revision=original['goal_binding']['control_revision'])
        outcome={'lease_acquired':True,'record_revision':claimant['record_revision']}
    except StoreConflict as exc:outcome={'lease_acquired':False,'reason':str(exc)}
    if name=='R06-EXPIRED_LEASE_LATE_OWNER':
        old_fence=original['executor_lease']['fencing_token']
        def expire(c):c['executor_lease']['state']='expired'
        current=second.compare_and_swap(original['record_revision'],expire,fencing_token=old_fence,control_revision=original['goal_binding']['control_revision'])
        acquired=second.acquire_lease(current['record_revision'],owner_id=self.producer_id,owner_role='builder',issued_at_utc=now.isoformat(),expires_at_utc=(now+timedelta(seconds=330)).isoformat(),control_revision=current['goal_binding']['control_revision'])
        try:second.compare_and_swap(acquired['record_revision'],lambda c:None,fencing_token=old_fence,control_revision=acquired['goal_binding']['control_revision']);late={'rejected':False}
        except StoreConflict as exc:late={'rejected':True,'reason':str(exc)}
        self.fence=acquired['executor_lease']['fencing_token'];outcome['late_old_owner']=late
    return {'actual_contender':outcome,'record_after_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.contender-state.json'),self.resume_store.path.read_bytes()),'dispatch_authority':False}
RuntimeDriver.execute_contender_row=_contender_row


def _checkpoint_row(self,plan,thread,worker_turn,approved,capability):
    from rgc_runtime_fixtures import FixtureExecutor
    row=plan['approved_row'];clock=RuntimeClock(self.host.journal)
    clock.start_ns=self._row_start_ns;clock.last_ns=clock.start_ns
    binding=self._phase_config['row_inputs'].get(row['variant_id'],{})
    if 'worker_spec_ref' not in binding:raise ConsumerError('CHECKPOINT_WORKER_SPEC_REQUIRED')
    def wait_until(seconds):
        deadline=clock.start_ns+int(seconds*1e9)
        while time.monotonic_ns()<deadline:
            self.require_runtime_capability(capability)
            if errors:raise ConsumerError('WORKER_CONTINUITY_LOST:'+str(errors[0]))
            if time.monotonic_ns()-clock.start_ns>=row['wall_clock_seconds']*10**9:raise ConsumerError('ROW_BUDGET_EXHAUSTED')
            time.sleep(min(0.2,max(0,(deadline-time.monotonic_ns())/1e9)))
    errors=[];samples=[];cp_results=[];stop=threading.Event()
    wait_until(15);worker_spec=self.materialize_worker_spec(binding['worker_spec_ref']);spec=json.loads(read_ref(self.root,worker_spec))
    if spec['mode']!='status_only' or not 300<=spec['deadline_seconds']<=row['wall_clock_seconds']:raise ConsumerError('SAME_WORKER_WINDOW_NOT_BOUND')
    executor=FixtureExecutor(self);worker=executor.start_bounded_registered_worker(worker_spec,capability=capability)
    def sample():
        while not stop.is_set():
            try:samples.append(executor.sample_bounded_worker(worker))
            except Exception as exc:errors.append(exc);stop.set();return
            stop.wait(2)
    sampler=threading.Thread(target=sample,name='owned-worker-observer',daemon=True);sampler.start()
    try:
        for index,at in [(1,135),(2,210)]:
            wait_until(at)
            if index==2 and not cp_results[-1].get('quiescence'):raise ConsumerError('CP1_NOT_QUIESCENT_NO_CP2')
            selected=approved if index==1 or len(plan['actions'])==1 else plan['actions'][1]['approved_action']
            logical=selected['logical_action_id'] if index==1 or len(plan['actions'])>1 else selected['logical_action_id']+':sub:CP2'
            ref,audit,issuance=self.materialize_live_action(selected,'checkpoint',thread,logical_id=logical,checkpoint_index=index)
            dispatch_started=time.monotonic_ns();dispatched=self.dispatch_host(ref,audit);turn=dispatched.get('response',{}).get('turn',{}).get('id')
            if not turn:raise ConsumerError('CHECKPOINT_START_UNKNOWN')
            issuance=self.bind_actual_issuance(issuance,turn)
            bound=json.loads(read_ref(self.root,issuance));clock.checkpoint(index,turn,bound['host_capture_request_ref'],self.root)
            try:terminal=self.wait_owned_terminal(thread,turn,clock.start_ns+(195 if index==1 else 270)*10**9)
            except ConsumerError as exc:
                if str(exc)!='OWNED_TURN_TERMINAL_NOT_OBSERVED' or index==2:raise
                interrupt_ref,interrupt_audit,_=self.materialize_live_action(approved,'checkpoint',thread,method='turn/interrupt',turn_id=turn,logical_id=approved['logical_action_id']+':sub:CP1-INTERRUPT',checkpoint_index=1)
                self.dispatch_control_subaction(interrupt_ref,interrupt_audit)
                terminal=self.wait_owned_terminal(thread,turn,clock.start_ns+210*10**9)
            receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.checkpoint-quiescence.json'),canonical(terminal));clock.quiescent(index,turn,receipt,self.root)
            cp_results.append({'checkpoint_index':index,'actual_dispatch':dispatched,'quiescence':receipt,'issuance_ref':issuance,'worker_pid':worker['handle'].pid,'worker_token':spec['action_token'],'worker_start_ns':worker['started_ns'],'started_ns':dispatch_started,'quiescent_ns':time.monotonic_ns(),'last_progress_before_ns':self._row_start_ns,'last_progress_after_ns':self._row_start_ns,'progress_input_kind':'status'})
        wait_until(max(270,(worker['started_ns']-clock.start_ns)/1e9+255))
        if errors or not samples or samples[-1]['observed_ns']-samples[0]['observed_ns']<250*10**9:raise ConsumerError('SAME_WORKER_255_WINDOW_INCOMPLETE')
        actual=executor.sample_bounded_worker(worker);samples.append(actual)
        predicate=self.evaluate_action(self.fresh_store_sources(getattr(self,'_phase_source_refs',self._phase_config['source_refs'])))
        if 'diagnosis_source_ref' not in binding:raise ConsumerError('DIAGNOSIS_SOURCE_REQUIRED')
        basis=json.loads(read_ref(self.root,binding['diagnosis_source_ref']));now=time.monotonic_ns()
        if row['variant_id']=='R03-BLOCKED':
            if not basis.get('blocking_dependency_ids'):raise ConsumerError('BLOCKED_DEPENDENCY_NOT_OBSERVED')
            diagnosis='WAIT_DEPENDENCY'
        elif row['variant_id']=='R03-HANDOFF':
            opened=basis.get('open_unit_ids');groups=basis.get('partitions')
            if not isinstance(opened,list) or not opened or not isinstance(groups,list) or sorted(u for group in groups for u in group)!=sorted(opened) or len(set(u for group in groups for u in group))!=len(opened):raise ConsumerError('HANDOFF_SCOPE_PARTITION_INVALID')
            diagnosis='HANDOFF'
        elif row['variant_id']=='R03-TAKEOVER':
            # The separate recovery row must consume a real fenced handoff;
            # absence of a verified fence cannot authorize automatic takeover.
            stop.set();sampler.join(timeout=3)
            if sampler.is_alive():raise ConsumerError('TAKEOVER_SAMPLER_NOT_QUIESCENT')
            actual_handoff=self.perform_actual_takeover_fence(worker,binding)
            basis={**basis,'actual_handoff_ref':actual_handoff}
            diagnosis='RECOVER'
        else:
            if basis.get('deadline_ns',0)<=now or type(basis.get('extensions_used')) is not int or not 0<=basis['extensions_used']<=2:raise ConsumerError('LEGITIMATE_JOB_BUDGET_NOT_BOUND')
            diagnosis='WAIT_LEGITIMATE'
        basis={**basis,'pid':worker['handle'].pid,'job_process_identity':actual['process_start_identity']}
        source=immutable(self.root,self.root/(uuid.uuid4().hex+'.diagnosis-source.json'),canonical(basis))
        route=immutable(self.root,self.root/(uuid.uuid4().hex+'.diagnosis-route.json'),canonical({'diagnosis':diagnosis,'basis_ref':source,'decided_ns':now,'predicate':predicate,'worker_spec_ref':worker_spec}))
        return {'worker_samples':samples,'checkpoints':cp_results,'diagnosis':diagnosis,'actual_route_ref':route,'predicate':predicate,'runtime_acceptance':'requires_independent_same_worker_and_diagnosis_evidence'}
    finally:
        stop.set();sampler.join(timeout=3);worker['boundary'].terminate_owned(worker['key'])
RuntimeDriver.execute_checkpoint_row=_checkpoint_row


def _private_variant(self,plan,capability):
    from rgc_runtime_fixtures import FixtureExecutor
    name=plan['approved_row']['variant_id'];self.require_runtime_capability(capability)
    binding=self._phase_config['row_inputs'].get(name)
    if not isinstance(binding,dict) or 'private_spec_ref' not in binding:raise ConsumerError('PRIVATE_VARIANT_SPEC_REQUIRED')
    spec_ref=binding['private_spec_ref'];spec=json.loads(read_ref(self.root,spec_ref));result={}
    if name=='FI-F4-DOUBLE-WRITE':result=FixtureExecutor(self).inject_private_fault(spec_ref,capability=capability)
    elif name in {'FI-F1-DROP-ACK','FI-F3-QUERY-MUTATION'}:
        if set(spec)!={'request_ref','window_seconds'} or spec['window_seconds']!=(120 if name=='FI-F1-DROP-ACK' else 60):raise ConsumerError('DROP_QUERY_FAULT_SPEC_NOT_CLOSED')
        queue=PrivateActionQueue(self);received=queue.enqueue(spec['request_ref']);sink_before=len(self.host.journal.frames)
        source_refs=getattr(self,'_phase_source_refs',self._phase_config['source_refs']);unit=json.loads(read_ref(self.root,source_refs['unit']));record=self.resume_store.read()
        queue_state={'pending':list(queue.pending),'generation':record['record_id'],'unit_id':record['next_action']['action_id'],'ready':unit['ready'],'blocking_dependency_ids':unit['blocking_dependency_ids'],'unit_source_ref':source_refs['unit'],'received_ref':received}
        queue_before=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-queue-before.json'),canonical(queue_state))
        dependency=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-dependency.json'),canonical({'blocking_dependency_ids':unit['blocking_dependency_ids'],'unit_source_ref':source_refs['unit']}))
        mutation=self.inject_query_mutation() if name=='FI-F3-QUERY-MUTATION' else None
        current=self.resume_store.read();dispatcher=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-dispatcher-read.json'),canonical({'control_revision':current['goal_binding']['control_revision'],'record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.dispatcher-store.json'),self.resume_store.path.read_bytes())}))
        outcome=queue.drain(lambda ref:self.dispatch_host(ref,binding['audit_ref']),'F1' if name.startswith('FI-F1') else 'F3')
        route={'queue_before_ref':queue_before,'queue_source_ref':queue_before,'dependency_source_ref':dependency,'dispatcher_read_ref':dispatcher,'actual_dispatch_ref':outcome,'received_request_ref':spec['request_ref']}
        if mutation:route['query_after_ref']=mutation['after_ref']
        route_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-private-dispatch-route.json'),canonical(route))
        self.capture_bound_event('driver_emission','scheduler_tick',canonical(route),lambda ref:{'row_start_ns':self._row_start_ns,'worker_start_ns':None,'worker_pid':os.getpid(),'worker_token':self.token,'route_ref':route_ref},None)
        begin=time.monotonic_ns();end=begin+spec['window_seconds']*10**9
        while time.monotonic_ns()<end:
            self.require_runtime_environment(capability);self.capture_private_inventory();self.capture_store_snapshot()
            from rgc_app_server_adapter import AdapterError
            try:
                notification=self.host.next_event(time.monotonic()+0.1)
                frame=notification['frame']
                if 'id' in frame and frame.get('method'):self.host.respond_server_request(frame,{'validated':True,'outcome':'deny'})
            except AdapterError as exc:
                if exc.error_class!='REQUEST_TIMEOUT':raise
            time.sleep(min(2,max(0,(end-time.monotonic_ns())/1e9)))
        self.capture_private_inventory();queue.close()
        result={'actual_queue_received_ref':received,'actual_dispatcher_receipt_ref':outcome,'actual_route_ref':route_ref,'actual_query_mutation':mutation,'send_frames_before':sink_before,'send_frames_after':len(self.host.journal.frames),'complete_window_ns':time.monotonic_ns()-begin}
    elif name=='FI-F2-STATUS-ONLY':result=self.execute_status_only_window(spec_ref,capability)
    elif name.startswith('FI-F5-') or name.startswith('FI-F6-'):
        reference=spec.get('trigger_ref')
        if reference is None:raise ConsumerError('PRIVATE_RECOVERY_ATTEMPT_SOURCE_REQUIRED')
        if name=='FI-F6-PAUSE':self.apply_row_control('pause')
        try:result=self.recover_owned(reference,capability=capability,bridge=self.bridge)
        except ConsumerError as exc:result={'allowed':False,'reason_codes':[str(exc)],'actual_attempt_ref':reference,'actual_record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.rejected-recovery-record.json'),self.resume_store.path.read_bytes())}
    elif name=='R03-TAKEOVER-RECOVERY':result=self.execute_recovery_trigger('executor_lost',capability)
    elif name=='RECEIPT-COMPOSITION-CONTROL':
        from rgc_runtime_consumer import RuntimeNamespaceConsumer
        consumer=RuntimeNamespaceConsumer(self.observer);result=consumer.consume_runtime_frozen(spec['audit_ref'])
    else:raise ConsumerError('PRIVATE_VARIANT_UNKNOWN')
    return {'variant_id':name,'actual_private_result':result,'runtime_acceptance':'not_evaluated','dispatch_authority':False}
RuntimeDriver.execute_private_variant=_private_variant


def _materialize_worker_spec(self,spec_ref):
    spec=json.loads(read_ref(self.root,spec_ref));record=self.resume_store.read()
    if spec.get('action_token')!='__CURRENT_WORKER_TOKEN__':raise ConsumerError('WORKER_TEMPLATE_TOKEN_NOT_CLOSED')
    spec['action_token']=getattr(self,'_worker_action_token',None) or (getattr(self,'_active_variant','PRIVATE')+'-WORKER-T1:'+self.run_id)
    self._worker_action_token=spec['action_token']
    if isinstance(spec.get('output_path'),str) and spec['output_path'].startswith('__OWNED_SOURCE_ROOT__/'):
        spec['output_path']=str(confined(self.root,self.root/spec['output_path'].split('/',1)[1]))
    return immutable(self.root,self.root/(uuid.uuid4().hex+'.materialized-worker-spec.json'),canonical(spec))
RuntimeDriver.materialize_worker_spec=_materialize_worker_spec


def _query_mutation(self):
    if self._active_variant!='FI-F3-QUERY-MUTATION':raise ConsumerError('QUERY_MUTATION_FAULT_NOT_ADMITTED')
    record=self.resume_store.read();before=immutable(self.root,self.root/(uuid.uuid4().hex+'.query-before.json'),self.resume_store.path.read_bytes())
    message=immutable(self.root,self.root/(uuid.uuid4().hex+'.query-message.txt'),self.render_fixed_prompt('observation_1').encode())
    def mutation(c):
        c['goal_binding']['control_revision']+=1;c['continuation'].update(eligible=False,state='ineligible',stop_reason='injected_observation_pause',action_token=None)
    after=self.resume_store.compare_and_swap(record['record_revision'],mutation,fencing_token=record['executor_lease']['fencing_token'],control_revision=record['goal_binding']['control_revision'])
    return {'message_ref':message,'before_ref':before,'after_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.query-after.json'),self.resume_store.path.read_bytes()),'fault_scope':'private_only'}
RuntimeDriver.inject_query_mutation=_query_mutation


def _bind_actual_issuance(self,issuance_ref,host_turn):
    issuance=json.loads(read_ref(self.root,issuance_ref));token=issuance['token']
    matches=[(identifier,entry) for identifier,entry in self.host.journal.requests.items() if entry['method']=='turn/start' and entry['context'] is not None and entry['context'].action_token==token]
    if len(matches)!=1:raise ConsumerError('ISSUANCE_ACTUAL_REQUEST_UNKNOWN')
    identifier,entry=matches[0]
    refs=[ref for ref in self.host.journal.frames if json.loads(read_ref(self.root,ref))['frame_facts'].get('id')==identifier and json.loads(read_ref(self.root,ref))['frame_facts'].get('result',{}).get('turn',{}).get('id')==host_turn]
    if len(refs)!=1:raise ConsumerError('ISSUANCE_ACTUAL_ACK_UNKNOWN')
    captured=[event for event in getattr(getattr(self,'row_capture',None),'events',[]) if event['kind']=='host_request' and event['payload']['jsonrpc_id']==identifier and event['action_token']==token]
    source_request=captured[0]['payload']['request_ref'] if len(captured)==1 else entry['frame_ref']
    bindings=self._phase_config['row_inputs'].get(getattr(self,'_active_variant',''),{}).get('unit_item_bindings',{})
    actual={**issuance,'item_id':bindings.get(issuance['logical_action_id']),'host_request_ref':source_request,'host_capture_request_ref':entry['ref'],'jsonrpc_id':identifier,'host_turn_id':host_turn,'ack_capture_ref':refs[0]}
    reference=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-issuance.json'),canonical(actual))
    self.actual_issuances=getattr(self,'actual_issuances',[])+[reference]
    return reference
RuntimeDriver.bind_actual_issuance=_bind_actual_issuance


def _checkpoint_query_id(self,approved,index):
    matrix=json.loads((self.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/ActionMatrix.json').read_bytes())['actions']
    variants=list(dict.fromkeys(r['approved_action']['variant_id'] for r in matrix if 'checkpoint' in r['approved_action']['fixture_ids']))
    if index not in {1,2} or approved['variant_id'] not in variants:raise ConsumerError('CHECKPOINT_QUERY_NOT_REGISTERED')
    ordinal=variants.index(approved['variant_id'])*2+index
    if ordinal>128:raise ConsumerError('CHECKPOINT_QUERY_CATALOG_EXHAUSTED')
    return 'CP%02d'%ordinal
RuntimeDriver.checkpoint_query_id=_checkpoint_query_id


def _begin_row_capture(self,name,capability):
    from rgc_runtime_observer import StreamingCapture
    self.require_runtime_capability(capability)
    self._capture_lock=threading.RLock();self._capture_pending={};self._capture_tokens={};self._capture_host_tokens={}
    key='pid:'+str(self.host.process.pid);host_proof=self.host_processes.proofs[key]['proof_ref']
    state_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.capture-owner.json'),canonical({'creator_process_identity':process_identity(os.getpid()),'admission_ref':capability.admission_ref,'source_manifest_ref':self.source_manifest_ref,'store_ref':{'path':str(self.resume_store.path),'sha256':sha(self.resume_store.path.read_bytes())},'row':name}))
    channel_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.capture-channel.json'),canonical({'adapter_session_id':self.host.session_id,'host_creation_ref':host_proof,'row':name,'clock_owner_process_identity':process_identity(os.getpid())}))
    kinds=['host_transport','store','control','worker_ipc','os_sampler','guard_sink','driver_emission','dependency','progress']
    domains={}
    for kind in kinds:
        self._capture_pending[kind]=canonical({'opened':True,'row':name})
        domains[kind]={'kind':kind,'reader':lambda k=kind:self._capture_pending[k],'creation_ref':host_proof if kind=='host_transport' else state_ref,'channel_ref':channel_ref}
    profile=json.loads(read_ref(self.repo,self.profile_ref))
    stream=StreamingCapture(self.repo,self.root,self.evidence,'capture-'+name+'-'+uuid.uuid4().hex,domains,profile['approved_authority'],self.source_manifest_ref)
    # Row origin is an actual monotonic sample taken before setup/model dispatch.
    self._row_start_ns=stream.clock_start;self.row_capture=stream
    self.capture_bound_event('driver_emission','ingress_open',canonical({'channel_ref':channel_ref}),lambda ref:{'registered_source_refs':[state_ref,channel_ref],'capture_domain_manifest_ref':stream.domain_ref},None)
    self.capture_store_snapshot()
    return stream
RuntimeDriver.begin_row_capture=_begin_row_capture


def _capture_bound_event(self,domain,kind,raw,payload_builder,token=None):
    if getattr(self,'row_capture',None) is None:return None
    if not isinstance(raw,bytes):raise ConsumerError('CAPTURE_ACTUAL_BYTES_REQUIRED')
    with self._capture_lock:
        stream=self.row_capture;self._capture_pending[domain]=raw
        event=stream.observe(domain,kind,payload_builder,token)
        if token is not None and token not in self._capture_tokens:
            self._capture_tokens[token]={'token':token,'kind':'worker' if '-WORKER-T1:' in token else 'host','logical_action_id':token,'issued_sequence':event['sequence'],'revoked_sequence':None,'issuance_store_ref':None}
        return event
RuntimeDriver.capture_bound_event=_capture_bound_event


def _capture_host_boundary(self,row,frame_ref,context):
    frame=json.loads(read_ref(self.root,frame_ref));request=self.host.journal.requests.get(frame.get('id'),{})
    method=frame.get('method');params=frame.get('params',{});body=frame.get('result',{});thread=params.get('threadId');turn=params.get('turnId') or params.get('turn',{}).get('id')
    if isinstance(body,dict) and isinstance(body.get('turn'),dict):turn=body['turn'].get('id')
    if request:
        raw_request=json.loads(read_ref(self.root,request['frame_ref']));thread=thread or raw_request.get('params',{}).get('threadId')
        origin=request.get('context')
    else:origin=context
    token=origin.action_token if origin is not None else self._capture_host_tokens.get(thread)
    if token is not None and thread:self._capture_host_tokens[thread]=token
    if row['direction']=='client_to_server':
        if 'id' not in frame or method not in {'turn/start','turn/steer','turn/interrupt','thread/start','thread/resume','thread/read'}:return
        payload=lambda ref:{'method':method,'jsonrpc_id':frame['id'],'request_ref':ref,'request_sha256':sha(read_ref(self.root,frame_ref)),'thread_id':thread,'turn_id':turn}
        event=self.capture_bound_event('host_transport','host_request',read_ref(self.root,frame_ref),payload,token)
    else:
        if method is None and 'result' not in frame:return
        payload=lambda ref:{'method':method,'jsonrpc_id':frame.get('id'),'frame_ref':ref,'adapter_session_id':row['adapter_session_id'],'adapter_sequence':row['adapter_sequence'],'thread_id':thread,'turn_id':turn}
        event=self.capture_bound_event('host_transport','host_frame',read_ref(self.root,frame_ref),payload,token)
    if token is not None and context is not None:self._capture_tokens[token]['logical_action_id']=context.logical_action_id
RuntimeDriver.capture_host_boundary=_capture_host_boundary


def _capture_store_snapshot(self):
    raw=self.resume_store.path.read_bytes();record=json.loads(raw)
    return self.capture_bound_event('store','store_snapshot',raw,lambda ref:{'record_ref':ref,'record_revision':record['record_revision']},None)
RuntimeDriver.capture_store_snapshot=_capture_store_snapshot


def _seal_row_capture(self,reason='normal'):
    stream=self.row_capture
    self.capture_store_snapshot()
    self.capture_bound_event('driver_emission','ingress_close',canonical({'actual_terminal_reason':reason}),lambda ref:{'last_sequence':len(stream.events)+1,'terminal_reason':reason},None)
    # Metadata points to actual captured request and ACK, never predicted UUIDs.
    for ref in getattr(self,'actual_issuances',[]):
        issuance=json.loads(read_ref(self.root,ref));token=issuance['token']
        if token not in self._capture_tokens:continue
        logical=issuance['logical_action_id'];entry=self._capture_tokens[token];entry['issuance_store_ref']=ref
        if issuance['fixture_id']=='checkpoint':
            index=2 if ':sub:CP2' in logical or logical.endswith('START-02') else 1
            actual={**issuance,'logical_action_id':'CP'+str(index),'original_logical_action_id':logical}
            entry.update(kind='checkpoint',logical_action_id='CP'+str(index),issuance_store_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.checkpoint-issuance.json'),canonical(actual)))
    lineage=immutable(self.root,self.root/(uuid.uuid4().hex+'.token-lineage.json'),canonical({'entries':list(self._capture_tokens.values())}))
    ledger=immutable(self.root,self.root/(uuid.uuid4().hex+'.owned-capture.json'),canonical(self.owned.state.snapshot()))
    registered=[]
    for event in stream.events:
        domain=stream.domains[event['producer_id']];role={'host_transport':'host','store':'store','control':'driver','worker_ipc':'worker','os_sampler':'os_sampler','guard_sink':'guard','driver_emission':'driver','dependency':'store','progress':'classifier'}[domain['kind']]
        for ref in event['source_refs']:registered.append({'ref':ref,'producer_id':event['producer_id'],'role':role,'creator_receipt_ref':event['capture_receipt_ref']})
    record=self.resume_store.read()
    registry={'schema_version':'rgc_runtime_source_registry_v36candidate','run_id':stream.run_id,'clock_owner_id':stream.observer_id,'observer_id':stream.observer_id,'observer_process_identity':stream.identity,'registered_sources':registered,'current_action_token':self.token,'issued_tokens':list(self._capture_tokens),'current_control_revision':record['goal_binding']['control_revision'],'current_fencing_token':record['executor_lease']['fencing_token'],'authority_ref':stream.authority_ref,'owned_ledger_ref':ledger,'capture_domain_manifest_ref':stream.domain_ref,'token_lineage_ref':lineage}
    registry_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.capture-registry.json'),canonical(registry))
    manifest=json.loads(read_ref(self.repo,self.source_manifest_ref))
    dependencies=manifest['files']+[self.profile_ref,stream.authority_ref]
    reference=stream.seal(registry_ref,dependencies,'none' if reason=='normal' and not self.host.journal.gap else 'unresolved')
    self.row_capture=None
    return reference
RuntimeDriver.seal_row_capture=_seal_row_capture

_previous_run_variant=RuntimeDriver.run_variant
def _captured_run_variant(self,approved_row_ref):
    capability=getattr(self,'_runtime_capability',None)
    if capability is None:self._runtime_entry()
    self.require_runtime_capability(capability)
    plan=self.prepare_variant(approved_row_ref);name=plan['approved_row']['variant_id'];self._current_row_ref=approved_row_ref
    self.reserve_variant_budget(plan)
    if name=='R03-LONG-CONTROL':
        from datetime import timedelta
        current=self.resume_store.read()
        def extend_row_lease(c):c['executor_lease']['expires_at_utc']=(datetime.now(timezone.utc)+timedelta(seconds=720)).isoformat()
        self.resume_store.compare_and_swap(current['record_revision'],extend_row_lease,fencing_token=current['executor_lease']['fencing_token'],control_revision=current['goal_binding']['control_revision'])
    self.begin_row_capture(name,self._runtime_capability)
    try:
        result=_previous_run_variant(self,approved_row_ref)
    except Exception:
        self.seal_row_capture('error');raise
    capture=self.seal_row_capture('normal')
    return {**result,'actual_capture_manifest_ref':capture}
RuntimeDriver.run_variant=_captured_run_variant


_previous_row_control=RuntimeDriver.apply_row_control
def _capture_row_control(self,kind):
    token=self.resume_store.read()['continuation']['action_token']
    result=_previous_row_control(self,kind)
    message=self.render_fixed_prompt(kind)
    message_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.control-message.txt'),message.encode('utf-8'))
    receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.priority-control-receipt.json'),canonical({'actual_dispatch_receipt':result['actual_dispatch_receipt'],'snapshot_ref':result['before_ref'],'control_priority_drained':True,'reopened_store_ref':result['after_ref']}))
    event=self.capture_bound_event('control','control_ingress',canonical(result),lambda ref:{'message_ref':message_ref,'before_ref':result['before_ref'],'after_ref':result['after_ref'],'caller_receipt_ref':receipt},None)
    if event is not None:
        for entry in self._capture_tokens.values():
            if entry['revoked_sequence'] is None:entry['revoked_sequence']=event['sequence']
    self.capture_store_snapshot()
    return {**result,'captured_control_event':event}
RuntimeDriver.apply_row_control=_capture_row_control

_previous_row_observation=RuntimeDriver.observe_row
def _capture_row_observation(self,fixture):
    result=_previous_row_observation(self,fixture)
    message_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.observation-message.txt'),self.render_fixed_prompt(fixture).encode('utf-8'))
    receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-observation-report.json'),canonical({'snapshot_ref':result['before_ref'],'actual_report':result['report'],'continuation_retained':result['continuation_retained']}))
    self.capture_bound_event('control','control_ingress',canonical(result),lambda ref:{'message_ref':message_ref,'before_ref':result['before_ref'],'after_ref':result['after_ref'],'caller_receipt_ref':receipt},None)
    return {**result,'actual_report_ref':receipt}
RuntimeDriver.observe_row=_capture_row_observation


def _execute_unit_fixture(self,approved):
    from rgc_runtime_fixtures import FixtureExecutor,validate_worker_spec
    name=self._active_variant;binding=self._phase_config['row_inputs'].get(name,{})
    refs=binding.get('unit_worker_spec_refs');items=binding.get('unit_item_bindings')
    logical=approved['logical_action_id']
    if not isinstance(refs,dict) or logical not in refs or not isinstance(items,dict) or logical not in items:raise ConsumerError('UNIT_FIXTURE_AND_OPEN_ITEM_BINDING_REQUIRED')
    record=self.resume_store.read();item_id=items[logical]
    if not any(i['item_id']==item_id and i['state'] in {'open','ready','pending'} for i in record['open_items']):raise ConsumerError('ACTUAL_RECORD_UNIT_NOT_PENDING')
    self._worker_action_token=self.token
    spec_ref=self.materialize_worker_spec(refs[logical]);spec=validate_worker_spec(self,spec_ref)
    if spec['mode'] in {'status_only','long_control'}:raise ConsumerError('STATUS_NOT_UNIT_PROGRESS')
    matrix=json.loads((self.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/ActionMatrix.json').read_bytes())['actions']
    actual_unit=[r['approved_action']['logical_action_id'] for r in matrix].index(logical)+1
    if spec['unit_id']!=actual_unit:raise ConsumerError('UNIT_WORKER_HOST_ISSUANCE_MISMATCH')
    elapsed=(time.monotonic_ns()-self._row_start_ns)/1e9;row=self.prepare_variant(self._current_row_ref)['approved_row']
    if elapsed+spec['deadline_seconds']>row['wall_clock_seconds']:raise ConsumerError('UNIT_FIXTURE_EXCEEDS_ROW_BUDGET')
    execution=FixtureExecutor(self).run_bounded_registered_worker(spec_ref,capability=self._runtime_capability)
    output_ref=execution['worker_outcome']['output_ref']
    if execution['observer_execution_ref'] is None or output_ref is None:raise ConsumerError('UNIT_EFFECT_NOT_OBSERVED')
    before=self.register_source(spec['input_refs'][0]['path'],'fixture_controller');after=self.register_source(output_ref['path'],'fixture_controller');opened=self.register_source(spec['open_item_ref']['path'],'store')
    for ref in spec['input_refs']:self.register_basis_origin(ref)
    delta={'before_ref':before,'after_ref':after,'unit_id':spec['unit_id'],'kind':spec['mode'],'open_item_ref':opened}
    delta_origin=immutable(self.root,self.root/(uuid.uuid4().hex+'.unit-delta.json'),canonical(delta));delta_ref=self.register_source(delta_origin['path'],'fixture_controller')
    issued=self.issue_registered_progress_receipt(delta_ref,opened)
    self.capture_bound_event('progress','fixture_delta',canonical({'execution_ref':execution['observer_execution_ref'],'spec_ref':spec_ref,'item_id':item_id}),lambda ref:{'before_ref':before,'after_ref':after,'command_ref':execution['observer_execution_ref'],'open_item_ref':opened},self.token)
    event=self.capture_bound_event('progress','classifier_receipt',canonical({'issued_receipt_ref':issued['payload']['receipt_ref'],'actual_execution_ref':execution['observer_execution_ref'],'spec_ref':spec_ref}),lambda ref:issued['payload'],self.token)
    receipt=json.loads(read_ref(self.root,issued['payload']['receipt_ref']))
    current=self.resume_store.read()
    def accept(c):
        c['last_progress'].update(evidence_id=receipt['evidence_id'],evidence_type=receipt['evidence_type'],evidence_ref=after['path'],evidence_sha256=after['sha256'],source_event_id=receipt['source_event_id'],action_token=self.token,observed_at_utc=receipt['observed_at_utc'],supervisor_monotonic_sequence=event['sequence'])
        for item in c['open_items']:
            if item['item_id']==item_id:item['state']='completed'
        pending={item['item_id'] for item in c['open_items'] if item['state'] in {'open','ready','pending'}}
        follow=[action['approved_action'] for action in self.prepare_variant(self._current_row_ref)['actions'] if action['approved_action']['logical_action_id'] in items and items[action['approved_action']['logical_action_id']] in pending]
        if follow:
            next_logical=follow[0]['logical_action_id'];c['next_action'].update(action_id=next_logical,action_kind='turn/start',action_target=items[next_logical],semantic_input_sha256=refs[next_logical]['sha256'])
        elif not pending:c['next_action'].update(action_id='private_stop',action_kind='none',action_target='')
    accepted=self.resume_store.compare_and_swap(current['record_revision'],accept,fencing_token=current['executor_lease']['fencing_token'],control_revision=current['goal_binding']['control_revision'])
    self._accepted_progress_refs=getattr(self,'_accepted_progress_refs',{});self._accepted_progress_refs[after['sha256']]=after
    self.capture_store_snapshot()
    if not any(item['state'] in {'open','ready','pending'} for item in accepted['open_items']):
        predicate_ref=binding.get('private_stop_predicate_ref')
        if predicate_ref is None or json.loads(read_ref(self.root,predicate_ref))!={'type':'open_unit_ids_empty'}:raise ConsumerError('PRIVATE_OWNER_STOP_PREDICATE_REQUIRED')
        self.capture_bound_event('driver_emission','cleanup',canonical({'emission':'private_goal_stop','private_stop_predicate_ref':predicate_ref,'actual_record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.private-stop-record.json'),self.resume_store.path.read_bytes()),'private_only':True}),lambda ref:{'exit_sample_ref':ref},None)
    return {'actual_worker_execution':execution,'delta_ref':delta_ref,'independent_progress_receipt_ref':issued['payload']['receipt_ref'],'item_id':item_id,'accepted_record_revision':accepted['record_revision']}
RuntimeDriver.execute_unit_fixture=_execute_unit_fixture


def _capture_private_inventory(self):
    resources=self.owned.state.snapshot();inventory=[];launches=[]
    for boundary_name in ('worker_processes','fault_processes'):
        boundary=getattr(self,boundary_name,None)
        if boundary is None:continue
        for key,process in boundary.handles.items():
            proof=boundary.proofs[key];launches.append({'pid':process.pid,'creation_proof_ref':proof['proof_ref']})
            entry=resources['resources'][key]
            if entry['writable'] and not entry['quarantined'] and process.poll() is None:
                identity=process_identity(process.pid)
                if identity!=proof['identity']:raise ConsumerError('EXECUTOR_GENERATION_DRIFT')
                inventory.append({'pid':process.pid,'process_identity':identity,'creation_proof_ref':proof['proof_ref']})
    source=immutable(self.root,self.root/(uuid.uuid4().hex+'.owned-launch-inventory.json'),canonical(launches))
    raw=canonical({'executor_inventory':inventory,'owned_launch_journal_ref':source,'owned_ledger_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.inventory-owned.json'),canonical(resources)),'observed_monotonic_ns':time.monotonic_ns()})
    return self.capture_bound_event('os_sampler','worker_sample',raw,lambda ref:{'pid':os.getpid(),'process_start_identity':process_identity(os.getpid()),'os_sample_ref':ref,'ipc_ref':None},None)
RuntimeDriver.capture_private_inventory=_capture_private_inventory

_previous_query_mutation=RuntimeDriver.inject_query_mutation
def _capture_query_mutation(self):
    from reliable_goal_continuation import classify_intent
    before=self.resume_store.read();result=_previous_query_mutation(self)
    actual=classify_intent({'parameters':{'message':read_ref(self.root,result['message_ref']).decode('utf-8'),'before_control_revision':before['goal_binding']['control_revision'],'before_eligible':before['continuation']['eligible'],'prior_stop_reason':'none'},'context':{'control':{'pause_active':False}}})
    receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-query-classification.json'),canonical({'classification':actual,'classifier_source_ref':next(ref for ref in json.loads(read_ref(self.repo,self.source_manifest_ref))['files'] if Path(ref['path']).name=='reliable_goal_continuation.py'),'before_ref':result['before_ref'],'after_ref':result['after_ref'],'fault_scope':'private_only'}))
    event=self.capture_bound_event('control','control_ingress',canonical({'actual_query_mutation':result,'original_classifier_ref':receipt}),lambda ref:{'message_ref':result['message_ref'],'before_ref':result['before_ref'],'after_ref':result['after_ref'],'caller_receipt_ref':receipt},None)
    if event is not None:
        for entry in self._capture_tokens.values():
            if entry['revoked_sequence'] is None:entry['revoked_sequence']=event['sequence']
    return {**result,'actual_original_classifier_ref':receipt}
RuntimeDriver.inject_query_mutation=_capture_query_mutation


def _register_basis_origin(self,reference):
    raw=read_ref(self.root,reference);origin=confined(self.root,reference['path'])
    self.owned.assert_owned('file:'+str(origin)) if 'file:'+str(origin) in self.owned.state.snapshot()['resources'] else self.register_source(origin,'fixture_controller')
    if any(row['ref']==reference for row in self.registered):return reference
    receipt={'run_id':self.run_id,'producer_id':self.producer_id,'role':'fixture_controller','source_ref':reference,'creator_pid':os.getpid(),'process_identity':process_identity(os.getpid()),'created_ns':time.monotonic_ns(),'origin_path':str(origin)}
    proof=immutable(self.root,self.root/(uuid.uuid4().hex+'.basis-origin-proof.json'),canonical(receipt))
    self.registered.append({'ref':reference,'producer_id':self.producer_id,'role':'fixture_controller','creator_receipt_ref':proof})
    return reference
RuntimeDriver.register_basis_origin=_register_basis_origin


def _execute_status_only_window(self,template_ref,capability):
    from rgc_runtime_fixtures import FixtureExecutor
    self.require_runtime_capability(capability)
    spec_ref=self.materialize_worker_spec(template_ref);spec=json.loads(read_ref(self.root,spec_ref))
    if spec['mode']!='status_only' or not 300<=spec['deadline_seconds']<=330:raise ConsumerError('STATUS_ONLY_WINDOW_SPEC_NOT_CLOSED')
    executor=FixtureExecutor(self);worker=executor.start_bounded_registered_worker(spec_ref,capability=capability);samples=[]
    try:
        first=executor.sample_bounded_worker(worker);samples.append(first);deadline=first['observed_ns']+255*10**9
        while time.monotonic_ns()<deadline:
            self.require_runtime_capability(capability)
            if time.monotonic_ns()>self._row_start_ns+315*10**9:raise ConsumerError('STATUS_WINDOW_ROW_BUDGET_EXHAUSTED')
            time.sleep(min(2,max(0,(deadline-time.monotonic_ns())/1e9)));samples.append(executor.sample_bounded_worker(worker))
            self.capture_store_snapshot()
        samples.append(executor.sample_bounded_worker(worker))
        return {'worker_spec_ref':spec_ref,'actual_worker_samples':samples,'worker_pid':worker['pid'],'action_token':spec['action_token'],'complete_same_worker_span_ns':samples[-1]['observed_ns']-samples[0]['observed_ns'],'actual_last_progress_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.status-last-progress.json'),canonical(self.resume_store.read()['last_progress'])),'runtime_acceptance':'not_evaluated'}
    finally:worker['boundary'].terminate_owned(worker['key'])
RuntimeDriver.execute_status_only_window=_execute_status_only_window


_previous_explicit_reentry=RuntimeDriver.explicit_private_reentry
def _captured_explicit_reentry(self,capability):
    before=immutable(self.root,self.root/(uuid.uuid4().hex+'.explicit-resume-before.json'),self.resume_store.path.read_bytes())
    result=_previous_explicit_reentry(self,capability)
    message=immutable(self.root,self.root/(uuid.uuid4().hex+'.explicit-resume-message.txt'),self.render_fixed_prompt('resume').encode('utf-8'))
    receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-explicit-reentry.json'),canonical(result))
    self.capture_bound_event('control','control_ingress',canonical(result),lambda ref:{'message_ref':message,'before_ref':before,'after_ref':result['actual_reentry_record_ref'],'caller_receipt_ref':receipt},None)
    self.capture_store_snapshot()
    return result
RuntimeDriver.explicit_private_reentry=_captured_explicit_reentry


def _reserve_variant_budget(self,plan):
    # All row quota is persisted before thread/worker/recovery effects. Identity
    # is a read of an already charged preflight, not a new host action.
    row=plan['approved_row'];actions=[a['approved_action'] for a in plan['actions']]
    budget=getattr(self,'budget',None)
    if budget is None:raise ConsumerError('DURABLE_BUDGET_REQUIRED_BEFORE_EFFECT')
    if row['variant_id']=='P3-IDENTITY':
        state=budget.state.snapshot()
        if not state['rows'].get(row['variant_id']):raise ConsumerError('INHERITED_PREFLIGHT_BUDGET_REQUIRED')
        runtime_ref=getattr(self,'runtime_admission_ref',None)
        if runtime_ref is not None:
            topology=admitted_topology(self.repo,runtime_ref)
            if topology.get('host_binding_route')==CURRENT_HOST_ROUTE:
                try:
                    profile=json.loads(read_ref(self.repo,self.profile_ref));reference=profile['preflight_manifest_ref']
                    manifest=json.loads(read_ref(self.repo,reference));key=manifest['reservation_key']
                    entry=state['actions'][key['logical_action_id']]
                    if key['approval_digest']!=topology['authority_ref']['sha256'] or key['variant_id']!='P3-IDENTITY' or key['charge_kind']!='identity_preflight':raise ValueError('reservation authority')
                    if entry.get('reservation_key')!=key or entry.get('preflight_manifest_ref')!=reference or entry.get('attempt')!=key['attempt_id']:raise ValueError('attempt')
                    if manifest.get('execution_source_manifest_ref')!=self.source_manifest_ref or entry.get('execution_source_manifest_ref')!=self.source_manifest_ref:raise ValueError('source')
                    if manifest.get('verdict')!='pass_for_profile_preflight_only' or manifest.get('thread_created') is not False or manifest.get('turn_started') is not False:raise ValueError('result')
                    for field in ('actual_executable','wrapper','protocol'):
                        if manifest.get(field)!=profile.get(field):raise ValueError('identity')
                except (ValueError,KeyError,TypeError,OSError) as exc:raise ConsumerError('INHERITED_PREFLIGHT_BUDGET_REQUIRED') from exc
        return state
    if not actions:raise ConsumerError('APPROVED_ROW_BUDGET_ACTION_REQUIRED')
    for action in actions:
        budget.reserve_and_persist(row['variant_id'],action['logical_action_id'],budget.remaining(),0)
    return budget.state.snapshot()
RuntimeDriver.reserve_variant_budget=_reserve_variant_budget


def _logical_dispatch_ledger(self):
    return DurableState(self.driver.root,self.driver.root/'guard'/'logical-request-bindings.json',{'actions':{},'physical_sends':[]})
FencedSupervisorBridge.logical_dispatch_ledger=_logical_dispatch_ledger

_previous_bound_dispatch=FencedSupervisorBridge.dispatch
def _dispatch_bound_request(self,**kwargs):
    request_sha=sha(canonical({'method':kwargs['method'],'params':kwargs['params']}));logical=kwargs['logical_action_id'];ledger=self.logical_dispatch_ledger()
    with ledger.edit() as state:
        old=state['actions'].get(logical)
        if old is not None and old['request_sha256']!=request_sha:raise ConsumerError('LOGICAL_REQUEST_HASH_CONFLICT')
        if old is None:state['actions'][logical]={'request_sha256':request_sha,'request_ref':immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.logical-request.json'),canonical({'method':kwargs['method'],'params':kwargs['params']})),'result_ref':None,'ack_id':None}
    result=_previous_bound_dispatch(self,**kwargs)
    if result.get('dispatch_granted'):
        result_ref=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.actual-ack-result.json'),canonical(result))
        with ledger.edit() as state:state['actions'][logical].update(result_ref=result_ref,ack_id=result['ack_id'])
        current=self.store.read()
        def bind_result(c):
            entry=c['idempotency_state']['logical_actions'][logical]
            if entry.get('ack_id')!=result['ack_id']:raise ConsumerError('ACK_RESULT_CAS_DRIFT')
            entry.update(result_ref=result_ref['path'],result_sha256=result_ref['sha256'])
            if c['idempotency_state']['logical_action_id']==logical:c['idempotency_state'].update(result_ref=result_ref['path'],result_sha256=result_ref['sha256'])
        self.store.compare_and_swap(current['record_revision'],bind_result,fencing_token=current['executor_lease']['fencing_token'],control_revision=current['goal_binding']['control_revision'])
        self.driver.capture_store_snapshot()
    elif result.get('decision')=='REUSE_DURABLE_RESULT':
        saved=ledger.snapshot()['actions'][logical]
        if saved['result_ref'] is None:raise ConsumerError('ACK_RESULT_SOURCE_MISSING_RECONCILE')
        durable=json.loads(read_ref(self.driver.root,saved['result_ref']))
        if durable['ack_id']!=saved['ack_id'] or result['logical_action']['ack_id']!=saved['ack_id']:raise ConsumerError('DURABLE_ACK_RESULT_DRIFT')
        result.update(reused_result_ref=saved['result_ref'],reused_response=durable['response'],reused_ack_id=saved['ack_id'])
    return result
FencedSupervisorBridge.dispatch=_dispatch_bound_request

_previous_physical_guard=FencedSupervisorBridge.guard_send
def _guard_with_actual_sink(self,frame,context):
    ledger=self.logical_dispatch_ledger();before=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.sink-before.json'),canonical(ledger.snapshot()['physical_sends']))
    current_ref=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.attempt-record.json'),self.store.path.read_bytes())
    attempt={'current_record_ref':current_ref,'requested_fencing_token':getattr(context,'fencing_token',self.driver.fence),'requested_control_revision':getattr(context,'control_revision',None),'requested_action_token':getattr(context,'action_token',None),'actual_guard_source_ref':{'path':str(_LOADED_PATH),'sha256':_LOADED_SHA},'logical_action_id':getattr(context,'logical_action_id',None)}
    attempt_ref=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.actual-attempt.json'),canonical(attempt))
    try:
        if getattr(self.driver,'_active_variant','').startswith('R06-'):
            from rgc_resume_store import ResumeStore
            other=ResumeStore(self.store.path);record=other.read()
            contender=other.claim_logical_action(record['record_revision'],context.logical_action_id,logical_action_request_sha256=context.request_sha256,owner_attempt_token='contender-before-ack:'+uuid.uuid4().hex,fencing_token=record['executor_lease']['fencing_token'],control_revision=record['goal_binding']['control_revision'])
            if contender.get('dispatch_allowed'):raise ConsumerError('SECOND_STARTED_CAS_GRANTED')
            immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.started-contender-cas.json'),canonical(contender))
        _previous_physical_guard(self,frame,context)
        with ledger.edit() as state:
            binding=state['actions'].get(context.logical_action_id)
            if binding is None or binding['request_sha256']!=context.request_sha256:raise ConsumerError('PHYSICAL_LOGICAL_BINDING_DRIFT')
            if any(e['logical_action_id']==context.logical_action_id for e in state['physical_sends']):raise ConsumerError('DUPLICATE_PHYSICAL_SEND_REJECTED')
            state['physical_sends'].append({'logical_action_id':context.logical_action_id,'request_sha256':context.request_sha256,'observed_monotonic_ns':time.monotonic_ns(),'send_receipt_ref':self.sent[-1]})
        response={'allowed':True,'reason_codes':[]}
    except Exception as exc:
        record=json.loads(read_ref(self.driver.root,current_ref));codes=[str(exc)]
        if attempt['requested_control_revision']!=record['goal_binding']['control_revision']:codes.append('STALE_CONTROL_REVISION')
        if attempt['requested_fencing_token']!=record['executor_lease']['fencing_token']:codes.append('STALE_FENCING_TOKEN')
        response={'allowed':False,'reason_codes':codes}
        raise
    finally:
        after=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.sink-after.json'),canonical(ledger.snapshot()['physical_sends']))
        response_ref=immutable(self.driver.root,self.driver.root/'guard'/(uuid.uuid4().hex+'.guard-response.json'),canonical(response))
        self.driver.capture_bound_event('guard_sink','guard_attempt',canonical({'attempt_ref':attempt_ref,'response_ref':response_ref}),lambda ref:{'attempt_ref':attempt_ref,'guard_response_ref':response_ref,'sink_before_ref':before,'sink_after_ref':after},None)
FencedSupervisorBridge.guard_send=_guard_with_actual_sink


def _recovery_actor(self,trigger,capability):
    self.require_runtime_capability(capability);plan=self.prepare_variant(self._current_row_ref);row=plan['approved_row'];binding=self._phase_config['row_inputs'][row['variant_id']]
    thread=self.owned_slot(row['thread_slots'][0],capability);before_session=self.host.session_id;actor={}
    if trigger=='turn_interrupted':
        actor=getattr(self,'_actual_turn_interrupt_actor',None)
        if actor is None:raise ConsumerError('ACTUAL_INTERRUPTED_TURN_ACTOR_REQUIRED')
    elif trigger=='executor_lost':
        from rgc_runtime_fixtures import FixtureExecutor
        template=binding.get('recovery_worker_spec_ref')
        if template is None:raise ConsumerError('RECOVERY_EXECUTOR_SPEC_REQUIRED')
        spec_ref=self.materialize_worker_spec(template);spec=json.loads(read_ref(self.root,spec_ref))
        if spec['mode']!='status_only' or spec['deadline_seconds']>30:raise ConsumerError('RECOVERY_LOST_EXECUTOR_NOT_BOUNDED')
        fixture=FixtureExecutor(self);worker=fixture.start_bounded_registered_worker(spec_ref,capability=capability)
        sample=fixture.sample_bounded_worker(worker);exit_receipt=worker['boundary'].terminate_owned(worker['key'])
        actor={'spec_ref':spec_ref,'actual_live_sample':sample,'owned_exit':exit_receipt,'creation_ref':worker['boundary'].proofs[worker['key']]['proof_ref']}
    elif trigger=='client_restart':
        key='pid:'+str(self.host.process.pid);creation=self.host_processes.proofs[key]['proof_ref'];exit_receipt=self.host_processes.terminate_owned(key)
        api=self.start_host(capability)
        self.bridge=FencedSupervisorBridge(self,self.resume_store.path,api.adapter,self.fresh_store_sources(self._phase_source_refs),capability)
        read=api.call('read_thread',thread,include_turns=True,capability=capability)
        spec={k:v for k,v in self.fixed_thread_spec().items() if k!='ephemeral'};spec['threadId']=thread
        resumed=api.call('resume_thread',spec,capability=capability)
        actor={'prior_creation_ref':creation,'actual_client_exit':exit_receipt,'actual_read':read,'actual_resume':resumed,'new_creation_ref':self.host_processes.proofs['pid:'+str(self.host.process.pid)]['proof_ref']}
    elif trigger=='thread_resumed':
        api=ExistingHostAPI(self,self.host);read=api.call('read_thread',thread,include_turns=True,capability=capability)
        spec={k:v for k,v in self.fixed_thread_spec().items() if k!='ephemeral'};spec['threadId']=thread
        actor={'actual_read':read,'actual_resume':api.call('resume_thread',spec,capability=capability)}
    else:raise ConsumerError('RECOVERY_TRIGGER_UNKNOWN')
    reference=immutable(self.root,self.root/(uuid.uuid4().hex+'.recovery-actor.json'),canonical({'trigger':trigger,'actor':actor,'thread_id':thread,'before_adapter_session_id':before_session,'after_adapter_session_id':self.host.session_id,'observed_monotonic_ns':time.monotonic_ns(),'current_parent_process_identity':process_identity(os.getpid())}))
    self._recovery_actor_ref=reference;return reference
RuntimeDriver.execute_recovery_actor=_recovery_actor

_previous_recover_source_checks=RuntimeDriver.recover_owned
def _recover_actual_entry(self,trigger_ref,*,capability=None,bridge=None):
    if capability is None:self._runtime_entry()
    self.require_runtime_environment(capability)
    request=read_ref(self.root,trigger_ref);received=immutable(self.root,self.root/(uuid.uuid4().hex+'.recovery-received.json'),canonical({'request_sha256':sha(request),'entrypoint':'RuntimeDriver.recover_owned','received_monotonic_ns':time.monotonic_ns()}))
    before=immutable(self.root,self.root/(uuid.uuid4().hex+'.recovery-pre-guard.json'),self.resume_store.path.read_bytes())
    self.capture_bound_event('driver_emission','private_caller_attempt',request,lambda ref:{'request_ref':trigger_ref,'received_ref':received,'pre_guard_store_ref':before},None)
    result=_previous_recover_source_checks(self,trigger_ref,capability=capability,bridge=bridge)
    trigger=json.loads(request);saved=json.loads(read_ref(self.root,trigger['last_valid_record_ref']));current=self.resume_store.read()
    if not result.get('source_checks') or not all(result['source_checks'].values()):return result
    actor_ref=getattr(self,'_recovery_actor_ref',None)
    if actor_ref is None or json.loads(read_ref(self.root,actor_ref))['trigger']!=trigger['trigger']:raise ConsumerError('RECOVERY_ACTOR_SOURCE_REQUIRED')
    sources=self.fresh_store_sources(self._phase_source_refs);observed=self.evaluate_action(sources)
    if not observed['eligible']:return {**observed,'recovery_performed':False}
    # Rotate fenced ownership only after the real actor and complete identity /
    # evidence reread. The original last-valid record remains immutable.
    from datetime import timedelta
    old_fence=current['executor_lease']['fencing_token'];control=current['goal_binding']['control_revision']
    def release(c):
        c['executor_lease']['state']='released';c['continuation'].update(action_token='recovery:'+uuid.uuid4().hex,token_control_revision=c['goal_binding']['control_revision'],token_record_revision=c['record_revision']+1)
    released=self.resume_store.compare_and_swap(current['record_revision'],release,fencing_token=old_fence,control_revision=control)
    now=datetime.now(timezone.utc);remaining=max(1,self.prepare_variant(self._current_row_ref)['approved_row']['wall_clock_seconds']-(time.monotonic_ns()-self._row_start_ns)/1e9)
    acquired=self.resume_store.acquire_lease(released['record_revision'],owner_id=self.producer_id,owner_role='builder',issued_at_utc=now.isoformat(),expires_at_utc=(now+timedelta(seconds=remaining)).isoformat(),control_revision=control)
    self.fence=acquired['executor_lease']['fencing_token'];self.token=acquired['continuation']['action_token'];self.bridge.source_refs=self.fresh_store_sources(self._phase_source_refs)
    refs=[]
    for step in ('goal','authority','control','record','repository','runtime','evidence','next_action'):
        getter={'goal':lambda r:r['goal_binding']['goal_sha256'],'authority':lambda r:r['goal_binding']['authority_sha256'],'control':lambda r:r['goal_binding']['control_revision'],'record':lambda r:r['record_id'],'repository':lambda r:r['repository'],'runtime':lambda r:r['runtime_profile'],'evidence':lambda r:r['last_progress'],'next_action':lambda r:r['next_action']}[step]
        saved_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.saved-axis.json'),canonical(getter(saved)));current_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.current-axis.json'),canonical(getter(current)))
        inputs=immutable(self.root,self.root/(uuid.uuid4().hex+'.recovery-step-inputs.json'),canonical({'trigger':trigger['trigger'],'saved_ref':saved_ref,'current_ref':current_ref,'actor_ref':actor_ref,'source_refs':sources}))
        output=immutable(self.root,self.root/(uuid.uuid4().hex+'.recovery-step-output.json'),canonical({'matched_sha256':sha(read_ref(self.root,current_ref)),'next_action':current['next_action']['action_target'],'next_logical_action':current['next_action']['action_id'],'fresh_fencing_token':self.fence,'fresh_action_token':self.token}))
        self.capture_bound_event('store','recovery_step',canonical({'inputs_ref':inputs,'output_ref':output}),lambda ref,s=step,i=inputs,o=output:{'step':s,'inputs_ref':i,'output_ref':o},None);refs.append(output)
    self.capture_store_snapshot()
    return {**result,'actual_actor_ref':actor_ref,'ordered_step_output_refs':refs,'fresh_fenced_record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.recovered-record.json'),self.resume_store.path.read_bytes()),'recovery_performed':True,'next_dispatch_required':current['next_action']['action_id'],'runtime_acceptance':'not_evaluated','dispatch_authority':False}
RuntimeDriver.recover_owned=_recover_actual_entry

_previous_recovery_trigger=RuntimeDriver.execute_recovery_trigger
def _actual_recovery_trigger(self,trigger,capability):
    self.execute_recovery_actor(trigger,capability)
    return _previous_recovery_trigger(self,trigger,capability)
RuntimeDriver.execute_recovery_trigger=_actual_recovery_trigger


def _contender_same_logical(self,name,approved,thread,capability):
    self.require_runtime_capability(capability)
    from rgc_resume_store import ResumeStore
    logical=approved['logical_action_id'];matches=[json.loads(read_ref(self.root,r)) for r in getattr(self,'actual_issuances',[]) if json.loads(read_ref(self.root,r))['logical_action_id']==logical]
    if len(matches)!=1:raise ConsumerError('CONTENDER_ORIGINAL_ISSUANCE_REQUIRED')
    request=json.loads(read_ref(self.root,matches[0]['action_ref']));store=ResumeStore(self.resume_store.path);before=self.resume_store.read();sink_before=self.bridge.logical_dispatch_ledger().snapshot()['physical_sends']
    claim=store.claim_logical_action(before['record_revision'],logical,logical_action_request_sha256=sha(canonical({'method':request['method'],'params':request['params']})),owner_attempt_token='contender:'+uuid.uuid4().hex,fencing_token=before['executor_lease']['fencing_token'],control_revision=before['goal_binding']['control_revision'])
    reused=self.bridge.dispatch(**request);after=self.resume_store.read();sink_after=self.bridge.logical_dispatch_ledger().snapshot()['physical_sends']
    if claim.get('dispatch_allowed') or reused.get('dispatch_granted') or reused.get('actual_guarded_send_count')!=0 or sink_before!=sink_after:raise ConsumerError('DUPLICATE_CONTENDER_PHYSICAL_EFFECT')
    if reused.get('reused_ack_id')!=before['idempotency_state']['logical_actions'][logical]['ack_id']:raise ConsumerError('CONTENDER_ACK_NOT_REUSED')
    receipt=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-contender-reuse.json'),canonical({'original_request_ref':matches[0]['action_ref'],'second_cas_claim':claim,'actual_second_dispatch':reused,'sink_before':sink_before,'sink_after':sink_after,'record_before':before,'record_after':after}))
    self.capture_store_snapshot()
    return {'actual_contender_receipt_ref':receipt,'same_request_ack_result_reused':True,'second_send_count':0,'runtime_acceptance':'not_evaluated','dispatch_authority':False}

_previous_contender_row=RuntimeDriver.execute_contender_row
def _contender_guarded_row(self,name,approved,thread,capability):
    reuse=_contender_same_logical(self,name,approved,thread,capability)
    if name=='R06-EXPIRED_LEASE_LATE_OWNER':reuse['lease_contender']=_previous_contender_row(self,name,approved,thread,capability)
    return reuse
RuntimeDriver.execute_contender_row=_contender_guarded_row


def _execute_long_control(self,approved):
    from rgc_runtime_fixtures import FixtureExecutor,long_stage_specs
    name=self._active_variant;binding=self._phase_config['row_inputs'][name];template=binding.get('long_worker_spec_ref')
    if name!='R03-LONG-CONTROL' or template is None:raise ConsumerError('LONG_CONTROL_FIXED_SPEC_REQUIRED')
    self._worker_action_token=self.token;spec_ref=self.materialize_worker_spec(template);spec=json.loads(read_ref(self.root,spec_ref))
    if spec['mode']!='long_control' or spec['deadline_seconds']!=600:raise ConsumerError('LONG_CONTROL_FIXED_DEADLINE_REQUIRED')
    elapsed=(time.monotonic_ns()-self._row_start_ns)/1e9
    if elapsed+610>720:raise ConsumerError('LONG_CONTROL_EXCEEDS_ROW_BUDGET')
    stages=long_stage_specs(self.root,spec);executor=FixtureExecutor(self);worker=executor.start_bounded_registered_worker(spec_ref,capability=self._runtime_capability);samples=[]
    try:
        until=worker['started_ns']+550*10**9
        while time.monotonic_ns()<until:
            self.require_runtime_capability(self._runtime_capability);samples.append(executor.sample_bounded_worker(worker));self.capture_store_snapshot()
        remaining=max(1,(self._row_start_ns+710*10**9-time.monotonic_ns())/1e9)
        stdout,stderr=worker['handle'].communicate(timeout=remaining)
        if worker['handle'].returncode!=0:raise ConsumerError('LONG_WORKER_NOT_SUCCESSFUL')
        observed_stages={}
        for sample in samples:
            ipc=json.loads(read_ref(self.root,sample['ipc_ref']))
            if 'stage_index' in ipc:
                index=ipc['stage_index']
                if index in observed_stages:raise ConsumerError('LONG_STAGE_IPC_DUPLICATED')
                observed_stages[index]=sample
        if set(observed_stages)!=set(range(8)):raise ConsumerError('LONG_STAGE_IPC_INCOMPLETE')
        progress=[]
        for index,(stage_ref,stage) in enumerate(stages):
            sample=observed_stages[index];ipc=json.loads(read_ref(self.root,sample['ipc_ref']));output_ref=ipc['stage_output_ref']
            if ipc['stage_spec_ref']!=stage_ref:raise ConsumerError('LONG_STAGE_SOURCE_DRIFT')
            outcome={'spec_ref':stage_ref,'pid':worker['pid'],'process_identity_at_launch':worker['process_identity'],'actual_exit_code':worker['handle'].returncode,'action_token':spec['action_token'],'unit_id':spec['unit_id'],'output_ref':output_ref,'long_parent_spec_ref':spec_ref,'stage_ipc_ref':sample['ipc_ref'],'stage_os_ref':sample['os_sample_ref'],'actual_terminal_stdout_sha256':sha(stdout),'actual_terminal_stderr_sha256':sha(stderr)}
            wait_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.long-stage-terminal.json'),canonical(outcome))
            execution=self.observer.capture_worker_execution(worker['boundary'],worker['key'],stage_ref,wait_ref)
            before=self.register_source(stage['input_refs'][0]['path'],'fixture_controller');after=self.register_source(output_ref['path'],'fixture_controller');opened=self.register_source(stage['open_item_ref']['path'],'store')
            for ref in stage['input_refs']:self.register_basis_origin(ref)
            delta=immutable(self.root,self.root/(uuid.uuid4().hex+'.long-stage-delta.json'),canonical({'kind':stage['mode'],'unit_id':stage['unit_id'],'before_ref':before,'after_ref':after,'open_item_ref':opened}));delta=self.register_source(delta['path'],'fixture_controller');issued=self.issue_registered_progress_receipt(delta,opened)
            event=self.capture_bound_event('progress','classifier_receipt',canonical({'issued_receipt_ref':issued['payload']['receipt_ref'],'actual_execution_ref':execution,'spec_ref':stage_ref}),lambda ref,p=issued['payload']:p,self.token)
            receipt=json.loads(read_ref(self.root,issued['payload']['receipt_ref']));current=self.resume_store.read()
            def accept(c):c['last_progress'].update(evidence_id=receipt['evidence_id'],evidence_type=receipt['evidence_type'],evidence_ref=after['path'],evidence_sha256=after['sha256'],source_event_id=receipt['source_event_id'],action_token=self.token,observed_at_utc=receipt['observed_at_utc'],supervisor_monotonic_sequence=event['sequence'])
            self.resume_store.compare_and_swap(current['record_revision'],accept,fencing_token=current['executor_lease']['fencing_token'],control_revision=current['goal_binding']['control_revision']);self._accepted_progress_refs=getattr(self,'_accepted_progress_refs',{});self._accepted_progress_refs[after['sha256']]=after;self.capture_store_snapshot();progress.append(issued['payload']['receipt_ref'])
        item_id=binding.get('unit_item_bindings',{}).get(approved['logical_action_id'])
        if item_id is None:raise ConsumerError('LONG_PRIVATE_OWNER_ITEM_REQUIRED')
        current=self.resume_store.read()
        if not any(i['item_id']==item_id and i['state'] in {'open','ready','pending'} for i in current['open_items']):raise ConsumerError('LONG_PRIVATE_OWNER_UNIT_NOT_PENDING')
        def finish(c):
            for item in c['open_items']:
                if item['item_id']==item_id:item['state']='completed'
            if not any(i['state'] in {'open','ready','pending'} for i in c['open_items']):c['next_action'].update(action_id='private_stop',action_kind='none',action_target='')
        accepted=self.resume_store.compare_and_swap(current['record_revision'],finish,fencing_token=current['executor_lease']['fencing_token'],control_revision=current['goal_binding']['control_revision'])
        self.capture_store_snapshot()
        if not any(i['state'] in {'open','ready','pending'} for i in accepted['open_items']):
            predicate=binding.get('private_stop_predicate_ref')
            if predicate is None or json.loads(read_ref(self.root,predicate))!={'type':'open_unit_ids_empty'}:raise ConsumerError('LONG_PRIVATE_OWNER_PREDICATE_REQUIRED')
            self.capture_bound_event('driver_emission','cleanup',canonical({'emission':'private_goal_stop','private_stop_predicate_ref':predicate,'actual_record_ref':immutable(self.root,self.root/(uuid.uuid4().hex+'.long-private-complete.json'),self.resume_store.path.read_bytes()),'private_only':True}),lambda ref:{'exit_sample_ref':ref},None)
        return {'same_owned_worker_pid':worker['pid'],'actual_samples':samples,'eight_stage_progress_receipt_refs':progress,'terminal_exit_code':worker['handle'].returncode,'long_worker_spec_ref':spec_ref,'runtime_acceptance':'not_evaluated'}
    finally:worker['boundary'].terminate_owned(worker['key'])
RuntimeDriver.execute_long_control=_execute_long_control


_previous_private_owner_snapshot=RuntimeDriver.capture_store_snapshot
def _capture_private_owner(self):
    result=_previous_private_owner_snapshot(self)
    binding=getattr(self,'_phase_config',{}).get('row_inputs',{}).get(getattr(self,'_active_variant',''),{})
    predicate=binding.get('private_stop_predicate_ref')
    if predicate is not None and getattr(self,'row_capture',None) is not None:
        if json.loads(read_ref(self.root,predicate))!={'type':'open_unit_ids_empty'}:raise ConsumerError('PRIVATE_OWNER_PREDICATE_NOT_CLOSED')
        record_ref=result['payload']['record_ref']
        self.capture_bound_event('driver_emission','cleanup',canonical({'emission':'private_owner_snapshot','private_stop_predicate_ref':predicate,'actual_record_ref':record_ref,'owner_generation':self.run_id,'private_only':True}),lambda ref:{'exit_sample_ref':ref},None)
    return result
RuntimeDriver.capture_store_snapshot=_capture_private_owner

_previous_long_materialize=RuntimeDriver.materialize_worker_spec
def _materialize_long_worker(self,spec_ref):
    reference=_previous_long_materialize(self,spec_ref);spec=json.loads(read_ref(self.root,reference))
    if spec['mode']=='long_control':
        manifest=json.loads(read_ref(self.root,spec['input_refs'][0]))
        if set(manifest)!={'stage_spec_refs'} or len(manifest['stage_spec_refs'])!=8:raise ConsumerError('LONG_STAGE_MANIFEST_REQUIRED')
        stages=[self.materialize_worker_spec(ref) for ref in manifest['stage_spec_refs']]
        manifest_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-long-stages.json'),canonical({'stage_spec_refs':stages}));spec['input_refs']=[manifest_ref]
        reference=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-long-spec.json'),canonical(spec))
    return reference
RuntimeDriver.materialize_worker_spec=_materialize_long_worker


def _actual_takeover_fence(self,worker,binding):
    from rgc_resume_store import StoreConflict
    from rgc_app_server_adapter import RequestContext
    from datetime import timedelta
    current=self.resume_store.read();old=copy.deepcopy(current);old_fence=current['executor_lease']['fencing_token']
    next_ref=binding.get('takeover_next_action_ref')
    if next_ref is None:raise ConsumerError('TAKEOVER_APPROVED_NEXT_ACTION_SOURCE_REQUIRED')
    next_action=json.loads(read_ref(self.root,next_ref))
    if set(next_action)!=set(current['next_action']) or next_action['action_id']!='R03-TAKEOVER-START-03' or next_action['action_kind']!='turn/start':raise ConsumerError('TAKEOVER_NEXT_ACTION_NOT_APPROVED')
    exit_receipt=worker['boundary'].terminate_owned(worker['key'])
    def release(c):
        c['executor_lease']['state']='released';c['next_action']=next_action
    released=self.resume_store.compare_and_swap(current['record_revision'],release,fencing_token=old_fence,control_revision=current['goal_binding']['control_revision'])
    now=datetime.now(timezone.utc);acquired=self.resume_store.acquire_lease(released['record_revision'],owner_id=self.producer_id,owner_role='builder',issued_at_utc=now.isoformat(),expires_at_utc=(now+timedelta(seconds=260)).isoformat(),control_revision=released['goal_binding']['control_revision'])
    self.fence=acquired['executor_lease']['fencing_token']
    token='takeover:'+uuid.uuid4().hex
    def mint(c):c['continuation'].update(action_token=token,token_control_revision=c['goal_binding']['control_revision'],token_record_revision=c['record_revision']+1)
    acquired=self.resume_store.compare_and_swap(acquired['record_revision'],mint,fencing_token=self.fence,control_revision=acquired['goal_binding']['control_revision']);self.token=token;self.bridge.source_refs=self.fresh_store_sources(self._phase_source_refs)
    try:self.resume_store.compare_and_swap(acquired['record_revision'],lambda c:None,fencing_token=old_fence,control_revision=acquired['goal_binding']['control_revision']);raise ConsumerError('TAKEOVER_OLD_CAS_ALLOWED')
    except StoreConflict as exc:cas_rejection=str(exc)
    issuances=[json.loads(read_ref(self.root,r)) for r in self.actual_issuances if json.loads(read_ref(self.root,r))['fixture_id']=='checkpoint']
    if not issuances:raise ConsumerError('TAKEOVER_LAST_HOST_ISSUANCE_REQUIRED')
    action=json.loads(read_ref(self.root,issuances[-1]['action_ref']));context=RequestContext(logical_action_id=action['logical_action_id'],action_token=action['action_token'],authority_revision=action['authority_revision'],control_revision=old['goal_binding']['control_revision'],record_revision=old['record_revision'],request_sha256=sha(canonical({'method':action['method'],'params':action['params']})))
    new_fence=self.fence;self.fence=old_fence
    try:
        self.bridge.guard_send({'method':action['method'],'params':action['params']},context)
        raise ConsumerError('TAKEOVER_OLD_PHYSICAL_GUARD_ALLOWED')
    except ConsumerError as exc:
        if str(exc)=='TAKEOVER_OLD_PHYSICAL_GUARD_ALLOWED':raise
        physical_rejection=str(exc)
    finally:self.fence=new_fence
    last=immutable(self.root,self.root/(uuid.uuid4().hex+'.takeover-last-valid.json'),self.resume_store.path.read_bytes())
    handoff=immutable(self.root,self.root/(uuid.uuid4().hex+'.actual-takeover-handoff.json'),canonical({'last_valid_record_ref':last,'actual_worker_creation_ref':worker['boundary'].proofs[worker['key']]['proof_ref'],'actual_worker_exit':exit_receipt,'old_fencing_token':old_fence,'new_fencing_token':self.fence,'new_action_token':self.token,'old_cas_rejection':cas_rejection,'old_physical_guard_rejection':physical_rejection,'approved_next_action_ref':next_ref,'source_refs':self._phase_source_refs}))
    self.takeover_handoff_ref=handoff;self.capture_store_snapshot();return handoff
RuntimeDriver.perform_actual_takeover_fence=_actual_takeover_fence

_previous_takeover_private_variant=RuntimeDriver.execute_private_variant
def _takeover_recovery_private_variant(self,plan,capability):
    if plan['approved_row']['variant_id']!='R03-TAKEOVER-RECOVERY':return _previous_takeover_private_variant(self,plan,capability)
    self.require_runtime_capability(capability);handoff=json.loads(read_ref(self.root,self.takeover_handoff_ref));self._phase_source_refs=handoff['source_refs'];self.bridge.source_refs=self.fresh_store_sources(self._phase_source_refs)
    self._recovery_actor_ref=immutable(self.root,self.root/(uuid.uuid4().hex+'.takeover-recovery-actor.json'),canonical({'trigger':'executor_lost','actual_lost_executor_creation_ref':handoff['actual_worker_creation_ref'],'actual_executor_exit':handoff['actual_worker_exit'],'actual_handoff_ref':self.takeover_handoff_ref}))
    request=immutable(self.root,self.root/(uuid.uuid4().hex+'.takeover-recovery-request.json'),canonical({'trigger':'executor_lost','last_valid_record_ref':handoff['last_valid_record_ref'],'source_refs':self.fresh_store_sources(self._phase_source_refs)}))
    recovery=self.recover_owned(request,capability=capability,bridge=self.bridge)
    if not recovery.get('recovery_performed'):return {'variant_id':'R03-TAKEOVER-RECOVERY','actual_recovery':recovery,'runtime_acceptance':'not_evaluated'}
    approved=next(a['approved_action'] for a in plan['actions'] if a['approved_action']['logical_action_id']=='R03-TAKEOVER-START-03');thread=self.owned_slot('T09',capability)
    action_ref,audit_ref,issuance=self.materialize_live_action(approved,'unit',thread);dispatch=self.dispatch_host(action_ref,audit_ref)
    if not dispatch.get('dispatch_granted'):raise ConsumerError('TAKEOVER_NEXT_UNIT_NOT_DISPATCHED')
    turn=dispatch['response']['turn']['id'];terminal=self.wait_owned_terminal(thread,turn,self._row_start_ns+180*10**9);issued=self.bind_actual_issuance(issuance,turn);progress=self.execute_unit_fixture(approved)
    control=self.apply_row_control('pause')
    return {'variant_id':'R03-TAKEOVER-RECOVERY','actual_recovery':recovery,'actual_next_unit_dispatch':dispatch,'terminal_ref':terminal,'actual_issuance_ref':issued,'actual_unit_progress':progress,'actual_final_private_pause':control,'runtime_acceptance':'not_evaluated','dispatch_authority':False}
RuntimeDriver.execute_private_variant=_takeover_recovery_private_variant


import rgc_runtime_closure_guard as _closure_guard

@_closure_guard.protect
def replay_multi_capture_aggregate(*,repo,aggregate_request_ref,caller_aggregate_plan_ref,caller_aggregate_code_pin_ref):
    """只读聚合 caller；无需构造运行 driver，不能获得 dispatch authority。"""
    from rgc_runtime_observer import derive_multi_capture_fields
    return derive_multi_capture_fields(repo=repo,aggregate_request_ref=aggregate_request_ref,caller_aggregate_plan_ref=caller_aggregate_plan_ref,caller_aggregate_code_pin_ref=caller_aggregate_code_pin_ref)

_closure_guard.seal_loaded_modules(__name__)
