# SOURCE-LIFECYCLE M0 独立验证 r001

- 任务：`S02-QSSDH-SOURCE-LIFECYCLE-M0-validation-r001`
- 结论：`PASS_WITH_BOUNDS_FOR_M0_PREPARATION_CAPTURE`（仅限 detached 准备与完整保存意图捕获纯模块）
- 本报告是独立验证记录，不是完整生命周期、F01、权限或 S02 完成凭证。
- 只写本报告；未修改实现、测试、合同、fixtures、Goal 或 Builder 证据。

## 验证绑定与范围

按 G09 完整只读复核 Goal 与 26 项 must-have、16 项产品义务、ScopeDeltaAudit、SOURCE-LIFECYCLE r003 Design/Review、冻结 Contract/Cases、Builder card/Context、两个 target admission、M0 执行记录、限定源码与测试差异及权限边界。验证卡 canonical SHA-256 为 `3eaa39ddeab81489ad8c43d7be08f2b764b968afa859f01e4b5afc71b568d8db`；Context SHA-256 为 `96bf21c96912b9e371e15de4710c1353f60a573351dd7a407f70c13074320955`。card 与 Context 脚本校验通过，16 项 required-read 摘要全部匹配，`skipped_reads=[]`。Source/test admission 均以 `action=builder` 和精确 target 重验通过。

- Contract SHA-256：`256811438403033c0e3d44ed131228c3c1835f247ee18f3e9055b57c2fb7940b`
- Cases SHA-256：`09e939e895afc962785f50d578b7efcf144a515d1e002aff41e549444742d12f`
- 当前 Source SHA-256：`8f1ac0bb695352900041f88dacaf464205c18e858c004318f8ebb0c98c92aad7`
- 当前 Test SHA-256：`e83a481a8bd4a02ab7904a3d682ecfe35f7e290d74a63442575b9e2fbdd02fb8`

## 独立执行与行为结果

- **可信行为 RED：通过其预期失败判据。** 运行 `M0_FORCE_UNIMPLEMENTED=1 node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 1；首个冻结断言 `M0-PREP-001` 因 `UNIMPLEMENTED` 返回 `ok=false` 而失败。这是断言级行为 RED，不是构建/导入失败。
- **GREEN：通过。** 运行 `node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 0，输出 `M0 PASS: 6 contract cases; preparation, complete capture, detachment and fail-closed guards`。runner 当前明确断言6个冻结case身份，并覆盖有效准备、过期/负revision、非 VQuery 目标、循环 root 拒绝、完整更新捕获、名称类型错误、输入不变及 getter 不执行等。Node 24.21.0 对 package 未声明 `type=module` 打印 module type 提示；它不影响 RED/GREEN 退出结果。
- **定向 ESLint：通过。** 对 source 与 test 执行 `./node_modules/.bin/eslint ...`，退出码 0。
- **独立补充行为探针：通过。** 在不写仓库文件的临时 Node 执行中另查了 `optType=copy` 且保留旧 id 时走 `saveCanvas`、目标/overlay 缺失或重复时失败且无 `value`、完整 `dvNameCheck`/`appCanvasNameCheck`、无效名称、嵌套副本隔离、未匹配组件保留以及清理投影。没有调用 Store、网络或应用服务。
- **Payload 摘要重算：匹配。** 独立以 Node `crypto.createHash('sha256')` 对捕获 payload 的键排序规范化后计算；仅移除 `contentId`、`checkVersion` 后结果为 `e38819eb748207bfc2dc591e4b7b0ccf00d8558b771225d52a97f1bab6fbdb74`，与模块产生的 `intentDigest` 一致；修改 envelope 中这两个排除字段不改变该摘要。
- source/test 是当前新增未跟踪文件，因此普通 tracked `git diff --check` 不覆盖它们；对两目标分别运行 `git diff --no-index --check /dev/null <target>`，没有 whitespace diagnostics。该命令以 1 表示文件与空基线存在差异，不能把此退出码写成检查失败或通过的标准 `git diff --check`。

独立核对的 M0 行为包括：`prepareConfirmation` 对精确revision与唯一 VQuery target 才生成 detached design/runtime projection；过期revision、重复/缺失/错误目标、环形JSON拒绝且无部分结果；KEEP 外层字段不变，修改一个输出不影响输入或另一个投影。`captureSave` 对完整显式输入构造离线 payload，按 update/create/copy 分派方法；保留完整字段与目标信息，规范化名称，正确给出名称/应用检查参数，overlay 仅应用到唯一匹配目标，按合同清理 GroupArea 与指定 linkageFilters 投影，拒绝非法名称/目标且不产生部分 payload。输入对象在调用后不变，getter 计数为 0。

## Findings 分类

**Blocking：0。** 对 M0 冻结合同与限定候选，没有发现阻止 detached preparation/capture 范围通过的问题。

**Non-blocking：** GREEN runner 的固定新建路径断言 `saveCanvas`；copy-with-existing-id 分支由本次独立运行补充探针验证，当前结果符合合同。为后续维护增加该路径到持久 runner 会提升回归耐久性，但本轮不要求 Builder 修复，也没有修改测试。

**Questions：** M0 范围内无待回答问题。普通 JSON 的来源认证、网络失败结果不确定性及保存回包清 dirty 均在本切片之外，按既有设计保留未决状态。

**Builder repair：无。** 没有要求 Builder 对本轮 M0 文件继续修复。

**Follow-on：** 按 SOURCE-LIFECYCLE r003 Design Review，LC3-F01（样式专属成功回包/dirty）、LC3-F02（发布异常完整观察）及 LC3-F03（客户端失败与服务端结果未知的区分）阻止更宽的活动发布/网络保存接线；这些并不阻断 M0 纯模块。后续还须单独审查 Store/确认发布、Manifest/历史、网络回包与 dirty 清理，并按真实产品入口完成保存重开及权限验收。

## Goal、生命周期与权限声明边界

Goal 原分母保持不变：10 项 Goal AC、26 项 must-have、CoverageMatrix 16 项产品义务；无批准 Scope Delta。Goal ledger 仍为 26 项 pending，产品义务仍为 16 项 `NOT_RUN`。此纯模块不接 Store、Select、确认/发布、历史/undo/redo、网络、dirty 状态或权限，也不建立 session owner、私有来源凭证或持久 Manifest；保存重开后的普通 JSON 仍是 unmanaged、不可据此重新认证来源。

真实多用户权限环境继续 `BLOCKED / NOT_RUN`；只读用户限制、复制/粘贴、撤权与恢复未验证，不以 standalone、admin 或 mock 替代。S01 收尾状态不由本报告改变。最终结论只对 M0 detached preparation/capture 候选成立，不关闭任何完整产品义务，也不声明 F01/S02 完成或生产就绪。
