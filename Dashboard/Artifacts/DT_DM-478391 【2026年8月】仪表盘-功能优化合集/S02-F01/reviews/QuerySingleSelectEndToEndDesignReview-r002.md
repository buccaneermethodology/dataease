# QE2E-001 独立语义复审 r002

## 双结论

- Design Freeze Validity：**NOT_READY_FOR_FINAL_ORACLE_FREEZE**。主要组合合同和已物化结果已核对成立，但008未实际构造所声称的多错场景，010将旁路断言混入返回expected，需极小修订。
- Implementation Entry Readiness：**NOT_READY_FOR_BOUNDED_ADMISSION**。不要求重新设计组合或扩大权限范围；完成下列两项fixture修正即可快速复审。

## 卡与复核方式

接收端SP010 review card canonical `f299bcd1dba8149969ca1766386034c27a4097bb82d9b3883c8b83654f464185` 验证pass、exit=0；Context validate退出0，required_read_set摘要一致；两个parent_fixture_refs文件SHA全部一致。唯一写入为本报告。

用现有esbuild write:false在内存加载真实QPIPE和QPAYLOAD及其生产依赖，按文档映射独立组合调用；没有新增实现、测试文件、构建产物或替换子模块。此为父模块组合可达性/oracle复核，不是尚未实现QE2E函数的GREEN或RED证据。001/002真实QPIPE plan逐键等于对应QPAYLOAD父case referencePlan；001–006及008的物化input所得完整结构化结果全部与expected相等。

## 已关闭的r001问题

F-QE2E-001主要缺口已修复：001/002完整输入和两个完整VQuery输出；003–006/008完整失败输入与结构化返回；007明确引用001并专测深冻/不共享，不伪装为另一输出oracle。父fixture路径、SHA和case身份可追溯，expected不来自被测新函数。

F-QE2E-002已修复：006重复fieldIds能通过当前QMAP并产生计划，而真实QTARGET目录唯一字段检查拒绝；实际得到QTARGET cause DIRECTORY/TARGET_UNRESOLVED。未用不同目录或mock绕过上游。

F-QE2E-003主体已修复：先descriptor-first全输入JSON安全，再精确七键，再QPIPE，再QPAYLOAD；ENVELOPE错误对象明确。非法输入不会靠触发getter后再拒绝。业务校验不重写，QPAYLOAD失败原形透传，QPIPE只包REFERENCE_PIPELINE cause。

## 剩余最小修正

### F-QE2E-004：008并非多错输入（P1，冻结阻断）

008物化输入target.id=expectedTargetId=query-B；runtime_patch又同时将两者改为query-X，仍然相等。因此补丁前后均只有propValue=[]导致的QPROJ错误，没有容器ID第二错误。当前结果匹配只重复证明空源短路，不能证明设计承诺的多错优先级；且物化input与runtime_patch形成两个运行载体。

只需将008最终input中target.id改为query-X、expectedTargetId保持query-B（或反之），移除多余runtime_patch，保留现有REFERENCE_PIPELINE/QPROJ/INVALID_INPUT预期与仅QPROJ调用序列。这样同一最终输入真正含两错，无需新增identity。

### F-QE2E-005：010返回expected与getter计数混层（P2，冻结阻断）

runtime_constructed_invalid_input_cases的010把getter_calls:0写入expected错误对象，但接口只返回ok/stage/reason；严格exact structured output equality将要求实现返回不存在的诊断字段。

只需把getter_calls移到expected_observations或assertions，expected保留 `{ok:false,stage:'ENVELOPE',reason:'INVALID_INPUT'}`。001–008结果不改。009 Object.create(null)与011循环拒绝均有明确构造含义，非JSON对象按运行时构造验证合理。

## Boundary / Evolution与实施准备

Frame-first结论：这里只是detached普通单选完整候选组合，不是浏览器到数据库的产品端到端；目录不证明权限，目标快照不证明新鲜性或覆盖确认。target与chart ID域分离，只有QPAYLOAD两槽替换；原10项AC、26项must-have与16项产品义务保持，真实权限BLOCKED/NOT_RUN。

正向组合入口完整：五项引用输入交QPIPE，其value原样成为QPAYLOAD.rebuildInput.referencePlan，source由原propValue/cascade组成，同一targetComponents传下游；QPAYLOAD target/expectedTargetId保持。不得修改父模块或假造validated结果。无环共享输入与循环应区别，输出输入/设计/运行三方均须彻底隔离；测试必须真实调用，spy只透传计数。

修复两处fixture后即可限定新组合模块及对应测试进入新Builder card/context/target-bound admission流程，无需等待产品权限。Builder卡应固定完整源码/测试路径，不凭“同目录”扩大写范围。依赖partial不因本复算被提升为包级PASS。未运行新函数、不声明新函数完成或Goal完成。
