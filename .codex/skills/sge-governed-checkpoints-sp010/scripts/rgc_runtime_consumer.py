"""Source-bound local RGC consumer; no host, model, or fault-worker launch."""
from __future__ import annotations
import copy
import fcntl
import hashlib
import inspect
import json
import math
import os
import re
import stat
import time
import uuid
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
import jsonschema

REVISION = 'P3-current-profile-frozen-v15'
ORACLE_KEYS = frozenset({'expected', 'case_id', 'source_case_id', 'failure_label',
                         'failure_fingerprint', 'oracle', 'producer_verdict', 'covers', 'scenario_id', 'fault_label', 'fixture_alias'})
LIMITS = {'threads': 32, 'turn_starts': 128, 'wall_clock_seconds': 10800}

class ConsumerError(ValueError):
    pass

def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False).encode()

def sha(raw):
    return hashlib.sha256(raw).hexdigest()

# Pin the bytes once while this source module is loaded; later disk hashes
# cannot retroactively identify the code already executing in this process.
_LOADED_SOURCE_PATH = Path(__file__).absolute()
_LOADED_SOURCE_BYTES = _LOADED_SOURCE_PATH.read_bytes()
_LOADED_SOURCE_SHA256 = sha(_LOADED_SOURCE_BYTES)

def loaded_source_identity():
    return {'path': str(_LOADED_SOURCE_PATH), 'sha256': _LOADED_SOURCE_SHA256}

def reject_oracle(value):
    if isinstance(value, dict):
        if ORACLE_KEYS.intersection(value):
            raise ConsumerError('ORACLE_FIELD_IN_PRODUCTION')
        for item in value.values(): reject_oracle(item)
    elif isinstance(value, list):
        for item in value: reject_oracle(item)

def confined(root, target):
    root = Path(root).absolute(); path = Path(target)
    path = path.absolute() if path.is_absolute() else root/path
    if '..' in path.parts: raise ConsumerError('PATH_TRAVERSAL')
    if not path.is_relative_to(root): raise ConsumerError('PATH_ESCAPE')
    for component in (path, *path.parents):
        if component.is_symlink(): raise ConsumerError('SYMLINK_DENIED')
    if not path.resolve().is_relative_to(root.resolve()): raise ConsumerError('REALPATH_ESCAPE')
    return path

@contextmanager
def opened(root, target, flags, mode=0o600):
    root=Path(root).absolute(); path=confined(root,target); parts=path.relative_to(root).parts
    if not parts: raise ConsumerError('FILE_PATH_REQUIRED')
    directory=os.open(root,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW); fd=None
    try:
        for component in parts[:-1]:
            child=os.open(component,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW,dir_fd=directory)
            os.close(directory); directory=child
        fd=os.open(parts[-1],flags|os.O_NOFOLLOW,mode,dir_fd=directory)
        if not stat.S_ISREG(os.fstat(fd).st_mode): raise ConsumerError('REGULAR_FILE_REQUIRED')
        yield fd
    finally:
        if fd is not None: os.close(fd)
        os.close(directory)

def read_bytes(root,path):
    try:
        with opened(root,path,os.O_RDONLY) as fd:
            with os.fdopen(os.dup(fd),'rb') as f: return f.read()
    except OSError as exc: raise ConsumerError('SOURCE_UNREADABLE') from exc

def read_ref(root,ref):
    if set(ref)!={'path','sha256'} or not re.fullmatch('[a-f0-9]{64}',ref['sha256']): raise ConsumerError('SOURCE_REF_INVALID')
    raw=read_bytes(root,ref['path'])
    if sha(raw)!=ref['sha256']: raise ConsumerError('SOURCE_DIGEST_DRIFT')
    return raw

def immutable(root,path,raw):
    with opened(root,path,os.O_WRONLY|os.O_CREAT|os.O_EXCL) as fd:
        view=memoryview(raw)
        while view: view=view[os.write(fd,view):]
        os.fsync(fd); os.fchmod(fd,0o400)
    return {'path':str(Path(path).absolute()),'sha256':sha(raw)}

def pointer(obj,path):
    parts=path.lstrip('/').split('/') if path.startswith('/') else path.split('.')
    for part in parts:
        part=part.replace('~1','/').replace('~0','~')
        if not isinstance(obj,dict) or part not in obj: raise ConsumerError('REQUIRED_PATH_MISSING:'+path)
        obj=obj[part]
    return obj

def json_type(value):
    return {type(None):'null',bool:'boolean',int:'integer',float:'number',str:'string',dict:'object',list:'array'}.get(type(value),'invalid')

def strict_shape(value,contract,required):
    if not isinstance(value,dict): raise ConsumerError('OBJECT_REQUIRED')
    def visit(obj,prefix=''):
        for key,item in obj.items():
            path=prefix+key
            if path not in contract['allowed_types'] or json_type(item) not in contract['allowed_types'][path]: raise ConsumerError('FIELD_TYPE_OR_ALLOWLIST:'+path)
            if isinstance(item,dict): visit(item,path+'.')
            elif isinstance(item,float) and not math.isfinite(item): raise ConsumerError('NONFINITE_VALUE')
            elif isinstance(item,str) and (not item or item.lower() in {'unknown','placeholder','unresolved'}): raise ConsumerError('UNRESOLVED_VALUE:'+path)
    visit(value)
    for path in required: pointer(value,path)

def utc(value):
    try:
        stamp=datetime.fromisoformat(value.replace('Z','+00:00'))
        if stamp.tzinfo is None: raise ValueError('timezone required')
        return stamp
    except (ValueError,AttributeError) as exc: raise ConsumerError('UTC_INVALID') from exc

