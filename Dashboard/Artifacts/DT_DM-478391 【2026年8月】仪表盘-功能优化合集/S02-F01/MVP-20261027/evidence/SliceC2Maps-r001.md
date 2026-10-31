# C2 五地图实施候选 r001：prepared ready 与局部失败隔离

**Builder candidate（实施候选），不是独立 Validation，不是实际地图或全部49类型验收。** 作者为 `/root/line_construction_builder`。本 C2 的49个检查条目 = 七fixture×六事件variant + 七缺基础设施拒绝，绝不等于49种图表运行分母完成。Goal的22项、15主case与49内建类型分母继续保留。

## 精确准入与保全

- Card canonical SHA `daa5ea58daa823f890b23f7002fb835eca2ef7f0cf579716c3d3981a1e36afe8`，Context SHA `0e6459d5b0fe671c2820f4131efb3c4e09b9cda89efa86cddccdf9628f729771`，24项输入原字节摘要全部匹配；Topology r439，14个目标 admission逐一builder验证exit0。
- 先完成C1 Validator current重放ACK，收到root明确放行后才开始生产写入；原C1snapshot不改、不回写为C2已验。旧A独立报告继续只绑定A快照。
- 写域限定Card中的地图类、L7 base/types、G2Plot严格地图分支、局部ready桥、专用tests/README/本文。未写wrapper/shared paste helper/C3/C4、冻结Design/Cases/fixtures/Goal、API B；l7plot.ts本轮仅格式核对、最终字节若未变按摘要保持。
- root掌握控制面/真实UI与最终Stop Gate；本lane未操作浏览器、DB、安装、启动服务、暂存、提交或推送。

## 实际变更与接口

1. `AntVDrawOptions.filterPaste?: FilterPasteMapReady`为严格候选的可选接点，legacy draw与`L7Wrapper.render():void`继续保持默认接口。ready桥仅属于当前一个candidate：Promise、有限事件计数、30s timeout、current检查、回调异常捕获及本候选已知监听/实例/标签cleanup；无跨图表调度、全局owner表或旧通用资源框架。
2. flow/heat/symbolic真实类使用已预热mapKey（不调用getMapKey配置请求、不重写security全局配置），配置与SDK scene仍由原地图设施路径创建。容器/尺寸/必要axis失败明确抛错，不把空wrapper/缺配置当合法空态。返回strict L7Wrapper，在addLayer前订阅所有必要layer inited/error及scene loaded/error；scene.loaded单独不能ready，全部5/1/2 layer真实inited回调完成后才ready。实际mapRendered/qqMapRendered回调异常由局部桥reject。flow原start/end同名去重没有改。
3. map/bubble polygon与point fallback走真实类、真实GeoJSON/字段映射。plot.loaded时真实callback结束与必要SVG标签首次draw是前置；有Dot的分支在addToScene之前订阅add/loaded/error，两事件缺一不可。map polygon分支不凭空要求Dot。真实label-layout未被替换，cleanup随当前candidate释放；plot/scene/dot错误或callback抛错、timeout/dispose/late都不提升旧target。
4. G2Plot SFC严格地图分支仍经实际500ms调度，再调用真实地图类；L7 wrapper render:void不当ready，而等当前ready桥。prepare本地派生地图drill参数，metadata仍`kind:g2`，保留drillFilters/originData/publishOrigin契约。候选chart局部id使用唯一suffix，避免common设施以canonical chart id选择旧宿主；persistent response/树和返回DTO不因此改id。新节点沿既有shared binding同key提升，不替换公共SFC proxy。
5. 暴露`canPrepareFilterPaste():boolean`供wrapper capture前检查；prepare再检查。G2直接可用；L7必须已加载mapKey且对应SDK全局存在（customTile已加载配置沿现adapter）；L7Plot须已有实际area/scope的非空GeoJSON缓存。冷key/SDK/资产或custom_额外前置资料当前不可用时返回`map_infrastructure_unavailable`，不由candidate冷请求/写cache。严格geo读取强制走已有cache路径，不启用会强制重新请求的global-mapping读取。world钻取沿原areaId转换约定；scope按156缓存检查。
6. 候选禁用地图tooltip/carousel、跳过共享hover/zoom adapter，业务action仍由SFC phase guard控制；初始化失败不调用共享setter。此非关键交互保持候选绘制状态，提升后后续正常active重绘按canonical配置恢复；没有为激活二次draw/query。

局部已知资源按桥登记：L7 scene、plot、Dot及SVG标签cleanup，失败/卸载清理；未返回但迟到取得的资源按closed检查立即释放。本桥不声称解决所有普通异步更新或任意SDK隐含资源。

