"""只读来源观察器。局部来源可复算，缺运行窗口的字段保持 unknown。"""
from __future__ import annotations
import copy
import ast
import os
import sys
import json
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
import jsonschema
from rgc_runtime_consumer import ConsumerError, canonical, sha, confined, read_ref, read_bytes, immutable, reject_oracle, DurableState
import rgc_runtime_closure_guard as _closure_guard

_LOADED_PATH = Path(__file__).absolute()
_LOADED_SHA = sha(_LOADED_PATH.read_bytes())
DESIGN = 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverDesign_v20'
OBSERVATION_TEXTS = {'现在进展如何？', '做到哪一步了？', '现在有什么风险？', '报告一下当前状态。'}
CONTROL_TEXTS = {'暂停': 'control_pause', '停止': 'control_stop', '取消': 'control_cancel', '等待确认': 'control_wait_confirm', '继续': 'control_resume'}

def loaded_source_identity():
    return {'path': str(_LOADED_PATH), 'sha256': _LOADED_SHA}

def process_identity(pid):
    """OS 回读 PID generation，不从登记 label 推断存活。"""
    import subprocess
    if type(pid) is not int or pid < 1:
        raise ConsumerError('PID_INVALID')
    result = subprocess.run(['ps', '-o', 'pid=,ppid=,lstart=', '-p', str(pid)], capture_output=True, text=True, check=False)
    if result.returncode or not result.stdout.strip():
        raise ConsumerError('PROCESS_NOT_OBSERVED')
    return result.stdout.strip()


def validate_loaded_manifest(repo, manifest_ref):
    manifest = json.loads(read_ref(repo, manifest_ref))
    required = {'rgc_runtime_driver.py', 'rgc_runtime_observer.py', 'rgc_runtime_fixtures.py', 'rgc_runtime_consumer.py', 'rgc_app_server_adapter.py', 'rgc_resume_store.py', 'rgc_supervisor.py', 'reliable_goal_continuation.py', 'execution_admission.py', 'rgc_live_probe.py'}
    rows = manifest.get('files', [])
    refresh_ref={'path':'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverSourceRefresh_v24/Manifest.json','sha256':'4dfe59dd8a46a9630b5a34a6cbe1a4a205b668a87033cd43e77ad2a117d43216'}
    baseline=json.loads(read_ref(repo,refresh_ref))
    unchanged={r['path']:r['sha256'] for r in baseline['source_rows'] if Path(r['path']).name not in {'rgc_runtime_consumer.py','rgc_live_probe.py','rgc_app_server_adapter.py','rgc_resume_store.py','rgc_supervisor.py','reliable_goal_continuation.py'}}
    for path,pin in unchanged.items(): read_ref(repo,{'path':path,'sha256':pin})
    names = [Path(r['path']).name for r in rows]
    if not required <= set(names) or len(names) != len(set(names)):
        raise ConsumerError('EXECUTION_SOURCE_MANIFEST_INCOMPLETE')
    for ref in rows:
        raw = read_ref(repo, ref)
        module = sys.modules.get(Path(ref['path']).stem)
        if module is not None and hasattr(module, 'loaded_source_identity'):
            loaded = module.loaded_source_identity()
            if confined(repo, ref['path']) != Path(loaded['path']) or loaded['sha256'] != sha(raw):
                raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
    return manifest


