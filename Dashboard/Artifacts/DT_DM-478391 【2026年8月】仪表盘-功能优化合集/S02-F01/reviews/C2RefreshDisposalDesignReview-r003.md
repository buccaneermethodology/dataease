# C2普通刷新完成后清理交接：新设计最后静态审查 r003

**Design Freeze Validity：PASS_WITH_BOUNDS（当前候选设计与50案的静态语义可冻结）；Implementation Entry Readiness：NOT_ADMITTED（本轮不准入RED、harness实施或生产Builder）。** r002的F-R2-001、F-R2-002在本次设计/案例层已闭合，原N1/N2已作准确澄清、N3的产品必要性/授权边界保持。新增确定设计阻断0。本结论不是50案执行通过，不关闭旧C2V-005，不把候选共享卸载工程提升为当前MVP必要变更。

同一**新设计交付物累计第3/3轮，预算至此用尽**；旧C2实现本来第3/3轮BLOCKED保持，不能称这是旧实现第4轮、不能新命名再开设计三轮。当前只交付最后静态判断，未安排继续执行候选。

- reviewed_at：`2026-10-30T22:52:48.562357+00:00`；reviewer/source：`/root/bubble_ready_validator_resumed`。本reviewer未编写本设计/50案或受审SFC/map释放实现，本轮未代修。
- snapshot_id：`S02-C2-REFRESH-DISPOSAL-DESIGN-REVIEW-r003`；as_of_state：当前卡13个唯一输入、r003设计/案例、重基线记录、当前SFC及所需全释放控制链、原两轮新设计报告与旧C2终轮。
- card canonical SHA：`3de04181f740b2b19ab49f83ad89075c63acea099c5a3f7993e3c9b636e0cb7f`；接收端validate/render实际exit0且消费execution_command。14处引用、13唯一文件SHA入场/写前匹配。
- 唯一写入本中文报告，写前不存在。未改产品/测试/设计/案例/旧报告/状态，未执行harness、50案、任何产品测试、编译、构建、安装、UI、HTTP或DB；只读源码及以Python对JSON元数据作集合/期望一致性复算，不把这种结构核对算产品测试GREEN。

## 当前重基线，不能沿用旧源码结论

`C2RefreshDisposalDesignRebaseline-r003.json` recorded_at=`2026-10-30T22:47:25.628300+00:00`，记载首卡因摘要漂移失败关闭；SFC从旧`5ca0da498a294f82b3bb869dc2bcfa71a968b96f0b6ef98f9438cf150755daaa`变为当前`cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5`。当前实际SFC等新卡摘要；本lane未重播历史失败卡验证，不把记录文字冒充另一次原生失败输出。

**本次重新读取当前真实控制链**：renderChart图库分派、ownedLine/legacy分流、active scope发布与dispose、正常L7/L7Plot刷新、prepareFilterPaste/dispose/releaseMapPreparation、onBeforeUnmount、g2-render-attempt完整释放/错误转换、ready桥完整catch/清理、L7 wrapper和各map类返回/cleanup注册、wrapper child条件与parent handle释放。原r002报告仅作为待解决问题清单，不继承其旧SFC源码结论为当前结论。当前strict非ownedLine空判按t-heatmap tableRow的变化可见，不把它当C2新释放实现或暗中回滚。

**机器卡元数据残留必须明示：** 当前card.mode仍`delta`、parent指r002卡，delta_read_set仍列r002设计/Cases；重基线记录与本轮指令要求按当前源码full baseline评估。本lane实际已扩读r003全部case和当前所需完整控制链，没有只读旧delta或遗漏漂移源；但不能声称卡机器字段已变成full_baseline，也不能把该卡作为后来Builder的完整准入。当前只读静态设计判断不因该残留失去内容依据；后续若拟实施必须用实际当时源/范围/拓扑另行准确绑定，不拿本报告掩盖元数据差异。本报告未改旧卡/记录。

## 原范围、当前候选及双Gate

原Goal仍完整38义务（P1 12/P2 26）/内置49，真实权限NOT_RUN/BLOCKED，完整类型0/49及其它原未验边界不减少。旧C2V-005原事实是组件/SDK double层：普通刷新稳定产生新当前实例后，child unmount先destroy，再原handle.dispose对同当前实例重复调用；不是已证明真实浏览器ubo根因、GPU损害或所有清理顺序都错。

