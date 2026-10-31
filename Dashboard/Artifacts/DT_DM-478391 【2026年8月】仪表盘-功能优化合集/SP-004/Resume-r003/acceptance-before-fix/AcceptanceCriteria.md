# S00 验收契约候选 r003

状态：proposed。仅规格/手算 oracle，未运行产品、未创建实际测试数据/测试代码；独立审查与 Goal 终态由主流程另行决定。

权威：DecisionLedger.json 的156题原题、用户答案与确认原文；V1规则为索引，不替代确认。每项Given/When/Then是可观察场景，不表示已测试。Q072/Q079/Q087是Q071的明确例外；Q077细化冲突属性；Q078不要求新增动态运行时检测；Q025/Q027细化方向策略；Q138固定底层记录粒度；Q152明确不复用历史计算缓存。

S00自身验收ID S00-AC-01..09 保持原Goal不变；本文件的 AC-Fxx-Qnnn 为产品规则规格，主要支持 S00-AC-05/06，不代替 S00其他工作包。所有确认原文中的适用约束仍有效，以下场景与 FixtureSpec 合读；本表不是再次裁定需求。

覆盖与适用性：权限对涉及数据读取/修改/导出的场景适用；编辑配置按原保存流程分别检查取消、失败、保存重开及另一查看会话。运行态枚举清理不写回设计态配置。纯范围声明不适用持久化/数值计算，标于FX-SCOPE。继承现有行为的精确oracle或性能环境缺失时保持部分设计阻塞，不由样例推定通过。

本轮四个输出写前均不存在，创建新文件；不覆盖历史或权威输入。卡片与admission在首次写入前验证通过。

## AC-GLOBAL-Q001
来源：Q001 / DEC-001；conversation-source.md:L192；规则：BR-GLOBAL-001。
- Given（前提）：完整输入和156决策。
- When（操作）：核对八项目录与分阶段计划。
- Then（可观察结果）：F01–F08各有规则、异常和AC；分阶段不得删除任何一项，S00仅交付规格。
- Fixture：FX-SCOPE；问题：无本题新增设计阻塞。

## AC-GLOBAL-Q002
来源：Q002 / DEC-002；conversation-source.md:L262；规则：BR-GLOBAL-002。
- Given（前提）：八项功能现状尚未实测。
- When（操作）：审查后续差异调查入口。
- Then（可观察结果）：逐项要求已支持/部分/未支持证据，缺陷或缺口才实施；不把旧文档当现状，不在S00调查代码。
- Fixture：FX-SCOPE；问题：无本题新增设计阻塞。

## AC-GLOBAL-Q003
来源：Q003 / DEC-003；conversation-source.md:L332；规则：BR-GLOBAL-003。
- Given（前提）：原始文档与用户裁定不同。
- When（操作）：核对每条规则来源。
- Then（可观察结果）：最终选择优先，未裁定歧义进入问题清单；不以V1摘要覆盖原确认细节。
- Fixture：FX-SCOPE；问题：无本题新增设计阻塞。

## AC-F01-Q004
来源：Q004 / DEC-004；conversation-source.md:L398；规则：BR-F01-001。
- Given（前提）：同数据集的柱图、普通表、透视表及两个查询组件。
- When（操作）：分别执行四种类型方向粘贴。
- Then（可观察结果）：图表→图表及查询→查询允许；图表↔查询均拒绝且目标配置不变。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q005
来源：Q005 / DEC-005；conversation-source.md:L471；规则：BR-F01-002。
- Given（前提）：同用户同浏览器标签A/B打开不同仪表盘。
- When（操作）：A复制后B粘贴。
- Then（可观察结果）：B获得同一配置；不要求跨设备/浏览器；刷新B不得制造新有效期。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q006
来源：Q006 / DEC-006；conversation-source.md:L529；规则：BR-F01-003。
- Given（前提）：D1和同名但ID不同的D2，另有已删除数据集。
- When（操作）：向三种目标粘贴。
- Then（可观察结果）：仅D1通过；D2即使字段同名同类型仍拒绝；ID无法确认也拒绝。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q007
来源：Q007 / DEC-007；conversation-source.md:L588；规则：BR-F01-003。
- Given（前提）：目标旧条件为金额<50，源为嵌套树T。
- When（操作）：分别确认、取消及向空目标粘贴。
- Then（可观察结果）：确认后树完全等于T且旧条件消失；取消配置/预览不变；空目标直接应用。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q008
来源：Q008 / DEC-008；conversation-source.md:L649；规则：BR-F01-004。
- Given（前提）：复制时刻t0，已有树T。
- When（操作）：在t0+29分59秒多次粘贴、刷新、超过30分钟及再次复制。
- Then（可观察结果）：未过期可重复使用且不消耗、不续期；超过30分钟拒绝并提示重新复制；新复制替换T并重计时；恰30分钟判定见ISS-AC-01。
- Fixture：FX-COPY；问题：ISS-AC-01。

## AC-F01-Q009
来源：Q009 / DEC-009；conversation-source.md:L710；规则：BR-F01-004。
- Given（前提）：用户U复制，随后登出或换V再回U。
- When（操作）：尝试粘贴并撤销U的数据集/目标编辑权限。
- Then（可观察结果）：旧内容不可恢复；每次粘贴重验身份、数据集访问及目标编辑权限，拒绝时不改目标。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q010
来源：Q010 / DEC-010；conversation-source.md:L772；规则：BR-F01-002。
- Given（前提）：系统剪贴板已有外部文字。
- When（操作）：用组件按钮复制T再跨标签粘贴。
- Then（可观察结果）：DataEase共享内容可用，系统剪贴板不被覆盖；不要求操作系统粘贴快捷键。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q011
来源：Q011 / DEC-011；conversation-source.md:L804；规则：BR-F01-005。
- Given（前提）：源无有效条件，另有旧复制T。
- When（操作）：清空源的最后条件后尝试复制。
- Then（可观察结果）：复制按钮禁用，不通过空复制清空目标；原有删除/清空操作仍可用。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q012
来源：Q012 / DEC-012；conversation-source.md:L836；规则：BR-F01-005。
- Given（前提）：树T含字段/运算符/值、AND/OR嵌套及动态表达式。
- When（操作）：复制到同上下文同数据目标。
- Then（可观察结果）：两者过滤命中记录ID相同；保存动态规则而非结果，样式/布局/查询结果不复制。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q013
来源：Q013 / DEC-013；conversation-source.md:L868；规则：BR-F01-006。
- Given（前提）：50/51叶子树及容量边界，旧剪贴内容T。
- When（操作）：分别复制。
- Then（可观察结果）：50且不超容量允许，51或超1MB拒绝且T保持；组合节点不计叶子，1001枚举未超两限应允许；字节口径见ISS-AC-02。
- Fixture：FX-COPY；问题：ISS-AC-02。

## AC-F01-Q014
来源：Q014 / DEC-014；conversation-source.md:L933；规则：BR-F01-007。
- Given（前提）：目标旧预览和已保存版本P0。
- When（操作）：成功粘贴、取消、失败、保存重开。
- Then（可观察结果）：成功立即预览新条件，只有正常保存后重开保留；取消/失败不刷新、不修改；不新增自动保存。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F01-Q015
来源：Q015 / DEC-015；conversation-source.md:L987；规则：BR-F01-001。
- Given（前提）：普通图、普通表、透视表且D1一致。
- When（操作）：互相复制通用过滤；再制造目标不支持的规则。
- Then（可观察结果）：通用规则完整应用；维度/指标/排序/样式不带入；无法完整承载时整次拒绝。
- Fixture：FX-COPY；问题：无本题新增设计阻塞。

## AC-F02-Q016
来源：Q016 / DEC-016；conversation-source.md:L1041；规则：BR-F02-001。
- Given（前提）：掌上运营及数智应用内嵌报告。
- When（操作）：打开表格全屏入口。
- Then（可观察结果）：两指定App纳入；未指定App及手机浏览器不作为通过替代证据；具体版本矩阵待ISS-AC-03。
- Fixture：FX-MOBILE；问题：ISS-AC-03。

## AC-F02-Q017
来源：Q017 / DEC-017；conversation-source.md:L1114；规则：BR-F02-002。
- Given（前提）：手机报告滚动位置s、方向o、选中表A。
- When（操作）：点击全屏再关闭/返回。
- Then（可观察结果）：独立页只含A，优先横屏，退出恢复报告状态和方向；不支持宿主按Q025降级，不将旋转直接作为入全屏触发。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q018
来源：Q018 / DEC-018；conversation-source.md:L1186；规则：BR-F02-003。
- Given（前提）：报告有A/B两表，A宽于屏幕。
- When（操作）：进入A全屏横向滑动再退出选B。
- Then（可观察结果）：滑动滚动A列而不切B；看B需退出再进入；报告位置不丢。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q019
来源：Q019 / DEC-019；conversation-source.md:L1255；规则：BR-F02-004。
- Given（前提）：表A具有既有移动端分页/排序/筛选。
- When（操作）：全屏滚动并操作已支持交互。
- Then（可观察结果）：横纵数据可达，分页正确，既有能力不退化；不新增缩放或列宽要求，基线见ISS-AC-03。
- Fixture：FX-MOBILE；问题：ISS-AC-03。

