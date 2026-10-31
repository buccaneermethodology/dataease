# 新 UI 设计独立审查 r001 同轮补充：C 完整检查与最小修订

## 结论与证据边界

本文件接续[已冻结A报告](UiIntegrationDesignReview-r001.md)，仍为同交付物第 **1/3 轮**，不增加轮次。原报告字节 SHA `670549656ea584b74b77af77638ec3717d68281f37a4e3ed2e6bb7c1e993fd03` 保持不变；其中 **A可立即独立Builder**、首按钮RED足够入口以及 **B可独立query/outcome准备、不发布** 的裁定继续有效。A合理并行修改不构成本补充的C源漂移。

**C整包设计冻结：`NEEDS_REVISION`（需要下列有限修订）；C完整成功发布源码入口：`NOT_READY`。** 原设计已给出可行的局部候选方向，无须再证明旧55资源/29双host/通用取消框架。剩余是具体ready、候选副作用、同节点激活、请求分支和验收映射，不是再次发明通用stage系统。可以继续A/B及独立fixture/观测准备；C按下述分组件最小合同修订后准入相应部分，不要求所有地图资产就绪才能推进其它组件。

**D：独立数据oracle已具备首条路径输入，真实query→预览→手动刷新→正常保存离开重开仍未运行。** 最终验收必须保持canonical当前22项和每eligible type真实source/target/query/save-load要求，不能改成仅family代表完成。当前没有产品通过或Goal完成结论。

本补充Card canonical SHA `500c87bb6066b4b0812d56e6192a3c8ae6332216ec732a20a1a644dacfed0251`，接收端validate通过；Context字节 SHA `4fb3918621cf2f6199ea77e7cbdb2429ab443896d314726472db61c978c25623`，全部17项required-read重算一致。绑定Design `36a3250e2e3ea3024d89302f36eaa5320c060127e801b59f397cea29dea1cd7e`、Cases `cdc9eb077f3651c2fa0f810de08f7ec85a1ba7a2ec3a5f66661cd90859f8750e`；API消费baseline-source-r001/04-chart.ts的原字节。未运行产品、DB、构建、测试，未改设计、Cases、源码或A报告。

## 累计发现与一次修订清单

### UIR-001 / P2 / OPEN：图片组真实宿主入口缺失（延续主报告）

真实dashboard viewEditorShow和dataV viewsPropertiesShow都排除picture-group，改通用Editor的getFields和按钮不能让图片组获得可见入口。该类型实际走`custom-component/picture-group/Attr.vue`。修订应明确真实Attr共用服务入口或具体父路由最小调整，保留原上传/阈值配置。PictureGroupDatasetSelect.onDatasetUpdate会清空并重建xAxis、发calcData，不是纯字段目录获取；不得把它当prepare校验直接调用。通过已有getFieldByDQ接口只读获取独立目录。仅阻该type覆盖，不阻当前A通用Editor。

### UIR-002 / P2 / OPEN：地图ready须绑定scene之外的实际图层完成（延续并补全）

`ChartComponentG2Plot.vue:1005–1069` 的两个地图分支只安排timer，catch后仍callback。`types/impl/l7.ts:46–78` 的L7Wrapper.render返回void，scene.loaded后才addLayer；不是可await的渲染结果。flow-map.ts:115–123、heat-map.ts:125–133、symbolic-map.ts:159–170在layer `inited`中完成mapRendered/qqMapRendered/tooltip等工作。map.ts:317及bubble-map.ts:245等plot loaded回调也执行必要配置，部分bubble layer初始化又晚于plot ready。

**最小约定：** 为当前候选提供opt-in的实际完成Promise/通知，不改变legacy默认；在可能同步触发事件之前注册完成/error监听，L7等待本次所有必要layer的初始化及当前必要配置完成，L7Plot等待本次plot及其必要附属layer/初始化完成。ready必须带当前candidate存活检查，error/timeout明确失败；不能调用一个实际不存在的`L7Wrapper.once/ready`或只await其void render。没有layer时区分合法空数据与配置/轴缺失，不能一律ok。具体桥接可落在L7Wrapper或现有drawChart内部已知回调位置，root为确需修改的types/impl/l7.ts及具体map类追加精确写域，而非重启通用资源治理。

