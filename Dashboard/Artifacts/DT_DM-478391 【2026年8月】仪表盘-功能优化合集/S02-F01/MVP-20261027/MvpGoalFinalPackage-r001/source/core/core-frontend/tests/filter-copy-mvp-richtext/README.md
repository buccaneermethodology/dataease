# C3 富文本候选组件见证

在 `core/core-frontend` 使用已安装依赖运行：

```sh
node tests/filter-copy-mvp-richtext/check.mjs --baseline --before
node tests/filter-copy-mvp-richtext/check.mjs
./node_modules/.bin/eslint src/custom-component/rich-text/DeRichTextView.vue tests/filter-copy-mvp-richtext/check.mjs
```

`--before` 按 `c234-before-r001/manifest.json` 读取并核验原富文本 SFC 字节。基线真正编译、挂载完整旧 SFC，执行原 `viewInit/assignment` 及 1 秒 timer，触发公开 fieldSelect；字体、旧段落、公开 channel 三个语义断言失败才是 RED。缺新 prepare 方法、编译错误或 provider 缺方法不是 RED。

绿色检查加载完整真实 `DeRichTextView.vue`，Vue custom renderer 执行其 template/生命周期。TinyMCE Editor/事件/connected body、DOM 及 Store 为明确协议替身；测试不替换真实字段映射、格式化、assignment、候选 ready/失效控制流。HTML 字符串来自真实 SFC 的 setContent 调用，替身不替换占位值。地图、图片和 C1 wrapper 不属于本 runner。

输入来自已冻结 `UiC234ConcreteFixtures-r001.json` 的 tiny-normal/tiny-compare。案例均沿用 MVP-UI-10-TINY / MVP-UI-08-ADAPTER / MVP-UI-11-CANONICAL 的分支身份；不是新增主子案预算。包括 init 未到、同步/异步 SetContent、内容错误、资产错误、timeout/unmount/late、公共 channel 与字体/段落隔离，以及同实例激活后的 canonical 内容更新。

这些结果属于组件与协议层见证，不证明真实 TinyMCE skin/lang/插件资产加载、浏览器富文本净化、后端查询数据、保存重开或全部 49 种类型。真实运行与独立 Validation 另行记录。

## 独立反例局部修复 r001

新增检查与原16项一起默认运行，共 **43个组件/谓词检查条目**，不是43种类型或独立产品缺陷。写前生产字节保全于 `MVP-20261027/c3-local-before-r001/manifest.json`，包含原SFC、runner、README副本及SHA。以下模式先核原SFC SHA，复用当前同一驱动：

```sh
node tests/filter-copy-mvp-richtext/check.mjs --repair-before
node tests/filter-copy-mvp-richtext/check.mjs --repair-types
node tests/filter-copy-mvp-richtext/check.mjs --types
```

`--repair-before` 预期19 PASS / 24 semantic failure / 0 execution；当前43 PASS。新增27条：C3V-001两个fixture×Error/remove×2/3/4微任务（12条）、两个fixture×Error/remove的handle采用前读取（4条）；C3V-002重建/已排mousedown/ObjectSelected/Editor remove/clone清理（5条）；C3V-003 inline空格/NBSP/pre负例及block间缩进等价正例（4条）；合法active current与dispose段落timer两个原契约对照。原16期望不改。

C3V-001的2/3微任务窗失败必须prepare返回false。4微任务时prepare可能已fulfilled但外层订阅尚未交付；JavaScript不能撤销已fulfilled Promise，要求若拿到handle，真实wrapper同步发布前读取的metadata必须再次拒绝已失败/移除/脱开的Editor。后续handle例显式覆盖这一采用前边界；没有把无法撤销Promise说成已返回false。

C3V-002补足Vue host父子/remove协议，TinyVue卸载调用Editor.remove；Editor double remove现在发真实协议remove事件、只发生一次。完整生产SFC重建与nextTick实际运行，doc事件仍为协议double。normalizer专项直接从当前真实TS AST取得完整未改写initializer，基于Vue HTML parser的明确DOM树double运行，补原flat innerHTML seam无法触及的children/空白分支；不冒充真实浏览器serializer。

C3V-004已由独立审查者与父代理撤销为false positive：真实wrapper在active时提供当前activeKey/存活判断，不能用s.stale模拟已结束operation。生产jumpTargetAdaptor整块保持本轮写前原字节；两个timer检查仅为原合法契约对照，不列已修finding。

`--repair-types` 对本轮写前SFC；`--types` 对原C234基线，均为真实compileScript/tsconfig诊断multiset，实测1→1、新增0，不称全前端类型通过。旧`--baseline --before`仍是0 PASS / 3语义RED / 0执行错误。详情见 `MVP-20261027/evidence/C3LocalRepair-r001.md`，独立第2/3轮另行给结论。