当前设计明确选择组件**通用非activeG2Scope释放操作**，承认共用该分支的地图/G2 legacy影响面；它不再被描述为只影响地图。候选方式：先取当前myChart到局部，myChart同步置null，再调用保存对象destroy；handle/unmount沿各自原异常边界；准备期若myChart===mapPasteInstance则先null再cancel ready。activeG2Scope原分支保持，地图类、ready桥、Store/query/save等不改。

当前要求只是静态审查。即使候选Design Freeze有效，也未证明这个共享工程现在必须实施、没有授予产品写入或harness执行admission。Implementation Entry仍NOT_ADMITTED；父Agent继续与此候选独立的原工作，不需要为本报告自动启动新工程。

## r002全部发现逐项处置

| r002项 | 当前r003核对与结论 |
| --- | --- |
| F-R2-001 / G2八案错误oracle混写 | 已为bar legacy与line active具体fixture、prepare/activate/不刷新/完成屏障、真实owner读回、其它cleanup不抛、同VM sentinel身份及每案数值expected分别冻结。正常/throw/顺序的warn/外抛/Error[]不再同一句互斥混写；设计层闭合，未称实际owner已运行 |
| F-R2-002 / 地图throw无标签[1,1] | 14throw保留ID，删除含混expected_counts；L7独立wrapper与四Plot alias分别明确identity_contract、入口/底层SDK body/旧strict三个层次，nondelegate时新body0；原28正常SDK计数未改。设计层闭合 |
| N1 / strict桥throw对照未定义 | 当前明确strict bridge catch只为静态边界；50案没有strict-primary throw运行case，不再称已执行/已覆盖，无须凭空加第51案 |
| N2 / 旧卡轮次文字 | 当前max_claim/execution/设计均说明同一新设计最后3/3；旧r002卡第1/3残留按历史保留，不回写。当前mode/delta_read_set新残留另列上文，不能以口头full baseline掩盖机器字段 |
| N3 / 设计方向不等产品必要性 | 当前设计与父任务均明确候选不实施，shared unmount影响/原C2 double发现不能自动推出当前MVP必须改造或ubo已归因；Implementation Entry不准入 |

r001 F001同步前置采样、F002异常通道、F003共享范围、F004异步跨卸载也逐项回接：前三在本r003静态合同明确，F004按精确范围继续排除，不能写“任意时点/所有清理顺序”完成。

## 50案完整性与可执行oracle

结构独立复算：42地图=原28正常+14throw，另8G2，共50个唯一ID；没有重复/漏编号。原28案对r001与r002逐项比较`case_id/fixture/refresh/order/expected_counts`全部不变；14throw ID对r002也保留；不是以改期望掩盖旧7反例。

### 原28地图正常案

7fixture=`map-flow/map-heat/map-symbolic/map-polygon/bubble-map-polygon/map-point/bubble-map-point`，每型恰4案：无/有稳定普通刷新×unmount→handle或handle→unmount。无刷新主要SDK计数[1]，刷新后[1,1]分别指旧strict和新current，不能合并身份。原count基线与期望7个逆序反例保持。

新增同步采样限定**实际SFC test-only getter**：strict旧主scene/plot在旧owner交接窗口，以及稳定新current destroy入口，都要在外部destroy调用入口读myChart已null；保最终null/后入口与重复计数不增。不得只测手抄helper或只看最终值。采样窗口不含正常绘图内部layer重建，主scene/plot与内层layer/dot不能混一分母。

这是一份可写harness的明确合同，当前harness未落/未执行；原maps runner只管理mapClasses，不能声称已自动覆盖新增8个G2 fixture。未来需要新明确harness才能观察getter、真实G2owner与50案，不要求本静态lane去实现。

### 14地图throw的身份与两层计数

所有14案refresh=true且普通刷新/调度已完成，throw seam在**新current对象destroy入口**：先计入口数并同步采同一SFC getter，再抛同realm Error sentinel，不delegate底层SDK body。旧strict释放不抛，内部layer不计主资源。第二入口及重复调用增量0。

