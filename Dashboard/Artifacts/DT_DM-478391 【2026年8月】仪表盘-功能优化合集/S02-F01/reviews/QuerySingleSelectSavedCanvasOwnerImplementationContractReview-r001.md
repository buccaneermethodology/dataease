# Saved Canvas Owner 实现合同 r001 独立审查

Design verdict：继承 r004 `PASS_WITH_BOUNDS`，本轮未发现需要推翻其有界设计结论的新问题。

Implementation Contract verdict：`NEEDS_REVISION`；当前合同尚不足以唯一执行RED/GREEN与全部oracle。没有源码/测试写入准入，更无产品接线准入。

## 入口证据

读取 `/tmp/s02-saved-owner-contract-review-r001.rendered.md`。Card canonical SHA256 `93badba36ae3ffe4f7d039bf6b6505b2a5e2ce16bbcc0f2a80cfe222c4ccb33a`复验通过；card validate/render、Context validate均exit0。Context raw SHA256 `0b11afa3bca81b3d3d42e38bf2165f294e120198fc30969920932eaa283808a2`匹配绑定；11项required-read摘要入口/收尾一致。

检查合同、承接r004设计/40例独立审查，并扩读指定创建型回归文件。source、runner、fixture、creation_regression四个exact target已明确。回归文件实际存在；仅只读检查，没有执行测试、构建或源码修改。

## 编号发现

### SCIC-01 / 高：40例的非直接API字段尚无逐项可观察映射

合同写“exact API shape”“as declared”，但没有给出fixture expected字段到API返回/runner回执的映射。40例包含owner/saved_owner、epoch/new_ephemeral、epoch_count/factory_epoch_count、registrations、generation、second_error、source_context_preserved、reopen_allowed、source_read、paste_commit、real_auth_event、existing_create_owner_behavior等。它们并非都存在于接口返回中，部分只是边界声明。尤其begin只返回owner handle，不能直接断言其私有generation/registration；需要调用validate，调用时点又会触发失效。runner若按常量填这些值可造成自证通过。

最小修订：列出逐字段/逐特殊case的来源，区分API行为断言、runner持有成功回执计数、引用===断言以及静态排除项检查；定义何时调用validate、保存first/second/last token和旧owner，以及不得为观察私有状态扩展生产接口。039必须比较真实token对象===；040应deepEqual精确结果。source_read/paste_commit=false应由依赖/调用排除证据支持，不能以fixture自身false作为证明。创建回归状态字符串也不得直接记成测试结果。

### SCIC-02 / 高：source absent 的可信RED入口与回归执行身份没有冻结

合同要求源码不存在时runner setup成功、所有冻结case行为断言得到UNIMPLEMENTED；但没有规定缺源码时的detached stub接口、加载分支、异常处理和per-case隔离。直接import不存在的source只会preflight失败；只给begin返回UNIMPLEMENTED，后续register/validate可能抛TypeError或因owner缺失跳过。需防止把这些工具/控制流失败算作40例行为RED，也不能让GREEN仍落入stub分支。

指定创建回归文件内实际存在 `M0_FORCE_UNIMPLEMENTED` 和 `QSSDH_LIFECYCLE_FORCE_UNIMPLEMENTED` 环境开关，并通过esbuild内存打包加载真实实现。合同“normal implementation path”方向正确但尚无精确命令、运行时、cwd、依赖前置检查及清除开关要求；也未冻结回归文件/其依赖fixtures摘要。无法从当前合同唯一复现所谓creation regression passes。

最小修订：定义同一runner的source-absent适配模式和完整最小stub、逐case预期失败记录与总体非零退出，明确setup错误单独归类；GREEN强制真实源码加载且拒绝stub。冻结可用运行时/命令/cwd以及回归开关清除、依赖读取清单与摘要记录。runner/fixture/case顺序在RED后冻结，GREEN不得变更。无需现在运行或安装依赖，可先把执行合同补齐。

## 已成立内容与边界

精确source/runner路径不触及既有创建型实现；r004 fixture保持不可改；禁止Pinia/Store/Vue adapter、来源读取、copy/paste/commit、snapshot/preview/query/save及权限替代均明确。真实引用getter、raw数组成员、component+innerType、同目标同token复用的设计不需要重新打开。

Context当前直接读集没有r004设计/fixtures/已通过的r004报告，仅合同字符串引用它们；本轮已有连续审查证据可复核，但新的implementation admission应绑定这些实际摘要及当前通过报告，不能只绑定旧r003审查或文件名。此为执行前绑定要求，不是新增产品范围。

修订SCIC-01/02后再独立复核实施合同，然后另发精确builder admission。这里不要求真实权限先行才能准备纯helper，但任何产品接线仍需要真实producer与权限契约。

完整Goal分母10/26/16、Scope Delta none、S01独立保持；真实权限 `BLOCKED / NOT_RUN`，QPC产品UI/Store `NOT_READY_FOR_PRODUCT_UI_STORE`。本报告不表示40例已运行、创建型回归已通过、helper已实现或任何Goal AC验收。仅写本报告，不改合同、候选、源码、测试或其它文件。
