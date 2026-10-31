# SP-001 架构与扩展导航独立语义复核 v1

- 审阅者：`/root/pre_review`；未编写 root 的 base 候选。
- 时间：2026-10-14T02:35:59.974025+00:00
- 卡摘要：39f55b925d2ef8a3c35ac3c494da9f4afe46dc69f0a232e48227151388a9acd3，接收端复验 pass。
- 受审 candidate 摘要：2a981b434bfa458b0a4a6ce2af0109d0a51894c3afcfbdf8fc737b3de99d5cdf；只新增本报告，不修改冻结候选。
- 实读分母：39/39 事实的全部指定切片，33 个唯一来源文件；首轮输出中间截断部分已另行重读 BASE-020–028。不是33个全文件通读。39项来源摘要全部匹配。
- 能力分母：本候选10项非核心能力，逐项至少一个源码切片，详见下表。额外读取 PluginComponent 的 noLic 定义、RecentResourceApi/CoreOptRecentManage，并定位 SysParameterServer 方法，确认遗漏可补。

## 总体结论

**PARTIAL／需要修正后复验。** 多数原子断言与代码相符，配置、规范及未运行测试的表述有适当边界；但存在一处事实引文不完整、一处测试关系误分类及两项明确的原分母遗漏。可以保留已证实事实，不能将当前包整批视为独立语义通过或以10个能力ID出现代替覆盖。

本轮不评价产品运行正确性、不审专有实现、不执行构建/产品测试；校验摘要不代替以下语义判断。

## 必修发现

### B01：BASE-027 的引文缺少前半断言

P1（正式事实证据修复）；源码 PluginComponent.vue 的 dev 分支和 xpackModelApi 读取在115–126行，当前 evidence 从127行开始，不能支持“dev模式设置distributed=false；其他模式读取xpackModel”。127–158支持后半 mapping/加载分支。实际行为是非dev先检查缓存，仅缓存为空时请求 xpackModel，已有缓存时复用，不是每次都读取API。

修复：明确“非dev按缓存状态读取/复用模式值”，引用115–158。BASE-028 的队列、watch和失败分支正确；如保留“显示noLic”断言，额外引用22–25的showNolic实现，避免只凭调用名推断UI。此项只需修知识与引用，不需改产品。

### B02：F21、F22 缩小了原分母

P1（覆盖阻断）。原能力分母 F21 是“消息中心与最近操作”，当前仅 BASE-035 count 替换挂点；limits 写待补不等于履行导航义务。源码 CoreOptRecentManage.recordSpreadsheet/saveOpt 已可访问，存在用户维度更新或插入最近记录路径，不能归入XPack不可见。

原 F22 为“系统参数与菜单装配”，当前只含菜单/动态路由，未保留系统参数在能力名或缺口记录。SysParameterServer 在 /sysParameter 实现 singleVal、queryBasicSetting、saveBasicSetting、defaultSettings、SQLBot配置等方法，主仓库可读。BASE-030 的SQLBot客户端请求不能替代系统参数能力导航。

修复：保留原能力名称与范围；分别补最近操作、系统参数的入口→契约→实现可见性→依赖的最小导航事实及关系。未补前 coverage 标 partial，不得以ID存在判完成。这些是非核心必需导航遗漏，不要求扩成完整运行验证。

### B03：测试资产被标为能力实现

P1（关系真源错误）。BASE-037明确只是 tests/static-resource-security/Regression.java 测试资产，F20却将其放入 contract.implementation，并由 BASE-R-F20-2 的 CAPABILITY_REALIZED_BY 指向它。测试源码不是静态资源产品能力的实现。

修复：将 BASE-037 移至 F20.tests；用 TEST_ASSET_FOR 或实现→测试资产关系表达，并保留未运行说明。不要借 schema 允许 facts 端点来认定关系语义正确。

### B04：域标签不能替代域内容

P1（全包完成前对账，不阻断保留已有正确事实）。本候选列K00/K01/K02/K05/K06/K08/K09/K10，但K01缺产品定位、角色/场景、术语等事实；K10无明确 CHANGE_IMPACTS/MODULE_DEPENDS_ON 等扩展影响知识关系，现有21条关系全部是能力→事实。工具具备impact不等于canonical含完整影响知识。K00仅许可证规范，正式对象provenance/维护规则应由最终整合补齐。

