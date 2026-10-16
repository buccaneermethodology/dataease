"""只读聚合闭包内核：有限静态值流和操作范围内的真实 provider 身份检查。

本模块不启动执行器、不执行归档源码。源字节只被解析/compile，以取得
当前 CPython 的预期 code tree。未知 dispatch 关闭当前操作。
"""
from __future__ import annotations
import ast
import builtins
import contextlib
import dis
import hashlib
import io
import json
import marshal
import os
import pathlib
import sys
import threading
import types

GRAPH = 'AGGREGATE_DEPENDENCY_GRAPH_UNRESOLVED'
IDENTITY = 'AGGREGATE_LOADED_SOURCE_IDENTITY_DRIFT'
SCRIPT_ROOT = '.codex/skills/sge-governed-checkpoints-sp010/scripts'
ROOTS = ('rgc_runtime_observer.derive_multi_capture_fields',
         'rgc_runtime_driver.replay_multi_capture_aggregate')
DYNAMIC = frozenset({'exec','eval','compile','__import__','globals','locals'})
_BUILTINS = dict(vars(builtins))
_SEALED = {}
_TLS = threading.local()
_MISSING = object()
_EXTERNAL_GENERATED_CODES = {}
_EXTERNAL_GENERATED_IDS = {}
_ALLOWED_EXTERNAL_MODULES = frozenset(sys.stdlib_module_names)|{'jsonschema','referencing','rpds','attrs','attr','_jsonschema_specifications','jsonschema_specifications'}
_EXTERNAL_CLASS_SLOTS = []
_EXTERNAL_RECEIVER_TYPES = set()
_EXTERNAL_DESCRIPTOR_SLOTS = []
_EXTERNAL_CONFIGS = []
_EXCEPTION_TYPE_BINDINGS = {}
_EXCEPTION_ROOT = _BUILTINS['Exception']

class ClosureError(ValueError):
    pass

class _Violation(BaseException):
    """普通业务 Exception handler 不能把该拒绝吞掉。"""
    pass

def code_identity(code):
    # 完整语义指纹显式序列化；marshal引用/字符串intern标志不是代码语义。
    def constant(value):
        if type(value) is types.CodeType:return ['code',payload(value)]
        if type(value) is bytes:return ['bytes',value.hex()]
        if type(value) in (tuple,frozenset):
            items=[constant(x) for x in value]
            if type(value) is frozenset:items.sort(key=repr)
            return [type(value).__name__,items]
        return [type(value).__name__,repr(value)]
    def payload(c):
        result={}
        for name in ('co_argcount','co_posonlyargcount','co_kwonlyargcount','co_nlocals','co_stacksize','co_flags','co_names','co_varnames','co_freevars','co_cellvars','co_filename','co_name','co_firstlineno'):
            result[name]=getattr(c,name)
        for name in ('co_code','co_lnotab','co_linetable','co_exceptiontable'):
            if hasattr(c,name):result[name]=getattr(c,name).hex()
        if hasattr(c,'co_qualname'):result['co_qualname']=c.co_qualname
        result['co_consts']=[constant(x) for x in c.co_consts]
        return result
    return hashlib.sha256(json.dumps([sys.version,payload(code)],sort_keys=True,separators=(',',':')).encode()).hexdigest()

def _code_tree(raw, filename):
    code = compile(raw, filename, 'exec', dont_inherit=True, optimize=0)
    result = {}
    def visit(c):
        result.setdefault((c.co_name,c.co_firstlineno),set()).add(code_identity(c))
        for x in c.co_consts:
            if type(x) is types.CodeType: visit(x)
    visit(code)
    return result

def _raw_path(repo, relative):
    p=pathlib.Path(relative)
    if (p.is_absolute() or '..' in p.parts or p.as_posix()!=relative or
            any(q.is_symlink() for q in (repo/p,*(repo/p).parents))):
        raise ClosureError('AGGREGATE_DEPENDENCY_PATH_UNSAFE')
    return repo/p

def module_closure(repo):
    repo=pathlib.Path(repo).absolute();pending=[x.split('.')[0] for x in ROOTS]
    nodes={};edges=[];external=set();trees={}
    while pending:
        name=pending.pop()
        if name in nodes:continue
        rel=SCRIPT_ROOT+'/'+name+'.py';p=_raw_path(repo,rel)
        try:raw=p.read_bytes();tree=ast.parse(raw,filename=str(p))
        except (OSError,SyntaxError) as exc:raise ClosureError(GRAPH) from exc
        nodes[name]={'path':rel,'sha256':hashlib.sha256(raw).hexdigest()}
        trees[name]=tree
        for n in ast.walk(tree):
            if isinstance(n,ast.Import):imports=[a.name for a in n.names]
            elif isinstance(n,ast.ImportFrom):
                if n.level or not n.module:raise ClosureError(GRAPH)
                imports=[n.module]
            else:continue
            for target in imports:
                local=repo/SCRIPT_ROOT/(target+'.py')
                if local.exists():
                    if '.' in target:raise ClosureError(GRAPH)
                    pending.append(target);edges.append({'from':name,'to':target})
                elif (repo/SCRIPT_ROOT/target.split('.')[0]).is_dir() or target.split('.')[0] not in set(sys.stdlib_module_names)|{'__future__','jsonschema'}:
                    raise ClosureError(GRAPH)
                else:external.add(target.split('.')[0])
    return nodes,trees,edges,external

# 抽象值是有限、可合并的 provenance 集合。JSON 数据不会默认升级成 callable。
# f=repo function, c=repo class, m=module, e=external provider, i=receiver type,
# d=JSON data, k=literal slot, l=literal, u=unknown, h=heap identity,
# s=ordered immutable candidate; ud=JSON read value without an alias proof.
def _v(*atoms):return frozenset(atoms)
DATA=_v(('d','json'))
UNKNOWN=_v(('u','unknown'))

def _union(*values):
    result=frozenset().union(*values)
    if len(result)>1024:raise ClosureError(GRAPH)
    return result