class RuntimeObserver:
    """driver 固定 registry 路径与 manifest；request 无法自行选可信来源。"""
    def __init__(self, repo, source_root, evidence_root, registry_path, profile_ref, source_manifest_ref):
        self.repo = Path(repo).absolute()
        self.root = Path(source_root).absolute()
        self.evidence = Path(evidence_root).absolute()
        self.evidence.mkdir(parents=True, exist_ok=True)
        self.registry_path = confined(self.root, registry_path)
        self.profile_ref = copy.deepcopy(profile_ref)
        self.manifest_ref = copy.deepcopy(source_manifest_ref)
        self.schemas = {n: json.loads(read_bytes(self.repo, self.repo/DESIGN/(n+'.schema.json'))) for n in ('RuntimeEvent', 'RuntimeSourceBundle', 'RuntimeSourceRegistry', 'RuntimeRequest')}
        protocol=json.loads(read_ref(self.repo,{'path':DESIGN+'/RuntimeOperationContracts.json','sha256':'857e1c6bc1137f95f0538ff4e3a5b6f77475638acee0c430dc734d1b853d80b7'}))
        for key in ('request_schema_ref','source_bundle_schema_ref','source_registry_schema_ref'):
            read_ref(self.repo,protocol['operations']['runtime_replay'][key])
        read_ref(self.repo,{'path':DESIGN+'/RuntimeEvent.schema.json','sha256':'0de9c55ba36091fd3e1f5e080bd7babbcedeea4e42cfba738582cef5f54c4a4c'})
        self.opened = None

    def schema(self, name, obj):
        reject_oracle(obj)
        jsonschema.Draft202012Validator(self.schemas[name], format_checker=jsonschema.FormatChecker()).validate(obj)
        # jsonschema integer accepts 1.0. Runtime clock/sequence requires exact int.
        def visit(value):
            if isinstance(value, dict):
                for key, item in value.items():
                    if key in {'sequence', 'observed_monotonic_ns', 'start_ns', 'end_ns', 'first_sequence', 'last_sequence', 'last_sequence', 'current_control_revision', 'record_revision', 'adapter_sequence', 'pid', 'worker_pid', 'row_start_ns'} and type(item) is not int:
                        raise ConsumerError('RUNTIME_INTEGER_TYPE:'+key)
                    visit(item)
            elif isinstance(value, list):
                for item in value: visit(item)
        visit(obj)

    def registry(self, ref):
        if confined(self.root, ref['path']) != self.registry_path:
            raise ConsumerError('EXTERNAL_TOKEN_REGISTRY')
        registry = json.loads(read_ref(self.root, ref)); self.schema('RuntimeSourceRegistry', registry)
        if registry['current_action_token'] not in registry['issued_tokens']:
            raise ConsumerError('CURRENT_TOKEN_UNKNOWN')
        if registry['observer_process_identity'] != process_identity(os.getpid()):
            raise ConsumerError('OBSERVER_PROCESS_GENERATION_DRIFT')
        if registry['clock_owner_id'] != registry['observer_id']:
            raise ConsumerError('CLOCK_OWNER_OR_GAP')
        read_ref(self.repo, self.profile_ref)
        validate_loaded_manifest(self.repo, self.manifest_ref)
        authority = json.loads(read_ref(self.repo, registry['authority_ref']))
        if authority.get('status') != 'approved':
            raise ConsumerError('AUTHORITY_NOT_APPROVED')
        owned_raw=read_ref(self.root,registry['owned_ledger_ref'])
        if owned_raw != read_bytes(self.root,self.root/'owned.json'): raise ConsumerError('CURRENT_OWNERSHIP_DRIFT')
        owned = json.loads(owned_raw)
        if owned['run_id'] != registry['run_id'] or owned.get('quarantined') is not False:
            raise ConsumerError('RESOURCE_NOT_OWNED')
        entries = {}; paths = set()
        for source in registry['registered_sources']:
            path = str(confined(self.root, source['ref']['path']))
            if path in paths: raise ConsumerError('DUPLICATE_SOURCE_REGISTRATION')
            paths.add(path)
            creation = json.loads(read_ref(self.root, source['creator_receipt_ref']))
            if set(creation) != {'run_id', 'producer_id', 'role', 'source_ref', 'creator_pid', 'process_identity', 'created_ns', 'origin_path'}:
                raise ConsumerError('SOURCE_CREATION_NOT_CLOSED')
            if (creation['run_id'], creation['producer_id'], creation['role'], creation['source_ref']) != (registry['run_id'], source['producer_id'], source['role'], source['ref']):
                raise ConsumerError('SOURCE_PRODUCER_UNTRUSTED')
            if type(creation['created_ns']) is not int or not 0 <= creation['created_ns'] <= time.monotonic_ns(): raise ConsumerError('CLOCK_OR_SEQUENCE_INVALID')
            origin = str(confined(self.root, creation['origin_path']))
            resource = owned['resources'].get('file:'+origin)
            if not resource or resource['quarantined'] or resource['kind'] != 'file':
                raise ConsumerError('SOURCE_ORIGIN_NOT_OWNED')
            read_ref(self.root, resource['provenance_ref'])
            if creation['creator_pid'] != os.getpid() or creation['process_identity'] != process_identity(os.getpid()):
                raise ConsumerError('CREATOR_PROCESS_GENERATION_DRIFT')
            entries[path] = source
        return registry, entries

    def open_window(self, registry_ref):
        registry, _ = self.registry(registry_ref)
        if self.opened is not None: raise ConsumerError('WINDOW_ALREADY_OPEN')
        self.opened = {'registry_ref': registry_ref, 'start_ns': time.monotonic_ns(), 'run_id': registry['run_id']}
        return copy.deepcopy(self.opened)

    def capture_registered_source(self, source_ref, registry_ref=None):
        ref = registry_ref or self.opened['registry_ref']
        _, entries = self.registry(ref)
        key = str(confined(self.root, source_ref['path']))
        if key not in entries or entries[key]['ref'] != source_ref: raise ConsumerError('OBSERVER_SOURCE_UNREGISTERED')
        raw = read_ref(self.root, source_ref)
        return {'source_ref': source_ref, 'bytes': raw, 'observed_ns': time.monotonic_ns(), 'role': entries[key]['role']}

    def read_bundle(self, bundle_ref, request=None):
        bundle = json.loads(read_ref(self.root, bundle_ref)); self.schema('RuntimeSourceBundle', bundle)
        registry, entries = self.registry(bundle['registry_ref'])
        if bundle['profile_ref'] != self.profile_ref or bundle['execution_source_manifest_ref'] != self.manifest_ref:
            raise ConsumerError('PROFILE_OR_SOURCE_MANIFEST_DRIFT')
        observer_ref = bundle['observer_source_ref']
        if confined(self.repo, observer_ref['path']) != _LOADED_PATH or read_ref(self.repo, observer_ref) != _LOADED_PATH.read_bytes() or observer_ref['sha256'] != _LOADED_SHA:
            raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
        if bundle['run_id'] != registry['run_id']: raise ConsumerError('RUN_IDENTITY_DRIFT')
        if request:
            self.schema('RuntimeRequest', request)
            context = request['context']
            if context != {'run_id': bundle['run_id'], 'profile_ref': self.profile_ref, 'current_registry_ref': bundle['registry_ref'], 'execution_source_manifest_ref': self.manifest_ref} or request['parameters'] != {'source_bundle_ref': bundle_ref, 'window': bundle['window']}:
                raise ConsumerError('REQUEST_BUNDLE_BINDING_DRIFT')
        window = bundle['window']
        if window['clock_owner_id'] != registry['clock_owner_id'] or not 0 <= window['start_ns'] <= window['end_ns'] <= time.monotonic_ns(): raise ConsumerError('CLOCK_OR_SEQUENCE_INVALID')
        stream = json.loads(read_ref(self.root, bundle['event_stream_ref']))
        if not isinstance(stream, list) or len(stream) < 2: raise ConsumerError('INGRESS_WINDOW_INCOMPLETE')
        raw = {}; source_roles = {}
        for ref in bundle['raw_sources']:
            key = str(confined(self.root, ref['path']))
            if key not in entries or entries[key]['ref'] != ref: raise ConsumerError('OBSERVER_SOURCE_UNREGISTERED')
            if key in raw: raise ConsumerError('DUPLICATE_BUNDLE_SOURCE')
            raw[key] = read_ref(self.root, ref); source_roles[key] = entries[key]['role']
        previous_ns = window['start_ns']; previous_utc = None
        for index, event in enumerate(stream):
            self.schema('RuntimeEvent', event)
            if event['kind'] == 'source_gap': raise ConsumerError('INGRESS_GAP')
            if event['sequence'] != window['first_sequence']+index: raise ConsumerError('INGRESS_GAP')
            stamp = datetime.fromisoformat(event['observed_utc'].replace('Z', '+00:00'))
            if stamp > datetime.now(timezone.utc) or previous_utc and stamp < previous_utc: raise ConsumerError('UTC_OUTSIDE_OBSERVED_WINDOW')
            previous_utc = stamp
            if (event['run_id'], event['clock_owner_id'], event['observer_id'], event['action_token']) != (registry['run_id'], registry['clock_owner_id'], registry['observer_id'], registry['current_action_token']): raise ConsumerError('SOURCE_CAUSAL_OR_HASH_MISMATCH')
            if not previous_ns <= event['observed_monotonic_ns'] <= window['end_ns']: raise ConsumerError('CLOCK_OR_SEQUENCE_INVALID')
            previous_ns = event['observed_monotonic_ns']
            refs = list(event['source_refs'])
            def find(value):
                if isinstance(value, dict):
                    if set(value) == {'path', 'sha256'}: refs.append(value)
                    else:
                        for item in value.values(): find(item)
                elif isinstance(value, list):
                    for item in value: find(item)
            find(event['payload'])
            for ref in refs:
                # Assessor source lives in repo and is covered by execution manifest.
                if ref == event['payload'].get('assessor_source_ref'):
                    validate_loaded_manifest(self.repo, self.manifest_ref); read_ref(self.repo, ref); continue
                key = str(confined(self.root, ref['path']))
                if key not in raw or entries[key]['ref'] != ref: raise ConsumerError('EVENT_SOURCE_UNREGISTERED')
                role = entries[key]['role']
                allowed = {'host_request': {'host', 'driver'}, 'host_frame': {'host'}, 'store_snapshot': {'store'}, 'worker_sample': {'os_sampler', 'worker'}, 'guard_attempt': {'guard', 'store', 'fixture_controller'}, 'private_caller_attempt': {'driver', 'guard', 'store'}, 'classifier_receipt': {'classifier', 'observer', 'fixture_controller'}}.get(event['kind'])
                if allowed and role not in allowed: raise ConsumerError('EVENT_SOURCE_ROLE_MISMATCH')
            if event['producer_id'] not in {s['producer_id'] for s in entries.values()} | {registry['observer_id']}:
                raise ConsumerError('EVENT_PRODUCER_UNREGISTERED')
        if stream[0]['kind'] != 'ingress_open' or stream[-1]['kind'] != 'ingress_close' or stream[-1]['payload']['last_sequence'] != window['last_sequence'] or stream[-1]['sequence'] != window['last_sequence']:
            raise ConsumerError('INGRESS_WINDOW_INCOMPLETE')
        if stream[0]['observed_monotonic_ns'] != window['start_ns'] or stream[-1]['observed_monotonic_ns'] != window['end_ns']:
            raise ConsumerError('AUDIT_SOURCE_WINDOW_MISMATCH')
        if {canonical(r) for r in stream[0]['payload']['registered_source_refs']} != {canonical(r) for r in bundle['raw_sources']}: raise ConsumerError('INGRESS_DOMAIN_INCOMPLETE')
        read_ref(self.root, bundle['registry_ref'])
        return bundle, registry, stream, raw

    def _sources(self, bundle_ref, request=None):
        bundle, registry, events, raw = self.read_bundle(bundle_ref, request)
        def content(ref): return raw[str(confined(self.root, ref['path']))]
        def doc(ref):
            value = json.loads(content(ref)); reject_oracle(value); return value
        return bundle, registry, events, content, doc

    def derive_context_and_parameters(self, operation, sources):
        if operation not in {'detect_failure', 'runtime_replay'}: raise ConsumerError('RUNTIME_OPERATION_UNKNOWN')
        return self.derive_failure_facts(sources) if operation == 'detect_failure' else self.derive_scenario_facts(sources)

    def _progress_delta(self, delta, open_item_ref, registry_ref):
        required = {'before_ref', 'after_ref', 'unit_id', 'kind'}
        if set(delta) not in (required, required | {'open_item_ref'}) or delta['kind'] not in {'new_finding', 'new_command_result', 'new_artifact', 'new_code_delta', 'new_test_result', 'new_decision', 'new_blocker', 'next_action_convergence'}:
            raise ConsumerError('PROGRESS_SOURCE_SHAPE')
        if 'open_item_ref' in delta and delta['open_item_ref'] != open_item_ref:
            raise ConsumerError('PROGRESS_OPEN_ITEM_BINDING_DRIFT')
        open_items=json.loads(self.capture_registered_source(open_item_ref,registry_ref)['bytes'])
        before=self.capture_registered_source(delta['before_ref'],registry_ref)['bytes']
        after=self.capture_registered_source(delta['after_ref'],registry_ref)['bytes']
        if not isinstance(open_items.get('open_unit_ids'),list) or before == after or delta['unit_id'] not in open_items['open_unit_ids']:
            raise ConsumerError('PROGRESS_NOT_NOVEL_OR_RELEVANT')
        if delta['kind'] == 'new_finding':
            facts=json.loads(before);finding=json.loads(after)
            if set(facts) != {'left','right'} or any(type(facts[k]) is not int for k in facts) or finding != {'sum':facts['left']+facts['right']}:
                raise ConsumerError('FINDING_NOT_RECOMPUTABLE')
        elif delta['kind'] in {'new_command_result','new_test_result'}:
            observed=getattr(self,'observed_executions',{}).get(sha(after))
            if observed is None:raise ConsumerError('EXECUTION_SOURCE_NOT_OBSERVED')
            if observed['mode']!=delta['kind'] or observed['unit_id']!=delta['unit_id'] or observed['exit_code']!=0:raise ConsumerError('EXECUTION_PROGRESS_BINDING_DRIFT')
            if observed['observer_process_identity']!=process_identity(os.getpid()) or observed['observer_source_identity']!=loaded_source_identity():raise ConsumerError('EXECUTION_OBSERVER_GENERATION_DRIFT')
            for key in ('wait_ref','launch_request_ref','creation_proof_ref','output_ref'):read_ref(self.root,observed[key])
        elif delta['kind'] == 'next_action_convergence':
            old=json.loads(before);new=json.loads(after)
            if not {'candidate_actions','scope_id'} <= set(old) or not {'next_action','scope_id','basis_refs'} <= set(new) or old['scope_id'] != new['scope_id'] or new['next_action'] not in old['candidate_actions'] or not new['basis_refs']:
                raise ConsumerError('NEXT_ACTION_CONVERGENCE_INVALID')
            for reference in new['basis_refs']:self.capture_registered_source(reference,registry_ref)
        elif delta['kind'] in {'new_decision','new_blocker'}:
            value=json.loads(after)
            if delta['kind']=='new_blocker' and not value.get('dependency_ids'):raise ConsumerError('BLOCKER_SOURCE_MISSING')
            if delta['kind']=='new_decision' and not {'decision','basis_refs','unit_id'} <= set(value):raise ConsumerError('DECISION_SOURCE_INCOMPLETE')
        return before,after

    def issue_progress_receipt(self, actual_delta_ref, open_item_ref, registry_ref=None):
        registry_ref=registry_ref or (self.opened or {}).get('registry_ref')
        if registry_ref is None:raise ConsumerError('PROGRESS_CURRENT_REGISTRY_REQUIRED')
        registry,_=self.registry(registry_ref)
        delta=json.loads(self.capture_registered_source(actual_delta_ref,registry_ref)['bytes'])
        before,after=self._progress_delta(delta,open_item_ref,registry_ref)
        novelty=sha(canonical({'kind':delta['kind'],'unit_id':delta['unit_id'],'before':sha(before),'after':sha(after)}))
        receipt={'evidence_id':sha(after),'classification':delta['kind'],'verdict':'trusted','evidence_ref':delta['after_ref']['path'],'evidence_sha256':sha(after),'causal_action_token':registry['current_action_token'],'observed_at_utc':datetime.now(timezone.utc).isoformat(),'source_refs':[actual_delta_ref,open_item_ref,delta['before_ref'],delta['after_ref']],'observer_source':loaded_source_identity(),'observer_process_identity':process_identity(os.getpid()),'classifier_id':registry['observer_id'],'classifier_revision':'local-v24','novelty_key':novelty,'relevance_receipt':{'unit_id':delta['unit_id'],'open_item_ref':open_item_ref},'source_event_id':actual_delta_ref['sha256'],'evidence_type':delta['kind'],'readability_and_digest_verdict':'verified'}
        raw=canonical(receipt);digest=sha(raw)
        ledger=DurableState(self.evidence,self.evidence/'progress-novelty.json',{'digests':[],'keys':[],'receipts':[]})
        with ledger.edit() as state:
            if sha(after) in state['digests'] or novelty in state['keys']:raise ConsumerError('DUPLICATE_PROGRESS_REJECTED')
            state['digests'].append(sha(after));state['keys'].append(novelty);state.setdefault('receipts',[]).append(digest)
        return immutable(self.evidence,self.evidence/(digest+'.progress.json'),raw)

    @staticmethod
    def _field(value, refs=(), gap=None):
        return {'value': value, 'status': 'derived' if gap is None else 'unknown', 'source_refs': list(refs), 'evidence_gap': gap}

    def _meaningful_receipts(self, events, content, doc, registry):
        accepted=[];seen=set()
        registry_ref={'path':str(self.registry_path),'sha256':sha(read_bytes(self.root,self.registry_path))}
        for event in events:
            if event['kind']!='classifier_receipt':continue
            p=event['payload'];assessor=p['assessor_source_ref']
            if confined(self.repo,assessor['path']) != _LOADED_PATH or assessor['sha256'] != _LOADED_SHA:raise ConsumerError('CLASSIFIER_SOURCE_NOT_ACTUAL')
            delta=doc(p['source_ref']);receipt=doc(p['receipt_ref'])
            # Both the four-key legacy delta and the enriched five-key delta bind
            # to the same registered open-item source in the issued receipt.
            relevance=receipt.get('relevance_receipt')
            if not isinstance(relevance,dict) or set(relevance)!={'unit_id','open_item_ref'}:raise ConsumerError('PROGRESS_CLASSIFICATION_RECEIPT_INCOMPLETE')
            opened_ref=relevance['open_item_ref']
            if self.capture_registered_source(p['source_ref'],registry_ref)['bytes'] != content(p['source_ref']):raise ConsumerError('CLASSIFIER_DELTA_BINDING_DRIFT')
            before,after=self._progress_delta(delta,opened_ref,registry_ref)
            mandatory={'classifier_id','classifier_revision','classification','evidence_ref','evidence_sha256','verdict','causal_action_token','observed_at_utc','novelty_key','relevance_receipt','source_event_id','evidence_type','readability_and_digest_verdict'}
            if not mandatory <= set(receipt) or any(receipt[k] in (None,'','unknown') for k in mandatory if k!='relevance_receipt'):raise ConsumerError('PROGRESS_CLASSIFICATION_RECEIPT_INCOMPLETE')
            novelty=sha(canonical({'kind':delta['kind'],'unit_id':delta['unit_id'],'before':sha(before),'after':sha(after)}))
            bindings={'classifier_id':registry['observer_id'],'classifier_revision':'local-v24','classification':delta['kind'],'evidence_ref':delta['after_ref']['path'],'evidence_sha256':sha(after),'verdict':'trusted','causal_action_token':registry['current_action_token'],'novelty_key':novelty,'relevance_receipt':{'unit_id':delta['unit_id'],'open_item_ref':opened_ref},'source_event_id':p['source_ref']['sha256'],'evidence_type':delta['kind'],'readability_and_digest_verdict':'verified','observer_source':loaded_source_identity(),'observer_process_identity':process_identity(os.getpid())}
            if any(receipt.get(k)!=v for k,v in bindings.items()):raise ConsumerError('CLASSIFIER_RECEIPT_BINDING_DRIFT')
            raw=canonical(receipt);digest=sha(raw)
            if read_ref(self.evidence,{'path':str(self.evidence/(digest+'.progress.json')),'sha256':digest})!=raw:raise ConsumerError('CLASSIFIER_RECEIPT_NOT_ISSUED')
            ledger=json.loads(read_bytes(self.evidence,self.evidence/'progress-novelty.json'))
            if digest not in ledger.get('receipts',[]) or novelty not in ledger['keys']:raise ConsumerError('CLASSIFIER_RECEIPT_NOT_ISSUED')
            if sha(after) in seen:raise ConsumerError('DUPLICATE_PROGRESS_REJECTED')
            seen.add(sha(after));accepted.append(event)
        return accepted

    def derive_failure_facts(self, bundle_ref):
        bundle, registry, events, content, doc = self._sources(bundle_ref)
        result = {}; by = lambda kind: [e for e in events if e['kind'] == kind]
        # F5/F6 attempts are actual ingress receipts, never request existence alone.
        attempts = by('private_caller_attempt'); states = by('store_snapshot'); guards = by('guard_attempt'); controls = by('control_ingress')
        fields = ['goal_unfinished', 'authority_valid', 'unit_ready', 'pause', 'blocker', 'progressing_executor', 'dispatch_ack_within_deadline', 'executor_state', 'novel_progress_within_budget', 'intent', 'control_revision_changed', 'next_action_suppressed', 'writable_owners', 'duplicate_side_effect', 'resume_attempted', 'head_or_evidence_stale', 'authority_revoked_or_pause_active']
        for field in fields: result[field] = self._field(None, gap='required independent source for '+field)
        if attempts:
            attempt = attempts[-1]['payload']; request = content(attempt['request_ref']); received = doc(attempt['received_ref']); record = doc(attempt['pre_guard_store_ref'])
            if received.get('request_sha256') != sha(request) or received.get('received_ns') != attempts[-1]['observed_monotonic_ns']: raise ConsumerError('CALLER_RECEIPT_BINDING_INVALID')
            result['resume_attempted'] = self._field(json.loads(request).get('method') == 'recover', attempt.values())
            if guards:
                guard = guards[-1]['payload']; source = doc(guard['attempt_ref'])
                if {'record_identity', 'current_identity'} <= set(source):
                    before, current = source['record_identity'], source['current_identity']
                    if set(before) != {'head', 'evidence_sha256'} or set(current) != set(before): raise ConsumerError('IDENTITY_SOURCE_INCOMPLETE')
                    result['head_or_evidence_stale'] = self._field(before != current, [guard['attempt_ref']])
                if {'authority', 'control', 'owner_receipt_ref'} <= set(source):
                    owner = doc(source['owner_receipt_ref'])
                    if owner['revision'] != source['control']['control_revision']: raise ConsumerError('OWNER_CONTROL_BINDING_DRIFT')
                    revoked = source['authority']['status'] == 'revoked'; paused = source['control']['paused']
                    if type(paused) is not bool: raise ConsumerError('CONTROL_TYPE')
                    result['authority_revoked_or_pause_active'] = self._field(revoked or paused, [guard['attempt_ref'], source['owner_receipt_ref']])
        if controls:
            p = controls[-1]['payload']; text = content(p['message_ref']).decode('utf-8'); before = doc(p['before_ref']); after = doc(p['after_ref']); receipt = doc(p['caller_receipt_ref'])
            result['intent'] = self._field('observation' if text in OBSERVATION_TEXTS else CONTROL_TEXTS.get(text, 'ambiguous'), [p['message_ref']])
            if type(before.get('control_revision')) is int and type(after.get('control_revision')) is int:
                result['control_revision_changed'] = self._field(before['control_revision'] != after['control_revision'], [p['before_ref'], p['after_ref']])
            # Local phase has no actual independent dispatcher/no-send ingress.
            # A caller's registered SUPPRESSED label cannot establish this field.
            result['next_action_suppressed'] = self._field(None, gap='actual dispatcher-read/suppressed + complete no-send journal not observed')
        # F1/F2 require real elapsed windows and OS/executor ingress, so short local
        # controls cannot accidentally establish their absence predicates.
        elapsed = (bundle['window']['end_ns']-bundle['window']['start_ns'])/1e9
        if states:
            p = states[0]['payload']; state = doc(p['record_ref'])
            if type(state.get('completion_predicate_satisfied')) is bool: result['goal_unfinished'] = self._field(not state['completion_predicate_satisfied'], [p['record_ref']])
            if state.get('authority_status') == 'valid' and state.get('authority_revision') == 1: result['authority_valid'] = self._field(True, [p['record_ref'], registry['authority_ref']])
            if type(state.get('unit_ready')) is bool and isinstance(state.get('blocking_dependency_ids'), list):
                result['unit_ready'] = self._field(state['unit_ready'] and not state['blocking_dependency_ids'], [p['record_ref']])
        if elapsed >= 120 and states and controls:
            control_states = [doc(e['payload']['after_ref']) for e in controls]
            if all(type(s.get('paused')) is bool for s in control_states): result['pause'] = self._field(any(s['paused'] for s in control_states), [e['payload']['after_ref'] for e in controls])
            state_docs = [doc(e['payload']['record_ref']) for e in states]
            if all(isinstance(s.get('blocking_dependency_ids'), list) for s in state_docs): result['blocker'] = self._field(any(s['blocking_dependency_ids'] for s in state_docs), [e['payload']['record_ref'] for e in states])
            # ACK requires matching actual request/frame; lack of host domain stays unknown.
            requests = by('host_request'); frames = by('host_frame')
            if requests and any(s['role'] == 'host' for s in registry['registered_sources']):
                ids = {e['payload']['jsonrpc_id'] for e in requests}
                matched = [e for e in frames if e['payload']['jsonrpc_id'] in ids and 'result' in doc(e['payload']['frame_ref'])]
                result['dispatch_ack_within_deadline'] = self._field(bool(matched), [e['payload']['request_ref'] for e in requests]+[e['payload']['frame_ref'] for e in frames])
        workers = by('worker_sample')
        if elapsed >= 120 and len(workers) >= 2:
            samples=[doc(e['payload']['os_sample_ref']) for e in workers]
            stamps=[e['observed_monotonic_ns'] for e in workers]
            complete=stamps[0]-bundle['window']['start_ns'] <= 5_000_000_000 and bundle['window']['end_ns']-stamps[-1] <= 5_000_000_000 and all(z-a <= 5_000_000_000 for a,z in zip(stamps,stamps[1:]))
            if complete and all({'executor_inventory','owned_launch_journal_ref'} <= set(sample) for sample in samples):
                launches=[doc(sample['owned_launch_journal_ref']) for sample in samples]
                if all(isinstance(launch,list) for launch in launches):
                    accepted=self._meaningful_receipts(events,content,doc,registry)
                    inventory={entry['pid'] for sample in samples for entry in sample['executor_inventory']}
                    launched={entry['pid'] for launch in launches for entry in launch}
                    if inventory <= launched:
                        result['progressing_executor']=self._field(bool(inventory and accepted),[e['payload']['os_sample_ref'] for e in workers]+[sample['owned_launch_journal_ref'] for sample in samples])
        if elapsed >= 255 and len(workers) >= 2:
            first, last = workers[0]['payload'], workers[-1]['payload']; a, z = doc(first['os_sample_ref']), doc(last['os_sample_ref'])
            if (first['pid'], first['process_start_identity']) == (last['pid'], last['process_start_identity']) and a.get('process_identity') == z.get('process_identity') == last['process_start_identity'] and first['ipc_ref'] and last['ipc_ref']:
                status = doc(last['ipc_ref'])
                result['executor_state'] = self._field(status.get('executor_state'), [last['ipc_ref'], first['os_sample_ref'], last['os_sample_ref']])
                receipts = self._meaningful_receipts(events,content,doc,registry)
                result['novel_progress_within_budget'] = self._field(bool(receipts), [e['payload']['receipt_ref'] for e in receipts])
                result['progressing_executor'] = self._field(bool(receipts), [last['os_sample_ref']]+[e['payload']['receipt_ref'] for e in receipts])
        # F4 only independent nonce+live overlapping capabilities and actual sink.
        ownership = by('ownership_sample')
        if ownership:
            p = ownership[-1]['payload']; cap = doc(p['write_capability_ref']); index = doc(p['effect_index_ref'])
            if {'nonce_challenges', 'live_capabilities'} <= set(cap) and isinstance(index, list):
                challenges = {c['actor']: c['nonce'] for c in cap['nonce_challenges']}
                active = {c['actor'] for c in cap['live_capabilities'] if c['nonce'] == challenges.get(c['actor']) and c['opened_ns'] <= bundle['window']['end_ns'] < c['closed_ns']}
                result['writable_owners'] = self._field(len(active), [p['write_capability_ref'], p['effect_index_ref']])
                counts = Counter((e['generation'], e['logical_effect_id'], e['payload_sha256']) for e in index if e['kind'] == 'effect')
                result['duplicate_side_effect'] = self._field(any(n > 1 for n in counts.values()), [p['effect_index_ref']])
        return {'fields': result, 'window': bundle['window'], 'runtime_acceptance': 'not_evaluated'}

    def derive_scenario_facts(self, bundle_ref):
        bundle, registry, events, content, doc = self._sources(bundle_ref)
        fields = ['all_units_ack_and_progress', 'stop_condition_real', 'premature_final', 'snapshot_reported', 'control_revision_unchanged', 'meaningful_action_after_report_within_budget', 'extra_resume_message', 'two_checkpoints_observed', 'status_only_not_progress', 'diagnosis_correct', 'takeover_from_last_valid_record', 'all_eight_steps_each_trigger', 'resume_from_last_valid_next_action', 'negative_variants_fail_closed', 'wakeup_source_recorded', 'stop_reason_persisted', 'old_tokens_and_late_owner_rejected', 'no_resume_without_explicit_reentry', 'goal_change_does_not_mutate_scope', 'max_writable_owners', 'duplicate_side_effects', 'stale_fencing_rejected', 'idempotent_ack_reused']
        result = {field: self._field(None, gap='runtime field requires actual full variant sources: '+field) for field in fields}
        by = lambda kind: [e for e in events if e['kind'] == kind]
        controls = by('control_ingress'); guards = by('guard_attempt'); states = by('store_snapshot'); ownership = by('ownership_sample'); recovery = by('recovery_step')
        if controls:
            source = [e['payload'] for e in controls]; pairs = [(doc(p['before_ref']), doc(p['after_ref'])) for p in source]
            if all(content(p['message_ref']).decode('utf-8') in OBSERVATION_TEXTS for p in source):
                safety={'control_revision','continuation_state','lease','queued_action_token','current_action_token','next_action','eligibility'}
                def complete(state):
                    if not safety <= set(state) or type(state['control_revision']) is not int or type(state['eligibility']) is not bool:return False
                    if state['continuation_state'] not in {'eligible','ineligible','recovering','stalled','stopped'}:return False
                    if state['lease'] is not None and not isinstance(state['lease'],dict):return False
                    if isinstance(state['lease'],dict) and not state['lease']:return False
                    for key in ('queued_action_token','current_action_token','next_action'):
                        if state[key] is not None and (not isinstance(state[key],str) or state[key].strip().lower() in {'','unknown','placeholder','unresolved'}):return False
                    return True
                if all(complete(state) for pair in pairs for state in pair):
                    result['control_revision_unchanged'] = self._field(all(all(a[k]==b[k] for k in safety) for a,b in pairs), [r for p in source for r in [p['before_ref'],p['after_ref']]])
            stop_pairs = [(p,a,b) for p,(a,b) in zip(source,pairs) if content(p['message_ref']).decode('utf-8') in CONTROL_TEXTS and CONTROL_TEXTS[content(p['message_ref']).decode('utf-8')] != 'control_resume']
            if stop_pairs:
                result['stop_reason_persisted'] = self._field(all(b.get('stop_reason') == CONTROL_TEXTS[content(p['message_ref']).decode('utf-8')] and b['control_revision'] > a['control_revision'] and b.get('current_action_token') != a.get('current_action_token') for p,a,b in stop_pairs), [p['after_ref'] for p,a,b in stop_pairs])
                if all('goal_ref' in a and 'scope_ref' in a and 'goal_ref' in b and 'scope_ref' in b for p,a,b in stop_pairs):
                    result['goal_change_does_not_mutate_scope'] = self._field(all(content(a['goal_ref']) == content(b['goal_ref']) and content(a['scope_ref']) == content(b['scope_ref']) for p,a,b in stop_pairs), [r for p,a,b in stop_pairs for r in [a['goal_ref'], b['goal_ref'], a['scope_ref'], b['scope_ref']]])
        if guards:
            rejected = []
            for event in guards:
                p = event['payload']; request = doc(p['attempt_ref']); response = doc(p['guard_response_ref'])
                stale = {'STALE_FENCING_TOKEN', 'STALE_CONTROL_REVISION'} <= set(response.get('reason_codes', []))
                unchanged = content(p['sink_before_ref']) == content(p['sink_after_ref'])
                rejected.append(stale and unchanged and response.get('allowed') is False)
            refs = [r for e in guards for r in e['payload'].values()]
            result['stale_fencing_rejected'] = self._field(all(rejected), refs)
            result['old_tokens_and_late_owner_rejected'] = self._field(all(rejected), refs)
        if ownership:
            p = ownership[-1]['payload']; cap = doc(p['write_capability_ref']); effects = doc(p['effect_index_ref'])
            if isinstance(cap, list) and isinstance(effects, list):
                ticks = sorted({x['start_ns'] for x in cap} | {x['end_ns'] for x in cap})
                peak = max((len({x['owner_id'] for x in cap if x['start_ns'] <= tick < x['end_ns']}) for tick in ticks), default=0)
                result['max_writable_owners'] = self._field(peak, [p['write_capability_ref'], p['lease_ref']])
                counts = Counter((x['generation'],x['logical_effect_id']) for x in effects)
                result['duplicate_side_effects'] = self._field(sum(max(0,n-1) for n in counts.values()), [p['effect_index_ref']])
        if recovery:
            required = ['goal', 'authority', 'control', 'record', 'repository', 'runtime', 'evidence', 'next_action']
            steps = [e['payload']['step'] for e in recovery]
            if steps == required:
                values=[];refs=[]
                for event in recovery:
                    p=event['payload']; inputs=doc(p['inputs_ref']); output=doc(p['output_ref']); refs += [p['inputs_ref'],p['output_ref']]
                    if set(inputs) != {'saved_ref','current_ref'}: raise ConsumerError('RECOVERY_INPUT_NOT_CLOSED')
                    same = content(inputs['saved_ref']) == content(inputs['current_ref'])
                    values.append(same and output.get('matched_sha256') == sha(content(inputs['current_ref'])))
                result['all_eight_steps_each_trigger'] = self._field(all(values), refs)
        requests = by('host_request'); frames = by('host_frame'); deltas = by('fixture_delta'); classified = self._meaningful_receipts(events,content,doc,registry)
        host_domain = any(s['role'] == 'host' for s in registry['registered_sources'])
        raw_frames = [(e,doc(e['payload']['frame_ref'])) for e in frames]
        # Correlate each raw request with actual response and subsequent terminal;
        # a producer ACK/count/marker cannot stand in for the bytes.
        units=[]
        for event in requests:
            p=event['payload']; request=doc(p['request_ref'])
            if sha(content(p['request_ref'])) != p['request_sha256'] or request.get('id') != p['jsonrpc_id'] or request.get('method') != p['method']: raise ConsumerError('HOST_REQUEST_BINDING_DRIFT')
            if p['method'] != 'turn/start': continue
            responses=[(e,f) for e,f in raw_frames if f.get('id') == request['id'] and 'result' in f]
            if len(responses) != 1: continue
            response=responses[0][1]; turn=response['result'].get('turn',{}).get('id')
            unit=request.get('params',{}).get('unit_id')
            terminal=[e for e,f in raw_frames if f.get('method') == 'turn/completed' and f.get('params',{}).get('turn',{}).get('id') == turn]
            matching=[e for e in deltas if doc(e['payload']['open_item_ref']).get('unit_id') == unit and content(e['payload']['before_ref']) != content(e['payload']['after_ref'])]
            receipts=[e for e in classified if doc(e['payload']['receipt_ref']).get('causal_action_token') == registry['current_action_token'] and doc(e['payload']['receipt_ref']).get('evidence_sha256') in {e['payload']['after_ref']['sha256'] for e in matching}]
            units.append({'unit':unit,'turn':turn,'terminal':terminal,'deltas':matching,'receipts':receipts,'event':event})
        if host_domain and units and states:
            initial=doc(states[0]['payload']['record_ref']); final=doc(states[-1]['payload']['record_ref']); refs=[e['payload']['record_ref'] for e in states]+[e['payload']['request_ref'] for e in requests]+[e['payload']['frame_ref'] for e in frames]
            if isinstance(initial.get('open_unit_ids'),list):
                result['all_units_ack_and_progress']=self._field(len(initial['open_unit_ids']) >= 3 and [u['unit'] for u in units] == initial['open_unit_ids'] and all(u['terminal'] and u['deltas'] and u['receipts'] for u in units),refs)
            if 'stop_predicate_ref' in initial and isinstance(final.get('open_unit_ids'),list):
                predicate=doc(initial['stop_predicate_ref'])
                if predicate == {'type':'open_unit_ids_empty'}:
                    result['stop_condition_real']=self._field(not final['open_unit_ids'],refs+[initial['stop_predicate_ref']])
            if all('open_unit_ids' in doc(e['payload']['record_ref']) for e in states):
                emitted=[e for e,f in raw_frames if f.get('method') in {'goal/final','goal/stop'}]
                premature=False
                for event in emitted:
                    earlier=[s for s in states if s['sequence'] < event['sequence']]
                    if not earlier: raise ConsumerError('FINAL_WITHOUT_STATE_SOURCE')
                    premature |= bool(doc(earlier[-1]['payload']['record_ref'])['open_unit_ids'])
                result['premature_final']=self._field(premature,refs)
        if controls and host_domain:
            pure=[e for e in controls if content(e['payload']['message_ref']).decode('utf-8') in OBSERVATION_TEXTS]
            if pure:
                reports=[(e,doc(e['payload']['caller_receipt_ref'])) for e in pure]
                result['snapshot_reported']=self._field(len(pure)==4 and all('snapshot_ref' in report and doc(report['snapshot_ref']).get('record_revision') == doc(event['payload']['before_ref']).get('record_revision') for event,report in reports),[e['payload']['caller_receipt_ref'] for e in pure])
                timely=all(any(u['event']['observed_monotonic_ns'] > e['observed_monotonic_ns'] and u['event']['observed_monotonic_ns']-e['observed_monotonic_ns'] <= 150_000_000_000 and u['receipts'] for u in units) for e in pure)
                result['meaningful_action_after_report_within_budget']=self._field(timely,[e['payload']['caller_receipt_ref'] for e in pure]+[e['payload']['request_ref'] for e in requests])
                result['extra_resume_message']=self._field(any(content(e['payload']['message_ref']).decode('utf-8') == '继续' for e in controls),[e['payload']['message_ref'] for e in controls])
            stopped=[e for e in controls if content(e['payload']['message_ref']).decode('utf-8') in CONTROL_TEXTS and content(e['payload']['message_ref']).decode('utf-8') != '继续']
            if stopped:
                start=stopped[0]['observed_monotonic_ns'];reentry=[e['observed_monotonic_ns'] for e in controls if content(e['payload']['message_ref']).decode('utf-8') == '继续' and e['observed_monotonic_ns'] > start]
                end=min(reentry,default=bundle['window']['end_ns'])
                result['no_resume_without_explicit_reentry']=self._field(not any(start < e['observed_monotonic_ns'] < end and e['payload']['method'] in {'turn/start','thread/resume'} for e in requests),[e['payload']['message_ref'] for e in stopped]+[e['payload']['request_ref'] for e in requests])
        ticks=by('scheduler_tick')
        if ticks and frames:
            refs=[e['payload']['route_ref'] for e in ticks]; clocks=[doc(r) for r in refs]
            if all({'checkpoint_index','worker_pid','worker_token','worker_start_ns','started_ns','quiescent_ns','last_progress_before_ns','last_progress_after_ns'} <= set(c) for c in clocks):
                cp=[c for c in clocks if c['checkpoint_index'] in {1,2}]
                if len(cp)==2:
                    a,b=cp; same=(a['worker_pid'],a['worker_token'],a['worker_start_ns'])==(b['worker_pid'],b['worker_token'],b['worker_start_ns'])
                    ordered=a['started_ns']-a['worker_start_ns'] >= 120_000_000_000 and b['started_ns']-a['started_ns'] >= 75_000_000_000 and a['quiescent_ns'] <= b['started_ns'] and b['quiescent_ns']-b['worker_start_ns'] >= 255_000_000_000
                    result['two_checkpoints_observed']=self._field(same and ordered,refs)
                status_clocks=[c for c in clocks if c.get('progress_input_kind') in {'status','ack','query'}]
                if status_clocks: result['status_only_not_progress']=self._field(all(c['last_progress_before_ns']==c['last_progress_after_ns'] for c in status_clocks),refs)
            routes=[c for c in clocks if 'diagnosis' in c]
            if routes:
                correct=[]
                for route in routes:
                    decision=route['diagnosis']; source=doc(route['basis_ref'])
                    if decision=='WAIT_LEGITIMATE': correct.append(source.get('job_process_identity') == process_identity(source['pid']) and source['deadline_ns'] > route['decided_ns'] and source['extensions_used'] <= 2)
                    elif decision=='WAIT_DEPENDENCY': correct.append(bool(source['blocking_dependency_ids']))
                    elif decision=='HANDOFF': correct.append(sorted(u for group in source['partitions'] for u in group)==sorted(source['open_unit_ids']))
                    elif decision=='RECOVER': correct.append(bool(guards) and result['stale_fencing_rejected']['value'] is True and 'last_valid_record_ref' in source)
                    else: correct.append(False)
                result['diagnosis_correct']=self._field(all(correct),refs)
        if recovery and units:
            last=doc(recovery[-1]['payload']['output_ref'])
            if 'next_action' in last:
                actual=any(u['unit']==last['next_action'] and u['terminal'] and u['deltas'] and u['receipts'] for u in units)
                refs=[e['payload']['output_ref'] for e in recovery]+[u['event']['payload']['request_ref'] for u in units]
                result['resume_from_last_valid_next_action']=self._field(actual,refs)
                if result['stale_fencing_rejected']['status']=='derived': result['takeover_from_last_valid_record']=self._field(actual and result['stale_fencing_rejected']['value'],refs)
        if guards and host_domain:
            identities={doc(e['payload']['attempt_ref']).get('identity_domain') for e in guards}
            needed={'goal','head','dirty_untracked','evidence','runtime'}
            if needed <= identities:
                result['negative_variants_fail_closed']=self._field(all(doc(e['payload']['guard_response_ref']).get('allowed') is False and content(e['payload']['sink_before_ref'])==content(e['payload']['sink_after_ref']) for e in guards),[r for e in guards for r in e['payload'].values()])
        cleanup=by('cleanup')
        if cleanup:
            source=doc(cleanup[-1]['payload']['exit_sample_ref'])
            if {'recovery_pid','recovery_process_identity','parent_pid','adapter_session_id','owned_thread_id'} <= set(source):
                result['wakeup_source_recorded']=self._field(source['recovery_process_identity']==process_identity(source['recovery_pid']) and source['parent_pid']==os.getpid(),[cleanup[-1]['payload']['exit_sample_ref']])
        if states and host_domain and ownership:
            snapshots=[doc(e['payload']['record_ref']) for e in states]
            actions=[s['idempotency_state']['logical_actions'] for s in snapshots if 'idempotency_state' in s]
            common=set.intersection(*(set(a) for a in actions)) if actions else set()
            if common:
                reused=[]
                for logical in common:
                    entries=[a[logical] for a in actions];acks=[a.get('ack_id') for a in entries if a.get('ack_id')]
                    reused.append(bool(acks) and len(set(acks))==1 and sum(e['payload']['method']=='turn/start' for e in requests)==1 and result['duplicate_side_effects']['value']==0)
                result['idempotent_ack_reused']=self._field(all(reused),[e['payload']['record_ref'] for e in states]+[e['payload']['request_ref'] for e in requests])
        # All absence and host lifecycle fields stay unknown until registered
        # domain coverage and real actuator/sink correlation are available.
        return {'fields': result, 'window': bundle['window'], 'runtime_acceptance': 'not_evaluated'}

    def independent_replay(self, request_ref, consumer_result_ref):
        request = json.loads(read_ref(self.root, request_ref)); result = json.loads(read_ref(self.evidence, consumer_result_ref))
        self.read_bundle(request['parameters']['source_bundle_ref'], request)
        operation = result.get('operation')
        observed = self.derive_context_and_parameters(operation, request['parameters']['source_bundle_ref'])
        actual = copy.deepcopy(result.get('observed')); actual.pop('failures', None); actual.pop('unresolved_failures', None)
        return {'operation': operation, 'recomputed': observed, 'matches': actual == observed, 'runtime_acceptance': 'not_evaluated', 'dispatch_authority': False}

