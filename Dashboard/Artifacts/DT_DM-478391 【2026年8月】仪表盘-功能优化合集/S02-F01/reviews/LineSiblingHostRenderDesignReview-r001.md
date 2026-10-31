# 普通折线双 host 设计独立审查 r001

## 三项裁定

- **合同冻结：`NEEDS_REVISION`（需修订）。** 双真实host、按owner守卫、独立current读取和同步发布的架构可实现；但默认渲染回归互斥、两条真实交互链的门控缺口及两类机器oracle问题尚未闭合，当前29 Cases不能整体冻结。
- **仅真实SFC RED runner准备：`CONDITIONAL_ENTRY`（修订后有条件入口）。** 下列有限修订及独立复核完成、冻结Cases，并取得runner-only Card/Context/action-target admission后可以准备。不把缺API、编译失败、初态不成立或与另一冻结合同相反的断言当可信RED。模块导入诊断可另授权，不能记成合同RED。
- **生产源码Builder：`NOT_READY`（未具备准入）。** 尚无本单元独立可信RED及精确生产admission；Line/Carousel构造前置尚须先完成并串行重绑源码摘要。本报告不授权任何生产修改。

本新交付物第 **1/3** 轮独立审查；没有重开旧产品/事务/ownership r003。原10 Goal AC、26 must-have、16产品义务、旧终审残余、真实权限BLOCKED/NOT_RUN均保留。下面是本轮全部合同内发现；不是无限增加未来硬化要求。

## 独立性、绑定与检查

Reviewer/source：`/root/line_stage_construction_design`。我未编写被审双host Design/Cases；此前编写另一个Line/Carousel构造工程的Design，二者必须串行绑定，不能以该身份自验其未来生产实现。本轮唯一写入为本报告。

接收端canonical Card `2aefcb5f718199ae59b93bbd70848a2d0fdd0b5fa51e427a26c22f1cdcbe0c9f`复验pass；Context `d193aef8aafe7e3a8a0c1e201309c72d4d23ca31d3b055ae6b788698374eba53`结构验证exit0，24项required-read摘要全部匹配。Cases所列22项source_manifest另逐项重算也匹配。被审材料：

| 输入 | SHA-256 |
| --- | --- |
| [Design r001](../LineSiblingHostRenderDesign-r001.md) | `e3e93af853ed0c14d20f5645bbcad6a4040c333653b617a8a25fc1b11deace4b` |
| [Cases r001](../LineSiblingHostRenderCases-r001.json) | `205a51d832eb7d50b91ebdb05a52d16d30ce2a8a8ad839b18fb9c5825d2f4fa9` |
| cases数组canonical（UTF-8、sort_keys、紧凑JSON） | `d2524b7574bf59c577ce9b9ad31f04b96d7212960932d2b8c36ee337e5c1c094` |

完整读取Design/Cases、真实SFC/Line/Carousel/tooltip/common_antv、三种hook、现有helper与组件runner、公开父调用方及原终审边界；对需要的实际slider/tiled/pagination闭包做了扩读。结构检查：29个唯一连续ID；每例initial/expected均有全部32字段，没有字段集遗漏。这只证明结构完整，不能替代下列行为/初态语义判断。没有写runner、改源码或运行设计尚不存在的29-case套件。

## 全部合同内发现

### LSHR-001 / P1 / OPEN：默认完整重绘的新旧冻结预期互斥，首RED边界未隔离

**位置：** Design第19、77、129、135行；LSH-001/020/021/029；真实SFC `renderChart:616`、owned full render `:814–827`；旧 `tests/g2-render-ownership/component-check.mjs:596–635`。

新LSH-001调用现有默认`renderChart(N)`，要求draw/render未ready时O仍在myChart、destroy(O)=0；Design又要求既有ownership套件保持。旧冻结G2OWN-C01同一普通请求入口明确检查 **O在N create完成前销毁，N render/afterRender pending时myChart=null**，之后才发布N。旧runner第607/618/626行直接断言该语义。不能让两组相反断言同时GREEN；不能通过改旧Cases、屏蔽C01或把新的生命周期偷偷套给所有默认调用来兑现“回归保持”。本件还声称默认入口兼容，当前设计实际改变的是整个普通full-render生命周期。