class RuntimeConsumer:
    def __init__(self,frozen_dir,repo,source_root,evidence_root,trusted_sources,token_registry_path):
        self.repo=Path(repo).absolute(); self.source_root=Path(source_root).absolute(); self.evidence_root=Path(evidence_root).absolute()
        confined(self.evidence_root,self.evidence_root); self.evidence_root.mkdir(parents=True,exist_ok=True)
        self.trusted_sources={str(confined(self.source_root,p)):role for p,role in trusted_sources.items()}
        self.token_registry_path=confined(self.source_root,token_registry_path); self.frozen_dir=confined(self.repo,frozen_dir)
        package=json.loads(read_bytes(self.repo,self.frozen_dir/'PackageManifest.json'))
        self.pins={ref['path']:ref['sha256'] for ref in package['files']}
        self.docs={}
        for name in ('Cases.json','Contract.json','SourceBindings.json','RuntimeInvocation.schema.json'):
            path=self.frozen_dir/name; rel=str(path.relative_to(self.repo))
            if rel not in self.pins: raise ConsumerError('FROZEN_PACKAGE_PIN_MISSING')
            self.docs[name]=json.loads(read_ref(self.repo,{'path':rel,'sha256':self.pins[rel]}))
        self.cases=self.docs['Cases.json']; self.bindings=self.docs['SourceBindings.json']; self.schema=self.docs['RuntimeInvocation.schema.json']
        self.profile_ref=self.bindings['profile_ref']; self.profile=json.loads(read_ref(self.repo,self.profile_ref))

    def _verify_frozen(self):
        for name in self.docs:
            rel=str((self.frozen_dir/name).relative_to(self.repo)); read_ref(self.repo,{'path':rel,'sha256':self.pins[rel]})
        read_ref(self.repo,self.profile_ref)
        if json.loads(read_ref(self.repo,self.bindings['approved_authority'])).get('status')!='approved': raise ConsumerError('AUTHORITY_NOT_APPROVED')

    def _validate_loaded_source(self,ref):
        if confined(self.repo,ref['path'])!=_LOADED_SOURCE_PATH: raise ConsumerError('CONSUMER_OBSERVER_SOURCE_NOT_ACTUAL')
        raw=read_ref(self.repo,ref)
        if ref['sha256']!=_LOADED_SOURCE_SHA256 or sha(raw)!=_LOADED_SOURCE_SHA256: raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
        return raw

    @staticmethod
    def _validate_source_metadata(raw,meta,registry):
        token=registry.get('current_action_token')
        if not isinstance(token,str) or token.lower() in {'','unknown','placeholder','unresolved'}: raise ConsumerError('CURRENT_TOKEN_UNKNOWN')
        owner=registry.get('clock_owner')
        if not isinstance(owner,str) or owner.lower() in {'','unknown','placeholder','unresolved'}: raise ConsumerError('CLOCK_OWNER_UNKNOWN')
        if set(meta)!={'payload_sha256','causal_action_token','clock_owner','start','end','sequence','continuity'}: raise ConsumerError('SOURCE_METADATA_NOT_CLOSED')
        if meta['payload_sha256']!=sha(raw) or meta['causal_action_token']!=token: raise ConsumerError('SOURCE_CAUSAL_OR_HASH_MISMATCH')
        if meta['clock_owner']!=owner or meta['continuity']!='observed_gap_free': raise ConsumerError('CLOCK_OWNER_OR_GAP')
        if any(type(meta[k]) not in (int,float) or not math.isfinite(meta[k]) for k in ('start','end')): raise ConsumerError('CLOCK_TYPE')
        if not 0<=meta['start']<=meta['end']<=time.monotonic() or type(meta['sequence']) is not int or meta['sequence']<1: raise ConsumerError('CLOCK_OR_SEQUENCE_INVALID')
        return {'clock_owner':owner,'start':meta['start'],'end':meta['end'],'continuity':'observed_gap_free'}

    def _validate_dynamic_bindings(self,case_id,p,registry):
        pending=[];token=registry['current_action_token']
        for binding in self.bindings['bindings']:
            if binding['case_id']!=case_id: continue
            value=pointer(p,binding['frozen_input_pointer'])
            if json_type(value)!=binding['expected_type']: raise ConsumerError('DYNAMIC_BINDING_TYPE:'+binding['binding_id'])
            if isinstance(value,str) and (value in {'unknown','placeholder','f1','f2','attempt-alpha'} or re.fullmatch(r'(.)\1{63}',value)): raise ConsumerError('DYNAMIC_BINDING_PLACEHOLDER')
            key=binding['frozen_input_pointer'].rsplit('/',1)[-1]
            if key=='current_action_token' and value!=token: raise ConsumerError('CURRENT_TOKEN_DRIFT')
            if key in {'causal_action_token','write_fencing_token','current_fencing_token'} and value not in registry.get('issued_tokens',[]): raise ConsumerError('TOKEN_NOT_IN_INDEPENDENT_REGISTRY')
            if key=='current_fencing_token' and value!=registry.get('current_fencing_token'): raise ConsumerError('CURRENT_FENCE_DRIFT')
            if key=='current_control_revision' and value!=registry.get('current_control_revision'): raise ConsumerError('CURRENT_CONTROL_DRIFT')
            if key.endswith('_utc') or key=='deadline_at':
                if not utc(registry['utc_start'])<=utc(value)<=utc(registry['utc_end']): raise ConsumerError('UTC_OUTSIDE_OBSERVED_WINDOW')
            if key.endswith('evidence_ref'):
                container=pointer(p,binding['frozen_input_pointer'].rsplit('/',1)[0]);raw=read_bytes(self.source_root,value)
                if container.get('evidence_sha256')!=sha(raw): raise ConsumerError('EVIDENCE_BYTES_DIGEST_MISMATCH')
                pending.append((binding['binding_id']+'.source',raw))
        return pending

    def validate_request(self,operation,request):
        self._verify_frozen(); reject_oracle(request)
        if set(request)!={'schema_version','contract_revision','context','parameters'}: raise ConsumerError('REQUEST_TOP_LEVEL_NOT_CLOSED')
        op=self.cases['operation_input_contracts'].get(operation)
        if op is None: raise ConsumerError('OPERATION_NOT_IN_TYPED_CONTRACT')
        if request['schema_version']!=op['request_schema_version'] or request['contract_revision']!=REVISION: raise ConsumerError('REQUEST_REVISION_MISMATCH')
        strict_shape(request['context'],self.cases['shared_typed_context_contract'],op['required_context_paths'])
        strict_shape(request['parameters'],op,sorted(set(op['required_parameter_paths'])|set(op.get('safety_critical_parameter_paths',[]))))
        if request['context']['runtime']['profile_id']!=self.profile['profile_id']: raise ConsumerError('PROFILE_CONTEXT_MISMATCH')

    def freeze_invocation(self,spec,independent_sources,profile,known_token_registry,consumer_source_ref,observer_source_ref):
        if set(spec)!={'operation','source_case_id'}: raise ConsumerError('INVOCATION_SPEC_NOT_CLOSED')
        case=next((c for c in self.cases['cases'] if c['case_id']==spec['source_case_id']),None)
        if case is None or case['operation']!=spec['operation']: raise ConsumerError('AUDIT_OPERATION_MISMATCH')
        if set(independent_sources)!={'context','parameters'}: raise ConsumerError('TWO_SOURCE_DOCUMENTS_REQUIRED')
        if profile!=self.profile_ref: raise ConsumerError('PROFILE_REF_MISMATCH')
        for code_ref in (consumer_source_ref,observer_source_ref):
            self._validate_loaded_source(code_ref)
        if confined(self.source_root,known_token_registry['path'])!=self.token_registry_path or self.trusted_sources.get(str(self.token_registry_path))!='driver': raise ConsumerError('EXTERNAL_TOKEN_REGISTRY')
        registry=json.loads(read_ref(self.source_root,known_token_registry)); token=registry.get('current_action_token')
        if not isinstance(token,str) or token in {'','unknown','placeholder'}: raise ConsumerError('CURRENT_TOKEN_UNKNOWN')
        docs={}; snapshots=[]; windows=[]; pending=[]
        for key,descriptor in independent_sources.items():
            if set(descriptor)!={'ref','metadata'}: raise ConsumerError('SOURCE_DESCRIPTOR_NOT_CLOSED')
            path=confined(self.source_root,descriptor['ref']['path']); meta_path=confined(self.source_root,descriptor['metadata']['path'])
            if self.trusted_sources.get(str(path)) not in {'observer','store','driver'} or self.trusted_sources.get(str(meta_path))!='observer': raise ConsumerError('SOURCE_PRODUCER_UNTRUSTED')
            raw=read_ref(self.source_root,descriptor['ref']); meta_raw=read_ref(self.source_root,descriptor['metadata']); meta=json.loads(meta_raw)
            self._validate_source_metadata(raw,meta,registry)
            docs[key]=json.loads(raw); reject_oracle(docs[key]); windows.append(meta); pending.extend([(key+'.json',raw),(key+'-metadata.json',meta_raw)])
        op=spec['operation']; contract=self.cases['operation_input_contracts'].get(op)
        if contract is None: raise ConsumerError('OPERATION_NOT_IN_TYPED_CONTRACT')
        request={'schema_version':contract['request_schema_version'],'contract_revision':REVISION,'context':docs['context'],'parameters':docs['parameters']}
        self.validate_request(op,request); p=request['parameters']
        pending.extend(self._validate_dynamic_bindings(spec['source_case_id'],p,registry))
        for name,ref,scope in [('registry',known_token_registry,self.source_root),('profile',profile,self.repo),('consumer',consumer_source_ref,self.repo),('observer',observer_source_ref,self.repo)]: pending.append((name+'.source',read_ref(scope,ref)))
        # Reopen the registry at the side-effect boundary, not just at parse time.
        read_ref(self.source_root,known_token_registry)
        run=self.evidence_root/uuid.uuid4().hex; run.mkdir(mode=0o700)
        for name,raw in pending: snapshots.append(immutable(self.evidence_root,run/name,raw))
        audit={'schema_version':'rgc_runtime_invocation_v15','contract_revision':REVISION,'source_case_id':spec['source_case_id'],'operation':op,'typed_request':request,'request_sha256':sha(canonical(request)),'profile_ref':profile,'consumer_source_ref':consumer_source_ref,'observer_source_ref':observer_source_ref,'source_bytes':snapshots,'monotonic_window':{'clock_owner':registry['clock_owner'],'start':min(w['start'] for w in windows),'end':max(w['end'] for w in windows),'continuity':'observed_gap_free'}}
        audit['invocation_identity_sha256']=sha(canonical(audit)); jsonschema.Draft202012Validator(self.schema).validate(audit)
        immutable(self.evidence_root,run/'request.json',canonical(request)); ref=immutable(self.evidence_root,run/'audit.json',canonical(audit))
        return {'request':copy.deepcopy(request),'audit_ref':ref,'invocation_identity_sha256':audit['invocation_identity_sha256']}

    materialize_and_freeze=freeze_invocation

    def consume(self,operation,request):
        """Pure primitive evaluation only; never a host/effect dispatch grant."""
        self.validate_request(operation,request)
        import reliable_goal_continuation as core
        function=getattr(core,operation,None)
        if function is None: raise ConsumerError('NO_LOCAL_PRIMITIVE')
        return function(copy.deepcopy(request))

    def consume_frozen(self,audit_ref):
        """Source-bound local consumption; pure consume() grants no dispatch authority."""
        audit=json.loads(read_ref(self.evidence_root,audit_ref))
        jsonschema.Draft202012Validator(self.schema).validate(audit)
        identity=audit.pop('invocation_identity_sha256')
        if sha(canonical(audit))!=identity: raise ConsumerError('INVOCATION_IDENTITY_DRIFT')
        if audit['profile_ref']!=self.profile_ref: raise ConsumerError('PROFILE_REF_MISMATCH')
        for source in audit['source_bytes']: read_ref(self.evidence_root,source)
        registry_sources=[s for s in audit['source_bytes'] if Path(s['path']).name=='registry.source']
        if len(registry_sources)!=1 or read_ref(self.evidence_root,registry_sources[0])!=read_bytes(self.source_root,self.token_registry_path): raise ConsumerError('CURRENT_REGISTRY_DRIFT')
        for key in ('consumer_source_ref','observer_source_ref'): read_ref(self.repo,audit[key])
        registry=json.loads(read_bytes(self.source_root,self.token_registry_path))
        request=audit['typed_request'];windows=[]
        # The same validator is mandatory at freeze and replay. Rehashing a
        # foreign causal token, transport gap or future clock never repairs it.
        for name in ('context','parameters'):
            snapshots=[s for s in audit['source_bytes'] if Path(s['path']).name==name+'.json']
            if len(snapshots)!=1: raise ConsumerError('REQUEST_SOURCE_DIVERGENCE')
            raw=read_ref(self.evidence_root,snapshots[0])
            if json.loads(raw)!=request[name]: raise ConsumerError('REQUEST_SOURCE_DIVERGENCE')
            metadata=[s for s in audit['source_bytes'] if Path(s['path']).name==name+'-metadata.json']
            if len(metadata)!=1: raise ConsumerError('REQUEST_SOURCE_METADATA_DIVERGENCE')
            meta=json.loads(read_ref(self.evidence_root,metadata[0]))
            windows.append(self._validate_source_metadata(raw,meta,registry))
        computed_window={'clock_owner':registry['clock_owner'],'start':min(w['start'] for w in windows),'end':max(w['end'] for w in windows),'continuity':'observed_gap_free'}
        if audit['monotonic_window']!=computed_window: raise ConsumerError('AUDIT_SOURCE_WINDOW_MISMATCH')
        case=next((c for c in self.cases['cases'] if c['case_id']==audit['source_case_id']),None)
        if case is None or case['operation']!=audit['operation']: raise ConsumerError('AUDIT_OPERATION_MISMATCH')
        self._validate_dynamic_bindings(audit['source_case_id'],request['parameters'],registry)
        for key in ('consumer_source_ref','observer_source_ref'): self._validate_loaded_source(audit[key])
        path=confined(self.evidence_root,audit_ref['path']).parent/'request.json'
        raw=read_bytes(self.evidence_root,path)
        if raw!=canonical(request) or sha(raw)!=audit['request_sha256']: raise ConsumerError('REQUEST_AUDIT_DRIFT')
        self._verify_frozen()
        return self.consume(audit['operation'],request)