## AC-F02-Q020
来源：Q020 / DEC-020；conversation-source.md:L1309；规则：BR-F02-005。
- Given（前提）：报告筛选华东、销售降序、第2页。
- When（操作）：进入全屏，再改全屏排序和页码后退出。
- Then（可观察结果）：入页继承全部状态；退出回原报告筛选/排序/第2页；不要求反向同步全屏修改，尽可能复用已加载数据。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q021
来源：Q021 / DEC-021；conversation-source.md:L1370；规则：BR-F02-006。
- Given（前提）：代表设备网络数据规模尚未确认。
- When（操作）：设计首屏性能测量。
- Then（可观察结果）：从进入全屏到有效数据可见且可浏览应≤3秒，不是空框/动画；不要求全部加载，不能以规格小样本代替性能环境，见ISS-AC-03。
- Fixture：FX-MOBILE；问题：ISS-AC-03。

## AC-F02-Q022
来源：Q022 / DEC-022；conversation-source.md:L1438；规则：BR-F02-006。
- Given（前提）：全屏加载超过3秒或临时切App。
- When（操作）：等待、返回、加载失败、切回。
- Then（可观察结果）：继续显示加载且可返回；失败提示不伪装空数据；宿主未销毁时保留全屏状态，宿主销毁恢复能力待调查。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q023
来源：Q023 / DEC-023；conversation-source.md:L1508；规则：BR-F02-003。
- Given（前提）：普通表及透视表各含分页数据。
- When（操作）：在指定App手机和平板分别全屏。
- Then（可观察结果）：两类型均可浏览和退出，不能以普通表通过替代透视表。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q024
来源：Q024 / DEC-024；conversation-source.md:L1563；规则：BR-F02-007。
- Given（前提）：零条成功结果与查询错误。
- When（操作）：分别打开全屏。
- Then（可观察结果）：成功空集显示暂无数据；错误显示失败；两者均可返回且原报告状态不丢。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q025
来源：Q025 / DEC-025；conversation-source.md:L1595；规则：BR-F02-002。
- Given（前提）：支持及不支持方向控制的手机宿主。
- When（操作）：分别进入/手动旋转/退出。
- Then（可观察结果）：支持者自动横屏；不支持者提示手动旋转且横屏适配，通过降级不算阻断；退出尽可能恢复原方向。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F02-Q026
来源：Q026 / DEC-026；conversation-source.md:L1658；规则：BR-F02-001。
- Given（前提）：指定App的手机和平板。
- When（操作）：分别普通表/透视表全屏。
- Then（可观察结果）：四种设备×表类型组合均纳入，平板不能以手机模拟截图替代验收。
- Fixture：FX-MOBILE；问题：ISS-AC-03。

## AC-F02-Q027
来源：Q027 / DEC-027；conversation-source.md:L1717；规则：BR-F02-002。
- Given（前提）：平板竖屏/横屏及手机竖屏。
- When（操作）：进入全屏并旋转平板。
- Then（可观察结果）：手机优先横屏；平板保持进入方向并适配后续旋转，退出回原报告状态。
- Fixture：FX-MOBILE；问题：无本题新增设计阻塞。

## AC-F03-Q028
来源：Q028 / DEC-028；conversation-source.md:L1778；规则：BR-F03-001。
- Given（前提）：普通表/透视表/热力表数据。
- When（操作）：分别发起导出。
- Then（可观察结果）：三类均纳入，其他实际表格类型需S01枚举；非表格不扩大范围，未枚举覆盖见ISS-AC-04。
- Fixture：FX-EXPORT；问题：ISS-AC-04。

## AC-F03-Q029
来源：Q029 / DEC-029；conversation-source.md:L1845；规则：BR-F03-001。
- Given（前提）：FX-EXPORT共10000行，华东筛选2000行，每页50。
- When（操作）：当前页第2页按ID降序导出。
- Then（可观察结果）：普通表导出ID2000..1共2000行，非50；透视表导出聚合及适用汇总，不泄露未展示原始明细。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q030
来源：Q030 / DEC-030；conversation-source.md:L1928；规则：BR-F03-001。
- Given（前提）：同一2000行过滤结果并有屏幕外列。
- When（操作）：分别XLSX/CSV/图片导出。
- Then（可观察结果）：三格式全部行列及表头完整；图片不能仅可视区截图，CSV中文/分隔符正确；超容量按Q031/032明确失败。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q031
来源：Q031 / DEC-031；conversation-source.md:L1995；规则：BR-F03-002。
- Given（前提）：图片容量上限尚待技术验证。
- When（操作）：在批准上限以内/以上及生成失败分别设计用例。
- Then（可观察结果）：以内交付全量，以上拒绝并建议XLSX/CSV，错误不交付半图；具体边界不可执行见ISS-AC-04。
- Fixture：FX-EXPORT；问题：ISS-AC-04。

## AC-F03-Q032
来源：Q032 / DEC-032；conversation-source.md:L2062；规则：BR-F03-003。
- Given（前提）：行数499999/500000/500001、容量100MB附近、耗时30分钟附近。
- When（操作）：发起XLSX/CSV导出。
- Then（可观察结果）：500000以内可进入其余校验，500001拒绝；超100MB终止不交付；超过30分钟终止；100001行需大数据提示；字节与计时口径见ISS-AC-02/05。
- Fixture：FX-EXPORT；问题：ISS-AC-02, ISS-AC-05。

## AC-F03-Q033
来源：Q033 / DEC-033；conversation-source.md:L2094；规则：BR-F03-004。
- Given（前提）：同步小任务及异步长任务。
- When（操作）：提交异步后关闭页面再登录。
- Then（可观察结果）：提交提示不等于成功；任务继续，成功可下载，失败保留原因；无完整文件不得标成功；切换样本待ISS-AC-05。
- Fixture：FX-EXPORT；问题：ISS-AC-05。

## AC-F03-Q034
来源：Q034 / DEC-034；conversation-source.md:L2126；规则：BR-F03-005。
- Given（前提）：U在两个报告各有排队/执行/成功/失败任务，V另有任务。
- When（操作）：打开全局任务中心并重新登录。
- Then（可观察结果）：U跨报告任务均可见，成功可下载；不泄露V无权任务；关闭报告不终止任务。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q035
来源：Q035 / DEC-035；conversation-source.md:L2187；规则：BR-F03-005。
- Given（前提）：U有成功文件。
- When（操作）：跨时间与重新登录重复下载。
- Then（可观察结果）：不因保存时长自动过期/删除；每次仍重验权限；只证明设计无TTL，不能声称已观察永久运行。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q036
来源：Q036 / DEC-036；conversation-source.md:L2249；规则：BR-F03-005。
- Given（前提）：U/V文件及有/无管理权限管理员。
- When（操作）：删除自己、他人文件，确认或取消。
- Then（可观察结果）：普通U仅可删自己；管理员须管理权限；确认后不可下载且有审计，取消仍可下载；不推断任务记录同时删除，保留策略见ISS-AC-06。
- Fixture：FX-EXPORT；问题：ISS-AC-06。

## AC-F03-Q037
来源：Q037 / DEC-037；conversation-source.md:L2310；规则：BR-F03-006。
- Given（前提）：历史文件存在，U数据权限撤销后恢复，原资源再删除。
- When（操作）：分别从任务中心及直接下载接口下载。
- Then（可观察结果）：撤销/资源不存在/无法校验均拒绝且文件保留；恢复重验通过才允许；管理员需管理与数据访问双权限。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q038
来源：Q038 / DEC-038；conversation-source.md:L2342；规则：BR-F03-006。
- Given（前提）：文件含东南两区及销售/利润列。
- When（操作）：依次缩窄行权、列权及制造覆盖无法判定。
- Then（可观察结果）：两种缩窄均拒绝原文件、提示重导且文件保留；不能因有数据集查看权放行；权限覆盖恢复才可下载。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q039
来源：Q039 / DEC-039；conversation-source.md:L2374；规则：BR-F03-007。
- Given（前提）：U排队/执行/成功/失败任务及V任务。
- When（操作）：U/授权管理员分别取消。
- Then（可观察结果）：可取消本人排队/执行任务，管理员须权限；成功任务只能删文件，失败/已取消不重复取消；取消后停止后续查询/写入并清临时文件、保留人时状态。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q040
来源：Q040 / DEC-040；conversation-source.md:L2406；规则：BR-F03-004。
- Given（前提）：存在旧导出路由。
- When（操作）：依据数据规模、查询复杂度实测制定自动切换用例。
- Then（可观察结果）：用户不手选模式，复用满足要求者；具体切换阈值保持待证，不预设10万行为切换点，见ISS-AC-05。
- Fixture：FX-EXPORT；问题：ISS-AC-05。

