# G2 返回实例所有权 helper 实现报告 r001

## 本次交付与证据上限

生产 `g2-render-attempt.ts` 已从 NOT_IMPLEMENTED stub 替换为真实 returned-instance ownership helper。为界面 MVP 提供迟到、失败与释放时的实例归属基础：每次 create/setup/render/afterRender 使用本次 scope；登记的同步 cleanup 逆序释放、实例 destroy 一次，stale 或失败不返回 ready。

这是 helper 实现 candidate，独立实现 Validation 仍待执行。未修改 ChartComponentG2Plot，也未证明组件接线、真实 G2 浏览器、完整 stage、权限、UI MVP 或 S02 Goal。原 10 Goal AC / 26 must-have / 16 产品义务保持，G2OWN-027 仍 OPEN / NOT_FIXED_BY_THIS_UNIT。

## 准入与实现

Card canonical SHA `122e324b4a271c66c18e6824a071d9f4d46813e49528be9b34c891e147ed2556` 与 Context 在接收端复验通过；消费 helper source / evidence 的新精确 admission 后写入。独立 RED Validation r002 已 PASS_WITH_BOUNDS，RV-001 / RV-002 关闭。Builder `/root/g2_ownership_red` 不替代独立 Validator。

- 每次调用持有独立 Map、closed 标记、已返回 instance 与错误数组。create 前、每次 await 后及 setup 后检查 current；显式 empty 释放 initialCleanups，意外 undefined / 无 destroy 的缺失实例按 G2_RENDER_INSTANCE_MISSING 失败。
- remove 先删除登记再调用，防止同项重入重复执行；replace 先清旧项后登记新项；closed 后登记立即清理。dispose 先 closed、清空登记、逆序 cleanup，再 destroy 捕获的返回实例，重复调用为空数组。
- 自动释放与 replace/remove 的错误分别返回并同步通知一次；通知自身异常附加到返回错误，不递归通知。ready 后手动 dispose 只返回错误；调用者负责观察，helper 不重复通知。
- `G2RenderAttemptFailure` 保留 originalError / cause 原引用及独立 cleanupErrors，清理/通知异常不会替换业务异常。只覆盖已返回实例和已登记 disposer；create/installer 返回前的 partial allocation 未被本实现关闭。

实现没有读取 Cases、case ID 或 expected，没有新增依赖。冻结 runner 保持 `0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f`，23 个 helper 身份与 RED-r002 一致。

## 验证结果

| 验证 | 实际结果 |
| --- | --- |
| 同身份生产 GREEN | 23 executed / 23 passed / 0 assertion failures / 0 execution errors |
| oracle 自检 | 17 负例全部拒绝，15 通道正向控制及双 stub 正控制通过；仅测试工具诊断 |
| 补充生产合同探针 | 6/6：相同函数新登记、empty 初始 cleanup+notify 错误、remove 独立错误通道、非 Error 业务原引用、stale 初始清理、缺失实例拒绝 |
| 定向 ESLint | exit0，无输出 |
| 严格单文件 TypeScript noEmit | exit0，无输出；不代表全项目 ts:check |
| 独立生产 TS esbuild bundle/import | exit0，两个生产导出有效；write=false，无构建产物 |
| 空白检查 | 跟踪差异检查 exit0；对未跟踪完整 source 的 no-index --check 输出为空，exit1 为存在差异的预期状态 |

首轮严格单文件类型检查发现销毁闭包中的 instance 可能 undefined；改为捕获 ownedInstance 常量后复验通过，没有修改合同或 runner 规避。

GREEN 命令：`node tests/g2-render-ownership/check.mjs --mode green`，工作目录 core/core-frontend。实际调用开始 `2026-10-27T00:47:38.151316+00:00`，结束 `2026-10-27T00:47:38.186159+00:00`（UTC）。原始 stdout / stderr / exitcode 为 `G2OWN-GREEN-r001.*.txt`，identity 保存精确 commands、原始补充检查输出与可复演脚本、源差异及摘要。

## 摘要、保留与后续

- 原 stub SHA：`ee4a86b213973ae00345fe079000454085c72af8c48a2725cdda454c1b8fb3ed`。
- 当前 helper SHA：`d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`。
- runner SHA：`0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f`。
- GREEN bundle SHA：`8cb390066ccd4799afe07805efe890198bd13993bda8cd63e49be05359e14673`。

Design / Cases r002+r003 / Goal / 组件及 RED-r001/r002 原始证据保持；没有安装、启动服务/数据库、提交或推送。诊断输出中的 production_stub_modified=false 表示诊断入口自身不改生产文件，不表示当前生产代码仍是 stub。

下一步由独立 Validator 核对完整实现差异、23 同身份 GREEN、逐通道及补充证据。普通 line SFC 的专用 harness、可信组件 RED 与精确组件 admission 另行推进；本 helper 实现不得被升级为 UI MVP 或完整 Goal 已达成。