def nonnegative_number(value,label):
    if type(value) not in (int,float) or not math.isfinite(value) or value<0: raise ConsumerError(label)
    return value

class DurableState:
    """One locked, fsynced state file. Lock is stable across atomic replacement."""
    def __init__(self,root,path,initial):
        self.root=Path(root).absolute(); confined(self.root,self.root);self.root.mkdir(parents=True,exist_ok=True)
        self.path=confined(self.root,path);self.lock=self.path.with_name(self.path.name+'.lock')
        with self.edit(initial): pass
    @contextmanager
    def edit(self,initial=None):
        with opened(self.root,self.lock,os.O_RDWR|os.O_CREAT) as fd:
            fcntl.flock(fd,fcntl.LOCK_EX)
            try:
                if self.path.exists(): state=json.loads(read_bytes(self.root,self.path))
                elif initial is not None: state=copy.deepcopy(initial)
                else: raise ConsumerError('DURABLE_STATE_MISSING')
                yield state
                temp=self.path.with_name(self.path.name+'.'+uuid.uuid4().hex+'.tmp')
                immutable(self.root,temp,canonical(state))
                os.replace(temp,self.path)
                directory=os.open(self.path.parent,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW)
                try: os.fsync(directory)
                finally: os.close(directory)
            finally: fcntl.flock(fd,fcntl.LOCK_UN)
    def snapshot(self):
        with self.edit() as state: return copy.deepcopy(state)

class BudgetLedger:
    def __init__(self,root,path,allocation_pack,inherited_budget):
        self.rows={r['variant_id']:r for r in allocation_pack['variant_allocations']}
        self.actions={a['logical_action_id']:a for a in allocation_pack['logical_action_allocations']}
        if len(self.rows)!=47 or len(self.actions)!=96: raise ConsumerError('ALLOCATION_DENOMINATOR_DRIFT')
        self.plan_sha=sha(canonical(allocation_pack));self.inherited_sha=sha(canonical(inherited_budget))
        used={'threads':inherited_budget['reserved_threads'],'turn_starts':inherited_budget['reserved_turn_starts'],'wall_clock_seconds':inherited_budget['reserved_row_seconds']}
        entries={};rows={}
        for a in inherited_budget['actions']:
            action=self.actions.get(a['id'])
            if action is None: raise ConsumerError('INHERITED_ACTION_UNKNOWN')
            variant=action['variant_id'];rows[variant]=True
            entries[a['id']]={'variant_id':variant,'status':a['status'],'attempt':a['attempt'],'observed_elapsed_seconds':a.get('observed_elapsed_seconds',0),'inherited':True}
            for key in ('reservation_key','preflight_manifest_ref','execution_source_manifest_ref'):
                if key in a:entries[a['id']][key]=copy.deepcopy(a[key])
        initial={'plan_sha256':self.plan_sha,'inherited_sha256':self.inherited_sha,'used':used,'rows':rows,'actions':entries,'revision':0,'quota_exhausted':False}
        self.state=DurableState(root,path,initial)
        current=self.state.snapshot()
        if current['plan_sha256']!=self.plan_sha or current['inherited_sha256']!=self.inherited_sha: raise ConsumerError('BUDGET_BASELINE_DRIFT')
        self._check_used(current['used'],allow_exhausted=current.get('quota_exhausted',False))
    @staticmethod
    def _check_used(used,allow_exhausted=False):
        if set(used)!=set(LIMITS): raise ConsumerError('BUDGET_AXES_INVALID')
        for key,value in used.items():
            nonnegative_number(value,'BUDGET_VALUE_INVALID')
            if (value>LIMITS[key] and not allow_exhausted) or key!='wall_clock_seconds' and type(value) is not int: raise ConsumerError('QUOTA_EXCEEDED')
    def remaining(self):
        current=self.state.snapshot()
        if current.get('quota_exhausted'): raise ConsumerError('QUOTA_EXHAUSTED')
        used=current['used'];return {k:LIMITS[k]-used[k] for k in LIMITS}
    def reserve_and_persist(self,variant_id,logical_action_id,remaining_budget,monotonic_elapsed):
        nonnegative_number(monotonic_elapsed,'ELAPSED_INVALID')
        action=self.actions.get(logical_action_id);row=self.rows.get(variant_id)
        if action is None or row is None or action['variant_id']!=variant_id: raise ConsumerError('ACTION_VARIANT_UNKNOWN')
        with self.state.edit() as state:
            if state.get('quota_exhausted'): raise ConsumerError('QUOTA_EXHAUSTED')
            if any(e['status']=='unknown' for e in state['actions'].values()): raise ConsumerError('UNKNOWN_REQUIRES_RECONCILIATION')
            current={k:LIMITS[k]-state['used'][k] for k in LIMITS}
            if remaining_budget!=current: raise ConsumerError('BUDGET_CAS_STALE')
            if logical_action_id in state['actions']: return copy.deepcopy(state['actions'][logical_action_id])
            charge={'threads':row['new_thread_count'],'turn_starts':row['turn_starts'],'wall_clock_seconds':row['wall_clock_seconds']} if variant_id not in state['rows'] else dict.fromkeys(LIMITS,0)
            proposed={k:state['used'][k]+charge[k] for k in LIMITS};self._check_used(proposed)
            state['used']=proposed;state['rows'][variant_id]=True;state['revision']+=1
            entry={'variant_id':variant_id,'status':'reserved','attempt':1,'observed_elapsed_seconds':monotonic_elapsed,'charge':charge}
            state['actions'][logical_action_id]=entry;return copy.deepcopy(entry)
    def record_outcome(self,action_id,status,observed_elapsed):
        if status not in {'succeeded','failed','unknown'}: raise ConsumerError('OUTCOME_INVALID')
        nonnegative_number(observed_elapsed,'ELAPSED_INVALID')
        with self.state.edit() as state:
            if action_id not in state['actions']: raise ConsumerError('UNRESERVED_ACTION')
            entry=state['actions'][action_id]
            if observed_elapsed<entry['observed_elapsed_seconds']: raise ConsumerError('ELAPSED_REGRESSION')
            allocated=self.rows[entry['variant_id']]['wall_clock_seconds']
            overrun=max(0,observed_elapsed-allocated)-max(0,entry['observed_elapsed_seconds']-allocated)
            proposed=dict(state['used']);proposed['wall_clock_seconds']+=overrun
            state['quota_exhausted']=any(proposed[k]>LIMITS[k] for k in LIMITS)
            state['used']=proposed;entry.update(status=status,observed_elapsed_seconds=observed_elapsed);state['revision']+=1
            exhausted=state['quota_exhausted']
        if exhausted: raise ConsumerError('QUOTA_EXHAUSTED_RECORDED')
    def reconcile_unknown(self,action_id):
        with self.state.edit() as state:
            entry=state['actions'].get(action_id)
            if not entry or entry['status']!='unknown': raise ConsumerError('NOT_UNKNOWN')
            # A query is not proof of non-delivery. No debit refund or replay permit.
            return {'action_id':action_id,'status':'unknown','replay_allowed':False,'required':'independent correlated delivery/effect evidence'}
    def resolve_unknown(self,action_id,observation_ref):
        observation=json.loads(read_ref(self.state.root,observation_ref));reject_oracle(observation)
        if set(observation)!={'action_id','delivery','effect_count','gap_free','observer_pid'} or observation['action_id']!=action_id or observation['gap_free'] is not True or observation['observer_pid']!=os.getpid(): raise ConsumerError('RECONCILIATION_SOURCE_INVALID')
        if observation['delivery'] not in {'delivered','not_delivered'} or type(observation['effect_count']) is not int or observation['effect_count']<0: raise ConsumerError('RECONCILIATION_VALUE_INVALID')
        if observation['delivery']=='not_delivered' and observation['effect_count']>0: raise ConsumerError('CONTRADICTORY_DELIVERY_EFFECT')
        with self.state.edit() as state:
            entry=state['actions'].get(action_id)
            if not entry or entry['status']!='unknown': raise ConsumerError('NOT_UNKNOWN')
            entry['status']='succeeded' if observation['delivery']=='delivered' else 'failed';entry['reconciliation_ref']=observation_ref;state['revision']+=1
    def reserve_retry(self,action_id,retry_id,remaining_budget):
        with self.state.edit() as state:
            entry=state['actions'].get(action_id)
            if not entry or entry['status']!='failed': raise ConsumerError('RETRY_REQUIRES_RESOLVED_FAILURE')
            if retry_id in state['actions'] or not retry_id.startswith(action_id+':retry:'): raise ConsumerError('RETRY_ID_INVALID')
            retries=sum(e.get('retry_of')==action_id for e in state['actions'].values())
            if retries>=2: raise ConsumerError('RETRY_LIMIT')
            if remaining_budget!={k:LIMITS[k]-state['used'][k] for k in LIMITS}: raise ConsumerError('BUDGET_CAS_STALE')
            row=self.rows[entry['variant_id']];charge={'threads':row['new_thread_count'],'turn_starts':row['turn_starts'],'wall_clock_seconds':row['wall_clock_seconds']}
            proposed={k:state['used'][k]+charge[k] for k in LIMITS};self._check_used(proposed)
            state['used']=proposed;state['actions'][retry_id]={'variant_id':entry['variant_id'],'status':'reserved','attempt':retries+2,'retry_of':action_id,'observed_elapsed_seconds':0,'charge':charge};state['revision']+=1
            return copy.deepcopy(state['actions'][retry_id])

