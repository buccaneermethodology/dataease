# 跨层关系与投影独立审阅 v1

- reviewed_at: 2026-10-14T02:55:00.963605+00:00
- snapshot_id: SP001-relations-v6
- as_of_state: integrated-v6 关系增量及 kb-v3.py 候选；非最终 Goal 收尾。
- reviewer: closure_review（独立 lane；未编写候选或 renderer）
- verdict: FAIL（本轮投影语义门槛未通过；不代表产品运行失败）。
- card_sha256: b15ff4ac5f400f125b4da9a2d6860885264360672072145046f7fc2a3187686e；工具复验通过。

## 范围与实际检查

读取原始用户意图 v1/v2、Goal、对象合同、AC合同、审阅卡及prompt、三份relations补丁、integrated-v5/v6全部关系和事实差异、kb-v3.py、工具测试报告，以及data/chart/access既有v2独立报告。复用既有报告仅作为事实基线，不把作者read_log当本人的亲读证据。

逐项比较62条关系增量的端点事实、类型和证据引用；实际计数：access新增16/替换3，chart新增19/替换1，data新增20/替换3，architecture新增0/替换0，合计55新增、7替换。四份facts数组完全相同。未发现以本次关系增量删除事实或能力分母。

实际源码重点重读分享proxyInfo/validatePwd/generateLinkToken、Ticket、访客权限、EmbeddedApi与前端握手/Store、ChartDataServer明细导出及ExportCenterManage两个addTask重载；数据与图表侧核对calcData模板/内置分支、Quota转换、DatasetGroupManage保存和预览、Provider选择、JDBC分支及缓存调用等源码切片。大型批量读取存在输出截断，故本报告不宣称62条全部完成逐行独立源码复核；以下阻断已由未截断源码及实际投影独立确认。后续修复轮需完成剩余逐条源码阅读，不得把本轮端点遍历冒作全量语义通过。

以 python3 -B 在内存加载renderer，两次projections返回逐字节相同；未写KB、未运行产品、构建或产品测试。现有13项工具报告只作作者机械证据，未冒作本轮独立执行。

## 阻断项

### B01：导出重载被合并为可误读的调用链

ACCESS-X012/013在JSON中分别支持不同重载，但renderer只显示以下链路：

`ACCESS-017 innerExportDetails → ACCESS-018 addTask → ACCESS-019 startDatasetTask`

源码 `ChartDataServer.java:379–380` 调用ChartExcelRequest重载；`ExportCenterManage.java:253–271`该重载调用startPanelViewTask/startDataVViewTask；`273–288`数据集重载才调用startDatasetTask。当前图没有重载或分支限定，给开发定位读者造成图表明细导出走数据集执行器的错误可达路径。补丁relations-access.json的limits已指出不能串接，但该执行面说明没有进入正式知识投影；图前现有通用声明仅说测试不表示运行、显式关系不推断缺失边，未说明CALLS不可组合。

修复要求：在canonical关系或节点中保留调用方法/重载限定并投影，或至少在正式图旁明确标识这两条边不能串接及其实际分支。无需修改产品实现。

### B02：密码校验与签发方法合并，图丢失关键语义

实际投影为 `proxyInfo → validatePwd/generateLinkToken → generate/verify/algorithm`（ACCESS-X009/010）。`XpackShareManage.java:359–360`仅授权通过后调用generateLinkToken；`392–415`validatePwd只校验返回布尔值；`417–421`generateLinkToken才调用LinkTokenUtil.generate。图的单一CALLS边和合并节点使两种方法可被误认为同一调用流程。canonical事实正文正确，但renderer未保留方法选择及授权通过条件；relations补丁limits同样未投影。

修复要求：明确边只指generateLinkToken→generate，保持validatePwd不签发Token，以及proxyInfo授权成功分支限定。优先修复关系表达，不能只靠执行面审阅解释。

## 非阻断与边界

API_EXPOSES_CAPABILITY端点正文仍明确接口声明，未发现借EmbeddedApi关系宣称企业实现已核实。七条TEST_ASSET_FOR均指测试资产事实与能力，正文保留未运行和覆盖边界；ACCESS-R040仅相邻静态资源安全资产，不能升级为导出端到端覆盖。CHART-X017目标DTO，应继续明示非持久化数据库对象。

CALLS其它条件分支也宜在图旁统一明确：图不是必经时序或可直接传递的控制流；模板/普通calcData、插件/内置Handler、跨源/JDBC均有条件。此建议服务当前任务的防误读门槛，不要求新增运行验证。

## 后续及声明上限

本轮FAIL只绑定上述候选摘要和已确认投影问题。Builder修复后需冻结新card并进行增量复验，同时补齐剩余逐条源码核对。AC01/02/08的全仓覆盖、最终Dashboard/KB/完整diff、post-closeout及Stop Gate不在本轮完成范围，仍由最终包审阅处理。当前不能声明Goal完成；本报告只写指定reviews文件，未修复任何候选、KB或产品。