另一个同根首RED约束：当前实际template只有一个canvas host，LSH-001 initial_state却已要求host_count=2。若RED先严格核验完整初态，会先因模板初态不成立失败；若runner秘密补第二div或静默跳过该字段，又不能宣称完整真实SFC初态已验证。首RED的baseline适用投影及GREEN完整模板检查必须显式冻结，不能由runner临时猜测。

**最小修订方向：** 保留默认普通renderChart及旧C01语义，引入真实有用途、默认关闭的typed stage mode/端口，让prepareLineStage确实通过该生产路径驱动controller。比如在现有三参后增加typed mode，旧JS入口会忽略该输入并实际销毁O，从而仍可得到行为RED；新mode必须在curView/活动状态修改之前分流，不是仅为测试设的开关。也可采用有可执行生产stub的明确新API，先建立真实行为违约；不得用缺导出/编译失败替代。修订同步校正LSH-001/020/021及29的入口与预期，写明RED基线单host与GREEN双host的分阶段oracle；同一冻结case内容可以预先含两阶段观察要求，但不能执行后换期望。新mode输入本轮尚未冻结，可在r002定稿，不能声称已跑同identity RED。

如果确实要改变默认full-render合同，应先取得明确合同变更authority并说明旧C01如何被正式承接；当前候选没有该变更手续。上述stage mode是可行最小建议，不强制其具体命名或实现形态。

### LSHR-002 / P2 / OPEN：真实dimension slider交互不经过拟新增adapter gate

**位置：** `line/line.ts:855–881`；`common_antv.ts:1017–1128、1216–1290`；Design第40、94行；LSH-018/026。

普通line开启slider后，configSlider→configDimensionSlider把真实`dimensionSliderFilter`放进G2 options。该交互在渲染安装时直接`slider.addEventListener('valuechange', …)`和 **`document.addEventListener('pointerup', apply)`（1120行）**，并有valuechange→RAF→target.setState→await target.update→finally再次schedule的完整链。它独立于`installG2SliderAdapter`；给后者的pointerdown/AFTER_RENDER加guard不会覆盖它。

当前候选明确允许普通line slider，同时承诺stage不注册document pointerup等拖动监听、晚回调关闭后不再应用。仅隐藏B、只门控adapter或者只在dispose后标destroyed，不能防止这条交互在准备期间就注册全局监听；stage的synthetic valuechange/真实其它pointerup也可能启动本instance重绘并与prepare render竞争。它是已经可定位的应用源码路径，不能放进“未知第三方/installer返回前”豁免。

**最小修订：** 将同一可选record guard从Line配置上下文传至DimensionSliderOptions/interaction factory，冻结valuechange、apply、RAF、render及target.update后续的alive/interactive检查；决定document pointerup仅在active交互时惰性绑定，或另一个明确等价方案，stage不得先绑定再立即dispose冒充无副作用。disposer始终解除本次监听、取消本次frame；采用后原捕获交互可用，retire后原捕获函数不能setState/update/schedule。把这条真实factory纳入LSH-018等具名负例，不能只测试installG2SliderAdapter的pointerdown double。候选源码已有Line/common_antv，可在原有可选前端契约增量内完成，不需新依赖/权限API。

### LSHR-003 / P2 / OPEN：tiled legend只门控emit，无法兑现已关闭回调零DOM应用

**位置：** Design第41、90–95行；`g2-legend-tile.ts:100–130、212–225`；LSH-018/029及post_close_application_calls承诺。

候选指定tiled legend向instance发射的emit closure由helper包guard，installer布局/事件加isAlive。但真实applyG2TiledLegend生成的`dataeaseLegendTileFilter`在emit **之前**已修改selected；renderTiledLegend的entry click随后无条件syncSelection，直接写button.style/aria-pressed。保存的旧DOM click callback在owner关闭后仍能走这些局部DOM/selection写入，即使wrapped emit已返回。installer的isAlive与emit gate都不在这条renderer DOM callback入口。

这不要求阻断所有任意JS；它正是本候选已承诺“已捕获晚callback”范围内的生产闭包。现在的测试事件只称point/pagination/slider，不能由它们通过推出真实tiled click已安全。