## AC-F03-Q041
来源：Q041 / DEC-041；conversation-source.md:L2467；规则：BR-F03-004。
- Given（前提）：既有任务并发/排队策略未核实。
- When（操作）：比较同一任务集改造前后调度。
- Then（可观察结果）：不新增用户并发上限或平行调度，保留资源保护；基线能力及恢复入口见ISS-AC-05。
- Fixture：FX-EXPORT；问题：ISS-AC-05。

## AC-F03-Q042
来源：Q042 / DEC-042；conversation-source.md:L2540；规则：BR-F03-008。
- Given（前提）：FX-FORMAT含数字、百分比、日期、文本及空值。
- When（操作）：导出XLSX与CSV。
- Then（可观察结果）：XLSX数字可求和、日期可计算且格式匹配；CSV为12,345.68、85.67%、2026-08-15等展示文本；空值按基线，不把XLSX全转字符串。
- Fixture：FX-EXPORT, FX-FORMAT；问题：无本题新增设计阻塞。

## AC-F03-Q043
来源：Q043 / DEC-043；conversation-source.md:L2631；规则：BR-F03-008。
- Given（前提）：彩色粗体合并单元格和汇总样式。
- When（操作）：导出XLSX。
- Then（可观察结果）：字体/背景/加粗/合并及适用条件样式、汇总样式保留，数据仍可计算；不要求像素级一致，不向CSV要求单元格样式。
- Fixture：FX-EXPORT, FX-FORMAT；问题：无本题新增设计阻塞。

## AC-F03-Q044
来源：Q044 / DEC-044；conversation-source.md:L2663；规则：BR-F03-009。
- Given（前提）：报告销售分析报告、表销售明细表、时刻2026-10-13 14:35:26。
- When（操作）：同秒导出两次。
- Then（可观察结果）：文件名销售分析报告_销售明细表_20261013_143526.xlsx及对应扩展名；任务ID不同，同名不覆盖；图片扩展名随确定格式。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q045
来源：Q045 / DEC-045；conversation-source.md:L2695；规则：BR-F03-010。
- Given（前提）：U仅华东行权、无利润列权且电话号码脱敏。
- When（操作）：三格式同步/异步导出。
- Then（可观察结果）：只有授权行列，电话保持脱敏；后台沿发起身份执行；校验失败拒绝，不能降级原始数据。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F03-Q046
来源：Q046 / DEC-046；conversation-source.md:L2727；规则：BR-F03-011、BR-F03-014、BR-F08-011。
- Given（前提）：提交冻结华东+ID降序，执行前新增符合条件行。
- When（操作）：执行异步并在UI改为华南。
- Then（可观察结果）：仍按冻结华东配置，使用执行时数据包含新增行；分批ID无重复遗漏，不能声称严格快照；动态更新一致性调查见ISS-AC-05。
- Fixture：FX-EXPORT；问题：ISS-AC-05。

## AC-F03-Q047
来源：Q047 / DEC-047；conversation-source.md:L2759；规则：BR-F03-012。
- Given（前提）：临时网络断开与权限/参数/容量/超时/取消错误。
- When（操作）：分别触发任务失败。
- Then（可观察结果）：可恢复故障有限重试，后五类不重试；重试不重复交付且计入上限口径；次数间隔待ISS-AC-05。
- Fixture：FX-EXPORT；问题：ISS-AC-05。

## AC-F03-Q048
来源：Q048 / DEC-048；conversation-source.md:L2791；规则：BR-F03-013。
- Given（前提）：任务创建→重试→成功→下载/拒绝→删除及取消分支。
- When（操作）：读取审计事件规格。
- Then（可观察结果）：事件含人、时、任务/文件标识、状态、行数/大小/耗时及重试原因；不含完整数据、明文敏感值、凭据；沿既有审计机制。
- Fixture：FX-EXPORT；问题：ISS-AC-06。

## AC-F03-Q049
来源：Q049 / DEC-049；conversation-source.md:L2823；规则：BR-F03-010。
- Given（前提）：U有表查看权无独立导出权，V无查看权。
- When（操作）：U/V导出与历史下载。
- Then（可观察结果）：U可导出授权且脱敏的数据，V拒绝；不新增独立导出权限；历史下载仍重验行列覆盖。
- Fixture：FX-EXPORT；问题：无本题新增设计阻塞。

## AC-F04-Q050
来源：Q050 / DEC-050；conversation-source.md:L2855；规则：BR-F04-001。
- Given（前提）：可选项规则仅允许华东/华南而数据有华北。
- When（操作）：不选值查询与选择华东查询。
- Then（可观察结果）：下拉只东南，不选值不因可选项规则过滤全国结果；选东按既有查询生效；不改数据权限。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q051
来源：Q051 / DEC-051；conversation-source.md:L2887；规则：BR-F04-002。
- Given（前提）：金额999/1000/10000/10001/20000及地区枚举。
- When（操作）：配置属于、不属于、固定范围、既有动态范围。
- Then（可观察结果）：属于/排除按集合生效；明确>=1000且<=10000命中1000/10000；不提供新正则规则；动态函数清单待ISS-AC-07。
- Fixture：FX-CASCADE；问题：ISS-AC-07。

## AC-F04-Q052
来源：Q052 / DEC-052；conversation-source.md:L2954；规则：BR-F04-002。
- Given（前提）：既有相对日期表达式和两次加载时刻。
- When（操作）：跨日期重新打开可选值并保存重开。
- Then（可观察结果）：每次重新求动态值，持久化表达式而非第一次结果；确切时间/时区oracle依既有语义待ISS-AC-07。
- Fixture：FX-CASCADE；问题：ISS-AC-07。

## AC-F04-Q053
来源：Q053 / DEC-053；conversation-source.md:L3017；规则：BR-F04-003。
- Given（前提）：金额样本FX-CASCADE。
- When（操作）：配置(>=1000 AND <=10000) OR =20000。
- Then（可观察结果）：命中1000、10000、20000，排除999/10001；嵌套括号语义不扁平化，最大树深待现有模型验证。
- Fixture：FX-CASCADE；问题：ISS-AC-07。

## AC-F04-Q054
来源：Q054 / DEC-054；conversation-source.md:L3086；规则：BR-F04-004。
- Given（前提）：省→市→区链，自身规则和只读用户。
- When（操作）：编辑者配置链；查看者尝试修改。
- Then（可观察结果）：可多级叠加自身规则且无环；只有编辑权可改；查看权不能越过编辑入口或保存接口。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q055
来源：Q055 / DEC-055；conversation-source.md:L3118；规则：BR-F04-004。
- Given（前提）：级联集合杭州/宁波/温州/绍兴，自身杭州/宁波/上海。
- When（操作）：加载城市候选。
- Then（可观察结果）：交集恰杭州、宁波；改成互斥集合时显示暂无可用选项，非并集。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q056
来源：Q056 / DEC-056；conversation-source.md:L3150；规则：BR-F04-005、BR-F07-006。
- Given（前提）：下游选择杭州/南京，上游由两省改江苏。
- When（操作）：重算下游及再下游。
- Then（可观察结果）：清杭州保南京，逐级重载并用有效值查询；不是清空全部或保留无效值。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q057
来源：Q057 / DEC-057；conversation-source.md:L3182；规则：BR-F04-005。
- Given（前提）：城市自身规则杭州/南京/上海，上游为空。
- When（操作）：加载、选择浙江后再清上游。
- Then（可观察结果）：空时三个自身合格项均可见，选浙江仅杭州，清空恢复三个且重验下游选择。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q058
来源：Q058 / DEC-058；conversation-source.md:L3267；规则：BR-F04-006。
- Given（前提）：已验证旧候选和失效网络/级联计算。
- When（操作）：刷新失败、再试成功或继续失败。
- Then（可观察结果）：不展示未经验证的候选，不绕过自身规则，提示可选值加载失败；成功空集与失败不同。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q059
来源：Q059 / DEC-059；conversation-source.md:L3362；规则：BR-F04-006。
- Given（前提）：一个过滤字段被删或类型不兼容，其他字段正常。
- When（操作）：查看、编辑及修复。
- Then（可观察结果）：保留失效配置，受影响字段禁用、编辑说明原因；其他字段可用；修复重验恢复，不静默忽略规则。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q060
来源：Q060 / DEC-060；conversation-source.md:L3460；规则：BR-F04-007。
- Given（前提）：合法A→B→C及旧保存版本。
- When（操作）：添加B→A或C→A，继续编辑再保存。
- Then（可观察结果）：实时指出直接/间接循环及路径，可继续编辑但拒绝持久化；修复后可保存，旧配置不被错误覆盖。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q061
来源：Q061 / DEC-061；conversation-source.md:L3562；规则：BR-F04-007。
- Given（前提）：3层和4层无环链。
- When（操作）：配置并确认保存。
- Then（可观察结果）：3层正常，4层警告但确认可保存；不设固定业务层数上限，仍保留资源保护，性能需单测。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q062
来源：Q062 / DEC-062；conversation-source.md:L3660；规则：BR-F04-008。
- Given（前提）：NULL、空串、一个空格及普通文字。
- When（操作）：属于/不属于/范围过滤跨支持Provider比较。
- Then（可观察结果）：与改造前相同，不新增等价化规则；确切结果需现有基线，见ISS-AC-07。
- Fixture：FX-CASCADE；问题：ISS-AC-07。

