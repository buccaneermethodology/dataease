# C2 地图独立增量验证 r002

**结论：BLOCKED。** 原两项反例在其原有限范围内已闭合，但查全发现三 L7 的 strict→普通 scene 复用交接仍会销毁正在使用的 scene（C2V-004/P2）。当前 99 条组件回归全部通过，不能覆盖或消除此额外反证。本实现交付累计第 **2/3 轮**，下一轮是第3/3轮上限；不重置设计或实现预算。

- reviewed_at：2026-10-27T07:33:41.399691+00:00（UTC）。
- reviewer：`/root/g2_closeout_reviewer`，未编写 C2 源码、修复或 maps runner。曾编写 C234 fixture/C3，并验证 C4；C3本轮只核公共接口，不自报独立通过，旧 C4 有界结论不扩大。
- snapshot_id：`S02-MVP-C2-INDEPENDENT-DELTA-r002`；as_of_state：卡片绑定 `Topology-actual-r458.json` 及下列源码字节。
- Card canonical SHA：`cbe93999837bfe29b44e644fcb8a2d748e7087b77c804cbf37a60d46f62e72c7`，实际 validate exit0；Context 原字节 SHA `713367a5fcdbc3eceece2a27c330bd5e739f0f4c704a4e7de6a173010b713605`，13项 required-read 入场及写前全匹配。
- 最终 G2 SFC SHA：`e99bbf771b67442558e140f3df238032e6afe3fd5b3922e18024a4262b2e1b02`。相对第1轮冻结，实际只 SFC、maps runner/README 变化；其余10个C2生产字节保持。已逐 hunk 读取 durable before→当前 SFC 差异。
- 本轮唯一持久写入：本报告。未写源码/runner/fixture/旧报告/KB/Goal/Session；未安装、构建、启动应用、访问数据库或 Git 提交/推送。全部额外探针在内存执行，未依赖临时快照目录。

## 原始目标与本轮边界

仍为权限测试桩下全部受支持图表基本多条件整树复制粘贴界面MVP；当前22项、原历史26项身份、49内建type、15主ID/25子ID和Scope Delta保留。C2负责有限地图prepare/事件完成/失败保旧/局部清理。本轮验证原C2全基线及本次局部repair，未把已迁出的通用乱序、全部普通异步、跨宿主竞争或全面GPU资源治理迁回。

读取原始authority/Goal/Design/Cases/fixture/第三轮设计review、C2两份旧Builder证据、独立r001与repair报告、durable保全及实际实现。声明上限是源码/完整真实SFC和地图类控制流、明确SDK/DOM/Store协议double下的有限证据；真实地图、后端、保存重开及全49type仍未验。

## 既有发现 disposition

| ID | 本轮独立结论 |
| --- | --- |
| C2V-001/P1 | **原失败边界闭合**。draw返回后、ready后、renderChart/Promise.race后重新check；metadata getter在wrapper同步发布前再check。原14同turn反例通过；额外182条微任务分层与21条handle边界通过。getter返回同一已准备metadata对象，未延迟重算originData。未宣称JavaScript fulfilled Promise可撤回 |
| C2V-002/P2 | **原四L7Plot反例闭合**。采用→普通刷新→unmount/旧handle.dispose，两plot均destroyCount=[1,1]，再unmount不增加。原4条unmount反例通过、当前runner的8条两类cleanup通过。其“旧strict桥与当前实例”根因的三L7 scene复用残余另列C2V-004，不能据四plot通过声称所有地图交接已解决 |
| C2V-003/P3 | **更正已落**。当前repair报告及README明确map/bubble/point跳过shared hover，symbolic仍经buildTooltip注册本地adapter；noop seam不证明真实注册/解绑。旧报告字节保留 |

## 全部新发现

### C2V-004 / P2 / blocking：采用后三L7普通刷新复用scene，旧layer的正常destroy触发准备桥销毁active scene

