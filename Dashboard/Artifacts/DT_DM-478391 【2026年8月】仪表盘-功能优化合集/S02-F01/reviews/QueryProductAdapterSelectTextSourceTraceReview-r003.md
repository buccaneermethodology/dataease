# SH-SELECT-TEXT 来源阶段追踪独立审查 r003

## 第 3/3 轮双结论

**候选文档有效性：PASS_WITH_FINDINGS（仅作为有界静态来源研究材料，附下列修正项）。完整 F01 设计冻结 / 产品实施准入：NOT_READY。** 历史三处定位已实质补齐，但当前来源表仍混合source切换与dataset切换，并将确认请求后的同步return称作取消分支；这些段落不得直接作为行为oracle。

本轮是本source trace交付物第3/3轮，预算已耗尽，不自动开启第四轮。未重审AuthorityMaterials或QueryParameterBindingPreparation。10 Goal AC / 26 must-have / 16产品义务、Scope Delta none保持；ST-SRC-001..006仍DESIGN_ONLY/NOT_RUN，007仍NOT_READY/NOT_RUN；不计入32项全形态case执行覆盖。

## 入口与证据

父任务固定card SHA `163201e2bd36a8f180ea0d0eb1b7ac30f928406e741ba004d11030664eab6210` 已validate pass并render。15项required-read均与card delta读集对应且摘要匹配，写前复验仍一致。审查r001/r002/r003版本、两份历史source review、全形态设计与review及相关源码；Goal/Design/DesignGaps、权限及S01为本会话已读且摘要未变的材料。全形态大表按相关来源阶段、字段与finding内容核对，不冒称其所有无关shape已有运行验证。

实际重读options.ts:6–137；QueryConditionConfiguration.vue:970–1050、1448–1485、1555–1598、1840–1875、3220–3250；Select.vue:125–135、300–335、368–563、1047–1064。一次读取脚本因options.ts不足140行发生IndexError，随后有界重新读取成功，未遗漏所需源码。未构建、未启动、未运行产品/权限测试；仅新增本报告，写前不存在，未改候选、Goal或产品代码。已有其他工作保持原样。

## 历史 finding 全量对账

| ID | 处置 | 当前依据 |
|---|---|---|
| SSTR-001 | CLOSED_WITH_BOUNDS | infoFormat:6–66不含defaultValueFirstItem；attributes:135为false；1844–1857补缺值，1860–1872重置。r003明确分开三个阶段。 |
| SSTR-002 | CLOSED_FOR_LOCATION / 新措辞问题见SSTR-R3-002 | 979–985已被977–985引用覆盖；包含写新dataset、清级联、重置临时ID和重入处理。引用补齐不等于取消行为已验证。 |
| SSTR-003 | CLOSED_WITH_BOUNDS | 1592–1594确有confirmClick及if(validate()) return，确认阶段因果已可追溯。 |
| F-ST-SRC-001（r002） | CLOSED_WITH_BOUNDS | 同SSTR-001，补全属性不再伪装成infoFormat无条件初值。 |

r002 review实际审查对象是r001（SHA e545f799…），不能把review r002名称误解为已经审过候选r002。本轮直接绑定候选r003完整摘要，历史文件不被覆盖。候选r003主体从r002修订并新增末尾修订表，标题仍残留r002，见SSTR-R3-003。

## 本轮完整 findings

### SSTR-R3-001 / P2 / OPEN：source切换与dataset切换的触发条件混淆

位置：候选“数据集/字段配置”行“source选为1且已有dataset时会清空field.id/displayId/sortId后调用getOptions”；ST-SRC-002。

证据：radio @change在3226调用handleValueSourceChange。1024–1046只在source===1且dataset.id缺失时进入回填及getOptions；dataset已有时此函数本身没有该清空/getOptions分支。清空三个ID并getOptions实际位于handleDatasetChange:1002–1005，通过dataset tree的@change:3243触发，或者confirmIdChange重入。不能把这两种配置事件合成“切换source且已有dataset就清空”。

影响：ST-SRC-002若按该文字制作预期，会验证错误触发条件；文档局部行为结论不是完整准确来源。建议将source事件与dataset事件分别表述、分别固定前置状态；本报告不擅自修改候选或新增测试。此finding不推翻材料作为待完善来源索引的价值，但相关句子不可作权威oracle。

### SSTR-R3-002 / P2 / OPEN：同步return并非显式取消处理分支

位置：候选“后者含确认请求/取消返回分支”及r003引用修订表“确认/取消”。

