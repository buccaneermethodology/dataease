# QSINGLE-DEFAULT-COPY-001 Builder 执行证据 r001

## 结果边界

实现是独立纯函数 `copySingleSelectDefaultConfig`，只处理显式默认值、普通 VARCHAR 单选的复制源 JSON 配置状态。成功输出保留完整深拷贝，仅重生 `condition.id`、`checkedFields`、`checkedFieldsMap` 与级联 `node.id`、`datasetId`。默认/运行/级联值按源状态透传，不查询或验证枚举。

本 Builder 未调用或修改无默认值 QSINGLE 模块；未接产品入口、UI、Store、网络、权限、保存、预览或数据库。结果不证明产品 copy/paste、枚举有效性、真实权限或 S02 Goal 完成。

## 准入复验

- Builder card `qsingle-default-copy-001-builder-card-r001.json` 接收端 digest：`84f29fa838b43583515139dd53dbac51dd6d7af3461d6634070b88dffe9709fb`，lane task card validator 通过。
- ContextBootstrap `ContextBootstrap-QSINGLE-DEFAULT-COPY-001-builder-r001.json` validator 通过；SHA256：`579b0d0955ae44468092b579f26fd2bc5ed7622d37a431031df63a316d25cdb3`。
- execution admission validator 通过，action=`builder`，target=`core/core-frontend/src/custom-component/filter-copy/query-single-select-default-copy.ts`。绑定 Topology r070 SHA256：`31094f1eb60bcab2195f1b6082eb7293a9f79f06195f777d046b469736504977`。

## 写入与验证

- 新增实现：`core/core-frontend/src/custom-component/filter-copy/query-single-select-default-copy.ts`，SHA256：`364e1bfe27d0013b3fb2ecdc22105e54aedf07cdbe0a5ce731fbf1fdff497b44`。
- 新增 runner：`core/core-frontend/tests/filter-copy-query-reference/query-single-select-default-copy.test.ts`。runner SHA256：`2006fb73cde3b657a0b9487614c1ee7d183178a430aa668a8bc2f6df2b954015`。
- 冻结输入为 `QuerySingleSelectDefaultRebuildFixtures-r003.json`（SHA256：`3afaf76708fade4e62c5feda62066dec58d78c8ec9b98e9a18fea994820ca90e`），包含 12 个固定 identity；无改动。
- RED 和 GREEN 使用相同 runner、固定 12 identity 与同一个源实现指纹。RED 通过 runner 的显式 `QSINGLE_DEFAULT_COPY_FORCE_UNIMPLEMENTED=1` stub 触发冻结 oracle 断言失败：15 checks、15 failures、exit 1；未通过移走源文件或模块解析错误制造 RED。GREEN：15 checks、0 failures、exit 0。
- GREEN 逐例完整比较预期输出，另检深冻结、输出与输入无嵌套引用共享、所有非身份字段深等、输入不变、确定性及 JSON round-trip。
- 定向 ESLint：`./node_modules/.bin/eslint src/custom-component/filter-copy/query-single-select-default-copy.ts tests/filter-copy-query-reference/query-single-select-default-copy.test.ts`，exit 0。
- 各命令的 stdout、stderr 与退出码分别在本目录 `QSINGLE-DEFAULT-COPY-001-{red,green,lint}.*.txt`。

这是有界 Builder 证据。独立 Validation、产品接入和完整 Goal 义务仍待后续处理；真实多用户权限继续 BLOCKED / NOT_RUN。