class StreamingCapture:
    """Append immutable observations; source domains precede future source bytes.

    Each source reader is bound once to an owned creation/channel proof.
    Caller role labels cannot register host or worker facts.
    """
    def __init__(self,repo,root,evidence_root,run_id,domains,authority_ref,execution_manifest_ref):
        self.repo=Path(repo).absolute();self.root=Path(root).absolute();self.evidence=Path(evidence_root).absolute()
        self.directory=confined(self.root,self.root/run_id);self.directory.mkdir(parents=True,exist_ok=False)
        self.run_id=run_id;self.authority_ref=authority_ref;self.manifest_ref=execution_manifest_ref
        self.observer_id='capture:'+run_id;self.identity=process_identity(os.getpid());self.clock_start=time.monotonic_ns()
        if not isinstance(domains,dict) or not domains:raise ConsumerError('CAPTURE_DOMAINS_REQUIRED')
        self.domains={};self.events=[];self.receipts=[];self.sources=[];self.dependencies=[];self.closed=False;self.last_ns=self.clock_start;self.previous=None
        for name,domain in domains.items():
            if set(domain)!={'kind','reader','creation_ref','channel_ref'} or not callable(domain['reader']):raise ConsumerError('DOMAIN_READER_NOT_BOUND')
            for field in ('creation_ref','channel_ref'):read_ref(self.root,domain[field])
            self.domains[name]=domain
        for sub in ('sources','receipts','snapshots'):confined(self.root,self.directory/sub).mkdir(exist_ok=True)
        launch={'run_id':run_id,'observer_id':self.observer_id,'observer_process_identity':self.identity,'historical_process_identity':self.identity,'row_start_ns':self.clock_start,'required_domain_ids':sorted(domains),'execution_source_manifest_ref':execution_manifest_ref,'authority_ref':authority_ref}
        self.launch_ref=immutable(self.root,self.directory/'capture-launch.json',canonical(launch))
        manifest={'schema_version':'rgc_capture_domains_v36candidate','run_id':run_id,'capture_launch_ref':self.launch_ref,'domains':[{'domain_id':name,'kind':d['kind'],'producer_creation_ref':d['creation_ref'],'channel_creation_ref':d['channel_ref'],'collector_source_ref':loaded_source_identity(),'open_sequence':1} for name,d in self.domains.items()]}
        self.domain_ref=immutable(self.root,self.directory/'capture-domains.json',canonical(manifest))
    def observe(self,domain_id,kind,payload_builder,action_token=None):
        if self.closed or domain_id not in self.domains or not callable(payload_builder):raise ConsumerError('CAPTURE_DOMAIN_NOT_ACTIVE')
        if process_identity(os.getpid())!=self.identity:raise ConsumerError('CAPTURE_OBSERVER_GENERATION_DRIFT')
        domain=self.domains[domain_id];raw=domain['reader']()
        if not isinstance(raw,bytes):raise ConsumerError('CAPTURE_READER_BYTES_REQUIRED')
        now=time.monotonic_ns()
        if now<self.last_ns:raise ConsumerError('CAPTURE_CLOCK_REGRESSION')
        self.last_ns=now;seq=len(self.events)+1
        source=immutable(self.root,self.directory/'sources'/('%08d.source'%seq),raw);self.sources.append(source)
        payload=payload_builder(source)
        if not isinstance(payload,dict):raise ConsumerError('CAPTURE_PAYLOAD_INVALID')
        reject_oracle(payload)
        core={'schema_version':'rgc_runtime_event_v36candidate','run_id':self.run_id,'sequence':seq,'observed_monotonic_ns':now,'observed_utc':datetime.now(timezone.utc).isoformat(),'clock_owner_id':self.observer_id,'observer_id':self.observer_id,'producer_id':domain_id,'action_token':action_token,'kind':kind,'source_refs':[source],'payload':payload}
        receipt={'schema_version':'rgc_capture_receipt_v36candidate','run_id':self.run_id,'observer_id':self.observer_id,'observer_process_identity':self.identity,'domain_id':domain_id,'sequence':seq,'observed_monotonic_ns':now,'observed_utc':core['observed_utc'],'event_core_sha256':sha(canonical(core)),'source_refs':[source],'origin_capture_refs':[domain['creation_ref'],domain['channel_ref']],'previous_capture_receipt_ref':self.previous}
        receipt_ref=immutable(self.root,self.directory/'receipts'/('%08d.json'%seq),canonical(receipt));self.receipts.append(receipt_ref);self.previous=receipt_ref
        event={**core,'capture_receipt_ref':receipt_ref};self.events.append(event)
        immutable(self.root,self.directory/('%08d.event.json'%seq),canonical(event))
        return event
    def seal(self,registry_ref,dependency_refs,gap_state='none'):
        if self.closed or gap_state not in {'none','unknown','unresolved'}:raise ConsumerError('CAPTURE_CLOSE_INVALID')
        self.closed=True
        if not self.events or self.events[0]['kind']!='ingress_open' or self.events[-1]['kind']!='ingress_close':raise ConsumerError('CAPTURE_INGRESS_NOT_CLOSED')
        if self.events[-1]['payload'].get('last_sequence')!=len(self.events):raise ConsumerError('CAPTURE_CLOSE_SEQUENCE_MISMATCH')
        read_ref(self.root,registry_ref)
        stream=immutable(self.root,self.directory/'capture-events.json',canonical(self.events))
        close=immutable(self.root,self.directory/'capture-close.json',canonical({'closed':gap_state=='none','last_sequence':len(self.events),'observer_process_identity':self.identity,'end_ns':self.last_ns,'unterminated_domains':[] if gap_state=='none' else sorted(self.domains)}))
        refs=[self.launch_ref,self.domain_ref,registry_ref,stream,close]+self.sources+self.receipts
        refs += [d[k] for d in self.domains.values() for k in ('creation_ref','channel_ref')]
        def closure(value):
            if isinstance(value,dict):
                if set(value)=={'path','sha256'}:
                    try:confined(self.root,value['path'])
                    except ConsumerError:return
                    refs.append(value)
                else:
                    for item in value.values():closure(item)
            elif isinstance(value,list):
                for item in value:closure(item)
        closure(json.loads(read_ref(self.root,registry_ref)))
        copies=[];seen=set()
        for reference in refs:
            key=canonical(reference)
            if key in seen:continue
            seen.add(key);raw=read_ref(self.root,reference);snapshot=immutable(self.root,self.directory/'snapshots'/(str(len(copies))+'.source'),raw);copies.append({'original_ref':reference,'snapshot_ref':snapshot})
            try:closure(json.loads(raw))
            except (ValueError,UnicodeDecodeError):pass
        deps=[]
        for reference in dependency_refs:
            snapshot=immutable(self.root,self.directory/'snapshots'/('dependency-'+str(len(deps))+'.source'),read_ref(self.repo,reference));deps.append({'original_ref':reference,'snapshot_ref':snapshot,**({'purpose':'executed_code'} if Path(reference['path']).name=='rgc_runtime_observer.py' else {})})
        window={'clock_owner_id':self.observer_id,'start_ns':self.events[0]['observed_monotonic_ns'],'end_ns':self.events[-1]['observed_monotonic_ns'],'first_sequence':1,'last_sequence':len(self.events)}
        manifest={'schema_version':'rgc_capture_manifest_v36candidate','run_id':self.run_id,'domain_manifest_ref':self.domain_ref,'capture_launch_ref':self.launch_ref,'capture_close_ref':close,'registry_ref':registry_ref,'event_stream_ref':stream,'capture_receipts':self.receipts,'source_copies':copies,'dependency_copies':deps,'window':window,'gap_state':gap_state}
        return immutable(self.root,self.directory/'capture-manifest.json',canonical(manifest))


def open_archive_capture(repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref):
    """Separate offline entry: no live PID/owned lookup, never grants dispatch."""
    repo=Path(repo).absolute()
    request=json.loads(read_ref(repo,request_ref));reject_oracle(request)
    replay=json.loads(read_ref(repo,replay_execution_manifest_ref))
    if replay.get('loaded_observer_sha256')!=loaded_source_identity()['sha256']:raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
    if request.get('capture_manifest_ref')!=trusted_capture_manifest_ref:raise ConsumerError('TRUSTED_CAPTURE_PIN_MISMATCH')
    capture=json.loads(read_ref(repo,trusted_capture_manifest_ref));inventory={}
    for row in capture['source_copies']+capture['dependency_copies']:
        raw=read_ref(repo,row['snapshot_ref'])
        if sha(raw)!=row['original_ref']['sha256']:raise ConsumerError('SOURCE_SNAPSHOT_DRIFT')
        key=canonical(row['original_ref'])
        if key in inventory and inventory[key]!=raw:raise ConsumerError('ARCHIVE_DUPLICATE_SOURCE_CONFLICT')
        inventory[key]=raw
    def archived(reference):
        if canonical(reference) not in inventory:raise ConsumerError('ARCHIVE_INVENTORY_INCOMPLETE')
        return json.loads(inventory[canonical(reference)])
    events=archived(capture['event_stream_ref']);registry=archived(capture['registry_ref']);launch=archived(capture['capture_launch_ref']);domains=archived(capture['domain_manifest_ref'])
    ids={d['domain_id'] for d in domains['domains']}
    if len(ids)!=len(domains['domains']) or ids!=set(launch['required_domain_ids']):raise ConsumerError('INGRESS_DOMAIN_INCOMPLETE')
    sequences=[e['sequence'] for e in events];window=capture['window']
    if capture['gap_state']!='none' or sequences!=list(range(window['first_sequence'],window['last_sequence']+1)) or any(e['kind']=='source_gap' or e['clock_owner_id']!=window['clock_owner_id'] for e in events):raise ConsumerError('INGRESS_GAP')
    previous=None;receipts={canonical(r):archived(r) for r in capture['capture_receipts']}
    for event in events:
        receipt=receipts.get(canonical(event['capture_receipt_ref']));core={k:v for k,v in event.items() if k!='capture_receipt_ref'}
        if receipt is None or receipt['event_core_sha256']!=sha(canonical(core)) or receipt['previous_capture_receipt_ref']!=previous or receipt['sequence']!=event['sequence'] or receipt['source_refs']!=event['source_refs'] or receipt['domain_id'] not in ids:raise ConsumerError('CAPTURE_RECEIPT_BINDING_INVALID')
        previous=event['capture_receipt_ref']
        for reference in event['source_refs']:archived(reference)
    lineage=archived(registry['token_lineage_ref'])['entries']
    for event in events:
        if event['action_token'] is None:continue
        tokens=[t for t in lineage if t['token']==event['action_token']]
        if len(tokens)!=1 or not tokens[0]['issued_sequence']<=event['sequence'] or tokens[0]['revoked_sequence'] is not None and event['sequence']>=tokens[0]['revoked_sequence']:raise ConsumerError('SOURCE_TOKEN_REVOKED')
    if not launch.get('historical_process_identity') or not capture['dependency_copies']:raise ConsumerError('HISTORICAL_INPUT_INCOMPLETE')
    return {'capture':capture,'events':events,'registry':registry,'archived':archived,'dispatch_authority':False}

import uuid

