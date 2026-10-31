# 图片资源就绪设计独立审查 r002

本交付物第 **2/3** 轮，Session DE-EXEC-S038，design_semantic。复用首轮源码完整读取；本轮重读 r002 全部设计和 16 个 Cases 的修订，核对原 helper/候选准备语义。指定 lane_task_card validate 实际退出 0 / pass，expected digest `e1f5e4afd60de1c0656b361625f1a6219877e2fa768903bda7af15bec165984e`；Goal 与全部七项 base_context_refs 原始摘要逐项 MATCH，源码及旧 runner 未漂移。

## 两项独立裁决

- **Design Freeze Validity：PASS（本有界设计可冻结）**。首轮 F1–F3 已在设计和场景层关闭，未发现需阻断冻结的新问题。PASS 只裁定设计可作为后续实现输入，不证明算法已经落实、测试通过或真实图片就绪。
- **Implementation Entry Readiness：CONDITIONAL / WAITING_RED_AND_ADMISSION（产品写入等待可信 RED 与精确 admission）**。设计语义已满足进入后续阶梯的条件；当前未消费可信 RED，因此不能直接开启产品 Builder。独立测试准备与当前源码 RED 执行可继续，不以 RED 缺失反过来阻止测试准备。RED 必须执行成功、按预期业务指纹失败并绑定相同 case 身份，随后精确 admission 只允许候选准备与已授权测试范围。无需为等待 RED 再消耗一次设计审查轮次。

## 首轮发现核销及充分性检查

### F1：entry.url 与单次 DOM src 错位——设计层已关闭

r002 不再把一次 helper 成功当作资源终态证明。每轮取得 expectedSrc，patch 并等待同 root helper，随后再次转换；若首次扫描因 entry 已转成功或失败而 used 为空，重转换结果必然不同于旧占位，门仍关闭并进入下一轮。下一轮最终 URL 会匹配终态 entry，失败 entry 由真实 helper 拒绝，成功 entry 才能继续。

helper 命中 pending 后等待完成但 DOM 未重新 patch 的交错也同理：转换值变化触发重跑。最终仍要求实际 src、complete、naturalWidth 和 decode，避免 helper 的 decode filter 为空时被误当作浏览器图像解码完成。PIC-RR-01/02/03 已补扫描前后、占位事件和最终 load 先到门的调度。

### F2：clear/recreate、最终 src 与对象 identity——设计层已关闭

r002 选择局部稳定化而非固定两次 barrier。cache clear 后重转换创建新 entry 时，唯一占位值与本轮旧值不同，不会凭旧占位开门。若 clear 发生于 helper 已捕获 entry 之后，原 controller.aborted 会使 helper 失败；若发生于扫描前造成空匹配，则重转换比较负责识别变化。若进入最终 decode 后再 clear，decode 前后再次转换检测缓存重建并 fail closed。重建后已由别处加载完成且相同最终 URL 的情形不依赖旧占位；当前 helper/最终实际解码共同负责当前内容就绪。

sourceUrl、pictureImage、pictureRoot、binding 冻结；每个 await 后及 src 写入前检查 settled/alive/current、源不变、同对象且连接。最终解码前后复验原始 src 属性和重新转换值等于 expectedSrc，覆盖源改动、断连、节点替换和旧 decode 晚到。原始属性比较避免相对 URL 与 DOM 绝对 src 混比。PIC-RR-07/15/16 分别补身份过期、clear/recreate、decode 中 clear、src/source 变化与断连。

设计明确一个覆盖全过程的 10 秒 timer，各阶段不得续期；循环检查总 deadline，禁止无限微任务轮询。实现应使用绝对 deadline 复验，不能只依赖 timer 回调得到执行。helper 未决、decode 未决或晚到均须由已有 finish/settled 控制收束；不得以清除共享缓存或 abort 共享请求解决本候选取消。该要求已足够明确，实际 timer/cleanup 与 late 零写入由后续执行验证。

### F3：测试生产路径与调度 oracle——设计层已关闭

r002 维持 16 个 case ID，并明确实际 SFC + resourceImage + waitForResourceImages 路径；network/FileReader/DOM/load/decode 仍是显式替身。新增调度点能够区分扫描前后成功/失败、clear/recreate、最终 load 在门前、stale 与 decode 期 src 变化，不再只验证一个顺序成功路径。

旧 runner 的 data fixture 可显式 passthrough 资源端口，新 runner 必须真正接入生产 cache/helper；不能以 import 或缺 DOM API 异常冒充 RED，也不能让 helper 固定 resolved。新宿主需要忠实实现 src 属性、HTMLImageElement 匹配、root 查询、getComputedStyle 与 FileReader 调度，证明此点属于测试入口检查和后续 Validator 工作，设计审查不提前声称其已实现。

## 全部发现、已检查无问题维度与说明

本轮 **无新增阻断 finding**。一项非阻断阅读说明：Cases 的通用 oracle 使用“最终实际 src 相同并 decode 成功才 ready”，应按各 case 的 scenario/expected 适用；PIC-RR-12 的显式合法 empty 分支无需 image/decode，PIC-RR-13 保持 OFF 零 query。设计正文已明确这两个例外，不要求为该措辞重开冻结或增加一轮审查。测试作者应直接保留 empty 场景零图片断言，不能把通用描述变成强造图片。

已检查无新增问题：

- 范围和声明上限：38 项完整义务、49 类型、真实权限 BLOCKED/NOT_RUN 不变；设计 pass 不能提升 MVP/Goal 状态。
- 缓存隔离：不修改 resourceImages/resourceImageCache、不清共享 cache、不取消其他图资源；仅使用 pictureRoot，不扩至整个 canvas。无关 root 失败保留独立 case。
- 外链/data：不要求 cache entry，走最终真实 load/decode 与源检查，error 拒绝；相对源属性比较规则明确。
- empty/OFF/metadata：保持合法 empty、静态 first-image、零 query，以及 table-info→picture-group/custom 和 queried metadata 契约。
- 事件与生命周期：门关闭时 load 不报成功；开门主动检查 complete，防止漏事件；error/decode reject/timeout/dispose 均 finish，解绑监听、清 timer；晚到 helper/decode 不更新 src、不再次 resolve。
- 最小安全切片及阶梯：准备测试与可信 RED 可以先行，产品 Builder 等 RED/admission；GREEN 保持相同 frozen case 身份，之后独立 Validator 与真实 UI，不替代真实鉴权。

## 未检查项、同类残余与准入预测

未执行新旧 runner、浏览器、真实 HTTP/FileReader/图片解码或全仓测试，原因是当前卡仅设计语义审查，root 正独立推进 test-only 准备。未重新审计本切片以外 Goal 义务。无工具阻塞；本轮只写本报告，无源码、Cases 或其他台账修改。

同类残余：通用导出 helper 的显示 URL 匹配机制仍原样存在，未对所有导出调用者给运行安全结论；本设计只在候选图片准备局部补闭环。宿主替身通过仍不证明浏览器资源成功、真实鉴权或产品全部完成。设计描述的稳定化、超时和 cleanup 必须在实际实现及同身份 GREEN 中检查，不能用本报告替代。

后续准入预测：可信 RED 合格且精确 admission 绑定本设计、Cases、实际基线与写范围后，可进入最小产品实现；若 RED 暴露新的规格反例才考虑第 3/3 轮，普通执行失败先定位宿主或实现，不自动重开设计。保持原完整验收阶梯及声明上限。