class OwnedResourceLedger:
    def __init__(self,root,path,run_id):
        self.run_id=run_id;self.root=Path(root).absolute()
        self.state=DurableState(root,path,{'run_id':run_id,'resources':{},'quarantined':False})
        if self.state.snapshot()['run_id']!=run_id: raise ConsumerError('OWNERSHIP_RUN_DRIFT')
    def _register(self,kind,identity,parent,provenance_ref,writable=False):
        if not isinstance(identity,(str,int)) or isinstance(identity,bool) or not identity: raise ConsumerError('RESOURCE_ID_INVALID')
        provenance=json.loads(read_ref(self.root,provenance_ref));reject_oracle(provenance)
        if provenance!={'run_id':self.run_id,'creator_pid':os.getpid(),'kind':kind,'identity':identity,'parent':parent}: raise ConsumerError('RESOURCE_PROVENANCE_INVALID')
        key=kind+':'+str(identity)
        with self.state.edit() as state:
            if state['quarantined']: raise ConsumerError('RUN_QUARANTINED')
            if parent is not None and (parent not in state['resources'] or state['resources'][parent]['quarantined']): raise ConsumerError('EXTERNAL_PARENT')
            if writable and any(r['writable'] and not r['quarantined'] for k,r in state['resources'].items() if k!=key): raise ConsumerError('MULTIPLE_NORMAL_WRITABLE_OWNERS')
            entry={'kind':kind,'identity':identity,'parent':parent,'provenance_ref':provenance_ref,'writable':writable,'quarantined':False}
            if key in state['resources'] and state['resources'][key]!=entry: raise ConsumerError('RESOURCE_REGISTRATION_DRIFT')
            state['resources'][key]=entry
        return key
    def register_owned_pid(self,pid,parent,provenance_ref,writable=False):
        if type(pid) is not int or pid<=0: raise ConsumerError('PID_INVALID')
        if pid!=os.getpid():
            import subprocess
            actual=subprocess.run(['ps','-o','ppid=','-p',str(pid)],capture_output=True,text=True,check=False)
            if actual.returncode!=0 or actual.stdout.strip()!=str(os.getpid()): raise ConsumerError('EXTERNAL_PID')
        return self._register('pid',pid,parent,provenance_ref,writable)
    def register_owned_thread(self,thread_id,parent,provenance_ref): return self._register('thread',thread_id,parent,provenance_ref)
    def register_owned_turn(self,turn_id,parent,provenance_ref): return self._register('turn',turn_id,parent,provenance_ref)
    def register_owned_file(self,path,parent,provenance_ref):
        path=str(confined(self.root,path));read_bytes(self.root,path)
        return self._register('file',path,parent,provenance_ref)
    def assert_owned(self,target):
        state=self.state.snapshot();entry=state['resources'].get(target)
        if not entry or entry['quarantined'] or state['quarantined']: raise ConsumerError('RESOURCE_NOT_OWNED')
        read_ref(self.root,entry['provenance_ref'])
        if entry['kind']=='file': confined(self.root,entry['identity'])
        return copy.deepcopy(entry)
    def quarantine_owned(self,run):
        if run!=self.run_id: raise ConsumerError('EXTERNAL_RUN')
        with self.state.edit() as state:
            state['quarantined']=True
            for resource in state['resources'].values(): resource['quarantined']=True
            return {'run_id':run,'resources':list(state['resources']),'os_termination_performed':False}

class FixtureObserver:
    """Read-only source ingress and independently computed local observations."""
    EVENT_KEYS={'sequence','monotonic','clock_owner','action_token','kind','payload'}
    def __init__(self,source_root,evidence_root,registered_refs,clock_owner,action_token):
        self.source_root=Path(source_root).absolute();self.evidence_root=Path(evidence_root).absolute()
        confined(self.evidence_root,self.evidence_root);self.evidence_root.mkdir(parents=True,exist_ok=True)
        self.registered={str(confined(source_root,r['path'])):r['sha256'] for r in registered_refs}
        self.clock_owner=clock_owner;self.action_token=action_token
    def read_sources(self,refs):
        events=[];previous=0;last=-1
        for ref in refs:
            path=str(confined(self.source_root,ref['path']))
            if self.registered.get(path)!=ref['sha256']: raise ConsumerError('OBSERVER_SOURCE_UNREGISTERED')
            payload=json.loads(read_ref(self.source_root,ref));reject_oracle(payload)
            if not isinstance(payload,list): raise ConsumerError('INGRESS_LIST_REQUIRED')
            for event in payload:
                if set(event)!=self.EVENT_KEYS or type(event['sequence']) is not int or event['sequence']!=previous+1: raise ConsumerError('INGRESS_GAP')
                stamp=nonnegative_number(event['monotonic'],'INGRESS_CLOCK_INVALID')
                if stamp<last or stamp>time.monotonic() or event['clock_owner']!=self.clock_owner or event['action_token']!=self.action_token: raise ConsumerError('INGRESS_CLOCK_OR_TOKEN_DRIFT')
                if not isinstance(event['payload'],dict) or not isinstance(event['kind'],str): raise ConsumerError('INGRESS_PAYLOAD_INVALID')
                if event['kind'] in {'transport_gap','ingress_gap','sequence_reset'}: raise ConsumerError('INGRESS_GAP')
                events.append(copy.deepcopy(event));previous=event['sequence'];last=stamp
        return events
    def derive_frozen_input(self,operation,field_sources,refs):
        events=self.read_sources(refs);result={}
        for field,selector in field_sources.items():
            if set(selector)!={'sequence','pointer'}: raise ConsumerError('FIELD_SOURCE_SELECTOR_INVALID')
            event=next((e for e in events if e['sequence']==selector['sequence']),None)
            if event is None: raise ConsumerError('FIELD_SOURCE_MISSING')
            result[field]=copy.deepcopy(pointer(event['payload'],selector['pointer']))
        reject_oracle(result)
        if operation=='detect_failure': self.detect_failure(result)
        elif operation not in {'context','parameters'}: raise ConsumerError('OBSERVER_OPERATION_UNKNOWN')
        return result
    @staticmethod
    def detect_failure(facts):
        # Separate pure taxonomy. Match exact original input fields, never expected.
        patterns=[({'goal_unfinished':True,'authority_valid':True,'unit_ready':True,'pause':False,'blocker':False,'progressing_executor':False,'dispatch_ack_within_deadline':False},'F1','SILENT_CONTINUATION_LOSS'),({'executor_state':'running','novel_progress_within_budget':False},'F2','FALSE_RUNNING'),({'intent':'observation','control_revision_changed':True,'next_action_suppressed':True},'F3','OBSERVATION_INDUCED_PAUSE'),({'writable_owners':2,'duplicate_side_effect':True},'F4','UNSAFE_DUPLICATE_RESUME'),({'resume_attempted':True,'head_or_evidence_stale':True},'F5','STALE_RESUME'),({'resume_attempted':True,'authority_revoked_or_pause_active':True},'F6','UNAUTHORIZED_RESUME')]
        for shape,code,reason in patterns:
            if set(facts)==set(shape):
                if any(type(facts[k]) is not type(v) for k,v in shape.items()): raise ConsumerError('FAILURE_INPUT_TYPE')
                if facts==shape:
                    result={'failure_state':code,'reason_code':'RGC_'+code+'_'+reason}
                    if code=='F1': result['silent_wait_allowed']=False
                    return result
                return {'failure_state':None,'reason_code':'NO_MATCHING_OBSERVED_FAILURE'}
        raise ConsumerError('FAILURE_INPUT_NOT_FROZEN_SHAPE')
    def issue_receipt(self,refs,required_kind,prove_absence=False):
        events=self.read_sources(refs)
        if not events or events[0]['kind']!='ingress_open' or events[-1]['kind']!='ingress_close': raise ConsumerError('INGRESS_WINDOW_INCOMPLETE')
        hits=[e['sequence'] for e in events if e['kind']==required_kind]
        if prove_absence and hits: raise ConsumerError('ABSENCE_CONTRADICTED')
        receipt={'observer_pid':os.getpid(),'action_token':self.action_token,'clock_owner':self.clock_owner,'source_refs':refs,'observed_sequences':hits,'absence':prove_absence,'continuity':'observed_gap_free','window_start':events[0]['monotonic'],'window_end':events[-1]['monotonic']}
        return immutable(self.evidence_root,self.evidence_root/(uuid.uuid4().hex+'.receipt.json'),canonical(receipt))
    def independent_replay(self,refs):
        events=self.read_sources(refs)
        if not events or events[0]['kind']!='ingress_open' or events[-1]['kind']!='ingress_close': raise ConsumerError('REPLAY_WINDOW_INCOMPLETE')
        # Raw event facts only; full six-scenario acceptance remains the durable
        # independent runtime review's duty. Producer pass booleans are forbidden.
        return {'event_count':len(events),'kind_counts':{kind:sum(e['kind']==kind for e in events) for kind in sorted({e['kind'] for e in events})},'ordered_source_sha256':sha(canonical(events)),'runtime_acceptance':'not_evaluated'}