class CallGraph:
    """按词法作用域与参数/返回值传播的单调 worklist，不按函数前缀放行业务。"""
    def __init__(self, repo, trees):
        self.repo=repo;self.trees=trees;self.nodes={};self.parents={};self.imports={}
        self.params={};self.returns={};self.closure_values={};self.fields={};self.reachable=set();self.edges={};self.leaves={};self.unknown={}
        self.round_changed=False;self.current='';self.env={};self.final_pass=False;self.exception_checks={};self.module_bindings={};self.lexical_locals={};self.containers={};self.container_kinds={};self.container_shapes={}
        for module,tree in trees.items():
            if module!='rgc_runtime_closure_guard':self.index(module,tree.body)
        # Module Store/Del是绑定truth；一旦有绑定，禁止按同名builtin/class/function回退。
        def module_writes(body):
            writes=[]
            for n in body:
                if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef,ast.ClassDef)):continue
                if isinstance(n,(ast.Assign,ast.AnnAssign,ast.AugAssign)):
                    targets=n.targets if isinstance(n,ast.Assign) else [n.target]
                    for t in targets:
                        for a in ast.walk(t):
                            if isinstance(a,ast.Name) and isinstance(a.ctx,(ast.Store,ast.Del)):writes.append((a.id,n.value if isinstance(t,ast.Name) and not isinstance(n,ast.AugAssign) else None))
                elif isinstance(n,ast.Delete):
                    for t in n.targets:
                        for a in ast.walk(t):
                            if isinstance(a,ast.Name):writes.append((a.id,None))
                elif isinstance(n,(ast.For,ast.AsyncFor)):
                    for a in ast.walk(n.target):
                        if isinstance(a,ast.Name):writes.append((a.id,None))
                elif isinstance(n,(ast.With,ast.AsyncWith)):
                    for item in n.items:
                        if item.optional_vars:
                            for a in ast.walk(item.optional_vars):
                                if isinstance(a,ast.Name):writes.append((a.id,None))
                for field,header in ast.iter_fields(n):
                    if field in {'body','orelse','finalbody','handlers'}:continue
                    candidates=header if isinstance(header,list) else [header]
                    for expression in candidates:
                        if isinstance(expression,ast.AST):
                            for a in ast.walk(expression):
                                if isinstance(a,ast.NamedExpr) and isinstance(a.target,ast.Name):writes.append((a.target.id,a.value))
                for field in ('body','orelse','finalbody'):
                    if isinstance(getattr(n,field,None),list):writes+=module_writes(getattr(n,field))
                for h in getattr(n,'handlers',[]):
                    if h.name:writes.append((h.name,None))
                    writes+=module_writes(h.body)
            return writes
        module_write_inventory={}
        for module,tree in trees.items():
            if module=='rgc_runtime_closure_guard':continue
            writes=module_writes(tree.body)
            for n in ast.walk(tree):
                if isinstance(n,ast.Global):writes.extend((name,None) for name in n.names)
            module_write_inventory[module]=writes
            self.module_bindings[module]={name:DATA for name,value in writes}
        for module,writes in module_write_inventory.items():
            bindings=self.module_bindings[module]
            self.current=module;self.env={}
            assigned=set()
            for name,value in writes:
                finite=value is not None and all(not isinstance(a,(ast.Call,ast.Lambda,ast.NamedExpr,ast.Await,ast.Yield)) for a in ast.walk(value))
                provenance=self.expr(value) if finite else DATA
                if isinstance(value,ast.Call) and len(value.args)==1 and not value.keywords and isinstance(value.func,ast.Attribute) and value.func.attr=='protect':
                    owner=self.expr(value.func.value);argument=value.args[0]
                    if owner==_v(('m','rgc_runtime_closure_guard')) and isinstance(argument,ast.Name) and isinstance(self.nodes.get(module+'.'+argument.id),(ast.FunctionDef,ast.AsyncFunctionDef)):
                        provenance=_v(('f',module+'.'+argument.id))  # 固定kernel wrapper保留真实函数provenance；runtime另验outer身份。
                bindings[name]=_union(bindings[name] if name in assigned else frozenset(),provenance);assigned.add(name)
        self.current='';self.env={}
        # 这些是独立 source/module 身份证明的被管理 provider；不能靠其自报。
        self.roots=list(ROOTS)+[q for q in self.nodes if q.endswith('.loaded_source_identity')]
        # 原闭包合同的保守维护域保留；不是业务可达图的替代物。
        self.roots += [q for q in self.nodes if q.split('.')[0]=='rgc_runtime_observer' and q.rsplit('.',1)[-1].startswith('_aggregate')]
        for q in self.roots:self.reachable.add(q)
        for q,n in self.nodes.items():
            if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)):
                args=[*n.args.posonlyargs,*n.args.args,*n.args.kwonlyargs]
                self.params[q]={a.arg:(DATA if q in self.roots else frozenset()) for a in args}
                if args and args[0].arg in {'self','cls'}:
                    parent=self.parents[q]
                    if isinstance(self.nodes.get(parent),ast.ClassDef):self.params[q][args[0].arg]=_v(('i',parent))
                self.returns[q]=frozenset()
                # Python lexical locals apply to the whole function; unbound names must not fallback.
                local_names=set();excluded=set()
                def local_walk(body):
                    for statement in body:
                        if isinstance(statement,(ast.FunctionDef,ast.AsyncFunctionDef,ast.ClassDef)):
                            local_names.add(statement.name);continue
                        if isinstance(statement,(ast.Global,ast.Nonlocal)):
                            excluded.update(statement.names);continue
                        if isinstance(statement,(ast.Import,ast.ImportFrom)):
                            local_names.update(a.asname or (a.name.split('.')[0] if isinstance(statement,ast.Import) else a.name) for a in statement.names)
                        if isinstance(statement,ast.ExceptHandler) and statement.name:local_names.add(statement.name)
                        for child in ast.iter_child_nodes(statement):
                            if isinstance(child,ast.Name) and isinstance(child.ctx,(ast.Store,ast.Del)):local_names.add(child.id)
                            elif isinstance(child,ast.AST):local_walk([child])
                local_walk(n.body);self.lexical_locals[q]=local_names-excluded

    def index(self, scope, body):
        self.imports.setdefault(scope,{})
        for n in body:
            if isinstance(n,ast.Import):
                for a in n.names:self.imports[scope][a.asname or a.name.split('.')[0]]=_union(self.imports[scope].get(a.asname or a.name.split('.')[0],frozenset()),_v(('m',a.name)))
            elif isinstance(n,ast.ImportFrom) and n.module:
                for a in n.names:
                    if a.name=='*':raise ClosureError(GRAPH)
                    self.imports[scope][a.asname or a.name]=_union(self.imports[scope].get(a.asname or a.name,frozenset()),_v(('e',n.module+'.'+a.name)))
            elif isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef,ast.ClassDef)):
                q=scope+'.'+n.name;self.nodes[q]=n;self.parents[q]=scope;self.index(q,n.body)
            else:
                for field in ('body','orelse','finalbody'):
                    if isinstance(getattr(n,field,None),list):self.index(scope,getattr(n,field))
                for h in getattr(n,'handlers',[]):self.index(scope,h.body)

    def qualified_symbol(self,kind,target):
        if '.' in target:
            module,name=target.rsplit('.',1)
            if name in self.module_bindings.get(module,{}):return self.module_bindings[module][name]
        if target in self.nodes:return _v(('c' if isinstance(self.nodes[target],ast.ClassDef) else 'f',target))
        return _v((kind,target))

    def symbol(self, scope, name):
        here=scope
        while True:
            if name in self.module_bindings.get(here,{}):return self.module_bindings[here][name]
            q=here+'.'+name
            if q in self.nodes:return _v(('c' if isinstance(self.nodes[q],ast.ClassDef) else 'f',q))
            imp=self.imports.get(here,{}).get(name)
            if imp:
                return _union(*[self.qualified_symbol(kind,target) for kind,target in imp])
            if '.' not in here:break
            here=here.rsplit('.',1)[0]
        if name in _BUILTINS:return _v(('e','builtins.'+name))
        # 模块常量、政策/schema值只作为数据。未知 callable 使用仍拒绝。
        return DATA

    def container_store(self,key,value):
        old=self.containers.get(key,frozenset());new=_union(old,value)
        if old!=new:self.containers[key]=new;self.round_changed=True

    def expanded(self,value,seen=frozenset()):
        out=[]
        for kind,target in value:
            if kind=='h':
                out.append(UNKNOWN if target in seen else self.expanded(self.containers.get(target,UNKNOWN),seen|{target}))
            elif kind=='s':
                elements=ast.literal_eval(target)
                out.append(_union(DATA,*[_v(*[('k',repr((i,a))) for a in element]) for i,element in enumerate(elements)]))
            else:out.append(_v((kind,target)))
        return _union(*out) if out else frozenset()

    def callable_content(self,value,seen=frozenset()):
        for kind,target in value:
            if kind in {'f','c','e','u','hc'}:return True
            if kind=='s' and any(self.callable_content(frozenset(element),seen) for element in ast.literal_eval(target)):return True
            if kind=='k' and self.callable_content(_v(ast.literal_eval(target)[1]),seen):return True
            if kind=='h' and (target in seen or self.callable_content(self.containers.get(target,DATA),seen|{target})):return True
        return False

    def invalidate_container(self,heap,incoming=DATA):
        # Opaque JSON/data never receives a callable witness. Unknown mutation removes any finite callable proof.
        dangerous=self.callable_content(self.containers.get(heap,DATA)) or self.callable_content(incoming)
        self.container_shapes[heap]=None
        self.container_store(heap,UNKNOWN if dangerous else DATA)

    def literal_keys(self,value):
        keys=[]
        for kind,target in value:
            if kind!='l':return None
            try:key=ast.literal_eval(target)
            except (ValueError,SyntaxError):return None
            if type(key) not in (str,int):return None
            keys.append(key)
        return keys if keys else None

    def container_read(self,value,index):
        values=self.expanded(value);keys=self.literal_keys(index)
        if any(kind=='u' for kind,target in values):return UNKNOWN
        if keys is None:return UNKNOWN if self.callable_content(value) else DATA
        slots=[ast.literal_eval(target) for kind,target in values if kind=='k']
        if not slots:
            if any(kind=='ud' for kind,target in values):return _v(('ud','unproven-unpack-data'))
            return UNKNOWN if any(kind in {'f','c','e'} for kind,target in values) else DATA
        result=[]
        for key in keys:
            selected=key
            if type(key) is int and key<0 and any(kind=='h' and self.container_kinds.get(target)=='list' for kind,target in value):
                indexes=[slot for slot,atom in slots if type(slot) is int];selected=key+max(indexes,default=-1)+1
            result.extend(_v(atom) for slot,atom in slots if slot==selected)
        return _union(*result) if result else DATA

    def container_elements(self,value):
        result=[]
        for kind,target in self.expanded(value):
            result.append(_v(ast.literal_eval(target)[1]) if kind=='k' else _v((kind,target)))
        return _union(DATA,*result)

    def safe_exception_types(self,value,seen=frozenset()):
        """只接受可证明不含BaseException sentinel的有限Exception子类集合。"""
        if not value:return not self.final_pass
        value=self.expanded(value);packed=any(kind=='k' for kind,target in value)
        for kind,target in value:
            if kind=='d' and packed:continue  # finite tuple/list的container marker，不是元素。
            if kind=='k':
                try:atom=ast.literal_eval(target)[1]
                except (ValueError,SyntaxError,IndexError):return False
                if not self.safe_exception_types(_v(atom),seen):return False
            elif kind=='e':
                binding=_EXCEPTION_TYPE_BINDINGS.get(target)
                if binding is None or _EXCEPTION_ROOT not in binding[3].__mro__:return False
                self.exception_checks[target]={'provider':target,'proof':'load-time exact Exception subtype; operation checks module/slot/base identities'}
            elif kind=='c':
                if target in seen:return False
                node=self.nodes.get(target)
                if not isinstance(node,ast.ClassDef) or not node.bases:return False
                # 有限class构造grammar；decorator/metaclass/可执行class body不按AST bases自证类型。
                if node.decorator_list or node.keywords:return False
                for statement in node.body:
                    if isinstance(statement,ast.Pass):continue
                    if isinstance(statement,ast.Expr) and isinstance(statement.value,ast.Constant) and type(statement.value.value) is str:continue
                    if isinstance(statement,(ast.FunctionDef,ast.AsyncFunctionDef)):
                        if statement.name=='__init_subclass__' or statement.decorator_list or statement.args.defaults or any(v is not None for v in statement.args.kw_defaults):return False
                        if statement.returns or any(a.annotation for a in [*statement.args.posonlyargs,*statement.args.args,*statement.args.kwonlyargs]):return False
                        continue
                    return False
                binding=_EXCEPTION_TYPE_BINDINGS.get(target)
                if binding is not None:
                    if _EXCEPTION_ROOT not in binding[3].__mro__:return False
                    self.exception_checks[target]={'provider':target,'proof':'finite class declaration + load-time actual Exception ancestry/module/slot/base identities'}
                previous=self.current;self.current=self.parents[target]
                try:
                    if not all(self.safe_exception_types(self.expr(base),seen|{target}) for base in node.bases):return False
                finally:self.current=previous
            else:return False
        return True

    def add_target(self,q,node,args,kwargs):
        if q not in self.reachable:self.reachable.add(q);self.round_changed=True
        key=(self.current,getattr(node,'lineno',0),getattr(node,'col_offset',0),q)
        self.edges[key]={'from':self.current,'to':q,'line':key[1],'column':key[2],'proof':'lexical/finite argument-return provenance'}
        target=self.nodes[q]
        if isinstance(target,ast.ClassDef):
            for member in list(self.nodes):
                if self.parents.get(member)==q and isinstance(self.nodes[member],(ast.FunctionDef,ast.AsyncFunctionDef)):
                    self.add_target(member,node,[_v(('i',q)),*args],kwargs)
            return _v(('i',q))
        parameters=[*target.args.posonlyargs,*target.args.args]
        for p,value in zip(parameters,args):self.bind_param(q,p.arg,value)
        for k,value in kwargs.items():
            if k in self.params[q]:self.bind_param(q,k,value)
        # default callable provenance 是源表达式，不从当前实际 defaults 猜测。
        for p,d in zip(parameters[-len(target.args.defaults):] if target.args.defaults else [],target.args.defaults):
            self.bind_param(q,p.arg,self.expr(d))
        return self.returns.get(q,frozenset())

    def bind_param(self,q,name,value):
        old=self.params[q].get(name,frozenset());new=_union(old,value)
        if old!=new:self.params[q][name]=new;self.round_changed=True

    def attribute(self,value,name):
        result=[]
        for kind,target in value:
            if kind=='m':
                q=target+'.'+name
                result.append(self.qualified_symbol('e',q))
            elif kind=='i' and target in self.nodes:
                q=target+'.'+name
                if q in self.nodes:result.append(_v(('f',q),('receiver',target)))
                else:result.append(self.fields.get((target,name),frozenset()))
            elif kind=='h':result.append(_v(('hc',repr((target,name)))))
            elif kind in {'d','l','k','s','ud'}:
                if any(hasattr(cls,name) for cls in (dict,list,set,frozenset,str,bytes,bytearray,tuple,int,float,bool)):
                    result.append(_v(('ue' if kind=='ud' else 'e','data.'+name)))
            elif kind=='i':
                if target=='pathlib.Path' and name in {'parent','parents'}:result.append(_v(('i','pathlib.Path')))
                elif target=='pathlib.Path' and name in {'parts','name','stem','suffix'}:result.append(DATA)
                else:result.append(_v(('e',target+'.'+name)))
            elif kind=='e':result.append(_v(('e',target+'.'+name)))
            else:result.append(UNKNOWN)
        return _union(*result) if result else frozenset()

    def expr(self,n):
        if n is None:return DATA
        if isinstance(n,ast.Name):return self.env.get(n.id,self.symbol(self.current,n.id))
        if isinstance(n,ast.Constant):return _v(('l',repr(n.value)))
        if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.UAdd,ast.USub)):
            try:literal=ast.literal_eval(n)
            except (ValueError,SyntaxError):pass
            else:
                if type(literal) in (int,float):return _v(('l',repr(literal)))
        if isinstance(n,ast.Attribute):return self.attribute(self.expr(n.value),n.attr)
        if isinstance(n,ast.Tuple):
            elements=[self.expr(e) for e in n.elts]
            # Each candidate retains its own ordered length, including empty/bottom slots.
            # Count packed slots against the existing atom budget before encapsulation.
            _union(DATA,*[_v(*[('k',repr((i,a))) for a in value]) for i,value in enumerate(elements)])
            def weight(value):
                return sum(1+sum(weight(frozenset(e)) for e in ast.literal_eval(v)) if k=='s' else 1 for k,v in value)
            if 1+sum(max(1,weight(value)) for value in elements)>1024:raise ClosureError(GRAPH)
            if any(not value for value in elements):return frozenset()
            return _v(('s',repr(tuple(tuple(sorted(value)) for value in elements))))
        if isinstance(n,(ast.List,ast.Dict)):
            key=self.current+':'+str(n.lineno)+':'+str(n.col_offset);self.container_kinds[key]='list' if isinstance(n,ast.List) else 'dict'
            value=DATA;order=[];finite=True
            pairs=[(ast.Constant(index),item) for index,item in enumerate(n.elts)] if isinstance(n,ast.List) else zip(n.keys,n.values)
            for slot,item in pairs:
                keys=self.literal_keys(self.expr(slot)) if slot is not None else None
                atom=self.expr(item)
                if keys is None or len(keys)!=1:
                    finite=False;value=_union(value,UNKNOWN if self.callable_content(atom) else DATA)
                else:
                    literal=keys[0]
                    if literal not in order:order.append(literal)
                    value=_union(value,_v(*[('k',repr((literal,a))) for a in atom]))
            shape=tuple(order) if finite else None
            if key not in self.container_shapes:self.container_shapes[key]=shape
            elif self.container_shapes[key]!=shape:self.container_shapes[key]=None
            self.container_store(key,value);return _v(('h',key))
        if isinstance(n,ast.Set):return _union(DATA,*[self.expr(e) for e in n.elts])
        if isinstance(n,ast.Subscript):return self.container_read(self.expr(n.value),self.expr(n.slice))
        if isinstance(n,ast.NamedExpr):
            value=self.expr(n.value);self.assign(n.target,value);return value
        if isinstance(n,ast.Call):
            function=self.expr(n.func);args=[self.expr(a) for a in n.args];kwargs={k.arg:self.expr(k.value) for k in n.keywords}
            if function==_v(('e','builtins.getattr')):
                if len(n.args)<2:return UNKNOWN
                names=[]
                for k,x in args[1]:
                    if k=='l':
                        try:v=ast.literal_eval(x)
                        except (ValueError,SyntaxError):continue
                        if type(v) is str:names.append(v)
                if not names:self.unresolved(n,'unbounded getattr');return UNKNOWN
                return _union(*[self.attribute(args[0],name) for name in names])
            outputs=[];known=False
            for kind,target in function:
                if kind=='receiver':continue
                if kind in {'f','c'}:
                    actual_args=args
                    if any(k=='receiver' for k,x in function):actual_args=[_v(('i',target.rsplit('.',1)[0])),*args]
                    outputs.append(self.add_target(target,n,actual_args,kwargs));known=True
                elif kind=='hc':
                    receiver,method=ast.literal_eval(target);known=True
                    self.leaf(n,'data.'+method,args)
                    if method=='get' and args:
                        outputs.append(self.container_read(_v(('h',receiver)),args[0]))
                        if len(args)>1:outputs.append(args[1])
                    elif method in {'values','items'}:outputs.append(self.container_elements(_v(('h',receiver))))
                    elif method=='copy':outputs.append(_v(('h',receiver)))
                    elif method in {'keys','__len__','__contains__','__iter__'}:outputs.append(DATA)
                    else:
                        # No unknown method may silently retain a stale callable slot proof.
                        self.invalidate_container(receiver,_union(*args) if args else DATA);outputs.append(DATA)
                elif kind in {'e','ue'}:
                    if kind=='ue' and any(self.callable_content(v) for v in [*args,*kwargs.values()]):
                        self.unresolved(n,'unproven destructured container mutation');continue
                    if target.startswith('importlib.') or target.startswith('builtins.') and target.split('.')[-1] in DYNAMIC:
                        # compile-only expected code extraction is the independently bound kernel effect.
                        self.unresolved(n,'dynamic code/provider capability');continue
                    if target=='builtins.type' and len(n.args)>1:
                        self.unresolved(n,'dynamic class construction');continue
                    if target in {'builtins.setattr','builtins.delattr'} and args and any(k=='c' for k,v in args[0]):
                        self.unresolved(n,'class type mutation outside finite exception grammar');continue
                    if target=='contextlib.suppress' and not all(self.safe_exception_types(value) for value in args):
                        self.unresolved(n,'suppress may catch operation sentinel');continue
                    known=True;self.leaf(n,target,args)
                    if target in {'builtins.sorted','builtins.map','builtins.filter','builtins.all','builtins.any'}:
                        for value in [*args,*kwargs.values()]:
                            for k,q in value:
                                if k=='f':self.add_target(q,n,[DATA],{})
                    if target.endswith('Path') or target in {'pathlib.Path','pathlib.PosixPath'}:outputs.append(_v(('i','pathlib.Path')))
                    elif target.endswith('FormatChecker'):outputs.append(_v(('i','jsonschema.FormatChecker')))
                    elif target.endswith('Draft202012Validator'):outputs.append(_v(('i','jsonschema.Draft202012Validator')))
                    elif target=='os.fdopen':outputs.append(_v(('i','io.IOBase')))
                    elif target.startswith('pathlib.Path.') and target.split('.')[-1] in {'resolve','absolute','relative_to','with_name','with_suffix','joinpath'}:outputs.append(_v(('i','pathlib.Path')))
                    elif target in {'hashlib.sha256','hashlib.new'}:outputs.append(_v(('i','_hashlib.HASH')))
                    elif target in {'re.fullmatch','re.match','re.search'}:outputs.append(_v(('i','re.Match')))
                    else:outputs.append(_v(('ud','unproven-unpack-data')) if kind=='ue' else DATA)
                elif kind in {'u','ud'}:self.unresolved(n,'unknown callable/receiver')
            if not known:
                # Empty summaries are deferred to the next fixed point; typed data cannot dispatch.
                if function or self.final_pass:self.unresolved(n,'non-callable/unresolved data dispatch')
            return _union(*outputs) if outputs else frozenset()
        if isinstance(n,(ast.Lambda,ast.ListComp,ast.SetComp,ast.DictComp,ast.GeneratorExp)):
            # 匿名 code body 与 callbacks 保守处理所有分支；编译 code tree负责runtime身份。
            if isinstance(n,ast.Lambda):
                q=self.current+'.<lambda>@'+str(n.lineno)+':'+str(n.col_offset)
                if q not in self.nodes:
                    f=ast.FunctionDef(name='<lambda>',args=n.args,body=[ast.Return(value=n.body)],decorator_list=[]);f.lineno=n.lineno
                    self.nodes[q]=f;self.parents[q]=self.current;self.params[q]={a.arg:DATA for a in n.args.args};self.returns[q]=frozenset()
                self.closure_values[q]=dict(self.env)
                self.add_target(q,n,[],{});return _v(('f',q))
            old=dict(self.env)
            for g in n.generators:
                value=self.expr(g.iter);elements=[]
                self.assign(g.target,self.iteration_elements(value));[self.expr(x) for x in g.ifs]
            if isinstance(n,ast.DictComp):out=_union(self.expr(n.key),self.expr(n.value))
            else:out=self.expr(n.elt)
            self.env=old;return _union(DATA,out)
        if isinstance(n,ast.IfExp):self.expr(n.test);return _union(self.expr(n.body),self.expr(n.orelse))
        result=DATA
        for c in ast.iter_child_nodes(n):
            if isinstance(c,ast.expr):result=_union(result,self.expr(c))
        return result

    def unresolved(self,n,why):
        key=(self.current,getattr(n,'lineno',0),getattr(n,'col_offset',0))
        self.unknown[key]={'owner':key[0],'line':key[1],'column':key[2],'expression':ast.unparse(n),'reason':why}

    def leaf(self,n,target,args):
        # Exact actual receiver validation is complemented by the operation guard.
        key=(self.current,n.lineno,n.col_offset,target)
        self.leaves[key]={'owner':self.current,'line':n.lineno,'column':n.col_offset,'expression':ast.unparse(n.func),'provider':target,'proof':'finite lexical receiver provenance + actual operation provider check','exact_builtin_receiver_types':[cls.__name__ for cls in (dict,list,set,frozenset,str,bytes,bytearray,tuple,int,float,bool) if target.startswith('data.') and hasattr(cls,target.split('.')[-1])]}

    def ordered_candidates(self,value):
        """Preserve inner heap references; never expand them while extracting a slot."""
        candidates=[];opaque=False
        for kind,target in value:
            if kind=='s':candidates.append(tuple(frozenset(e) for e in ast.literal_eval(target)))
            elif kind=='h':
                shape=self.container_shapes.get(target)
                packed=self.containers.get(target,frozenset())
                if shape is None or any(k=='u' for k,v in packed):opaque=True;continue
                if self.container_kinds.get(target)=='dict':
                    candidates.append(tuple(_v(('l',repr(k))) for k in shape))
                else:
                    slots=[ast.literal_eval(v) for k,v in packed if k=='k']
                    candidates.append(tuple(_union(*[_v(atom) for slot,atom in slots if slot==key]) for key in shape))
            else:opaque=True
        return candidates,opaque

    def iteration_elements(self,value):
        candidates,opaque=self.ordered_candidates(value)
        if not candidates:return self.container_elements(value)
        return _union(*[element for candidate in candidates for element in candidate],UNKNOWN if opaque else frozenset())

    def unpack_values(self,t,value):
        candidates,opaque=self.ordered_candidates(value)
        invalid=any(isinstance(x,ast.Starred) for x in t.elts) or any(len(c)!=len(t.elts) for c in candidates)
        if invalid:self.unresolved(t,'unsupported or mismatched destructuring')
        if self.final_pass and (not value or any(not e for c in candidates for e in c)):self.unresolved(t,'unresolved destructuring bottom')
        # Opaque JSON stays data for ordinary reads, but may never preserve an alias proof.
        data_only=value and all(k in {'d','ud'} for k,v in value)
        fallback=(_v(('ud','unproven-unpack-data')) if data_only and not invalid else UNKNOWN) if opaque or invalid else frozenset()
        return [_union(fallback,*[c[i] for c in candidates if len(c)==len(t.elts)]) for i in range(len(t.elts))]

    def assign(self,t,value):
        if isinstance(t,ast.Name):self.env[t.id]=_union(self.env.get(t.id,frozenset()),value)
        elif isinstance(t,(ast.Tuple,ast.List)):
            values=self.unpack_values(t,value)
            for x,element in zip(t.elts,values):self.assign(x,element)
        elif isinstance(t,ast.Starred):self.assign(t.value,UNKNOWN)
        elif isinstance(t,ast.Attribute):
            for kind,receiver in self.expr(t.value):
                if kind=='i' and receiver in self.nodes:
                    key=(receiver,t.attr);old=self.fields.get(key,frozenset());new=_union(old,value)
                    if old!=new:self.fields[key]=new;self.round_changed=True
                elif kind in {'m','c'}:raise ClosureError(GRAPH)
        elif isinstance(t,ast.Subscript):
            receivers=self.expr(t.value);keys=self.literal_keys(self.expr(t.slice));heaps=[target for kind,target in receivers if kind=='h']
            if not heaps:
                # Ordinary JSON data never supplies a callable proof; unresolved aliases fail closed.
                if any(kind in {'u','ud','f','c','k'} for kind,target in receivers):self.unresolved(t,'unknown container mutation alias')
                return
            for heap in heaps:
                if keys is None or any(kind!='h' for kind,target in receivers):self.invalidate_container(heap,value);continue
                if any(kind in {'d','u','ud'} for kind,target in value) and self.callable_content(self.containers.get(heap,DATA)):
                    self.invalidate_container(heap,UNKNOWN);continue
                packed=self.containers.get(heap,DATA);slots=[ast.literal_eval(target)[0] for kind,target in packed if kind=='k']
                for key in keys:
                    selected=key
                    if self.container_kinds.get(heap)=='list':
                        if type(key) is not int:self.invalidate_container(heap,value);continue
                        if key<0:selected=key+max((x for x in slots if type(x) is int),default=-1)+1
                        if selected not in slots:self.invalidate_container(heap,value);continue
                    shape=self.container_shapes.get(heap)
                    if shape is not None and selected not in shape:self.container_shapes[heap]=None
                    self.container_store(heap,_v(*[('k',repr((selected,atom))) for atom in value]))

    def statements(self,body):
        returns=frozenset()
        for n in body:
            if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef,ast.ClassDef)):
                q=self.current+'.'+n.name
                if q in self.nodes:
                    self.assign(ast.Name(id=n.name,ctx=ast.Store()),_v(('c' if isinstance(n,ast.ClassDef) else 'f',q)))
                    saved=self.closure_values.setdefault(q,{})
                    for name,value in self.env.items():saved[name]=_union(saved.get(name,frozenset()),value)
                    self.add_target(q,n,[],{})
                for d in n.decorator_list:self.expr(d)
            elif isinstance(n,(ast.Import,ast.ImportFrom)):
                for alias in n.names:
                    name=alias.asname or (alias.name.split('.')[0] if isinstance(n,ast.Import) else alias.name)
                    value=self.qualified_symbol('m',alias.name if alias.asname else alias.name.split('.')[0]) if isinstance(n,ast.Import) else self.qualified_symbol('e',n.module+'.'+alias.name) if n.module and not n.level else UNKNOWN
                    self.assign(ast.Name(id=name,ctx=ast.Store()),value)
            elif isinstance(n,ast.Delete):
                for target in n.targets:self.assign(target,DATA)
            elif isinstance(n,(ast.Assign,ast.AnnAssign,ast.AugAssign)):
                value=self.expr(n.value)
                for t in n.targets if isinstance(n,ast.Assign) else [n.target]:self.assign(t,value)
            elif isinstance(n,ast.Return):returns=_union(returns,self.expr(n.value))
            elif isinstance(n,(ast.For,ast.AsyncFor)):
                value=self.expr(n.iter);elements=[]
                self.assign(n.target,self.iteration_elements(value));returns=_union(returns,self.statements(n.body),self.statements(n.orelse))
            elif isinstance(n,(ast.With,ast.AsyncWith)):
                for item in n.items:
                    value=self.expr(item.context_expr)
                    if item.optional_vars:self.assign(item.optional_vars,value)
                returns=_union(returns,self.statements(n.body))
            elif isinstance(n,ast.If):
                self.expr(n.test);before=dict(self.env)
                left=self.statements(n.body);left_env=dict(self.env)
                self.env=dict(before);right=self.statements(n.orelse);right_env=dict(self.env)
                self.env={key:_union(left_env.get(key,before.get(key,DATA)),right_env.get(key,before.get(key,DATA))) for key in set(left_env)|set(right_env)}
                returns=_union(returns,left,right)
            elif isinstance(n,ast.Try):
                before=dict(self.env);body_returns=self.statements(n.body);body_env=dict(self.env)
                # An exception can observe any assignment reached in the try body.
                possible={key:_union(before.get(key,DATA),body_env.get(key,DATA)) for key in set(before)|set(body_env)}
                outcomes=[];handler_returns=frozenset()
                for h in n.handlers:
                    self.env=dict(possible)
                    if h.type is None or not self.safe_exception_types(self.expr(h.type)):
                        self.unresolved(n,'handler may swallow operation sentinel')
                    if h.name:self.env[h.name]=_v(('i','builtins.Exception'))
                    handler_returns=_union(handler_returns,self.statements(h.body))
                    if h.name:self.env[h.name]=DATA  # Python clears except-bound local on exit.
                    outcomes.append(dict(self.env))
                self.env=dict(body_env);else_returns=self.statements(n.orelse);outcomes.append(dict(self.env))
                self.env={key:_union(*[state.get(key,DATA) for state in outcomes]) for key in set().union(*[set(state) for state in outcomes])}
                returns=_union(returns,body_returns,handler_returns,else_returns,self.statements(n.finalbody))
            else:
                for c in ast.iter_child_nodes(n):
                    if isinstance(c,ast.expr):self.expr(c)
                for field in ('body','orelse'):
                    if isinstance(getattr(n,field,None),list):returns=_union(returns,self.statements(getattr(n,field)))
        return returns

    def build(self):
        for iteration in range(128):
            self.round_changed=False;self.unknown={};self.leaves={}
            for q in sorted(self.reachable):
                node=self.nodes[q]
                if isinstance(node,ast.ClassDef):continue
                self.current=q;self.env=dict(self.closure_values.get(q,{}))
                for name in self.lexical_locals.get(q,set()):self.env[name]=frozenset()
                for key,value in self.params.get(q,{}).items():self.env[key]=_union(self.env.get(key,frozenset()),value)
                # Lexical outer bindings propagated for nested closure body.
                parent=self.parents.get(q,'')
                if parent in self.params:
                    for k,v in self.params[parent].items():self.env.setdefault(k,v)
                out=self.statements(node.body);old=self.returns.get(q,frozenset());new=_union(old,out)
                if old!=new:self.returns[q]=new;self.round_changed=True
            if not self.round_changed:
                if not self.final_pass:self.final_pass=True;continue
                break
        else:raise ClosureError(GRAPH)
        return {'roots':self.roots,'nodes':sorted(self.reachable),'edges':list(self.edges.values()),'external_leaf_callsites':list(self.leaves.values()),'unresolved_callsites':list(self.unknown.values()),'fixedpoint_iterations':iteration+1,'source_executed':False,'exception_provider_checks':list(self.exception_checks.values())}