**位置**：`ChartComponentG2Plot.vue:1122-1132`、`:1538-1543`；`filter-paste-ready.ts:54-56`、`:86-93`；实际 `common_antv.ts:2659-2660`；三L7 class和 `L7Wrapper` 的交接。

**根因**：strict ready成功以后仍保留原layers的destroy监听与scene cleanup。采用后普通 `renderL7` 把原strict wrapper作为chartObj传下去；实际 `getMapScene` 有已有scene时调用 `scene.removeAllLayer()`，复用同一scene。安装的L7源码明确 `Scene.removeAllLayer→LayerService.removeAllLayers→destroy→layer.destroy`，而BaseLayer.destroy发destroy事件。该正常layer更换被仍存活的准备桥 `errors(layer)` 当成失败，`fail→release`执行原scene.destroy。随后普通draw继续给已destroy的scene建立新layer/wrapper。

本次修复只在普通 `renderL7Plot` 替换同一strict实例前做release/置空，普通 `renderL7` 未有相应所有权交接。现runner的common_antv provider在每次getMapScene都new Scene，遮住生产“复用已有scene并销毁旧layer”的分支；因此99绿不能反证本问题。

**独立复现方法**：保留原loader、完整真实SFC、三地图class、L7Wrapper和ready桥。只将其getMapScene seam替换成从当前生产TS AST提取的**完整原函数体**执行；底层SDK继续为协议double，补齐实际removeAllLayer会销毁原layers的行为以及map style方法。成功prepare后设同binding.phase=active，再调用实际public renderChart或已捕获的实际ResizeObserver callback。非地图算法重写，不修改磁盘或原fixture。附录A可直接复制执行。

| 当前矩阵 | 结果 |
| --- | --- |
| flow/heat/symbolic × renderChart × unmount/handle.dispose | 6/6：prepare初始ok；只存在1个复用scene；最终清理前sceneDestroyed=true、destroyCount=1；清理后destroyCount=2 |
| flow/heat × resize × unmount/handle.dispose | 4/4：同样在resize普通重绘过程中destroy active scene，清理后计数2 |
| symbolic × resize × unmount/handle.dispose | 2/2无问题：现RESIZE_MONITOR_CHARTS不包含symbolic，进入原G2库判定后不重画；清理前scene未destroy，最终destroyCount=1。不为扩大矩阵改变既有策略 |

总计10个语义反例、2个通过、0执行错误，Vue error为空。原稿补充probe首次因carousel seam缺enqueueResize而在symbolic resize报执行错误；补齐该库端口为执行原回调后完整矩阵重跑得到上述结果，该工具错误不算产品RED。

**影响与证据上限**：证明正常刷新/尺寸变化调用了仍在使用的scene.destroy，破坏采用后的普通使用；实际SDK的SceneService.destroy会清理服务并移除地图容器。这里没有浏览器像素或WebGL复现，不把double的destroyCount称作GPU资源实测。后续二次destroy是同一交接残余的清理后果，安装SceneService有inited防重复，未独立夸大成第二个产品缺陷。

**处置与最小方向**：Builder repair。在采用后的第一次普通L7重绘前，明确结束原strict准备桥对旧layers的错误监控/资源所有权，且当前scene只能由确定的owner清理；可按局部实现选择先释放旧strict实例、置空后走正常新scene，或明确安全转交可复用scene并注销已完成准备监听。必须保留采用前error/destroy、handle.metadata复验和原legacy语义，不把closed简单重置，也不能全局忽略真实SDK错误或改造通用资源框架。修复后复验三type renderChart/flow-heat resize、两个最终cleanup以及四L7Plot原8条，确保实例恰好释放且旧目标不受候选影响。

**同类残余**：三L7均实测命中；symbolic的resize分支无此触发。四L7Plot旧实例与新实例分离的8条现已通过。本轮未发现其它采用前微任务/metadata可绕过的同类失败；普通异步启动后所有时间点的全面清理不在此局部结论内。

