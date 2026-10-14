#!/usr/bin/env python3
"""DataEase KB：结构与来源核验、确定性投影、变更影响；不替代语义审查。"""
import argparse
import hashlib
import json
import sys
import subprocess
from pathlib import Path
import jsonschema

class Invalid(ValueError):
    pass

def fail(code, detail):
    raise Invalid(f'{code}: {detail}')

def source_path(repo, raw):
    p=Path(raw)
    parts=p.parts
    low=raw.lower()
    if p.is_absolute() or '..' in parts or not parts:
        fail('SOURCE_NOT_ALLOWED',raw)
    if parts[0].lower() in {'dashboard','kb','.codex','de-xpack','.git'} or low.startswith('docs/dashboard/'):
        fail('SOURCE_NOT_ALLOWED',raw)
    if any(x in {'node_modules','target','dist','.cache'} for x in parts) or p.name.startswith('.env') or p.name in {'dbhub.toml','.mcp.json'}:
        fail('SOURCE_NOT_ALLOWED',raw)
    resolved=(repo/p).resolve()
    if not resolved.is_relative_to(repo.resolve()) or not resolved.is_file():
        fail('SOURCE_NOT_ALLOWED',raw)
    return resolved

def validate(repo, data, schema):
    docs=[json.loads(p.read_text()) for p in sorted(data.glob('*.json'))]
    if not docs: fail('EMPTY_KB',str(data))
    validator=jsonschema.Draft202012Validator(json.loads(schema.read_text()))
    ids={}; facts={}; caps={}; docids=set(); outputpaths=set(); checked={}
    expected_revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
    expected_repo=subprocess.check_output(['git','remote','get-url','origin'],cwd=repo,text=True).strip().removesuffix('.git').rstrip('/')
    for d in docs:
        errors=list(validator.iter_errors(d))
        if errors: fail('SCHEMA',f"{d.get('doc_id')}: {errors[0].message}")
        if d['metadata']['source_revision']!=expected_revision:fail('SOURCE_REVISION',d['doc_id'])
        if d['metadata']['source_repo'].removesuffix('.git').rstrip('/')!=expected_repo:fail('SOURCE_REPO',d['doc_id'])
        if d['doc_id'] in docids: fail('DUPLICATE_ID',d['doc_id'])
        docids.add(d['doc_id'])
        output=d['output_path']
        if output!=f"kb/generated/{d['doc_id']}.md" or '/' in d['doc_id'] or '..' in d['doc_id']:
            fail('OUTPUT_PATH',output)
        if output in outputpaths:fail('OUTPUT_PATH',output)
        outputpaths.add(output)
        for category in ['facts','capabilities','relations']:
            for row in d[category]:
                if row['id'] in ids: fail('DUPLICATE_ID',row['id'])
                ids[row['id']]=category
                if category=='facts':facts[row['id']]=row
                if category=='capabilities':caps[row['id']]=row
        for f in d['facts']:
            for e in f['evidence']:
                p=source_path(repo,e['path'])
                if e['path'] not in checked:
                    raw=p.read_bytes();checked[e['path']]=(hashlib.sha256(raw).hexdigest(),len(raw.decode('utf-8').splitlines()))
                digest,lines=checked[e['path']]
                if digest!=e['sha256']:fail('STALE_SOURCE',e['path'])
                if not 1<=e['start_line']<=e['end_line']<=lines:fail('SOURCE_LINES',e['path'])
    for d in docs:
        for dep in d['metadata']['depends_on_docs']:
            if dep not in docids:fail('DANGLING_REF',dep)
        for c in d['capabilities']:
            for axis,refs in c['contract'].items():
                for ref in refs:
                    if ref not in facts:fail('DANGLING_REF',f"{c['id']}.{axis}:{ref}")
        for rel in d['relations']:
            for key in ['from','to']:
                if ids.get(rel[key]) not in {'facts','capabilities'}:fail('DANGLING_REF',rel[key])
            for ref in rel['evidence_fact_ids']:
                if ref not in facts:fail('DANGLING_REF',ref)
            types=(ids[rel['from']],ids[rel['to']])
            expected={'CAPABILITY_REALIZED_BY':('capabilities','facts'),'API_EXPOSES_CAPABILITY':('facts','capabilities'),'CAPABILITY_READS_WRITES_DATA':('capabilities','facts'),'UI_CALLS_API':('facts','facts'),'MODULE_DEPENDS_ON':('facts','facts')}.get(rel['type'])
            if expected and types!=expected:fail('RELATION_TYPE',rel['id'])
    return docs,{'documents':len(docs),'facts':len(facts),'capabilities':len(caps),'relations':sum(len(d['relations']) for d in docs),'source_files':len(checked),'claim':'仅结构、引用和来源摘要通过；语义须独立复核'}