## AC-F04-Q063
来源：Q063 / DEC-063；conversation-source.md:L3762；规则：BR-F04-009。
- Given（前提）：级联可选值后端请求。
- When（操作）：测后端收到到生成返回的时长。
- Then（可观察结果）：数据库查询和过滤计入，网络/前端排除，目标≤3秒；深度/规模/环境待ISS-AC-03。
- Fixture：FX-CASCADE；问题：ISS-AC-03。

## AC-F04-Q064
来源：Q064 / DEC-064；conversation-source.md:L3867；规则：BR-F04-010。
- Given（前提）：编辑者规则R0、查看者另一会话。
- When（操作）：改R1预览/面板确定/保存失败/正常保存。
- Then（可观察结果）：编辑预览R1，查看者在成功保存前仍R0；失败不能宣称生效，保存成功重开才R1；取消不改已保存版本。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q065
来源：Q065 / DEC-065；conversation-source.md:L3958；规则：BR-F04-010。
- Given（前提）：合法规则无匹配与非法表达式及数据源错误。
- When（操作）：尝试保存。
- Then（可观察结果）：合法空集警告、确认进正常保存流程，取消保留编辑；非法禁止，查询错误不能冒充空集。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q066
来源：Q066 / DEC-066；conversation-source.md:L4065；规则：BR-F01-008、BR-F04-011。
- Given（前提）：含嵌套、动态、级联依赖的查询组件配置。
- When（操作）：同数据集复制到完整目标及缺引用/成环目标。
- Then（可观察结果）：完整目标全量独立复制，无查询结果/样式；缺字段/承载不全/成环则整次拒绝；有旧配置需确认。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q067
来源：Q067 / DEC-067；conversation-source.md:L4187；规则：BR-F01-008、BR-F04-011。
- Given（前提）：组件A复制到B。
- When（操作）：分别修改A和B并保存重开。
- Then（可观察结果）：互不联动，两个独立副本，跨仪表盘同样成立，不新增共享模板引用。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F04-Q068
来源：Q068 / DEC-068；conversation-source.md:L4297；规则：BR-F04-011。
- Given（前提）：字段id=f_city改名，新字段同名id=f_new。
- When（操作）：加载既有过滤配置。
- Then（可观察结果）：f_city改名仍有效并显示新名；f_new不自动替代；类型不兼容/删除保留失效规则。
- Fixture：FX-CASCADE；问题：ISS-AC-07。

## AC-F04-Q069
来源：Q069 / DEC-069；conversation-source.md:L4413；规则：BR-F04-011。
- Given（前提）：旧仪表盘无F04属性且有原级联。
- When（操作）：升级后打开，再主动配置新规则保存。
- Then（可观察结果）：未配置时结果/权限/级联不变；无需重建，主动配置后才启用。
- Fixture：FX-CASCADE；问题：无本题新增设计阻塞。

## AC-F05-Q070
来源：Q070 / DEC-070；conversation-source.md:L4513；规则：BR-F05-001。
- Given（前提）：Q070仅有历史静态候选字段代码证据。
- When（操作）：审查F05后续验收入口。
- Then（可观察结果）：不得宣布字段可选/渲染已验证；需要当前版本可复现实例和运行验证，见ISS-AC-08。
- Fixture：FX-STYLE；问题：ISS-AC-08。

## AC-F05-Q071
来源：Q071 / DEC-071；conversation-source.md:L4641；规则：BR-F05-001。
- Given（前提）：现有字段支持能力未核实。
- When（操作）：建立支持/缺陷/未支持矩阵。
- Then（可观察结果）：保留已有支持且仅复现缺陷修复，不扩大字段类型；Q072来源切换、Q079格式、Q087预览为明确例外，不回退为待裁定。
- Fixture：FX-STYLE；问题：ISS-AC-08。

## AC-F05-Q072
来源：Q072 / DEC-072；conversation-source.md:L4723；规则：BR-F05-002。
- Given（前提）：数据集四区域、当前结果仅华东/华南。
- When（操作）：新建默认枚举再切当前结果并保存。
- Then（可观察结果）：默认四项，切换两项，两模式均执行权限；此来源切换缺失也须补齐，不受Q071保守边界取消。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q073
来源：Q073 / DEC-073；conversation-source.md:L4830；规则：BR-F05-002。
- Given（前提）：真实数据值含小计/总计，另有系统汇总标签。
- When（操作）：当前结果模式提取枚举。
- Then（可观察结果）：真实小计/总计保留且去重，系统生成标签排除；不得按字符串直接过滤。
- Fixture：FX-STYLE, FX-LABEL；问题：无本题新增设计阻塞。

## AC-F05-Q074
来源：Q074 / DEC-074；conversation-source.md:L4926；规则：BR-F05-003。
- Given（前提）：规则选择华东，当前查询暂排除华东。
- When（操作）：切查询、重开面板、再恢复华东。
- Then（可观察结果）：配置仍含华东，暂不应用；出现后自动恢复；查看态查询不改持久化规则。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q075
来源：Q075 / DEC-075；conversation-source.md:L5033；规则：BR-F05-003。
- Given（前提）：条件字段与目标字段不同。
- When（操作）：对比当前既有跨字段支持及可复现缺陷。
- Then（可观察结果）：已有保留/修复，未支持不新增；实际字段组合oracle需ISS-AC-08。
- Fixture：FX-STYLE；问题：ISS-AC-08。

## AC-F05-Q076
来源：Q076 / DEC-076；conversation-source.md:L5142；规则：BR-F05-004。
- Given（前提）：同一明细单元格满足>=100和<=200两规则。
- When（操作）：配置相同属性，再修复互斥。
- Then（可观察结果）：明确冲突提示、不可保存；不按优先级覆盖；判定进一步按Q077属性粒度，动态静态边界按Q078。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q077
来源：Q077 / DEC-077；conversation-source.md:L5254；规则：BR-F05-004。
- Given（前提）：金额150同时满足R1/R2。
- When（操作）：分别背景黄+背景红、背景黄+背景黄、背景黄+加粗。
- Then（可观察结果）：前两冲突，即同值也冲突；后一可叠加；不同单元格或互斥条件不冲突。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q078
来源：Q078 / DEC-078；conversation-source.md:L5348；规则：BR-F05-004。
- Given（前提）：可静态确定的值/范围/枚举规则。
- When（操作）：新增修改形成冲突再尝试保存。
- Then（可观察结果）：实时提示可继续编辑，确定冲突拒绝保存，修复后可保存；不要求新增无法静态判定动态规则的运行时检测。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q079
来源：Q079 / DEC-079；conversation-source.md:L5458；规则：BR-F05-005。
- Given（前提）：FX-FORMAT数值及条件。
- When（操作）：分别配置百分比、小数位、单位、字体色、背景色、粗体、斜体。
- Then（可观察结果）：0.8525→85.25%、123.456→123.46、120→120万元及四视觉属性生效；七项缺失须补；不新增边框图标数据条色阶。
- Fixture：FX-STYLE, FX-FORMAT；问题：无本题新增设计阻塞。

## AC-F05-Q080
来源：Q080 / DEC-080；conversation-source.md:L5587；规则：BR-F05-005。
- Given（前提）：原值12345.678显示两位及单位。
- When（操作）：展示、排序、样式判断、汇总、导出。
- Then（可观察结果）：显示12,345.68元但计算/排序/判断用12345.678，XLSX仍数值，CSV展示文本。
- Fixture：FX-STYLE, FX-FORMAT；问题：无本题新增设计阻塞。

## AC-F05-Q081
来源：Q081 / DEC-081；conversation-source.md:L5706；规则：BR-F05-006。
- Given（前提）：明细120000/80000/150000，总计350000。
- When（操作）：设置>100000背景黄。
- Then（可观察结果）：明细第一/三黄，第二不黄；小计/总计行列不套新规则，保留已有汇总样式。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q082
来源：Q082 / DEC-082；conversation-source.md:L5829；规则：BR-F05-006。
- Given（前提）：单表跨指标19/20条规则。
- When（操作）：新增第20/21条、改规则、删后新增。
- Then（可观察结果）：第20允许，第21拒绝；修改不增数，删除释放名额，AND子条件非额外条数；历史>20不删，编辑处理见Q090及ISS-AC-08。
- Fixture：FX-STYLE；问题：ISS-AC-08。