## 可信RED、同ID GREEN与harness边界

最终`--before`核对c234-before-r001 manifest及其每项SHA，真实compiler-sfc成功编译/真实Vue挂载完整旧G2Plot SFC后，直接调用冻结旧地图类drawChart（再调用原L7Wrapper.render）。这样能提供完整prepared fixture给真实旧类，并确认实建5/1/2 layer或plot后才检查语义；旧SFC C1版本地图prepare尚不支持，不把它的缺方法/拒绝当RED。

**42个旧案全为同一明确提前完成fingerprint `MAP_READY_BEFORE_REQUIRED_EVENTS`，0执行错误。** 旧类draw/render在必要SDK事件到齐前已结束；不是声称42种不同缺陷，也没有声称旧案已运行到每一个后续error/timeout注入点。GREEN通过当前完整真实SFC prepare→真实map class→真实L7Wrapper/point fallback/ready链消费同七fixture；后续六variant才分别实际驱动callback/error/timeout/late。

最初harness曾因目录index解析、provider/旧candidate phase guard使层未创建而有执行错误；这些未计RED。已补最小SDK协议，并用固定旧类直接draw的成功实例化作为RED前置，未更改冻结fixture、expected或生产方法来制造故障。point callback在首mapRendered即失败时尚未add Dot是正确失败路径；测试只对实际add的Dot要求先订阅，不把未到达步骤伪造为错误。

真实运行：完整G2Plot SFC、Vue响应式/nextTick/template、五地图类、L7Wrapper、BASE、lodash、point-fallback、label-layout、局部ready桥。显式doubles：SDK Scene/Layer/Plot/Dot、common_antv设施/样式adapter与mapRendered故障seam、geo读取、Store/emitter/formatting、DOM host及SVG测量。SDK不自动发ready，L7逐层inited、plot.loaded和Dot add/loaded分别驱动。`getBBox=text.length*8×14`与固定经纬投影只证明布局算法逻辑，不是浏览器字体/像素。生产500ms timer在VM加速0ms，30s/31s超时加速80ms；无真实时间或地图服务性能结论。

## 已执行结果

- `node tests/filter-copy-mvp-maps/check.mjs --before`：exit 1。
- `node tests/filter-copy-mvp-maps/check.mjs`：exit 0。
- `node tests/filter-copy-mvp-maps/check.mjs --types`：exit 0。
- `./node_modules/.bin/eslint src/views/chart/components/js/panel/types/index.ts src/views/chart/components/js/panel/types/impl/l7.ts src/views/chart/components/js/panel/types/impl/l7plot.ts src/views/chart/components/js/panel/charts/map/flow-map.ts src/views/chart/components/js/panel/charts/map/heat-map.ts src/views/chart/components/js/panel/charts/map/symbolic-map.ts src/views/chart/components/js/panel/charts/map/map.ts src/views/chart/components/js/panel/charts/map/bubble-map.ts src/views/chart/components/js/panel/charts/map/point-fallback.ts src/views/chart/components/views/components/ChartComponentG2Plot.vue src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts tests/filter-copy-mvp-maps/check.mjs`：exit 0。
- `./node_modules/.bin/stylelint src/views/chart/components/views/components/ChartComponentG2Plot.vue`：exit 0。
- `git diff --check -- src/views/chart/components/js/panel/types/index.ts src/views/chart/components/js/panel/types/impl/l7.ts src/views/chart/components/js/panel/types/impl/l7plot.ts src/views/chart/components/js/panel/charts/map/flow-map.ts src/views/chart/components/js/panel/charts/map/heat-map.ts src/views/chart/components/js/panel/charts/map/symbolic-map.ts src/views/chart/components/js/panel/charts/map/map.ts src/views/chart/components/js/panel/charts/map/bubble-map.ts src/views/chart/components/js/panel/charts/map/point-fallback.ts src/views/chart/components/views/components/ChartComponentG2Plot.vue src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts`：exit 0。
- `node tests/filter-copy-mvp-renderers/check.mjs`：exit 0。

当前 **49/49组件检查通过，0语义失败、0执行错误**。覆盖scene loaded前不add/不ready、所有layer最后一项前仍pending、Dot先订阅后add和两个必要事件、实际callback失败、SDK error、超时后迟到与卸载后迟到、缺基础设施无Scene/无query/无Store业务写。真实symbolic文本为“门店：合成店A/合成店B”，真实SVG区域文本为两合成区。

