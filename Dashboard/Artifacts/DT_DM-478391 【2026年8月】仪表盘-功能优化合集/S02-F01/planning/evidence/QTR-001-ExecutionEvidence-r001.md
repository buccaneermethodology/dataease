# QTR-001 执行证据 r001

## 范围与绑定

本轮仅实现独立离线纯函数 `rebindQueryTreeRelations`，将树筛选每层已选组件引用重绑到唯一目标组件。未接产品入口，也未修改冻结 Design/Fixtures。

- Final Goal：`f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- 冻结设计：`1b41b4e4902bc51d120be54794514a03fade61f4157b56fa2713d641f2823b64`
- 冻结8项 fixtures：`d6543b526c522497e0d738f8f2d1481e49676577b22d65d970debffedd8f93b0`
- 独立设计复核：`deec148467799296d4be4589ee0f95c014fd531bfc47603ab1678aed5f27877a`
- Builder card canonical digest：`c2e44f14e2b47b77df0ca44dd38bca23dd494deca33ec88771682266900c7909`
- Admission：`execution-admission-query-tree-relation-rebinding-builder-r001.json`；精确绑定 action=`builder` 与目标实现路径，通过入口验证。

## 验证结果

| 检查 | 结果 | 证据 |
|---|---|---|
| Trusted RED | 退出码1；源码移出时 runner 无模块解析失败，8个冻结 identity 均因 `IMPLEMENTATION_UNAVAILABLE` 断言失败，3项防御检查也按预期失败 | 本目录 `QTR-001-red.stdout.txt`、`QTR-001-red.stderr.txt`、`QTR-001-red.exitcode.txt` |
| 同identity GREEN及复核修正 | 8/8冻结 identity 精确通过；输入不变、无partial failure、成功结果嵌套对象不复用；现有runner另验证5层、忽略未选择映射键、首错优先级，以及`__proto__`键安全、共享层引用按位置校验、6层拒绝、重复字段ID拒绝，共7项防御检查 | 本目录 `QTR-001-green.stdout.txt`、`QTR-001-green.exitcode.txt`；修复前独立报告记录了原候选发现 |
| 定向 ESLint | 实现与 runner 通过，退出码0 | 本目录 `QTR-001-lint.stdout.txt`、`QTR-001-lint.exitcode.txt` |

实现按层保持顺序和字段 ID，只消费当前 `checkedFields` 对应映射；同一目标组件按首次出现去重；错误按输入结构、ID、字段匹配、缺失映射、歧义映射优先级拒绝。全部输入和输出均为纯对象数据，不触及 Store、UI、网络或权限。

修复前独立Validation发现：`__proto__`等合法对象键需作为自有属性安全写入；层验证必须按数组位置取对应tree field ID，不能以对象identity反查位置。现实现已使用安全属性定义、位置索引，并由runner覆盖上述问题及6层/重复tree field ID边界；修复后独立Validation待完成。

## 声明上限

本候选只验证冻结树关系纯变换，不证明真实目录、目标资源授权、树数据查询/SQL、完整 query payload、产品入口、保存撤销或完整 Goal。只读用户禁止查看/复制/粘贴、权限撤销和恢复继续 `BLOCKED / NOT_RUN`；standalone/admin/mock 未作为权限替代。10项 Goal AC 和16项产品义务分母不变。