## AC-F05-Q083
来源：Q083 / DEC-083；conversation-source.md:L5930；规则：BR-F05-007。
- Given（前提）：前端已收到可渲染数据。
- When（操作）：测至所有条件样式绘制完成。
- Then（可观察结果）：规则计算+样式应用+浏览器绘制≤2秒，非仅JS完成；排除网络/查询，标准环境规模见ISS-AC-03。
- Fixture：FX-STYLE；问题：ISS-AC-03。

## AC-F05-Q084
来源：Q084 / DEC-084；conversation-source.md:L6029；规则：BR-F05-007。
- Given（前提）：当前结果10000/10001行。
- When（操作）：应用条件样式。
- Then（可观察结果）：10000可同步，10001必须异步计算并应用，不长期阻塞主线程且最终全样式正确；异步不等于2秒通过。
- Fixture：FX-STYLE；问题：ISS-AC-03。

## AC-F05-Q085
来源：Q085 / DEC-085；conversation-source.md:L6131；规则：BR-F05-008。
- Given（前提）：条件/目标字段被删或类型不兼容，另有有效规则。
- When（操作）：查看/编辑再修复。
- Then（可观察结果）：无效规则保留并不应用、编辑提示原因，有效规则继续；修复通过后恢复，不自动删除。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q086
来源：Q086 / DEC-086；conversation-source.md:L6241；规则：BR-F05-008、BR-F07-011。
- Given（前提）：F05两来源与FX-ENUM。
- When（操作）：在条件样式搜索并批量输入。
- Then（可观察结果）：初始5000、完整范围搜索、存在性/权限校验及去重沿Q109–133；两来源各测，不以公共组件通过替代页面证据。
- Fixture：FX-STYLE, FX-ENUM；问题：无本题新增设计阻塞。

## AC-F05-Q087
来源：Q087 / DEC-087；conversation-source.md:L6346；规则：BR-F05-009。
- Given（前提）：已保存样式P0，面板改P1。
- When（操作）：输入、点预览、继续改P2、点确定/保存。
- Then（可观察结果）：输入不渲染，预览才P1；确定提交编辑态，正常保存才持久化；按钮/预览缺失需补齐。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q088
来源：Q088 / DEC-088；conversation-source.md:L6457；规则：BR-F05-009。
- Given（前提）：已有正常预览P0，新增确定冲突规则。
- When（操作）：点预览及确定。
- Then（可观察结果）：两者拒绝且无新计算/渲染，保持P0；修复后允许；不绕过冲突按顺序覆盖。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q089
来源：Q089 / DEC-089；conversation-source.md:L6552；规则：BR-F05-009。
- Given（前提）：进入面板为P0，连续预览P1/P2。
- When（操作）：点击取消。
- Then（可观察结果）：配置和展示都回P0而非P1；不新增面板逐步Undo/Redo，取消不可只撤最后一次。
- Fixture：FX-STYLE；问题：无本题新增设计阻塞。

## AC-F05-Q090
来源：Q090 / DEC-090；conversation-source.md:L6665；规则：BR-F05-010。
- Given（前提）：旧配置含汇总样式、冲突或>20条。
- When（操作）：升级直接打开，再修改规则保存。
- Then（可观察结果）：原样显示且不自动迁移/删除；新建/修改须新校验，违规提示修复后保存；历史识别机制待ISS-AC-08。
- Fixture：FX-STYLE；问题：ISS-AC-08。

## AC-F06-Q091
来源：Q091 / DEC-091；conversation-source.md:L6781；规则：BR-F06-001。
- Given（前提）：现有字段选择及单拖基线。
- When（操作）：用既有方式多选批量拖入再单拖。
- Then（可观察结果）：只补批拖缺口，不强制Ctrl/Shift/复选框；单拖行为不退化，交互入口待ISS-AC-09。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F06-Q092
来源：Q092 / DEC-092；conversation-source.md:L6891；规则：BR-F06-002。
- Given（前提）：FX-DRAG兼容/可转换/不兼容字段。
- When（操作）：批量拖入目标角色区。
- Then（可观察结果）：兼容直接、可转换沿现有规则、不兼容拒绝说明；底层数据类型不变，确切转换oracle待ISS-AC-09。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F06-Q093
来源：Q093 / DEC-093；conversation-source.md:L7009；规则：BR-F06-002。
- Given（前提）：四字段中三可用一不可用。
- When（操作）：一次批量拖放及全不可用变体。
- Then（可观察结果）：三成功一失败且逐项原因；成功不因失败回滚，全失败不改配置，失败类型不变。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q094
来源：Q094 / DEC-094；conversation-source.md:L7135；规则：BR-F06-003。
- Given（前提）：选择顺序利润、地区、销售额不同于列表顺序。
- When（操作）：拖入指标，地区不兼容。
- Then（可观察结果）：成功顺序利润、销售额；不能按列表排序，后续可单独重排。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q095
来源：Q095 / DEC-095；conversation-source.md:L7258；规则：BR-F06-003。
- Given（前提）：目标[销售额,利润,订单数]，选择[成本,毛利率]。
- When（操作）：落在销售额后，另测头/尾。
- Then（可观察结果）：结果[销售额,成本,毛利率,利润,订单数]；头尾同样整组连续且保选择顺序。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q096
来源：Q096 / DEC-096；conversation-source.md:L7388；规则：BR-F06-004。
- Given（前提）：目标已有销售额ID=s，候选同ID不同聚合及同名新ID。
- When（操作）：批量拖放。
- Then（可观察结果）：s跳过且原聚合不变，同名新ID可入，批内重复只一次；全重复不添加；不改单拖去重语义。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q097
来源：Q097 / DEC-097；conversation-source.md:L7528；规则：BR-F06-004。
- Given（前提）：目标实测容量K，已有K-2，候选含重复/失败及四有效字段。
- When（操作）：按选择顺序拖放。
- Then（可观察结果）：跳过项不占名额，前两有效入，后两超限提示；K不得由示例5冒充产品限制，待ISS-AC-09。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F06-Q098
来源：Q098 / DEC-098；conversation-source.md:L7646；规则：BR-F06-005。
- Given（前提）：批量全成功/部分成功/全失败。
- When（操作）：完成拖放并观察逻辑刷新。
- Then（可观察结果）：先完整配置后一次逻辑刷新；全失败零刷新；必要多HTTP不是失败但不得重复相同查询，保存沿原机制。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q099
来源：Q099 / DEC-099；conversation-source.md:L7769；规则：BR-F06-006。
- Given（前提）：普通表、透视表、热力/柱/线/饼/卡。
- When（操作）：尝试批量拖放。
- Then（可观察结果）：前两纳入；其他不增加批拖支持且原交互不退化。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q100
来源：Q100 / DEC-100；conversation-source.md:L7872；规则：BR-F06-006。
- Given（前提）：普通表维度/指标、透视表行/列/指标。
- When（操作）：逐区投放一批。
- Then（可观察结果）：五区域分别验收，一次只入一个区；各沿原限制及转换，不自动分散到多区。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q101
来源：Q101 / DEC-101；conversation-source.md:L7990；规则：BR-F06-007。
- Given（前提）：一批全成功/部分/全失败以及无效区域/取消。
- When（操作）：结束拖放。
- Then（可观察结果）：有效目标处理结束均清选择，即全失败也清；无效区和取消保留选择。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q102
来源：Q102 / DEC-102；conversation-source.md:L8094；规则：BR-F06-007。
- Given（前提）：选3字段并悬停有效/无效区和中间插槽。
- When（操作）：拖动但未释放，随后无效释放。
- Then（可观察结果）：显示3数量、正确插槽指示、无效禁止；无效释放不改配置且保选择。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q103
来源：Q103 / DEC-103；conversation-source.md:L8208；规则：BR-F06-008。
- Given（前提）：同一表已配置行/列/指标字段。
- When（操作）：跨区域移动和同区整组排序。
- Then（可观察结果）：行↔列及维度↔指标按兼容规则移动，非复制；同区组内按选择顺序；不要求跨图表。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q104
来源：Q104 / DEC-104；conversation-source.md:L8339；规则：BR-F06-008。
- Given（前提）：源[地区,产品,销售额,利润]目标[订单数]，产品不兼容。
- When（操作）：移动产品/销售额/利润；再模拟单项插入失败。
- Then（可观察结果）：成功后源[地区,产品]目标[订单数,销售额,利润]；单字段源删+目标入原子，失败原位原配置；整批部分成功不回滚成功项、不丢字段。
- Fixture：FX-DRAG；问题：无本题新增设计阻塞。

