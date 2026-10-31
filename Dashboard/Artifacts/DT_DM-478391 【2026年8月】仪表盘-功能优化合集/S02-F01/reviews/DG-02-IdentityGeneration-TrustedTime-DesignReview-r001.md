# DG-02 身份代际与可信时间独立语义审查 r001

## 结论与边界

- Design Freeze Validity：**NOT_READY（完整协议尚不具备冻结条件）**。候选作为风险与约束清单可有限接受，但须更正源码措辞；并非完整可执行设计。
- Implementation Entry Readiness：**BLOCKED（共享存储与产品 Builder 不准入）**。generation、撤销、并发隔离及可信时间 authority 均未绑定；真实权限验证保持 BLOCKED / NOT_RUN。
- 本审查不关闭 DG-02、任何 Goal AC 或产品义务，不修改候选、合同、状态账本及源码。Scope Delta：none。10 项 Goal AC、26 项 must-have、16 项产品义务完整保留。

## 审查对象与证据

任务卡 `planning/dg-02-design-review-card-r001.json`，canonical SHA-256 `ddf0176c9554ad3214ed104ab7519e7476d9f23aba353d6c2e5f4cb70832f9bf`；已复验卡片并读取 rendered prompt。Context Bootstrap `planning/ContextBootstrap-DG-02-IdentityGeneration-TrustedTime-DesignReview-r001.json`，SHA-256 `9aee2beb6285580ec912f7a4ec738ebd6a2cceeb69c2b831f7b9f66317a60e3f`；校验通过，写报告前再次实算全部 12 项 required-read 摘要一致。读集及摘要以该 packet 为可追溯清单。另按 Skill 路由读取 semantic-review recipe。

审查候选 `DG-02-IdentityGeneration-TrustedTime-Design-candidate-r001.md`，SHA-256 `03711b5b3b533c042e8f330872e1db61081d9e30fb6c6dfa09759902eea5399b`。独立审查仅基于绑定设计材料与四个前端源码文件，未访问真实权限模块或运行环境。摘要通过仅证明输入一致，不证明语义或运行行为通过。

## 源码事实复核

| 证据位置（仓库相对路径） | 已确认事实与上限 |
| --- | --- |
| `core/core-frontend/src/hooks/web/useCache.ts:6–22`；`core/core-frontend/src/store/modules/user.ts:8,106–109` | 默认缓存为 localStorage；user 键按页面路径前缀分区。setUid 更新当前 Pinia 与共享浏览器存储，缓存不是标签独占。 |
| `core/core-frontend/src/store/modules/user.ts:70–125,136–141` | userInfo、token/exp/time/uid/oid/proxyInfo 写入可见；clear 删除用户键和绑定/图片缓存。clear 自身不等于 Pinia reset。未见该文件定义 S02 generation；不能据此断言全仓库不存在。 |
| `core/core-frontend/src/utils/logout.ts:12–23,30–59` | clear 和 reset、路由清理存在；OIDC/CAS/自定义登出地址跳转亦存在。跳转不证明其目的端撤销契约，但不能说没有服务端登出路径。 |
| `core/core-frontend/src/utils/resourceImages.ts:10–49` | 身份 watch 与 storage listener 用于清图片；initialize 在相关图片路径懒初始化，不能假定所有标签启动即注册。不是用户 Pinia 同步或 S02 payload fencing。 |
| `core/core-frontend/src/hooks/web/useCache.ts:24–45` | 缓存方法包装不能证明 CAS、锁、撤销线性化或可信时钟。 |

候选对 `pure-guards.ts:isTtlValid` 的陈述不在本次源码读集中，未独立核该函数；仅依据 Design/DesignGaps 接受“有限数值 TTL 子合同不等于可信时间”的边界。候选的 BroadcastChannel 搜索结果未由本审查复做全仓库搜索，不升格为全仓库不存在证明。

## Findings

### DG02-R001-01 — P2：缓存作用域描述不准确

- 依据：候选“本次源码观察”称 setUid“只写本标签缓存”；上述 useCache 默认 localStorage 与 user.ts 调用直接反证。
- 影响：将共享持久化与本标签内存混淆，可能错误建立跨标签一致性假设。
- 建议：更正为调用发生于当前标签、Pinia 属当前实例、默认写入同源且按路径前缀分区的 localStorage；通知、内存同步及撤销保证仍未知。
- Disposition：**OPEN / correction required**；本审查不修改候选。

### DG02-R001-02 — P1：身份及并发协议 authority 未决，不能冻结

- 依据：候选“未决 authority”四行、Design 第 4/6/7 项、DesignGaps DG-02。
- 影响：仅要求 generation 与通知不足以判定旧 writer、迟到响应、prepare/commit 间撤权能否恢复或应用旧载荷。
- 建议：先绑定真实会话契约，再明确 generation 的粒度与签发/失效点、验证入口、旧 writer fencing 的等价保证、响应绑定与重试规则。明确会话代际和权限版本的区别；不能把“每次重验实际授权”擅改为“任何权限变化必须全会话换代”的新政策。
- Disposition：**OPEN / freeze and implementation blocker**。候选已诚实列 UNKNOWN；此 finding 是未决设计阻断，并非证明产品缺陷或不存在对应服务。

