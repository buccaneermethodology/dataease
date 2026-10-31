# C2 地图独立反例局部修复候选 r001

记录时间：2026-10-27T07:06:28.392716+00:00。Builder：`/root/line_construction_builder`。当前结论仅为两项局部修复已落地并自检通过，待独立第2/3轮 delta Validation；不宣称C2最终准入、全部49类型、22项MVP或原Goal完成。

## 范围、授权与写前保全

原始目标仍是全部支持图表的基本多条件筛选复制粘贴界面MVP；通用迟到污染与全面资源治理已迁出，不因本次局部修复重新引入。独立 `reviews/SliceC2Validation-r001.md`（SHA `21e275bde342ef9aabf8e7c9d29795029566fcac77f10eb3b464e406a24b2a84`）第1/3轮发现 C2V-001/P1、C2V-002/P2 两个当前实现blocker及 C2V-003/P3 陈述更正。本轮修复全部两项，并明确更正第三项，不首阻断后漏查同类。

已消费修复卡 `planning/s02-mvp-c2-local-repair-r001-card.json`，canonical SHA `2b105f0539e6ba857f5d9406ef44e218132c8943e8fc3b469dd627ec8829882e`；Context SHA `e6df1e52ab10570f275bc6666b301ae2ed09d76ab0b23b229506bcb76196da4f`，Topology r453。卡与Context验证exit0，10项required-read SHA逐项一致，5条精确action=builder/target admissions均exit0。只有G2 SFC、maps runner、README与本报告发生写入；ready helper虽在准入域内，因既有closed/check已正确保留失败状态，无需改写。未变更tooltip代码、地图五classes、wrapper、冻结fixture/Goal/Design/Cases、旧报告或原49期待，无安装/构建/重启/提交/推送。

写前实际字节已保存到 `/private/tmp/de-c2-local-repair-r001-before/manifest.json` 及对应四文件副本，父代理收到保全目录与复制artifact请求；此路径为临时保全，不能冒称已是durable artifact。before helper SHA `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb`；before G2 SFC SHA `c806b8375062aa423ea9301721cf9a3445b2a845d704e026a67c07e51acf1805`；before maps runner SHA `62a7e464c593e70b73da1881087faff877fe117dc70a6fc5e60c8d03d5569747`；before README SHA `0b186a96ad4db74707914cde5865278c19b8d32b1dd1ec760c8c726b304ec465`。runner按manifest校验原SHA后应用生产快照，可通过显式 `--repair-manifest=` 重放父代理归档后的相同字节。

## 根因与最小改动

### C2V-001：已知失败状态穿过 fulfilled ready 与后续微任务

ready helper在最后必要事件后resolve Promise；再error/destroy只能关闭桥并释放资源，不能撤销fulfilled。原SFC随后仅复核operation存活，遗漏桥已失败。现于draw返回后、await ready后、renderChart/Promise.race返回后调用既有ready.check，失败即拒绝当前prepare。在handle已返回、调用方尚未采用的后续微任务窗口，metadata getter再次检查桥；getter返回prepare时已固定的原metadata对象，未延迟重新计算originData。当前真实wrapper在同步发布段之前读取metadata，读取失败走原catch；此整合位置已读源确认，本runner未挂载完整wrapper，不能把这段静态接线称真实wrapper发布实测。

前28项error/destroy反例要求prepare结果false；后14项在prepare已返回时，JavaScript Promise不能被改写，检查的是失败handle在同步采用前不能再提供metadata，effects仍0。没有把这两个时间窗混称为全部返回false，也未用延迟sleep替代成功边界校验。

### C2V-002：桥持有的旧实例与普通刷新后的当前实例混淆

新增本组件局部mapPasteInstance记录严格准备的实例。releaseMapPreparation仍由原桥释放其持有资源，只在myChart确为同一实例时置空。普通L7Plot刷新若将替换这个旧strict实例，先通过桥释放再走原draw，避免对旧plot重复destroy；刷新产生的新plot保留当前myChart引用，后续unmount或旧handle.dispose走原清理。dispose后再unmount的double场景也要求每个plot恰好destroy一次。没有增加全局注册、跨组件调度或供应商资源框架。

### C2V-003：历史陈述更正

原C2报告“候选跳过共享hover adapter”应限为map/bubble/point显式跳过；symbolic.drawChart仍调用buildTooltip，后者在tooltip.show检查前调用bindMapHoverTooltipRefresh。其注册沿本候选容器，存在scene.destroy cleanup；本轮不增加未证实的产品blocker，也未扩大写域修symbolic。现maps runner该adapter为noop double，99绿不证明真实hover注册/解绑。原C2报告保留字节，本报告和README承担更正。