Focused ESLint：11生产路径+专用runner全部exit0；G2Plot定向stylelint exit0，只有现配置三条deprecated rule提示；本写域git diff --check exit0。未安装、全量构建或修改lint/tsconfig规则。

局部真实TypeScript program：**冻结前29项、当前28项、新增0**。按本C2写域文件/code/message multiset比较（Vue经真实compileScript），源码与依赖仍有既有诊断，不称完整类型通过。新增timer局部改为ReturnType<typeofsetTimeout>使一项既有Node/DOM定时器差异减少；不是清理全项目基线。另修复两处新Chart→ChartObj窄转型诊断，helper接受实际Chart/ChartObj公开读形态，不关闭类型检查。

C2最终source下C1 renderer **24/24回归通过**。当前C1 wrapper曾在另一C4 Builder并发修改时运行：前六组通过，旧undo/redo案604行假定suffix空字符串，实际filter-paste-target-1而失败；已原样告知root/C4归属Builder，未改其test或隐瞒为通过。本lane不将当时current wrapper称集成全绿；后续由其最新snapshot/独立Validation裁定。

## 已查无问题、残余与准入预测

已查无新增生产阻断：strict为opt-in；legacy默认接口保留；完整七fixture真实类成功装载；必要事件和callback计数/错误；current/timeout/dispose局部失效；已知资源cleanup；same shared binding API与G2 metadata保持；C1 renderer回归；source/fixture字节与focused lint/style/type差异。

**未验/上限**：没有真实WebGL、供应商SDK/资产、真实mapKey或脚本预热、common_antv的真实SDK创建和全部宿主selector副作用、真实query/返回DTO、权限、wrapper publish/dirty、保存/离开/重开、undo/redo、全49 type/插件运行。common_antv设施在此是明确seam；其内部scene.loaded回调/冷SDK等不能借当前类callback测试声称全部动态证明。缺缓存/custom_前置数据或非标准地图供应商按可用性拒绝，不把它算成功或从eligible分母删除，后续真实环境须列出确切资产/能力缺口。

F3-01按第三轮结论保留原flow去重，未将start/end配置数组强制当每次渲染文本golden。F3-02本synthetic DTO quotaList缺逐项value，只在tooltip关闭/showQuota=false的ready故障语义内使用；不能提升为完整真实后端golden。地图label真实算法消费固定geo，但字体测量seam未验真实视觉。

修后准入预测：可交独立C2 Validation，并与C4控制面接线继续真实地图正向链。该候选只推进五地图prepare/ready的模块证据，不提升Goal/Coverage、不关闭49分母或重启已迁出的通用异步/资源工程。当前UI设计预算第3/3轮保持，本文不是新设计review轮次。

## 最终字节

报告时点：2026-10-27T06:03:46.908971+00:00

