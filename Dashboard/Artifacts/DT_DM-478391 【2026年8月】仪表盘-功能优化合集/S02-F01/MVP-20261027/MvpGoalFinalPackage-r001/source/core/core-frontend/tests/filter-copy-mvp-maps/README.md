# C2 地图 prepared / ready 组件见证

在 `core/core-frontend` 复用已安装依赖运行：

```sh
node tests/filter-copy-mvp-maps/check.mjs --before
node tests/filter-copy-mvp-maps/check.mjs
node tests/filter-copy-mvp-maps/check.mjs --types
```

`--before` 校验 `c234-before-r001/manifest.json` 原字节，真实编译、挂载旧完整 G2Plot SFC，并直接调用冻结旧地图类的真实 `drawChart` / `L7Wrapper.render`；检查成功创建规定的5/1/2 layers或真实plot后，旧 Promise 已提前完成，事件仍未到齐。42项应为同一提前完成 fingerprint 的语义 RED，0执行错误。它不把旧SFC的地图prepare尚未支持、缺方法、provider缺值或编译失败当RED；也不声称旧版本已运行到每个后续callback故障点。

当前版本经真实完整 G2Plot SFC `prepareFilterPaste` → 真实五地图类 → 真实 L7Wrapper/point fallback/ready bridge。七 fixture × 六事件 variant，加七个基础设施缺失拒绝，原有 **49个组件检查条目**；这个数字不是49种图表的产品验收。六 variant 为正常完成、实际回调抛错、30s超时后迟到、scene等待、SDK错误、卸载后迟到。库 double 不会自动发 ready；L7 layer逐个inited，plot loaded、Dot add/loaded独立发，明确检查监听先于addToScene。

冻结 fixture 为 `UiC234ConcreteFixtures-r001.json` 中 map-flow/map-heat/map-symbolic/map-polygon/bubble-map-polygon/map-point/bubble-map-point。按其 BASE克隆+明确路径赋值，实际字段、DTO、GeoJSON不换为自选数据；flow同名去重不改，tooltip关闭样本不提升为完整真实DTO。真实 label-layout 没有被替换；SVG DOM/text与字体宽度测量是自定义Vue host，`getBBox = text.length*8 × 14`，只证明可重复布局逻辑，非浏览器字体/像素。

SDK、common_antv 地图设施/样式 adapter、geo读取边界、Store、emitter为显式 provider double；真实map class、BASE、Vue编译/渲染/nextTick、lodash、label-layout、L7Wrapper及ready桥运行。`getGeoJsonFile`只能请求fixture声明的156；unexpected query/key/custom-area请求为执行错误。VM将原500ms调度加速到0，生产30s桥和31s总超时加速到80ms；等待与事件序仍分别控制。

`--types` 用真实 TypeScript/tsconfig 与当前声明，内存读取冻结前后的本C2生产写域（.vue经compileScript），按文件/code/message比较语义诊断multiset。仅检查新增诊断；既有项目诊断继续保留，不代表全项目ts:check通过。

未验真实WebGL/地图供应商、真实SDK冷启动、后端query、wrapper发布/dirty/保存重开、真实字体和全部49类型。真实应用必须先由正常active地图预热配置/SDK/区域缓存；缺设施具体拒绝，不由candidate冷初始化或回写缓存。证据在 `MVP-20261027/evidence/SliceC2Maps-r001.md`。

## C2 独立第1轮局部修复反例

r001 修复时 runner 保留上述49项原期待，另追加50项，当时总计 **99个组件检查条目**（当前r002继续保留这些条目，另见下节）：

- C2V-001：七fixture × error/destroy × 同turn/后续微任务，28项；七fixture × error/destroy 在handle已返回但metadata采用前失败，14项。前28项要求 prepare拒绝，后14项已fulfilled的prepare不可改写，要求同步发布前metadata读取拒绝；均要求无共享业务写。
- C2V-002：四L7Plot fixture × normal refresh后的unmount/旧handle.dispose，8项。原plot与刷新后当前plot都释放一次，dispose后再unmount不重复destroy。

独立报告原18反例为前14个同turn案 + 4个refresh→unmount案；新增50不是50个独立产品缺陷，也不是扩大图表type分母。SDK double现在额外记录destroy调用次数；仍不证明供应商内部GPU资源释放。