**最小修订：** 将guard送到真实tiled selection/filter/click/sync callback边界，在改selected和任何DOM写之前分别检查；区分允许preparing时的纯布局同步和必须active的用户filter。补同一真实callback在stage、active、retired三阶段的观察，保留默认无guard行为。同步核实pagination保存的patchedGoTo必须在调用originalGoTo之前检查alive，不能只保护finished→renderCurrentPageLayout尾部；这已在“关闭后零library应用”的原承诺内，不增设新状态机。修订时给出具体入口，不再以“所有callback有guard”总句替代实际闭包接线。

### LSHR-004 / P2 / OPEN：owner外部变化fixture不守资源账，局部状态变更seam仍不足以执行

**位置：** LSH-009..014，尤其LSH-014；Cases oracle_rule第191行；Design第111–113、127–131行。

LSH-014从live=[O,N]开始，把current owner直接设P1，最终要求live=[P1]、destroyed=[N]、draw_calls=1；fixture仅列active_owner/host/display_data三个字段，没有交代 **O如何消失、P1如何取得其G2 handle/host/scope，相关draw/destroy是否计入**。按真实公开render/adopt替换会产生额外分配/释放及stage invalidation；仅写私有pointer则O仍物理存活，不能得出最终live列表。本Case要求actual_sfc，不能把测试写pointer/reducer后的producer快照当资源证据。

同组query/error变更涉及SFC私有chartData/curView/isError。当前harness只授权只读snapshot getter，DSL却说可经“局部状态seam”施加，没有定义可执行入口及其调用计数边界。若经真实calcData制造P1，会有API/emit等外部变化；若通过额外可写AST seam，应明确授权、限于外部输入注入、不能代替被测current重读。layout_epoch/size也应由真实observer/props端口产生，而非只有fixture标签。

**最小修订：** 给六轴逐项列出真实props/API/observer/owner变化步骤、观测起点、物理资源和外部计数；特别明确P1取得/旧O释放，不能凭标签让资源消失。若某轴只适合controller的readCapture边界double，可明确拆成module层证据并另外保留真实SFC接线检查，不将其写成SFC物理替换通过。保留现场P1、禁止恢复F0的核心predicate正确，无需改产品范围。

### LSHR-005 / P2 / OPEN：真实hover兼容例的全程计数和允许行为相冲突

**位置：** LSH-026、shared initial/expected `other_chart_mutations`；`barUtil.ts:433–456、1063`。

LSH-026先激活其它图X的真实hover，要求N采用前不激活、不隐藏X；采用后又调用真实N.tooltip:show并明确允许“X may hide per existing UX”。真实activateHoverTooltip一定在current=X时调用hideActiveHoverTooltip，后者向X emit tooltip:hide。最终完整expected_state仍要求 **other_chart_mutations=0**，而oracle_rule说所有计数从已建立O之后开始，未给phase投影或重置点。正确兼容行为会产生X mutation，若真按全程计数就失败；若runner偷偷只算stage阶段就是改oracle。

**最小修订：** 冻结明确阶段计数：pre-adopt X.hide=0及global registration增量0；post-adopt允许且精确记录X.hide=1；retired N callback增量0。可定义other_chart_mutations只统计stage触发且给出投影规则，或保留全程计数并修期望。不得去重或由guard自报计数。与此同次明确host_count只统计A/B line slots、是否排除保留的legacy层，以及LSH-015第二组件的资源/计数观测范围，避免custom renderer按名字自行解释32字段。

## 已检查且无新增阻断的设计域

