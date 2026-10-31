# C2 地图 prepared / ready 组件见证

在 `core/core-frontend` 复用已安装依赖运行：

```sh
node tests/filter-copy-mvp-maps/check.mjs --before
node tests/filter-copy-mvp-maps/check.mjs
node tests/filter-copy-mvp-maps/check.mjs --types
```

`--before` 校验 `c234-before-r001/manifest.json` 原字节，真实编译、挂载旧完整 G2Plot SFC，并直接调用冻结旧地图类的真实 `drawChart` / `L7Wrapper.render`；检查成功创建规定的5/1/2 layers或真实plot后，旧 Promise 已提前完成，事件仍未到齐。42项应为同一提前完成 fingerprint 的语义 RED，0执行错误。它不把旧SFC的地图prepare尚未支持、缺方法、provider缺值或编译失败当RED；也不声称旧版本已运行到每个后续callback故障点。

当前版本经真实完整 G2Plot SFC `prepareFilterPaste` → 真实五地图类 → 真实 L7Wrapper/point fallback/ready bridge。七 fixture × 六事件 variant，加七个基础设施缺失拒绝，共 **49个组件检查条目**；这个数字不是49种图表的产品验收。六 variant 为正常完成、实际回调抛错、30s超时后迟到、scene等待、SDK错误、卸载后迟到。库 double 不会自动发 ready；L7 layer逐个inited，plot loaded、Dot add/loaded独立发，明确检查监听先于addToScene。

冻结 fixture 为 `UiC234ConcreteFixtures-r001.json` 中 map-flow/map-heat/map-symbolic/map-polygon/bubble-map-polygon/map-point/bubble-map-point。按其 BASE克隆+明确路径赋值，实际字段、DTO、GeoJSON不换为自选数据；flow同名去重不改，tooltip关闭样本不提升为完整真实DTO。真实 label-layout 没有被替换；SVG DOM/text与字体宽度测量是自定义Vue host，`getBBox = text.length*8 × 14`，只证明可重复布局逻辑，非浏览器字体/像素。

SDK、common_antv 地图设施/样式 adapter、geo读取边界、Store、emitter为显式 provider double；真实map class、BASE、Vue编译/渲染/nextTick、lodash、label-layout、L7Wrapper及ready桥运行。`getGeoJsonFile`只能请求fixture声明的156；unexpected query/key/custom-area请求为执行错误。VM将原500ms调度加速到0，生产30s桥和31s总超时加速到80ms；等待与事件序仍分别控制。

`--types` 用真实 TypeScript/tsconfig 与当前声明，内存读取冻结前后的本C2生产写域（.vue经compileScript），按文件/code/message比较语义诊断multiset。仅检查新增诊断；既有项目诊断继续保留，不代表全项目ts:check通过。

未验真实WebGL/地图供应商、真实SDK冷启动、后端query、wrapper发布/dirty/保存重开、真实字体和全部49类型。真实应用必须先由正常active地图预热配置/SDK/区域缓存；缺设施具体拒绝，不由candidate冷初始化或回写缓存。证据在 `MVP-20261027/evidence/SliceC2Maps-r001.md`。