同类残余：scene已loaded与未loaded、flow多layer、heat单layer、symbolic tooltip/label、map/bubble正常与点回退分支；只检一个scene回调不闭合它们。冷地图配置的getMapKey还会写mapStore缓存和window SDK配置；Designer应明确这些非target基础设施预热在capture前完成，或把准确的只读/缓存边界写入oracle，不能声称clone已隔离所有全局写。不得输出其实际secret值。

### UIR-003 / P2 / OPEN：富文本异步初始化和业务channel未形成精确就绪合同（延续主报告）

TinyMCE经Vue Editor异步初始化；DeRichTextView.vue:202起有editor init事件，:368–374直接对tinymce.get(tinymceId).setContent，nextTick不保证实例存在。:358–364的fieldSelect channel只用element.id，唯一suffix/tinymceId并不隔离同resource的此channel。

**最小约定：** candidate使用唯一实例ID、不可编辑状态与实际TinyMCE init/内容准备Promise；组件局部捕获Vue渲染错误及外部editor init/error/timeout，失败返回typed outcome。所有element.id业务channel在candidate阶段不注册或注册仅本候选私有channel；激活后切回既有业务channel，不改canonical resource ID。必须在publish前完成内容替换/净化及必要editor初始化，不得publish后再初始化可能失败的editor。实际DOM内容/值为结果oracle，不能只测callback已触发。

### UIR-004 / P1 / OPEN：富文本内容函数存在越过候选DOM的实际副作用

这是主报告冻结后继续读取发现的具体遗漏，不改写UIR-003历史严重度。DeRichTextView.vue:391–428的assignment除内容替换外还调用initFontFamily和jumpTargetAdaptor；:444–454的initFontFamily会`appearanceStore.setCurrentFont`，myValue watcher也会调用它；:377–390的jumpTargetAdaptor安排1秒timer，再`document.querySelectorAll('p')`并改每个paragraph的onclick属性。即使element/view已clone、候选不可见、instance ID不同，这条timer仍会修改old active和其它产品DOM；丢弃候选后也可能继续执行。因此不能把“assignment是本地纯内容生成”作为保旧前提。

**最小修订与oracle：** 拆出纯内容替换或在现函数加phase参数；候选不改appearance全局选择，paragraph处理严格限制到本候选root/editor DOM，已安排timer登记于当前候选并在discard/unmount清除且回调核存活。任何必要active初始化须在候选本地完成或安全准备；禁止把文档全局paragraph扫描挪到publish后继续污染其它区域。Case10给old paragraph的outerHTML/onclick和appearance currentFont独立初态，在candidate init、失败丢弃、再推进1秒timer后均断言无变化；不能只检查target.customFilter或data。

该修复直接支撑当前“失败保旧”，不等于重启通用构造泄漏治理。仅阻富文本C，不影响A或其它renderer的本地准备。

### UIR-005 / P2 / OPEN：同key提升之后的canonical输入与派生状态发布仍需精确约定

Design要求candidate持有view/element clone，同key/DOM/实例提升后把chartComponent ref切过去，但未写清提升后props继续指向clone还是canonical。真实G2 action、S2分页/scroll、indicator交互长期读取props.view/element；若只提升可见性和ref，随后普通Editor改轴/样式/参数时这些闭包仍可能读旧clone，画面、保存配置和交互语义脱节。主报告已经把此项列入待续核查，现确认为实现合同缺口。

**可直接采用的最小工程约定：**

1. 每个局部node有稳定key、candidate/active phase、stage输入与active输入。prepare只读stage clone；ready后在同一publish段切换到canonical view/element引用（id/type/suffix不变），同一个组件实例/DOM保留，不再调用普通calcData/renderChart。不修改从source来的样式/轴/ID。必要local response/curView/actualChart数据继续保留为本次已准备结果。
2. publish前将所有会用到的派生数据独立准备：wrapper chartExtRequest/lastRequest、details、calParams、origin或purecanvas、drill、page、S2 instance及rich-text/picture curFields/必要element字段，按实际组件分支列清单。`dvMain.setViewDataDetails`不只是存DTO：它存res.data且合并既有calParams并写canvasViewInfo；因此必须对独立DTO计算，不能把共享对象交给prepare阶段setter。没有相应分支就不随意新增Store写。
3. dirty/snapshot采用现有`recordSnapshotCache('calcData',targetId)`一次（或明确等价现有行为），**不调用Editor.calcData**。现snapshot函数此时只记cache/dirty与历史重算类别，不立即发query；错误地用`changeFilter`/普通无type虽能记缓存，却不登记undo/redo后该目标需要calc。恢复历史时原snapshotChangeToView再按既有流程重算，是后续独立操作，不计成paste第二次请求。
4. 最终token复验后publish不再调用可能失败的library init/async工作；node/refs/metadata/树切换完成后才成功反馈，再按原unmount清旧active。同步发布所有语句具体化，不用“原子函数”一个名字代替实际写入清单。