| 检查域 | 结论与证据上限 |
| --- | --- |
| 双真实DOM与采用身份 | 常驻两个sibling div、相等非零几何、禁止display:none/移动canvas/改host id、组件uid避免同viewId碰撞，以及ref/getElementById/connected/重复ID验证可实现。legacy层与host_count的统计定义按LSHR-005补清；真实几何仍需浏览器。 |
| 活动与准备owner隔离 | stageEpoch/requestVersion/activeOwnerEpoch/layoutEpoch分开，O guard不因prepare失效、采用后B guard按activeRecord继续存活，方向正确。max O+N与旧attempt settle后复用slot能防迟到删除新portal。 |
| 输入与carousel边界 | ordinary line/array rows/同target/no error/host可用限制明确，carousel true前置拒绝且guard分支不进Carousel；无guard旧Line保持。非法carousel配置仍应按文本明确拒绝，不能真值强转。未把该限制删成Goal非目标。 |
| tooltip与axis gate | 首次WeakSet注册就带正确guard、show在全局hover操作前返回、hide精确owner、afterdestroy总是release该instance的方案可实现。axis tip按host独占；不能在afterdestroy因alive=false整段跳过。LSHR-005是oracle计数问题，不否定该方案。 |
| 已登记资源与异常 | 登记后逆序幂等、先closed再释放、instance最后尝试、主cause和cleanupErrors分通道合理。installer返回disposer前部分资源明确Unknown，LSH-024保留negative witness，没有以“已尝试”证明物理zero leak。 |
| critical section | 采用前独立读current/预备portal及inert；普通div单次data-active-slot属性写后仅私有pointer/phase赋值，无await/响应式写/业务回调；成功后再retire及错误sink。属性写before-effect失败保O、retire失败保持adopted的合同可实现；未承诺任意恶意DOM monkeypatch原子性。 |
| query/Store边界 | prepare不调用calcData/getData/Store/snapshot/emitter，response与displayContext深拷贝，query tuple保持；adopt只改变显示owner，未伪装业务filter提交。当前actions/resize必须按文本真正改读activeRecord，不能仍用旧chartData/curView当N显示数据。 |
| resize/unmount/queue | 一条串行queue、stage失效不先取消O、active resize更新revision、捕获host B/instance、旧forceFit只settle不回放、卸载guards先关后逐owner清理，时序合同可执行。未承诺强制取消永不settle Promise。 |
| API与真实模块验证 | 三个明确stage API/实际defineExpose、template编译挂载、完整SFC/Line/shared模块执行、具名边界double、未知导出/编译错误不能算RED，路线合理；LSHR-001/004必须先把输入和seam对齐。 |
| 源码/治理边界 | 候选清单明确新module、SFC、G2DrawOptions、Line、barUtil、common_antv、三hook；不跨SDK/XPack/权限，不新增依赖。Line/Carousel前置交付后串行重绑SHA，不能用旧design card扩生产写范围。 |
| 原分母与旧残余 | 10/26/16、旧r003 budgets/findings、AM-09、S01条件和真实权限未运行继续保留；本件工程通过也不等于Copy/Paste/MVP/保存重开/Goal完成。 |

## 未检查、同类残余与修后准入预测

未执行29-case正式runner、RED/GREEN、生产实现、真实双host浏览器、整包build/ts:check、数据库或权限调用；原因是本件仍是未冻结设计候选且没有其runner/生产准入。当前结论基于独立完整文档/源码及JSON结构核查，没有把静态正确写成运行通过。未穷举任意第三方constructor内部、无限重入或全部异步硬取消；它们明确在本件合同外，不追加为blocker。

本轮发现之外仍保留：Line/Carousel前置尚未交付的构造资源证据、所有installer返回前allocation、其它renderer、完整stage query/Store/filter树原子发布、跨标签/时间/权限、正常显式保存重开、CFPI/CTPR旧终审未决项。本轮没有发现必须新增权限能力或新增产品业务范围才能修复的阻断。

修后预测：一次修齐以上五项，保留默认旧C01语义或取得明确合同变更authority，给出同源可执行的slider/tiled闭包gate和精确fixture/计数，即可进入第2/3轮有界复核。预计可裁定“合同有界有效 + runner-only条件入口”；不需要另开完整架构设计，也不能现在直接给生产绿灯。

之后顺序固定：独立复核 → 冻结Cases/RED-GREEN同identity与分阶段oracle → runner-only精确Card/Context/admission → 实际module/SFC行为RED且execution_errors=0 → 独立RED Validation → 等Line/Carousel构造前置完成并重绑源码 → 对完整候选源码逐target签发新admission → GREEN及独立实现/真实浏览器验证。现有ownership 23+10+6+8须真实重跑且按明示mode兼容；不能修改旧冻结资产以隐藏回归。父Goal继续，真实权限只阻断相应验收，不阻断这些已授权的非权限修订与工程准备。