新增non-blocking产品finding：无。需要维护者裁定的新authority问题：无。C2V-004是当前C2增量引入的strict桥→普通刷新交接问题，非原已迁出通用工程的重开。

## 独立执行与返回handle边界

| 实际执行 | 结果与证据上限 |
| --- | --- |
| `node tests/filter-copy-mvp-maps/check.mjs`（frontend cwd） | exit0，99 pass /0 semantic /0 execution；49原组件条目+50 repair条目，绝非99图表type |
| `node core/core-frontend/tests/filter-copy-mvp-maps/check.mjs --repair-before --repair-manifest=<abs durable-manifest.json>`（repo cwd） | exit1，49 pass /50 semantic fail /0 execution；SHA验证写前两生产字节，同一当前runner |
| 同上 `--repair-types`（repo cwd） | exit0，11→11、added=[]；局部真实TS诊断multiset，非全项目绿 |
| `node tests/filter-copy-mvp-maps/check.mjs --before` | exit1，0 pass /42 expected semantic fail /0 execution，原提前完成fingerprint |
| 同上 `--types` | exit0，29→28、added=[]；内存allowJs:true，不修改tsconfig，非全前端通过 |
| 原独立报告附录18条重放（内存，当前生产） | 18/18满足拒绝或正确清理预期：14同turn error/destroy已返回false；4 adopt→refresh→unmount两plot各destroy一次 |
| 七fixture×error/destroy×微任务深度0..12 | 182/182通过：56在prepare直接false，126虽已返回handle但metadata读取拒绝；全部effects=0。是有限分层加源码无await边界分析，不声称枚举无限所有调度 |
| 七fixture×handle.dispose/unmount/stale，读取metadata前独立触发 | 21/21拒绝，effects=0；正常重复读取getter始终返回同一个metadata对象 |
| 真实wrapper getter-error端口probe | 正常对照ok、2 writes/1 snapshot；注入get metadata throw paste_map_cancelled后返回paste_failed、0 writes/0 snapshot、candidate nodes=0、旧tree保持、dispose恰1，随后unmount不重复。实际wrapper控制流、API与renderer端口double；不是完整真实地图库→wrapper集成 |
| 真实getMapScene复用矩阵 | 10语义反例/2通过/0execution，详C2V-004与附录A |
| `node tests/filter-copy-mvp-renderers/check.mjs` | exit0，24pass/0semantic/execution、unhandled=[] |
| `node tests/filter-copy-mvp-tooltip/check.mjs` | exit0，10pass/0semantic/execution；实际shared tooltip模块，host/G2 double |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit0，13组；C2接口兼容回归，不能以adapter double代替真实地图ready |
| C2 11生产+maps runner定向ESLint；G2 stylelint；完整G2 SFC parse/script/template编译；定向diff-check | 均exit0；style仅3条既有deprecated规则提示 |

Durable细节：四份新repo相对snapshot均存在且SHA逐项匹配。runner按 `fs.readFile(item.snapshot)` 解析当前cwd，首次在frontend cwd直接用该新manifest出现ENOENT，是执行错误，未计为RED；在repo根运行上列原runner命令即正确重放，不依赖/tmp，也未改manifest/runner。旧manifest原字节未覆盖。

metadata逻辑源码核对：renderPreparedMap await前后和Promise.race后已复核closed/current；从最后一次assert到创建返回对象没有await。handle一旦fulfilled不可撤销，之后由metadata getter检查桥；真实wrapper在设置node.handle之后、任何canonical写之前同步取metadata，getter错误走catch和finally dispose。getter读完到同步发布段无await，普通SDK异步事件不能插入其间；未把任意用户恶意getter或全局Store任意异常扩成事务保证。

## 已查无新增问题维度

