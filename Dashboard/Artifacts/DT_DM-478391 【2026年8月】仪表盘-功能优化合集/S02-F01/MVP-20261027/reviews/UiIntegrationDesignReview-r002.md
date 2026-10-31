# UI 集成设计第 2 轮独立审查：分组件准入

本轮裁定：**C1 为 PASS_WITH_BOUNDS（带明确约定可实施），共同 handle、wrapper、G2/S2/indicator 可立即单独进入 Builder，不等待地图、TinyMCE、图片资产或 49 type 全量运行。** 本报告第 3 节两项字段/案例约定必须被 C1 admission 原样绑定，不能照歧义文字实现。C2/C3/C4 的具体实现路径可行；其故障案例的具体输入仍需补齐，尚不能冻结为可直接执行的可信 RED。所有组件的运行成功发布与产品验收均为 NOT_RUN，而非本设计审查通过。

## 1. 审阅绑定与边界

- `reviewed_at`：2026-10-27T04:41:56.896575+00:00。
- `snapshot_id`：`S02-MVP-UI-DESIGN-REVIEW-r002`；`as_of_state`：Topology-actual-r431，Design/Cases r002，独立设计审查，尚无 C 实现/运行验收。
- reviewer：`g2_closeout_reviewer`；同一 UI 交付物第 **2/3** 轮。r001 与 supplement 合计第 1 轮，旧报告不重写，不重置预算。
- Card canonical SHA：`376647e0d956e83093021cce7fe35f971b127d448225a23a702239dfd3628bfa`；Context 字节 SHA：`707ff07caaeb45201987048e5116333ea590fc82fd79b557794c2128dc883159`。实际执行 lane-card validate，退出 0、verdict=pass；写前重算 21 项 required-read，全部一致。
- 基线 HEAD：`1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。本报告原先不存在；本 lane 只新增本报告，不覆盖既有源码/设计/Cases/其他报告，不暂存或提交。
- 当前 Goal 22 项及历史 16 项 approved_deferred、49 内建 type、插件 installed unknown 均保持；迁出事项不是验收通过。A/B 既有独立准入不重新裁判；A 源码允许并行变化，本轮只扩读其公共接口，未当作 required-read 不变输入。
- A 扩读时点源码 SHA：`ca144eb978ba334c9ba71fc4c6c5d6cefcb4c025ecac15ff2a446f54e8c8cc79`。此时 invalidate 清 clip/identity/resource，增 identityEpoch/editSessionId，**不增 revision**；成功 copy 增 revision。后续 Builder 绑定当时实际接口。
- 使用项目 `sge-governed-checkpoints` 的独立审查路由；仅执行读取、摘要/结构核验与报告写入。没有启动服务、访问数据库、构建或运行产品测试。本报告不替代实现 Validation、宿主能力或 Goal Stop Gate。

## 2. r001 八项发现逐项复核

| 原发现 | r002 可定位修订与复核 | 本轮处置及证据上限 |
|---|---|---|
| UIR-001：图片组实际 Attr 入口 | Design 121–123；Cases05、08-PICTURE；真实父路由排除通用 Editor，Attr 读取 canonical view，纯 getFieldByDQ(type:table-info)，禁止 onDatasetUpdate | 设计路径已补；C4 待实施/运行，入口不再误归通用 Editor |
| UIR-002：地图真实完成链 | Design95–107；10-L7/L7PLOT；L7 scene/layer 与 L7Plot plot/dot 分支、订阅先于 add、回调 body 完成、error/timeout/late、capture 前预热具体化 | 机制设计已补；C2 fixture 残余见第3节，尚无地图运行成功证据 |
| UIR-003：TinyMCE init/content/channel | Design111–113；10-TINY；init 后 setContent、本次内容 DOM、同步 SetContent 先监听、private channel、有限 timeout | 机制设计已补；C3 具体输入仍待冻结，不以 nextTick 替代 init |
| UIR-004：全局字体与 paragraph 副作用 | Design115；10-TINY 与独立 OldFont/oldParagraph sentinel；candidate 禁 appearance 写、editor root 内 p、timer 存活检查与清理 | 设计隔离措施具体；旧源码仍有问题，未声称已修好或 clone 本身可隔离 |
| UIR-005：同 key 提升与 canonical | Design38–85、Cases11四子案；共享 shallowRef、canonical view/element、同步发布标记、metadata 具体分支、calcData 快照一次及后续 undo/redo | 可实施；必须采用第3节请求上下文约定，不能发布整个 request 到 lastRequest |
| UIR-006：图片无 query 分支 | Design89、125–127；08-PICTURE OFF/ON；threshold=false 为0query且无伪 DTO/details/lastRequest，开启+dataset 才是过滤数据正向 | 设计分支已补；C4 正向不能由静态兼容通过替代 |
| UIR-007：每 type 真实完成 | Design133；Cases07/14、per_type_execution；49稳定type、两端身份、query/画面/save/leave/reopen，families仅顺序 | 分母与执行计划已补；49 项运行仍未完成，非2401次E2E要求 |
| UIR-008：稳定子案与具体输入 | 15主ID保留、25稳定子ID唯一；C1 BASE+真实轴+synthetic DTO、独立旧态和真实库故障 seam、明确事件顺序 | C1可用，09联动约定见下；C2/C3/C4仍有描述性输入，保留同类残余，未整项假关 |

## 3. 全部当前发现与明确处置

### UIR-009 / P2：发布 request 与 requestContext 的层次必须明确

Design45 把 `PreparedQuery.request` 定义为完整 `ChartObj`，而 Design80 写 `setLastViewRequestInfo(targetId,request)`，Case11-METADATA common 又写 `chartExtRequest与lastRequest=prepared request`。真实 wrapper `views/index.vue:680–690` 把完整 params 的 **params.chartExtRequest** 存入本地 chartExtRequest/lastViewRequestInfo；自动刷新在 675–680 附近直接将 lastRequest 当 chartExtRequest 复用。照整 request 发布会产生嵌套 ChartObj，后续刷新上下文错误。

**本轮限定的实现约定：** queried 分支先取 `requestContext = cloneDeep(prepared.request.chartExtRequest)`；wrapper `chartExtRequest.value` 与 `dv.setLastViewRequestInfo(targetId, …)` 各写其独立 clone，保持该字段完整 user/filter/linkage/outer/web/drill/resultMode/resultCount 语义。完整 request 仍用于查询/适配核验，不混入这两个上下文位置；static-picture 不写它们。Case11-METADATA 的字段级 expected 也按此层次检查，不能只用泛称 request 相等。这是现产品字段契约消歧，不新增通用框架。

处置：**C1 准入须显式绑定此约定，可立即实施；若 admission 仍引用整 request 写法则该错误发布路径 NOT_READY。** 设计/Cases 原字节未由本 reviewer 改写，后续不能声称原文已经修订。

### UIR-010 / P2：09 身份/剪贴板事件不可声称原始 token 逐字段独立

Cases09-IDENTITY/CLIP 使用相同 `guard_specificity`：其它 token 均等于 capture。但真实 A 公共 API 的 invalidate 同时清 clip、增 identityEpoch/editSessionId；成功 copy 的 revision 同时出现在 clip 与 `getMvpFilterSessionToken()`。这些正常联动不支持照字面“一原始 token 变、其它全部不变”的断言。

**本轮限定的案例约定：** IDENTITY 为“公共身份/会话生命周期失效”事件，记录清 clip 与 epoch/session 联动；CLIP 为同身份/同 editSession 下成功新 copy，断言 identityEpoch/editSessionId 不变、revision 与 clip 内容按真实 API 更新。公共 token 中同一个 revision 不重复当独立轴。其它 target/config/context/TTL 维持各自独立；如需声称每个 guard 分别被验证，另冻结明确受控读取 port 的案例，禁止 runner 偷改私有状态。现公共 API 事件足以证明本包待发布操作应作废，无需为此重写 A。

处置：**C1 可依此立即实施与准备案例；不允许把联动用例报告成所有原始 token 的独立因果证明。** BUSY 第二次 query=0 不意味着第一次必须失败；UNMOUNT 的正常外部销毁也不算 candidate 污染旧态，需检查 candidate 没有额外发布/写入。

### UIR-008 / P2 / PARTIAL：非 C1 组件故障输入仍有未冻结值

25 子案已稳定命名且事件更具体，但以下 fixture 仍主要是构造说明：10-L7 的“各 class 合法经纬/起终点/数据配置”，10-L7PLOT 的 geometry 分类，没有绑定实际 view/element/轴/数据/geo样本；10-TINY 的“合法富文本+数据占位符/显式 synthetic DTO”没有实际正文、字段映射、替换后内容 expected；08-PICTURE/10-PICTURE 的“合法 threshold 图片映射/本地可控资源”没有确定映射、src fixture/ref 和所选图片 expected。runner 仍须自行决定合同输入。

最小补齐：按上述稳定子ID绑定实际 synthetic 配置/DTO、正文与 DOM expected、threshold映射与本地图片 ref，附独立旧态初值；可共用已声明 fixture，不要求启动真实地图或 TinyMCE 才冻结组件故障输入，也不要求通用资源框架。真实业务 E2E 另用真实响应/资产。

处置：**仅 C2/C3/C4 对应可信故障 RED 的执行输入 NOT_READY；其设计实现路线可继续，C1 不等待。** 样本补齐后可按既有稳定ID开展 RED/GREEN，不能用缺方法/编译错误/资产不可达冒充契约 RED。此残余沿用首轮 UIR-008，未重启审查预算。

另有实现注意项，不单列阻断：共享对象的实际赋值为 `binding.current.value = …`；element 使用真实组件元素类型，不能把 api/chart 的字段 `ComponentInfo` 误当元素。Design62 已要求采用实际类型，因此属于落实伪代码约定，不要求新体系。

### 同轮执行消歧增量核读

报告冻结前，root新增 `MVP-20261027/UiC1ExecutionClarifications-r001.json`，本 reviewer 实际读取并独立重算字节 SHA 为 `619a1f869b59624e8a51044c43024e9e386ee6d9125cf8dd00dcdc5008d8d0a7`。其绑定的 Design/Cases 摘要与本轮一致；三条规则准确编码 UIR-009 的 request.chartExtRequest 发布、UIR-010 的 identity 联动与 copy 联动，失败 copy 保旧也与真实 A 一致。未改 Goal、15主ID/25子ID、49分母、旧冻结文件或本轮预算。

**对该消歧增量裁定 PASS（与本轮源码一致）：UIR-009/010 作为 C1 执行输入已具体落地，C1 admission 同时绑定 r002、该文件及本报告即可准入，不必另起第三轮整包设计审查。** 原 r002 的歧义文本仍原样保全，不能宣称被回写修好；若 A 公共接口后续变化，按实际差异重新核对关联规则。该增量不补齐 C2/C3/C4 的 fixture，UIR-008 对应残余仍然 OPEN。

同轮另扩读 root 的真实 UI 采样记录 `evidence/UiRowAuthOutput-r001.json`（SHA `a5b648d9e2d2c9b57eae05e430ad11152864004f6c6d4d5fbf5e726abc92f276`）和 `evidence/UiFreshSerializerCopy-r001.json`（SHA `973d36574e11ee1448f99cb5627acb67e30789d3354f940e84b14e560e79cd47`）。本 reviewer 独立比较两文件的 source/clipboard tree、ownKeys、undefinedPaths，三者一致；两个 leaf 的 `timeValue` 为 own undefined，JSON树投影省略该值，与旧DB缺键样本分开保留；当前clip/session revision均为2。文件记录由root完成真实UI观察，本lane未重播浏览器，revision 1→2的历史转变只按root采样声明，不由单份末态冒充独立重演。该真实运行shape可与旧DB shape分别成为后续输入；不证明paste、query JSON、save或reopen。冻结Cases13的runtime_capture_status仍写PENDING，这是原字节时点，当前新增样本已存在，不再称所有前传输形态都尚未采集。

## 4. 15 主例与 25 子例全量检查

主例01–06覆盖既有按钮RED、完整树与失败copy保旧、TTL/会话、权限三态、完整字段目录、own-key/undefined与持久边界；本轮未重跑 A。07与14保留49逐type、query/独立数据oracle/画面/保存离开重开；12保留覆盖确认与取消0query；13的冻结字段仍为PENDING，当前新增运行样本见上节，不把DB/AX当运行golden；15保留DEV双开关与旧刷新兼容，未以静态检查冒充构建验收。

| 子例（共25，逐ID审查） | 入口/观测核验 | 结论 |
|---|---|---|
| MVP-UI-08-QERR | B strict非0/网络，candidate0、query1、旧投影/dirty/success | C1输入可用；未运行 |
| MVP-UI-08-DTO | B.value完整DTO，真实response.data、三组件正常/合法空态 | C1输入可用；未运行 |
| MVP-UI-08-ADAPTER | stock-line、S2页、rich compare与完整context | C1 stock/S2可准备；rich随C3具体输入；未运行 |
| MVP-UI-08-PICTURE | 实际Attr、纯目录、OFF0query/ON1query且还原type | 路径明确，C4映射fixture待补 |
| MVP-UI-09-TARGET | 当前target identity，旧query/ready迟到拒绝 | C1可用；保留外部合法改动 |
| MVP-UI-09-CONFIG | view.name、axis/style独立variant，sync generation | C1可用；不合并多轴 |
| MVP-UI-09-CONTEXT | 外部请求条件单轴，与target无改动 | C1可用；需记录真实context来源 |
| MVP-UI-09-IDENTITY | A公共invalidate与联动字段 | 采用UIR-010约定 |
| MVP-UI-09-CLIP | 同身份新copy，revision与session token重叠 | 采用UIR-010约定 |
| MVP-UI-09-TTL | 单调now仅推进至createdAt+1800000 | C1可用；不能用墙钟替代 |
| MVP-UI-09-UNMOUNT | receiver卸载后迟到query/ready | C1可用；外部卸载与candidate增量分开 |
| MVP-UI-09-BUSY | 同target重复click，无第二query | C1可用；第一操作可正常成功 |
| MVP-UI-10-G2-DRAW | 真实timer/queue→drawChart精确失败 | C1可用；真实SFC成功加载是前提 |
| MVP-UI-10-G2-RENDER | 真实instance.render精确失败 | C1可用；非空输入不得绕空态 |
| MVP-UI-10-G2-AFTER_RENDER | 真实chartView.afterRender精确失败 | C1可用；错误不得吞掉 |
| MVP-UI-10-S2 | render Promise与layout独立驱动、disconnect/late | C1可用；fulfilled本身不等ready |
| MVP-UI-10-INDICATOR | series[0].data[0]=6761、真实Vue错误边界/DOM | C1可用；不是callback推断 |
| MVP-UI-10-L7 | scene/layer集合、callback/error/timeout/late | C2机制明确，fixture待补 |
| MVP-UI-10-L7PLOT | map/bubble polygon/point、plot/dot loaded与add | C2机制明确，fixture待补 |
| MVP-UI-10-TINY | init/setContent同步异步、private channel、全局副作用 | C3机制明确，fixture待补 |
| MVP-UI-10-PICTURE | query、load/decode/error/late、合法empty | C4机制明确，fixture待补 |
| MVP-UI-11-PUBLISH | 同key/DOM/instance、无第二draw/query、短同步标记 | C1可用；不把切visible当canonical接回 |
| MVP-UI-11-METADATA | G2/S2/indicator六variant、真实setter/独立Store | 采用UIR-009；truthy calParams行为不顺带更改 |
| MVP-UI-11-CANONICAL | 后续axis/style/filter/S2分页读取新canonical | C1可用；不能remount掩盖过期闭包 |
| MVP-UI-11-UNDOREDO | 真实历史flush、undo/redo→snapshotChangeToView | C1可用；后续重算与首次paste计数分别记录 |

C1 synthetic DTO 明确为组件故障见证，不是 runtime golden；G2/S2 的库替身须补齐真实调用方法，真实 SFC 的 prepare/publish 消费链不可被替身替代。正常浏览器路径仍须真实数据。原有15主例中的静态兼容2401与49逐type真实流程各自保留，不互换。

## 5. C1 精确最小写域与入口条件

建议控制面 admission 只纳入以下生产文件（相对 `core/core-frontend/src/`），以当时摘要绑定，不自动扩大到其他组件或冻结资产：

1. `views/chart/components/views/index.vue`：当前编辑receiver、纯filter上下文、单operation、guard、候选挂载、最终复核、同步publish与metadata/snapshot。
2. `views/chart/components/views/components/ChartComponentG2Plot.vue`：仅G2候选prepared消费、严格ready/failure、phase guard与canonical binding；本切片不混入地图完成桥。
3. `views/chart/components/views/components/ChartComponentS2.vue`：prepared normalize/page、Promise+layout ready、局部timer、publish metadata。
4. `custom-component/indicator/DeIndicator.vue`：prepared data、Vue错误/内容ready与canonical binding。
5. 新 `custom-component/filter-copy/mvp-chart-filter-paste.ts`：专用类型、局部handle/operation helper，不引入全局调度/资源注册体系。
6. 必要的新 `views/chart/components/views/components/FilterPasteRenderer.vue`：薄包装、同key和共享binding、局部error boundary。
7. `custom-component/filter-copy/useChartFilterCopyMvp.ts`：增量prepare callback/busy/reason及当前接口接线；A内存服务不因本设计自动重写。

B `api/chart.ts` 只消费不改；Design/Cases/DB/SQL fixture/旧报告只读。故障harness文件与runtime证据若需新增，由控制面另列精确测试写域，不以本报告自行获得目录级权限。

入口条件是：有效独立Builder身份和当时源码摘要/admission，绑定本报告 UIR-009/010；按当前A公共接口接线；明确未接组件preparation_unavailable；C1故障harness先成功加载真实SFC再做语义RED。随后逐项GREEN与独立Validation，开展bar→line/table/indicator首条真实UI链。不得把库double通过写成真实后端/实际画面/保存重开通过。

## 6. 已检查无问题、未检查与修后准入预测

已核实无新增设计阻断：B outcome在原解码后包装、默认单参数兼容，不需猜DTO code/再解envelope；G2原分支不新增S2 instance写；S2 purecanvas取DTO.data，page/instance按原分支；indicator数据形状正确；calParams保持现truthy merge并有zero oracle；snapshot calcData cache不即时重复query，undo/redo后续独立重算；L7Wrapper.render:void不能当ready，Dot实际为L7Plot且有loaded/addToScene；label-layout首次draw为同步，未凭空要求额外font ready；picture真实入口/threshold分支与TinyMCE全局paragraph风险均有落点。

未检查：新C实现、实际renderer ready/error/late、浏览器DOM、真实后端query、真实权限、保存重开、全部49type和插件installed清点、地图/TinyMCE资产可用性、构建/Profile。原因是本lane被授权为设计只读审查且未有对应运行交付，不是默认通过。新全局资源/取消框架、旧29/55矩阵属于已迁出范围，不作为本次前置。

| 切片 | 设计准入预测 | 当前可推进及仍须证据 |
|---|---|---|
| C1共同handle/G2/S2/indicator | PASS_WITH_BOUNDS，可立即实施 | admission绑定UIR-009/010，真实SFC故障RED/GREEN、metadata/canonical/undo独立验证；随后真实UI首链 |
| C2五地图 | 机制设计可实施；故障fixture未齐 | 补具体map/point配置/DTO/ref后启动可信故障案；真实资产缺失仅阻对应type运行 |
| C3富文本 | 机制设计可实施；故障fixture未齐 | 补具体正文/字段/DTO/内容oracle；验证init/content/channel/字体与p的失败隔离 |
| C4图片组 | 机制设计可实施；故障fixture未齐 | 补threshold映射/图片ref与expected；实际Attr、OFF兼容及ON真实过滤正向分别验证 |

本轮没有要求等待所有组件才交付C1，也没有裁定任何未运行AC通过。UIR-009/010已给出确定最小约定，UIR-008保留对应切片残余；按以上约定可启动C1，不需要再次向人类询问普通实现选择。Goal仍由root继续执行及运行Stop Gate，本文不作最终完成声明。

## 7. 写前与写后输入清单

以下21项均按Context规定的原始字节SHA重新比较一致；报告写后再次核对并检查本地链接存在。不声明程序化Session registry校验。

| required-read | SHA-256 |
|---|---|
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/MvpScopeAuthority-20261027.json` | `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r001.md` | `36a3250e2e3ea3024d89302f36eaa5320c060127e801b59f397cea29dea1cd7e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r001.json` | `cdc9eb077f3651c2fa0f810de08f7ec85a1ba7a2ec3a5f66661cd90859f8750e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r001.md` | `670549656ea584b74b77af77638ec3717d68281f37a4e3ed2e6bb7c1e993fd03` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r001-supplement.md` | `7a5336f925176e3c12c32d33772927d5e42f676b7bd90d96c52ceed834ab836e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceBApiValidation-r001.md` | `5155165db9dcb6ab3d7741140c5c3a6694830776de25fd1a6d1c9921f8f8b677` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/SupportedCharts.json` | `163edf6b7f0a03f99256d02bb10f77c993847513f953a3e4fc743d0500c8dec4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/ExistingTwoConditionPersisted-r001.json` | `2832b27bb94e5d5435800ef390993b2781f97968d65fbe554f83acfca8ea9cbc` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/TwoConditionSqlOracle-r001.json` | `a2b0b6834b4e53c6465cf6a60e050dfc8ccbcc037c9f233d7c9a51edb41c5506` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `2b0b1794737e35331a59569cd516078da898435e3f9c3db31d0287847240b1bd` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `f3bf70c99bf5bcf1ebbe56e5d1caa4bd94660927a1a1785f756859cd9317503c` |
| `core/core-frontend/src/views/chart/components/views/components/ChartComponentS2.vue` | `43b44c57b27486cd46e101d76d4c64baac280bea3ff379e41b0294e18e5b11d4` |
| `core/core-frontend/src/custom-component/indicator/DeIndicator.vue` | `49851f35e03c1251e13c877d6c3cac4e7d10b75c8995f036aa641991e49fd831` |
| `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | `e542502bf21ebb65bffa6aa4fe778735bd632b5a1cde704ecb3bcfdadeec8b18` |
| `core/core-frontend/src/custom-component/picture-group/Component.vue` | `95f0e275408e5321337823bca357996cb48cca68bc039b4ed3f9211fae3a6820` |
| `core/core-frontend/src/custom-component/picture-group/Attr.vue` | `164bda617764bdb14ae9731e1cbfcc0ece9eebd32929cad06f76f239a6cb3cef` |
| `core/core-frontend/src/views/chart/components/js/panel/types/impl/l7.ts` | `e5fbfaece8d40f71124386554d59a552a92f2156010e5d0b94dd6fcc73dca916` |
| `core/core-frontend/src/api/chart.ts` | `9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b` |
