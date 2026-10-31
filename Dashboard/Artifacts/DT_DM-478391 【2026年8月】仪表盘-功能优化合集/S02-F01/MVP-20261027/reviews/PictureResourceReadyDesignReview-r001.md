# 图片资源就绪设计独立审查 r001

本交付物第 **1/3** 轮，角色 design_semantic，Session DE-EXEC-S038。仅审查本有界设计；未修改源码、冻结 Design/Cases、共享缓存或其他台账。卡 expected digest `8ae558f6569d303294dcbbcea748cd0a6862bed05ee96767d419b1309dcc3626`，指定 lane_task_card validate 实际退出 0 / pass；Goal 与全部八项 base_context_refs 原始 SHA-256 逐项复验 MATCH。

## 两项独立裁决

- **Design Freeze Validity：REQUEST_CHANGES（当前设计不宜按原文冻结为实现依据）**。范围、声明上限和修改排除正确，但单次 helper 的成功不是“绑定资源已终态”的证明；原文开 resourceReady 的时点可放行失败占位。需补齐下面 F1–F3 的交错与 oracle。
- **Implementation Entry Readiness：BLOCKED_FOR_PRODUCT_CODE（产品实现暂不准入）；TEST_PREPARATION_ALLOWED（测试准备可推进）**。允许独立测试作者依据本报告准备聚焦宿主、生产 cache/helper 接入与当前源码的可信 RED，不要求先有 GREEN 或产品修复。测试准备不等于允许 Builder 改冻结 Cases；有权角色先修订并冻结设计/交错 oracle，再绑定 RED 和精确 admission。缺 RED 仅阻断产品 Builder，不循环阻断写 RED。

## 全部发现与最小修订

### F1 / P1：单次 helper 的空匹配可吞掉成功或失败终态

位置：resourceImageCache.ts:92–114；设计“helper 成功后重新转换，再于第二次 patch 前设置 resourceReady”。helper 先 await nextTick，再以当前 entry.url 对 DOM src 精确匹配。候选 src 是一次性字符串 ref，不订阅 entry.url。

可执行反例：先把 pending 占位 P patch 到 img；FileReader 成功或网络失败令 entry.url 变成终态 U/F；helper 恰随后扫描，P 不等于 U/F，used 为空；Promise.all([]) 成功，也不检查 failed。设计再转换取 F 并开门，失败 SVG 仍可 complete / naturalWidth>0 / decode 成功，误报 ready。成功交错也会跳过 helper 的资源/图像等待，不能把该 Promise 成功直接解释为真正资源就绪。若 helper 扫描命中了 P，await ready 后 entry.url 已变，而 DOM 仍是 P，则其 decode filter 同样为空；helper 本身没有完成最终 src 的 decode 保证。

最小修订：helper 成功后转换、patch 最终 src，门继续关闭，再执行同一候选 root 的第二 barrier；之后才开启最终 load/decode 路径。两个 barrier 均用生产实现，不能以固定 resolved stub 代替。补终态失败和终态成功恰发生在 patch/扫描之间的可控交错测试。不得识别 24px、SVG 外形或特定 data URL 前缀来替代资源状态。

### F2 / P1：两次 barrier 只在同一资源世代稳定时充分；必须绑定源与最终 decode 后复验

两次 barrier 对“同一缓存 entry、同一 source、无清理重建”的交错是足够的：首次命中则等终态，首次漏匹配则 entry 已终态，重新取 URL 后第二次扫描必能检查 failed/aborted。它不应无条件写成通用充分条件。

反例边界：首次 barrier 后 cache 被 clear，第二次 imgUrlTrans 创建新 pending entry；第二 barrier 命中 P2，等它变 U2，但 DOM 仍是 P2。若此时直接开门并解码，仍可解码占位。clear 也可能发生在第二扫描前，使 used 再次为空。resourceImages.ts 会在身份 watch、pagehide/hashchange/popstate/storage 等事件清 cache，范围大于单一请求是否仍 current；仅口头依赖 isCurrent 不能证明每个事件均被覆盖。此为设计充分性缺口，不宣称浏览器已复现。

最小可执行方案可二选一：

1. 冻结本次 sourceUrl、候选 img/root 对象与绑定 identity；设计明确并由测试证明，所有可能清理/重建缓存的生命周期变化都会使本次候选失效并 fail closed。在这个前提下采用两次 barrier。
2. 不依赖该未证前提：在原 10 秒总期限内重复“转换并 patch → 同 root helper → 再转换比较”，仅在 helper 成功且转换值仍与本轮 patch 的值一致时进入最终 decode；值变化则重新 patch / barrier，绝不先开门。每轮和每次 await 后检查 settled/alive/current、源未变化与 img/root 同一性。该局部稳定化无需修改共享缓存。需证明 cache 清理窗口被 current 检查或稳定性检查覆盖；不允许无限轮询。

最终 load/decode 必须绑定最终 expectedSrc；解码前、解码后均检查实际 src、连接、complete、naturalWidth、alive/current 及同一 image。外链相对 URL 注意 DOM img.src 绝对化，应采用一致的规范化比较（或同时检查原始 src 属性和规范化值）；不要将合法外链错判。门开启后再主动检查已 complete 的最终图，防止最终 load 在门关闭时已到达导致漏唤醒。load/error 的晚到事件只能促使对当前最终 src 的检查，不能直接令旧资源成功。