| fixture组 | 生产身份/alias | 旧strict主SDK body | 旧wrapper entry | 新current intercepted entry | 新primary SDK body |
| --- | --- | ---: | ---: | ---: | ---: |
| flow/heat/symbolic（3×2顺序） | 旧L7Wrapper≠旧Scene；新L7Wrapper≠新Scene | 1 | 0 | 1 | 0 |
| map/bubble polygon及point（4×2顺序） | 返回的Plot就是myChart；wrapper label只是同一Plot alias，没有新造wrapper | 1 | 1 | 1 | 0 |

这里Plot新entry和保存的原SDK method body在同一对象，但为不同函数层计数；不能因对象alias而把entry1解释成body也执行1。旧Plot的entry1与body1描述同一个旧主要对象的正常调用，不能把它相加成两个资源。

两种顺序错误oracle分别是：unmount先→现有cleanup捕获/上报一次，后handle不重试也不外抛；handle先→第一次handle.dispose外抛同一sentinel，后unmount不重新记录/不重试。反例不是SDK实际释放成功证明，body0正表示未执行它。

真实源码依据已核：flow/heat/symbolic的strict addCleanup闭包直接scene.destroy，返回L7Wrapper；L7Wrapper strict destroy走filterPaste.dispose且不再直接scene.destroy。普通新L7Wrapper没有filterPaste，destroy才delegate chartInstance.destroy。map/bubble polygon/point构造Choropleth后直接return view，strict bridge cleanup也直接view.destroy；没有额外生产wrapper。当前r003所给0/1层次与这些身份相符。

### 八G2对照的准确条件表

bar和line分别经实际SFC prepareFilterPaste queried success、binding activate，不普通刷新，等prepare和所有已调度draw完成，先读myChart非null并确认实际activeG2Scope为null/非null；禁止直接写owner变量或用owner字符串/地图wrapper冒充分支。其余cleanup double固定不抛；sentinel由同一个VM Error realm构造，比较对象身份。

| owner/fixture | destroy_throws | order | handle外抛同sentinel | unmount外抛 | cleanup warn | scope.dispose错误数 |
| --- | --- | --- | --- | --- | ---: | ---: |
| legacy/bar | false | 任一（2案） | 否 | 否 | 0 | 0/无scope调用 |
| legacy/bar | true | unmount→handle | 否，unmount捕获 | 否 | 1 | 0/无scope调用 |
| legacy/bar | true | handle→unmount | 是，仅第一次handle | 否 | 0 | 0/无scope调用 |
| active/line | false | 任一（2案） | 否 | 否 | 0 | 0，实际返回[] |
| active/line | true | 任一（2案） | 否 | 否 | 1 | 1，Error[]含同sentinel |

八案均destroy_entry_count=1，destroy入口myChart/activeG2Scope=null，第二入口/重复增量0，清理窗口query/store publish0，全局invariant目标修改0。无scope的legacy不伪造scope返回；active的实际scope.dispose返回可用harness wrapper只读记录并原样返回、不改控制流；重复同scope.dispose按原幂等语义为[]，不能把第二个组件入口实际未调用scope误写成又调用了一次。

这些数值与当前source一致：ownedLine只对type=line且G2走createG2RenderAttempt；bar仍legacy。disposeActiveG2Scope先activeG2Scope=null/myChart=null，scope.dispose先closed=true并清登记后清理；runCleanup成功[]，同realm Error原样入Error[]，未抛到handle；component report只在errors.length>0时warn。legacy handle无catch、unmount用cleanup catch上报，其异常边界不同。正常destroy不再被错误要求warn1。

## 当前源码重审与候选释放的安全边界

当前SFC prepare.dispose先alive=false，再releaseMapPreparation、timer/adapter清理；非active现状是`myChart?.destroy(); myChart=null`，unmount非active是cleanup包裹destroy且未清myChart，这仍是旧C2V-005反例的有限机制。**当前并没有新releaseCurrentChart实现。** 设计要求的先null再外部destroy可以在该共享引用层解决已稳定当前实例的两入口交接；方向成立不等于实现已正确。

地图普通刷新在renderL7/renderL7Plot首次strict→normal交接时先release旧strict，之后真正draw新wrapper；当前releaseMapPreparation先cancel再条件null，候选将这个相同实例条件下的null移到cancel前，才能让旧primary destroy同步getter也见null。若myChart已是不同normal实例不能提前清空它；不能用改ready helper catch/SDK类来回避此条件。