def graph(repo):
    nodes,trees,edges,external=module_closure(repo)
    cg=CallGraph(pathlib.Path(repo).absolute(),trees).build()
    # kernel uses its exact, sealed compile-only helper; its business-free implementation
    # is validated separately, rather than creating recursive scanner dispatch.
    if cg['unresolved_callsites']:raise ClosureError(GRAPH)
    return {'source_nodes':[nodes[k] for k in sorted(nodes)],'edges':edges,'external_modules':sorted(external),'call_graph':cg}


def _callable_signature(value):
    if type(value) is types.BuiltinFunctionType and getattr(value,'__self__',None) is not None:
        receiver=value.__self__;descriptor=getattr(type(receiver),value.__name__,None)
        return ('bound_c',receiver,value.__name__,descriptor)
    if type(value) is types.MethodType:value=value.__func__
    if type(value) is types.FunctionType:
        cells=tuple(c.cell_contents for c in value.__closure__ or ())
        return (value,value.__code__,value.__globals__,value.__defaults__,value.__kwdefaults__,cells)
    return (value,)

def seal_loaded_modules(module_name=None):
    """仅可信 loader 阶段保存实际槽位；operation不刷新已封存身份。"""
    if module_name is not None and module_name not in _SEALED:
        seal_external_environment()
    directory=pathlib.Path(__file__).absolute().parent
    for name,module in tuple(sys.modules.items()):
        if type(module) is not types.ModuleType or name in _SEALED:continue
        if getattr(module.__dict__.get('__spec__'),'_initializing',False) and name!=module_name:continue
        filename=module.__dict__.get('__file__')
        if not filename or pathlib.Path(filename).absolute().parent!=directory:continue
        raw=pathlib.Path(filename).read_bytes();expected=_code_tree(raw,str(pathlib.Path(filename).absolute()))
        providers={};classes={};wrapped={};class_aliases={};module_aliases={}
        for key,value in tuple(module.__dict__.items()):
            if type(value) is types.FunctionType and value.__module__==name:
                original=value
                if value.__globals__ is not module.__dict__:
                    original=getattr(value,'__wrapped__',None)
                    if type(original) is not types.FunctionType:raise ClosureError(IDENTITY)
                    owner=value.__globals__.get('__name__')
                    if owner not in {__name__,'contextlib'} or value.__globals__ is not sys.modules[owner].__dict__:raise ClosureError(IDENTITY)
                    outer_path=pathlib.Path(sys.modules[owner].__file__).absolute()
                    outer_codes=_code_tree(outer_path.read_bytes(),str(outer_path))
                    if code_identity(value.__code__) not in outer_codes.get((value.__code__.co_name,value.__code__.co_firstlineno),set()):raise ClosureError(IDENTITY)
                    wrapped[key]=_callable_signature(original)
                if original.__globals__ is not module.__dict__ or code_identity(original.__code__) not in expected.get((original.__code__.co_name,original.__code__.co_firstlineno),set()):raise ClosureError(IDENTITY)
                providers[key]=_callable_signature(value)
            elif type(value) is type and value.__module__==name:
                classes[key]=(value,tuple(value.__bases__),{k:_callable_signature(v) for k,v in value.__dict__.items() if type(v) is types.FunctionType})
            elif type(value) is type:class_aliases[key]=(value,tuple(value.__bases__))
            elif type(value) is types.ModuleType:module_aliases[key]=value
            if type(value) is type:
                _EXCEPTION_TYPE_BINDINGS.setdefault(name+'.'+key,(name,module,key,value,tuple(value.__bases__)))
        _SEALED[name]={'module':module,'path':str(pathlib.Path(filename).absolute()),'sha256':hashlib.sha256(raw).hexdigest(),'providers':providers,'classes':classes,'class_keys':{key:frozenset(value[0].__dict__) for key,value in classes.items()},'wrapped':wrapped,'code_tree':expected,'class_aliases':class_aliases,'module_aliases':module_aliases}