def _capture_worker_execution(self,boundary,key,spec_ref,wait_ref):
    """Parent observer derives an execution receipt from the owned Popen handle.

    Producer JSON is insufficient: the fixed launch request, actual handle exit,
    output bytes and deterministic worker input computation must all match.
    """
    from rgc_runtime_driver import OwnedProcessBoundary
    from rgc_runtime_fixtures import worker_compute,validate_worker_spec
    if type(boundary) is not OwnedProcessBoundary or key not in boundary.handles or key not in boundary.proofs:raise ConsumerError('EXECUTION_SOURCE_NOT_OBSERVED')
    process=boundary.handles[key];proof=boundary.proofs[key]
    if process.returncode is None:raise ConsumerError('EXECUTION_NOT_TERMINAL')
    receipt=json.loads(read_ref(self.root,wait_ref));spec=json.loads(read_ref(self.root,spec_ref))
    if receipt['spec_ref']!=spec_ref or receipt['pid']!=process.pid or receipt['actual_exit_code']!=process.returncode or receipt['process_identity_at_launch']!=proof['identity'] or receipt['action_token']!=spec['action_token'] or receipt['unit_id']!=spec['unit_id']:raise ConsumerError('EXECUTION_RECEIPT_BINDING_DRIFT')
    request=json.loads(read_ref(self.root,proof['request_ref']))
    if request['creator_process_identity']!=process_identity(os.getpid()) or request['executable_sha256']!=sha(Path(sys.executable).read_bytes()):raise ConsumerError('EXECUTION_CREATOR_SOURCE_DRIFT')
    output_ref=receipt['output_ref']
    if process.returncode!=0 or output_ref is None:raise ConsumerError('EXECUTION_FAILED_NOT_PROGRESS')
    if 'long_parent_spec_ref' in receipt:
        from rgc_runtime_fixtures import long_stage_specs
        parent=json.loads(read_ref(self.root,receipt['long_parent_spec_ref']));stages=long_stage_specs(self.root,parent)
        if spec_ref not in [ref for ref,_ in stages]:raise ConsumerError('LONG_STAGE_NOT_LAUNCH_BOUND')
        argv=[str(Path(sys.executable).resolve()),str(Path(__file__).with_name('rgc_runtime_fixtures.py').resolve()),'--worker-mode','long_control','--root',str(self.root),'--spec-ref',json.dumps(receipt['long_parent_spec_ref'],sort_keys=True)]
        if request['argv_sha256']!=sha(canonical(argv)):raise ConsumerError('LONG_STAGE_PARENT_LAUNCH_HASH_DRIFT')
        stage_ipc=json.loads(read_ref(self.root,receipt['stage_ipc_ref']));sample=json.loads(read_ref(self.root,receipt['stage_os_ref']))
        if stage_ipc.get('stage_spec_ref')!=spec_ref or stage_ipc.get('stage_output_ref')!=output_ref or sample['creation_proof_ref']!=proof['proof_ref'] or sample['process_identity']!=proof['identity']:raise ConsumerError('LONG_STAGE_ACTUAL_IPC_DRIFT')
    actual=read_ref(self.root,output_ref);expected=worker_compute(self.root,spec)
    if actual!=expected:raise ConsumerError('EXECUTION_OUTPUT_NOT_RECOMPUTABLE')
    observed={'wait_ref':wait_ref,'launch_request_ref':proof['request_ref'],'creation_proof_ref':proof['proof_ref'],'output_ref':output_ref,'mode':spec['mode'],'unit_id':spec['unit_id'],'action_token':spec['action_token'],'exit_code':process.returncode,'observer_process_identity':process_identity(os.getpid()),'observer_source_identity':loaded_source_identity()}
    if not hasattr(self,'observed_executions'):self.observed_executions={}
    self.observed_executions[sha(actual)]=observed
    receipt_ref=immutable(self.evidence,self.evidence/(uuid.uuid4().hex+'.execution-observed.json'),canonical(observed))
    return self.archiveable_execution_receipt(receipt_ref)
RuntimeObserver.capture_worker_execution=_capture_worker_execution


# Archive replay does not consult current OS generations or grant live dispatch.
def archive_identity(replay, capture, read, digest):
    rows=[r for r in capture['dependency_copies'] if r.get('purpose')=='executed_code']
    if len(rows)!=1 or rows[0]['snapshot_ref']!=replay.get('executed_observer_source_ref'):
        return 'ARCHIVED_EXECUTION_IDENTITY_DRIFT'
    actual=digest(read(rows[0]['snapshot_ref']))
    if actual!=rows[0]['original_ref']['sha256'] or actual!=replay.get('archived_loaded_observer_sha256'):
        return 'ARCHIVED_EXECUTION_IDENTITY_DRIFT'
    return None

TERMINAL={'completed','interrupted','failed'}
def derive_archive_checkpoint(events, registry, capture, archived):
    def fail(reason, status='ineligible'):
        return {'eligible': False, 'status': status, 'reason': reason, 'dispatch_authority': False}
    try:
        lineage = archived(registry['token_lineage_ref'])['entries']
        cp = [t for t in lineage if t['kind'] == 'checkpoint' and t['logical_action_id'] == 'CP1']
        if len(cp) != 1:
            return fail('CHECKPOINT_ISSUANCE_UNKNOWN', 'unknown')
        cp = cp[0]
        issuance = archived(cp['issuance_store_ref'])
        required = ['logical_action_id', 'token', 'host_request_ref', 'adapter_session_id', 'jsonrpc_id']
        if any(k not in issuance for k in required):
            return fail('CHECKPOINT_REQUEST_BINDING_UNKNOWN', 'unknown')
        if issuance['logical_action_id'] != cp['logical_action_id'] or issuance['token'] != cp['token']:
            return fail('CHECKPOINT_ISSUANCE_MISMATCH')
        request = archived(issuance['host_request_ref'])
        session = issuance['adapter_session_id']
        token = cp['token']
        thread = request.get('params', {}).get('threadId')
        if not session or not thread or request.get('method') != 'turn/start' or request.get('id') != issuance['jsonrpc_id']:
            return fail('CHECKPOINT_START_REQUEST_INVALID')
        window = capture['window']
        times = [e['observed_monotonic_ns'] for e in events]
        launch = archived(capture['capture_launch_ref'])
        if 'row_start_ns' not in launch:
            return fail('ROW_CLOCK_ORIGIN_UNKNOWN', 'unknown')
        if (times != sorted(times) or not times or times[0] < window['start_ns'] or times[-1] > window['end_ns'] or
            window['end_ns'] > launch['row_start_ns'] + 210 * 10**9):
            return fail('CHECKPOINT_CLOCK_WINDOW_INVALID', 'unknown')
        if (events[0]['kind'] != 'ingress_open' or events[-1]['kind'] != 'ingress_close' or
            events[-1]['payload']['last_sequence'] != events[-1]['sequence'] or
            events[-1]['payload']['terminal_reason'] != 'normal' or
            archived(capture['capture_close_ref']).get('closed') is not True):
            return fail('CHECKPOINT_WINDOW_NOT_COMPLETE', 'unknown')
        for e in events:
            r = archived(e['capture_receipt_ref'])
            if (r['observer_process_identity'] != registry['observer_process_identity'] or
                r['observer_id'] != registry['observer_id'] or r['observed_monotonic_ns'] != e['observed_monotonic_ns']):
                return fail('CHECKPOINT_OBSERVER_CLOCK_DRIFT', 'unknown')
            if e['kind'] in {'host_request','host_frame'}:
                channels=[archived(o) for o in r['origin_capture_refs']]
                if not any(c.get('adapter_session_id')==session for c in channels):
                    return fail('CHECKPOINT_CHANNEL_SOURCE_UNKNOWN', 'unknown')
        requests = [e for e in events if e['kind'] == 'host_request']
        starts = [e for e in requests if e['payload']['request_ref'] == issuance['host_request_ref']]
        if len(starts) != 1:
            return fail('CHECKPOINT_START_CAPTURE_UNKNOWN', 'unknown')
        start = starts[0]
        if (start['action_token'] != token or start['payload']['method'] != 'turn/start' or
            start['payload']['jsonrpc_id'] != request['id'] or start['payload']['thread_id'] != thread):
            return fail('CHECKPOINT_START_CAPTURE_MISMATCH')
        frames = [(e, archived(e['payload']['frame_ref'])) for e in events if e['kind'] == 'host_frame']
        replies = [(e, raw) for e, raw in frames if raw.get('id') == request['id'] and 'result' in raw]
        if len(replies) != 1:
            return fail('CHECKPOINT_START_RESPONSE_UNKNOWN', 'unknown')
        reply, body = replies[0]
        host_turn = body.get('result', {}).get('turn', {}).get('id')
        if not host_turn:
            return fail('CHECKPOINT_HOST_TURN_UNKNOWN', 'unknown')
        def valid_envelope(e, raw, after):
            p = e['payload']
            return (e['action_token'] == token and p['adapter_session_id'] == session and
                p['jsonrpc_id'] == raw.get('id') and p['thread_id'] == thread and
                p['turn_id'] == host_turn and e['sequence'] > after and
                cp['issued_sequence'] <= e['sequence'] and
                (cp['revoked_sequence'] is None or e['sequence'] < cp['revoked_sequence']))
        if not valid_envelope(reply, body, start['sequence']):
            return fail('CHECKPOINT_START_RESPONSE_MISMATCH')
        completed = [(e, raw) for e, raw in frames if raw.get('method') == 'turn/completed']
        if len(completed) != 1:
            return fail('CHECKPOINT_TERMINAL_UNKNOWN', 'unknown')
        terminal, body = completed[0]
        params = body.get('params', {})
        turn = params.get('turn', {})
        if (params.get('threadId') != thread or turn.get('id') != host_turn or
            turn.get('status') not in TERMINAL or not isinstance(turn.get('items'), list) or
            terminal['payload']['method'] != 'turn/completed' or not valid_envelope(terminal, body, reply['sequence'])):
            return fail('CHECKPOINT_TERMINAL_NOT_MATCHED')
        # 不从terminal label推断no-active；必须有其后的同session/thread read请求及响应。
        reads = []
        for e in requests:
            raw = archived(e['payload']['request_ref'])
            if raw.get('method') == 'thread/read':
                reads.append((e, raw))
        if len(reads) != 1:
            return fail('CHECKPOINT_NO_ACTIVE_READBACK_UNKNOWN', 'unknown')
        read_request, raw_request = reads[0]
        if (raw_request.get('params', {}).get('threadId') != thread or raw_request['params'].get('includeTurns') is not True or
            read_request['sequence'] <= terminal['sequence'] or read_request['action_token'] != token or
            read_request['payload']['method'] != 'thread/read' or read_request['payload']['jsonrpc_id'] != raw_request.get('id') or
            read_request['payload']['thread_id'] != thread or read_request['payload']['turn_id'] != host_turn):
            return fail('CHECKPOINT_NO_ACTIVE_REQUEST_MISMATCH')
        read_replies = [(e, raw) for e, raw in frames if raw.get('id') == raw_request.get('id') and 'result' in raw]
        if len(read_replies) != 1:
            return fail('CHECKPOINT_NO_ACTIVE_RESPONSE_UNKNOWN', 'unknown')
        read_event, read_body = read_replies[0]
        observed_thread = read_body.get('result', {}).get('thread', {})
        if not valid_envelope(read_event, read_body, read_request['sequence']) or observed_thread.get('id') != thread:
            return fail('CHECKPOINT_NO_ACTIVE_RESPONSE_MISMATCH')
        turns = observed_thread.get('turns')
        if observed_thread.get('status', {}).get('type') != 'idle':
            return fail('CHECKPOINT_THREAD_STILL_ACTIVE_OR_UNKNOWN')
        if not isinstance(turns, list) or any(t.get('status') not in TERMINAL for t in turns):
            return fail('CHECKPOINT_ACTIVE_TURN_OR_INCOMPLETE_HISTORY', 'unknown')
        matched = [t for t in turns if t.get('id') == host_turn]
        if len(matched) != 1 or matched[0].get('status') != turn['status']:
            return fail('CHECKPOINT_READBACK_TERMINAL_MISMATCH')
        # readback后若又出现该thread start或inProgress，不能用较早idle授CP2。
        for e in events:
            if e['sequence'] <= read_event['sequence']:
                continue
            if e['kind'] == 'host_request':
                raw = archived(e['payload']['request_ref'])
                if raw.get('method') == 'turn/start' and raw.get('params', {}).get('threadId') == thread:
                    return fail('CHECKPOINT_LATE_RESTART_OBSERVED')
            if e['kind'] == 'host_frame':
                raw = archived(e['payload']['frame_ref'])
                if raw.get('params', {}).get('threadId') == thread and raw.get('params', {}).get('turn', {}).get('status') == 'inProgress':
                    return fail('CHECKPOINT_LATE_ACTIVE_FRAME_OBSERVED')
        return {'eligible': True, 'status': 'structural_source_confirmed', 'reason': 'CHECKPOINT_MATCHED_AND_QUIESCENT',
            'dispatch_authority': False, 'derived_binding': {'logical_action_id': cp['logical_action_id'], 'adapter_session_id': session,
                'thread_id': thread, 'host_turn_id': host_turn, 'token': token, 'terminal_status': turn['status'],
                'start_request_ref': issuance['host_request_ref'], 'start_response_ref': reply['payload']['frame_ref'],
                'terminal_frame_ref': terminal['payload']['frame_ref'], 'readback_frame_ref': read_event['payload']['frame_ref']}}
    except (KeyError, TypeError, IndexError):
        return fail('CHECKPOINT_SOURCE_INPUT_INCOMPLETE', 'unknown')


def _replay_capture(repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,caller_replay_pin):
    repo=Path(repo).absolute()
    request=json.loads(read_ref(repo,request_ref));reject_oracle(request)
    capture=json.loads(read_ref(repo,request['capture_manifest_ref']));inventory={}
    for row in capture['source_copies']+capture['dependency_copies']:
        raw=read_ref(repo,row['snapshot_ref'])
        if sha(raw)!=row['original_ref']['sha256']:raise ConsumerError('SOURCE_SNAPSHOT_DRIFT')
        key=canonical(row['original_ref'])
        if key in inventory and inventory[key]!=raw:raise ConsumerError('ARCHIVE_DUPLICATE_SOURCE_CONFLICT')
        inventory[key]=raw
    if request['capture_manifest_ref']!=trusted_capture_manifest_ref:raise ConsumerError('TRUSTED_CAPTURE_PIN_MISMATCH')
    def archived(reference):
        raw=inventory.get(canonical(reference))
        if raw is None:raise ConsumerError('ARCHIVE_INVENTORY_INCOMPLETE')
        return json.loads(raw)
    launch=archived(capture['capture_launch_ref']);domains=archived(capture['domain_manifest_ref'])
    ids={d['domain_id'] for d in domains['domains']}
    if len(ids)!=len(domains['domains']) or ids!=set(launch['required_domain_ids']):raise ConsumerError('INGRESS_DOMAIN_INCOMPLETE')
    events=archived(capture['event_stream_ref']);window=capture['window']
    if capture['gap_state']!='none' or [e['sequence'] for e in events]!=list(range(window['first_sequence'],window['last_sequence']+1)) or any(e['kind']=='source_gap' or e['clock_owner_id']!=window['clock_owner_id'] for e in events):raise ConsumerError('INGRESS_GAP')
    previous=None;receipts={canonical(r):archived(r) for r in capture['capture_receipts']}
    for event in events:
        receipt=receipts.get(canonical(event['capture_receipt_ref']));core={k:v for k,v in event.items() if k!='capture_receipt_ref'}
        if receipt is None or receipt['event_core_sha256']!=sha(canonical(core)) or receipt['previous_capture_receipt_ref']!=previous or receipt['sequence']!=event['sequence'] or receipt['source_refs']!=event['source_refs'] or receipt['domain_id'] not in ids:raise ConsumerError('CAPTURE_RECEIPT_BINDING_INVALID')
        previous=event['capture_receipt_ref']
        for reference in event['source_refs']:archived(reference)
    registry=archived(capture['registry_ref']);lineage=archived(registry['token_lineage_ref'])['entries']
    for event in events:
        if event['action_token'] is None:continue
        tokens=[t for t in lineage if t['token']==event['action_token']]
        if len(tokens)!=1 or tokens[0]['issued_sequence']>event['sequence'] or tokens[0]['revoked_sequence'] is not None and event['sequence']>=tokens[0]['revoked_sequence']:raise ConsumerError('SOURCE_TOKEN_REVOKED')
    if caller_replay_pin is None:raise ConsumerError('INDEPENDENT_REPLAY_PIN_REQUIRED')
    pin=json.loads(read_ref(repo,caller_replay_pin))
    required={'schema_version','purpose','source_ref','interface','live_observer_source_ref','authority_owner','production_source_pin'}
    if not required<=set(pin) or set(pin)-required-{'source_freeze_ref'} or pin['schema_version']!='sp010_independent_replay_code_pin_v36' or pin['purpose'] not in {'local_reference_only','caller_approved_runtime_replay'} or pin['interface']!='archive_identity(replay,capture,read,sha)' or pin['authority_owner']!='independent audit caller':raise ConsumerError('INDEPENDENT_REPLAY_PIN_REQUIRED')
    if pin['purpose']=='caller_approved_runtime_replay':
        freeze=json.loads(read_ref(repo,pin['source_freeze_ref']))
        if pin['source_ref'] not in freeze['files']:raise ConsumerError('INDEPENDENT_REPLAY_PIN_REQUIRED')
        for ref in freeze['files']:read_ref(repo,ref)
    # Read once and compile exactly the verified bytes selected by the caller.
    import types
    code=read_ref(repo,pin['source_ref']);module=types.ModuleType('rgc_caller_pinned_replay')
    module.__file__=str(confined(repo,pin['source_ref']['path']))
    exec(compile(code,module.__file__,'exec'),module.__dict__)
    replay=json.loads(read_ref(repo,replay_execution_manifest_ref))
    if replay.get('loaded_replay_sha256')!=sha(code):raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
    reason=module.archive_identity(replay,capture,lambda ref:read_ref(repo,ref),sha)
    if reason:raise ConsumerError(reason)
    return {'capture':capture,'events':events,'registry':registry,'archived':archived,'pin':pin,'content':lambda ref:inventory[canonical(ref)],'dispatch_authority':False}


def open_archive_capture(repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,caller_replay_pin=None):
    return _replay_capture(repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,caller_replay_pin)


def audit_capture_boundary_v33(*,schema_version,action,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,current_live_state_ref,caller_replay_pin=None):
    # The v33 callable name is retained by the revised v36 frozen contract.
    if schema_version!='sp010_capture_boundary_invocation_v36' or action not in {'capture_validate','historical_compare','live_dispatch','checkpoint_cp2'}:raise ConsumerError('CAPTURE_INVOCATION_INVALID')
    repo=Path(__file__).resolve().parents[4]
    try:
        archive=_replay_capture(repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,caller_replay_pin)
        capture=archive['capture'];archived=archive['archived']
        if action=='live_dispatch':
            current=json.loads(read_ref(repo,current_live_state_ref));historical=archived(capture['capture_launch_ref']);pin=archive['pin']
            if current['authority_status']!='valid' or current['paused'] is not False or current['process_identity']!=historical['historical_process_identity'] or pin['purpose']!='caller_approved_runtime_replay' or pin['live_observer_source_ref'] is None:raise ConsumerError('FRESH_LIVE_AUTHORITY_REQUIRED')
            read_ref(repo,pin['live_observer_source_ref'])
            if loaded_source_identity()['sha256']!=pin['live_observer_source_ref']['sha256']:raise ConsumerError('LOADED_SOURCE_IDENTITY_DRIFT')
            raise ConsumerError('FRESH_LIVE_AUTHORITY_REQUIRED')
        if action=='checkpoint_cp2' and derive_archive_checkpoint(archive['events'],archive['registry'],capture,archived)['eligible'] is not True:raise ConsumerError('QUIESCENCE_NOT_OBSERVED')
        if action=='historical_compare':
            if not archived(capture['capture_launch_ref']).get('historical_process_identity') or not capture['dependency_copies']:raise ConsumerError('HISTORICAL_INPUT_INCOMPLETE')
            observed={'behavior':'accept_historical_comparison_only','reason':'HISTORICAL_CAPTURE_VALID','dispatch_authority':False}
        else:observed={'behavior':'accept_structural_capture_only','reason':'CAPTURE_LIFECYCLE_VALID','dispatch_authority':False}
    except ConsumerError as exc:
        reason=str(exc);observed={'behavior':'unknown_or_reject_no_absence' if reason=='INGRESS_GAP' else 'reject','reason':reason,'dispatch_authority':False}
    return {'contract_verdict':'valid','execution_verdict':'ok','observed':observed,'failure_fingerprint':observed['reason'],'dispatch_authority':False}