## AC-F06-Q105
来源：Q105 / DEC-105；conversation-source.md:L8490；规则：BR-F06-009。
- Given（前提）：字段有ID/显示名/格式/排序/聚合/样式。
- When（操作）：跨角色移动成功与失败。
- Then（可观察结果）：兼容属性保留，不兼容按既有转换；不改数据集类型，失败所有配置不变，原子性适用。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F06-Q106
来源：Q106 / DEC-106；conversation-source.md:L8613；规则：BR-F06-009。
- Given（前提）：与单字段相同配置和目标角色。
- When（操作）：单移对照批移。
- Then（可观察结果）：每字段配置转换与单移一致，不新增独立确认或配置变化提示；结果成功失败汇总仍保留。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F06-Q107
来源：Q107 / DEC-107；conversation-source.md:L8719；规则：BR-F06-010。
- Given（前提）：现有编辑器Undo/Redo状态待核实。
- When（操作）：批量后用现有撤销入口。
- Then（可观察结果）：能复用则按既有机制，未支持不新增独立历史；不宣称一批一定单撤销单元，见ISS-AC-09。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F06-Q108
来源：Q108 / DEC-108；conversation-source.md:L8828；规则：BR-F06-010。
- Given（前提）：现有鼠标和键盘/无障碍入口。
- When（操作）：鼠标多选拖放并回归既有快捷键。
- Then（可观察结果）：鼠标批量添加移动与插槽反馈可用，既有快捷键/无障碍不退化；不新增专用键盘批操作。
- Fixture：FX-DRAG；问题：ISS-AC-09。

## AC-F07-Q109
来源：Q109 / DEC-109；conversation-source.md:L8936；规则：BR-F07-001。
- Given（前提）：FX-ENUM有6001可访问值，特殊唯一值不在初始列表。
- When（操作）：加载后精确搜索该值。
- Then（可观察结果）：初始最多5000，搜索命中初始外值；仍满足自身/级联/权限；不能只筛客户端已加载集合。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q110
来源：Q110 / DEC-110；conversation-source.md:L9049；规则：BR-F07-002。
- Given（前提）：文本Abc/abc/中文/通配字符。
- When（操作）：以既有搜索机制比较改造前后。
- Then（可观察结果）：大小写/前缀/包含/特殊字符及Provider语义不自定义；具体oracle待ISS-AC-07。
- Fixture：FX-ENUM；问题：ISS-AC-07。

## AC-F07-Q111
来源：Q111 / DEC-111；conversation-source.md:L9163；规则：BR-F07-001。
- Given（前提）：匹配4999/5000/5001个值的集合。
- When（操作）：提交搜索。
- Then（可观察结果）：前两全返，5001最多5000并提示缩小范围；无分页更多；零命中独立空态。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q112
来源：Q112 / DEC-112；conversation-source.md:L9276；规则：BR-F07-003。
- Given（前提）：有效、缺失、类型错、被自身/级联/权限排除值。
- When（操作）：逐个自定义添加并模拟数据源失败。
- Then（可观察结果）：只有全部验证通过者加入，失败明确原因；数据源失败不放行；不向底层插入新值。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q113
来源：Q113 / DEC-113；conversation-source.md:L9408；规则：BR-F07-004。
- Given（前提）：输入客户A/B/C/D，其中C不存在D被规则排除。
- When（操作）：批量提交。
- Then（可观察结果）：新增A/B共2，失败C/D共2并说明原因；全无效零新增，已选保留。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q114
来源：Q114 / DEC-114；conversation-source.md:L9545；规则：BR-F07-004。
- Given（前提）：候选首尾空格并混合中英文逗号/分号、换行、Tab。
- When（操作）：解析并逐值验证。
- Then（可观察结果）：六类分隔都识别、默认trim首尾，候选顺序不乱；每个做存在/类型/过滤/级联/权限校验。
- Fixture：FX-ENUM, FX-QUOTE；问题：无本题新增设计阻塞。

## AC-F07-Q115
来源：Q115 / DEC-115；conversation-source.md:L9673；规则：BR-F07-004。
- Given（前提）：FX-QUOTE含引号内逗号/分号/换行/Tab及双引号转义。
- When（操作）：提交合法串及未闭合串。
- Then（可观察结果）：引号内保持一个值，两个双引号还原一个；合法逐值校验部分成功；未闭合整批零添加、格式错误且原选择不变。
- Fixture：FX-ENUM, FX-QUOTE；问题：无本题新增设计阻塞。

## AC-F07-Q116
来源：Q116 / DEC-116；conversation-source.md:L9825；规则：BR-F07-004。
- Given（前提）：已有A/B，输入A,C,B,C,D。
- When（操作）：批量添加。
- Then（可观察结果）：结果A/B/C/D，新2、重复3并列A/B/C；同类型比较沿现有语义，全重复不改选择。
- Fixture：FX-ENUM；问题：ISS-AC-07。

## AC-F07-Q117
来源：Q117 / DEC-117；conversation-source.md:L9958；规则：BR-F07-005。
- Given（前提）：既有请求/多选容量限制待核实。
- When（操作）：在实际容量上下边界批量提交。
- Then（可观察结果）：沿现有限制拒绝并提示，不把初始加载5000当单次输入上限；累计选中仍Q121，见ISS-AC-07。
- Fixture：FX-ENUM；问题：ISS-AC-07。

## AC-F07-Q118
来源：Q118 / DEC-118；conversation-source.md:L10062；规则：BR-F07-002。
- Given（前提）：关键字先输入甲后改乙，提交请求R1/R2逆序返回。
- When（操作）：仅输入、Enter、按钮搜索。
- Then（可观察结果）：输入不发搜索；显式提交才发，最后R2结果生效，旧R1不得覆盖。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q119
来源：Q119 / DEC-119；conversation-source.md:L10172；规则：BR-F07-002。
- Given（前提）：已有选择A且搜索有字。
- When（操作）：清空关键字。
- Then（可观察结果）：自动恢复当前权限/自身/级联下初始≤5000项，无需再次提交；选择A保留；旧搜索响应不可盖回已清空列表。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q120
来源：Q120 / DEC-120；conversation-source.md:L10278；规则：BR-F07-006。
- Given（前提）：先搜A选A再搜B选B再清空。
- When（操作）：观察选择与列表。
- Then（可观察结果）：选择累计A/B且重复不增；不在当前列表不等于失效；自身/上游变更才按有效性重验。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q121
来源：Q121 / DEC-121；conversation-source.md:L10409；规则：BR-F07-005。
- Given（前提）：已有4999不同值，批量输入重复1个和新X/Y。
- When（操作）：提交后再删1项选Y。
- Then（可观察结果）：先只新增X至5000，Y超限提示、已有不截断；重复不占额；删后可新增Y。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q122
来源：Q122 / DEC-122；conversation-source.md:L10526；规则：BR-F07-007。
- Given（前提）：已选A/B，源删除B与查询超时两分支。
- When（操作）：验证存在性。
- Then（可观察结果）：成功才清B留A，不自动用新名替代；超时保留A/B不视为缺失。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q123
来源：Q123 / DEC-123；conversation-source.md:L10646；规则：BR-F07-007。
- Given（前提）：打开仪表盘已选A/B但B删除且未打开下拉。
- When（操作）：初始化。
- Then（可观察结果）：自动验证并清B，用更新条件查询；不需手动开下拉，多字段可批量但不承诺固定请求数。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q124
来源：Q124 / DEC-124；conversation-source.md:L10758；规则：BR-F07-007。
- Given（前提）：存在异步未完成选择验证。
- When（操作）：打开仪表盘并延迟验证结果。
- Then（可观察结果）：加载配置→验证→更新选择→图表查询顺序成立；未完成不提前查询依赖条件图表；失败不清选择。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q125
来源：Q125 / DEC-125；conversation-source.md:L10908；规则：BR-F07-007。
- Given（前提）：两个必要验证一个成功一个超时。
- When（操作）：初始化、重试失败再成功。
- Then（可观察结果）：整个仪表盘图表数据查询阻断，不只单图；值保留并提示重试；全部必要验证成功后才查询。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q126
来源：Q126 / DEC-126；conversation-source.md:L11060；规则：BR-F07-007。
- Given（前提）：有已选字段A、未选B及动态日期C。
- When（操作）：初始化。
- Then（可观察结果）：仅A执行枚举存在性并校验适用自身/级联；B/C无额外枚举存在性请求，验证完查询。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q127
来源：Q127 / DEC-127；conversation-source.md:L11180；规则：BR-F07-008。
- Given（前提）：完整可访问集合搜索请求。
- When（操作）：计后端接收到生成响应。
- Then（可观察结果）：数据库/过滤/去重/处理/序列化均计入≤3秒；网络/前端不计，环境规模数据库待ISS-AC-03。
- Fixture：FX-ENUM；问题：ISS-AC-03。

