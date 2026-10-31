# 领域提取交换格式 v1

各lane只写自己在SP/extraction下的候选JSON与read-log/gaps，不直接写正式kb。所有断言需亲读源码；symbol+行范围可多项。禁止引用执行Dashboard或全景Dashboard为正式证据。

候选JSON：
```json
{
  "doc_id": "data",
  "title": "数据源与数据集",
  "domains": ["K03", "K04", "K05"],
  "facts": [
    {"id":"DATA-001", "statement":"精确的中文静态事实", "kind":"implemented", "scope":"适用分支/条件", "evidence":[{"path":"仓库相对路径", "start_line":1, "end_line":9, "symbol":"类或函数", "sha256":"整文件SHA256"}]}
  ],
  "capabilities": [
    {"id":"F01", "name":"能力中文名", "depth":"core", "summary":"业务目的；不新增未证实断言", "contract":{"trigger":["DATA-001"],"inputs":[],"outputs":[],"preconditions":[],"state_changes":[],"postconditions":[],"invariants":[],"failures":[],"permissions":[],"implementation":[],"dependencies":[],"data":[],"tests":[]}, "limits":["静态核实范围或不可见实现边界"]}
  ],
  "relations": [
    {"id":"DATA-R01", "type":"CAPABILITY_REALIZED_BY", "from":"F01", "to":"DATA-001", "evidence_fact_ids":["DATA-001"]}
  ]
}
```

kind只允许implemented/configured/normative；契约事实用implemented但措辞必须明确仅接口声明；depth只允许core/navigation。navigation的contract可只填已证实部分；core各维度必须核实，有不适用或无测试证据等情况在limits明确；不能为填满编造事实。facts可描述测试资产，但不得声称运行通过。断言和关系各自可追溯。所有ID全库唯一，各lane前缀DATA / CHART / ACCESS / BASE。跨lane关系后续整合。
read-log.json独立记录真正读过的文件及区间/符号/方式；rg命中仅算定位。gaps.json在SP内记录不确定知识、原因、需要的人类澄清/运行验证，不能进入facts。
