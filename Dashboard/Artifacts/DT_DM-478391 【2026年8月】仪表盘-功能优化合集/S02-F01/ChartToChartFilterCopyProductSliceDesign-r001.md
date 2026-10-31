# 普通图表过滤配置跨图表复制产品切片设计 r001

## 交付物身份与范围

- Artifact ID：S02-F01-chart-to-chart-filter-copy-product-slice；本交付物第 1 轮。
- 目标：先打通同数据集普通柱状图 → 普通折线图的可操作产品路径：复制当前图表的静态自定义过滤树、切换目标图表粘贴、验证兼容与既有目标覆盖确认、确认后刷新预览、沿既有仪表板保存并重开。
- Goal 权威：Goal.final.json；保持 10 项 Goal AC、26 项 must-have、16 项产品义务与 Scope Delta none。初始纵向见证仅是实施顺序，不缩小普通表、透视表、查询组件、权限、撤销/恢复及其他完整验收范围。
- 不做：操作系统剪贴板、跨浏览器/设备、共享模板、自动保存、查询组件互通、只读用户验收、权限撤销/恢复验收、图表类型以外的跨类别粘贴、保存接口或后端权限修改。
- S01 关系：S02–S09 EntryPacket 的 F01 条目为 CONDITIONAL，要求复用局部证据、覆盖原 AC/Gap、独立审查，并为后续切片另冻结设计/实施授权。其明确提及的 S01 回归项是 AC-F01-ORIG-02（既有组件复制/改类型仍可用）；它影响该兼容回归关闭，不构成本普通图表路径的全局接线禁令。该回归仍保留未验证。

## 可复用的源码事实

1. 图表过滤编辑入口为 editor/index.vue 的 openTreeFilter()；FilterTree.vue 的 changeFilter() 对有效结果先调用 dfsTreeDelete(items)，再发出 filter-data；编辑器 changeFilterData() 将 cloneDeep(customFilter) 写入当前 view.customFilter。
2. 因而本切片从已载入的 view.customFilter 读取“已提交到图表编辑状态”的过滤树，不从 RowAuth 的临时事件载荷读取。现有 FilterTree 提交边界已清除 truthy 临时 field；打开编辑时按 fieldId 从字段目录重建 field。该产品切片不调用、不复制、不重新实现 ChartFilterPayloadDesign-r003 的 prepareChartFilterPayload helper。该 helper 仍保持 3/3 NEEDS_REVISION，不因本设计改名、拆分或重新评审。
3. 图表目标是 editor 当前的 ChartObj；tableId 为数据集身份，id 为图表身份。api/chart.ts 已有 checkSameDataSet(sourceViewId, targetViewId) 服务端同数据集校验。本切片在粘贴时还要求 source/target tableId 都非空且严格相同；API 成功响应不能替代本地 ID 比较。
4. editor 的 calcData(view) 是已有刷新入口；静态来源追踪显示 changeFilterData() 单独赋值不会自动发出取数事件。成功粘贴需在整树替换完成后调用现有 calcData，不得通过 FilterTree 编辑提交绕开数据刷新，也不得先改目标再确认。
5. 普通保存重用现有 canvasSave 路径；本切片不另发保存请求。保存后重新打开由现有 canvas 载入链恢复 view.customFilter。

## 产品动作合同

### Copy

- 仅在当前图表编辑器可操作时显示/启用动作；仅接受柱图或折线图普通图表，以及非空、结构可识别的 view.customFilter。
- 复制前采集当前登录 uid 与 oid、来源图表 ID、数据集 ID、复制时刻及完整过滤树。uid/oid 只用于隔离本地复制内容，不是权限证明或授权票据；不保存 token。
- 将完整 JSON 复制载荷写入同源 localStorage，以满足同用户同浏览器跨标签共享；不触碰 navigator/system clipboard。
- 复制校验或写入失败时不覆盖上次有效载荷；成功提示“过滤条件已复制”。

### Paste

