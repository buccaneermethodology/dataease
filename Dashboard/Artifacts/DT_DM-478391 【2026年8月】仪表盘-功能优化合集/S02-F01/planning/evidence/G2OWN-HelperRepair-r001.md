# G2 helper 同 key 重入替换修复报告 r001

## 交付与结论上限

针对独立实现 Validation 第1/3轮 G2OWN-HV-001，已修正同 key nested replace 覆盖遗失已登记 cleanup 的问题，形成源码窄修及实际生产补充回归候选。独立第2/3轮 delta Validation 尚待执行；不自行关闭该 finding 的独立验收状态。

此修改只处理 helper 已登记的同步 cleanup；没有修改组件、浏览器、冻结 23-case runner、Design/Cases/Goal 或历史 RED/GREEN。G2OWN-027 继续 OPEN，真实权限继续 BLOCKED / NOT_RUN，原 10/26/16 验收分母无删减。本报告不证明组件/浏览器、MVP 或 Goal 完成。

## 准入、保全与原因

Builder 为 `/root/g2_ownership_red`，不替代独立 Validator。接收端复验 Card canonical SHA `1a29d4099f47b0d4ad634aac9565156bb8d4b837ac90d8f44fc18121c6f9d91d`、Context 通过，消费 source / supplemental test / evidence 三份精确 admission 后开始写入。

源码改写之前先将旧 source 原字节保存为 `G2OWN-HelperRepair-r001.before.ts.txt`，SHA `d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`。先新增并冻结独立 `reentrant-replace-check.mjs`，真实 esbuild bundle/import 旧生产 helper 得到断言级 RED，然后才修改 source。新回归 runner 从 RED 到 GREEN 保持 SHA `50f3c4788e10de38dde0af1896e8f1f250f2a500901e89e56246b9e98c74b999` 与 fixture identity `7e4dba72e57bb8d8b65cbd90df2224b52b6cf70ead227479a21b0b192ebbb8c0` 不变；没有改 expected 让结果变绿。

原问题：外层 replace 删除旧登记，调用 old；old 同步重入登记 inner 后，外层直接 set outer，inner 丢失。当前替换流程在每次调用 cleanup 前先移除该登记，再读取同 key 的当前登记并继续清理；直到该 key 没有遗留登记才安装 outer。期间错误按执行顺序累积，沿既有返回/通知通道输出；若 cleanup 已关闭 scope，outer 按原规则立即释放，不重新登记。其它 key 的登记顺序不变，destroy 和重复 dispose 逻辑没有修改。

## 原始 RED 与 GREEN

| 调用 | 执行 / 通过 / 断言失败 / 执行错误 | exit / stderr |
| --- | --- | --- |
| 旧生产 source + 新补充回归 RED | 10 / 2 / 8 / 0 | 1（预期断言级非零）/ 0字节 |
| 修复 source + 同补充回归 GREEN | 10 / 10 / 0 / 0 | 0 / 0字节 |
| 原冻结 23-helper GREEN | 23 / 23 / 0 / 0 | 0 / 0字节 |
| oracle 自检 | 17负例拒绝、15正向控制与双stub控制通过 | 0 / 0字节 |

补充 RED：`2026-10-27T01:00:38.598227+00:00` 至 `2026-10-27T01:00:38.630799+00:00`（UTC）。补充 GREEN：`2026-10-27T01:02:28.731039+00:00` 至 `2026-10-27T01:02:28.766066+00:00`（UTC）。两次同一命令为 `node tests/g2-render-ownership/reentrant-replace-check.mjs`，工作目录 core/core-frontend。所有场景均执行，不首错返回；缺模块/编译/import/未知异常单列为 execution error，没有用它们冒充 RED。

原始三件证据分别保存为 `G2OWN-HELPER-REPAIR-r001-RED.*.txt` 与 `G2OWN-HELPER-REPAIR-r001-GREEN.*.txt`。原23GREEN和oracle等原始 stdout/stderr/exitcode、命令、时点与摘要完整保存在 identity 的 verification_runs，不覆盖历史原始证据。

## 完整补充场景与同根残余

| 身份 | 覆盖 | RED → GREEN |
| --- | --- | --- |
| HV001-001 | old 登记 inner；inner 必须清理一次，outer最终dispose一次，destroy一次 | fail → pass |
| HV001-002 | inner 清理抛原 Error；外层返回与唯一通知均保留引用，outer仍可登记释放 | fail → pass |
| HV001-003 | old→inner→deep 两层新增登记，old/inner/deep 均抛原对象；清理/错误顺序完整 | fail → pass |
| HV001-004 | inner 清理中dispose：sibling/destroy继续，outer关闭后立即清理 | fail → pass |
| HV001-005 | old内直接dispose的相邻控制 | pass → pass |
| HV001-006 | remove内登记inner的相邻控制 | pass → pass |
| HV001-007 | 同key清理不改变其它key逆序释放，outer/b/a/destroy | fail → pass |
| HV001-008 | inner+通知函数抛错：返回[inner,notify]，通知不递归、outer不丢失 | fail → pass |
| HV001-009 | 同函数作为新生命周期再次登记，两个登记分别各清一次 | fail → pass |
| HV001-010 | setup内nested replace，错误同时进入ready结果与operation返回，原引用不丢 | fail → pass |

该 supplemental runner 不替代或修改冻结 23 项；新增用例只是现有“已登记资源不得遗失”的生产回归。实现无 case ID/fixture/expected 硬编码。

## 定向检查与后续

定向 ESLint、严格单文件 TypeScript noEmit、新runner node语法检查全部 exit0；原23和补充10均实际 bundle/import 生产TS。跟踪差异空白检查exit0；未跟踪完整source/新runner的no-index --check均无空白错误输出（exit1为存在文件差异的预期状态）。未安装依赖、启动产品/数据库、提交或推送。

修复后 source SHA：`7ff0a6d2ad931260241a4fc78970a99dc14f78c25bf71234f272a6fc837a90a2`。组件及已冻结 browser/test 输入与修复前记录一致；完整 preserved_inputs 摘要、before备份、source统一差异与当前证据摘要记录于 `G2OWN-HelperRepair-r001.identity.json`。

当前已冻结 helper 与补充证据供独立第2/3轮 delta Validation。组件/浏览器候选此前依赖旧 d31e… helper，后续最终验证必须显式重绑定新 helper 摘要，不能把旧候选自动升级为当前通过。
