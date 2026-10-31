# 气泡与点几何候选修复方案最终设计审查

- reviewed_at：2026-10-29T09:13:02.020123+00:00；reviewer：`/root/resource_environment_reviewer`。
- 同一实际缺陷设计累计第 **3/3** 轮，本交付物设计预算已用完，不自动开启第4轮；C234及图片既有3/3不重开。
- snapshot：`S02-MVP-BUBBLE-MAP-READY-REVIEW-r003`；卡canonical SHA `dc5cc0431f269513b90ff6bbcf3b554ead7f004a47c929075b10547411cbacb7`。
- 接收端lane_task_card验证exit0/PASS；Goal+8个base refs共9项摘要全部一致，写报告前再次复验。生产两文件/shared ready/SFC仍为绑定原字节，没有实施新改动。

## 双裁决与准入含义

**Design Freeze Validity：PASS WITH FINDINGS（有明确保留项的设计通过）。Implementation Entry Readiness：PASS。Overall Verdict：PASS（仅此最小修复方案准入）。**

当前没有新增阻断发现。r003对r002的新清理路线明确撤回，并纠正了off语义；在addToScene后增加候选closed/current检查，关闭同步loaded失败后的新增副作用路径。前轮全部发现均已逐项给出解决方式或明确残余，不把残余写成已验收。

**下一入口允许构建并冻结新测试、取得可信RED；本设计PASS不等于可以直接修改生产。** 新测试的相应写入仍须消费自己的有效准入。生产Builder必须在真实语义测试合同/输入冻结、准确业务RED及独立所需确认成立后，以新的精确admission进入bubble-map.ts和point-fallback.ts候选分支。然后同测试SHA/同fixture GREEN、独立代码验证与真实UI证据；本报告没有预判这些结果。

## r001/r002全部发现的最终 disposition

| 项目 | 本轮处理 | 结论边界 |
|---|---|---|
| r001 B1：Dot挂载前destroy代理异常 | 删除errors(Dot)，仅注册Dot局部error与loaded；共享scene观察仍在view.loaded之前，不手工赋SDK.scene | 设计层关闭；真实库旧源RED与修后GREEN待执行 |
| r001 B2：plain emitter/add假模型 | 实际Map/Plot/LayerGroup方法及常量、实际EventEmitter或逐项等价断言；不人工emit Dot顶层add；准确区分挂载前异常与无add缺陷证据 | 设计层关闭；若执行中源码提取/编译失败必须报告execution error，不能凑RED |
| r001 N1：版本 | 明确l7plot0.5.11，peer l7版本不混同 | 关闭 |
| r001 N2：point同类路径 | 两生产候选文件；三受影响fixture为bubble polygon、bubble point、map point | 关闭；完整类型分母不减少 |
| r001 N3：共享scene清理 | 保留既有view.destroy与dot.destroy、双scene调用可能性和单项清理异常可见性不足 | **未修复残余**；不要求本最小事件修复同时重建生命周期框架，不声称exactly-once/GPU无泄漏 |
| r001 N4：error/destroy真实层级 | scene、Dot本地和layer代理分别说明；手动注入不当SDK自主事件证据 | 边界正确；真实所有错误传播仍未验 |
| r001 N5：legacy add/carousel | legacy不改，保留已知时序问题 | **未修复残余**，不能称所有气泡地图路径修好 |
| r001 N6：后置失败 | 同turn/microtask/metadata前检查保留，新增同步组合测试与返回后closed检查 | 本最小设计闭合；运行待证 |
| r002 R2-F01：removeFromScene异步拒绝 | 撤回新removeFromScene清理代码及完整部分失败恢复承诺 | **该拟引入风险不再进入本补丁**，不是修好了SDK；原生命周期AC继续待验 |
| r002 R2-F02：同步失败后继续安装资源 | 两路径在addToScene之后、剩余副作用之前`if (filterPaste && !filterPaste.check()) return` | 设计层关闭；必须用同步loaded+throw/error/cancel组合实测 |
| r002 R2-F03：off('*')误义/super失真 | 不新增off('*')；依赖ready的具名off；新测试绑定EventEmitter 0.1.3或等价断言 | 关闭事实错误；不再声称星号清全部 |
| r002 R2-N01/N02：未返回构造句柄/部分资源 | 仅声明已登记句柄尝试cleanup，不证明SDK内部未发布资源无泄漏 | 正确保留未知，不将未知当成功 |
| r002 R2-N03：缩放timer | 不改生产timer，测试仅受控超时/晚到不采用 | 正确保留，不能称实际30/31秒竞争已验证 |

## 已检查无问题维度