## 可信 RED 与实际回归

先在生产写入前按独立报告附录执行完整真实SFC/地图类/ready桥探针：14个最后事件同turnerror/destroy均ok:true且scene/plot已销毁，sharedWrites=0；4个采用→普通刷新→unmount均两个plot destroyed=[true,false]。独立18反例复放为18 semantic failure、0execution。尚未运行wrapper publish，未声称观察到Store污染。

随后将原18反例追加到maps runner，保留原49期待；补14个ready后微任务失败、14个handle返回后metadata读取前失败、4个refresh→旧handle.dispose，共新增50项。SDK double追加destroyCount观测，不改变真实准备控制流或ready事件自动时机。同一当前runner对写前两生产快照执行，结果原49 pass / 新增50 semantic failure / execution0；当前源码执行99 pass / failure0 / execution0。50是组件检查条目，不是50个不同缺陷或图表类型。

| 实际命令（core/core-frontend） | 实测结果 | 边界 |
| --- | --- | --- |
| 独立附录内存18探针 | exit1；18 semantic失败、0execution | 写前原真实SFC/地图类链与SDK double |
| `node tests/filter-copy-mvp-maps/check.mjs --repair-before --repair-manifest=/private/tmp/de-c2-local-repair-r001-before/manifest.json` | exit1；49 pass、50 semantic fail、0execution | 当前测试驱动+SHA校验写前两生产字节 |
| `node tests/filter-copy-mvp-maps/check.mjs` | exit0；99/99、0semantic/execution | 原49+新增50组件条目 |
| `node tests/filter-copy-mvp-maps/check.mjs --repair-types --repair-manifest=/private/tmp/de-c2-local-repair-r001-before/manifest.json` | exit0；11→11、added=[] | 仅本轮ready helper/G2 SFC真实TS语义diagnostic multiset |
| `node tests/filter-copy-mvp-maps/check.mjs --types` | exit0；29→28、added=[] | 既有C2完整写域对原C234基线的局部类型对照 |
| `node tests/filter-copy-mvp-renderers/check.mjs` | exit0；24/24、0semantic/execution、unhandled=[] | C1 renderer真实完整SFC组件回归 |
| `node tests/filter-copy-mvp-tooltip/check.mjs` | exit0；10/10、0semantic/execution | tooltip shared真实模块，DOM/G2宿主double |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit0；13/13 | 当前wrapper13；子端口/Store double，非本次真实地图发布集成 |
| 两准入生产+maps runner focused ESLint | exit0 | 定向lint |
| G2 SFC stylelint | exit0，仅3条既有规则deprecated警告 | 定向style |
| 本写域git diff --check | exit0 | 差异空白检查 |

## 已检查、未检查与准入预测

已检查原三L7必要layer与四L7Plot/Dot事件、同turn失败、ready后微任务失败、已返回handle采用前已知失败、采用后普通刷新当前实例清理、old handle dispose/unmount幂等、无共享业务写、原49组件语义及C1/tooltip/wrapper回归。修复两项共同根因，未观察到同一有限检查域中的剩余确定blocker；这属于Builder自检，不构成独立第2轮结论。

未检查真实WebGL、供应商SDK/真实key或地图资产、query/真实权限、真实wrapper发布/dirty/保存重开、字体像素、mobile/lib、49逐type/source-target或插件盘点。真实common_antv地图callback/qq内部timer及hover仍是显式provider seam；destroy double记录“生产调用了destroy一次”，不证明SDK内部GPU资源完全释放。通用晚到污染、全面资源治理与采用后任意异步错误恢复仍未迁回本任务。

生产于 `2026-10-27T07:02:55Z` 通知父代理冻结，实际仅G2 SFC改变且未改tooltip区块；barUtil、common_antv、G2TooltipCarousel与新interaction helper保留上一轮冻结SHA。下一步为父代理保全before包、真实界面链与独立第2/3轮delta Validation；若两blocker关闭，只能预测有限地图模块可准入，不能据此升级MVP/Goal。

## 最终字节

路径相对core/core-frontend；ready helper是读取核对但未改的原字节。

| 文件 | SHA-256 |
| --- | --- |
| `src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `e99bbf771b67442558e140f3df238032e6afe3fd5b3922e18024a4262b2e1b02` |
| `tests/filter-copy-mvp-maps/check.mjs` | `9a78467150a0ad04243b74370733007cace11208bbda27b5a84dbe35ef544a54` |
| `tests/filter-copy-mvp-maps/README.md` | `e688b46d0cacdb9014dd5534727c904aebc90ed013ee579cb289f2bb56756f4e` |
