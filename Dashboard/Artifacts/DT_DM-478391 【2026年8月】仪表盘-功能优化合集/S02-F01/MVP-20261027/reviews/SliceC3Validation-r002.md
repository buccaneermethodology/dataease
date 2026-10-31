# C3 富文本独立增量验证 r002

**结论：PASS_WITH_BOUNDS（有界通过）。** C3V-001、002、003在本次局部范围关闭；C3V-004确认为首轮错误probe前提，状态为 **retracted_false_positive（撤销误报）**，不记“已修复”。本C3实现累计第 **2/3轮**；未发现新的当前模块阻断。允许继续真实TinyMCE/后端/保存验证，不代表这些运行层已通过，不关闭22项/49类型或原Goal。

- reviewed_at：2026-10-27T08:03:38.105561+00:00
- reviewer：`/root/chart_preview_state_trace`，首轮C3独立审阅者；未编写C3 SFC/runner/本修复。原作者R，修复Builder为`/root/line_construction_builder`。
- snapshot_id：`S02-MVP-C3-INDEPENDENT-DELTA-r002-agent`；as_of_state：Topology r463及下述当前固定字节。
- 卡片 canonical SHA：`0e181750c8c9176632b00dd98ef0fef08c9a3268b2d09655a64fbe7e84f0f592`；实际card/context验证exit0，14项required-read原字节SHA匹配，落报告前再次重算一致。
- 独立性边界：本reviewer是C4和DEV观测作者，不独立验收这两项。对wrapper只读取C3调用前提/metadata读取顺序与实际active回调，不将之升格为C4/DEV验证。
- 唯一写入为本报告；没有修源码/runner、改冻结输入/旧报告、安装、启动服务、DB、暂存或提交。

## 原始目标与本轮范围

原目标仍为开发权限测试桩下全部支持图表基本多条件复制粘贴、真实查询与正常保存重开；当前22项、15主ID、49内建type和迁出责任保持，Scope Delta: none。本轮只核C3有效三个局部finding的修复、同类残余与V004撤销。已读完整生产delta、原独立首轮附录A/B、当前1002行runner/README、修复报告/写前manifest、原Goal/Design/Cases/fixture/第三轮review、共享接口与阶段对账；没有把本轮GREEN代替原始完整MVP验收。

## 全部发现与处置

### C3V-001 / P1：关闭，准备成功交付与metadata采用门均复查已知失败

实际diff增加assertEditor/assertContent：取得Editor、内容事件nextTick、内容Promise完成、外层race完成和metadata getter分别核current、richAlive、editorFailure、当前Editor身份、两层initialized、body连接/尺寸与getContent/body内容。Error空payload会转成非空failure，不再被truthy判断略过。

独立重放：两个fixture×Error/remove×2/3/4微任务12项、四个prepare返回后metadata读取案全部通过。2/3微任务错误在prepare返回前拒绝；更晚的已fulfilled Promise不可撤销，若已取得handle，metadata getter须拒绝已失效Editor，现4微任务和四handle案均兑现该门。没有把“getter拒绝”伪写成“Promise已返回false”。

额外独立health probe从真实当前scenario/完整SFC执行：健康对照metadata可读；Error无payload、body断开、零尺寸、body内容变化、仅getContent变化、candidate操作stale、editor.initialized=false七轴各自使metadata抛错。所有probe额外setContent=0、query=0。未同时改变多轴来掩盖缺guard。

静态C3接口检查：实际wrapper在任何canonical/Store同步发布之前读取`ready.handle.metadata`，getter异常走既有catch/finally；字段metadata固定clone，不为校验再query/setContent。此处只证明C3所依赖的实际调用前提，不冒称完整wrapper+Tiny真实浏览器已经运行。

同类残余：任意SDK错误、断开或内容变化之后必须保留候选失败条件至同步采用门；本轮检过上述有限轴。采用后的任意普通query乱序、供应商内部资源不是本finding的关闭范围。

### C3V-002 / P2：关闭，具体Editor归属清理与延后body存活核验成立

实际diff将documentCleanups改为按Editor的Map；setup替换前、remove和组件dispose/unmount清其已知listeners/clone。editorInteractive要求当前Editor身份、初始化、无已知failure、active phase与组件存活；mousedown/ObjectSelected的nextTick在执行时重检。ObjectResized即时回调也核owner。clone释放恢复原display值。setEdit捕获Editor、reShow版本/存活检查和cursor延后同Editor/body连接检查只作用当前局部生命周期。