class Scheduler:
    def __init__(self,root,path,owned,worker_key,action_token):
        self.owned=owned;worker=owned.assert_owned(worker_key)
        if worker['kind']!='pid': raise ConsumerError('WORKER_PID_REQUIRED')
        now=time.monotonic();self.worker_key=worker_key;self.action_token=action_token
        self.state=DurableState(root,path,{'worker_key':worker_key,'worker_pid':worker['identity'],'action_token':action_token,'clock_owner_pid':os.getpid(),'row_start':now,'worker_start':None,'last_tick':now,'checkpoint1':None,'checkpoint2':None,'routes':[]})
        state=self.state.snapshot()
        if (state['worker_key'],state['action_token'],state['clock_owner_pid'])!=(worker_key,action_token,os.getpid()): raise ConsumerError('CLOCK_IDENTITY_REENTRY_REQUIRED')
    def advance_same_worker_clock(self,worker_key,action_token):
        self.owned.assert_owned(worker_key);now=time.monotonic()
        with self.state.edit() as state:
            if worker_key!=state['worker_key'] or action_token!=state['action_token'] or os.getpid()!=state['clock_owner_pid']: raise ConsumerError('WORKER_CLOCK_IDENTITY_DRIFT')
            if now<state['last_tick']: raise ConsumerError('MONOTONIC_REGRESSION')
            state['last_tick']=now;row_elapsed=now-state['row_start']
            if state['worker_start'] is None and row_elapsed>=15: state['worker_start']=now
            return {'row_elapsed':row_elapsed,'worker_elapsed':None if state['worker_start'] is None else now-state['worker_start'],'clock_sample':now,'injected_elapsed':False}
    def checkpoint_host_turn(self,index,turn_key,action_token):
        turn=self.owned.assert_owned(turn_key)
        if turn['kind']!='turn': raise ConsumerError('CHECKPOINT_TURN_REQUIRED')
        self.advance_same_worker_clock(self.worker_key,action_token);now=time.monotonic()
        with self.state.edit() as state:
            if index not in (1,2) or state['checkpoint'+str(index)] is not None: raise ConsumerError('CHECKPOINT_DUPLICATE_OR_UNKNOWN')
            elapsed=now-state['row_start']
            if index==1 and not 135<=elapsed<=195: raise ConsumerError('CP1_WINDOW')
            if index==2 and (not 210<=elapsed<=270 or not state['checkpoint1'] or state['checkpoint1']['quiescent_at'] is None or state['checkpoint1']['quiescent_at']-state['row_start']>210): raise ConsumerError('CP2_ORDER_OR_WINDOW')
            state['checkpoint'+str(index)]={'turn_key':turn_key,'started_at':now,'quiescent_at':None,'interrupt_requested_at':None};state['routes'].append({'route':'checkpoint'+str(index),'observed_at':now})
    def mark_checkpoint_quiescent(self,index,turn_key,receipt_ref):
        self.owned.assert_owned(turn_key)
        receipt=json.loads(read_ref(self.state.root,receipt_ref));reject_oracle(receipt)
        if receipt!={'turn_key':turn_key,'terminal':True,'gap_free':True,'observer_pid':os.getpid()}: raise ConsumerError('QUIESCENCE_NOT_INDEPENDENT')
        with self.state.edit() as state:
            cp=state.get('checkpoint'+str(index))
            if not cp or cp['turn_key']!=turn_key: raise ConsumerError('QUIESCENCE_TURN_MISMATCH')
            cp['quiescent_at']=time.monotonic();cp['receipt_ref']=receipt_ref
    def route(self,action_token):
        sample=self.advance_same_worker_clock(self.worker_key,action_token);now=sample['clock_sample']
        with self.state.edit() as state:
            active=next((state['checkpoint'+str(i)] for i in (1,2) if state['checkpoint'+str(i)] and state['checkpoint'+str(i)]['quiescent_at'] is None),None)
            if sample['row_elapsed']>=330: route='ROW_BUDGET_EXHAUSTED'
            elif active and now-active['started_at']>=60:
                active['interrupt_requested_at']=active['interrupt_requested_at'] or now;route='INTERRUPT_CHECKPOINT'
            elif active: route='WAIT_CHECKPOINT'
            elif state['checkpoint2'] and state['checkpoint2']['quiescent_at'] is not None and sample['worker_elapsed'] is not None and sample['worker_elapsed']>=255: route='RECOVERY_ELIGIBLE'
            else: route='OBSERVE'
            state['routes'].append({'route':route,'observed_at':now});return route

class HostCallAdapter:
    """Validated local API plan only. This v18 slice cannot launch any host."""
    API_PLAN={'start_thread':'AppServerAdapter.start_thread','start_turn':'AppServerAdapter.start_turn','read_thread':'AppServerAdapter.read_thread','resume_thread':'AppServerAdapter.resume_thread','steer_turn':'AppServerAdapter.steer_turn','interrupt_turn':'AppServerAdapter.interrupt_turn','dispatch':'Supervisor.dispatch_authorized_action','recover':'Supervisor.recover','claim':'ResumeStore.claim_logical_action','validate_side_effect':'ResumeStore.validate_before_side_effect'}
    TARGET='SP-010/P3-local-consumer-v18'
    def __init__(self,consumer,owned,profile_ref,admission_ref):
        self.consumer=consumer;self.owned=owned;self.profile_ref=profile_ref;self.admission_ref=admission_ref
    def prepare_call(self,action,audit_ref,target,owned_target=None):
        if action not in self.API_PLAN or target!=self.TARGET: raise ConsumerError('HOST_ACTION_OR_TARGET_MISMATCH')
        if self.profile_ref!=self.consumer.profile_ref: raise ConsumerError('HOST_PROFILE_REF_MISMATCH')
        self.consumer._verify_frozen();admission=json.loads(read_ref(self.consumer.repo,self.admission_ref))
        # Local admission never becomes the Supervisor's SP-010/P3 authority.
        if admission.get('target')!=target or admission.get('status')!='approved' or admission.get('action')!='builder': raise ConsumerError('LOCAL_ADMISSION_TARGET_MISMATCH')
        if owned_target is None: raise ConsumerError('OWNED_HOST_TARGET_REQUIRED')
        self.owned.assert_owned(owned_target)
        value=self.consumer.consume_frozen(audit_ref)
        return {'api':self.API_PLAN[action],'target':target,'profile_ref':self.profile_ref,'host_launch_allowed':False,'source_bound_local_result':value,'dependency':'new runtime source freeze, independent Validation and runtime admission; thread params remain unverified'}
    def call(self,*args,**kwargs):
        self.prepare_call(*args,**kwargs)
        raise ConsumerError('LOCAL_SLICE_NO_HOST')

class FencedWriter:
    def __init__(self,root,state_path,owned,owner_key,epoch,token,control_revision):
        self.root=Path(root).absolute();self.owned=owned;self.owner_key=owner_key
        if type(epoch) is not int or type(control_revision) is not int or not isinstance(token,str) or not token: raise ConsumerError('FENCE_TYPE')
        owner=owned.assert_owned(owner_key)
        if not owner['writable']: raise ConsumerError('WRITABLE_OWNER_REQUIRED')
        self.state=DurableState(root,state_path,{'epoch':epoch,'token':token,'control_revision':control_revision,'paused':False,'authority_valid':True,'owner_key':owner_key,'effects':{}})
    def set_control(self,epoch,token,control_revision,paused,authority_valid):
        if type(epoch) is not int or type(control_revision) is not int or type(paused) is not bool or type(authority_valid) is not bool or not isinstance(token,str) or not token: raise ConsumerError('FENCE_TYPE')
        with self.state.edit() as state:
            if epoch<state['epoch'] or control_revision<=state['control_revision']: raise ConsumerError('CONTROL_REGRESSION')
            state.update(epoch=epoch,token=token,control_revision=control_revision,paused=paused,authority_valid=authority_valid)
    def write_effect(self,path,raw,epoch,token,control_revision,logical_effect_id):
        self.owned.assert_owned(self.owner_key);path=confined(self.root,path)
        if not isinstance(raw,bytes) or not isinstance(logical_effect_id,str) or not logical_effect_id: raise ConsumerError('EFFECT_INPUT_INVALID')
        def verify(state):
            if state['paused'] or not state['authority_valid']: raise ConsumerError('PAUSE_OR_AUTHORITY_REVOKED')
            if type(epoch) is not int or type(control_revision) is not int or (epoch,token,control_revision,self.owner_key)!=(state['epoch'],state['token'],state['control_revision'],state['owner_key']): raise ConsumerError('STALE_FENCE_OR_CONTROL')
        # Persist pending before creating bytes. A crash never permits retrying the
        # same logical effect at another path; it needs independent reconciliation.
        with self.state.edit() as state:
            verify(state)
            if logical_effect_id in state['effects']: raise ConsumerError('DUPLICATE_EFFECT')
            state['effects'][logical_effect_id]={'status':'pending','path':str(path),'sha256':sha(raw)}
        with self.state.edit() as state:
            verify(state);self.owned.assert_owned(self.owner_key)
            effect=immutable(self.root,path,raw)
            state['effects'][logical_effect_id]={'status':'written','ref':effect}
            return effect
    def fault_double_write(self,*args,**kwargs): raise ConsumerError('F4_RUNTIME_ADMISSION_REQUIRED')