对本次修复写前保全manifest复放（由父代理保存在artifact中，路径通过参数指定）：

```sh
node tests/filter-copy-mvp-maps/check.mjs --repair-before --repair-manifest=/absolute/path/to/manifest.json
node tests/filter-copy-mvp-maps/check.mjs --repair-types --repair-manifest=/absolute/path/to/manifest.json
```

manifest每项包含source（仓库相对路径）、snapshot（快照绝对路径）和sha256。runner先验证原字节SHA，只对生产模块应用写前字节，使用同一当前测试驱动。r001冻结driver执行`--repair-before`当时为49原项成功、50新增语义失败、0执行错误；当前driver已额外加入后续反例，该历史分母不作为当前该命令的总数。`--repair-types`仅比较本轮ready helper和G2 SFC两个生产文件，11→11、added=[]；既有`--before`及`--types`原基线模式保留。

局部修复只改SFC：draw完成后、ready等待后、renderChart/Promise.race后及handle.metadata采用边界复核既有ready.check；记录桥持有实例，普通刷新前先释放同一旧实例，dispose/unmount仅清空确已被该桥释放的同一myChart，新plot仍走原清理。ready helper已保留closed状态，因此无须重写它。

C2V-003证据更正：map/bubble/point显式跳过共享hover adapter；symbolic仍经buildTooltip调用bindMapHoverTooltipRefresh，沿候选容器局部注册，并有scene.destroy cleanup。当前common_antv adapter是noop double，99绿未验证真实hover注册/解绑，不能称所有地图都跳过该adapter。原历史报告保全，此更正不增写symbolic源码。

## C2V-004 scene交接局部修复 r002

当前默认检查为 **317条**：原99 + 独立r002的182微任务分层 + 21返回handle边界 + 12个scene刷新/resize与最终清理矩阵 + 3个无filterPaste的legacy地图类draw/reuse对照。三个legacy对照不是完整legacy UI验收。所有原期待保留，不把317说成图表类型数。

```sh
node tests/filter-copy-mvp-maps/check.mjs --scene-before
node tests/filter-copy-mvp-maps/check.mjs
node tests/filter-copy-mvp-maps/check.mjs --scene-types
```

`--scene-before`默认读`MVP-20261027/c2-scene-before-r001/manifest.json`并核SHA，应用本轮写前两生产文件，实测307 PASS / 10 semantic failure / 0 execution。当前317 PASS。`--scene-types`对本轮两生产文件作真实TS语义diagnostic multiset，11→11/new0；不称全项目类型通过。

scene矩阵加载当前生产common_antv中完整、未改写的getMapScene函数体（仅擦除export并TS transpile），实际完整SFC/五map classes/L7Wrapper/ready bridge继续运行。SDK Scene.removeAllLayer按照已安装L7协议销毁旧layers，map style、getMapObject、其它common设施仍为double。scene/create与reuse分支真实执行；不是用每次new Scene遮住复用。

生产仅在普通renderL7首次替换桥持有strict实例时调用既有releaseMapPreparation；桥销毁其旧scene并清空同一myChart，随后走原正常新scene分支。后续正常renderChart继续复用这个新scene且无候选layer监听残留，真实ResizeObserver回调对flow/heat仍按原策略触发，symbolic resize不强制重画。

因此oracle明确区分历史旧scene与当前scene：旧scene允许且应已释放一次，当前scene刷新期间必须存活，最终所有scene都只destroy一次。不会把“所有历史scene都不得销毁”作为新scene方案的错误判据。12矩阵中的symbolic resize两案为原策略正对照；10案在写前精确失败。

r002独立附录原样probe的写前输出，以及同一落地driver的写前RED输出已保存到c2-scene-before-r001目录。准备期error/destroy、0..12深度与metadata拒绝采用的182/21条继续保留；不以采用后的普通layer正常销毁推翻采用前错误必须拒绝。没有增加通用scene注册、closed重置或全局忽略SDK错误。最终证据见`MVP-20261027/evidence/C2SceneRepair-r001.md`，待本实现第3/3轮独立验证。