def _check_signature(value,signature):
    if signature[0]=='bound_c':
        if type(value) is not types.BuiltinFunctionType or value.__self__ is not signature[1] or value.__name__!=signature[2] or getattr(type(value.__self__),value.__name__,None) is not signature[3]:raise _Violation(IDENTITY)
        return
    if type(value) is types.MethodType:value=value.__func__
    if value is not signature[0]:raise _Violation(IDENTITY)
    if type(value) is types.FunctionType:
        if value.__code__ is not signature[1] or value.__globals__ is not signature[2] or value.__defaults__ is not signature[3] or value.__kwdefaults__ is not signature[4]:raise _Violation(IDENTITY)
        actual=tuple(c.cell_contents for c in value.__closure__ or ())
        if len(actual)!=len(signature[5]) or any(a is not b for a,b in zip(actual,signature[5])):raise _Violation(IDENTITY)


def _verify_module_slots(record):
    module=record['module'];namespace=module.__dict__
    if sys.modules.get(module.__name__) is not module or namespace.get('__file__')!=record['path']:raise _Violation(IDENTITY)
    for name,module in record['module_aliases'].items():
        if namespace.get(name) is not module:raise _Violation(IDENTITY)
    for name,(cls,bases) in record['class_aliases'].items():
        if namespace.get(name) is not cls or cls.__bases__!=bases:raise _Violation(IDENTITY)
    for name,sig in record['providers'].items():_check_signature(namespace.get(name),sig)
    for name,sig in record['wrapped'].items():_check_signature(getattr(namespace.get(name),'__wrapped__',None),sig)
    for name,(cls,bases,methods) in record['classes'].items():
        if namespace.get(name) is not cls or cls.__bases__!=bases or frozenset(cls.__dict__)!=record['class_keys'][name]:raise _Violation(IDENTITY)
        for method,sig in methods.items():_check_signature(cls.__dict__.get(method),sig)