1. **同步控制流闭合。** ready.callback捕获mapRendered异常后fail会先closed并release；addToScene返回后的check会返回false并退出afterLoaded。外层view wait的done即便随后执行，也不能把已失败Promise变成成功。成功同步loaded仍有外层view pending，必要后续动作正常返回前不应提前resolve。
2. **副作用边界精确。** bubble-map.ts:265–271的labels在addToScene前已建立且已登记cleanup；新增检查不能倒推“此前没有标签”。本次要求是关闭之后不再新增keyboard/click等效果，之前标签按已有cleanup尝试释放。point-fallback.ts:328之后的labels、fitBounds、keyboard、click位于新增检查之后，失败应全部跳过。测试须分别断言，不能给bubble错误套用“labels创建总数0”。
3. **订阅与等待顺序。** Dot options-only无scene；局部error/loaded不触发scene代理；loaded订阅先于addToScene。view与scene既有订阅保持。Dot.loaded来自LayerGroup所有inited及initComponents完成，不降级为void addToScene或scene.loaded。
4. **最小写域。** bubble-map.ts与point-fallback.ts只修改候选订阅、mapRendered时点及closed退出；shared ready、SFC、legacy、依赖、旧fixture和旧runner不改。原两行限制已显式撤销，未通过测试通过或名称变化删减原AC。
5. **真实方法与替身分离。**新runner应保留实际Map/Plot options-only构造的无scene语义及事件方法、LayerGroup、EventEmitter来源；source/layer/scene/WebGL受控部分明确列出。主lane补充使用真实构造与事件方法是对r003“options-only无scene”合同的具体落实，不是扩大完成声明。
6. **可信RED/GREEN规则。** 原源在真实代理模型下挂载前订阅异常是准确业务失败；无add另给直接方法受控场景或静态合同证据，不将前一个异常冒充第二个运行复现。语法/导入/fixture不成立均是execution错误。新测试冻结后同身份跑两端，不能生产修后改expected凑GREEN。
7. **测试矩阵完整。** 三fixture均有正常异步、同步、callback失败、Dot/scene受控error、destroy、timeout、unmount、晚到与重复loaded、同turn/微任务/metadata前失败及dispose后重放；同步loaded+throw/error/cancel组合覆盖R2-F02。七地图基础回归保留。旧runner对虚假add监听的断言可能不再适用，须逐条标过时原因，不能整体把任意失败豁免或篡改冻结输出。
8. **边界与终态。** 原38项/49类型、真实权限、全生命周期AC均保留。撤回r002新清理承诺不等于从原用户目标删掉生命周期要求；只是本最小缺陷切片恢复正确边界。没有稳定产品KB更新或Goal收口，报告只进入执行证据。

## 全部保留发现、未检查原因与同类残余

**本轮阻断0；上述N3/N5、SDK自主错误/销毁传播、内部资源未知仍是真实未决，不因为设计通过而关闭。** 这批保留项已有明确文件和影响，不隐藏，也不据此继续扩大本轮修复。

- 共享scene destroy可能调用两次，当前SceneService正常路径有inited=false早退；只支持该源码事实，不保证异常路径绝对幂等。已登记句柄cleanup最多调用一次的测试不能替换GPU资源恰好释放一次。
- 事件取消只能阻断本方回调和addToScene返回后的副作用，不能承诺SDK方法体内部在关闭后自动停止。构造未返回句柄、内部未发布layer资源与cleanup失败可见性仍不在已证明范围。
- Bubble预先已创建的labels要检查cleanup尝试；不得用“关闭后无新labels”偷换为“无任何labels分配”。同理正常行为应继续完成必要label/fitBounds/keyboard/click设置。
- legacy顶层add与同步carousel仍未修；同类point候选纳入本修复并不扩大到所有legacy或所有renderer。
- 本lane未操作浏览器、未运行runner/SDK/GPU、未执行lint/构建或改代码。RED、GREEN、独立代码Validation和正常save-reopen均尚未观察。未检查真实权限、全49类型或最终KB/Dashboard/Goal收尾，原因是卡限定设计准入。

## 阅读及摘要核验

本轮完整读取r003与r002差异、前两轮报告、绑定源代码相关控制流及冻结输入，复用前两轮实际ESM/CJS/Vite入口与removeFromScene/SceneService/LayerService/BaseLayer/tooltip链阅读。对本轮关键依赖重新计算摘要：

| 依赖 | SHA-256 |
|---|---|
| l7plot/package.json | 4ef3ec6bf41b885e488b072898586166e03aaf56ac1ade344fa42a80cd14695c |
| l7plot/dist/esm/core/map/index.js | da0a7863213fecf155772e8fe6331668b483d8aa7165638b8a1f5ba196155074 |
| l7plot/dist/esm/core/plot/index.js | 8a58c1ad23e3f424b3c7de004bdc29e52099b40550610d961f9e3433156c244c |
| l7plot/dist/esm/core/map/constants.js | ab2de82a13f01630e6ec59f923c6540ab95ea49450acda7e9cbf1c93e10c1cc5 |
| l7plot/dist/esm/core/layer/layer-group.js | 6b48dd869a923dbdf6dbf6c550d663f8c8fef4d3417a9e13f4cf0a5619893070 |
| event-emitter/esm/index.js | 3b2677b236d36ad4b2bef367e78e6d57745f59deb892188cb57125c0388e0acd |

以上路径均相对core/core-frontend/node_modules。新runner冻结还须绑定实际用到的其余依赖与构造/方法来源，不拿本摘要表替代完整测试冻结。

## 后续准入预测

可以开始精确的新测试交付，冻结后先RED；当前方案无需第4轮设计审查。只有RED合同有效、执行成功且业务指纹正确，再按两生产文件精准admission实施。若RED仍显示新的实际运行问题，按其真实影响记录和路由，不把预算耗尽当作忽略缺陷的许可，也不换名字重开本设计第四轮。

同源测试GREEN与独立验证后继续中国省份气泡200→500、CSV三省、完整树即时相等、实际画面、明确保存点击与离开重开；点几何按合法fixture执行，双向source/target与失败旧态保持仍须各自证据。最终只按实际证据提升局部结果，未完成原AC继续pending。允许继续独立工作，不允许据本报告宣布MVP/Goal结束。
