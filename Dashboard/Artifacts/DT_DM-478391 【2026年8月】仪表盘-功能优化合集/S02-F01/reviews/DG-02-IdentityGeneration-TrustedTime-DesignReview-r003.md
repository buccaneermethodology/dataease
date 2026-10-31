# DG-02 候选 r004 独立增量语义审查 r003

## 双结论与范围

**Design Freeze Validity：NOT_READY（完整协议尚不能冻结）。Implementation Entry Readiness：BLOCKED（共享存储和产品 Builder 不准入）。**

r004 已实质补齐 Review r002 列举的场景类别，并修正权限版本与会话代际的措辞。可接受为进一步设计的候选输入；部分 oracle 尚未确定且真实 identity/fencing/time authority 仍 UNKNOWN，因此不认定完整测试合同已形成。真实权限保持 BLOCKED / NOT_RUN。Goal 10 项 AC、26 项 must-have、16 项产品义务与 Scope Delta none 不变；本报告不关闭任何 Goal AC，不宣称产品验收或 S10 就绪。

## 输入复验与方法

审查卡 `planning/dg-02-design-review-card-r003.json` canonical SHA-256 `653235895406a28d4b87d0080b7db75879222c774dfccf7b8de921de696ecc63` 已复验通过并读取 renderer 输出。Context Bootstrap `planning/ContextBootstrap-DG-02-IdentityGeneration-TrustedTime-DesignReview-r003.json` 校验通过，SHA-256 `4a7160c740bc810d00bcb7324451a089074e4d89334c0ff7015a719cdda0d466`。

候选 r004 SHA-256 `e3eafb37c88a1c4d92bbdb815da35d5ea8602cd54ed252ec472ab6361cf25ae6`；Review r002 SHA-256 `b8d967916e6d24e9539f3781e4b182e52a3028847b27dd8b847db90b98668a18`。按 delta 模式继承此前已读且摘要不变的 Goal、Design、DesignGaps、PermissionEnvironment、Entry Packet、四个源码、治理文件和两份 review；读取新候选及 topology r313，刷新原目标、authority、claim ceiling 与关键依赖。写前实算 required-read 16/16 及卡片全部直接绑定摘要一致，无源码/前置漂移。校验不等于语义或运行通过；未构建、安装、启动服务或执行产品测试。

## 遗留 finding 逐项 disposition

| 原 finding | 当前 disposition | 依据、影响与建议 |
| --- | --- | --- |
| DG02-R001-02 / P1 | **OPEN；措辞子问题已解决，协议阻断保留** | 生命周期第 2 项改为旧授权绑定载荷不可批准读取/提交，明确不预设 permission version 变化必然轮换 session generation，与第 1 项一致。ID-02/03/04 家族覆盖竞争、撤权和迟到响应，但签发/失效点、提交边界、排序与 fencing 仍未由真实契约定义；应获得契约后独立审查，不能用候选场景替代 authority。 |
| DG02-R001-03 / P1 | **OPEN；时间异常拆分已改善，协议阻断保留** | TIME-02A 从独立初态重跑并区别有效前跳；TIME-01A/B 区分纯数值边界和实际成功路径。freshness、误差、创建/到期绑定及刷新/休眠校验仍待真实来源，无法冻结可信 30 分钟。 |
| DG02-R001-04 / P2 | **PARTIALLY_ADDRESSED / OPEN；场景类别补齐，完整 oracle 未冻结** | 新增 11 行覆盖 r002 指定的类别；按操作 delta、保存状态及成功预览区分有明确进展。仍有下述确定性与表述缺口，不能称完整可运行 oracle 已齐备。 |

R001-01（缓存作用域）与 R001-05（包可读性/资格）维持 r002 的文档事实关闭，不重新打开。原五项中仍为 2 项关闭、3 项未关闭；此计数不代表产品 AC 状态。

## 场景逐项覆盖复核

