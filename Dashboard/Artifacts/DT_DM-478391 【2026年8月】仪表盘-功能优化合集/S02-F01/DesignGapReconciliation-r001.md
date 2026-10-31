# S02 设计缺口与产品准入对账 r001

状态：设计台账候选更新；只核对现有合同、独立设计审查及当前源码，不冻结完整产品设计、不授权产品 Builder。正式分母仍是 `Goal.final.json` 的10项Goal AC与16项产品义务。

## 当前证据能支持的结论

| 设计域 | 当前有界证据 | 已支持的范围 | 仍不能推出 |
|---|---|---|---|
| 目标类型/数据集条件 | `PureSubcontracts-r002.json`、独立 `BoundedContractReview-r002.md` | 17个冻结纯比较/计数向量的合同与输入身份 | 真实授权、元数据可信、最终envelope序列化或产品入口 |
| 查询引用及窄形态重建 | QPROJ/QMAP/QPIPE/QPREP、`QPAD-REBUILD-001`、QSINGLE及QSINGLE默认值的独立审查/Validation | 已审查的局部映射、闭包准备、树关联、普通Select窄域及单选默认源JSON重绑 | 全部查询控件形态的完整白名单、跨形态整份配置重建、目录权限和保存回显 |
| 级联关系 | QCR/QTR及`QueryAdapterShapeMatrix-r002.md`的树路径oracle | 有限身份重绑和指定两层树消费结构的源码派生oracle | 混合深度、分隔符冲突、空值/历史形态、真实查询与完整Q066/Q067 |
| 保存/历史设计 | `QueryAdapterDesign-r007.md`及独立Review-r005 | 候选级最新根局部覆盖、查询版本/历史游标与预览效应分离 | Vue/Pinia实际协调器、旧历史carrier补齐、生产保存/撤销/重开行为 |

上述有界候选即使状态为 `PASS_WITH_BOUNDS`，也只代表各自合同切片；不能合并推导成完整查询适配器或S02产品链路已具备准入条件。

## 本轮源码复核：查询粘贴提交边界

复核 `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue` 当前源码：

- `validate()`（约1261行起）会按查询条件检查字段映射、默认值和树配置；它是配置对话框校验，不证明复制来源或目标权限。
- `confirmClick()`（约1591–1628行）会关闭对话框、处理多个配置、保存旧 `propValue`，先把 `queryElement.propValue` 设为空；下一 `nextTick` 再为默认级联节点写运行值、提交 `cascade` 与完整 `propValue`、记录 `confirmClick` 快照；第二次 `nextTick` 后触发 `reRenderAll` 及 `queryData`。
- `cascadeArr` 是组件模块级暂存变量（约178行），初始化/开关配置路径会读取或重建它。直接复用确认按钮处理器做粘贴，会把对话框生命周期、多阶段清空/赋值和用户确认副作用带入复制提交。

因此完整设计必须给过滤粘贴定义独立 `prepare → revalidate → commit → preview` 协议：prepare仅产生不可变候选；commit前复核目标版本、身份、数据/编辑权限和所需目录状态；提交在一个同步事务/单一状态发布边界内整体替换目标查询设计，取消、异常或复核失败不得变更目标、记录成功快照或发查询；成功后只发一次预览。该段是设计要求，不是当前代码能力陈述。具体Pinia/action/carrier落点必须由产品设计逐调用方确认后才可冻结。

## 完整查询适配器的未决合同

1. 以 `propValue`、`cascade` 及查询组件实际持久字段为权威输入，列全字段的 KEEP / REBIND / RESET / REMOVE / REJECT 矩阵；普通、单选含默认、树、参数、动态日期/范围及历史配置都要按源码可见支持域分型，不可把已实现窄函数的 `UNSUPPORTED_SHAPE` 解释为永久拒绝合法形态。
2. 定义每类组件的完整输入/输出schema、嵌套对象及未知键政策；给出同一源条件多目标、缺字段、额外引用、历史缺省及跨版本字段的完整oracle。
3. 对每个 source condition、target condition、cascade node、目标组件和 dataset/field 引用，冻结身份映射及唯一性域；继续遵守按ID精确对应，禁止名称映射。明确QMAP/QPIPE/QPREP/各专用重绑函数的责任顺序和失败优先级，确保无partial value。
4. 将纯配置重建与授权分离：转换计划和目录资料都不是授权凭证；每次复制/粘贴仍由真实身份及数据/编辑权限校验。权限模块和隔离环境未就绪前，不创建mock授权或可绕过权限的产品入口。
5. 为成功候选固定完整树一致性、动态规则保持而非固化值、深拷贝双向独立性、单次快照/预览、取消/错误零副作用的oracle；与确认/保存失败/重开/undo/redo联动。所有原10+16分母继续留在父Goal。

## 依赖和准入顺序

- `DG-01` 真实权限环境仍 `BLOCKED`；只读用户不得查看/复制/粘贴、逐次权限撤销和恢复均保持 `NOT_RUN`。获取有授权的XPack权限来源或隔离实例后，建立可复用编辑/只读/管理员账号及基准权限。
- `DG-02` 可信时钟、回拨处置、跨标签身份代际和旧标签写回竞争仍须先由设计冻结，当前纯TTL比较不能替代。
- 本报告只将DG-03细化为可审的合同清单；没有声称关闭DG-03。产品 Builder 仍需S01 F01 Entry Packet/终态摘要、完整适用设计预审、真实权限环境、实际拓扑及精确 execution admission 同时满足后再启动。
- 下一项安全工作是按上列清单补全字段矩阵与事务API候选，再做独立 Semantic Review；若评审给出 bounded readiness，才进入对应 Builder admission。其余不受权限阻塞的合同/静态源码设计可并行准备，不改变S01状态。

## 证据上限

本报告依据已落盘的有限子合同、独立设计报告和静态源码位置；未执行Vue、Pinia、浏览器、后端、数据库或权限验证。它不关闭任何Goal AC，不代表产品 Builder 准入，也不代表S02/F01/S10完成。