- 三L7规定5/1/2 layers、四L7Plot含Dot的必要事件顺序；监听先于add、scene loaded不单独ready、callback throw/error/timeout/discard/late均有原49条见证。五地图class/point-fallback/真实label-layout未被repair改写。
- `canPrepareFilterPasteMap`只读已有设施/区域cache，preparedMapKey不查询配置或写security全局；缺基础设施七fixture明确拒绝，0query/业务setter，custom_未静默从产品分母删除。前置wrapper地图gate兼容回归通过。
- stage clone和唯一suffix、局部chart.id不写回canonical；kind:g2、drillFilters、publishOrigin及originData准备时固定；所有上述prepare失败及metadata拒绝均未发业务Store/事件。没有提前发布的新的确定反例。
- 本次局部releaseMapPreparation在四L7Plot清理分支已区分桥持有旧实例和普通刷新当前实例，dispose/unmount幂等；没有以修ready Promise引入重复query/draw。
- 初始化修复的helper不再value import图库util；局部JSON string/object和preparedAreaId短路语义保留，helper SHA完全不变。静态直接依赖检查未见新增边；未声称完整模块环证明或浏览器冷路由重验。
- shared tooltip生产字节未被此次C2 repair改变；实际tooltip10回归与C1 renderer24均通过。symbolic shared-hover seam上限已明确更正，没有将noop通过当真实hover解绑通过。

## 未验与修后准入预测

未执行真实浏览器/WebGL/供应商key与冷SDK/地图资产、query/真实权限、真实地图→wrapper publish/dirty/保存离开重开、像素/字体、mobile/lib、全部49type source与target、插件installed盘点。common_antv的其它真实mapRendered/qq内部timer、hover拾取与全模块初始化仍不是本probe覆盖；附录A仅复用完整getMapScene函数与所声明SDK seam。使用SDK源码核协议不等于运行供应商SDK。普通刷新定时器尚未启动即卸载等全面旧异步问题仍属迁出范围，不能把这里的清理矩阵扩大为全部日常异步生命周期保证。

当前仍BLOCKED，C2不能成功采用准入。Builder需在精确写域闭合C2V-004，保持C2V-001/002已通过的原反例及182/21边界，不用只增加延迟或忽略错误掩盖。修后若同类scene交接、现99/24/10/13及类型/风格检查通过，可预测**有限C2实现准入**，仍需真实地图/query/save与全MVP独立验收。下一轮为本实现第3/3轮；若预算用完仍有blocker，应保留所有未完项并仅推进独立安全工作，不能重命名重开预算或缩小分母。

## Read Manifest（13项入场/写前匹配）

| 路径 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints/SKILL.md` | `c4d8463bc350c44ad600c92400f783c565b2e968720bfeed1df67a49112b8933` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/MvpScopeAuthority-20261027.json` | `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiC234ConcreteFixtures-r001.json` | `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC2Maps-r001.md` | `96b9cff00d14666e584f9a8b6e8581355691de06e45ee1f238ad58796c7dcbfa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C2InitializationRepair-r001.md` | `bccdd2501549ff5c2c36bdb27cca48d4d0005b7b08b8f54ef19fbf6a8be518ef` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r001.md` | `21e275bde342ef9aabf8e7c9d29795029566fcac77f10eb3b464e406a24b2a84` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C2LocalRepair-r001.md` | `6e38630e61b7f01b131f76c13a28ec303ae708716b3ba1b31e8aa69a601be561` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c2-local-before-r001/durable-manifest.json` | `e3c37e107e5e6d23bcf5a472987ce6b84d0693abbdba0253085b0d29564da5c7` |

## 当前源码、runner和环境协议依据

以下独立运行前后字节复算一致；SDK条目为当前已安装依赖的只读协议依据，不纳入Git源码或产品交付物。

| 路径 | SHA-256 |
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
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `e99bbf771b67442558e140f3df238032e6afe3fd5b3922e18024a4262b2e1b02` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `core/core-frontend/tests/filter-copy-mvp-maps/check.mjs` | `9a78467150a0ad04243b74370733007cace11208bbda27b5a84dbe35ef544a54` |
| `core/core-frontend/tests/filter-copy-mvp-maps/README.md` | `e688b46d0cacdb9014dd5534727c904aebc90ed013ee579cb289f2bb56756f4e` |
| `core/core-frontend/src/views/chart/components/js/panel/common/common_antv.ts` | `d1ae2347516af2cfb96667ce721c0394ab93d32ac20f8af745940d7d209da77d` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a` |
| `core/core-frontend/tests/filter-copy-mvp-renderers/check.mjs` | `7d00e3274b48c6629336c083bdb9029cd82bc2202ed89bf54f949f48ea59745f` |
| `core/core-frontend/tests/filter-copy-mvp-tooltip/check.mjs` | `79545a2f255b07622c313b4237946a89bf0b87d08fa2522ef0b7a0375fbe7c65` |
| `core/core-frontend/node_modules/@antv/l7-scene/lib/index.js` | `b175e155b1571a00dd03430f67118d9eaedc9c47029437e798d3acd27e084ec0` |
| `core/core-frontend/node_modules/@antv/l7-core/lib/services/layer/LayerService.js` | `310c08c107237a067f326a685dadfd36b7227413829a3ecedd7519953b7bbce8` |
| `core/core-frontend/node_modules/@antv/l7-core/lib/services/scene/SceneService.js` | `f142520ccdb2ee3621a581ca0545cc06dfc0ecbb4d5d367d7bb918d09aae6a98` |
| `core/core-frontend/node_modules/@antv/l7-layers/lib/core/BaseLayer.js` | `05f156316c3598aabfd0a6bbda747527ba68ae57d854952af35e66407558249f` |