当前bar legacy真实draw await后仍可能在chartComponentUnmounted时直接destroy且保留myChart引用；map异步timer/await的更广时序也未全解决。r003明确排除`async draw resolves after unmount and rewrites myChart`及普通非paste全面生命周期；保留F004残余，不因当前50案都是稳定refresh完成前提而声称所有时点安全。

真实wrapper父卸载会遍历pasteNodes.handle.dispose，child renderer受`allEmptyCheck || (chartAreaShow && !showEmpty)`控制；这解释handle可能晚于child释放的有限静态可达性。当前未在浏览器通过清轴/隐藏实际重演，不能说已证真实ubo来源。父先dispose顺序原可通过；本设计仍需保留正反对照，而非把所有dispose都说错。

## 全部非阻断发现与候选上限

**新增blocking=0。** 本次需保留的所有观察一次列明：

1. **R3-N01 / P2 / 机器mode与静态重基线。** 卡仍delta且delta_read_set沿r002；实际源摘要已更新并有重基线记录，本lane实际读当前链，不复用旧source结论。不能声称机器full_baseline校验已成立或把该卡作产品执行准入；本轮不代改卡。此元数据残留未使当前只读设计缺少必要源码。
2. **R3-N02 / P2 / 设计与实施双Gate。** 当前语义可冻结不等共享卸载工程已被授权/必要性已证；Implementation Entry NOT_ADMITTED。未来若拟实施应重新核实际source/topology/Scope与精确action/target/admission；不得把设计最后3/3通过当静默重开旧实现3/3。
3. **R3-N03 / P2 / 未执行的采样与harness。** 真实SFC getter、owner读回、sentinel同realm、两层计数都已明确到可实现oracle；它们当前仍未执行。原maps317只是历史组件检查，不是新50案GREEN或317图表；旧manager只支持map，新增bar/line需相应明确harness，不把缺harness自动算产品RED。
4. **R3-N04 / P2 / 资源与错误边界。** strict bridge内部catch只静态保留，50案无该throw对照；normal当前入口throw/body0不等SDK/GPU释放；active Error[]和legacy直抛不能混写。layer内部销毁/重建、跨VM非Error cause包装都不被本同realm case宣称完整验收。
5. **R3-N05 / P2 / 范围残余。** 异步draw跨unmount重写myChart、普通非paste地图全生命周期、真实SDK/GPU/浏览器可达性、旧ubo/完整交互与权限等均未覆盖。当前不追加全局资源registry、异步取消框架或所有49场景；若未来新证据显示必须扩大，先反馈trigger/impact/recommendation，不能静默加must-have。

没有必要为了这些上限机械再审同一静态设计或改原50案。设计预算已满，不能以报告名或新增wrapper候选绕过轮次限制；之后如需推进，先由父Agent按既有治理明确后续工作边界，不由本lane自动启动。

## 已查无问题、未查原因、同类残余及准入预测

已查无新增问题：14/13主绑定及当前SFC重基线；原r002两P1与全部N1–3/r001四项回接；50ID唯一、原28身份/计数逐项保留、14throw身份alias/entry-vs-body数值及两顺序、八G2bar/line具体owner/准备稳定屏障/正常throw条件数值；真实SFC同一getter入口方案、source error对象身份/同realm、handle vs unmount vs active三通道、ready静态catch及层计数分母；候选共享影响面与active分支不改；查询/Store/目标无副作用约束；RED需execution0且原7反例保持/不预填总失败数；scope/claim与无实施准入。

未检查及原因：本任务仅静态设计审查，未实现/编译harness transform、未运行50案/原maps317/renderer/tooltip/paste/RED/GREEN/lint/类型检查；没有最小产品patch可验。未验真实浏览器child独立卸载/清轴/隐藏、真实SDK/GPU、所有异步时点/取消、真实权限、49类型完整结果或query/save/reopen、最终Dashboard/KB/full-diff/closeout/Stop Gate。不是默认PASS；旧输入哈希/历史GREEN不能填补这些层。

