# DG-02 身份代际与可信时间设计候选 r001

状态：`candidate / NOT_REVIEWED / NOT_FROZEN`。本文件记录当前可读源码及设计约束，用于后续独立审查；不选择缺少证据的身份代际 authority 或可信时钟方案，也不授予实现准入。

## 本次源码观察

- `core/core-frontend/src/store/modules/user.ts` 将 token、uid、oid、proxyInfo 等写入 `wsCache`；`setUid` 只写本标签缓存和 Pinia state。`clear()` 清理用户键并清理平台绑定、图片缓存，但源码没有本功能专用的身份 generation 字段或跨标签剪贴内容失效协议。
- `core/core-frontend/src/utils/logout.ts` 调用 user/permission/interactive Store 清理、reset 和路由处理；可作为当前标签登出入口证据。它没有证明服务端撤销、其他标签失效先后、旧标签并发写入阻断或用户切换时旧 payload 不可复活。
- `core/core-frontend/src/utils/resourceImages.ts` 有 `storage` listener，身份相关键变化时清理图片缓存；该用途仅为图片缓存，不是 S02 剪贴载荷的 authority。当前只读搜索未发现专用 `BroadcastChannel` 或 S02 跨标签 generation 实现。
- `core/core-frontend/src/hooks/web/useCache.ts` 使用浏览器缓存封装；当前静态证据不能据此推导浏览器锁、CAS、顺序一致性或可靠的身份撤销。
- `pure-guards.ts:isTtlValid` 是两个数值输入间的有限 TTL 比较器。它不提供服务器时间、单调时钟、签名到期凭据或回拨检测；运行通过也不能证明时钟可信。

以上是当前工作树源码定位，不等于完整认证契约或运行期行为。S01 F01 Entry Packet `NOT_AVAILABLE / CONDITIONAL`，且权限实现仓库/隔离环境当前不可用；本轮未读取专有 XPack，不以 standalone/admin 替代。

## 候选生命周期约束

1. 复制内容必须绑定可验证的当前登录会话代际；仅比较 uid 不足以区分 U→V→U，也不能阻止并发旧标签复活旧内容。
2. 登出、账号切换、组织/代理上下文变化或权限撤销必须使旧代际不可用；跨标签通知只能触发重新读取/清理，不能自身作为授权凭证。
3. 刷新与读取不得延长创建时长；TTL 比较的输入必须来自同一冻结 authority，异常值、未来创建值、时钟不可用或身份 authority 不可验证时 fail closed。
4. 浏览器 Date/本地持久化时间不能单独证明可信时间或抵抗回拨；任何“服务端会话代际”“服务端时间/到期凭据”方案均需先由真实权限模块/API 契约证实。
5. U→V→U、旧标签延迟事件、登出后刷新、撤权后仍打开标签、并发旧标签写入以及时间回拨/跳前、休眠恢复、刷新后过期边界都必须进入后续真实身份环境的验证矩阵；当前均未运行。

## 未决 authority 与准入条件

| 问题 | 当前状态 | 进入实现前需要的证据 |
|---|---|---|
| 身份 generation 的签发者与撤销语义 | `UNKNOWN` | S01 Entry Packet；真实权限模块中的登录、组织切换、代理、登出、撤权语义；服务端可验证的代际/会话 authority |
| 跨标签一致性与旧标签 fencing | `UNKNOWN` | 真实多标签浏览器试验，证明通知丢失/乱序和旧标签竞争不会恢复失效内容 |
| 可信 TTL 时间来源 | `UNKNOWN` | 实际后端/API 能力、异常/回拨模型、到期凭据或等价服务端证据；不能仅用客户端 Date |
| 延迟响应、重试和恢复策略 | `UNKNOWN` | 与真实登录会话生命周期绑定的失败/重放验证及独立设计审查 |

当前只允许继续设计和准备测试；不得把上述候选约束改写成已存在的服务能力或实现合同。真实多用户权限以及只读用户禁止查看/复制/粘贴、撤权/恢复仍为 `BLOCKED / NOT_RUN`。

## 追溯、范围与下一步

输入及预执行边界见 [Context Bootstrap](planning/ContextBootstrap-DG-02-IdentityGeneration-TrustedTime-Design-r001.json)、[Execution Admission](planning/execution-admission-DG-02-design-r001.json) 与 [Topology r307](planning/Topology-actual-r307.json)。本 candidate 对应 `DesignGaps.json` 的 DG-02，不修改 Goal、冻结合同、Cases 或产品代码。

Goal 分母维持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`。本文件不关闭任何 AC；S01 F01 保持 `CONDITIONAL`，真实权限环境保持 `BLOCKED / NOT_RUN`。下一步为独立设计审查；收到授权模块或隔离实例后必须重基线并读取真实会话实现，再决定是否可冻结。