### DG02-R001-03 — P1：可信时间尚无可检验协议

- 依据：候选 TTL authority UNKNOWN；Design GR-03 明确客户端 Date 不足；DG-04 仅有限比较边界。
- 影响：无法判断时间样本有效性、刷新/休眠后过期、回拨或迟到时间响应；数值比较成功不能证明真实 30 分钟失效。
- 建议：绑定时间来源、创建/到期值与会话的关系、样本 freshness 和误差/延迟处理、异常与恢复规则；使用已有限审查的 1799999/1800000/1800001 数值边界，同时区分实际时间取值协议。不可将本地持久化 Date 或 user.time/exp 存在直接升格可信 authority。
- Disposition：**OPEN / freeze and implementation blocker**；不指定未经证实的新增服务实现。

### DG02-R001-04 — P2：反例清单尚不足以成为验收用例

- 依据：候选生命周期第 5 项只有场景名；未绑定初态、顺序、预期及观察点。
- 影响：不能确定并发场景证据是否覆盖原失效语义，也不能用测试标题或 mock 通过解除准入。
- 建议：按下表补齐时序、authority 返回与目标/查询副作用 oracle，再独立预审。
- Disposition：**OPEN / test-contract preparation required**，与 R001-02/03 一起阻断完整冻结。

### DG02-R001-05 — P2：Entry Packet 可读性与资格状态混写

- 依据：候选写 `NOT_AVAILABLE / CONDITIONAL`，末尾及 topology 保留 CONDITIONAL；当前读集未包含实际 Entry Packet。
- 影响：一行状态容易被误读为包不存在、已绑定或条件已满足。
- 建议：分别记录“本读集未绑定可复核包”和“S01 F01 资格 CONDITIONAL，条件尚须逐条核实”；取得来源后重基线。不得由旧通知推定 S01 已终态。
- Disposition：**OPEN / clarification required**；不自行修改 S01 状态。

## 反例覆盖及后续 oracle

以下均为待形成协议/运行证据，不是已执行测试。

| 反例 | 必须明确的可观察结果 |
| --- | --- |
| U→V→U；登出后旧标签刷新/恢复 | 旧 payload 不可恢复；身份验证失败不改变目标、不触发新过滤查询。 |
| A/B 复制竞争；登出或新复制后旧 writer 晚到 | 明确合法新写入次序，旧 generation 不得覆盖并复活失效内容；失败复制按原合同保留此前有效内容。 |
| 通知丢失/乱序；storage 不可用；离线标签恢复 | 通知不是凭证；使用前重验 authoritative 状态，不能取本标签旧缓存绕过。 |
| prepare 后、确认/commit 前撤权；撤权后恢复 | 当前授权重新校验；拒绝时目标、预览、持久态保持且无成功提示；恢复权限不自动复活旧 payload。 |
| 登录/刷新/时间响应晚到；重试与重放 | 响应绑定正确会话/操作，旧响应不能覆盖新身份或为旧内容续期。 |
| 回拨、跳前、未来时间、非有限值、休眠、刷新 | 绑定真实时间 authority 的 oracle；异常 fail closed，读/粘贴/刷新不重置创建时间。 |
| 30 分钟边界及重复使用 | 同一不可变创建/到期依据；1799999/1800000/1800001 的纯比较与真实计时分别验证，重复合法使用不消耗、不续期。 |
| viewer、无数据权、目标编辑权撤销 | 真实身份拒绝路径及配置不可见；standalone/admin/mock 不作为权限证明。 |

## 演进与误读检查

truth carrier 仍是候选执行设计，不能写入 canonical KB 当作稳定产品契约。最小安全下一步是修正候选事实、补齐场景 oracle，以及获得授权模块/API 后独立核实 authority；不是启动共享存储 Builder。进入实现的阶梯为来源绑定与重基线 → 协议及用例独立预审 → 有界冻结与有效 admission → 实现及独立运行验证。下一轮应分别处理身份/撤销与时间契约，最终必须联检二者绑定。

“设计已审查”只表示本报告存在；“有限比较已通过”不表示可信 TTL；“有 storage listener”不表示跨标签身份同步；“CONDITIONAL”不表示进入条件已满足；“候选可有限接受”不表示 ready/frozen/implemented/accepted。不得用单行完成状态压缩掉这些区别。

本报告不宣称 F01 实现有效、不宣称 S10 进入就绪、不宣称完整 Goal 完成；真实权限及产品行为仍未验证。未改变原范围、收益目标、既有合同或产品源码。后续候选/authority/源码改变须重基线；报告中的建议不构成新增业务政策或自动实施授权。