独立重放五项通过：真实双击→reShow重建后保持doc监听3个，已取下旧handler即使手动调用也不克隆；mousedown/ObjectSelected已排队后dispose不改手柄/resize；Editor remove后的queued工作停止；已建clone在dispose清除并恢复原display。没有Vue执行错误。

额外旧引用探针：重建新Editor并init后，再向旧Editor发迟到init/Error/remove，新Editor未remove、doc监听仍3，一次mousedown只1次clone，Vue错误=[]。首轮两类直接反例因当前修复消失。

同类残余：本结论是当前Editor/本组件的已知listeners、clone与延后body，不证明Tiny供应商全部内部监听、所有跨组件编辑交互或应用级资源治理。旧legacy原有文档监听弱点没有被伪称全部由本次新引入；这里只关闭本次局部归属/存活义务。

### C3V-003 / P2：关闭，可见空白保留，忽略范围收缩

实际完整normalizer initializer由AST提取运行，未重写规则。新增inline ASCII空格、NBSP、pre空格三负例均判不等；根层标准block间ASCII缩进正例判等。当前仅根层两个无inline display覆盖的标准block之间ASCII空白可略过；不递归清理正文，不再把“甲 乙”和“甲乙”归一成同一文本。

当前谓词专用host补了真实HTML树接口（Vue HTML parser生成树），对原flat innerHTML seam漏掉的children/空白分支实际运行。DOM树/Style接口仍为明确double，不称真实浏览器Tiny serializer或任意CSS/class/white-space上下文全覆盖。保守拒绝未证明等价的其它格式差异，不从单一block例扩为全部富文本等价证明。

### C3V-004：撤销首轮误报，不记修复

首轮probe令active后的s.stale()返回false，误当成真实wrapper已结清operation的回调；实际传入回调为：

```typescript
() => node.binding.current.value.phase === 'active'
  ? !pasteUnmounted && pasteActiveKey.value === node.key
  : isCurrent()
```

本reviewer从当前真实wrapper TS AST直接提取此完整arrow执行：candidate且operationCurrent=false→false；同key active且operationCurrent=false→true；activeKey不匹配或unmount→false。再按该真实phase前提驱动实际C3 prepare→active→操作结清→renderChart→timer，本地段落正确添加event.stopPropagation，旧段落保持oldClick。

jumpTargetAdaptor整个区块与本轮写前逐字节相同，片段SHA `78126329e9588f5539ca2ae004f1b4a592f0848e91c128c068eb0268064b4c56`。确认Builder已撤回V004专用改动，保留既有合法activeKey检查，没有以绕过真实失效实现“修复”。原首轮报告SHA仍`b6f154974122a0220fff6f431cf78bda237bd5541cafb4b74360f5bbd10be211`，ProgressReconciliation记录勘误；不回写历史。不因撤销一个无效finding删除任何原AC。

新增Blocking findings：无。新non-blocking产品finding：无。需要人类authority裁定：无。

## 独立执行结果

| 检查 | 实际结果 | 证据上限 |
| --- | --- | --- |
| richtext/check.mjs | exit0，43 PASS / 0 semantic / 0 execution | 原16+新增27有限variants；非43图表类型或43完整AC |
| 同runner --repair-before | exit1，19 PASS / 24 semantic / 0 execution | 核写前SHA、真实完整SFC成功加载；001十六项/002五项/003三项按预期失败，原正对照保持 |
| --baseline --before | exit1，0 PASS/3 semantic/0 execution | 原FONT/PARAGRAPH/CHANNEL语义指纹，非缺模块/编译错 |
| --repair-types | exit0，before1/current1/added=[] | 本轮前后局部compileScript/tsconfig诊断multiset |
| --types | exit0，before1/current1/added=[] | 原C234基线对照；内存allowJs:true，未改配置，非全前端通过 |
| SFC+runner focused ESLint | exit0 | lint |
| SFC stylelint | exit0，仅3条现有规则弃用提示 | style |
| parse/inline compileScript/compileTemplate | exit0，无errors | Vue实际编译 |
| 定向git diff --check | exit0 | 差异空白 |
| 额外health metadata probe | 健康可读；七个单轴失败均拒绝，额外setContent/query=0 | 当前真实SFC、Tiny/host double |
| 额外旧Editor迟到事件 | doc3、一次clone1、新Editor removed0、Vue errors=[] | 当前局部owner保护 |
| V004真实arrow及C3 phase对照 | 结清operation后合法active仍true并适配本地p；key失效/unmount为false | 仅调用前提反证，不自验C4/DEV |