## AC-F07-Q128
来源：Q128 / DEC-128；conversation-source.md:L11285；规则：BR-F07-008。
- Given（前提）：仪表盘已展示、用户交互搜索失败。
- When（操作）：主动搜索及手动重试。
- Then（可观察结果）：提示枚举值搜索失败，已选保留，不展示未经验证新结果；其他组件/已展示仪表盘不阻断，区别初始化失败。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q129
来源：Q129 / DEC-129；conversation-source.md:L11397；规则：BR-F07-009。
- Given（前提）：FX-TYPES文本/整数/高精度小数/日期/时间/布尔。
- When（操作）：各类型搜索、自定义输入和批量。
- Then（可观察结果）：按已有类型解析比较，不全部当文本模糊；错误类型拒绝，精度不丢；确切既有类型表待ISS-AC-07。
- Fixture：FX-ENUM, FX-TYPES；问题：ISS-AC-07。

## AC-F07-Q130
来源：Q130 / DEC-130；conversation-source.md:L11517；规则：BR-F07-009。
- Given（前提）：NULL、空串、空格和已有搜索字。
- When（操作）：查询/自定义输入空值及清空搜索框。
- Then（可观察结果）：空值沿现有Provider；清框只恢复初始列表，不等于搜索NULL，oracle待ISS-AC-07。
- Fixture：FX-ENUM；问题：ISS-AC-07。

## AC-F07-Q131
来源：Q131 / DEC-131；conversation-source.md:L11631；规则：BR-F07-010。
- Given（前提）：历史已选5001个合法值，新建选择4999个。
- When（操作）：升级加载、尝试新增、删除到4999再新增。
- Then（可观察结果）：历史5001不截断，新增拒绝；删后可加至5000；仍做有效性验证，未因数量自动迁移。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q132
来源：Q132 / DEC-132；conversation-source.md:L11741；规则：BR-F07-011。
- Given（前提）：三个入口：查询组件、图表过滤器、条件样式。
- When（操作）：分别搜索/自定义/批量/去重/超限。
- Then（可观察结果）：每入口独立核验公共行为；F04级联仅适用查询组件，不扩展数据集过滤；其他公共组件调用不退化。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F07-Q133
来源：Q133 / DEC-133；conversation-source.md:L11854；规则：BR-F07-011。
- Given（前提）：A/B同时保存在三入口，B删除。
- When（操作）：运行查询组件、重开另两设计面板。
- Then（可观察结果）：查询组件验证成功清B；图表过滤器及样式保留B提示失效；数据源失败三者均不误删。
- Fixture：FX-ENUM；问题：无本题新增设计阻塞。

## AC-F08-Q134
来源：Q134 / DEC-134；conversation-source.md:L11986；规则：BR-F08-001。
- Given（前提）：FX-AGG的销售100/200/300、利润20/60/120。
- When（操作）：配置SUM利润/SUM销售。
- Then（可观察结果）：总计200/600=1/3，显示33.33%，不等于利润率SUM90%或AVG30%；原值参与运算。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q135
来源：Q135 / DEC-135；conversation-source.md:L12138；规则：BR-F08-001。
- Given（前提）：透视表只展示利润率、同数据集未展示销售和利润。
- When（操作）：引用未展示字段及跨集/无权限字段。
- Then（可观察结果）：同集授权字段可计算1/3；跨集不支持、无权拒绝；不要求引用其他自定义汇总表达式。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q136
来源：Q136 / DEC-136；conversation-source.md:L12269；规则：BR-F08-002。
- Given（前提）：FX-EXPR的具体表达式向量。
- When（操作）：分别计算算术/聚合/IF/CASE/COALESCE/ROUND/ABS及恶意SQL。
- Then（可观察结果）：合法按手算oracle返回，不支持函数/任意SQL拒绝且不能执行；解析需保持聚合分组语义。
- Fixture：FX-AGG, FX-EXPR；问题：无本题新增设计阻塞。

## AC-F08-Q137
来源：Q137 / DEC-137；conversation-source.md:L12425；规则：BR-F08-003。
- Given（前提）：FX-AGG按区域分组。
- When（操作）：小计AVG利润率、总计SUM利润/SUM销售。
- Then（可观察结果）：华东小计25%、华南40%、总计33.33%，独立配置不互相覆盖；底层不等权样本另外按Q138。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q138
来源：Q138 / DEC-138；conversation-source.md:L12582；规则：BR-F08-004。
- Given（前提）：FX-WEIGHT中A10条20%、B100条30%。
- When（操作）：计算AVG利润率。
- Then（可观察结果）：底层110记录平均(10×0.2+100×0.3)/110=0.290909…，显示29.09%，禁止两个展示产品值平均25%。
- Fixture：FX-AGG, FX-WEIGHT；问题：无本题新增设计阻塞。

## AC-F08-Q139
来源：Q139 / DEC-139；conversation-source.md:L12746；规则：BR-F08-004。
- Given（前提）：FX-AGG仅华东可见或查询华东。
- When（操作）：在数据集/仪表盘/图表过滤与行列权限逐层缩窄。
- Then（可观察结果）：仅有效底层行销售300利润80，结果26.67%；无权列不能计算，不能全国600/200替代。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q140
来源：Q140 / DEC-140；conversation-source.md:L12886；规则：BR-F08-005。
- Given（前提）：正常组、销售0组和最终NULL组。
- When（操作）：计算比值以及显式CASE/COALESCE。
- Then（可观察结果）：正常26.67%；零除/NULL对应单元格空而不是0，其他单元格正常；显式CASE零除→0按表达式，NULL聚合沿Provider。
- Fixture：FX-AGG, FX-NULL；问题：ISS-AC-10。

## AC-F08-Q141
来源：Q141 / DEC-141；conversation-source.md:L13032；规则：BR-F08-006。
- Given（前提）：语法错、失效字段、类型错、不支持函数、无权字段、非法聚合嵌套。
- When（操作）：边编辑边保存及保存后撤权运行。
- Then（可观察结果）：编辑提示可修正，保存拒绝；运行重验权限字段；合法除零不等于配置错误。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q142
来源：Q142 / DEC-142；conversation-source.md:L13165；规则：BR-F08-006。
- Given（前提）：表达式字段删除/类型错/只改名同ID/换ID。
- When（操作）：查看和编辑再修复。
- Then（可观察结果）：前两保留表达式标失效、受影响单元格不可用，其他指标正常；同ID兼容改名继续，换ID不自动匹配；不回默认SUM/AVG。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q143
来源：Q143 / DEC-143；conversation-source.md:L13291；规则：BR-F08-007。
- Given（前提）：透视表已有明细排序过滤。
- When（操作）：只配置自定义汇总。
- Then（可观察结果）：明细查询/排序/过滤语义不变，不新增按自定义结果排序过滤入口。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q144
来源：Q144 / DEC-144；conversation-source.md:L13415；规则：BR-F08-003。
- Given（前提）：销售、利润率、订单数三个指标。
- When（操作）：仅改利润率的小计/总计配置后保存重开。
- Then（可观察结果）：两个表达式各自保留，其他指标配置/结果不变；未配订单数沿默认，配置沿原保存。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q145
来源：Q145 / DEC-145；conversation-source.md:L13543；规则：BR-F08-003。
- Given（前提）：FX-HIER浙江80/300、江苏120/400。
- When（操作）：同一小计表达式应用浙江/江苏/华东。
- Then（可观察结果）：结果26.67%/30%/28.57%，各基于分组底层，非两省均值28.335%；不为每层新配一套。
- Fixture：FX-AGG, FX-HIER；问题：无本题新增设计阻塞。

## AC-F08-Q146
来源：Q146 / DEC-146；conversation-source.md:L13691；规则：BR-F08-007。
- Given（前提）：透视表右侧汇总列及底部汇总行。
- When（操作）：启用F08并对照截图/数据位置。
- Then（可观察结果）：仅每个数据行右侧汇总列扩展自定义行汇总；底部列汇总沿现有，不按名称猜方向。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q147
来源：Q147 / DEC-147；conversation-source.md:L13807；规则：BR-F08-008。
- Given（前提）：当前查询权限下表达式E0，连续改E1/E2。
- When（操作）：自动预览且E1晚于E2返回，再确定或取消。
- Then（可观察结果）：合法自动算无须按钮，只有最新E2更新；非法不算；确定进编辑态，取消回E0，保存才持久化，不能用无过滤全量预览。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q148
来源：Q148 / DEC-148；conversation-source.md:L13922；规则：BR-F08-008。
- Given（前提）：E0成功后E1计算请求失败。
- When（操作）：继续编辑、重试/取消。
- Then（可观察结果）：保留E0并明确上一次成功预览，显示失败提示、E1不丢；取消回进入配置，旧结果不是E1正确证据；单格零除非整请求失败。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q149
来源：Q149 / DEC-149；conversation-source.md:L14040；规则：BR-F08-009。
- Given（前提）：有效汇总请求。
- When（操作）：计后端收到到完成响应序列化。
- Then（可观察结果）：数据库/聚合/表达式/序列化≤3秒，网络与渲染不计；环境规模复杂度未定见ISS-AC-03，3秒非强制超时。
- Fixture：FX-AGG；问题：ISS-AC-03。