AXES={'trigger':'触发','inputs':'输入','outputs':'输出','preconditions':'前置条件','state_changes':'状态变化','postconditions':'后置条件','invariants':'不变量','failures':'失败分支','permissions':'权限','implementation':'实现入口','dependencies':'依赖','data':'数据对象','tests':'测试资产（未运行）'}
KINDS={'implemented':'静态实现/接口','configured':'配置声明','normative':'规范要求'}

def projections(docs):
    locations={f['id']:f"{d['doc_id']}.md#{f['id'].lower()}" for d in docs for f in d['facts']}
    out={}
    fact_index={f['id']:f for d in docs for f in d['facts']}
    cap_index={c['id']:c for d in docs for c in d['capabilities']}
    for d in docs:
        lines=[f"# {d['title']}",'',f"源码基线：`{d['metadata']['source_revision']}`；版本：{d['version']}。",'', '本文是静态源码知识，未证明运行正确。接口、配置和规范各按标注解读。','',f"适用范围：{d['metadata']['source_scope']}",'','## 能力契约','']
        for c in d['capabilities']:
            lines += [f"### {c['id']} {c['name']}",'',c['summary'],'']
            for axis,refs in c['contract'].items():
                if refs:lines += [f"- {AXES[axis]}："+'、'.join(f'[{r}]({locations[r]})' for r in refs)]
            lines += ['','适用边界：'+'；'.join(c['limits']),'']
        lines+=['## 可追溯事实','']
        for f in d['facts']:
            lines += [f"### {f['id']}",'',f"**{KINDS[f['kind']]}** · {f['scope']}",'',f['statement'],'']
            for e in f['evidence']:
                lines += [f"- [`{e['path']}:{e['start_line']}–{e['end_line']}`](../../{e['path']}#L{e['start_line']}) · `{e['symbol']}`"]
            lines+=['']
        graph_types={'UI_CALLS_API','API_EXPOSES_CAPABILITY','CALLS','MODULE_DEPENDS_ON','CAPABILITY_READS_WRITES_DATA','CHANGE_IMPACTS','TEST_ASSET_FOR'}
        graph=[r for r in d['relations'] if r['type'] in graph_types]
        if graph:
            lines+=['## 静态关系图','', '节点为下文事实或能力；箭头类型保留原始语义，测试关联不表示调用或运行通过。这里只投影显式核实关系，不推断缺失边。','', '```mermaid','flowchart TD']
            nodes=sorted({r[k] for r in graph for k in ['from','to']})
            for node in nodes:
                obj=fact_index.get(node)
                label=obj['evidence'][0]['symbol'] if obj else cap_index[node]['name']
                label=(node+' '+label).replace('&','&amp;').replace('"','&quot;').replace('<','&lt;').replace('>','&gt;').replace('\n',' ')
                lines.append(f'  {node.replace("-","_")}["{label}"]')
            for r in graph:
                lines.append(f'  {r["from"].replace("-","_")} -->|{r["type"]}| {r["to"].replace("-","_")}')
            lines+=['```','']
        if d['relations']:
            lines+=['## 关系','', '| 类型 | 起点 | 终点 | 依据 |','|---|---|---|---|']
            for rel in d['relations']:
                label=rel['type']
                if label=='IMPLEMENTATION_COVERED_BY_TEST':label='测试资产关联（未运行）'
                lines += [f"| {label} | {rel['from']} | {rel['to']} | {', '.join(rel['evidence_fact_ids'])} |"]
            lines+=['']
        out[d['output_path']]='\n'.join(lines)
    index=['# DataEase V3 知识库','', '本目录与执行 Dashboard 平行。仅保存经源码核实的知识 JSON、结构合同、生成工具和阅读投影。产品全景 Dashboard 只作为提取参考，不作为正式事实证据。','', '## 阅读入口','']
    for d in docs:index += [f"- [{d['title']}](generated/{d['doc_id']}.md)：{'、'.join(d['domains'])}"]
    index += ['', '## 维护与使用','', '源文件位于 `data/`；禁止手工改写 `generated/`。所有内容绑定各文档中的源码提交与文件摘要；代码变化后先检查影响、重新核实 JSON，再生成。','', '在仓库根目录执行：','', '```sh','python3 kb/tools/kb.py validate','python3 kb/tools/kb.py check-render','python3 kb/tools/kb.py impact path/to/changed/source','python3 kb/tools/kb.py render','```','', '工具使用 Python 3 和 jsonschema；不自动安装依赖。校验只检查结构、引用与来源摘要，不能替代语义复核。测试资产关联不等于测试运行通过。','', '候选、缺口、冲突、覆盖统计和审查报告均属于执行材料，不在本知识目录保存。','']
    mapping=['# 能力地图','', '按源码证据组织；核心深挖与导航深度分开，不能从数量推断产品可用性。','', '| 能力 | 深度 | 知识入口 | 边界 |','|---|---|---|---|']
    for d in docs:
        for c in d['capabilities']:
            mapping.append(f"| {c['id']} {c['name']} | {c['depth']} | [{d['title']}]({d['doc_id']}.md) | {'；'.join(c['limits']).replace('|','/')} |")
    out['kb/generated/capability-map.md']='\n'.join(mapping)+'\n'
    source_rows={}
    for d in docs:
        for f in d['facts']:
            for e in f['evidence']:source_rows.setdefault(e['path'],set()).add(f['id'])
    source_index=['# 源码定位与变更影响入口','', '下表仅列已形成事实证据的源码，不是全仓已读清单。代码变更后使用 impact 查找保守闭包。','', '| 源文件 | 直接支持的事实 |','|---|---|']
    for path,refs in sorted(source_rows.items()):source_index.append(f"| [{path}](../../{path}) | {', '.join(sorted(refs))} |")
    out['kb/generated/source-index.md']='\n'.join(source_index)+'\n'
    index += ['## 横向导航','', '- [能力地图](generated/capability-map.md)','- [源码定位与变更影响](generated/source-index.md)','']
    out['kb/README.md']='\n'.join(index)
    return out