同类残余：最终null不等调用前null（本设计以同步getter解决oracle缺口，未称已执行）；entry1不等SDK body1；body1不等vendor释放成功；double可达不等浏览器可达；设计有效不等产品必要性；新设计预算不等旧C2预算重置。F004异步与原ubo残余继续明确保留。

**有界准入预测：** 未来若父Agent另行合法安排候选工程，当前冻结语义可作为精确harness/RED设计输入；应先绑定当时实际source与唯一harness，按真实SFC正常稳定owner+同步getter+同realm错误通道运行，执行错误不得当RED，原7逆序计数反例与新增同步/throw探针均保留，不预填失败总数。实际实施后同身份50案及适用原317/renderer/tooltip/paste/定向检查才可能支持有限新交付独立判断。当前没有这一准入或执行事实，故**本轮停止在静态候选报告交付，不启动共享卸载工程、不翻转旧C2 BLOCKED**；父Agent继续与此候选无依赖的原工作。

## 输入与最终绑定

| 卡输入（工作区相对路径） | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalDesign-r003.md` | `6a338055474f5b027910399b860d1d0a33db8f95641ed8512610b9e7604ea42c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalCases-r003.json` | `47c22e3cf68d2f26fd4902c781adf52d95a24f6cc118041f54fc7a23900811fa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/C2RefreshDisposalDesignReview-r001.md` | `157ac5b247701cc1f3c1440e06de951a73262ae09e2285363493c026e3efb1e8` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceC2Validation-r003.md` | `17e6566b99fe25194bf957abaf58c95e4398df4d1edf5aee6aec9e3470575ee6` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `cbe650ca9424b73c6ec25e618289ffef5346f6f3ecd7edcdd4d374b09aaa47f5` |
| `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts` | `7ff0a6d2ad931260241a4fc78970a99dc14f78c25bf71234f272a6fc837a90a2` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts` | `71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7.ts` | `94f1e0e47f05b09588bc71818ece4bb284f412fa0afb333b2614e513dd611414` |
| `core/core-frontend/tests/filter-copy-mvp-maps/check.mjs` | `c2d4d18c37e328faa0611d7ea0dee90a6117fcab29dcb957e96048b67a01522b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r557.json` | `acda5be407424572b2ba3c8cd9b1a81c8258d6ba6473e47eb81b4aebc7f6a994` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/C2RefreshDisposalDesignReview-r002.md` | `7fecd27beb623a271dadcd5300262ba925f940e4f4176cead764e47d450114d1` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalDesignRebaseline-r003.json` | `6e63b72dc2d8b2f6945c66669bc35ec5b2f97f648b9c623b7ab2c8a7c70ed80d` |

| 为完整当前调用链追加只读输入 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalCases-r001.json` | `b5a965b46d8524c9d3b27efe608de1d57e115f0ed87f594c38cded488e884242` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalCases-r002.json` | `ba29847e34cb1675ccada49fa3c04d95d552508276849577f13a0e8726ece1a3` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/C2RefreshDisposalDesign-r002.md` | `6c0ce2b3363fa7edafef6cd7cdd9437a61094340321051d368d7717a4197932e` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7plot.ts` | `e63a044bbc5dca7bc07f645faf3df5684f8de8c545339f87fa0ce8978718d6cc` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/flow-map.ts` | `cd6b2233c83fc19ab04b0a3262b44f26ff5934bad7915969586700eebfc71d1b` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/heat-map.ts` | `1b09b6330c31e235923464b75665b814cebe0832a3b9fa3582aaf1279c60c563` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/symbolic-map.ts` | `b5f7235ea6cc373b9fce47b0c95ce09e95f61ff45d6174d759156eb36a97c826` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/map.ts` | `5eeb33eeff060e1a25e48eaa8d836d9e8985c63bfa2ed9d70b513244420c6c12` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/bubble-map.ts` | `29f3d1d86d49563d4ad0bc1c385c242267000c066d5a4c13441520c7af797f04` |
| `core/core-frontend/src/views/chart/components/js/panel/charts/map/point-fallback.ts` | `b2a3c4614defacd6e79ca2d9faccc7513781c020e4ba16fbccfe5da3e5593e7e` |

写前上述输入摘要一致；只新增本报告。项目没有Session registry工具，不声称程序化注册表校验；未更新Goal/冻结证据/Dashboard或执行终态Gate。
