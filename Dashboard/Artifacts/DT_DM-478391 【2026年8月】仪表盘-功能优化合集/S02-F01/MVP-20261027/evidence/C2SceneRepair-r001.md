# C2V-004 scene交接局部修复候选 r001

记录时间：2026-10-27T07:52:57.252339+00:00。Builder：`/root/line_construction_builder`。此报告为局部实施与自检，不是独立Validation；候选待本实现第3/3轮独立验证，该轮为累计上限。若仍有阻断必须原样保留，不重开预算或改名绕过。

## 范围、完整发现与准入

原Goal仍为权限测试桩下全部支持图表基本多条件整树复制粘贴界面MVP，22项/49内建type/原历史身份保留。本轮只修独立`reviews/SliceC2Validation-r002.md`中C2V-004/P2：三L7 strict准备成功后，普通scene复用触发旧layer正常destroy，原桥将其当失败而销毁active scene。原001/002有限失败边界、003更正继续保留；本轮未引入新authority问题或迁回全面资源/通用异步工程。

已复验修复卡`planning/s02-mvp-c2-scene-repair-r002-card.json` canonical SHA `0caa7b7560e1ab0efc51bd6ea38fd5b2b36fdcf71c60ec315fbd2181e2fc7a33`，Context SHA `87622a0bf4ab3e9bcbd154c116fbc80c13a639e9f690f21e6dcc521f21187564`，Topology r462；card/context及所有required-read SHA、6条精确action/target admissions均验证pass。四个既有写域文件先完整保全到准入durable目录`c2-scene-before-r001`并写manifest。before SFC为`e99bbf771b67442558e140f3df238032e6afe3fd5b3922e18024a4262b2e1b02`，ready helper为`71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb`。

未改原Goal/Design/Cases/fixture/Review/旧报告、tooltip、五map classes、wrapper或通用资源设施，无安装/构建/重启/数据库写/Git发布。生产唯一增量是G2 SFC renderL7中两行（说明注释+条件release）；helper不改。

## 原样复现与最小修复

先原样执行r002附录A，使用完整真实SFC、三地图class、L7Wrapper/ready桥，完整生产getMapScene函数由真实TS AST提取，SDK为明确协议double。按已安装L7源码核对Scene.removeAllLayer→LayerService.removeAllLayers→layer.destroy协议；before输出持久保存为`c2-scene-before-r001/r002-independent-probe-before.jsonl`。

实测flow/heat/symbolic×renderChart×unmount/handle.dispose六案，以及flow/heat×resize×unmount/handle.dispose四案：准备初始ok、复用scene在最终清理前已destroy且count1，最终count2。symbolic resize两案按现有策略不重画，清理前活、最终count1。共10语义反例、2正对照、0执行错误，Vue error为空；未把缺provider/编译异常计RED。

采用卡与独立报告明确允许的“先释放旧strict实例，再走正常新scene”方向：普通renderL7定时器进入draw前，如myChart仍是mapPasteInstance，则调用既有releaseMapPreparation。原桥销毁其持有旧scene并精确置空同一myChart；原drawChart(chartObj:null)通过真实getMapScene正常new scene。正常新wrapper无strict layer错误监听，后续普通刷新继续按原getMapScene复用该新scene；最终unmount/handle.dispose沿既有当前myChart路径释放新scene。

没有让closed重开、全局忽略SDK error、过早注销采用前监控或新增注册框架。旧strict scene应释放一次，当前正常scene必须活；所以新oracle按明确实例身份判断，允许历史旧scene已销毁，不将“所有历史scene均不能destroy”误套到合法新scene方向。symbolic resize现策略不变；四L7Plot此前正确的精确owner路径不变。

## 落地检查与实际结果

runner保留原99期待；将独立r002的182微任务和21返回handle边界原意落为维护检查，新增12 scene矩阵（其中10反例/2symbolic resize正对照）与3个无filterPaste参数的真实legacy地图类draw/reuse对照，共317条。真实ResizeObserver callback被捕获触发；后续第二次普通renderChart也验证复用同一正常新scene，旧/新scene最终destroyCount全部1，handle.dispose后再unmount不增加。

仅scene/legacy15条选择完整生产getMapScene函数，其他原有provider seams保留其原证据上限；未把整个common_antv声称全真实加载。SDK map style/getMapObject/DOM/Store等为double，removeAllLayer销毁layer的语义按已安装代码补齐。legacy三条是地图类默认draw/reuse，非无binding完整UI验收。