def impact(docs,changed):
    direct={f['id'] for d in docs for f in d['facts'] if any(e['path'] in changed for e in f['evidence'])}
    affected=set(direct);rels=set()
    repeat=True
    while repeat:
        before=len(affected)
        for d in docs:
            for c in d['capabilities']:
                if any(r in affected for refs in c['contract'].values() for r in refs):affected.add(c['id'])
            for r in d['relations']:
                if r['from'] in affected or r['to'] in affected or set(r['evidence_fact_ids'])&affected:
                    rels.add(r['id']);affected.update([r['from'],r['to']])
        repeat=len(affected)>before
    return {'changed_paths':sorted(changed),'direct_facts':sorted(direct),'affected_objects':sorted(affected),'affected_relations':sorted(rels),'meaning':'保守依赖闭包，仅定位重审范围，不自动升级或重验事实'}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('command',choices=['validate','render','check-render','impact']);p.add_argument('paths',nargs='*');p.add_argument('--repo',type=Path,default=Path.cwd());p.add_argument('--data',type=Path);p.add_argument('--schema',type=Path);a=p.parse_args();repo=a.repo.resolve();data=a.data or repo/'kb/data';schema=a.schema or repo/'kb/schema/document.schema.json'
    try:
        if a.command=='impact':
            # 已变化来源也必须可以定位影响；此命令不冒充validation。
            docs=[json.loads(p.read_text()) for p in sorted(data.glob('*.json'))]
            print(json.dumps(impact(docs,set(a.paths)),ensure_ascii=False,indent=2));return 0
        docs,result=validate(repo,data,schema)
        if a.command in {'render','check-render'}:
            for path,content in projections(docs).items():
                target=repo/path
                if a.command=='check-render':
                    if not target.is_file() or target.read_text()!=content:fail('PROJECTION_DRIFT',path)
                else:target.parent.mkdir(parents=True,exist_ok=True);target.write_text(content)
        print(json.dumps({'verdict':'pass','command':a.command,**result},ensure_ascii=False,indent=2));return 0
    except (Invalid,OSError,UnicodeError,json.JSONDecodeError) as e:
        print(json.dumps({'verdict':'fail','error':str(e)},ensure_ascii=False));return 1
if __name__=='__main__':sys.exit(main())