Case11补：成功后不重挂、不重query，随后普通编辑任一实际轴/样式/过滤字段，证明新active读取最新canonical props；执行undo/redo，验证完整树/当前画面/dirty及真实重算事件一致。其计数与首次paste的getData=1分开。无需新建全局事务系统。

### UIR-006 / P2 / OPEN：图片组threshold关闭分支与统一query=1 oracle相冲突

真实picture-group/Component.vue:242–251在threshold.enable=false时只withInit/callback并返回，**不发getData**。开启阈值且有dataset时才重写type=table-info/render=antv/resultCount=1，恢复响应type后生成图片。Design步骤3和Cases08/11统一按真实query准备、getData=1，未处理这个现有分支；只保留type重写而忽略提前返回不算沿原语义复用。

**最小约定：** 显式建模`needsQuery`/准备分支，保留关闭阈值的既有无query行为和真实静态图片/合法空态；不能为了满足计数凭空发query或伪造DTO。当前图片组正向过滤数据见证使用真实dataset+threshold开启、可解析字段和确定图片映射，以此完成该type实际query/过滤效果/save-load要求；无query分支单独作为兼容用例，不拿它替代数据过滤验收。若当前实现不支持某种合法配置，明确拒绝与具体缺口，不静默记为通过或删除picture-group类型。图片decode/load/error、合法空态及discard timer仍是本候选局部必要工作。

### UIR-007 / P2 / OPEN：每type当前验收要求应在UI案例执行计划中闭合，不能只列family画面

canonical AC-MVP-F01-12与TSP要求每eligible type真实UI/query/save-load。Design第2节明确每type组件验证，但随后写实际画面按12个family覆盖；Case07也把每type限定为按钮/payload/prepare组件、browser按family，Case14只有首条source/target正常链。虽然两处都没有错误宣称family通过会自动给其余type PASS，但按当前计划完成代表组后，剩余type当前义务仍会NOT_RUN，无法终态。

**有限修订：** 将Case07/14的同一正向场景按49个稳定type身份参数化运行并逐个记录source与target、query/画面、正常保存离开重开；family只用于优先次序和故障复用，不充当完成分母。无需2401次E2E，也不要求首个A见证前完成全部。插件仍按GTR-001在S037清点确认，未知不得填0。地图资产失败只阻具体类型证据和当前全部完成，不能暂停独立其它类型工作。

### UIR-008 / P2 / OPEN：C关键多分支案例仍需稳定子案输入和明确ready/发布观测

现Cases的15个主ID可保留，但Case08–11以字符串列举多组件/多失败/多state变化，没有各renderer的具体DTO+view/element fixture、事件顺序、失败注入点和相应metadata投影。尤其L7 scene loaded与layer inited、TinyMCE init与内容error、合法空态/无query、同实例提升后props、undo/redo，不能交由runner在实现时秘密解释。主按钮RED也不证明这些C分支有可信RED。

**最小修订：** 在当前Cases修订或绑定的补充fixture表里为每必要分支给稳定subcase ID、独立完整初态、真实SFC入口、输入DTO/schema边界、deferred事件/失败点、query/dirty/业务event/DOM预期与旧状态投影；采用现已落DB树与独立SQL oracle，新增前传输样本另存来源和own-key/undefined清单。字段/配置/context/identity/clip/TTL逐轴变更各有子案；不能一次同时改多轴后声称每个guard有效。真实业务E2E不mock，故障harness显式标组件层。不能以module不存在/编译失败充作C可信RED，也不要求把旧29/55例并入本包。

## 各实际入口的最小修订与独立推进部分