| 实际命令（core/core-frontend） | 结果 | 证明边界 |
| --- | --- | --- |
| 独立附录A写前完整probe | 10语义反例/2通过/0执行错误 | 原scene复用路径，SDK协议double |
| `node tests/filter-copy-mvp-maps/check.mjs --scene-before` | exit1；307 PASS/10 semantic fail/0execution | 同一当前driver + SHA绑定写前两生产字节 |
| `node tests/filter-copy-mvp-maps/check.mjs` | exit0；317 PASS/0semantic/execution | 99+182+21+12+3组件/协议检查条目，不是317种图表 |
| `node tests/filter-copy-mvp-maps/check.mjs --scene-types` | exit0；11→11、added=[] | 本轮两生产真实TS/compileScript诊断multiset；非全项目类型通过 |
| `node tests/filter-copy-mvp-maps/check.mjs --before` | exit1；0 PASS/42 expected semantic fail/0execution | 原提前完成fingerprint与原manifest SHA |
| `node tests/filter-copy-mvp-renderers/check.mjs` | exit0；24 PASS/0semantic/execution/unhandled | 当前完整SFC局部组件回归 |
| `node tests/filter-copy-mvp-tooltip/check.mjs` | exit0；10 PASS/0semantic/execution | 真实shared tooltip模块，宿主double |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit0；20 PASS | 执行时父代理已追加DEV观测，故实际为20，原13保留；API/子端口/Store double |
| 两准入生产+maps runner focused ESLint | exit0 | lint |
| G2 stylelint | exit0，仅3条既有规则deprecated | style |
| G2 parse/inline compileScript/compileTemplate | exit0；errors=[] | Vue实际编译 |
| 本写域git diff --check | exit0 | 空白差异 |

当前wrapper runner SHA `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a`，记录实际适配时点，不将他人的DEV观测或测试作者成果计作本修复独立验证。原99里四L7Plot的8个refresh→unmount/handle.dispose检查与当前新增scene检查一起通过。182分层/21 handle仍要求已知失败的metadata不能采用、effects0和同一metadata对象，不把fulfilled Promise说成能撤销。

## 同类检视、未验与下一步

已检视三L7普通renderChart、flow/heat真实resize回调、symbolic resize无重画对照、首次strict→normal交接、后续normal→normal复用、unmount/旧handle.dispose及其后再unmount、四L7Plot原清理、准备期error/destroy/timeout/discard/late、0..12微任务及返回handle的dispose/unmount/stale、legacy地图类默认复用、C1renderer/tooltip/wrapper兼容。本有限矩阵未发现剩余确定blocker，结论仍为Builder自检。

未执行真实浏览器/WebGL/供应商SDK或key、冷SDK/真实地图资产、真实地图→wrapper publish/dirty/query/权限/保存离开重开、字体像素、mobile/lib或49逐type。destroyCount表示生产调用SDK destroy次数，不是GPU资源释放实测。真实getMapScene的其它map类型/customTile/供应商内部callback、qq内部timer、hover注册/拾取仍未由此matrix证明。普通draw已开始后全部异步时点、启动前即卸载等全面旧生命周期仍属此前迁出范围；不因本两行交接修复宣称其闭合。

生产在`2026-10-27T07:49:43Z`通知父代理冻结，最终G2仅本两行增量；C1tooltip共享字节与此前所有旧C2报告均保留。下一步为本实现独立第3/3轮。若该轮仍有blocker，应记录全部发现与未完AC，推进独立安全工作，不重开轮次或缩小原分母。即使本模块准入，也不能替代真实地图/query/save和全MVP/Goal验收。

## 最终绑定

路径相对core/core-frontend；ready helper只读核对未改。

| 文件 | SHA-256 |
| --- | --- |
| `src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa` |
| `src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `tests/filter-copy-mvp-maps/check.mjs` | `c2d4d18c37e328faa0611d7ea0dee90a6117fcab29dcb957e96048b67a01522b` |
| `tests/filter-copy-mvp-maps/README.md` | `54c5929319bde9a510a323796583976bf76aba5d6693649c6ecc26b974a9da65` |

写前保全与反例输出（相对MVP-20261027）：

| 文件 | SHA-256 |
| --- | --- |
| `c2-scene-before-r001/manifest.json` | `b233ab864ba2822083bb5b89936b3df4c3219a0f4ddb1b880516eed7c39b3688` |
| `c2-scene-before-r001/r002-independent-probe-before.jsonl` | `86d4d47d8fd3e95611906065388db490ca97db62f12bfb20b0eb7e35f30fb6b7` |
| `c2-scene-before-r001/landed-counterexamples-before.json` | `20bbab249c6cab9aa94edcf01909c4603a667e8bd9546309a2dd688b8732d522` |
