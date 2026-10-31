# QPP Preparation r005 独立增量审查

## 双结论

**Design Freeze Validity：NEEDS_REVISION；Implementation Entry Readiness：NOT_READY。** r004上游支持域问题已在基础输入中修复；尚有两项确定的fixture同步残留，当前31例不能由一个遵守合同的实现同时满足。

原QPPR4-01在基础输入支持域层面**CLOSED**：field.id/displayId/queryId均为province，defaultValue/defaultMapValue均A，运行selectValue/mapValue均B。QCARRIER固定检查displayId等于field.id不再拒绝；A/A同列枚举投影成立。本结论依据源码与完整值比较，不冒称已执行QPP实现。

## 绑定与检查

Card validate/render exit 0，canonical SHA `760a2daa20422a6d9bc1750ba7ca94d081bb5b5ee56eeb8f0dc8be19e169b8ba`；Context validate exit 0，raw SHA `f808fad84062ee8416c597ca865abdae97c947da4bc2f19dc18b02e5da9e86a1`；24项读集摘要一致。

| 审查对象 | raw SHA-256 |
| --- | --- |
| Design-r005 | bf8cfdff6fa807d9247b742604106efcd78f55ae1c39fb8373549fc516e8aaed |
| Fixtures-r005 | ba46537208afd9c512ca43dd982e587bac086d424e4a30e1444e2509ff157b67 |

31个case ID唯一；全部标准JSON Patch操作路径有效；基础/完整性请求中非故意错误的固定requestKey一致，重算指令可确定执行。QPP-021的add修复保持。QPP-001完整design/runtime根逐值比较符合当前A/A输入应生成的QTARGET结果及外层保留规则。base_revalidation_input的枚举证据等于基础输入。未运行helper、构建、产品或网络验证。

## Blocking findings

### QPPR5-01 / P1：四个成功oracle仍保留旧A-code，与当前基础输入及QPP-001矛盾

完整比较结果：

| case | design.defaultMapValue | runtime.defaultMapValue | runtime.mapValue |
| --- | --- | --- | --- |
| QPP-001 | [A] | [A] | [A] |
| QPP-007 | [A-code] | [A-code] | [A-code] |
| QPP-019 | [A-code] | [A-code] | [A-code] |
| QPP-023 | [A-code] | [A-code] | [A-code] |
| QPP-029 | [A-code] | [A-code] | [A-code] |

**证据与影响：** QPP-023与QPP-001 prepare输入相同，expected却不同。QPP-007只增加未引用合法目录项，不应改变QTARGET输出。QPP-019正常复验和QPP-029外部污染后复验应返回QPP-001内部冻结的干净A候选，而不是旧A-code。当前无法同时通过这些oracle；不能让Builder修改冻结用例或依case ID特判。

**最小修复：** 一次性从QPP-001完整成功candidate同步QPP-007/023的完整候选以及QPP-019/029的candidate；保留各自case identity和操作。对所有成功输出做递归全值相等检查，不只替换一处字段。

### QPPR5-02 / P1：QPP-031变成成功基例的恒等操作，却仍要求请求错配失败

**证据：** 基础requestInput.displayId已是province；QPP-031仍将它replace为province，随后按规则重算requestKey。对完整base_input应用全部操作并解析重算指令后，得到的对象与QPP-001输入逐值完全相同（静态比较True）。但QPP-031 expected为 `DEFAULT_ENUM/ENUM_REQUEST_MISMATCH`。

**影响：** 相同输入同时要求成功与失败，属于确定矛盾，不是缺少环境验证。

**最小修复：** 将QPP-031改成真实不同的displayId，例如province_name，并重算key，保持完整行及其他参数不变；继续期望ENUM_REQUEST_MISMATCH。或明确合并重复用例，但本次建议保留identity，做最小差异修复。

## 非阻断说明与回归边界

- Design称“直接沿用”QTARGET r008基例，实际上默认映射由A-code改A、运行映射由B-code改B；shape未变，变换合法，但应准确写为“同shape值变换”并记录这两个源字段及对应输出变化。该说明修正不要求修改QTARGET原fixture或算法。
- QPP-003/004/024/026保留B-code等人为错误配对可作为拒绝输入；不得把它们描述为当前同列请求的真实响应。其拒绝首错方向未与当前合同冲突。
- 原映射计划责任、DIRECTORY透传、TARGET先于QTARGET、PLAN先于DIRECTORY、current精确结构、句柄优先及独立深副本规则继续接受。枚举mode1不改运行模式、mode0不得声明complete、key自洽不替代请求匹配的边界保持。

## 一次性最小后续

下一版只同步四个成功expected、使031产生真实请求差异，并补准确的依赖值变换说明。冻结前检查：所有相同prepare输入具有相同业务结果；额外未引用目录不改候选；正常/污染后复验候选等于基础成功candidate；031完整输入与基础确实不相等；31个patch及requestKey仍可解析。再交独立delta复核，不扩展产品实现范围。

原10项Goal AC、26 must-have、16产品义务、S01独立状态保持；真实权限BLOCKED / NOT_RUN不变。用户迟到C仅核对一次、结束loading、仍缺保留无效选择的裁定保持。此审查不签发admission，不证明UI/Store、授权、快照、预览、保存或Goal完成。

只写本报告，未改候选、源码、测试、Goal或旧证据。
