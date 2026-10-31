from pathlib import Path
import json
A=Path('Dashboard/Artifacts/SP-001')
s={'type':'string','minLength':1}
def arr(item,minn=0):return {'type':'array','items':item,'minItems':minn}
def obj(props):return {'type':'object','additionalProperties':False,'required':list(props),'properties':props}
ids=arr(s)
evidence=obj({'path':s,'start_line':{'type':'integer','minimum':1},'end_line':{'type':'integer','minimum':1},'symbol':s,'sha256':{'type':'string','pattern':'^[a-f0-9]{64}$'}})
fact=obj({'id':s,'statement':s,'kind':{'enum':['implemented','configured','normative']},'scope':s,'evidence':arr(evidence,1)})
axes=['trigger','inputs','outputs','preconditions','state_changes','postconditions','invariants','failures','permissions','implementation','dependencies','data','tests']
cap=obj({'id':s,'name':s,'depth':{'enum':['core','navigation']},'summary':s,'contract':obj({x:ids for x in axes}),'limits':arr(s,1)})
rel=obj({'id':s,'type':{'enum':['PRODUCT_HAS_CAPABILITY','CAPABILITY_REALIZED_BY','MODULE_DEPENDS_ON','API_EXPOSES_CAPABILITY','UI_CALLS_API','CAPABILITY_READS_WRITES_DATA','IMPLEMENTATION_COVERED_BY_TEST','FACT_SUPPORTED_BY_EVIDENCE','CHANGE_IMPACTS','GAP_BLOCKS_CLAIM','DEPENDS_ON','CALLS','TEST_ASSET_FOR']},'from':s,'to':s,'evidence_fact_ids':arr(s,1)})
meta=obj({'owner':s,'updated_at':s,'source_repo':s,'source_revision':{'type':'string','pattern':'^[a-f0-9]{40}$'},'source_scope':s,'depends_on_docs':ids})
schema=obj({'doc_id':s,'doc_type':{'const':'static_knowledge'},'title':s,'version':s,'status':{'const':'static_verified'},'output_path':s,'metadata':meta,'domains':arr({'type':'string','pattern':'^K(0[0-9]|1[01])$'},1),'facts':arr(fact,1),'capabilities':arr(cap),'relations':arr(rel)})
schema.update({'$schema':'https://json-schema.org/draft/2020-12/schema','$id':'dataease-kb-document-v1'})
(A/'planning/kb-document.schema.v1.json').write_text(json.dumps(schema,ensure_ascii=False,indent=2)+'\n')
(A/'planning/object-contract-v1.md').write_text('''# KB 对象与准入合同 v1

字段以 kb-document.schema.v1.json 为准；候选补充固定的metadata后方可正式准入。

1. metadata.source_repo/revision对整篇及全部来源有效；当前仅主仓库。evidence每条含path、symbol、行区间、整文件摘要；updated_at为本次实际核实时点，不是渲染时间。ID全库唯一。
2. implemented表述静态实现或明确的接口声明；configured表述声明配置；normative仅要求。reader必须显示类别与scope，不能把规范改写成实现。
3. contract各轴引用本库fact ID。core的空轴必须在limits明确解释；核心未核实不能因limits有字就通过语义验收。metadata.owner为维护责任角色，不假造人员。
4. 关系from/to是capability或fact ID；evidence_fact_ids必须是事实ID。若两端类型不符关系语义则语义复核拒绝。CAPABILITY_REALIZED_BY/API_EXPOSES_CAPABILITY/CAPABILITY_READS_WRITES_DATA的capability端分别为from/to/from；UI_CALLS_API及MODULE_DEPENDS_ON使用相应事实端点。测试关系仅表示资产关联，不代表执行覆盖。
5. 源路径拒绝绝对路径、上跳、符号链接逃逸、Dashboard、docs/Dashboard、kb、.codex、de-xpack、.env/凭据配置及生成目录。全景只为Reference，不进入正式事实证据。source_repo固定当前主仓库身份，主仓库与上游区分。
6. validate校验schema、唯一ID、关系和contract引用、digest、行区间及字段；render仅在validate通过后生成，check-render对比预期，不隐式修复。impact按来源文件→事实→关系/能力，返回引用，不静默重新认证事实。
7. 固定正反例：真实ChartDataServer切片准入；Dashboard与全景来源拒绝SOURCE_NOT_ALLOWED；摘要失效STALE_SOURCE；unknown类别SCHEMA；重复ID DUPLICATE_ID；悬空端点DANGLING_REF；错误输出路径OUTPUT_PATH；渲染连续运行字节相同；变更查询返回受影响事实和能力。
8. 工具通过不是独立语义审查；源行存在不证明断言正确。缺口/冲突不进入canonical，全部位于SP执行材料。CLI输出报告由调用方重定向至SP。
''')
print('P1对象合同已设计，尚未提升正式知识。')
