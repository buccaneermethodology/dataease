# QPAD-REBUILD-001 修复执行证据 r001

## 处置

仅处理独立 Validation finding `F-QPAD-VAL-001`：严格 ISO UTC 字符串格式检查之前使用 `Date.parse`，导致 `2026-02-30T00:00:00.000Z` 这类不存在的日历日期被接受。现在除格式及可解析性外，还要求 `Date#toISOString()` 与输入逐字相等，拒绝日期规范化。

六个冻结 identity 未改。测试 runner 新增两个防御断言：拒绝 `2026-02-30T00:00:00.000Z`，并接受合法闰日 `2024-02-29T00:00:00.000Z`。

## 验证

- 最终 runner 同一摘要 `4c708185bb969e7998149c536474c1c96c5603e7aaca6c19a9b018fae3b499ae` 用于 RED 与 GREEN。
- RED：实现临时移出解析路径时运行既有可执行 `UNIMPLEMENTED` 分支，exit `1`，14/14 断言因无实现而失败；不是模块解析失败。实现通过 finally 恢复。
- GREEN：恢复实现后运行相同命令，exit `0`，6/6 冻结 identity 与 8/8 防御断言通过（14/14）。
- 定向 ESLint：实现和 runner 两个文件，exit `0`。
- fixture SHA256 保持 `0b0bc78a268f057356ae4354698949541a450f8ff18ec7b62614fe8474e5edbf`；最终实现 SHA256 为 `fb1da352181a36858fe1eeaaca80d2883063f7d8600dcafd5bc45bfd1bf91a7e`。

逐条 stdout、stderr 与 exit code 已分别保存在本目录 `QPAD-REBUILD-001-repair-{red,green,lint}.*.txt`。本记录只证明该日期 finding 的窄范围 Builder 修复；不代表独立 Delta Validation、产品入口或完整 Goal 已通过。真实权限验收仍未验证。