## 附录A：真实getMapScene复用、resize与最终清理完整probe

在 `core/core-frontend` 运行下列脚本（`node --input-type=module` heredoc）。不写磁盘。getMapScene整函数从生产TS AST提取；SDK的removeAllLayer语义按当前安装源码的调用链补齐，SDK依然是协议double。报告中的10个失败是打印结果中beforeRelease.destroyed=true；symbolic resize两项应false。

```javascript
import fs from 'node:fs/promises'
import ts from 'typescript'
const file = new URL('./tests/filter-copy-mvp-maps/check.mjs', import.meta.url)
let source = await fs.readFile(file, 'utf8')
source = source.replace(
  "const root = fileURLToPath(new URL('../../', import.meta.url))",
  'const root = ' + JSON.stringify(process.cwd() + '/')
)
source = source.replace('createRequire(import.meta.url)', 'createRequire(' + JSON.stringify(file.href) + ')')
for (const spec of ['@vue/compiler-sfc', 'typescript', 'vue', 'lodash-es'])
  source = source.replaceAll("from '" + spec + "'", "from '" + import.meta.resolve(spec) + "'")
const common = await fs.readFile('src/views/chart/components/js/panel/common/common_antv.ts', 'utf8')
const ast = ts.createSourceFile('common.ts', common, ts.ScriptTarget.Latest, true)
const fn = ast.statements.find(x => ts.isFunctionDeclaration(x) && x.name?.text === 'getMapScene')
  .getText(ast).replace(/^export\s+/, '')
const code = ts.transpileModule('const selected = ' + fn, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 }
}).outputText + '\nselected'
source = source.replace('getMapScene: async () => new Scene(),',
  `getMapScene: async (...args) => vm.runInNewContext(${JSON.stringify(code)}, {
    CUSTOM_TILE_MAP_TYPE:'customTile', isCustomOnlineMapScene:()=>false,
    Scene, mapRendering:noop, mapRendered:noop, getMapObject:()=>({})
  })(...args),`)
source = source.replace('    getLayers() {\n      return this.layers\n    }', `
    getLayers() { return this.layers }
    async removeAllLayer() { for (const layer of [...this.layers]) layer.destroy(); this.layers=[] }
    setPitch(){} setMapStyle(){} setZoomAndCenter(){}`)
source = source.replace('  let host\n', '  let host\n  const resizeCallbacks=[]\n')
source = source.replace('      ResizeObserver: class {\n        observe()',
  '      ResizeObserver: class {\n        constructor(cb){resizeCallbacks.push(cb)}\n        observe()')
source = source.replace('  const carousel = {',
  '  const carousel = {\n    enqueueResize: (id, task)=>task(),')
source = source.replace('    proxy,\n    layers,',
  '    proxy,\n    resize:()=>resizeCallbacks[0]([{borderBoxSize:[{inlineSize:900,blockSize:700}]}]),\n    layers,')
source = source.slice(0, source.indexOf('\nlet passed = 0,')) + `
let failed=0, passed=0
for (const trigger of ['renderChart','resize'])
for (const release of ['unmount','handle-dispose'])
for (const id of ['map-flow','map-heat','map-symbolic']) {
  const s=await load(id,'normal'), pending=s.prepare(); await sleep(15)
  for (const l of s.layers) l.emit('inited')
  const result=await pending
  s.binding.current.value={...s.binding.current.value,phase:'active'}
  if (trigger==='renderChart') await s.proxy.renderChart(s.response); else s.resize()
  await sleep(15)
  const before=s.scenes.map(x=>({destroyed:x.destroyed,count:x.destroyCount}))
  if (before.some(x=>x.destroyed)) failed++; else passed++
  if (release==='unmount') s.unmount(); else result.handle.dispose()
  s.unmount()
  console.log(JSON.stringify({id,trigger,release,initialOK:result.ok,scenes:s.scenes.length,
    beforeRelease:before,afterRelease:s.scenes.map(x=>x.destroyCount),vueError:String(s.error()||'')}))
}
console.log(JSON.stringify({semanticFailures:failed,passed,execution:0}))
`
await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))
```