修复：在全包coverage中定位承担这些义务的其他已审交付；若没有，补源码支持的最小事实及关系。不能仅在domains列出K编号后判该域通过。此项不要求该单一base文件承担所有域，也不要求详细历史演进超出首版范围。

## 逐能力源码复核

|能力|实际阅读的关键事实/源码切片|结论及界限|
|---|---|---|
|F11 电子表格|BASE-019 SpreadsheetApi:23–91；BASE-020菜单页:49–78|公共方法、DePermit和导入均存在；导航通过，不证明保存计算或授权运行。|
|F12 填报|BASE-021 DataFillingApi:28–130；BASE-022管理页:30–62|资源、行操作、任务与manage注解可见；导航通过，不证明专有执行。|
|F13 同步|BASE-023 TaskApi:26–81；BASE-024 syncTask.ts:216–254|执行/启动/停止/修改端点对应；导航通过，未证实引擎支持矩阵。|
|F14 报表|BASE-025 ReportApi:29–86；BASE-026页面:1–38|SDK契约和实例切换准确；导航通过，不证明调度发送。|
|F16 插件|BASE-027–029，PluginComponent:38–176、补读22–25；plugin.ts:1–6|分支、队列和失败处理基本准确；B01修引用/缓存措辞后通过。|
|F17 SQLBot|BASE-030–031，index.vue:25–109|disabled/invalid仅console.error，仍继续加载；脚本与interval符合断言；导航通过。|
|F19 字体|BASE-032 FontServer:18–77|FontManage/FontSettingsManage委派准确；导航通过，不推断内容安全和授权。|
|F20 静态资源|BASE-033–034 StaticResourceServer:25–57、71–96；BASE-037测试:1–25|两个写入口断言成立；B03关系错误。原分母名为静态资源访问，当前仅上传/模板写入，最终覆盖需指向访问映射/拦截器等导航或保持该子面未覆盖，不能重命名掩盖。|
|F21 消息与最近操作|BASE-035 MsgCenterServer:8–16；额外CoreOptRecentManage:1–75|默认0替换挂点事实成立；最近操作遗漏，partial。|
|F22 系统参数与菜单|BASE-016 MenuServer:15–26；BASE-017建立路由:1–62；BASE-018 Store:47–71；额外定位SysParameterServer|菜单事实成立；系统参数遗漏，partial。|

F20 访问面属于原分母的导航对账义务；不要求本次做全站安全审计。其已读写入事实应保留，补充访问入口而非撤销正确知识。

## 逐域检查

|域|已证实支撑|尚不能声称|
|---|---|---|
|K00|BASE-015 LICENSE:1–14为规范，确为附加条件GPLv3描述|许可证事实不能替代KB来源治理/维护合同；候选尚无最终metadata。|
|K01|10项能力名称与入口形成局部功能导航|产品定位、角色/术语/端到端产品地图未在本候选提供。|
|K02|BASE-001–005聚合模块与启动注解；BASE-016–018菜单装配|配置聚合不等同完整运行架构；SDK职责描述是有限模块定位。|
|K05|BASE-019/021/023/025/029接口及客户端；BASE-027–028桥接|接口存在不等于专有实现、许可可用或调用全链成功。|
|K06|BASE-006/007多页面与lib；BASE-017/018路由；各页面导入/切换|imports只证明依赖入口，不证明交互完整或全部动态路由已分配。|
|K08|BASE-004/008–014构建端口、Profile、镜像配置；BASE-039工作流|声明版本不等于安装版本；workflow dev-v2默认不改变dev-v3协作目标；未运行构建。|
|K09|BASE-013 Surefire skip；BASE-036–038测试源码及断言|不复用历史PASS，不声称本轮测试运行或全量覆盖。|
|K10|BASE-003扩展模块、BASE-027–029加载桥为扩展点线索|缺明确的跨域依赖/变更影响知识关系；需最终包补齐。|

BASE-005 将 EhCacheStartListener 作为 initializer 添加，断言“启动前添加”可接受；不要将其误述成已验证缓存初始化成功。BASE-015 是唯一normative；BASE-001–004、006–014、039保留configured，未与运行成功混同。BASE-036–038明确测试资产未运行，原子断言可保留，仅B03关系需改。

## 复验入口和声明上限

请以新版本修 B01/B03，追加B02及F20访问面最小导航，并在跨包coverage对齐K域缺项；保留冻结v1及本报告。下轮只需读取实际变更及其必要来源，范围/authority/分母变化则重新基线审查。本报告没有批准范围删减，也没有将待补项当已完成。