## AC-F08-Q150
来源：Q150 / DEC-150；conversation-source.md:L14159；规则：BR-F08-009。
- Given（前提）：请求耗时超过3秒且仍在运行。
- When（操作）：继续编辑新表达式或关闭面板。
- Then（可观察结果）：继续加载不因3秒强杀；新表达式可提交且仅最新结果有效，关闭后晚响应不更新已关闭UI；性能仍不达标。
- Fixture：FX-AGG；问题：ISS-AC-10。

## AC-F08-Q151
来源：Q151 / DEC-151；conversation-source.md:L14277；规则：BR-F08-010。
- Given（前提）：利润率总计表达式改变而其他上下文不变。
- When（操作）：记录重算范围。
- Then（可观察结果）：仅该指标总计重算/更新；不重新查询整表明细或其他指标，允许必要底层查询；底层正确性不能由展示值二次聚合替代。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q152
来源：Q152 / DEC-152；conversation-source.md:L14423；规则：BR-F08-010。
- Given（前提）：E1→E2→E1，底层记录在期间改变。
- When（操作）：每次有效修改计算。
- Then（可观察结果）：每次重新读必要底层/聚合并按当前权限计算，不复用历史结果或上次聚合缓存，不新增F08专用缓存；仍仅受影响汇总。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q153
来源：Q153 / DEC-153；conversation-source.md:L14559；规则：BR-F03-014、BR-F08-011。
- Given（前提）：FX-EXPORT-AGG销售800利润155。
- When（操作）：以三格式导出自定义利润率。
- Then（可观察结果）：底层155/800=0.19375，显示19.38%；XLSX可计算数值，CSV展示19.38%，图片一致；不能回SUM/AVG，异步按执行数据不要求点击快照。
- Fixture：FX-AGG, FX-EXPORT-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q154
来源：Q154 / DEC-154；conversation-source.md:L14706；规则：BR-F08-011。
- Given（前提）：历史透视表无自定义表达式。
- When（操作）：升级前后同数据对比，再主动配置。
- Then（可观察结果）：原SUM/AVG/COUNT行为和结果不变，新增配置空，无需重建/自动转换/迁移，主动配后才启用。
- Fixture：FX-AGG；问题：无本题新增设计阻塞。

## AC-F08-Q155
来源：Q155 / DEC-155；conversation-source.md:L14814；规则：BR-F08-012。
- Given（前提）：长表达式、多层合法函数和资源保护条件。
- When（操作）：合法编辑保存及资源保护触发。
- Then（可观察结果）：不新增固定字符/嵌套/字段数业务上限；仍语法类型权限校验和资源保护，资源参数待ISS-AC-10；不声称任意复杂式≤3秒。
- Fixture：FX-AGG；问题：ISS-AC-03, ISS-AC-10。

## AC-F08-Q156
来源：Q156 / DEC-156；conversation-source.md:L14955；规则：BR-F08-012。
- Given（前提）：语法错/字段缺失/类型错/未知函数/无权/超时/数据源错。
- When（操作）：查看结构化错误信息。
- Then（可观察结果）：给出类别及尽可能位置、字段/函数，权限错误不泄露受限内容；无SQL原文/连接/栈/凭据，不新增单步调试；数值异常按空值。
- Fixture：FX-AGG；问题：ISS-AC-10。

# 原文保留条款补充

以下不是由156题推测新增需求；来源为RequirementCoverageMatrix中的原文行号。CoverageIssues中的建议/选填与未裁事项保持其原身份，不自动加入已确认产品范围。

## AC-F01-ORIG-01
来源：原始需求 L199,L234,L235。
- Given：同一D1报告，U_editor与只读U_view均能打开报告。
- When：分别查看过滤配置、复制、粘贴及绕过UI调用修改入口。
- Then：U_editor按既有编辑权可操作；U_view不可查看过滤条件、复制或粘贴，目标不变；不能只隐藏按钮当鉴权通过。
- Fixture：FX-COPY；问题：无新增设计阻塞。

## AC-F02-ORIG-01
来源：原始需求 L289,L291。
- Given：2列窄表总宽小于屏幕，另有误触进入全屏场景。
- When：进入全屏并用返回入口离开。
- Then：窄表保持正常宽度居中；返回路径清晰快速可达并回原报告，双击只是示例，不强加新手势；具体复用入口待S01。
- Fixture：FX-MOBILE；问题：COV-E01。

## AC-F03-ORIG-01
来源：原始需求 L328,L329,L332,L333,L344,L370。
- Given：查看态表格有数据和成功空集两个变体。
- When：定位表格，经下载/更多菜单选择格式。
- Then：有数据可选已决定XLSX/CSV/图片并有进度/任务反馈；空表下载按钮置灰提示暂无数据，不把空集当导出成功；异步不要求浏览器一直开启。
- Fixture：FX-EXPORT；问题：无新增设计阻塞。

## AC-F03-ORIG-02
来源：原始需求 L350。
- Given：文件大小跨50MB而未超100MB。
- When：生成并提示文件大小。
- Then：超过50MB提示文件较大预计需要较长时间；这不是拒绝阈值，也不自动增加二次确认；精确字节口径待定。
- Fixture：FX-EXPORT；问题：COV-E02, ISS-AC-02。

## AC-F04-ORIG-01
来源：原始需求 L395,L396,L397,L399,L400,L401,L402,L432,L433。
- Given：编辑者有至少一个查询字段，另有只读查看者。
- When：编辑模式选查询组件→修改→查询条件设置→选项值数量自定义→齿轮。
- Then：可进入对应字段过滤配置；只读者不能改，配置保存与预览遵Q064；无字段前提不伪造可配置结果。
- Fixture：FX-CASCADE；问题：无新增设计阻塞。

## AC-F05-ORIG-01
来源：原始需求 L463,L464,L465,L467,L468,L469,L470,L503,L504。
- Given：已配置行维度/列维度/指标的透视表及编辑/查看两身份。
- When：高级设置→条件样式→透视表条件格式展示→添加规则。
- Then：编辑者可配置新规则并按Q087预览，查看者只能看效果不能修改；字段实际支持范围仍按Q071。
- Fixture：FX-STYLE；问题：无新增设计阻塞。

## AC-F05-ORIG-02
来源：原始需求 L474,L492,L518。
- Given：非空值A/B/C、金额99/100/101和NULL。
- When：针对现有支持的等于/不等于/属于/不属于及数值条件分别应用样式。
- Then：eq A仅A；ne A为B/C；属于{A,B}为A/B；不属于{A,B}为C；>100为101，<100为99；NULL依赖字段不应用样式；精确支持矩阵/空串空格及原文字段名非API定稿，待S01保留Q071边界。
- Fixture：FX-STYLE；问题：COV-E03, ISS-AC-08。

## AC-F06-ORIG-01
来源：原始需求 L537,L538。
- Given：编辑模式数据源已配置字段已加载；只读对照。
- When：从字段列表选择并拖放。
- Then：编辑者具备有效操作前提；无编辑权不能通过配置入口变更，批量不得绕过已有编辑鉴权；未加载不能伪成功。
- Fixture：FX-DRAG；问题：无新增设计阻塞。

## AC-F08-ORIG-01
来源：原始需求 L583,L584,L585,L587,L589,L628,L629,L641。
- Given：已配置三轴透视表，U_editor与U_view。
- When：打开行汇总选项切自定义并编辑式子。
- Then：保留无/求和/平均/最大/最小/计数并可选自定义；编辑者看到实时语法状态；查看者只看结果不能改公式；右侧汇总范围依Q146。
- Fixture：FX-AGG；问题：无新增设计阻塞。

## AC-GLOBAL-ORIG-01
来源：原始需求 L170。
- Given：原文声称搭建效率约30%但无任务样本/基线/测量口径。
- When：审查收益验证声明。
- Then：不得由功能存在或fixture通过推断效率提升30%；保留原始目标及缺少基线的设计阻塞，后续若量化验收须明确对照任务、人群、计时及统计方法。
- Fixture：FX-SCOPE；问题：ISS-AC-11。

## AC-F01-ORIG-02
来源：原始需求 L244。
- Given：原文仅提出复制节点/组件后更新类型的现状方式。
- When：核对后续兼容性证据。
- Then：保留为历史方案线索，不据此替代F01专门过滤复制；S01检查原组件复制/改类型流程仍可用，当前不把该句升格新操作入口。
- Fixture：FX-COPY；问题：ISS-AC-12。

## 原确认补充限制

Q020允许无法复用已加载数据时按原参数重查，底层数据变化可使记录不同；不要求新缓存或严格快照。AcceptanceIssues中技术待证不是新业务冲突，不要求用户重答已决定的156题。COV-D09选填国际化/埋点及条件合规只登记适用性，不变成S00新增强制裁定。Q146的二维布局映射如仍缺当前UI结构证据，后续固定实际位置，不得把底部汇总行算作通过。