FAILURE_FIELDS=('goal_unfinished','authority_valid','unit_ready','pause','blocker','progressing_executor','dispatch_ack_within_deadline','executor_state','novel_progress_within_budget','intent','control_revision_changed','next_action_suppressed','writable_owners','duplicate_side_effect','resume_attempted','head_or_evidence_stale','authority_revoked_or_pause_active')
SCENARIO_FIELDS=('all_units_ack_and_progress','stop_condition_real','premature_final','snapshot_reported','control_revision_unchanged','meaningful_action_after_report_within_budget','extra_resume_message','two_checkpoints_observed','status_only_not_progress','diagnosis_correct','takeover_from_last_valid_record','all_eight_steps_each_trigger','resume_from_last_valid_next_action','negative_variants_fail_closed','wakeup_source_recorded','stop_reason_persisted','old_tokens_and_late_owner_rejected','no_resume_without_explicit_reentry','goal_change_does_not_mutate_scope','max_writable_owners','duplicate_side_effects','stale_fencing_rejected','idempotent_ack_reused')


def _archived_worker_output(spec,content):
    data=[content(r) for r in spec['input_refs']];mode=spec['mode']
    if mode=='new_finding':
        old=json.loads(data[0])
        if set(old)!={'left','right'} or any(type(x) is not int for x in old.values()):raise ConsumerError('FINDING_INPUT_INVALID')
        return canonical({'sum':old['left']+old['right']})
    if mode=='new_artifact':return data[0]+b'\nowned fixture artifact\n'
    if mode=='new_code_delta':return data[0]+b'\n# private fixture code delta\n'
    old=json.loads(data[0]) if mode not in {'new_command_result'} else None
    if mode=='new_decision':return canonical({'decision':old['candidate_actions'][0],'basis_refs':spec['input_refs'],'unit_id':spec['unit_id'],'scope_id':old['scope_id']})
    if mode=='new_blocker':
        if old.get('satisfied') is not False or not old.get('dependency_id'):raise ConsumerError('BLOCKER_DEPENDENCY_INVALID')
        return canonical({'dependency_ids':[old['dependency_id']],'basis_refs':spec['input_refs'],'unit_id':spec['unit_id']})
    if mode=='next_action_convergence':return canonical({'next_action':old['candidate_actions'][0],'scope_id':old['scope_id'],'basis_refs':spec['input_refs']})
    if mode=='new_test_result':
        passed=type(old.get('left')) is int and type(old.get('right')) is int
        return canonical({'case_input_ref':spec['input_refs'][0],'case_input_sha256':sha(data[0]),'computed_sum':old['left']+old['right'] if passed else None,'test_passed':passed})
    if mode=='new_command_result':return canonical({'input_sha256':sha(data[0]),'byte_count':len(data[0])})
    raise ConsumerError('STATUS_OR_UNKNOWN_KIND_NOT_PROGRESS')


def _derive_archive_fields(archive,operation):
    if operation not in {'detect_failure','runtime_replay'}:raise ConsumerError('RUNTIME_OPERATION_UNKNOWN')
    capture=archive['capture'];events=archive['events'];registry=archive['registry'];doc=archive['archived'];content=archive['content']
    names=FAILURE_FIELDS if operation=='detect_failure' else SCENARIO_FIELDS
    fields={n:RuntimeObserver._field(None,gap='缺少该字段完整实际来源闭包: '+n) for n in names}
    by=lambda kind:[e for e in events if e['kind']==kind]
    def put(name,value,refs):
        if name in fields:fields[name]=RuntimeObserver._field(value,refs)
    domains=doc(capture['domain_manifest_ref']);launch=doc(capture['capture_launch_ref']);close=doc(capture['capture_close_ref']);window=capture['window']
    kinds={d['kind'] for d in domains['domains']}
    times=[e['observed_monotonic_ns'] for e in events]
    if any(type(t) is not int for t in times) or times!=sorted(times) or not times or times[0]<window['start_ns'] or times[-1]>window['end_ns']:raise ConsumerError('CAPTURE_CLOCK_WINDOW_INVALID')
    all_closed=(capture['gap_state']=='none' and events[0]['kind']=='ingress_open' and events[-1]['kind']=='ingress_close' and events[-1]['payload']['terminal_reason']=='normal' and close.get('closed') is True and not close.get('unterminated_domains'))
    elapsed=(window['end_ns']-window['start_ns'])/1e9
    closure_refs=[capture['domain_manifest_ref'],capture['capture_close_ref'],capture['event_stream_ref']]
    def closed(required,seconds=0):return all_closed and set(required)<=kinds and elapsed>=seconds
    def refs_of(items,key):return [e['payload'][key] for e in items]
    def control_view(record):
        if 'goal_binding' not in record:return record
        binding=record['goal_binding'];continuation=record['continuation']
        return {'record_revision':record['record_revision'],'control_revision':binding['control_revision'],'continuation_state':continuation['state'],'lease':record['executor_lease'],'current_action_token':continuation['action_token'],'queued_action_token':record['idempotency_state'].get('current_owner_attempt_id'),'next_action':record['next_action'],'eligibility':continuation['eligible'],'stop_reason':continuation['stop_reason'],'authority':binding,'paused':not continuation['eligible']}
    states=by('store_snapshot');state_docs=[doc(e['payload']['record_ref']) for e in states]
    controls=by('control_ingress');pairs=[(control_view(doc(e['payload']['before_ref'])),control_view(doc(e['payload']['after_ref']))) for e in controls]
    texts=[content(e['payload']['message_ref']).decode('utf-8') for e in controls]
    fixed_controls={**CONTROL_TEXTS,'先等我确认':'control_wait_confirm','修改 Goal':'control_goal_change','取消这个 Goal':'control_cancel','先不要继续':'control_pause'}
    profiles=[]
    for row in capture['dependency_copies']:
        if Path(row['original_ref']['path']).name=='Profile.json':
            candidate=doc(row['original_ref'])
            if isinstance(candidate,dict) and 'fixture_allowlist' in candidate:profiles.append(candidate)
    if len(profiles)==1:
        for fixture in profiles[0]['fixture_allowlist']:
            if fixture['id'] in {'pause','stop','cancel','wait_confirm','goal_change','resume'}:fixed_controls[fixture['text']]='control_'+fixture['id']
    queries=[(e,a,b) for e,(a,b),text in zip(controls,pairs,texts) if text in OBSERVATION_TEXTS]
    stop_entries=[(e,a,b,text) for e,(a,b),text in zip(controls,pairs,texts) if text in fixed_controls and fixed_controls[text]!='control_resume']
    if closed({'control'}) and controls:
        put('intent','observation' if texts[-1] in OBSERVATION_TEXTS else fixed_controls.get(texts[-1],'ambiguous'),refs_of(controls,'message_ref')+closure_refs)
        pure=all(t in OBSERVATION_TEXTS for t in texts)
        if pure and all(type(a.get('control_revision')) is int and type(b.get('control_revision')) is int for a,b in pairs):
            put('control_revision_changed',any(a['control_revision']!=b['control_revision'] for a,b in pairs),refs_of(controls,'before_ref')+refs_of(controls,'after_ref')+closure_refs)
        safety={'authority','control_revision','continuation_state','lease','eligibility','queued_action_token','current_action_token','next_action'}
        if pure and all(safety<=set(a) and safety<=set(b) and type(a['eligibility']) is bool and type(b['eligibility']) is bool and a['continuation_state']!='unknown' and b['continuation_state']!='unknown' for a,b in pairs):
            put('control_revision_unchanged',all(all(a[k]==b[k] for k in safety) for a,b in pairs),refs_of(controls,'before_ref')+refs_of(controls,'after_ref')+closure_refs)
        if closed({'host_transport','control','driver_emission','guard_sink'}) and queries:
            put('extra_resume_message',any(fixed_controls.get(t)=='control_resume' for t in texts),refs_of(controls,'message_ref')+closure_refs)
        if stop_entries:
            values=[];sources=[]
            for event,a,b,text in stop_entries:
                receipt=doc(event['payload']['caller_receipt_ref']);sources += list(event['payload'].values())
                if 'actual_dispatch_receipt' not in receipt or receipt.get('reopened_store_ref')!=event['payload']['after_ref']:break
                actual=receipt['actual_dispatch_receipt']
                expected=fixed_controls[text]
                values.append(b['stop_reason'] in {expected,expected.replace('control_','user_'),text} and b['control_revision']>a['control_revision'] and b['current_action_token'] is None and b['eligibility'] is False and actual)
            else:put('stop_reason_persisted',bool(values) and all(bool(x) for x in values),sources+closure_refs)
            bindings=[]
            for event,a,b,text in stop_entries:
                raw_a=doc(event['payload']['before_ref']);raw_b=doc(event['payload']['after_ref'])
                if 'goal_binding' not in raw_a or 'goal_binding' not in raw_b:break
                keys=('goal_ref','goal_sha256','completion_predicate_ref','completion_predicate_sha256','authority_ref','authority_sha256','authority_id')
                bindings.append(all(raw_a['goal_binding'][k]==raw_b['goal_binding'][k] for k in keys))
            else:put('goal_change_does_not_mutate_scope',all(bindings),[e['payload'][k] for e,_,_,_ in stop_entries for k in ('before_ref','after_ref')]+closure_refs)
    progress=[];novel=set()
    for event in by('classifier_receipt'):
        payload=event['payload'];receipt=doc(payload['receipt_ref']);delta=doc(payload['source_ref']);origin=doc(event['source_refs'][0])
        # Recompute actual worker execution, instead of trusting receipt verdict.
        if not {'actual_execution_ref','spec_ref'}<=set(origin):continue
        execution=doc(origin['actual_execution_ref']);spec=doc(origin['spec_ref']);wait=doc(execution['wait_ref']);creation=doc(execution['creation_proof_ref']);request=doc(execution['launch_request_ref'])
        output=content(execution['output_ref']);opened=doc(delta.get('open_item_ref',receipt['relevance_receipt']['open_item_ref']))
        proof=(wait['actual_exit_code']==execution['exit_code']==0 and wait['pid']==creation['pid'] and wait['process_identity_at_launch']==creation['process_identity'] and wait['action_token']==spec['action_token']==event['action_token']==receipt['causal_action_token'] and wait['unit_id']==spec['unit_id']==delta['unit_id'] and request['creator_process_identity']==execution['observer_process_identity'] and execution['observer_source_identity']['sha256']==receipt['observer_source']['sha256'])
        if not proof:raise ConsumerError('ARCHIVED_EXECUTION_RECEIPT_BINDING_DRIFT')
        if output!=_archived_worker_output(spec,content) or output!=content(delta['after_ref']):raise ConsumerError('ARCHIVED_PROGRESS_NOT_RECOMPUTABLE')
        if spec['unit_id'] not in opened['open_unit_ids'] or content(delta['before_ref'])==output:raise ConsumerError('ARCHIVED_PROGRESS_NOT_NOVEL_OR_RELEVANT')
        key=sha(canonical({'kind':delta['kind'],'unit_id':delta['unit_id'],'before':sha(content(delta['before_ref'])),'after':sha(output)}))
        if receipt['evidence_sha256']!=sha(output) or receipt['novelty_key']!=key or receipt['source_event_id']!=payload['source_ref']['sha256'] or receipt['classification']!=spec['mode']:raise ConsumerError('ARCHIVED_CLASSIFIER_BINDING_DRIFT')
        if sha(output) in novel:raise ConsumerError('DUPLICATE_PROGRESS_REJECTED')
        novel.add(sha(output));progress.append((event,receipt,spec))
    workers=by('worker_sample');worker_docs=[doc(e['payload']['os_sample_ref']) for e in workers]
    def same_worker_full(seconds):
        if not closed({'worker_ipc','os_sampler','progress','control','dependency'},seconds) or len(workers)<2:return False
        identities={(e['payload']['pid'],e['payload']['process_start_identity'],e['action_token']) for e in workers}
        if len(identities)!=1 or workers[-1]['observed_monotonic_ns']-workers[0]['observed_monotonic_ns']<seconds*10**9:return False
        if any(b['observed_monotonic_ns']-a['observed_monotonic_ns']>5*10**9 for a,b in zip(workers,workers[1:])):return False
        return all(s.get('process_identity')==e['payload']['process_start_identity'] and s.get('stdout_fd_open') is True and doc(s['creation_proof_ref'])['pid']==e['payload']['pid'] for e,s in zip(workers,worker_docs))
    if same_worker_full(255):
        ipc=doc(workers[-1]['payload']['ipc_ref']);token=workers[-1]['action_token'];matching=[e for e,r,s in progress if e['action_token']==token]
        put('executor_state',ipc.get('state'),refs_of(workers,'os_sample_ref')+refs_of(workers,'ipc_ref')+closure_refs)
        put('novel_progress_within_budget',bool(matching),refs_of(workers,'os_sample_ref')+[e['payload']['receipt_ref'] for e in matching]+closure_refs)
        put('progressing_executor',bool(matching),refs_of(workers,'os_sample_ref')+[e['payload']['receipt_ref'] for e in matching]+closure_refs)
    if closed({'store','control','dependency','driver_emission'},120) and state_docs:
        initial=state_docs[0];owners=[]
        for event in states:
            record=doc(event['payload']['record_ref'])
            if 'private_goal_owner_ref' in record:owners.append(doc(record['private_goal_owner_ref']))
        for event in events:
            source=doc(event['source_refs'][0])
            if isinstance(source,dict) and source.get('emission')=='private_owner_snapshot' and source.get('private_only') is True:
                predicate=doc(source['private_stop_predicate_ref']);actual=doc(source['actual_record_ref'])
                if predicate!={'type':'open_unit_ids_empty'} or 'open_items' not in actual:raise ConsumerError('PRIVATE_OWNER_RAW_PREDICATE_DRIFT')
                pending=[item['item_id'] for item in actual['open_items'] if item['state'] in {'open','ready','pending'}]
                owners.append({'completion_predicate_satisfied':not pending,'open_unit_ids':pending,'generation':source['owner_generation']})
        if owners and all({'completion_predicate_satisfied','open_unit_ids','generation'}<=set(o) for o in owners):
            put('goal_unfinished',not any(o['completion_predicate_satisfied'] for o in owners),refs_of(states,'record_ref')+closure_refs)
        if all('goal_binding' in x for x in state_docs):
            bindings=[x['goal_binding'] for x in state_docs];authority=doc(registry['authority_ref'])
            if authority.get('status')=='approved' and all(b['authority_sha256']==registry['authority_ref']['sha256'] for b in bindings):put('authority_valid',all(b['authority_status']=='valid' and b['authority_revision']==bindings[0]['authority_revision'] for b in bindings),refs_of(states,'record_ref')+[registry['authority_ref']]+closure_refs)
            put('pause',any(not x['continuation']['eligible'] for x in state_docs) or bool(stop_entries),refs_of(states,'record_ref')+refs_of(controls,'message_ref')+closure_refs)
        dependencies=[];queues=[]
        for event in by('scheduler_tick'):
            raw=doc(event['payload']['route_ref'])
            if 'dependency_source_ref' in raw:dependencies.append(doc(raw['dependency_source_ref']))
            if 'queue_source_ref' in raw:queues.append(doc(raw['queue_source_ref']))
        if dependencies and all('blocking_dependency_ids' in d for d in dependencies):put('blocker',any(d['blocking_dependency_ids'] for d in dependencies),refs_of(by('scheduler_tick'),'route_ref')+closure_refs)
        if queues and dependencies and all({'generation','unit_id','ready','blocking_dependency_ids'}<=set(q) for q in queues) and len({q['generation'] for q in queues})==1:
            put('unit_ready',all(q['ready'] is True and not q['blocking_dependency_ids'] for q in queues) and not any(d['blocking_dependency_ids'] for d in dependencies),refs_of(by('scheduler_tick'),'route_ref')+closure_refs)
    requests=by('host_request');frames=by('host_frame');raw_frames=[(e,doc(e['payload']['frame_ref'])) for e in frames];lineage=doc(registry['token_lineage_ref'])['entries'];units=[]
    for event in requests:
        p=event['payload'];request=doc(p['request_ref'])
        if request.get('id')!=p['jsonrpc_id'] or request.get('method')!=p['method'] or sha(content(p['request_ref']))!=p['request_sha256']:raise ConsumerError('HOST_REQUEST_BINDING_DRIFT')
        if request['method']!='turn/start':continue
        tokens=[t for t in lineage if t['token']==event['action_token']]
        if len(tokens)!=1 or not tokens[0].get('issuance_store_ref'):continue
        issuance=doc(tokens[0]['issuance_store_ref'])
        if tokens[0].get('kind')=='checkpoint' or 'unit_id' not in issuance:continue
        if issuance.get('host_request_ref')!=p['request_ref'] or issuance.get('jsonrpc_id')!=request['id']:continue
        thread=request['params']['threadId'];replies=[(e,f) for e,f in raw_frames if f.get('id')==request['id'] and 'result' in f and e['action_token']==event['action_token'] and e['sequence']>event['sequence']]
        if len(replies)!=1:continue
        ack,body=replies[0];turn=body['result'].get('turn',{}).get('id')
        terminal=[(e,f) for e,f in raw_frames if f.get('method')=='turn/completed' and f.get('params',{}).get('threadId')==thread and f['params'].get('turn',{}).get('id')==turn and f['params']['turn'].get('status') in TERMINAL and e['action_token']==event['action_token'] and e['sequence']>ack['sequence']]
        actual=[(e,r,s) for e,r,s in progress if s['unit_id']==issuance['unit_id'] and e['action_token']==event['action_token'] and terminal and e['sequence']>terminal[0][0]['sequence']]
        units.append({'event':event,'ack':ack,'terminal':terminal,'progress':actual,'unit_id':issuance['unit_id'],'issuance':tokens[0]['issuance_store_ref']})
    if closed({'host_transport','driver_emission','control','store'},120) and requests:
        put('dispatch_ack_within_deadline',any(u['ack']['observed_monotonic_ns']-u['event']['observed_monotonic_ns']<=120*10**9 for u in units),refs_of(requests,'request_ref')+refs_of(frames,'frame_ref')+closure_refs)
    if closed({'store','driver_emission','host_transport','progress'}) and state_docs:
        initial=state_docs[0];final=state_docs[-1]
        opened=[i['item_id'] for i in initial.get('open_items',[]) if i['state'] in {'open','ready','pending'}]
        pending=[i['item_id'] for i in final.get('open_items',[]) if i['state'] in {'open','ready','pending'}]
        if len(opened)>=3 and len(units)==len(opened):put('all_units_ack_and_progress',all(u['terminal'] and u['progress'] for u in units) and not pending,refs_of(states,'record_ref')+[u['issuance'] for u in units]+refs_of(frames,'frame_ref')+[e['payload']['receipt_ref'] for e,_,_ in progress]+closure_refs)
        emissions=[doc(e['source_refs'][0]) for e in events if e['producer_id'] in {d['domain_id'] for d in domains['domains'] if d['kind']=='driver_emission'}]
        stops=[s for s in emissions if s.get('emission') in {'private_goal_stop','final'}]
        if stops and 'private_stop_predicate_ref' in stops[-1]:
            predicate=doc(stops[-1]['private_stop_predicate_ref'])
            if predicate=={'type':'open_unit_ids_empty'}:put('stop_condition_real',not pending,refs_of(states,'record_ref')+[stops[-1]['private_stop_predicate_ref']]+closure_refs)
        if stops:
            checks=[]
            for event in events:
                source=doc(event['source_refs'][0])
                if source.get('emission') not in {'private_goal_stop','final'}:continue
                preceding=[x for x in states if x['sequence']<event['sequence']]
                if not preceding:raise ConsumerError('FINAL_WITHOUT_STATE_SOURCE')
                checks.append(any(i['state'] in {'open','ready','pending'} for i in doc(preceding[-1]['payload']['record_ref']).get('open_items',[])))
            put('premature_final',any(checks),refs_of(states,'record_ref')+closure_refs)
    if closed({'control','store','host_transport','progress','driver_emission'}) and queries:
        if len({content(e['payload']['message_ref']) for e,_,_ in queries})==4:
            put('snapshot_reported',all(doc(e['payload']['caller_receipt_ref']).get('snapshot_ref')==e['payload']['before_ref'] for e,_,_ in queries),[e['payload']['caller_receipt_ref'] for e,_,_ in queries]+closure_refs)
        if all(any(u['progress'] and 0<u['event']['observed_monotonic_ns']-e['observed_monotonic_ns']<=150*10**9 for u in units) for e,_,_ in queries):put('meaningful_action_after_report_within_budget',True,[e['payload']['caller_receipt_ref'] for e,_,_ in queries]+refs_of(requests,'request_ref')+closure_refs)
    if closed({'control','host_transport','guard_sink','driver_emission'}) and stop_entries:
        first=stop_entries[0][0];resumes=[e for e,t in zip(controls,texts) if fixed_controls.get(t)=='control_resume' and e['sequence']>first['sequence']];end=resumes[0]['sequence'] if resumes else events[-1]['sequence']
        put('no_resume_without_explicit_reentry',not any(first['sequence']<e['sequence']<end and e['payload']['method'] in {'turn/start','thread/resume'} for e in requests),refs_of(controls,'message_ref')+refs_of(requests,'request_ref')+closure_refs)
    ticks=by('scheduler_tick');routes=[doc(e['payload']['route_ref']) for e in ticks]
    checkpoints=[r for r in routes if r.get('checkpoint_index') in {1,2}]
    if same_worker_full(255) and len(checkpoints)==2:
        a,b=checkpoints;same=(a['worker_pid'],a['worker_token'],a['worker_start_ns'])==(b['worker_pid'],b['worker_token'],b['worker_start_ns'])
        issuance=[doc(r['issuance_ref']) for r in checkpoints] if all('issuance_ref' in r for r in checkpoints) else []
        ordered=a['started_ns']>=launch['row_start_ns']+135*10**9 and b['started_ns']>=launch['row_start_ns']+210*10**9 and a['quiescent_ns']<=launch['row_start_ns']+210*10**9 and b['quiescent_ns']<=launch['row_start_ns']+270*10**9
        if issuance:put('two_checkpoints_observed',same and ordered and issuance[0]['token']!=issuance[1]['token'] and all(x['token']!=a['worker_token'] for x in issuance),refs_of(ticks,'route_ref')+refs_of(workers,'os_sample_ref')+closure_refs)
    clocks=[r for r in routes if r.get('progress_input_kind') in {'status','ack','query'}]
    if clocks and closed({'progress','worker_ipc','host_transport'}):put('status_only_not_progress',all(r['last_progress_before_ns']==r['last_progress_after_ns'] for r in clocks),refs_of(ticks,'route_ref')+closure_refs)
    diagnoses=[r for r in routes if 'diagnosis' in r];decisions=[]
    for route in diagnoses:
        basis=doc(route['basis_ref']);decision=route['diagnosis']
        if decision=='WAIT_LEGITIMATE':decisions.append(any(s['pid']==basis['pid'] and s['process_identity']==basis['job_process_identity'] for s in worker_docs) and basis['deadline_ns']>route['decided_ns'] and type(basis['extensions_used']) is int and 0<=basis['extensions_used']<=2)
        elif decision=='WAIT_DEPENDENCY':decisions.append(bool(basis.get('blocking_dependency_ids')))
        elif decision=='HANDOFF':decisions.append(sorted(u for group in basis['partitions'] for u in group)==sorted(basis['open_unit_ids']) and len(set(u for group in basis['partitions'] for u in group))==len(basis['open_unit_ids']))
        elif decision=='RECOVER':decisions.append(bool(basis.get('fence_guard_ref')) and basis.get('last_valid_record_ref') is not None)
        else:decisions.append(False)
    if decisions:put('diagnosis_correct',all(decisions),refs_of(ticks,'route_ref')+closure_refs)
    recovery=by('recovery_step');groups={}
    for event in recovery:
        inputs=doc(event['payload']['inputs_ref']);groups.setdefault(inputs.get('trigger'),[]).append((event,inputs))
    eight=('goal','authority','control','record','repository','runtime','evidence','next_action');good=[]
    for trigger,group in groups.items():
        if trigger not in {'turn_interrupted','executor_lost','client_restart','thread_resumed'} or tuple(e['payload']['step'] for e,_ in group)!=eight:continue
        good.append(all(content(i['saved_ref'])==content(i['current_ref']) and doc(e['payload']['output_ref'])['matched_sha256']==sha(content(i['current_ref'])) for e,i in group))
    if len(good)==4:put('all_eight_steps_each_trigger',all(good),refs_of(recovery,'inputs_ref')+refs_of(recovery,'output_ref')+closure_refs)
    if recovery and units:
        latest=doc(recovery[-1]['payload']['output_ref'])
        if 'next_action' in latest:put('resume_from_last_valid_next_action',any(u['issuance'] and doc(u['issuance']).get('item_id')==latest['next_action'] and u['progress'] for u in units),refs_of(recovery,'output_ref')+[u['issuance'] for u in units]+closure_refs)
    guards=by('guard_attempt');checks=[];domains_seen=set()
    for event in guards:
        p=event['payload'];attempt=doc(p['attempt_ref']);response=doc(p['guard_response_ref'])
        if not {'current_record_ref','requested_fencing_token','requested_control_revision','actual_guard_source_ref'}<=set(attempt):continue
        current=doc(attempt['current_record_ref']);fence=current['executor_lease']['fencing_token'];control=current['goal_binding']['control_revision']
        actual_codes={code for condition,code in [(attempt['requested_fencing_token']!=fence,'STALE_FENCING_TOKEN'),(attempt['requested_control_revision']!=control,'STALE_CONTROL_REVISION')] if condition}
        if not actual_codes:continue
        equal=content(p['sink_before_ref'])==content(p['sink_after_ref']);checks.append(response.get('allowed') is False and actual_codes<=set(response['reason_codes']) and equal)
        domains_seen.add(attempt.get('identity_domain'))
    if checks and closed({'guard_sink','host_transport','store'}):
        sources=[r for e in guards for r in e['payload'].values()]+closure_refs
        put('stale_fencing_rejected',all(checks),sources);put('old_tokens_and_late_owner_rejected',all(checks),sources)
        if {'goal','head','dirty_untracked','evidence','runtime'}<=domains_seen:put('negative_variants_fail_closed',all(checks),sources)
        if 'resume_from_last_valid_next_action' in fields and fields['resume_from_last_valid_next_action']['status']=='derived':put('takeover_from_last_valid_record',fields['resume_from_last_valid_next_action']['value'] and all(checks),sources+fields['resume_from_last_valid_next_action']['source_refs'])
    attempts=by('private_caller_attempt')
    if attempts:
        p=attempts[-1]['payload'];request=content(p['request_ref']);received=doc(p['received_ref']);record=doc(p['pre_guard_store_ref'])
        if received.get('request_sha256')!=sha(request) or received.get('entrypoint')!='RuntimeDriver.recover_owned':raise ConsumerError('RECOVERY_INGRESS_SOURCE_NOT_ACTUAL')
        put('resume_attempted',True,list(p.values())+closure_refs)
        if 'goal_binding' in record:put('authority_revoked_or_pause_active',record['goal_binding']['authority_status'] in {'revoked','expired'} or not record['continuation']['eligible'],list(p.values())+closure_refs)
        for event in guards:
            source=doc(event['payload']['attempt_ref'])
            if {'record_identity','current_identity'}<=set(source) and set(source['record_identity'])==set(source['current_identity'])=={'head','evidence_sha256'}:put('head_or_evidence_stale',source['record_identity']!=source['current_identity'],[event['payload']['attempt_ref']]+closure_refs)
    ownership=by('ownership_sample')
    for event in ownership:
        p=event['payload'];caps=doc(p['write_capability_ref']);index=doc(p['effect_index_ref'])
        raw=None
        if isinstance(index,dict) and 'raw_sink_ref' in index:
            raw=content(index['raw_sink_ref']);parsed=[json.loads(line) for line in raw.splitlines() if line.strip()];effects=[x for x in parsed if x.get('kind')=='effect'];expected=[x for x in index.get('entries',[]) if x.get('kind')=='effect']
            if effects!=expected:raise ConsumerError('RAW_SINK_EFFECT_INDEX_DRIFT')
        else:continue
        counts=Counter((x['generation'],x['logical_effect_id'],x['payload_sha256']) for x in effects)
        sources=list(p.values())+[index['raw_sink_ref']]+closure_refs
        if isinstance(caps,list) and all({'owner_id','start_ns','end_ns','guard_grant_ref','fd_close_ref'}<=set(c) for c in caps):
            for cap in caps:doc(cap['guard_grant_ref']);doc(cap['fd_close_ref'])
            ticks=sorted({c['start_ns'] for c in caps}|{c['end_ns'] for c in caps});peak=max((len({c['owner_id'] for c in caps if c['start_ns']<=t<c['end_ns']}) for t in ticks),default=0)
            put('max_writable_owners',peak,sources);put('duplicate_side_effects',sum(max(0,n-1) for n in counts.values()),sources)
        if isinstance(caps,dict) and {'nonce_challenges','live_capabilities'}<=set(caps):
            challenges={c['actor']:c for c in caps['nonce_challenges']};active=[]
            for cap in caps['live_capabilities']:
                challenge=challenges.get(cap['actor']);proof=doc(cap['creation_proof_ref']);nonce=doc(cap['nonce_ipc_ref'])
                if challenge and cap['nonce']==challenge['nonce']==nonce['nonce'] and proof['pid']==cap['pid'] and cap['opened_ns']<cap['closed_ns']:active.append(cap)
            # Private fault capability ownership is concurrent, not cumulative.
            # Half-open FD intervals do not overlap at a shared close/open tick;
            # duplicate rows for one PID do not create a second live writer.
            ticks=sorted({c['opened_ns'] for c in active}|{c['closed_ns'] for c in active})
            peak=max((len({c['pid'] for c in active if c['opened_ns']<=t<c['closed_ns']}) for t in ticks),default=0)
            put('writable_owners',peak,sources);put('duplicate_side_effect',any(n>1 for n in counts.values()),sources)
    cleanups=by('cleanup')
    if cleanups:
        source=doc(cleanups[-1]['payload']['exit_sample_ref'])
        if {'creation_request_ref','creation_proof_ref','adapter_creation_ref','owned_thread_ref'}<=set(source):
            request=doc(source['creation_request_ref']);proof=doc(source['creation_proof_ref']);adapter=doc(source['adapter_creation_ref']);thread=doc(source['owned_thread_ref'])
            put('wakeup_source_recorded',proof['request_ref']==source['creation_request_ref'] and request['creator_process_identity']==launch['historical_process_identity'] and adapter['creator_pid']==proof['pid'] and bool(thread['identity']),[cleanups[-1]['payload']['exit_sample_ref']]+closure_refs)
    if closed({'store','guard_sink','host_transport'}) and len(state_docs)>=2:
        actions=[s.get('idempotency_state',{}) for s in state_docs];common=set.intersection(*(set(a.get('logical_actions',{})) for a in actions))
        reused=[]
        for logical in common:
            relevant=[a for a in actions if a.get('logical_action_id')==logical];entries=[a['logical_actions'][logical] for a in relevant]
            if len(relevant)<2:continue
            hashes={a['logical_action_request_sha256'] for a in relevant};acks=[x.get('ack_id') for x in entries if x.get('ack_id')];results=[(x.get('result_ref'),x.get('result_sha256')) for x in entries if x.get('result_ref')]
            sends=[u for u in units if doc(u['issuance']).get('original_logical_action_id',doc(u['issuance'])['logical_action_id'])==logical]
            if acks and results and 'duplicate_side_effects' in fields and fields['duplicate_side_effects']['status']=='derived':reused.append(len(hashes)==1 and len(set(acks))==1 and len(set(results))==1 and len(sends)==1 and fields['duplicate_side_effects']['value']==0)
        if reused:put('idempotent_ack_reused',all(reused),refs_of(states,'record_ref')+refs_of(requests,'request_ref')+closure_refs)
    # F3 requires an actual private dispatcher suppression causal source, not
    # a ready-state label or mere lack of a host message.
    if queries and closed({'control','driver_emission','guard_sink','host_transport'}):
        routing=[doc(e['payload']['route_ref']) for e in ticks]
        causal=[r for r in routing if {'queue_before_ref','dispatcher_read_ref','actual_dispatch_ref','query_after_ref'}<=set(r)]
        if causal:
            values=[]
            for route in causal:
                queue=doc(route['queue_before_ref']);read=doc(route['dispatcher_read_ref']);dispatch=doc(route['actual_dispatch_ref']);changed=doc(route['query_after_ref'])
                values.append(bool(queue['pending']) and read['control_revision']==control_view(changed)['control_revision'] and not dispatch['actual_dispatch_calls'] and dispatch['actual_suppressed_requests']==queue['pending'])
            put('next_action_suppressed',all(values),refs_of(ticks,'route_ref')+closure_refs)
    return {'contract_verdict':'valid','execution_verdict':'ok','fields':fields,'window':window,'evidence_layer':'captured_source_structural','runtime_acceptance':'not_evaluated','dispatch_authority':False}