def verify_loaded(repo,source_nodes):
    """独立字节/槽位/code核验，不调用 provider.loaded_source_identity()。"""
    repo=pathlib.Path(repo).absolute()
    try:
        for ref in source_nodes:
            name=pathlib.Path(ref['path']).stem;module=sys.modules.get(name)
            if module is None:continue
            record=_SEALED.get(name)
            if record is None or record['sha256']!=ref['sha256'] or record['path']!=str(repo/ref['path']):raise _Violation(IDENTITY)
            _verify_module_slots(record)
        # from-import别名必须还是真正定义槽位；保守检查全部repo callable aliases。
        for ref in source_nodes:
            record=_SEALED.get(pathlib.Path(ref['path']).stem)
            if record is None:continue
            for name,value in tuple(record['module'].__dict__.items()):
                if type(value) is types.FunctionType and value.__module__ in _SEALED:
                    origin=_SEALED[value.__module__];slot=origin['providers'].get(value.__name__)
                    if slot is not None:_check_signature(value,slot)
    except _Violation as exc:raise ClosureError(str(exc)) from None


def _exact_data(value, seen=None):
    """输入只接受精确JSON builtin；拒绝用户自定义mapping/序列/可执行对象。"""
    if seen is None:seen=set()
    if id(value) in seen:raise ClosureError(GRAPH)
    if type(value) in (str,int,float,bool,bytes,type(None)):return
    if type(value) in (dict,list,tuple):
        seen.add(id(value))
        items=value.items() if type(value) is dict else enumerate(value)
        for key,item in items:
            if type(key) not in (str,int):raise ClosureError(GRAPH)
            _exact_data(item,seen)
        seen.remove(id(value));return
    raise ClosureError(GRAPH)