证据：987–1000在newDatasetId与oldDatasetId均非空时先恢复dataset.id=oldDatasetId，发起ElMessageBox.confirm，并只注册.then(confirmIdChange)，随即return；没有catch或显式cancel回调。确认成功后979–985写新dataset、clearCascadeArrDataset、清空两个临时ID再重入直接处理分支。1002–1005为不满足确认条件时的直接清空/取选项。源码可以证明“确认请求后本次调用返回”，不能把该return归属于用户取消；取消的Promise rejection处理、临时ID后续状态仍需取证/运行。

影响：会把未追踪的取消语义写成已观察分支，尤其不能据此宣称取消零副作用或完整恢复。建议文字限定于同步控制流与.then成功路径，把取消保持ST-SRC-004待运行，不以UI库惯例代替本文件证据。

### SSTR-R3-003 / P3 / OPEN：版本标题和引用范围仍有小型追溯缺口

位置：r003首行仍写“候选r002”；正文handleValueSourceChange范围止于1041，实际field.id/sortId及getOptions在1042–1044；数字默认值校验范围止于1477，完整判断/拒绝到1483。

影响：版本身份需靠文件名/末尾r003段及摘要才能辨认；部分行为需越出所列范围才能核实。建议后续若获维护授权，修正文档标题并将这些局部引用延伸到实际语句终点。当前不重写历史、不开启新review轮。候选未声称替代完整Design或已冻结状态，故不据标题错位误判为产品验收。

## 来源与声明边界复核

创建阶段准确分开infoFormat对象、attributes定义、parameterCompletion缺省补全及setToDefault重置；后者是无条件覆盖attributes键，不是只填缺值。候选“应用/重置”可接受，但使用者不能把两函数当等价迁移。

校验调用点1593准确。source=2实际以filter(ele=>!!ele)检查truthy值，不等于trim后的非空文本；候选把全空白列为ST-SRC-005待判而未声称已拒绝，因此本轮不新增“空白必须拒绝”的业务规则。source=1适用displayType排除9/22/1/7，数字2另有默认值分支；候选没有声明完整校验schema。

Select的disabledFirstItem条件、默认值初始化、异步options清值/回写、配置态与运行态首项差异有当前源码支撑。观察到这些写入仅支持分阶段取证；不重判QOBS-ASYNC-01、不宣称ST-SRC运行通过。保存/重开/history owner不足保持NOT_READY恰当。

S01最新读集明确F01 CONDITIONAL且Packet可读；历史全形态设计/review写NOT_AVAILABLE只能作为历史判断，不覆盖当前读集。真实权限仍BLOCKED/NOT_RUN；standalone/admin/mock不能替代。R4FS-001合法组合、002完整来源链、003可执行oracle、004路径化动作、005产品前置均未因来源引用修订而关闭。AC-S02-02/03保持pending，完整F01/产品UI/Store/source-read/target-commit均未准入。

可安全压缩的结论为：“来源阶段文档经终轮静态复核，附三项来源表述/追溯finding；ST-SRC全部未运行，完整产品未准入。”不能压缩为“来源阶段行为已验证”或“默认行为覆盖完成”。本报告不是Goal终态或Stop Gate凭证。

## 输入摘要

审阅UTC：2026-10-21T03:37:58.423503+00:00。

| 输入 | SHA-256 |
|---|---|
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Design.md` | `6c7f5344446bc640a334cd986e9a1a1276c39be2823433e505cd8ae1943dc117` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DesignGaps.json` | `0a6e1718b0cad911c479ed7faef73664d0bf9d565383d36e226df23f93ec410c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFullShapeDesign-r001.md` | `55151a44c4d8ff2eed5893bda071e2c6e3d1ee69d8f0547ad2777e35d75fdc67` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterFullShapeDesignReview-r001.md` | `0965ba805cbcc218538857ff9fefe26a11ad4002cceae39546e77ef1b09fee54` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceTrace-r001.md` | `e545f799a49d30dc836f45ad8d5e01d1b7a03e8c477922557ebf2544778bbe20` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceTrace-r002.md` | `f0c62881696554ced04ce9c1587edac899258f24abb14e5b88360a2a2cf13151` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterSelectTextSourceTrace-r003.md` | `76d9771d661400131a07693bad2dd528085b9ae8a6cfffc382e75649ed654be4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextSourceTraceReview-r001.md` | `b521bee9c5c6e20c3071cc3fb0c413622a728328279c682d099e738b204167b8` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QueryProductAdapterSelectTextSourceTraceReview-r002.md` | `fb9bf729306b8bce54e32579048ea81678ca2dfe886f31aba3b57aabdad60ae1` |
| `core/core-frontend/src/custom-component/v-query/options.ts` | `4be7d37dd75cf8a3759e807e1fd996194be2f35a829ad2f1306dc3a8ec061fc4` |
| `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` | `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047` |
| `core/core-frontend/src/custom-component/v-query/Select.vue` | `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