def derive_capture_fields(*,repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,caller_replay_pin,operation):
    archive=_replay_capture(repo,request_ref,trusted_capture_manifest_ref,replay_execution_manifest_ref,caller_replay_pin)
    result=_derive_archive_fields(archive,operation)
    return {**result,'capture_manifest_ref':trusted_capture_manifest_ref}


def _archiveable_execution_receipt(self,receipt_ref):
    # Copy byte-for-byte after actual observer verification. Archive closure is
    # intentionally confined to source_root; evidence_root never widens it.
    raw=read_ref(self.evidence,receipt_ref)
    reference=immutable(self.root,self.root/(uuid.uuid4().hex+'.execution-source.json'),raw)
    if read_ref(self.root,reference)!=raw:raise ConsumerError('EXECUTION_SOURCE_COPY_DRIFT')
    return reference
RuntimeObserver.archiveable_execution_receipt=_archiveable_execution_receipt


# v47 冻结 raw predicates 的生产 port。归档只是只读证据，不授 live authority。
class _AggregateSourceError(ValueError): pass
class _AggregateReject(ValueError): pass
class _AggregateGap(ValueError): pass
_AGGREGATE_TEXTS=('现在进展如何？','做到哪一步了？','现在有什么风险？','报告一下当前状态。')
_AGGREGATE_STEPS=('goal','authority','control','record','repository','runtime','evidence','next_action')
_AGGREGATE_NEGATIVE={'R04-NEG-WRONG_GOAL':('goal','GOAL_IDENTITY_MISMATCH'),'R04-NEG-STALE_HEAD':('head','REPOSITORY_HEAD_DRIFT'),'R04-NEG-DIRTY_INVENTORY_DRIFT':('dirty_untracked','REPOSITORY_STAGED_CONTENT_DRIFT'),'R04-NEG-STALE_EVIDENCE':('evidence','LAST_EVIDENCE_STALE_OR_UNREADABLE'),'R04-NEG-RUNTIME_IDENTITY_DRIFT':('runtime','RUNTIME_IDENTITY_DRIFT')}
_AGGREGATE_SCHEMA_REFS={'AggregateRequest.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregateRequest.schema.json', 'sha256': 'b65e9f3a11e3e7551f1e2b5d2c170574d85203a5183bc9da5315a5de69349fee'}, 'AggregatePlan.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregatePlan.schema.json', 'sha256': 'b07b02a329d0d30f3a26c77cf6bcff5b0e2cb42b5217662e1e4e5fea0358f715'}, 'AggregateCodePin.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregateCodePin.schema.json', 'sha256': '8b11c6263237280f9db8effbadd5fb4bc001e4ecab5b49bdbf08e203d67a0db8'}, 'AggregateComponent.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregateComponent.schema.json', 'sha256': '452d0ff2925da269c9beb9646431a903c5eb7926709e262aa149183882dacf41'}, 'AggregateNoActionRegistry.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregateNoActionRegistry.schema.json', 'sha256': 'a54618fbe54abbbd91adbcdafefb81b4949e16fc7209f90003dad0ad8685940c'}, 'AggregateNoActionTokenLineage.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregateNoActionTokenLineage.schema.json', 'sha256': '315663ef1d543e2930b86da74684fd54f081931c99f5b3ae9b45ff135b7f5224'}, 'CaptureBoundaryInvocation.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/CaptureBoundaryInvocation.schema.json', 'sha256': '87fbdbc037e4fba7c0c40a1de99b125297af99a307a48332f484790040d22354'}, 'CaptureCreationReceipt.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/CaptureCreationReceipt.schema.json', 'sha256': '1c68d674fddd373ea370d7af65b589a7ae62287585a7dacdff873df20e8247e5'}, 'CaptureDomainManifest.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/CaptureDomainManifest.schema.json', 'sha256': '8a38c53b9bb0a96e757b9db49b27275a0bc07f898159287d9b146e1ebbee762f'}, 'CaptureManifest.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/CaptureManifest.schema.json', 'sha256': '1a31b459149404b9da2ecb5265e3ced45828cd2802c3036ae6e8963adcd1bf36'}, 'CaptureReceipt.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/CaptureReceipt.schema.json', 'sha256': 'b2a301227cee96abc5a9e16cc456f392135f28765ad754d8e262b03a2dcc0999'}, 'OfflineReplayRequest.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/OfflineReplayRequest.schema.json', 'sha256': '4b3bade24c3c242fb06eff9166e0bd388febfb2b2482cdcbd2785551735e8f05'}, 'ReplayCodePin.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/ReplayCodePin.schema.json', 'sha256': 'f6e1a33d815f86e7d26d3c597a0a341c1af9664930eb384b40e90cb490c51495'}, 'RuntimeEvent.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/RuntimeEvent.schema.json', 'sha256': '6fc5bc0c5235299a6300ad4d4b1f51d712f0efaf6db8514a8c88c7b2edcf61f1'}, 'RuntimeRequest.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/RuntimeRequest.schema.json', 'sha256': 'b9b4c5651eee2fdf0c1a789fbc4a9adcc80af483552d44c0dde2fb92580fa8c7'}, 'RuntimeSourceBundle.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/RuntimeSourceBundle.schema.json', 'sha256': '9fe188b3d7d5c00ddac85c7259ddaf3bb3d0bbc05f3bf6692f26cfc1ff7777e6'}, 'RuntimeSourceRegistry.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/RuntimeSourceRegistry.schema.json', 'sha256': 'f4475ec9380ae85b53ad337b02749fe186ca6812af445c1053fc0018747e11fb'}, 'TokenLineage.schema.json': {'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverReplayIdentityDesignRepair_v36/CandidateContract/TokenLineage.schema.json', 'sha256': '3c57a9fc0c984c03e37a136ff9fc1e4278b7ebb3a57823b5bb3ceeb02438f840'}}
_AGGREGATE_POLICY_REF={'path': 'Dashboard/Artifacts/Stage-Plan-SP-010/P3_RuntimeDriverMultiCaptureDesignRepair_v47/AggregatePolicy.json', 'sha256': 'b8f3bda593b11d955c4c1a1b14a324bf6b68d4f7fdc55f7b2ccf20b5f3c091a2'}