def _binding_locations(path):
    parts=path.split('.');rows=[]
    if parts[0]=='data':return rows
    if parts[0]=='builtins':
        value=_BUILTINS.get(parts[1]);rows.append((vars(builtins),parts[1],value));parts=parts[2:]
    else:
        found=None
        for size in range(len(parts),0,-1):
            name='.'.join(parts[:size]);module=sys.modules.get(name)
            if type(module) is types.ModuleType:found=(name,module,parts[size:]);break
        if found is None:return rows
        name,value,parts=found;rows.append((sys.modules,name,value))
    missing=_MISSING
    for part in parts:
        if type(value) is types.ModuleType:
            mapping=value.__dict__;item=mapping.get(part,missing);rows.append((mapping,part,item))
        elif isinstance(value,type):
            item=missing
            for cls in value.__mro__:
                mapping=cls.__dict__;candidate=mapping.get(part,missing);rows.append((mapping,part,candidate))
                if candidate is not missing:item=candidate;break
        else:
            # C bound methods: actual receiver已经由前序binding绑定，再绑定其descriptor。
            mapping=type(value).__dict__;item=mapping.get(part,missing);rows.append((mapping,part,item))
        if item is missing:break
        value=item
    return rows


def _resolve_external(path):
    parts=path.split('.')
    if parts[0]=='data':return None
    if parts[0]=='builtins':value=_BUILTINS.get(parts[1]);parts=parts[2:]
    else:
        best=None
        for size in range(len(parts),0,-1):
            module=sys.modules.get('.'.join(parts[:size]))
            if type(module) is types.ModuleType:best=(module,parts[size:]);break
        if best is None:return None
        value,parts=best
    for part in parts:
        try:value=getattr(value,part)
        except AttributeError:return None
    return value