| r002 遗留要求 | r004 对应 | 审查结果 |
| --- | --- | --- |
| U→V→U 不因缺指定机制而豁免 | ID-01A | 明确原载荷不可恢复，缺 authority 则 blocked；候选层可接受。 |
| 登出旧标签刷新、离线/休眠恢复 | ID-01B | 在线、离线、网络恢复独立运行，恢复重验；候选层可接受。 |
| 同会话 A/B 乱序和身份切换迟到 | ID-02A/B | 场景已覆盖；赢家规则仍条件化，不具备唯一预期。不得擅定 latest-intent-wins；需要冻结现有业务要求允许的顺序语义。 |
| 通知丢失/乱序、storage 故障 | ID-02C | 类别覆盖且故障独立；需在协议中明确失败复制保留此前有效载荷、部分写入及恢复可读状态，而不是只写 fail closed。 |
| prepare 后撤权及恢复 | ID-03A | 撤权 commit 拒绝、旧 prepare/P 不自动复活明确；恢复的新操作按新 authority 判断恰当。实际权限验证/提交边界未证。 |
| viewer、无数据权、组织/代理 | ID-03B | 身份与入口分别观测，真实服务端证据要求适当；尚未运行。 |
| TTL 读取与成功粘贴副作用分离 | TIME-01A/B | 读取不产生分析查询，拒绝不改目标，成功保留预览；时间不续期明确。成功次数仍写“需冻结合同定义”，未复用 Design 已有一次逻辑预览的候选约束。需区分逻辑预览次数和底层网络请求次数，不将后者强行设为一。 |
| 异常不互相污染、有效前跳 | TIME-02A | 独立新载荷/新会话重跑与样本可信性区分满足候选准备要求；具体判断依赖时间 authority。 |
| 登录/刷新迟到、重放与重复 commit | ID-04 | 已覆盖；拒绝或幂等结果及其副作用仍由真实契约决定，nonce/幂等键仅条件性观察，未强加新政策。 |

## R001-04 的具体剩余问题

以下沿用原 P2 finding，不增加新的产品义务。

1. **旧表与补充表并存的执行优先级不明确。** 原 TIME-02 仍写“依次注入”，新 TIME-02A 则要求独立初态；原 ID-01 保留机制条件式措辞，而 ID-01A 明确不可恢复。新节显然意在细化，但应明确旧五行仅概览、以新行执行细化为准，以免后续生成 Cases 采用旧顺序。影响是同一候选可导出两种测试初始化。
2. **成功与拒绝已分离，但计数对象仍需收敛。** 尾段把“提交调用 delta”列入所有拒绝观察，再写 delta=0 只用于拒绝；ID-03A 同时要求提交时真实 authority 拒绝。若“提交调用”包括被服务端拒绝的请求，则请求实际可能为 1，业务写入仍为 0。应区分授权/提交尝试、实际配置提交成功、分析查询及逻辑预览；零副作用不等于零鉴权请求。该处不能被执行为禁止请求而绕过服务端验证。
3. **若干 oracle 仍是待定规则。** ID-02A 赢家规则、ID-04 幂等结果与 TIME-01B 成功次数尚不能输出唯一预期；其中真实并发/重放规则归 R001-02，可信时间归 R001-03，不能要求无来源地自行补值。候选可保留显式 UNKNOWN，但不能以类别齐全宣布完整 oracle 已闭合。ID-02C 还应保留 Goal “复制失败保留上次有效树”的既有约束，避免 fail closed 被误解为无条件删除既有有效内容。

建议只处理上述明确文档歧义，并在 authority 可得时补协议；无需无限增加假想威胁或扩展产品范围。Disposition：OPEN，待有界修订与真实契约证据分别复核。

## 源码、truth carrier 与误读边界

r004 源码观察与 r003 相同，沿用已核事实：默认 localStorage、user.* 路径前缀、当前 Pinia 不自动同步；图片 listener 是懒初始化图片失效机制；logout 有服务端地址跳转但目的端撤销行为未证。没有把四文件未见协议推成全仓库不存在。pure-guards.ts 未进入此读集，本审查不独立验证其实现，只保留数值比较不等于可信时间的限制。

Entry Packet 存在且 S02/F01 CONDITIONAL，没有新真实权限环境或授权模块证据。topology r313 是本次候选产生与待审查记录，不是产品运行凭证。候选正文仍指向旧 r002 admission/r307，不能据此认定 r004 写入或未来 Builder 准入；本报告未对这些旧链接作有效 admission 背书。

“11 行补充场景”仅表示候选覆盖范围改善；“独立初态”不表示已执行；“权限维度区分正确”不表示真实权限契约存在；“拒绝零副作用”不能压缩为零鉴权请求；“review 已完成”不等于冻结或产品通过。设计仍留在执行面，不上升为 canonical 产品事实。

下一步为修正文档歧义、获取 identity/permission/fencing/time 来源并重基线，继而独立冻结协议与可执行 Cases；未知 authority 未解除前不准入共享存储或产品 Builder。已存在的用户授权不需重复询问，但不能代替技术证据。仅写本审查报告，未改候选、Goal、Cases、DesignGaps 或产品源码。