class _AggregateReader:
    """caller 固定本进程源码；所有组件各自开 closure，绝不执行归档代码。"""
    def __init__(self, repo):
        self.repo = Path(repo).resolve()

    def read(self, ref):
        try:
            path = confined(self.repo,ref['path'])
            raw = read_bytes(self.repo,path)
        except ConsumerError as exc:
            raise _AggregateSourceError(str(exc)+':'+ref['path']) from exc
        if sha(raw) != ref['sha256']:
            raise _AggregateSourceError('SOURCE_HASH_DRIFT:'+ref['path'])
        return raw

    def doc(self, ref):
        try:
            return json.loads(self.read(ref))
        except json.JSONDecodeError as exc:
            raise _AggregateSourceError('SOURCE_JSON_INVALID:'+ref['path']) from exc

    def schema(self, name, value, prefix='COMPONENT_SCHEMA_INVALID:'):
        schema = self.doc(_AGGREGATE_SCHEMA_REFS[name])
        try:
            jsonschema.Draft202012Validator(schema, format_checker=jsonschema.FormatChecker()).validate(value)
        except jsonschema.ValidationError as exc:
            raise _AggregateSourceError(prefix+name) from exc

    def caller_pin(self, ref):
        _aggregate_safe_ref(self, ref)
        pin = self.doc(ref)
        # Check path/duplicates/closure before schema minItems, so an empty
        # otherwise typed dependency container gets the frozen root fingerprint.
        _aggregate_verify_dependency_closure(self, pin)
        self.schema('AggregateCodePin.schema.json', pin, 'AGGREGATE_SCHEMA_INVALID:')
        return pin

    def open_component(self, component):
        binding=self.doc(component['binding_ref']); tracked=[]
        body={k:v for k,v in component.items() if k!='component_identity_sha256'}
        if sha(canonical(body))!=component['component_identity_sha256']:
            raise _AggregateSourceError('COMPONENT_IDENTITY_DRIFT')
        for ref in self.doc(component['inventory_ref'])['files']:
            self.read(ref)
        request=self.doc(component['request_ref'])
        self.schema('OfflineReplayRequest.schema.json',request)
        negative=component['variant_id'] in _AGGREGATE_NEGATIVE
        no_action={'AggregateNoActionRegistry.schema.json','AggregateNoActionTokenLineage.schema.json'}
        if negative and not no_action<=set(component['schema_instances']):
            raise _AggregateReject('NEGATIVE_REQUIRES_NO_ACTION_SUBTYPE')
        if not negative and no_action.intersection(component['schema_instances']):
            raise _AggregateReject('NO_ACTION_SUBTYPE_VARIANT_NOT_APPROVED')
        for name,ref in component['schema_instances'].items():
            value=self.doc(ref)
            for item in value if name=='RuntimeEvent.schema.json' else [value]:
                self.schema(name,item)
        capture=self.doc(request['capture_manifest_ref'])
        trusted=self.doc(component['trusted_inputs_ref'])
        if component['capture_ref'] != trusted['trusted_capture_manifest_ref']:
            raise _AggregateSourceError('AUDIT_CALLER_PIN_BINDING_INVALID')
        copies={};inventory={}
        for row in capture['source_copies']+capture['dependency_copies']:
            raw=self.read(row['snapshot_ref']);key=canonical(row['original_ref'])
            if sha(raw)!=row['original_ref']['sha256']:
                raise _AggregateReject('SOURCE_SNAPSHOT_DRIFT')
            if key in inventory and inventory[key]!=raw:
                raise _AggregateSourceError('ARCHIVE_DUPLICATE_SOURCE_CONFLICT')
            inventory[key]=raw;copies[key]=row['snapshot_ref']
        if request['capture_manifest_ref']!=trusted['trusted_capture_manifest_ref']:
            raise _AggregateReject('TRUSTED_CAPTURE_PIN_MISMATCH')
        def content(ref):
            key=canonical(ref)
            if key not in inventory:
                raise _AggregateSourceError('ARCHIVE_SOURCE_NOT_IN_CLOSURE:'+ref['path'])
            tracked.extend([ref,copies[key]])
            return inventory[key]
        def archived(ref):
            try:return json.loads(content(ref))
            except json.JSONDecodeError as exc:raise _AggregateSourceError('ARCHIVED_JSON_INVALID') from exc
        launch=archived(capture['capture_launch_ref']); domains=archived(capture['domain_manifest_ref'])
        ids={d['domain_id'] for d in domains['domains']}
        if ids!=set(launch['required_domain_ids']):raise _AggregateReject('INGRESS_DOMAIN_INCOMPLETE')
        events=archived(capture['event_stream_ref']);window=capture['window']
        if capture['gap_state']!='none' or [e['sequence'] for e in events]!=list(range(window['first_sequence'],window['last_sequence']+1)) or any(e['kind']=='source_gap' or e['clock_owner_id']!=window['clock_owner_id'] for e in events):
            raise _AggregateGap('INGRESS_GAP')
        receipts={canonical(ref):archived(ref) for ref in capture['capture_receipts']};previous=None
        for event in events:
            receipt=receipts.get(canonical(event['capture_receipt_ref']))
            if receipt is not None:self.schema('CaptureReceipt.schema.json',receipt)
            core={k:v for k,v in event.items() if k!='capture_receipt_ref'}
            if receipt is None or receipt['event_core_sha256']!=sha(canonical(core)) or receipt['sequence']!=event['sequence'] or receipt['source_refs']!=event['source_refs'] or receipt['previous_capture_receipt_ref']!=previous or receipt['domain_id'] not in ids:
                raise _AggregateSourceError('FIXTURE_RECEIPT_BINDING_INVALID')
            previous=event['capture_receipt_ref']
        registry=archived(capture['registry_ref']);lineage=archived(registry['token_lineage_ref'])
        for event in events:
            if event['action_token'] is None:continue
            matches=[t for t in lineage['entries'] if t['token']==event['action_token']]
            if len(matches)!=1 or matches[0]['issued_sequence']>event['sequence'] or matches[0]['revoked_sequence'] is not None and event['sequence']>=matches[0]['revoked_sequence']:
                raise _AggregateReject('SOURCE_TOKEN_REVOKED')
        replay_pin=self.doc(component['replay_code_pin_ref']);self.schema('ReplayCodePin.schema.json',replay_pin)
        code=self.read(replay_pin['source_ref']);replay=self.doc(component['replay_ref'])
        if replay_pin['source_ref']['sha256']!='a0376105b26e178edc2af5ef99748a2dc047c1927a8ceab92b88c7c8ea246832':raise _AggregateReject('COMPONENT_REPLAY_RULE_NOT_SUPPORTED')
        if replay.get('loaded_replay_sha256')!=sha(code):raise _AggregateReject('LOADED_SOURCE_IDENTITY_DRIFT')
        # 固定 archive_identity contract；不编译 caller 或历史 oracle bytes。
        reason=archive_identity(replay,capture,self.read,sha)
        if reason:raise _AggregateReject(reason)
        if request['capture_manifest_ref']!=component['capture_ref']:raise _AggregateSourceError('COMPONENT_CAPTURE_REF_MISMATCH')
        actual_registry=self.doc(capture['registry_ref'])
        required_instances={'CaptureManifest.schema.json':component['capture_ref'],'CaptureDomainManifest.schema.json':capture['domain_manifest_ref'],('AggregateNoActionRegistry.schema.json' if negative else 'RuntimeSourceRegistry.schema.json'):capture['registry_ref'],('AggregateNoActionTokenLineage.schema.json' if negative else 'TokenLineage.schema.json'):actual_registry['token_lineage_ref'],'RuntimeEvent.schema.json':capture['event_stream_ref']}
        if component['schema_instances']!=required_instances:raise _AggregateSourceError('ACTUAL_CAPTURE_SCHEMA_REF_MISMATCH')
        if actual_registry['capture_domain_manifest_ref']!=capture['domain_manifest_ref']:raise _AggregateSourceError('REGISTRY_DOMAIN_REF_MISMATCH')
        if negative and any(e['action_token'] is not None or e['kind'] in {'host_request','classifier_receipt'} for e in events):raise _AggregateReject('NO_ACTION_COMPONENT_HAS_ACTUATOR_OR_TOKEN')
        close=archived(capture['capture_close_ref']);owned=archived(registry['owned_ledger_ref'])
        if any(x.get('run_id')!=capture['run_id'] for x in [registry,lineage,domains,*events]):raise _AggregateSourceError('ACTUAL_CAPTURE_RUN_LINEAGE_MISMATCH')
        if registry['clock_owner_id']!=window['clock_owner_id'] or any(e['clock_owner_id']!=window['clock_owner_id'] for e in events):raise _AggregateSourceError('ACTUAL_CAPTURE_CLOCK_LINEAGE_MISMATCH')
        if registry['observer_process_identity']!=binding['owner_id'] or owned.get('owner_id')!=binding['owner_id'] or owned.get('variant_id')!=component['variant_id']:raise _AggregateReject('SOURCE_OWNER_VARIANT_BINDING_MISMATCH')
        if negative and (registry['current_action_token'] is not None or registry['issued_tokens'] or lineage['entries']):raise _AggregateReject('NO_ACTION_ACTUAL_REGISTRY_HAS_TOKEN')
        if not negative and (sorted(registry['issued_tokens'])!=sorted(e['token'] for e in lineage['entries']) or registry['current_action_token'] not in registry['issued_tokens']):raise _AggregateReject('REGISTRY_TOKEN_LINEAGE_MISMATCH')
        times=[e['observed_monotonic_ns'] for e in events]
        if not events or times!=sorted(times) or times[0]<window['start_ns'] or times[-1]>window['end_ns']:raise _AggregateSourceError('COMPONENT_CLOCK_INVALID')
        if close.get('closed') is not True or close.get('unterminated_domains') or events[-1]['kind']!='ingress_close' or events[-1]['payload']['terminal_reason']!='normal':raise _AggregateGap('COMPONENT_NOT_CLOSED')
        for domain in domains['domains']:
            origin=archived(domain['channel_creation_ref']);producer=archived(domain['producer_creation_ref'])
            if origin.get('row')!=binding['variant_id'] or origin.get('owner_id')!=binding['owner_id'] or producer.get('row')!=binding['variant_id']:raise _AggregateReject('SOURCE_OWNER_VARIANT_BINDING_MISMATCH')
        if binding['variant_id']!=component['variant_id'] or launch.get('historical_process_identity')!=binding['owner_id'] or window['clock_owner_id']!=binding['clock_owner_id']:raise _AggregateReject('SOURCE_OWNER_VARIANT_BINDING_MISMATCH')
        if component['logical_action_ids']!=binding['logical_action_ids'] or component['mapping_ids']!=binding['mapping_ids']:raise _AggregateReject('COMPONENT_ACTION_MAPPING_MISMATCH')
        node=self.doc(binding['approved_row_ref'])
        for key in binding['approved_row_ref']['json_pointer'].strip('/').split('/'):
            node=node[int(key)] if isinstance(node,list) else node[key]
        if node['variant_id']!=component['variant_id'] or node['logical_action_ids']!=component['logical_action_ids']:raise _AggregateReject('APPROVED_COMPONENT_ROW_MISMATCH')
        if not {'store','control','driver_emission','host_transport','progress','guard_sink'}<={d['kind'] for d in domains['domains']}:raise _AggregateGap('REQUIRED_RAW_DOMAIN_MISSING')
        if (window['end_ns']-window['start_ns'])/1e9>node['wall_clock_seconds']:raise _AggregateReject('COMPONENT_ROW_BUDGET_EXCEEDED')
        return {'component':component,'binding':binding,'capture':capture,'events':events,'registry':registry,'window':window,'doc':archived,'content':content,'tracked':tracked,'dispatch_authority':False}
def _aggregate_progress_units(a):
 doc=a['doc'];content=a['content'];events=a['events'];lineage=doc(a['registry']['token_lineage_ref'])['entries'];units=[];novel=set();tokens=[]
 for e in events:
  if e['kind']!='host_request':continue
  p=e['payload'];raw=doc(p['request_ref'])
  if raw.get('method')!='turn/start':continue
  if raw.get('id')!=p['jsonrpc_id'] or sha(content(p['request_ref']))!=p['request_sha256'] or 'unit_id' in raw['params']:raise _AggregateSourceError('HOST_REQUEST_BINDING_OR_PROTOCOL_INVALID')
  chosen=[r for r in lineage if r['token']==e['action_token']]
  if len(chosen)!=1:raise _AggregateReject('COMPONENT_ACTION_TOKEN_MISMATCH')
  issuance=doc(chosen[0]['issuance_store_ref']);logical=issuance['logical_action_id']
  if logical not in a['component']['logical_action_ids'] or issuance['token']!=e['action_token'] or issuance['host_request_ref']!=p['request_ref'] or issuance['jsonrpc_id']!=raw['id']:raise _AggregateReject('COMPONENT_ACTION_TOKEN_MISMATCH')
  frames=[x for x in events if x['kind']=='host_frame' and x['action_token']==e['action_token'] and x['sequence']>e['sequence']]
  replies=[(x,doc(x['payload']['frame_ref'])) for x in frames if doc(x['payload']['frame_ref']).get('id')==raw['id']]
  if len(replies)!=1:raise _AggregateGap('MATCHING_HOST_ACK_MISSING_OR_DUPLICATE')
  ack,body=replies[0];turn=body['result']['turn']['id'];terminal=[x for x in frames if doc(x['payload']['frame_ref']).get('method')=='turn/completed' and doc(x['payload']['frame_ref'])['params'].get('threadId')==raw['params']['threadId'] and doc(x['payload']['frame_ref'])['params']['turn']['id']==turn and doc(x['payload']['frame_ref'])['params']['turn']['status']=='completed' and x['sequence']>ack['sequence']]
  if len(terminal)!=1:raise _AggregateGap('MATCHING_HOST_SUCCESS_TERMINAL_MISSING')
  accepted=[]
  for x in events:
   if x['kind']!='classifier_receipt' or x['action_token']!=e['action_token'] or x['sequence']<=terminal[0]['sequence']:continue
   origin=doc(x['source_refs'][0]);receipt=doc(x['payload']['receipt_ref']);delta=doc(x['payload']['source_ref']);spec=doc(origin['spec_ref']);execution=doc(origin['actual_execution_ref']);wait=doc(execution['wait_ref']);creation=doc(execution['creation_proof_ref']);launch=doc(execution['launch_request_ref']);opened=doc(delta['open_item_ref']);output=content(execution['output_ref'])
   if not (wait['actual_exit_code']==execution['exit_code']==0 and wait['pid']==creation['pid'] and wait['process_identity_at_launch']==creation['process_identity'] and wait['action_token']==spec['action_token']==x['action_token']==receipt['causal_action_token'] and wait['unit_id']==spec['unit_id']==delta['unit_id']==issuance['unit_id'] and launch['creator_process_identity']==execution['observer_process_identity'] and execution['observer_source_identity']['sha256']==receipt['observer_source']['sha256']):raise _AggregateSourceError('WORKER_EXECUTION_BINDING_DRIFT')
   if output!=_archived_worker_output(spec,content) or output!=content(delta['after_ref']) or output==content(delta['before_ref']) or spec['unit_id'] not in opened['open_unit_ids']:raise _AggregateSourceError('ACTUAL_PROGRESS_NOT_RECOMPUTABLE')
   key=sha(canonical({'kind':delta['kind'],'unit_id':delta['unit_id'],'before':sha(content(delta['before_ref'])),'after':sha(output)}))
   if receipt['evidence_sha256']!=sha(output) or receipt['novelty_key']!=key or receipt['source_event_id']!=x['payload']['source_ref']['sha256'] or receipt['classification']!=spec['mode']:raise _AggregateSourceError('CLASSIFIER_BINDING_DRIFT')
   if sha(output) in novel:raise _AggregateReject('DUPLICATE_PROGRESS_SOURCE')
   novel.add(sha(output));accepted.append(x)
  ordered=[e,ack,terminal[0],*accepted]
  ts=[x['observed_monotonic_ns'] for x in ordered]
  if any(type(t) is not int for t in ts) or any(b<=aa for aa,b in zip(ts,ts[1:])):raise _AggregateSourceError('HOST_LIFECYCLE_CLOCK_ORDER_INVALID')
  if p.get('thread_id') != raw['params']['threadId'] or any(x['payload'].get('thread_id') != raw['params']['threadId'] for x in [ack,terminal[0]]):raise _AggregateReject('HOST_THREAD_LINEAGE_MISMATCH')
  if issuance.get('run_id') != a['capture']['run_id'] or issuance.get('component_id') != a['component']['component_id'] or issuance.get('owner_id') != a['binding']['owner_id']:raise _AggregateReject('ISSUANCE_COMPONENT_LINEAGE_MISMATCH')
  issued=issuance.get('issued_monotonic_ns')
  if type(issued) is not int or issuance.get('clock_owner_id') != a['window']['clock_owner_id'] or not a['window']['start_ns']<=issued<ts[0]:raise _AggregateSourceError('ISSUANCE_CLOCK_ORDER_INVALID')
  if issuance.get('thread_id') != raw['params']['threadId'] or any(x['payload'].get('adapter_session_id') != issuance.get('adapter_session_id') for x in [ack,terminal[0]]):raise _AggregateReject('HOST_SESSION_LINEAGE_MISMATCH')
  units.append({'event':e,'logical_action_id':logical,'unit_id':issuance['unit_id'],'progress':accepted,'token':e['action_token'],'issuance':issuance,'request':raw,'ack':ack,'terminal':terminal[0],'host_lifecycle_within_budget':0<ts[2]-ts[0]<=60*10**9});tokens.append(e['action_token'])
 if sorted(u['logical_action_id'] for u in units)!=sorted(a['component']['logical_action_ids']) or len(tokens)!=len(set(tokens)):raise _AggregateGap('COMPONENT_ACTION_SET_INCOMPLETE_OR_DUPLICATE')
 return units


def _aggregate_query_fields(a):
 doc=a['doc'];content=a['content'];controls=[e for e in a['events'] if e['kind']=='control_ingress'];normal=[];unknown=[]
 for e in controls:
  p=e['payload'];before=doc(p['before_ref']);after=doc(p['after_ref']);text=content(p['message_ref']).decode('utf-8')
  if text=='继续':continue
  if text not in _AGGREGATE_TEXTS:raise _AggregateReject('WRONG_QUERY_RAW_TEXT')
  if text!=_AGGREGATE_TEXTS[int(a['component']['variant_id'].rsplit('-',1)[1])-1]:raise _AggregateReject('QUERY_VARIANT_RAW_MISMATCH')
  (unknown if before.get('continuation_state')=='unknown' else normal).append((e,before,after))
 if len(normal)!=1 or len(unknown)!=1:raise _AggregateGap('NORMAL_AND_C159_QUERY_SOURCE_REQUIRED')
 ue,ub,ua=unknown[0]
 if not (ub==ua and ub['control_revision']==7 and ub['eligibility'] is False and ub['lease'] is False and ub['queued_action_token'] is None):raise _AggregateReject('C159_UNKNOWN_BRANCH_MUTATED_OR_WIDENED')
 e,before,after=normal[0];p=e['payload'];receipt=doc(p['caller_receipt_ref']);units=_aggregate_progress_units(a)
 safety=('authority','control_revision','continuation_state','lease','eligibility','queued_action_token','current_action_token','next_action')
 if not all(k in before and k in after for k in safety):raise _AggregateGap('QUERY_RECORD_SAFETY_AXES_MISSING')
 reported=receipt.get('snapshot_ref')==p['before_ref'] and doc(receipt['snapshot_ref'])['record_revision']==before['record_revision']
 report_ns=receipt.get('observed_monotonic_ns')
 if type(report_ns) is not int or receipt.get('clock_owner_id') != a['window']['clock_owner_id'] or receipt.get('run_id') != a['capture']['run_id']:raise _AggregateSourceError('QUERY_REPORT_CLOCK_BINDING_INVALID')
 if report_ns<e['observed_monotonic_ns']:raise _AggregateSourceError('QUERY_REPORT_CLOCK_ORDER_INVALID')
 meaningful=len(units)==2 and all(u['host_lifecycle_within_budget'] and u['progress'] and report_ns<u['event']['observed_monotonic_ns'] and all(0<x['observed_monotonic_ns']-report_ns<=150*10**9 for x in u['progress']) for u in units)
 extra=any(content(x['payload']['message_ref']).decode('utf-8')=='继续' for x in controls)
 return {'snapshot_reported':reported,'control_revision_unchanged':all(before[k]==after[k] for k in safety),'meaningful_action_after_report_within_budget':meaningful,'extra_resume_message':extra}