| 文件 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/views/chart/components/js/panel/types/index.ts` | `a9214afb421b3dbd8ab07c5721157ab48d97ca2e68d932e947838ab736b3581f` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7.ts` | `94f1e0e47f05b09588bc71818ece4bb284f412fa0afb333b2614e513dd611414` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7plot.ts` | `e63a044bbc5dca7bc07f645faf3df5684f8de8c545339f87fa0ce8978718d6cc` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/flow-map.ts` | `cd6b2233c83fc19ab04b0a3262b44f26ff5934bad7915969586700eebfc71d1b` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/heat-map.ts` | `1b09b6330c31e235923464b75665b814cebe0832a3b9fa3582aaf1279c60c563` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/symbolic-map.ts` | `b5f7235ea6cc373b9fce47b0c95ce09e95f61ff45d6174d759156eb36a97c826` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/map.ts` | `5eeb33eeff060e1a25e48eaa8d836d9e8985c63bfa2ed9d70b513244420c6c12` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/bubble-map.ts` | `fbd6c86d1dd60f2120e2e5f84d8bde25dbf598c774a2bcb7ffe4e55d24ed38cd` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/point-fallback.ts` | `98f6b5c08ef91d909f1483fd707998a3dc9edf71da3ca350a54a3d9ddff07a79` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `2df3df0621943a6fd73f3ce5ed4c72bbe6b783ff8b62429bdda09ac728d163cf` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `05143f41fed433c7688f377777cd374ac1864bc5450591e69b6a700621ffaa0f` |
| `core/core-frontend/tests/filter-copy-mvp-maps/check.mjs` | `62a7e464c593e70b73da1881087faff877fe117dc70a6fc5e60c8d03d5569747` |
| `core/core-frontend/tests/filter-copy-mvp-maps/README.md` | `0b186a96ad4db74707914cde5865278c19b8d32b1dd1ec760c8c726b304ec465` |

RED摘要：

```json
{
  "passed": 0,
  "failed": 42,
  "execution": 0,
  "records": [
    {
      "id": "map-flow",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 5,
      "plots": 0
    },
    {
      "id": "map-flow",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 5,
      "plots": 0
    },
    {
      "id": "map-flow",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 5,
      "plots": 0
    },
    {
      "id": "map-flow",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 5,
      "plots": 0
    },
    {
      "id": "map-flow",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 5,
      "plots": 0
    },
    {
      "id": "map-flow",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 5,
      "plots": 0
    },
    {
      "id": "map-heat",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 1,
      "plots": 0
    },
    {
      "id": "map-heat",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 1,
      "plots": 0
    },
    {
      "id": "map-heat",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 1,
      "plots": 0
    },
    {
      "id": "map-heat",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 1,
      "plots": 0
    },
    {
      "id": "map-heat",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 1,
      "plots": 0
    },
    {
      "id": "map-heat",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 1,
      "plots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 2,
      "plots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 2,
      "plots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 2,
      "plots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 2,
      "plots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 2,
      "plots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 2,
      "plots": 0
    },
    {
      "id": "map-polygon",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-polygon",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-polygon",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-polygon",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-polygon",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-polygon",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-point",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-point",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-point",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-point",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-point",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "map-point",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "normal",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "callback",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "timeout",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "scene-wait",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "error",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "discard",
      "verdict": "SEMANTIC_FAIL",
      "message": "MAP_READY_BEFORE_REQUIRED_EVENTS\n\ntrue !== false\n",
      "layers": 0,
      "plots": 1
    }
  ]
}
```

GREEN摘要：

```json
{
  "passed": 49,
  "failed": 0,
  "execution": 0,
  "records": [
    {
      "id": "map-flow",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 5,
      "dots": 0
    },
    {
      "id": "map-flow",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 5,
      "dots": 0
    },
    {
      "id": "map-flow",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 5,
      "dots": 0
    },
    {
      "id": "map-flow",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 5,
      "dots": 0
    },
    {
      "id": "map-flow",
      "fault": "error",
      "verdict": "PASS",
      "layers": 5,
      "dots": 0
    },
    {
      "id": "map-flow",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 5,
      "dots": 0
    },
    {
      "id": "map-heat",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 1,
      "dots": 0
    },
    {
      "id": "map-heat",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 1,
      "dots": 0
    },
    {
      "id": "map-heat",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 1,
      "dots": 0
    },
    {
      "id": "map-heat",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 1,
      "dots": 0
    },
    {
      "id": "map-heat",
      "fault": "error",
      "verdict": "PASS",
      "layers": 1,
      "dots": 0
    },
    {
      "id": "map-heat",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 1,
      "dots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 2,
      "dots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 2,
      "dots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 2,
      "dots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 2,
      "dots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "error",
      "verdict": "PASS",
      "layers": 2,
      "dots": 0
    },
    {
      "id": "map-symbolic",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 2,
      "dots": 0
    },
    {
      "id": "map-polygon",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 0,
      "dots": 0
    },
    {
      "id": "map-polygon",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 0,
      "dots": 0
    },
    {
      "id": "map-polygon",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 0,
      "dots": 0
    },
    {
      "id": "map-polygon",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 0,
      "dots": 0
    },
    {
      "id": "map-polygon",
      "fault": "error",
      "verdict": "PASS",
      "layers": 0,
      "dots": 0
    },
    {
      "id": "map-polygon",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 0,
      "dots": 0
    },
    {
      "id": "bubble-map-polygon",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "error",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-polygon",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-point",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-point",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-point",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-point",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-point",
      "fault": "error",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-point",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "normal",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "callback",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "timeout",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "scene-wait",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "error",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "bubble-map-point",
      "fault": "discard",
      "verdict": "PASS",
      "layers": 0,
      "dots": 1
    },
    {
      "id": "map-flow",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    },
    {
      "id": "map-heat",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    },
    {
      "id": "map-symbolic",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    },
    {
      "id": "map-polygon",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    },
    {
      "id": "bubble-map-polygon",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    },
    {
      "id": "map-point",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    },
    {
      "id": "bubble-map-point",
      "fault": "prewarm-missing",
      "verdict": "PASS"
    }
  ]
}
```

局部类型摘要：

```json
{
  "before": 29,
  "current": 28,
  "added": [],
  "claim": "仅本C2写域的真实TS语义诊断差异，非全项目通过"
}
```