## 附录B：182微任务与21返回handle边界probe

沿附录A的runner读取/root/createRequire/package替换四步，**不替换getMapScene或SDK**，将底部测试驱动改为下列内容再data-import；保留原load与实际生产控制流。该probe明确在metadata读取前等待所注入事件完成，避免把采用后的任意故障扩大成采用前断言。

```javascript
const maps=['map-flow','map-heat','map-symbolic','map-polygon','bubble-map-polygon','map-point','bubble-map-point']
const complete=s=>{
  if(s.layers.length) for(const l of s.layers) l.emit('inited')
  else { for(const p of s.plots) p.emit('loaded'); for(const d of s.dots){d.emit('add');d.emit('loaded')} }
}
let checks=0,rejected=0,getterRejected=0
for(let depth=0;depth<=12;depth++) for(const event of ['error','destroy']) for(const id of maps){
  const s=await load(id,'normal'),pending=s.prepare(); await sleep(15); complete(s)
  let fault=Promise.resolve()
  for(let n=0;n<depth;n++) fault=fault.then(()=>undefined)
  fault=fault.then(()=>{(s.layers[0]||s.plots[0]).emit(event,new Error('depth-'+depth))})
  const result=await pending; await fault
  if(result.ok){assert.throws(()=>result.handle.metadata,/paste_map_cancelled/);getterRejected++;result.handle.dispose()}
  else rejected++
  assert.equal(s.effects.length,0);checks++;s.unmount()
}
for(const action of ['dispose','unmount','stale']) for(const id of maps){
  const s=await load(id,'normal'),pending=s.prepare(); await sleep(15); complete(s)
  const result=await pending;assert.equal(result.ok,true)
  const metadata=result.handle.metadata;assert.equal(result.handle.metadata,metadata)
  if(action==='dispose')result.handle.dispose()
  if(action==='unmount')s.unmount()
  if(action==='stale')s.invalidate()
  assert.throws(()=>result.handle.metadata,/paste_map_cancelled/)
  assert.equal(s.effects.length,0);result.handle.dispose();s.unmount()
}
console.log(JSON.stringify({checks,rejected,getterRejected,extraHandleBoundaries:21,failed:0}))
```

本报告自身SHA由写后独立重算回传root；不写自指摘要、不更新旧r001结论或Goal终态。