def _aggregate_recovery_fields(a):
 doc=a['doc'];content=a['content'];events=a['events'];name=a['component']['variant_id']
 if name in _AGGREGATE_NEGATIVE:
  domain,reason=_AGGREGATE_NEGATIVE[name];attempts=[e for e in events if e['kind']=='guard_attempt']
  if len(attempts)!=1:raise _AggregateGap('EXACT_NEGATIVE_GUARD_SOURCE_REQUIRED')
  p=attempts[0]['payload'];attempt=doc(p['attempt_ref']);response=doc(p['guard_response_ref'])
  if attempt['identity_domain']!=domain:raise _AggregateReject('NEGATIVE_DOMAIN_MISMATCH')
  # 实际差异与实际拒绝分别核验；不能只相信reject label。
  contradiction=content(attempt['saved_identity_ref'])!=content(attempt['current_identity_ref'])
  no_effect=content(p['sink_before_ref'])==content(p['sink_after_ref']) and not any(e['kind'] in {'host_request','classifier_receipt'} for e in events)
  return {'negative_variants_fail_closed':contradiction and response.get('resume_allowed') is False and reason in response.get('reason_codes',[]) and no_effect}
 expected_trigger=name.removeprefix('R04-').lower();steps=[e for e in events if e['kind']=='recovery_step']
 if tuple(e['payload']['step'] for e in steps)!=_AGGREGATE_STEPS:raise _AggregateGap('EXACT_EIGHT_RECOVERY_STEPS_MISSING_OR_DUPLICATE')
 values=[];actor_ref=None;last=None
 for e in steps:
  p=e['payload'];i=doc(p['inputs_ref']);o=doc(p['output_ref'])
  if i['trigger']!=expected_trigger:raise _AggregateReject('RECOVERY_TRIGGER_VARIANT_MISMATCH')
  if actor_ref is not None and actor_ref!=i['actor_ref']:raise _AggregateReject('RECOVERY_ACTOR_CHANGED_WITHIN_COMPONENT')
  actor_ref=i['actor_ref'];values.append(content(i['saved_ref'])==content(i['current_ref']) and o['matched_sha256']==sha(content(i['current_ref'])));last=o
 actor=doc(actor_ref)
 if actor['trigger']!=expected_trigger or actor['owner_id']!=a['binding']['owner_id'] or actor['variant_id']!=name:raise _AggregateReject('RECOVERY_ACTOR_OWNER_MISMATCH')
 proof=doc(actor['creation_proof_ref']);request=doc(actor['creation_request_ref']);adapter=doc(actor['adapter_creation_ref']);thread=doc(actor['owned_thread_ref'])
 run=a['capture']['run_id'];component_id=a['component']['component_id'];owner=a['binding']['owner_id'];clock=a['window']['clock_owner_id']
 if any(d.get('run_id')!=run or d.get('component_id')!=component_id or d.get('owner_id')!=owner for d in [actor,request,proof,adapter,thread]):raise _AggregateReject('RECOVERY_ACTOR_COMPONENT_LINEAGE_MISMATCH')
 if not (proof['request_ref']==actor['creation_request_ref'] and request['creator_process_identity']==owner and adapter['creator_pid']==proof['pid'] and adapter.get('actor_creation_proof_ref')==actor['creation_proof_ref'] and thread.get('adapter_creation_ref')==actor['adapter_creation_ref']):raise _AggregateReject('RECOVERY_CREATION_CHAIN_MISMATCH')
 if not (actor['after_adapter_session_id']==adapter.get('adapter_session_id')==thread.get('adapter_session_id')):raise _AggregateReject('RECOVERY_SESSION_LINEAGE_MISMATCH')
 created=proof.get('observed_monotonic_ns')
 if type(created) is not int or proof.get('clock_owner_id')!=clock or not a['window']['start_ns']<=created<steps[0]['observed_monotonic_ns']:raise _AggregateSourceError('RECOVERY_CREATION_CLOCK_INVALID')
 woke=True
 if expected_trigger=='client_restart':woke=woke and actor['before_adapter_session_id']!=actor['after_adapter_session_id']
 if expected_trigger=='executor_lost':woke=woke and doc(actor['lost_executor_exit_ref'])['exited'] is True
 units=_aggregate_progress_units(a)
 if 'next_action' not in last:raise _AggregateGap('REOPENED_NEXT_ACTION_MISSING')
 pending=doc(steps[-1]['payload']['inputs_ref']);next_source=doc(pending['current_ref'])
 step_times=[e['observed_monotonic_ns'] for e in steps]
 if any(b<=aa for aa,b in zip(step_times,step_times[1:])):raise _AggregateSourceError('RECOVERY_STEP_CLOCK_ORDER_INVALID')
 resumed=[u for u in units if u['logical_action_id'].endswith('START-02')]
 if len(resumed)!=1:raise _AggregateGap('RECOVERY_START02_SOURCE_MISSING_OR_DUPLICATE')
 u=resumed[0];iss=u['issuance']
 if thread.get('identity')!=u['request']['params']['threadId'] or thread.get('adapter_session_id')!=iss.get('adapter_session_id') or iss.get('recovery_actor_ref')!=actor_ref:raise _AggregateReject('RECOVERY_HOST_LINEAGE_MISMATCH')
 # Exact current/saved next action, issuance, request, token and reopened source share one capture.
 resume=(all(values) and last['next_action']==next_source['next_action']==u['logical_action_id']
  and u['unit_id']==next_source['unit_id'] and iss.get('reopened_record_ref')==pending['current_ref']
  and steps[-1]['observed_monotonic_ns']<iss['issued_monotonic_ns']<u['event']['observed_monotonic_ns']
  and u['event']['sequence']>steps[-1]['sequence'] and bool(u['progress']) and u['host_lifecycle_within_budget']
  and not any(x['unit_id'] in next_source['completed_unit_ids'] and x['event']['sequence']>steps[-1]['sequence'] for x in units))
 return {'all_eight_steps_each_trigger':all(values),'resume_from_last_valid_next_action':resume,'wakeup_source_recorded':woke}

def _aggregate_derive(reader, aggregate_request_ref, caller_aggregate_plan_ref):
 doc=reader.doc
 request=doc(aggregate_request_ref);plan=doc(caller_aggregate_plan_ref);policy=doc(_AGGREGATE_POLICY_REF);group=request['aggregate_group']
 if request['schema_version']!='sp010_multi_capture_request_v41' or request['operation']!='runtime_replay' or set(request)!={'schema_version','operation','aggregate_group','component_ids','action'}:raise _AggregateSourceError('AGGREGATE_REQUEST_SCHEMA_INVALID')
 if group not in policy['groups']:raise _AggregateSourceError('AGGREGATE_GROUP_UNKNOWN')
 expected=policy['groups'][group];target=policy['groups'][group]['target_fields'] if group=='RGC-02-four-queries' else policy['groups'][group]['target_fields'];fields=_aggregate_unknowns('不属于当前group的显式raw聚合计划；原要求仍开放')
 rows=[];behavior='structural_recomputed';fingerprint=None;windows=[];used_tokens=set()
 def emit_error(kind,reason):
  return {'contract_verdict':'valid','execution_verdict':'error' if kind=='error' else 'ok','behavior':kind,'failure_fingerprint':reason,'fields':_aggregate_unknowns(reason),'components':rows,'dispatch_authority':False,'runtime_acceptance':'not_evaluated','p3_all_and':False}
 if request['action']!='offline_aggregate':return emit_error('reject','ARCHIVE_AGGREGATE_NEVER_LIVE')
 if plan['schema_version']!='sp010_independent_aggregate_plan_v41' or plan['aggregate_group']!=group or plan['operation']!='runtime_replay' or plan['policy_ref']['sha256']!=_AGGREGATE_POLICY_REF['sha256']:return emit_error('reject','CALLER_AGGREGATE_PLAN_INVALID')
 if [x['variant_id'] for x in plan['components']]!=expected['ordered_variant_ids']:return emit_error('reject','COMPONENT_VARIANT_SET_OR_ORDER_INVALID')
 ids=[x['component_id'] for x in plan['components']]
 if len(ids)!=len(set(ids)) or request['component_ids']!=ids:return emit_error('reject','COMPONENT_SET_OR_ORDER_PIN_MISMATCH')
 for slot in plan['components']:
  row={'component_id':slot['component_id'],'variant_id':slot['variant_id'],'status':'unknown','raw_values':{},'source_refs':([] if slot['component_ref'] is None else [slot['component_ref']]),'evidence_gap':None};rows.append(row)
  if slot['component_ref'] is None:row['evidence_gap']='COMPONENT_MISSING';continue
  a=None
  try:
   c=doc(slot['component_ref'])
   if c['variant_id']!=slot['variant_id']:raise _AggregateReject('COMPONENT_VARIANT_PIN_MISMATCH')
   if c['component_id']!=slot['component_id']:raise _AggregateReject('COMPONENT_ID_PIN_MISMATCH')
   a=reader.open_component(c);window=a['window'];owner=a['binding']['owner_id'];clock=window['clock_owner_id']
   for prior in windows:
    if clock==prior['clock'] and owner!=prior['owner']:raise _AggregateReject('CLOCK_OWNER_BINDING_MISMATCH')
    if clock==prior['clock'] and max(window['start_ns'],prior['start'])<min(window['end_ns'],prior['end']):raise _AggregateReject('COMPONENT_CLOCK_OVERLAP')
   windows.append({'clock':clock,'owner':owner,'start':window['start_ns'],'end':window['end_ns']})
   tokens=[e['action_token'] for e in a['events'] if e['kind']=='host_request' and e['action_token'] is not None]
   if used_tokens.intersection(tokens):raise _AggregateReject('CROSS_COMPONENT_ACTION_TOKEN_REUSED')
   used_tokens.update(tokens)
   values=_aggregate_query_fields(a) if group=='RGC-02-four-queries' else _aggregate_recovery_fields(a)
   row.update(status='derived',raw_values=values,source_refs=a['tracked']+[slot['component_ref'],c['binding_ref'],c['inventory_ref']],window=a['window'],capture_ref=c['capture_ref'])
  except _AggregateGap as e:row.update(status='unknown',evidence_gap=str(e),source_refs=row['source_refs']+(a['tracked'] if a else []))
  except _AggregateReject as e:
   row.update(status='rejected',evidence_gap=str(e),source_refs=row['source_refs']+(a['tracked'] if a else []));return emit_error('reject',str(e))
  except Exception as e:
   row.update(status='error',evidence_gap=str(e),source_refs=row['source_refs']+(a['tracked'] if a else []));return emit_error('error',str(e))
 for name in target:
  relevant=[r for r in rows if (name!='negative_variants_fail_closed' and not r['variant_id'].startswith('R04-NEG')) or (name=='negative_variants_fail_closed' and r['variant_id'].startswith('R04-NEG'))]
  refs=[r for row in relevant for r in row['source_refs']]
  missing=[{'component_id':r['component_id'],'reason':r['evidence_gap'] or 'FIELD_RAW_SOURCE_MISSING'} for r in relevant if r['status']!='derived' or name not in r['raw_values']]
  if missing:fields[name]=_aggregate_field(refs=refs,gap=missing)
  else:
   values=[r['raw_values'][name] for r in relevant]
   fields[name]=_aggregate_field(any(values) if name=='extra_resume_message' else all(values),refs)
 return {'contract_verdict':'valid','execution_verdict':'ok','behavior':'structural_recomputed' if all(fields[n]['status']=='derived' for n in target) else 'unknown','failure_fingerprint':None,'fields':fields,'components':rows,'dispatch_authority':False,'runtime_acceptance':'not_evaluated','p3_all_and':False,'no_merged_sequence':True,'aggregate_window':None}

def _aggregate_field(value=None,refs=(),gap=None):
    return {'value':value,'status':'unknown' if gap else 'derived','source_refs':list(refs),'evidence_gap':gap}

def _aggregate_unknowns(gap):
    return {name:_aggregate_field(gap=gap) for name in SCENARIO_FIELDS}

@_closure_guard.protect
def derive_multi_capture_fields(*,repo,aggregate_request_ref,caller_aggregate_plan_ref,caller_aggregate_code_pin_ref):
    """独立 caller 只读 ordered aggregate API。永远不启动 host/worker。"""
    def failure(kind,reason):
        return {'contract_verdict':'valid','execution_verdict':'error' if kind=='error' else 'ok','behavior':kind,'failure_fingerprint':reason,'dispatch_authority':False,'runtime_acceptance':'not_evaluated','p3_all_and':False,'fields':_aggregate_unknowns(reason),'components':[]}
    if caller_aggregate_plan_ref is None or caller_aggregate_code_pin_ref is None:
        return failure('reject','INDEPENDENT_AGGREGATE_CALLER_PIN_REQUIRED')
    reader=_AggregateReader(repo)
    try:
        reader.caller_pin(caller_aggregate_code_pin_ref)
        reader.schema('AggregateRequest.schema.json',reader.doc(aggregate_request_ref),'AGGREGATE_SCHEMA_INVALID:')
        plan=reader.doc(caller_aggregate_plan_ref)
        reader.schema('AggregatePlan.schema.json',plan,'AGGREGATE_SCHEMA_INVALID:')
        for slot in plan['components']:
            if slot['component_ref'] is not None:
                reader.schema('AggregateComponent.schema.json',reader.doc(slot['component_ref']),'AGGREGATE_SCHEMA_INVALID:')
        result=_aggregate_derive(reader,aggregate_request_ref,caller_aggregate_plan_ref)
        result.update(loaded_aggregate_code_sha256=_LOADED_SHA,caller_aggregate_plan_ref=caller_aggregate_plan_ref,reference_only=False)
        return result
    except _AggregateReject as exc:return failure('reject',str(exc))
    except Exception as exc:return failure('error',str(exc))


_AGGREGATE_SCRIPT_ROOT = '.codex/skills/sge-governed-checkpoints-sp010/scripts'
_AGGREGATE_GRAPH_ROOTS = ('rgc_runtime_observer', 'rgc_runtime_driver')

def _aggregate_safe_ref(reader, reference):
    if (not isinstance(reference, dict) or set(reference)!={'path','sha256'} or
            not isinstance(reference['path'],str) or not isinstance(reference['sha256'],str)):
        raise _AggregateSourceError('AGGREGATE_SCHEMA_INVALID:dependency_reference')
    raw = reference['path'];path=Path(raw)
    if (path.is_absolute() or '..' in path.parts or not raw or
            path.as_posix()!=raw or any(p.is_symlink() for p in (reader.repo/path,*(reader.repo/path).parents))):
        raise _AggregateSourceError('AGGREGATE_DEPENDENCY_PATH_UNSAFE')
    try:confined(reader.repo,raw)
    except ConsumerError as exc:raise _AggregateSourceError('AGGREGATE_DEPENDENCY_PATH_UNSAFE') from exc
    return raw


def aggregate_dependency_closure(repo):
    """独立只读kernel从双入口计算完整module/call/value-flow闭包。"""
    try:closure=_closure_guard.graph(repo)
    except _closure_guard.ClosureError as exc:raise _AggregateSourceError(str(exc)) from exc
    resources={_AGGREGATE_POLICY_REF['path']:_AGGREGATE_POLICY_REF,
               **{r['path']:r for r in _AGGREGATE_SCHEMA_REFS.values()}}
    closure['fixed_resources']=[resources[p] for p in sorted(resources)]
    return closure


def _aggregate_check_loaded(reader, nodes):
    try:_closure_guard.verify_loaded(reader.repo,nodes)
    except _closure_guard.ClosureError as exc:raise _AggregateSourceError(str(exc)) from exc


def _aggregate_verify_dependency_closure(reader, pin):
    if not isinstance(pin,dict) or not isinstance(pin.get('dependencies'),list):
        raise _AggregateSourceError('AGGREGATE_SCHEMA_INVALID:dependency_container')
    if pin.get('source_ref') is None:
        raise _AggregateSourceError('AGGREGATE_DEPENDENCY_CLOSURE_INCOMPLETE')
    if not isinstance(pin['source_ref'],dict):
        raise _AggregateSourceError('AGGREGATE_SCHEMA_INVALID:dependency_container')
    references=[pin['source_ref'],*pin['dependencies']]
    paths=[_aggregate_safe_ref(reader,r) for r in references]
    validator=pin.get('component_validator_ref');_aggregate_safe_ref(reader,validator)
    freeze_ref=pin.get('production_source_freeze_ref')
    if freeze_ref is None or pin.get('source_freeze_status')!='actual_production_frozen':
        raise _AggregateReject('INDEPENDENT_AGGREGATE_CALLER_PIN_REQUIRED')
    _aggregate_safe_ref(reader,freeze_ref)
    freeze=reader.doc(freeze_ref)
    if not isinstance(freeze.get('files'),list):raise _AggregateSourceError('AGGREGATE_SCHEMA_INVALID:source_freeze')
    freeze_paths=[_aggregate_safe_ref(reader,r) for r in freeze['files']]
    if len(paths)!=len(set(paths)) or len(freeze_paths)!=len(set(freeze_paths)):
        raise _AggregateSourceError('AGGREGATE_DEPENDENCY_DUPLICATE_NODE')
    closure=aggregate_dependency_closure(reader.repo)
    required={r['path']:r['sha256'] for r in closure['source_nodes']+closure['fixed_resources']}
    expected_source=_AGGREGATE_SCRIPT_ROOT+'/rgc_runtime_observer.py'
    if pin['source_ref']['path']!=expected_source or set(required)-set(paths):
        raise _AggregateSourceError('AGGREGATE_DEPENDENCY_CLOSURE_INCOMPLETE')
    if set(paths)-set(required):raise _AggregateSourceError('AGGREGATE_DEPENDENCY_UNEXPECTED_NODE')
    actual={r['path']:r['sha256'] for r in references}
    # Root loaded-source pin has the original v47 identity fingerprint;
    # v59 dependency-member hash errors retain their separate precedence.
    if pin['source_ref']['sha256']!=required[expected_source]:
        raise _AggregateSourceError('AGGREGATE_LOADED_SOURCE_IDENTITY_DRIFT')
    if actual!=required:raise _AggregateSourceError('AGGREGATE_DEPENDENCY_HASH_DRIFT')
    for reference in references:
        try:reader.read(reference)
        except _AggregateSourceError as exc:raise _AggregateSourceError('AGGREGATE_DEPENDENCY_HASH_DRIFT') from exc
    freeze_actual={r['path']:r['sha256'] for r in freeze['files']}
    if set(freeze_actual)==set(required) and freeze_actual!=required:
        raise _AggregateSourceError('AGGREGATE_DEPENDENCY_HASH_DRIFT')
    if validator!=pin['source_ref']:raise _AggregateSourceError('AGGREGATE_COMPONENT_VALIDATOR_IDENTITY_DRIFT')
    _aggregate_check_loaded(reader,closure['source_nodes'])
    if {r['path']:r['sha256'] for r in freeze['files']}!=required:
        raise _AggregateSourceError('AGGREGATE_DEPENDENCY_CLOSURE_INCOMPLETE')
    return closure

_closure_guard.seal_loaded_modules(__name__)