class Operation:
    def __init__(self,repo,closure):
        self.repo=pathlib.Path(repo).absolute();self.closure=closure;self.latch=None
        self.diagnostic=None;self.thread=threading.get_ident();self.profile=sys.getprofile();self.trace=sys.gettrace()
        self.expected={};self.records=[];self.external=[];self.instructions={};self.valid_codes={}
        self.exception_bindings=[_EXCEPTION_TYPE_BINDINGS[r['provider']] for r in closure['call_graph'].get('exception_provider_checks',[])]
        for ref in closure['source_nodes']:
            name=pathlib.Path(ref['path']).stem;record=_SEALED.get(name)
            if record is not None:
                wanted=set(closure['call_graph']['nodes'])
                if name==__name__:self.records.append(record)
                else:
                    selected=dict(record)
                    selected['providers']={k:v for k,v in record['providers'].items() if name+'.'+k in wanted}
                    selected['wrapped']={k:v for k,v in record['wrapped'].items() if name+'.'+k in wanted}
                    selected['classes']={k:(cls,bases,{method:sig for method,sig in methods.items() if name+'.'+k+'.'+method in wanted}) for k,(cls,bases,methods) in record['classes'].items() if name+'.'+k in wanted}
                    self.records.append(selected)
            raw=(self.repo/ref['path']).read_bytes()
            self.expected[str(self.repo/ref['path'])]=_code_tree(raw,str(self.repo/ref['path']))
        external_seen=set()
        for leaf in closure['call_graph']['external_leaf_callsites']:
            provider=_resolve_external(leaf['provider'])
            # data.*必须由实际精确JSON/内核构造值核验；不会按方法名接受任意类。
            leaf['actual_provider_kind']='exact_builtin_receiver' if leaf['provider'].startswith('data.') else type(provider).__name__
            if provider is not None:
                sig=_callable_signature(provider)
                if leaf['provider'] not in external_seen:
                    self.external.append((leaf['provider'],sig));external_seen.add(leaf['provider'])
                leaf['actual_provider_module']=getattr(provider,'__module__',None)
                leaf['actual_provider_code_identity']=code_identity(provider.__code__) if type(provider) is types.FunctionType else None
        self.repo_modules={record['module'].__name__:record['module'].__dict__ for record in self.records}
        self.external_namespaces={id(m.__dict__):m for n,m in tuple(sys.modules.items()) if type(m) is types.ModuleType and n.split('.')[0] in set(sys.stdlib_module_names)|{'jsonschema','referencing','rpds','attrs','attr','_jsonschema_specifications','jsonschema_specifications'}}
        self.cleanup_code=Operation.__exit__.__code__
        selected={pathlib.Path,pathlib.PosixPath,pathlib.PurePath,pathlib.PurePosixPath,contextlib._GeneratorContextManager}
        for path,sig in self.external:
            if type(sig[0]) is type:selected.add(sig[0])
        unique={(id(cls),key):(cls,key,sig) for cls,key,sig in _EXTERNAL_CLASS_SLOTS if cls in selected}
        self.external_class_slots=list(unique.values())
        self.external_class_keys=[(cls,frozenset(cls.__dict__)) for cls in selected]
        self.external_descriptors={(id(cls),key):(cls.__dict__,key,value) for cls,key,value in _EXTERNAL_DESCRIPTOR_SLOTS if cls in selected}
        self.external_configs=_EXTERNAL_CONFIGS
        self.fast_slots=[];self.fast_functions=[];self.fast_classes=[]
        locations={}
        for record in self.records:
            namespace=record['module'].__dict__
            locations[(id(sys.modules),record['module'].__name__)]=(sys.modules,record['module'].__name__,record['module'])
            for name,module in record['module_aliases'].items():locations[(id(namespace),name)]=(namespace,name,module)
            for name,(cls,bases) in record['class_aliases'].items():
                locations[(id(namespace),name)]=(namespace,name,cls);self.fast_classes.append((cls,bases,frozenset(cls.__dict__)))
            for name,sig in record['providers'].items():
                locations[(id(namespace),name)]=(namespace,name,sig[0]);self.fast_functions.append(sig)
            for name,sig in record['wrapped'].items():self.fast_functions.append(sig)
            for name,(cls,bases,methods) in record['classes'].items():
                locations[(id(namespace),name)]=(namespace,name,cls)
                self.fast_classes.append((cls,bases,record['class_keys'][name]))
                for key,sig in methods.items():locations[(id(cls.__dict__),key)]=(cls.__dict__,key,sig[0]);self.fast_functions.append(sig)
        for path,sig in self.external:
            for mapping,key,value in _binding_locations(path):locations[(id(mapping),key)]=(mapping,key,value)
            if type(sig[0]) is types.FunctionType:self.fast_functions.append(sig)
        for cls,key,sig in self.external_class_slots:
            locations[(id(cls),key)]=(cls.__dict__,key,sig[0]);self.fast_functions.append(sig)
        for _,(mapping,key,value) in self.external_descriptors.items():locations[(id(mapping),key)]=(mapping,key,value)
        self.fast_slots=list(locations.values())
        self.fast_functions=list({id(sig[0]):sig for sig in self.fast_functions}.values())

    def violation(self,diagnostic=None):
        self.diagnostic=diagnostic or self.diagnostic;self.latch=IDENTITY;raise _Violation(IDENTITY)

    def slots(self):
        if self.latch:self.violation()
        for module_name,module,key,cls,bases in self.exception_bindings:
            if sys.modules.get(module_name) is not module or module.__dict__.get(key) is not cls or cls.__bases__!=bases:self.violation(('exception type binding',module_name,key))
        for mapping,key,expected in self.fast_slots:
            if mapping.get(key,_MISSING) is not expected:self.violation(('slot',key))
        for f,code,namespace,defaults,kwdefaults,cells in self.fast_functions:
            if f.__code__ is not code or f.__globals__ is not namespace or f.__defaults__ is not defaults or f.__kwdefaults__ is not kwdefaults:self.violation(('code/default',f.__name__))
            if cells:
                actual=f.__closure__
                if len(actual)!=len(cells) or any(c.cell_contents is not expected for c,expected in zip(actual,cells)):self.violation(('closure',f.__name__))
        for mapping,expected in self.external_configs:
            if len(mapping)!=len(expected) or any(mapping.get(key,_MISSING) is not value for key,value in expected):self.violation(('external configuration',))
        for cls,keys in self.external_class_keys:
            if frozenset(cls.__dict__)!=keys:self.violation(('external class keys',cls.__name__))
        for cls,bases,keys in self.fast_classes:
            if cls.__bases__!=bases or frozenset(cls.__dict__)!=keys:self.violation(('class slots',cls.__name__))
        for name in ('dict','list','set','str','bytes','tuple','getattr','type','isinstance','len','sorted','map','filter','all','any'):
            if vars(builtins).get(name) is not _BUILTINS[name]:self.violation(('builtin',name))

    def frame(self,frame):
        filename=frame.f_code.co_filename
        expected=self.expected.get(filename)
        if expected is not None and filename.startswith(str(self.repo/pathlib.Path(SCRIPT_ROOT))+'/'):
            if self.repo_modules.get(frame.f_globals.get('__name__')) is not frame.f_globals:self.violation((frame.f_code.co_name,frame.f_code.co_filename,frame.f_lineno,frame.f_globals.get('__name__')))
            candidates=expected.get((frame.f_code.co_name,frame.f_code.co_firstlineno),set())
            if id(frame.f_code) not in self.valid_codes:
                if code_identity(frame.f_code) not in candidates:self.violation((frame.f_code.co_name,frame.f_code.co_filename,frame.f_lineno,frame.f_globals.get('__name__')))
                self.valid_codes[id(frame.f_code)]=frame.f_code
            return 'kernel' if frame.f_globals.get('__name__')==__name__ else 'repo'
        module=frame.f_globals.get('__name__','')
        if module.split('.')[0] in _ALLOWED_EXTERNAL_MODULES:
            known=_EXTERNAL_GENERATED_IDS.get(id(frame.f_code))
            if known is not None and known[0] is frame.f_code and id(frame.f_globals) in known[1]:return 'external'
            bound=self.external_namespaces.get(id(frame.f_globals))
            if type(bound) is not types.ModuleType or frame.f_globals is not bound.__dict__:self.violation((frame.f_code.co_name,frame.f_code.co_filename,frame.f_lineno,frame.f_globals.get('__name__')))
            expected=self.expected.get(filename)
            if expected is None:
                try:expected=_code_tree(pathlib.Path(filename).read_bytes(),filename)
                except (OSError,SyntaxError):self.violation(('unbound external code',filename))
                self.expected[filename]=expected
            if code_identity(frame.f_code) not in expected.get((frame.f_code.co_name,frame.f_code.co_firstlineno),set()):self.violation(('external code drift',filename))
            return 'external'
        # Callable callback越过stdlib/第三方边界仍回到应用图；foreign code不能成为leaf。
        self.violation((frame.f_code.co_name,frame.f_code.co_filename,frame.f_lineno,frame.f_globals.get('__name__')))

    def profile_hook(self,frame,event,arg):
        if event=='call':self.frame(frame)
        elif event=='c_call':
            if frame.f_code is self.cleanup_code:return
            # c_call 是互补证据；dict/list/slot构造由opcode前的槽位门保护。
            if self.latch:self.violation()
            receiver=getattr(arg,'__self__',None)
            if receiver is not None and type(receiver) not in (types.ModuleType,type,dict,list,set,frozenset,str,bytes,bytearray,tuple,int,float,complex,io.BufferedReader,io.TextIOWrapper,io.FileIO):
                # Hash/regex/Path相关C对象必须属于实际解释器内建extension类型。
                cls=type(receiver)
                if cls not in _EXTERNAL_RECEIVER_TYPES:self.violation(('C receiver',cls.__module__,cls.__name__,getattr(arg,'__name__',None)))

    def trace_hook(self,frame,event,arg):
        if event=='call':
            kind=self.frame(frame)
            if kind=='repo':frame.f_trace_opcodes=True
            return self.trace_hook if kind=='repo' else None
        if event=='opcode':
            if frame.f_code is self.cleanup_code:return self.trace_hook
            # 在全部dispatch和隐式slot操作前核实际槽位；不以profile-only证明构造。
            opname=dis.opname[frame.f_code.co_code[frame.f_lasti]]
            if not (opname.startswith(('CALL_','BINARY_','UNARY_')) or opname in {'LOAD_ATTR','LOAD_METHOD','GET_ITER','FOR_ITER','SETUP_WITH','WITH_EXCEPT_START','COMPARE_OP','CONTAINS_OP'}):return self.trace_hook
            self.slots()
            for value in frame.f_locals.values():
                if type(value) in (types.FunctionType,types.MethodType):
                    f=value.__func__ if type(value) is types.MethodType else value
                    expected=self.expected.get(f.__code__.co_filename)
                    if expected is None:
                        # 精确stdlib callback/provider需要外部callsite identity，不接受普通foreign函数。
                        if not any(f is sig[0] for p,sig in self.external):self.violation()
                    elif self.repo_modules.get(f.__globals__.get('__name__')) is not f.__globals__:self.violation()
                    elif id(f.__code__) not in self.valid_codes:
                        if code_identity(f.__code__) not in expected.get((f.__code__.co_name,f.__code__.co_firstlineno),set()):self.violation()
                        self.valid_codes[id(f.__code__)]=f.__code__
        return self.trace_hook

    def __enter__(self):
        if self.profile is not None or self.trace is not None:
            # 未知hook没有可证明的组合语义；原hook原样保留。
            raise ClosureError(IDENTITY)
        if getattr(_TLS,'operation',None) is not None:return _TLS.operation
        self.slots();_TLS.operation=self
        sys.setprofile(self.profile_hook);sys.settrace(self.trace_hook)
        return self

    def __exit__(self,kind,value,tb):
        sys.settrace(self.trace);sys.setprofile(self.profile);_TLS.operation=None
        if kind is _Violation or self.latch:
            error=ClosureError(IDENTITY);chain=[]
            while tb is not None:
                chain.append((tb.tb_frame.f_code.co_name,tb.tb_frame.f_code.co_filename,tb.tb_lineno));tb=tb.tb_next
            error.diagnostic=(self.diagnostic,chain);raise error
        return False