class RuntimeNamespaceConsumer:
    """v20 的独立 namespace；旧 17 个纯 P2 operation 不改变。"""
    OPERATIONS=frozenset({'detect_failure','runtime_replay'})
    def __init__(self,observer):
        self.observer=observer
        self.protocol_path=observer.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20/RuntimeOperationContracts.json'
        self.protocol_pin='857e1c6bc1137f95f0538ff4e3a5b6f77475638acee0c430dc734d1b853d80b7'
        if sha(read_bytes(observer.repo,self.protocol_path)) != self.protocol_pin: raise ConsumerError('FROZEN_PROTOCOL_DRIFT')
        protocol=json.loads(read_bytes(observer.repo,self.protocol_path))
        if set(protocol['operations']) != self.OPERATIONS: raise ConsumerError('RUNTIME_NAMESPACE_DRIFT')
        self.schema_pins={name:sha(canonical(value)) for name,value in observer.schemas.items()}
    def validate_runtime_request(self,operation,request):
        if operation not in self.OPERATIONS: raise ConsumerError('RUNTIME_OPERATION_UNKNOWN')
        if sha(read_bytes(self.observer.repo,self.protocol_path)) != self.protocol_pin: raise ConsumerError('FROZEN_PROTOCOL_DRIFT')
        for name,pin in self.schema_pins.items():
            current=json.loads(read_bytes(self.observer.repo,self.observer.repo/'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20'/(name+'.schema.json')))
            if sha(canonical(current)) != pin: raise ConsumerError('FROZEN_PROTOCOL_DRIFT')
        reject_oracle(request); self.observer.read_bundle(request['parameters']['source_bundle_ref'],request)
        from rgc_runtime_observer import validate_loaded_manifest
        manifest=validate_loaded_manifest(self.observer.repo,self.observer.manifest_ref)
        refs=[r for r in manifest['files'] if Path(r['path']).name=='rgc_runtime_consumer.py']
        if len(refs)!=1: raise ConsumerError('EXECUTION_SOURCE_MANIFEST_INCOMPLETE')
        raw=read_ref(self.observer.repo,refs[0])
        if confined(self.observer.repo,refs[0]['path']) != _LOADED_SOURCE_PATH or sha(raw)!=_LOADED_SOURCE_SHA256: raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
    def freeze_runtime_invocation(self,operation,request):
        self.validate_runtime_request(operation,request)
        bundle,registry,events,raw=self.observer.read_bundle(request['parameters']['source_bundle_ref'],request)
        run=self.observer.evidence/uuid.uuid4().hex;run.mkdir(mode=0o700)
        originals=[request['parameters']['source_bundle_ref'],bundle['registry_ref'],bundle['event_stream_ref'],bundle['owned_ledger_ref']] if 'owned_ledger_ref' in bundle else [request['parameters']['source_bundle_ref'],bundle['registry_ref'],bundle['event_stream_ref'],registry['owned_ledger_ref']]
        originals += bundle['raw_sources']+[s['creator_receipt_ref'] for s in registry['registered_sources']]
        copies=[]
        for index,ref in enumerate(originals):
            copies.append({'original_ref':ref,'snapshot_ref':immutable(self.observer.evidence,run/(str(index)+'.source'),read_ref(self.observer.root,ref))})
        request_ref=immutable(self.observer.evidence,run/'request.json',canonical(request))
        audit={'schema_version':'rgc_runtime_invocation_v24','operation':operation,'request_ref':request_ref,'typed_request':copy.deepcopy(request),'source_copies':copies,'consumer_source_identity':loaded_source_identity(),'observer_source_identity':bundle['observer_source_ref'],'execution_source_manifest_ref':self.observer.manifest_ref,'protocol_sha256':self.protocol_pin,'schema_pins':self.schema_pins,'window':bundle['window'],'runtime_authority':False}
        audit['invocation_identity_sha256']=sha(canonical(audit))
        return {'audit_ref':immutable(self.observer.evidence,run/'audit.json',canonical(audit)),'invocation_identity_sha256':audit['invocation_identity_sha256']}
    def consume_runtime_frozen(self,audit_ref):
        audit=json.loads(read_ref(self.observer.evidence,audit_ref))
        required={'schema_version','operation','request_ref','typed_request','source_copies','consumer_source_identity','observer_source_identity','execution_source_manifest_ref','protocol_sha256','schema_pins','window','runtime_authority','invocation_identity_sha256'}
        if set(audit)!=required or audit['schema_version']!='rgc_runtime_invocation_v24' or audit['runtime_authority'] is not False: raise ConsumerError('RUNTIME_AUDIT_NOT_CLOSED')
        identity=audit.pop('invocation_identity_sha256')
        if sha(canonical(audit))!=identity: raise ConsumerError('INVOCATION_IDENTITY_DRIFT')
        if audit['consumer_source_identity']!=loaded_source_identity() or audit['execution_source_manifest_ref']!=self.observer.manifest_ref or audit['protocol_sha256']!=self.protocol_pin or audit['schema_pins']!=self.schema_pins: raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
        request=audit['typed_request'];reject_oracle(request)
        if read_ref(self.observer.evidence,audit['request_ref'])!=canonical(request): raise ConsumerError('REQUEST_AUDIT_DRIFT')
        for pair in audit['source_copies']:
            if set(pair)!={'original_ref','snapshot_ref'} or read_ref(self.observer.root,pair['original_ref'])!=read_ref(self.observer.evidence,pair['snapshot_ref']): raise ConsumerError('SOURCE_SNAPSHOT_DRIFT')
        self.validate_runtime_request(audit['operation'],request)
        bundle=json.loads(read_ref(self.observer.root,request['parameters']['source_bundle_ref']))
        if audit['window']!=bundle['window'] or audit['observer_source_identity']!=bundle['observer_source_ref']: raise ConsumerError('AUDIT_SOURCE_WINDOW_MISMATCH')
        observed=self.observer.derive_context_and_parameters(audit['operation'],request['parameters']['source_bundle_ref'])
        if audit['operation']=='detect_failure':
            shapes=[({'goal_unfinished':True,'authority_valid':True,'unit_ready':True,'pause':False,'blocker':False,'progressing_executor':False,'dispatch_ack_within_deadline':False},'F1','SILENT_CONTINUATION_LOSS'),({'executor_state':'running','novel_progress_within_budget':False},'F2','FALSE_RUNNING'),({'intent':'observation','control_revision_changed':True,'next_action_suppressed':True},'F3','OBSERVATION_INDUCED_PAUSE'),({'writable_owners':2,'duplicate_side_effect':True},'F4','UNSAFE_DUPLICATE_RESUME'),({'resume_attempted':True,'head_or_evidence_stale':True},'F5','STALE_RESUME'),({'resume_attempted':True,'authority_revoked_or_pause_active':True},'F6','UNAUTHORIZED_RESUME')]
            matches=[]; unresolved=[]
            for shape,code,reason in shapes:
                fields=observed['fields']
                if any(fields[k]['status']!='derived' for k in shape): unresolved.append(code);continue
                if all(type(fields[k]['value']) is type(v) and fields[k]['value']==v for k,v in shape.items()): matches.append({'failure_state':code,'reason_code':'RGC_'+code+'_'+reason})
            observed['failures']=matches;observed['unresolved_failures']=unresolved
        return {'operation':audit['operation'],'observed':observed,'invocation_identity_sha256':identity,'runtime_acceptance':'not_evaluated','dispatch_authority':False}

# RuntimeConsumer retains its v15 constructor and pure namespace. An explicit
# observer attachment opts into the separate v20 source-bound interface.
def _initialize_runtime(self,observer):
    self.runtime_namespace=RuntimeNamespaceConsumer(observer)
    return self.runtime_namespace
RuntimeConsumer.initialize_runtime=_initialize_runtime
for _method in ('validate_runtime_request','freeze_runtime_invocation','consume_runtime_frozen'):
    def _delegate(self,*args,_name=_method,**kwargs):
        if not hasattr(self,'runtime_namespace'): raise ConsumerError('RUNTIME_NAMESPACE_NOT_INITIALIZED')
        return getattr(self.runtime_namespace,_name)(*args,**kwargs)
    setattr(RuntimeConsumer,_method,_delegate)

def _reserve_supplemental_subaction(self,parent_action_id,subaction_id,charge,remaining_budget):
    exact={'threads':0,'turn_starts':1,'wall_clock_seconds':0}
    if parent_action_id!='P3-CHECKPOINT-START-01' or subaction_id!=parent_action_id+':sub:CP2' or charge!=exact or any(type(charge[k]) is not int for k in exact): raise ConsumerError('SUPPLEMENT_NOT_APPROVED')
    with self.state.edit() as state:
        parent=state['actions'].get(parent_action_id)
        if not parent or parent['variant_id']!='P3-CHECKPOINT' or parent['status'] not in {'reserved','succeeded'}: raise ConsumerError('SUPPLEMENT_PARENT_NOT_READY')
        if any(e['status']=='unknown' for e in state['actions'].values()): raise ConsumerError('UNKNOWN_REQUIRES_RECONCILIATION')
        if state.get('quota_exhausted'): raise ConsumerError('QUOTA_EXHAUSTED')
        if remaining_budget!={k:LIMITS[k]-state['used'][k] for k in LIMITS}: raise ConsumerError('BUDGET_CAS_STALE')
        if subaction_id in state['actions']: return copy.deepcopy(state['actions'][subaction_id])
        proposed={k:state['used'][k]+exact[k] for k in LIMITS};self._check_used(proposed)
        entry={'variant_id':'P3-CHECKPOINT','parent_action_id':parent_action_id,'status':'reserved','attempt':1,'observed_elapsed_seconds':0,'charge':exact,'supplemental':True}
        state['used']=proposed;state['actions'][subaction_id]=entry;state['revision']+=1
        return copy.deepcopy(entry)
BudgetLedger.reserve_supplemental_subaction=_reserve_supplemental_subaction


CURRENT_HOST_PACKAGE = 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_CurrentProfileFreeze_20261013'
CURRENT_HOST_ROUTE = 'current_host_20261013'
APPROVED_V11_REF = {'path':'Dashboard/Artifacts/Stage-Plan-SP-010/P3_V11UserApproval_v15.json','sha256':'3231a6f0e6812dce726d250a6bf2ccb7673d66457976f9a990f3fb2830b417c3'}

def admitted_topology(repo, admission_ref):
    import execution_admission
    result=execution_admission.validate(json.loads(read_ref(repo,admission_ref)),repo,expected_action='builder',expected_target='SP-010/P3')
    return json.loads(read_ref(repo,result['references']['topology']))

def validate_current_package(repo, topology, profile_ref, source_ref, package_ref=None, *, live=False):
    """本地构造仅核闭合绑定；实际副作用另要求当前路由与既有v11根。"""
    try:
        package_ref=topology['package_manifest_ref'] if package_ref is None else package_ref
        if confined(repo,package_ref['path'])!=Path(repo)/CURRENT_HOST_PACKAGE/'PackageManifest.json':raise ValueError('path')
        required={'package_manifest_ref','profile_ref','execution_source_manifest_ref','authority_ref','budget_reconciliation_ref','phase_config_ref','independent_validation_ref','pre_runtime_semantic_ref'}
        if not required<=set(topology):raise ValueError('bindings')
        if topology['package_manifest_ref']!=package_ref or topology['profile_ref']!=profile_ref or topology['execution_source_manifest_ref']!=source_ref:raise ValueError('pin')
        package=json.loads(read_ref(repo,package_ref));seen=set();pins={}
        for member in package['files']:
            path=confined(repo,member['path']);name=str(path)
            if name in seen:raise ValueError('duplicate')
            seen.add(name);read_ref(repo,member);pins[name]=member['sha256']
        if confined(repo,profile_ref['path'])!=Path(repo)/CURRENT_HOST_PACKAGE/'Profile.json' or pins.get(str(confined(repo,profile_ref['path'])))!=profile_ref['sha256']:raise ValueError('profile')
        if pins.get(str(confined(repo,source_ref['path'])))!=source_ref['sha256']:raise ValueError('source')
        for key in required:read_ref(repo,topology[key])
        profile=json.loads(read_ref(repo,profile_ref))
        if profile.get('approved_authority')!=topology['authority_ref']:raise ValueError('authority')
        if live:
            if topology.get('host_binding_route')!=CURRENT_HOST_ROUTE or topology['authority_ref']!=APPROVED_V11_REF:raise ValueError('live route')
            authority=json.loads(read_ref(repo,APPROVED_V11_REF))
            if authority.get('status')!='approved':raise ValueError('authority status')
            read_ref(repo,authority['approved_packet'])
        return package
    except (ValueError,KeyError,TypeError,OSError) as exc:
        raise ConsumerError('HOST_PACKAGE_BINDING_INVALID') from exc

