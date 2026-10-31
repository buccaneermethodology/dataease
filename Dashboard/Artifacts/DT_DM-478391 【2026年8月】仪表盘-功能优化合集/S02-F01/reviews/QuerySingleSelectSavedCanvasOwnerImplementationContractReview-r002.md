# Saved Canvas Owner 实现合同 r002 独立复核

Design verdict：保持 r004 `PASS_WITH_BOUNDS`。

Implementation Contract verdict：`NEEDS_REVISION`。本报告不签发source/test write admission或产品接线许可。

## 入口及已关闭部分

已读取rendered prompt。Card canonical SHA256 `ef19aa6517250ed82fd074087cdfee3ee2bc4a814a4d1e6443ebeab998cca39b`复验通过；card validate/render及Context validate均exit0。Context摘要匹配card，全部required-read摘要入口和收尾无漂移。

SCIC-01部分关闭：真实token捕获与===、epoch由成功begin回执计数、reason/error分离、静态source_read/paste_commit排除不冒充运行权限、创建回归不取fixture常量等均已明确。

SCIC-02部分关闭：Node版本、cwd、具体创建回归命令、两个强制未实现变量清除、四项回归依赖摘要已给出且当前全部匹配。setup error与behavior mismatch分类、runner/fixture/contract保持同身份以及GREEN拒绝fallback方向正确。未执行测试或环境安装。

## 最小剩余 findings

### SCIC-03 / 高：统一追加validate会覆盖触发失效的首错，无法满足已冻结oracle

oracle_mapping.owner_state要求最后执行validate(owner)，从该回执导出final reason/generation等。但例如018的fixture自身validate已返回CANVAS_INSTANCE_CHANGED并使owner终结；额外最后validate按设计只能返回OWNER_INVALIDATED。019/027/028/029/030/031/033/036同类。010/020通过register触发失效，首错应来自register.error，后续validate只能观察终态。不能用后一个回执覆盖前一个错误。

另002 begin拒绝没有owner，但expected.generation=0；合同要求generation只能来自validate(owner)，实际不存在合法owner可调用。这是runner统计或“未签发”约定，不能冒充OwnerValidity。

最小修订：按case/step明确保存“触发结果”和“终态观察”两份回执。fixture末步已是validate时复用原回执；register触发失效时错误来自该register，终态字段可另外validate且单独保留OWNER_INVALIDATED。begin失败的none/generation0明确为runner未签发计数，不伪造handle或API字段。

### SCIC-04 / 高：RED分支和命令仍不唯一，40例step interpreter无法按现有描述直接运行

runner_mode写compile-time-selected fallback，但只有一个不带参数的node命令；normal_green使用占位名 `FORCE_UNIMPLEMENTED_VARIABLES`，没有实际RED flag/CLI选择、完整fallback方法返回结构。若stub.begin返回UNIMPLEMENTED而无owner，后续步骤如何绑定old owner/token及避免missing-handle异常尚无约定；若为了继续流程合成成功owner，又不能声称所有方法都返回UNIMPLEMENTED。40例必须全部达到行为断言的要求不能由一句“loop continues”解决。

最小修订：给精确RED/GREEN模式选择和两个实际命令，去掉占位环境名；冻结stub各方法结果、首个预期成功步骤遇到UNIMPLEMENTED后的case收尾规则（例如记录行为mismatch并结束该case，继续下一个case，不必执行已无前置对象的后续步骤）。失败路径case也必须比对确切预期错误与UNIMPLEMENTED，而不能统一硬编码RED通过。GREEN明确只能真实source且mode不可回落。无需现在运行RED，先使其控制流合同唯一。

## 后续边界

修订SCIC-03/04后可继续独立审查和精确RED/准入准备。可信RED需要先写runner，因此runner准备阶段与source实现阶段应分别有明确授权顺序；不把合同里的“先RED再builder admission”理解为可无准入写测试。全部exact targets和排除项继续保持。

真实Store producer、权限、UI/Store、readDesign、copy/paste、commit、preview、query、history、save均未准入。完整Goal 10/26/16、Scope Delta none、S01独立、真实权限 `BLOCKED / NOT_RUN`、QPC产品接线 `NOT_READY_FOR_PRODUCT_UI_STORE`不变。仅写本报告，未修改合同、源码或测试；未宣称RED、GREEN或创建回归已通过。