| 实际入口 | 已确认存在的能力/方法 | 本次C最小必须工作 | 可独立推进边界 |
|---|---|---|---|
| G2（38type共用SFC，仍逐type核验） | 原生drawChart、实例render Promise、chartView.afterRender可沿现代码await；已有owned line helper不等于所有type就绪 | opt-in consumePrepared/strict outcome，candidate chartObj不传旧active，phase guard覆盖action/default/quadrant/tooltip/carousel/observer；严格传播draw/render/afterRender失败及合法empty结果；完成共同UIR-005/008 | 严格本地候选与真实组件故障准备可在共同handle/fixture冻结后先做；不等待地图/TinyMCE；不扩大既有G2工程声明 |
| L7Plot map/bubble-map | 真实drawChart返回plot，loaded/layer回调存在 | UIR-002精确完成链/错误/timeout，正常与点回退分支；unique container+存活检查 | 有资产则按具体type推进；缺资产保留blocked，不能用timerfulfilled代替 |
| L7 flow/heat/symbolic | L7Wrapper包含scene与config，render只是addLayer；各实际layer inited可定位 | UIR-002最小ready桥接与初始化边界，不向不存在的wrapper EventEmitter订阅 | 与L7Plot分开冻结，不需通用stage框架 |
| S2三type | 已安装@antv/s2 spread-sheet.d.ts:125明确render():Promise<void>，实际实现await container.ready和doRender；有LAYOUT_AFTER_RENDER | await真实render Promise并确认本次layout完成且node存活，不用finally判成功（库在destroyed/disconnected时可直接fulfilled返回）；normalizeChartData、独立page/currentPageSize、Store/page/instance写延后；candidate不启动active滚动/resize重绘 | 现API足以选定实现，不应再因“无ready API”阻塞S2；与共同005/008一并小修后可独立准入 |
| indicator | renderChart更新局部chartData/样式，真实DOM值可在Vue flush后观察 | prepared local state、候选局部Vue error捕获+nextTick/DOM值校验、业务events延后；正确details/drill发布 | 无地图或外部editor依赖，可作为首条C局部候选验证；仍需005的canonical重绑 |
| rich-text | TinyMCE init事件、唯一tinymceId及真实内容替换均有源码 | UIR-003/004；不把assignment当纯函数；phase隔离channel/appearance/global paragraph/timer | 先修本SFC具体链，不需泛化富文本框架或修改resource ID |
| picture-group | 实际threshold/no-query分支、table-info adapter、图片映射与img节点存在 | UIR-001/006；图片decode/load/error或明确空态、本地timer清理、curFields/element延后 | 真实Attr入口与字段目录可先独立做；不以图片组缺口阻通用Editor |

S2自动滚动、G2轮播/tooltip等非必要交互可以在成功后启用，但其可失败的必要初始化必须预先完成或有明确不会改变成功语义的降级；不要求把所有未来运行错误提前穷举。未知内部构造资源泄漏、全应用认证问题、所有普通异步竞争仍迁后续，不能借本报告恢复它们为MVP前置。

## 已查无问题的维度、未检查和修复预测

已检查：真实五个SFC及其G2/S2/L7/L7Plot/custom分支和wrapper路由；getData clone/业务code/默认解码兼容方向；S2分页和render真实Promise；rich-text元数据/placeholder/TinyMCE source；图片组threshold与图片映射；当前snapshot缓存/历史恢复、dvMain setter真实写入；49type未删除，hidden未静态通过；原生DB样本的null兼容键与undefined边界；source/target配置不随source样式复制；单操作/target/generation/context/session/clip/TTL及提交前复验；失败不调用普通Editor calcData、成功不二次query的目标；原scope移交、真实权限桩上限和A/B独立路线。未发现必须回滚既有G2实现、重开旧r003或新增人类批准的理由。

除已绑定首按钮RED外，未执行其余Cases、真实candidate绘制、故障注入、各类型浏览器/query/save-load，不能把上述源码API存在当运行通过。SQL oracle仅按文件独立复算14行/6761，没有亲自执行SQL；旧predicate/current22终态未验。扩读源码与现装库声明只作精确实现证据，不安装/升级依赖。A源码并行变化已由本卡正式划出，未拿它阻C；C/API基线绑定仍一致。

本轮累计发现为主报告UIR-001..003和本补充UIR-004..008，全部列出；003/002在补充中增加具体证据，未重置轮次。Designer可一次修订：补图片组真实宿主、确定真实ready与富文本副作用隔离、固定canonical重绑/metadata/snapshot约定、区分query/no-query与每type验收、补稳定子案fixture。上述是当前基本路径必要内容；不增建通用controller或把未知都变blocker。修订后预计可按G2/S2/indicator等独立组件先做有界delta复核和精确admission，不必等地图/富文本所有资产。A继续执行，B strict outcome独立准备；对应C成功后直接进入D首条真实链，再补足全部type，保留每个未验项。
