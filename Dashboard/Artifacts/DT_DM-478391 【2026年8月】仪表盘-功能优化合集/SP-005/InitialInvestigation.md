# S01 初步源码调查与环境缺口

本文件仅为S01.0/1进入与运行方案准备，不替代八功能完整连接点报告。当前所有产品运行均NOT_RUN（未执行）。主仓库HEAD a11d4f1278e12c2bea0d9d4000537d7d8f868f0e；本地分支pr@dev-v3@update_sge_governance_skill。实际源码字节绑定见SourceSnapshot.json。工作区另有模型和Dashboard并行变动，未覆盖。

| 功能 | 已直接观察的源码入口/事实 | 仍需调查/运行 |
|---|---|---|
| F01 | core/core-frontend/src/views/chart/components/editor/filter/FilterTree.vue changeFilter/dfsTreeDelete：输出logic/items并记录changeFilter快照；主编辑器使用customFilter | 复制/粘贴全入口、跨标签有效期和用户隔离未证；不能把现有过滤编辑器当复制能力已实现 |
| F02 | src/router/mobile.ts有panel、分享mobile和PreviewCanvasMobile；DeFullscreen.vue调用body.requestFullscreen并监听退出 | 此全页组件是否承接移动表格专属全屏尚未证；真实App/设备、返回状态、横屏必须运行 |
| F03 | api/chart.ts innerExportDetails/innerExportDataSetDetails→ChartDataApi对应导出权限→ChartDataServer.innerExportDetails；分享访问校验后按linkToken/嵌入配置走同步Workbook或ExportCenterManage.addTask | 需继续查异步生命周期、所有表格类型、历史下载权限与脱敏；真实两身份/行列权限、文件内容不能用注解证明 |
| F04 | QueryConditionConfiguration.vue维护查询配置；Select.vue调用enumValueObj；DatasetDataServer.getFieldEnumObj→DatasetDataManage.getFieldEnumObj | 需逐项确认独立可选值过滤与级联关系、NULL和保存路径；不能把已有级联当新需求全部满足 |
| F05 | TableCellSelector.vue观察tableCell/xAxis/yAxis/tableHeader；table-pivot.ts渲染配置/总计；DimensionItem.vue数值格式入口条件限定普通/明细表 | 透视维度/指标列真实支持与跨字段样式要在真实渲染层证实；候选数组不能定论 |
| F06 | editor/index.vue activeDimension/activeQuota与singleDragStartD/singleDragStart、startToMove序列化数组，addAxis及去重/角色检查有入口 | 已有批量入口线索，不是新功能缺失定论；需区域容量、顺序、原子性、撤销及属性转换运行 |
| F07 | Select.vue selectValue/clearCascadeSelectValue、getEnumValue/enumValueObj；DatasetDataManage.getFieldEnum/getFieldEnumObj先校验数据集权限，后构造查询 | 清级联值不自动证明用户可见的一键清除已选；5000截断位置、三类选择器/类型/空值与拒绝结果待追踪 |
| F08 | CustomAggrEdit.vue有字段插入和validateCalcField后端校验调用，table-pivot.ts customCalcFunc从customCalc读取各层总计 | 函数计算不证明辅助/模板齐全；后端计算、10条槽位、历史异常、局部重算及资源边界待调查 |

## 环境与测试设施

用户指定的Dashboard/debugging_env.md是2026-10-14历史盘点。它记录MySQL3307认证曾失败、应用用户/schema尚未确认，Redis隔离须核对、后端启动可能迁移。当前仅确认项目Vite/vue-tsc文件、后端classes及CoreApplication.jar存在；不证明版本匹配或可运行。源码HEAD已不同于环境文档，不直接使用旧Jar声称当前源码行为。

package.json没有统一test；build:base/distributed继续build:flush，含npm安装，不作为本轮默认步骤。后端Surefire skip=true，不用mvn test成功冒充测试。tests/visualization-read-security/README.md的25项方法断言模拟权限提供方，不能替代真实权限。pie-label-overflow是已有独立渲染测试结构参考，饼图测试不属于本Goal的表格证据。

XPack：git -C de-xpack rev-parse --show-toplevel返回主仓库；gitlink 9242ff482dc33c5e4c80e7fca5c3bf72c741c478只是期望版本。未初始化、未读取专有实现；依赖完整权限实现的运行验证可能受限。

## 下一步

按Final继续完整调用链/AC映射，运行前冻结具体场景与oracle。环境先做无写入预检，任何连接或启动由用户确认具体方案；环境缺口不降低S01完成门槛。
