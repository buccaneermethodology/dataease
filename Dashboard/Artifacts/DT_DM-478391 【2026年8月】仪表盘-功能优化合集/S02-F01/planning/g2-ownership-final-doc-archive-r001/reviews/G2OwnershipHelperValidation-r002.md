# G2 返回实例所有权 helper 修复独立增量验证 r002

## 裁定

**`PASS_WITH_BOUNDS_FOR_RETURNED_INSTANCE_HELPER`：本helper实现第2/3轮独立增量验证通过；G2OWN-HV-001为`CLOSED`，未发现新增合同内阻断。** 当前有效source SHA-256：`7ff0a6d2ad931260241a4fc78970a99dc14f78c25bf71234f272a6fc837a90a2`。

本结论接纳的是create已返回实例、已登记同步cleanup的所有权helper实现，包括同key有限重入登记的清理与错误出口；不证明组件、真实G2浏览器、完整stage/query/Store、权限或MVP。组件/浏览器独立验证必须消费这个新source摘要，不能沿用旧`d31e...`冻结绑定。原10 Goal AC / 26 must-have / 16产品义务完整保留，真实权限仍`BLOCKED / NOT_RUN`。

## 身份与读取清单

Reviewer/source：`/root/g2_ownership_red_validator`；Builder：`/root/g2_ownership_red`，身份分离。接收端先复验Card canonical SHA-256 `0f4976f3b6a534e71daecd2a5324301e0170e069bcada4e80d401bc73ad166cf`为pass；Context `4eea145099e408e92a8afc0c664d92edfc629e3e58d3460a80738a4cbd72549b`结构验证退出0，22项required-read实际摘要全部匹配。

完整读取当前helper、原冻结23-case runner、新补充10-case runner、旧source原字节备份、修复报告/identity/原始RED与GREEN、三个精确admission；对照初轮实现报告与HV-001、原Design/Cases/终审/Goal/AGENTS/SP-010基线。初轮完整合同审查矩阵见[G2OwnershipHelperValidation-r001.md](G2OwnershipHelperValidation-r001.md)，本轮没有缩减该范围或改变原合同。被审补丁仅修改`replaceCleanup`释放同key登记的流程，其他状态/错误/实例路径字节不变；原23-case runner与Design/Cases/Goal保持冻结摘要。

重算修复identity所有artifact引用均匹配；`preserved_inputs_sha256`逐项无漂移（包括并行组件候选及其harness）。三个admission按source/supplemental runner/evidence实际builder action/target重跑均通过。历史首轮报告仍保持`4beaf3df0dd0a61c58948afc19b16092375da524fa51c32409e9b5e38ecc0c8b`，不改写旧FAIL。全部本轮输出仅位于`/tmp/g2-ownership-helper-validator-r002/`。

## 原始RED、独立复演与新GREEN

| 检查 | 独立实际结果 |
|---|---|
| 旧source备份 | 原字节SHA=`d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`，与首轮被审源码一致 |
| 旧source补充回归RED独立重放 | 10执行 / 2通过 / 8断言失败 / 0执行错误；exit1，stderr0字节；10条case记录与原始RED逐对象完全相同 |
| 新source补充同identity GREEN | 10执行 / 10通过 / 0断言失败 / 0执行错误；exit0，stderr0字节；stdout与Builder原始GREEN逐字节相同 |
| 原冻结helper GREEN | 23执行 / 23通过 / 0断言失败 / 0执行错误；真实bundle/import新source，exit0，stderr0字节 |
| oracle self-test | 17负例拒绝、15正向控制及双stub控制通过，exit0；仅诊断，不是额外生产GREEN |
| ESLint / 严格单文件TypeScript noEmit | 独立重跑均exit0、无输出；不表示全项目类型检查通过 |

重放旧source时没有回写当前生产文件：把备份相同字节复制为`/tmp/.../before.ts`，诊断副本只重定位esbuild模块解析和source/root路径，fixtures、execute与oracle正文保持不变。副本自身runner hash与磁盘正式runner不同，故只把逐case与fixture identity进行对照，不伪称副本字节等于原runner。首次直接加载`.txt`备份时因esbuild未配置该扩展名loader得到1项执行错误、0案例执行；该尝试输出保留且未计RED，改用同字节`.ts`副本后取得上表真实断言级RED。

| 独立有效运行 | UTC开始 | UTC结束 |
|---|---|---|
| `new-supplement` | `2026-10-27T01:05:23.857134+00:00` | `2026-10-27T01:05:23.888375+00:00` |
| `green23` | `2026-10-27T01:05:23.888762+00:00` | `2026-10-27T01:05:23.920040+00:00` |
| `oracle` | `2026-10-27T01:05:23.920450+00:00` | `2026-10-27T01:05:23.946866+00:00` |
| `old-source-supplement-retry` | `2026-10-27T01:05:40.744178+00:00` | `2026-10-27T01:05:40.774915+00:00` |