- 当前目标必须为柱图或折线图普通图表；当前编辑会话必须具备现有 Dashboard 编辑访问状态。执行时重新读取当前 uid/oid；无身份、剪贴身份不符、组织不符或内容过期时 fail closed。
- 重新检查源/目标 tableId 非空且完全相同，并调用已有 checkSameDataSet(sourceChartId, targetChartId)。任何一项不一致、请求失败或响应非肯定均不改目标、不刷新、不显示成功提示。
- 完整校验 payload 和目标可承载形状。叶子条件上限按 DEC-013 的最多 50 个、组合节点不计；不得截断。1MB 按 UTF-8 序列化 JSON 字节数测量，超过 1,000,000 bytes 拒绝且保留已有剪贴内容；此技术计量点是本切片实现约定，尚不能关闭 ISS-AC-02 的全量边界验收。
- 若目标已有有效条件，先给一次覆盖确认；取消时配置、快照、预览与请求计数不变。空目标直接进入应用。
- 确认后先构造独立完整副本，再一次性替换 view.customFilter；只在替换成功后调用既有 calcData(view)。成功显示“过滤条件已应用”。不自动保存。
- 任一校验失败或异常都不得部分应用；保留旧目标和旧剪贴内容，不刷新、不显示成功提示。

## 身份、失效与权限边界

- copiedAt 使用浏览器时间，生命周期按 [0, 1,800,000ms) 处理；复制不续期，粘贴不消耗。该区间是实现候选；DEC-008 已确认 30 分钟有效，ISS-AC-01 仍要求精确 1800 秒边界进入实现契约并保留 1799/1801 秒证据。本切片不宣称 ISS-AC-01 已关闭。
- 同一浏览器的 user.uid 或 user.oid 变化、注销清理、载荷身份不匹配时删除当前同源复制项，且回到原 uid/oid 也不得恢复旧内容。StorageEvent 用于同步跨标签变化；当前标签通过 user Store 状态变化清理。
- 真实权限仍由既有 DataEase 访问/保存链负责；本切片不得新增默认放行、伪造 permission provider 或将 editMode 单独宣称为授权证明。对当前 Dashboard/目标编辑权的刷新校验必须复用现有 screen 权限数据/API；现有权限结果缺失或低于既有编辑门槛时拒绝动作。
- 来源配置读取、只读用户禁止查看/复制/粘贴、身份切换、撤权/恢复必须在具备真实权限实现的隔离多用户环境中独立验收。当前权限模块来源和隔离账号缺失，这些项目保持 BLOCKED / NOT_RUN。

## 首轮冻结用例与观察点

绑定用例见 ChartToChartFilterCopyProductSliceCases-r001.json。最小用户路径为：源柱图复制有效过滤树 → 标签切换至同数据集折线图 → 粘贴并确认覆盖（或空目标直接应用）→ 观察完整树、一次既有刷新、成功提示 → 手动保存 → 重开后配置一致。

独立观察包括：载荷写入/读取、uid/oid、资源与数据集 ID、same-dataset API 返回、确认/取消、目标树摘要、snapshot/cache 调用、calcData/实际 query 请求、成功提示、保存请求、重开回读。Builder 自测不构成独立 Validation。

## 阻塞与进入结论

- 可进入的具体产品改动：为普通图表过滤器编辑器增加 copy/paste 动作与同源同用户 clipboard store，按上述合同接入同数据集检查、确认替换、预览刷新和既有保存路径。该实现只增加同一普通图表类别的本地 UI/机械行为。
- 本切片不依赖已终轮失败的通用 ChartFilterPayload helper；输入是当前图表的持久 JSON customFilter，并经本切片自己的产品合同校验。若实现不得不读取 FilterTree 临时 field 或复用该 helper 的 unresolved semantics，立即停止该调用路径，不得以新命名绕过原结论。
- 必须由维护者/外部环境补充的输入：授权 permission module 的来源/调用契约与隔离多用户实例，用于真实只读拒绝、撤权/恢复验收；S01 维护者提供 AC-F01-ORIG-02 的终态/回归证据，用于关闭旧组件复制改类型兼容项。两者不阻止本切片机械 UI/预览/保存开发，但阻止相关验收与 S02 终态。
- 当前仍缺本设计的独立语义审查、冻结 Cases/可信 RED、精确 Builder admission。未完成前不写产品代码。
