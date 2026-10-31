# SOURCE-LIFECYCLE r004 Builder 执行证据 r001

## 范围和声明上限

本轮仅覆盖 r004 准入的受管新建非模板普通单选查询会话生命周期候选及其局部产品接线。原 Goal 的 10 项 AC、26 项 must-have、16 项产品义务未缩减，也未宣布通过。真实多用户权限、只读用户复制/粘贴限制、权限撤销/恢复仍 `BLOCKED / NOT_RUN`；普通 JSON 重开来源认证、真实服务端写入顺序、完整 F01/S02 验收均未证明。

## 本轮修复

- 受管确认的 prepare/commit 失败现在失效会话后立即停止，不进入 legacy 的 `propValue/cascade` 直写、快照记录和查询事件路径；旧路径只用于非受管会话。
- 补充 `LC3-HISTORY-03` 部分恢复失败、`LC3-HISTORY-04` history 深克隆准备失败、`LC4-SAVE-15` 未知更新后另一更新成功仍保留未知结果/dirty 的实际断言。
- 修正真实 `Select.vue` 中 `inject` 默认回调的工厂参数错误，避免把默认函数求值为布尔值后仍作为函数调用。

## 执行结果

- 同一生命周期 runner GREEN：`node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 0；覆盖准备/保存捕获、publish 失败、history 部分失败与准备失败、manifest fallback、未知 create/update 结果。
- 同 runner RED：`QSSDH_LIFECYCLE_FORCE_UNIMPLEMENTED=1 node tests/filter-copy-query-reference/query-single-select-session.test.ts`，退出码 1；在 `LC4-SAVE-14` beginSession 行为断言失败（实际为注入的 UNIMPLEMENTED），不是编译失败。
- `tests/filter-copy-query-reference/*.test.ts` 全组逐项执行通过：14 个 runner 均退出码 0；总计覆盖各自冻结子合同，不据此推断产品端到端通过。
- 延迟枚举真实 Vue SFC 受控 renderer：`node tests/filter-copy-query-observation-component/check.mjs`，通过 PA-001..005；测试 harness 使用受控 `el-select-v2` 端口，不证明生产 DOM、可访问性或全量产品运行。
- 10 个生命周期目标文件定向 ESLint 通过；`git diff --check` 通过。
- `npm run ts:check` 退出码 2，只有三个现存 TS6504 输入错误：`DeRichTextViewV3.vue.js`、`views/pages/menu/system/watermark/index.vue.js`、`views/watermark/index.vue.js`。这些文件不在本切片目标内；本次源码没有由此获得类型检查通过结论。

## 独立验证状态

先前只读复核发现确认失败回退及缺失 case 覆盖，并给出 `PARTIAL`。Builder 修复后已通过 SP-010 校验的 Validation card/context 重新派发独立 full-baseline 只读复核；最终 Validation 报告尚未写入，当前候选状态仍为待独立验证。

## 限制与后续

没有执行需真实权限的测试，也没有使用 standalone、mock 或管理员身份替代。下一步等待本切片独立 Validation；之后继续 S02 未完成产品工作包。真实权限环境可用后再补权限矩阵，完整 Goal 关闭前必须完成完整范围独立验收和最终状态对账。