| 冻结对象 | SHA-256 |
|---|---|
| 修复后helper | 7ff0a6d2ad931260241a4fc78970a99dc14f78c25bf71234f272a6fc837a90a2 |
| 原23-case runner | 0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f |
| 补充回归runner（原RED→GREEN不变） | 50f3c4788e10de38dde0af1896e8f1f250f2a500901e89e56246b9e98c74b999 |
| 补充10场景identity | 7e4dba72e57bb8d8b65cbd90df2224b52b6cf70ead227479a21b0b192ebbb8c0 |
| 新生产bundle | 8ece06cd8845b45b1edc022f4e77fb3ea14bc08668ba37329ee2792dbef2724b |
| 原始补充RED stdout | 7fe90a830b8b6a889538941893ab9a59e450892d63019bf1dc7b44ddf78966fe |
| 原始/独立补充GREEN stdout | afda9c4808bd40f67b9ed0e029571552eda9d6cd9e7138190ad357e4b5aaf72c |

## HV-001处置及同类残余

**G2OWN-HV-001 / P2 / CLOSED。** 新`replaceCleanup`在外层登记outer前循环读取同key当前登记，每次先删除该登记、运行并收集其错误，再重新读取。old清理回调登记的inner及inner再登记的deep均进入同一所有权释放链，不再被`Map.set`静默覆盖。若清理中关闭scope，清理结束后仍按原closed规则立即释放outer；dispose/destroy幂等逻辑不变。

| 冻结补充identity | 核查与独立结果 |
|---|---|
| HV001-001 | old→inner→outer→destroy；inner/outer各一次，原泄漏关闭 |
| HV001-002 | inner抛原Error，replace返回与唯一通知保留原引用；outer仍登记/释放 |
| HV001-003 | old→inner→deep两层重入；错误顺序[old,inner,deep]，没有丢项或中途停止 |
| HV001-004/005 | inner或old中dispose；sibling与destroy继续，outer在closed后立即清理，destroy一次 |
| HV001-006 | remove内登记inner的原正常控制仍通过 |
| HV001-007 | 其它key仍按outer→b→a→destroy逆序释放，无范围外顺序回归 |
| HV001-008 | inner与notify同时throw；返回[inner,notify]，只通知inner一次，不递归通知 |
| HV001-009 | 同一函数作为新登记生命周期可再清理一次；不是按函数对象去重丢登记 |
| HV001-010 | setup期间重入错误同时进入operation返回与ready.cleanupErrors，原错误引用一致 |

补充runner实际按位断言错误对象引用、数量和顺序，按完整事件与次数检查资源释放；非只检测字符串或读取Producer状态。RED与GREEN沿同一10个fixture身份，无expected交换。原23例仍使用已独立审查的逐通道oracle，当前实现没有case ID/fixture硬编码。

**新增发现：无新增合同内阻断。** 当前改动没有重写失败包装、current检查、terminal、dispose、remove、通知逻辑；已结合23原回归与10项定向场景检查同根影响。无限自我再登记的cleanup不保证终止属于调用方任意回调的执行边界，当前合同未承诺对无穷回调活动提供强制中止；不将这种未来硬化追加为本次blocker。

## 已检查域、未检查与声明上限

- 已检查：HV-001真实旧source回归、同identity新GREEN、已登记资源一次释放、多层重入、同函数新生命周期、错误原引用/顺序/数量、notify异常出口、setup期间错误累计、closed重入、其它key顺序、destroy幂等、原23身份与阶段/current/原错误包装、源码无case硬编码、精确准入/角色/历史字节保全。
- 未检查：真实SFC控制流、G2浏览器、完整MVP/保存重开、stage/query/Store、真实多用户权限。本轮只接受helper修复，组件/浏览器由各自独立lane验证；它们不能继承本报告为通过，也不反向成为helper阻塞。
- G2OWN-027返回句柄前partial allocation仍`OPEN / NOT_FIXED_BY_THIS_UNIT`；line missing/null/non-array的R013仍属组件兼容性验证。原10/26/16与权限`BLOCKED / NOT_RUN`保持。
- 本报告位于执行证据目录，不改canonical产品KB，不替代最终Dashboard吸收、全Goal post-closeout reconciliation或Loop Stop Gate。

## 后续准入与最终结论

当前无进一步helper修复要求，可把`7ff0a6d2...`作为returned-instance helper的有界通过版本。Orchestrator应将并行组件/浏览器最终Validation明确绑定该新摘要及本报告；旧`d31e...`候选输入保留为历史，不能混用为当前终态。后续任何helper修改均触发相应delta重核。

**本实现第2/3轮结论为有界通过，HV-001关闭；不需要第3轮重复审阅或重开Design。组件、浏览器、权限、完整MVP及Goal完成仍按其各自实际证据判断。**