### F3 / P2：现有替身及 Cases 需明确交错 oracle，不能把原 runner 四组通过当资源回归

check.mjs 的 imgUrlTrans 是 value=>value，未执行生产 resourceImageCache；宿主没有真实 DOM src/getComputedStyle/querySelectorAll/HTMLImageElement 语义。引入真实 helper 后，原 runner 如未经适配会抛异常或不覆盖资源分支。当前 16 个 case 是合理场景目录，但 PIC-RR-02/03/15/16 没有明确 F1/F2 的调度点；笼统“成功”“失败”不足以防止替身把竞态遮掉。

建议保持 case ID，由获授权的设计/测试角色补实例：pending placeholder load+decode、成功/失败分别发生于首次扫描前和首次扫描后、最终 patch 前后的 load/error、第二 barrier 前 clear/recreate、第二 barrier 后/最终 decode 中 clear 或 stale、最终 src 在 decode 中变化。用可控 deferred load 与 FileReader 完成点，记录 used 为空时不得成功的输出，不 mock helper 成功；接入实际 cache 与实际 helper。图片 host 应实现 src 规范化、root 选择和完整监听解绑统计，明确仍是宿主替身。

原 runner 可为外部 data fixture 使用显式资源端口 passthrough，同时新增 runner 执行生产 helper；两者能力与声明要分别标明。可信 RED 应保证编译/执行成功后命中预期业务断言失败，不能把缺 DOM API/import 错误当 RED；GREEN 复用同一 case 身份。生产缓存的 Blob 类型、一次瞬态重试、失败 entry、abort 语义应保留。

## 已检查且未见新增设计问题的维度

- authority 与边界：AC-MVP-F01-10 / MVP-UI-10-PICTURE 有明确归属，原 38 项义务及 49 类型分母保持；RuntimeEntryBoundary 仅证明局部 DEV 查询/绑定，明确真实图片未通过。未将 277 明细偷换成 6761 汇总。
- 修改范围：局部 Component 候选准备与聚焦测试是可行最小切片；不需要修改 resourceImages/resourceImageCache、认证、上传、后端或普通展示，不得取消其他图的共享加载。缓存 helper 的通用导出路径同类风险保留为后续候选，不能顺带修复。
- 无关 root：helper 遍历的是传入 root 及其子孙，只要传 pictureRoot 且不扩成整个 canvas，无关失败 entry 不应阻塞；唯一占位 sequence 有助于 pending entry 区分，仍需同 root 测试。
- 外链/data：authenticatedImageUrl 对非 static-resource 返回原值，helper 无匹配是正常情况；最终真实 load/decode 与 src identity 检查负责就绪，不能要求这些 URL 必须有 cache entry。
- empty/OFF：showUrl 为空继续合法 empty 分支，不强造 img、不等待 helper；OFF 沿 first-image / zero-query 规则。不要改 queried metadata 或 table-info→picture-group/custom 适配。
- timeout、取消与 late：原函数 finish 幂等、解绑 load/error、清 timer、卸载调用 cancel 的骨架可复用。新 helper 每个分支必须 catch，且所有异步 continuation 在写 src 前检查 settled/alive/current；保持一个涵盖资源、patch、两次或多次 barrier 与最终 decode 的 10 秒总 timer，不给每个阶段重置 10 秒。不 dispose/abort 共享 cache；handle.dispose 与 unmount 重复调用不产生第二次提交。设计已提出这些要求，尚待实现和执行证据。
- 失败语义：保留 paste_render_failed / paste_stale 的既有语义即可，未发现需要新错误模型或扩大持久化契约的依据。

## 未检查、同类残余及证据上限

本轮已静态读取全部卡绑定代码、Design/Cases、bootstrap 与 RuntimeEntryBoundary，并抽核 Goal 中本 AC、完整分母及完成谓词；非本切片的 Goal 全部义务未重新审计。额外只读 imgUtils.ts 确认 imgUrlTrans 调用链与 helper 导出调用方。git status 已确认工作区存在大量既有修改，本轮不触碰。

未运行浏览器、真实 HTTP、真实 FileReader/图片解码、全仓测试或旧 runner；本轮无新运行时通过声明。父任务告知旧 runner 四组通过属父任务证据，本报告仅静态说明该 runner 缺少生产缓存覆盖，不冒充本人复跑。真实权限、地图、保存离开重开以及全 MVP/Goal 验收均未检查，原因是超出此有界设计卡。未遇工具阻塞。

同类残余：通用导出 helper 同样以显示 URL 识别 entry，依赖反应式 DOM 随 entry 更新；本轮不裁决其所有调用者是否受影响、不改共享缓存，也不把本地候选修复泛化为通用缓存安全通过。即使修复本切片，真实图片是否可成功获取和浏览器可解码仍需后续实际验证。

## 修复后准入预测与下一步

F1 补第二 barrier，F2 明确源冻结、cache 清理失效策略及最终 src/decode 复验，F3 补调度 oracle 后，预计设计可在既定第 2/3 轮以 delta 检查收敛；这是预测，非预先 pass。可立即准备测试，不得因当前产品 Builder 被阻断而阻止 RED。完整顺序：有权角色修订设计/冻结场景 → 执行当前源码可信 RED → 精确 Builder admission → 只改候选准备 → 同身份 GREEN + 旧 picture/paste 回归与定向 lint → 独立 Validator → 真实 UI 图片与保存重开。该顺序不删减原 Goal 义务，不重开已耗尽的其他交付物审查。