P3_CONDITIONS = frozenset({
    'identity_rebaseline_passed','explicit_model_successful_turn_passed','thread_resume_live_result_passed',
    'turn_steer_live_result_passed','turn_interrupt_live_result_passed','event_ordering_recomputed',
    'reconnect_gap_explicit_and_no_blind_replay','production_caller_persist_before_grant_readback_proved',
    'observation_control_ordering_proved','pause_fence_and_single_owner_proved','two_checkpoint_protocol_proved',
    'continue_recover_pause_vertical_trace_proved','independent_validation_passed','scope_delta_none_or_human_approved'})

def validate_p3_prerequisite(repo, topology, producer_source):
    if topology.get('phase')!='P4_actual_runtime_only':return
    try:
        receipt=json.loads(read_ref(repo,topology['p3_validation_receipt_ref']))
        required={'schema_version','receipt_id','reviewer_source','producer_source','reviewer_provenance_ref','profile_ref','package_manifest_ref','sourcefreeze_ref','contract_ref','cases_ref','p3_run_id','p3_evidence_manifest_ref','condition_results','all_and','open_blocker_ids','execution_verdict','issued_at','revoked'}
        if not required<=set(receipt) or receipt['schema_version']!='sp010_independent_p3_receipt_v1':raise ValueError('shape')
        if type(receipt['condition_results']) is not dict or set(receipt['condition_results'])!=P3_CONDITIONS:raise ValueError('conditions')
        manifest=json.loads(read_ref(repo,topology['p3_condition_manifest_ref']))
        if set(manifest['condition_ids'])!=P3_CONDITIONS or len(manifest['condition_ids'])!=14:raise ValueError('condition manifest')
    except (ValueError,KeyError,TypeError,OSError) as exc:raise ConsumerError('P3_RECEIPT_MISSING_OR_INVALID') from exc
    if receipt['execution_verdict']!='ok' or receipt['all_and'] is not True or receipt['open_blocker_ids']!=[] or any(v!='pass' for v in receipt['condition_results'].values()):raise ConsumerError('P3_RECEIPT_NOT_PASS')
    try:
        provenance=json.loads(read_ref(repo,receipt['reviewer_provenance_ref']))
        reviewer=receipt['reviewer_source']
        if not isinstance(reviewer,str) or not reviewer or reviewer in {receipt['producer_source'],producer_source}:raise ValueError('independence')
        if provenance.get('reviewer_source')!=reviewer or provenance.get('producer_source')!=receipt['producer_source']:raise ValueError('provenance')
    except (ValueError,KeyError,TypeError,OSError) as exc:raise ConsumerError('P3_RECEIPT_SOURCE_INVALID') from exc
    for name,topokey in [('profile_ref','profile_ref'),('package_manifest_ref','package_manifest_ref'),('sourcefreeze_ref','execution_source_manifest_ref'),('contract_ref','contract_ref'),('cases_ref','cases_ref')]:
        if receipt[name]!=topology.get(topokey):raise ConsumerError('P3_RECEIPT_BINDING_MISMATCH')
    try:
        for name in ('profile_ref','package_manifest_ref','sourcefreeze_ref','contract_ref','cases_ref'):read_ref(repo,receipt[name])
        evidence=json.loads(read_ref(repo,receipt['p3_evidence_manifest_ref']))
        for ref in evidence['files']:read_ref(repo,ref)
        issued=datetime.fromisoformat(receipt['issued_at'].replace('Z','+00:00'))
        completed=datetime.fromisoformat(evidence['completed_at'].replace('Z','+00:00'))
        now=datetime.now(issued.tzinfo)
        if not issued.tzinfo or not completed.tzinfo or not completed<=issued<=now or receipt['revoked'] is not False:raise ValueError('stale')
        if topology.get('host_binding_route')==CURRENT_HOST_ROUTE:
            if evidence.get('run_id')!=receipt['p3_run_id'] or evidence.get('profile_ref')!=receipt['profile_ref'] or evidence.get('complete') is not True or not evidence['files']:raise ValueError('actual run binding')
        return receipt
    except (ValueError,KeyError,TypeError,OSError) as exc:raise ConsumerError('P3_RECEIPT_STALE') from exc


def validate_inherited_budget(repo, topology):
    """消费非Builder已对账输入；不重写账，不提供通用合并或退款。"""
    try:
        reconciliation=json.loads(read_ref(repo,topology['budget_reconciliation_ref']))
        inherited=json.loads(read_ref(repo,topology['inherited_budget_ref']))
        if reconciliation.get('coverage_verdict')!='complete_for_recorded_authorized_entries' or reconciliation.get('unresolved')!=[]:raise ValueError('coverage')
        if reconciliation.get('inherited_ref',topology['inherited_budget_ref'])!=topology['inherited_budget_ref']:raise ValueError('pin')
        for reference in reconciliation.get('included_journal_refs',[]):read_ref(repo,reference)
        if topology.get('host_binding_route')==CURRENT_HOST_ROUTE:
            if reconciliation.get('approval_ref')!=APPROVED_V11_REF or reconciliation.get('review_pending') is not False:raise ValueError('review')
            for key in ('search_inventory_ref','entry_search_ref'):read_ref(repo,reconciliation[key])
            used={'threads':inherited['reserved_threads'],'turn_starts':inherited['reserved_turn_starts'],'wall_clock_seconds':inherited['reserved_row_seconds']}
            if reconciliation.get('current_used')!=used or reconciliation.get('current_remaining')!={k:LIMITS[k]-used[k] for k in LIMITS}:raise ValueError('arithmetic')
        return inherited
    except (ValueError,KeyError,TypeError,OSError) as exc:raise ConsumerError('BUDGET_RECONCILIATION_INVALID') from exc


class ApprovedRuntimeInvocation:
    """封闭、调用方固定摘要的 runtime 桥；预检不创建目录或启动宿主。"""
    KEYS = frozenset({'source_root', 'evidence_root', 'local_admission_ref',
                      'profile_ref', 'source_manifest_ref', 'phase_config_ref',
                      'runtime_admission_ref'})

    def __init__(self, repo, invocation_ref, package_manifest_ref):
        self.repo = Path(repo).absolute()
        frozen = self.repo / 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_CurrentProfileFreeze_v15'
        current_frozen=self.repo/CURRENT_HOST_PACKAGE
        package_path=confined(self.repo,package_manifest_ref['path'])
        if package_path not in {frozen/'PackageManifest.json',current_frozen/'PackageManifest.json'}:
            raise ConsumerError('APPROVED_PACKAGE_PATH_MISMATCH')
        package = json.loads(read_ref(self.repo, package_manifest_ref))
        self.config = json.loads(read_ref(self.repo, invocation_ref))
        if not isinstance(self.config, dict) or set(self.config) != self.KEYS:
            raise ConsumerError('RUNTIME_INVOCATION_NOT_CLOSED')
        if package_path==current_frozen/'PackageManifest.json':
            topology=admitted_topology(self.repo,self.config['runtime_admission_ref'])
            validate_current_package(self.repo,topology,self.config['profile_ref'],self.config['source_manifest_ref'],package_manifest_ref)
            frozen=current_frozen
        pins = {r['path']: r['sha256'] for r in package['files']}
        expected = {'path': str((frozen / 'Profile.json').relative_to(self.repo)),
                    'sha256': pins.get(str((frozen / 'Profile.json').relative_to(self.repo)))}
        if self.config['profile_ref'] != expected:
            raise ConsumerError('RUNTIME_PROFILE_PACKAGE_MISMATCH')
        self.invocation_ref = copy.deepcopy(invocation_ref)
        self.package_manifest_ref = copy.deepcopy(package_manifest_ref)
        # Reject unsafe paths before even the dry admission object is created.
        for key in ('source_root', 'evidence_root'):
            confined(self.repo, self.config[key])

    def run(self):
        from rgc_runtime_driver import RuntimeDriver
        current = json.loads(read_ref(self.repo, self.invocation_ref))
        read_ref(self.repo, self.package_manifest_ref)
        if canonical(current) != canonical(self.config):
            raise ConsumerError('RUNTIME_INVOCATION_MEMORY_DRIFT')
        c = current
        # Consume exactly the driver's production admission before its ctor's
        # mkdir. The disposable gate object cannot be used to dispatch.
        gate = RuntimeDriver.__new__(RuntimeDriver)
        gate.repo = self.repo
        gate.root = confined(self.repo, c['source_root'])
        gate.evidence = confined(self.repo, c['evidence_root'])
        gate.admission_ref = c['local_admission_ref']
        gate.profile_ref = c['profile_ref']
        gate.source_manifest_ref = c['source_manifest_ref']
        gate.producer_id = 'preflight:' + uuid.uuid4().hex
        gate.quarantined = False
        gate._runtime_entry(c['runtime_admission_ref'])
        import execution_admission
        admitted = execution_admission.validate(
            json.loads(read_ref(self.repo, c['runtime_admission_ref'])), self.repo,
            expected_action='builder', expected_target='SP-010/P3')
        topology = json.loads(read_ref(self.repo, admitted['references']['topology']))
        if topology.get('phase_config_ref') != c['phase_config_ref']:
            raise ConsumerError('RUNTIME_CONFIG_NOT_PHASE_BOUND')
        read_ref(gate.root, c['phase_config_ref'])
        driver = RuntimeDriver(self.repo, gate.root, gate.evidence,
                               c['local_admission_ref'], c['profile_ref'],
                               c['source_manifest_ref'])
        # Source/authority checks run again inside run_p3 and before every send.
        return driver.run_p3(c['phase_config_ref'], c['runtime_admission_ref'])