def kernel_witness(repo):
    """独立内核全部body的有限effect审查；仅_code_tree的compile获准。"""
    p=pathlib.Path(repo).absolute()/SCRIPT_ROOT/'rgc_runtime_closure_guard.py'
    tree=ast.parse(p.read_bytes());rows=[]
    for n in ast.walk(tree):
        if isinstance(n,ast.Name) and n.id in DYNAMIC and n.id!='compile':raise ClosureError(GRAPH)
        if not isinstance(n,ast.Call):continue
        if isinstance(n.func,ast.Name) and n.func.id in DYNAMIC:
            if n.func.id!='compile':raise ClosureError(GRAPH)
            parents=[f for f in tree.body if isinstance(f,ast.FunctionDef) and n in tuple(ast.walk(f))]
            if len(parents)!=1 or parents[0].name!='_code_tree':raise ClosureError(GRAPH)
        if isinstance(n.func,ast.Attribute) and ast.unparse(n.func).startswith('importlib.'):raise ClosureError(GRAPH)
        rows.append({'line':n.lineno,'call':ast.unparse(n.func),'effect':'compile-only' if isinstance(n.func,ast.Name) and n.func.id=='compile' else 'sealed kernel helper/stdlib identity operation'})
    return {'source_ref':{'path':str(p.relative_to(pathlib.Path(repo).absolute())),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},'all_callsites':rows,'compile_source_executed':False}


def seal_external_environment():
    """实际stdlib/固定第三方初始化结果属于已批准解释器环境根；保存生成code实际身份。"""
    allowed=set(sys.stdlib_module_names)|{'jsonschema','referencing','rpds','attrs','attr','_jsonschema_specifications','jsonschema_specifications'}
    def remember(function):
        if type(function) is not types.FunctionType:return
        def codes(code):
            _EXTERNAL_GENERATED_CODES.setdefault(code,[]).append(function.__globals__)
            _EXTERNAL_GENERATED_IDS.setdefault(id(code),(code,set()))[1].add(id(function.__globals__))
            for c in code.co_consts:
                if type(c) is types.CodeType:codes(c)
        codes(function.__code__)
    for name,module in tuple(sys.modules.items()):
        if type(module) is not types.ModuleType or (name.split('.')[0] not in allowed and name!=__name__):continue
        for key,value in tuple(module.__dict__.items()):
            if type(value) is type and issubclass(value,_EXCEPTION_ROOT):
                _EXCEPTION_TYPE_BINDINGS.setdefault(name+'.'+key,(name,module,key,value,tuple(value.__bases__)))
        for value in tuple(module.__dict__.values()):
            remember(value)
            if isinstance(value,type):
                _EXTERNAL_RECEIVER_TYPES.add(value)
                for key,method in tuple(value.__dict__.items()):
                    _EXTERNAL_DESCRIPTOR_SLOTS.append((value,key,method))
                    if isinstance(method,(classmethod,staticmethod)):remember(method.__func__)
                    elif isinstance(method,property):remember(method.fget);remember(method.fset);remember(method.fdel)
                    if type(method) is dict and name.startswith('jsonschema') and key in {'checkers','VALIDATORS'}:
                        _EXTERNAL_CONFIGS.append((method,tuple(method.items())))
                    if type(method) is types.FunctionType:
                        remember(method)
                        _EXTERNAL_CLASS_SLOTS.append((value,key,_callable_signature(method)))


def run(repo,arguments,body,_seal=_SEALED):
    """独立caller绑定真实入口后，本函数先验kernel身份，再执行任何业务helper。"""
    active=getattr(_TLS,'operation',None)
    if active is not None:return body()
    record=_seal.get(__name__)
    if record is None:raise ClosureError(IDENTITY)
    try:_verify_module_slots(record)
    except _Violation:raise ClosureError(IDENTITY) from None
    if type(repo) not in (str,pathlib.PosixPath,pathlib.WindowsPath):raise ClosureError(GRAPH)
    for value in arguments:_exact_data(value)
    seal_loaded_modules()
    closure=graph(repo);closure['kernel_witness']=kernel_witness(repo)
    verify_loaded(repo,closure['source_nodes'])
    with Operation(repo,closure):return body()


def loaded_source_identity():
    record=_SEALED[__name__]
    return {'path':record['path'],'sha256':record['sha256']}


def protect(function):
    """入口outer/真正wrapped code均保留，禁止只unwrap后证明执行者。"""
    entry_run=run;entry_code=run.__code__;kernel_namespace=sys.modules[__name__].__dict__
    def entry(*,repo,aggregate_request_ref,caller_aggregate_plan_ref,caller_aggregate_code_pin_ref):
        if kernel_namespace.get('run') is not entry_run or entry_run.__code__ is not entry_code:
            raise ClosureError(IDENTITY)
        # 入口的最小root使用load-time封存对象，不调用任何待验证provider自报函数。
        record=_SEALED.get(__name__)
        if record is None:raise ClosureError(IDENTITY)
        for name,sig in record['providers'].items():
            actual=kernel_namespace.get(name)
            if actual is not sig[0] or actual.__code__ is not sig[1] or actual.__globals__ is not sig[2]:raise ClosureError(IDENTITY)
        try:
            return entry_run(repo,(aggregate_request_ref,caller_aggregate_plan_ref,caller_aggregate_code_pin_ref),lambda:function(repo=repo,aggregate_request_ref=aggregate_request_ref,caller_aggregate_plan_ref=caller_aggregate_plan_ref,caller_aggregate_code_pin_ref=caller_aggregate_code_pin_ref))
        except ClosureError as exc:
            reason=str(exc)
            # 无业务helper的只读错误表面，防止已替换unknown-field函数参与拒绝。
            observer=sys.modules.get('rgc_runtime_observer')
            fields=observer.__dict__.get('SCENARIO_FIELDS',()) if observer is not None else ()
            return {'contract_verdict':'valid','execution_verdict':'error','behavior':'error','failure_fingerprint':reason,'dispatch_authority':False,'runtime_acceptance':'not_evaluated','p3_all_and':False,'fields':{name:{'value':None,'status':'unknown','source_refs':[],'evidence_gap':reason} for name in fields},'components':[]}
    entry.__module__=function.__module__;entry.__name__=function.__name__;entry.__qualname__=function.__qualname__;entry.__wrapped__=function
    return entry

seal_loaded_modules(__name__)
seal_external_environment()