## 已查无问题维度与未查项

候选字体/公开channel/旧与无关p隔离、init/content先监听后set、timeout/早期错误/unmount拒绝、真实字段映射/formatter/assignment、fields/drill/innerType/render固定clone、同binding同实例激活不二次初始化、正常canonical文本更新、legacy query/font/目录边界保持。对这些原16实际回归通过，未以修复001替代其它检查。

未检查真实TinyMCE语言/skin/plugin资产、实际浏览器净化/serializer/布局与光标、后端query/真实权限、保存离开重开、移动/嵌入、全部49 source/target与installed插件。Editor/doc/body/Store是协议double；normalizer专用树也不等于浏览器CSSStyleDeclaration/字体。threshold=false的mappingColorCustom仍是unexpected-call seam，未称富文本阈值已验。全量types/build未执行，已有基线问题不被局部检查掩盖。DEV数据采集/物理网络次数、C4图片/共同wrapper功能不是本轮独立通过对象。

原报告/原Goal/fixture未改；source/test/README运行前后SHA一致。修复只关闭有效三个finding，V004是证据更正；三轮预算未重置。

## 修后准入预测

C3当前有界模块可继续真实UI/TinyMCE准备、采用与正常query/save-leave-reopen。若真实运行出现新问题，按同一实现剩余第3/3轮记录，不把真实资产/后端结果由43绿代填。当前无需再扩大框架或新设计审查；root继续完整MVP义务与最终Gate，本文不关闭Goal/Session/Coverage。

## 当前字节绑定

| 文件 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | `5e493a7d261318717d9192f34df2db17810fe8dd286401954b5db4aa1b1ede8d` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/check.mjs` | `74da80178a432155030386f9830cea8d79b94b2283f08582e72122d121332e40` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/README.md` | `1e9e1eba574ff34f3dc9f503d3b1ff209d10e65fa3a5815ca639eb212250ed49` |

调用前提所读wrapper：`core/core-frontend/src/views/chart/components/views/index.vue`，SHA `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b`。该绑定仅使C3所依赖的metadata读取顺序/active回调可复核，不构成作者对C4/DEV自身的独立验收。

14项必读输入，入场与最终重算一致：

| 必读文件 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints/SKILL.md` | `c4d8463bc350c44ad600c92400f783c565b2e968720bfeed1df67a49112b8933` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/MvpScopeAuthority-20261027.json` | `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiC234ConcreteFixtures-r001.json` | `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC3RichText-r001.md` | `d30f75f7851ba78484e53775d72be2e677168da8b2efa7a623186b703536d52b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c34-interface-snapshot-r001.ts` | `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC3Validation-r001.md` | `b6f154974122a0220fff6f431cf78bda237bd5541cafb4b74360f5bbd10be211` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C3LocalRepair-r001.md` | `76a601f3b4e89ab20256cd1ee22bbbb1ae3f1315b93ca0f6fdd95ca82bef0155` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c3-local-before-r001/manifest.json` | `317c63abb1a8ead3bd81f36a48095d345993885ab97f6cc83943d6c0a320dc44` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ProgressReconciliation-r001.md` | `b60315de709c78182eb94c49520d7c207ec4002c966be0be472aac753398eae4` |

## 额外探针复现位置与步骤

保持磁盘runner不变，在内存读取当前richtext/check.mjs至const records之前的真实scenario，固定root/createRequire的等价路径，将包import解析为当前文件URL；不改SFC生产函数。依次prepare/init/await ready，分别只注入Error无payload、body.isConnected=false、零size、body.innerHTML变化、getContent单独变化、candidate current=false、editor.initialized=false，然后读取handle.metadata；健康对照读取不抛。另按现C3V002-EDITOR-REMOUNT路径，给已remove旧Editor emit init/Error/remove，再驱动当前doc mousedown。输出关键结果为：

```json
{"probe":"adoption-metadata","fault":"healthy","prepareOK":true,"metadataRejected":false,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"error-no-payload","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"disconnect","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"zero-size","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"body-content","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"getContent-only","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"operation-stale","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"adoption-metadata","fault":"initialized-false","prepareOK":true,"metadataRejected":true,"extraSetContent":0,"query":0}
{"probe":"old-editor-late-events","listeners":3,"clones":1,"nextRemoved":0,"oldRemoved":1,"vueErrors":[]}
{"probe":"V004-real-phase-premise","prepareOK":true,"operationCurrent":false,"activeCurrent":true,"localParagraph":"event.stopPropagation()","oldParagraph":"oldClick()"}
```