class ArchiveTypedConsumer:
    """独立归档 namespace。只接受调用方固定 refs，不消费 producer view。"""
    OPERATIONS = frozenset({'detect_failure', 'runtime_replay'})
    INPUT_KEYS = frozenset({'operation', 'request_ref', 'trusted_capture_manifest_ref',
                          'replay_execution_manifest_ref', 'caller_replay_pin'})
    HANDOFF_REF = {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverRemainingL2Builder_v32/ArchiveFieldsBridgeAPIHandoff.json',
                   'sha256': 'a353ff64942f8cb6244191ea510b7f8e84dfc84b9043bca0eb1cb0b793e8a53d'}

    def __init__(self, repo, evidence_root, source_manifest_ref, admission_ref):
        self.repo = Path(repo).absolute()
        self.evidence = confined(self.repo, evidence_root)
        self.manifest_ref = copy.deepcopy(source_manifest_ref)
        self.admission_ref = copy.deepcopy(admission_ref)
        self._admit()
        self.handoff = json.loads(read_ref(self.repo, self.HANDOFF_REF))
        self._verify_sources()
        self.evidence.mkdir(parents=True, exist_ok=True)

    def _admit(self):
        import execution_admission
        valid = execution_admission.validate(json.loads(read_ref(self.repo, self.admission_ref)),
            self.repo, expected_action='builder', expected_target='SP-010/P3')
        topology = json.loads(read_ref(self.repo, valid['references']['topology']))
        context = json.loads(read_ref(self.repo, valid['references']['context']))
        if (topology.get('host_enabled') is not False or
                topology.get('phase') != 'L2_archive_typed_bridge_local_only' or
                context['change_impact'].get('external_side_effect') is not False):
            raise ConsumerError('ARCHIVE_LOCAL_ADMISSION_REQUIRED')

    def _verify_sources(self):
        import rgc_runtime_observer as observer
        manifest = json.loads(read_ref(self.repo, self.manifest_ref))
        rows = manifest.get('files', [])
        paths = [str(confined(self.repo, r['path'])) for r in rows]
        if len(paths) != len(set(paths)):
            raise ConsumerError('ARCHIVE_CODE_PIN_DUPLICATE')
        for reference in rows:
            read_ref(self.repo, reference)
        for identity in (loaded_source_identity(), observer.loaded_source_identity()):
            selected = [r for r in rows if confined(self.repo, r['path']) == Path(identity['path'])]
            if len(selected) != 1 or selected[0]['sha256'] != identity['sha256']:
                raise ConsumerError('ARCHIVE_LOADED_CODE_PIN_MISMATCH')
        read_ref(self.repo, self.HANDOFF_REF)
        return observer

    def _derive(self, inputs):
        try:
            return self._derive_source(inputs)
        except (ConsumerError, KeyError, TypeError, ValueError) as cause:
            error = {'schema_version':'rgc_archive_execution_error_v40',
                     'contract_verdict':'not_evaluated','execution_verdict':'error',
                     'error_type':type(cause).__name__,'reason':str(cause),
                     'trusted_RED':False,'dispatch_authority':False,
                     'runtime_acceptance':'not_evaluated'}
            self.last_execution_error_ref = immutable(self.evidence,
                self.evidence/(uuid.uuid4().hex+'.archive-error.json'),canonical(error))
            if isinstance(cause, ConsumerError):
                cause.execution_receipt_ref = self.last_execution_error_ref
                raise
            exc = ConsumerError('ARCHIVE_SOURCE_EXECUTION_ERROR: '+type(cause).__name__)
            exc.execution_receipt_ref = self.last_execution_error_ref
            raise exc from cause

    def _derive_source(self, inputs):
        if not isinstance(inputs, dict) or set(inputs) != self.INPUT_KEYS or inputs['operation'] not in self.OPERATIONS:
            raise ConsumerError('ARCHIVE_TYPED_INPUT_NOT_CLOSED')
        reject_oracle(inputs)
        observer = self._verify_sources()
        # Request/capture/replay-code pins are separate caller arguments.
        for key in self.INPUT_KEYS - {'operation'}:
            if not isinstance(inputs[key], dict) or set(inputs[key]) != {'path','sha256'}:
                raise ConsumerError('ARCHIVE_INDEPENDENT_REFERENCE_REQUIRED')
            read_ref(self.repo, inputs[key])
        value = observer.derive_capture_fields(repo=self.repo, **inputs)
        keys = {'contract_verdict','execution_verdict','fields','window','capture_manifest_ref',
                'evidence_layer','runtime_acceptance','dispatch_authority'}
        if (not isinstance(value, dict) or set(value) != keys or
                value['contract_verdict'] != 'valid' or value['execution_verdict'] != 'ok' or
                value['capture_manifest_ref'] != inputs['trusted_capture_manifest_ref'] or
                value['evidence_layer'] != 'captured_source_structural' or
                value['runtime_acceptance'] != 'not_evaluated' or value['dispatch_authority'] is not False):
            raise ConsumerError('ARCHIVE_DERIVATION_RESULT_INVALID')
        prefix = 'RGC-F' if inputs['operation'] == 'detect_failure' else 'RGC-'
        occurrences = [r for r in self.handoff['field_occurrences']
                       if r['case_id'].startswith(prefix) and
                       (inputs['operation'] == 'detect_failure' or not r['case_id'].startswith('RGC-F'))]
        names = {r['field'] for r in occurrences}
        if set(value['fields']) != names:
            raise ConsumerError('ARCHIVE_FIELD_IDENTITY_INCOMPLETE')
        for field in value['fields'].values():
            if (not isinstance(field, dict) or set(field) != {'value','status','source_refs','evidence_gap'} or
                    field['status'] not in {'derived','unknown'} or not isinstance(field['source_refs'], list)):
                raise ConsumerError('ARCHIVE_FIELD_SCHEMA_INVALID')
            if field['status'] == 'unknown' and (field['value'] is not None or not field['evidence_gap']):
                raise ConsumerError('ARCHIVE_UNKNOWN_COLLAPSE')
            if field['status'] == 'derived' and (field['value'] is None or field['evidence_gap'] is not None or not field['source_refs']):
                raise ConsumerError('ARCHIVE_DERIVED_SOURCE_MISSING')
        value['field_occurrences'] = [{'case_id':r['case_id'],'field':r['field'],
                                      **copy.deepcopy(value['fields'][r['field']])} for r in occurrences]
        # These are historical observations, never grants or acceptance verdicts.
        value['all_fields_derived'] = all(f['status']=='derived' for f in value['fields'].values())
        return value

    def freeze_archive_invocation(self, **inputs):
        self._admit()
        observed = self._derive(inputs)
        audit = {'schema_version':'rgc_archive_typed_invocation_v40', 'inputs':copy.deepcopy(inputs),
                 'execution_source_manifest_ref':self.manifest_ref, 'handoff_ref':self.HANDOFF_REF,
                 'consumer_source_identity':loaded_source_identity(),
                 'dispatch_authority':False, 'runtime_acceptance':'not_evaluated'}
        identity = sha(canonical(audit))
        audit['invocation_identity_sha256'] = identity
        reference = immutable(self.evidence, self.evidence/(uuid.uuid4().hex+'.archive-audit.json'),canonical(audit))
        return {'audit_ref':reference,'invocation_identity_sha256':identity,'observed':observed,
                'dispatch_authority':False,'runtime_acceptance':'not_evaluated'}

    def consume_archive_frozen(self, audit_ref):
        try:
            return self._consume_archive_frozen(audit_ref)
        except (ConsumerError, KeyError, TypeError, ValueError) as cause:
            if hasattr(cause, 'execution_receipt_ref'):
                raise
            error = {'schema_version':'rgc_archive_execution_error_v40',
                     'contract_verdict':'not_evaluated','execution_verdict':'error',
                     'error_type':type(cause).__name__,'reason':str(cause),
                     'trusted_RED':False,'dispatch_authority':False,
                     'runtime_acceptance':'not_evaluated'}
            self.last_execution_error_ref = immutable(self.evidence,
                self.evidence/(uuid.uuid4().hex+'.archive-error.json'),canonical(error))
            if isinstance(cause, ConsumerError):
                cause.execution_receipt_ref = self.last_execution_error_ref
                raise
            exc = ConsumerError('ARCHIVE_AUDIT_EXECUTION_ERROR: '+type(cause).__name__)
            exc.execution_receipt_ref = self.last_execution_error_ref
            raise exc from cause

    def _consume_archive_frozen(self, audit_ref):
        audit = json.loads(read_ref(self.evidence, audit_ref))
        keys = {'schema_version','inputs','execution_source_manifest_ref','handoff_ref',
                'consumer_source_identity','dispatch_authority','runtime_acceptance','invocation_identity_sha256'}
        if not isinstance(audit, dict) or set(audit) != keys or audit['schema_version']!='rgc_archive_typed_invocation_v40':
            raise ConsumerError('ARCHIVE_AUDIT_NOT_CLOSED')
        identity = audit.pop('invocation_identity_sha256')
        if sha(canonical(audit)) != identity:
            raise ConsumerError('ARCHIVE_AUDIT_IDENTITY_DRIFT')
        if (audit['execution_source_manifest_ref'] != self.manifest_ref or audit['handoff_ref'] != self.HANDOFF_REF or
                audit['consumer_source_identity'] != loaded_source_identity() or
                audit['dispatch_authority'] is not False or audit['runtime_acceptance']!='not_evaluated'):
            raise ConsumerError('ARCHIVE_AUDIT_AUTHORITY_OR_CODE_DRIFT')
        # Reopen originals' durable snapshots and rederive; no cached result, PID
        # liveness check, live recovery, producer verdict, or expected is consumed.
        observed = self._derive(audit['inputs'])
        return {'operation':audit['inputs']['operation'],'observed':observed,
                'invocation_identity_sha256':identity,'dispatch_authority':False,
                'runtime_acceptance':'not_evaluated'}
