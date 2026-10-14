# Access 候选独立静态语义复核 v1

- reviewed_at：2026-10-14T02:32:00.236606+00:00
- snapshot_id：SP001-access-semantic-v1
- as_of_state：extraction/access/candidate.json 当前候选，尚未绑定正式 KB、最终 Dashboard 或收尾状态。
- 输入 SHA-256：`78eac584dd70e0e697f8f0b75a1ec43761989fd1e655e8ef840e9b4e4583af34`。
- reviewer：data_extract（此前编写 data 候选，未参与 access 候选编写；本轮只读 access 与产品源码）。
- verdict：**REQUIRES_CHANGES（需要补充后再审）**。F09 的可读前端核心入口尚未覆盖，F10 缺可读的导出数据量/分片及真正脱敏落点契约。不是运行失败结论，也不是全 KB 最终审阅。

## 范围和方法

已复验 access-semantic-card，摘要与调用方固定值一致。依 Goal 的“全仓盘点＋核心深挖、静态门槛、XPack仅公共契约与核心调用”边界进行审阅。亲读源码检查权限拒绝、分享持久化、导出和脱敏，不要求本轮运行测试或访问专有实现。没有编辑候选，没有运行产品、测试或数据库，没有访问外部网络。

候选分母为46事实、4项核心能力（F08/F09/F10/F15）及1项导航能力F23。重点事实样本29/46：ACCESS-001, ACCESS-002, ACCESS-003, ACCESS-004, ACCESS-005, ACCESS-007, ACCESS-008, ACCESS-010, ACCESS-011, ACCESS-012, ACCESS-013, ACCESS-014, ACCESS-015, ACCESS-016, ACCESS-017, ACCESS-019, ACCESS-020, ACCESS-022, ACCESS-023, ACCESS-025, ACCESS-026, ACCESS-032, ACCESS-033, ACCESS-035, ACCESS-039, ACCESS-040, ACCESS-041, ACCESS-042, ACCESS-046。涉及候选证据文件24个；源码读取样本见下表。其余17条未作逐条语义认可，不把样本通过外推为全事实认证。另扩读 Entrances.vue 全文件及 ExportCenterDownLoadManage.java:392–510，用以检查候选遗漏。

## 逐能力判断

| 能力 | 本轮核实 | 判断 |
|---|---|---|
| F08 链接分享 | ShareAuthorizationManage:29–97、ShareTicketManage:55–132/191–225、XpackShareManage:119–230/318–368、LinkTokenUtil:16–62、LinkTokenValidationManage:58–108、DeLinkAop:49–130、ShareVisitorPermissionManage全文件、ShareQueryScopeAop:31–86 | 已读关键事实与拒绝分支吻合。创建关闭按当前创建者+资源处理全部重复记录、Ticket级联、JVM锁而非跨JVM锁的边界明确。没有发现需阻断该项的事实错误。 |
| F09 嵌入 | EmbeddedApi:29–92、embedded Store:108–121/188–200、embedded.ts:1–3、EmbeddedIntractive.ts全文件、Axios:126–130/175–183；额外 Entrances.vue全文件 | 必须补充本仓可见的握手入口与失败路径，不能以企业实现不可见替代。现有接口声明及Store事实基本正确，但契约不完整。 |
| F10 导出 | ChartDataServer:257–265/360–381、ExportCenterDownLoadManage:309–521、ExportCenterManage:103–187/478–508、CoreVisualizationExportManage:56–106、imgUtils:165–201 | 同步/异步分流、异步身份恢复与清理、Ticket消费及PNG/PDF分支样本吻合；必须补录数据集导出限额/分片与数据行脱敏落点。 |
| F15 身份/数据权限 | PermissionManage:58–141/188–329、ChartDataBuild:1333–1402、DatasetDataManage:552–585、InteractiveAuthApi:44–86、替补登录:19–57 | 列权限用户优先、白名单、系统变量树剔除、替补模式边界与候选一致；列脱敏多规则选择语义需精确化，见建议。企业持久化与通用鉴权源不可见可保留范围限制。 |
| F23 任务中心导航 | ACCESS-020/022，ExportCenterManage:103–187/478–508 | 导航样本可接受：分页按uid；重试只允许FAILED；下载以Ticket绑定身份校验并删下载记录。未宣称并发一次性保证是正确边界。 |

## 必须修正

### B1：F09 将可见前端核心流程遗漏在“企业实现不可见”限制之后

关联 ACCESS-014/015/016 及 F09 contract。`core/core-frontend/src/views/component/embedded-iframe/Entrances.vue:17–42` 明确包含：只处理 de-embedded 消息、ensureDekey、同源分支直接设置Store/iframe标记/宿主窗口并发initIframe事件；跨源分支把 event.origin 经 btoa+RSA 后调用 initApi，只有响应无msg才落状态，否则及catch显示域名匹配错误。`:55–79` 还有已有Token/普通预览/分享链接的早退分支、message监听安装和移除、ready postMessage。

当前F09 trigger仅引用一个HTTP helper；failures引用ACCESS-016的事件发送/no-op分支，实际初始化拒绝路径不在事实中；data为空而可见状态载荷已有ACCESS-014。应新增可追溯握手事实，把真正触发、前置条件、拒绝、状态、事件输出与监听生命周期分别挂入contract；保留企业后端域名/签发实现不可见的限制。此修正只需读主仓源码，无需扩大范围。

### B2：F10 缺失实际导出限制与脱敏到文件的关键中段

关联 ACCESS-019/041 及F10。`core/core-backend/src/main/java/io/dataease/exportCenter/manage/ExportCenterDownLoadManage.java:392–447` 按orderChecked构造排序，查询总数后以 `ExportCenterUtils.getExportLimit("dataset")` 截断，按sheetLimit/extractPageSize分片；查询请求携带prepared参数，随后调用 `buildPreviewData(..., desensitizationList, false)`。`:448–510` 把该结果写入Excel、更新进度、加水印并输出文件。

ACCESS-019仅覆盖前段过滤与结束处理，ACCESS-041只证明预览/普通表使用脱敏算法；F10把它当依赖仍没有表述导出文件实际使用哪个结果，也未交付输出行数约束。应增加中段事实及源码区间，明确静态限额/分页和脱敏调用，不承诺所有导出入口一致、不把现有分页实现当运行正确性证明。此为核心输出约束和安全数据链，不宜留Gap。

## 非阻断精度建议

ACCESS-023 建议写清：用户/角色匹配项只要任一opt是Desensitization便保留字段，但 `desensitizationList.put(..., fieldUserColumnPermissionItems.get(0))` /角色对应分支登记的是第一项，并非筛选出的那个脱敏项（PermissionManage:80–95）。目前“匹配脱敏规则…登记脱敏项”的措辞可能令读者误以为稳定选中匹配的脱敏规则。保留用户优先事实，补上实际取首项行为即可；本审阅不要求修改产品算法。

## 允许保留的边界

真实HTTP身份矩阵、JWT过期并发、下载一次性并发、所有导出入口运行、浏览器像素效果、XPack专有实现均未验证。其缺失不阻止本次静态知识工作，但不得作运行正确声明。本轮也未逐读ACCESS-044/045测试资产，故不额外认可测试覆盖结论。正式KB和最终收尾仍需后续独立最终包审阅。

## 交接

由access Builder补充B1/B2并精确化ACCESS-023；保持原候选快照不覆盖。重新交付变更事实ID、源码摘要和contract关系，进行针对性复审。本报告冻结上述候选摘要，不随后续候选修改而重写。
