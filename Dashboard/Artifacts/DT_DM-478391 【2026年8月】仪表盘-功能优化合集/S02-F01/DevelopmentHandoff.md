# S02 开发准备与恢复交接

## 当前可执行边界

正式Goal、原始分母、Session DAG、设计候选和测试规格是后续实现输入，不是已执行产品功能。用户最新明确真实权限环境阻塞期间先设计与开发准备。不得以mock或standalone构造虚假权限通过。

## 下一实施入口

1. 已完成不依赖权限环境的纯载荷边界候选、case vectors（16父项/41子用例）、查询字段/引用静态调查；r001发现Q006三项元数据状态绑定不一致，已在Cases design-r003和PureSubcontracts-r002显式补齐resolved/not_found并禁止默认，BCR-r002独立复核接受。README旧合同链接P3已修复，处置记录已落盘。产品执行仍未发生。
2. 已运行独立 Design/Semantic review r002/r003及BCR-r002窄复核，有限纯子合同边界与绑定均可接收；测试入口见[TestEntryDiscovery.md](TestEntryDiscovery.md)与[现有复制入口补充r002](TestEntryDiscovery-r002.md)：前端无统一单测框架，可用Node+esbuild直测生产模块；源码已有整组件复制和跨仪表板VQuery引用重绑定，但没有过滤专用payload入口。下一步按r002中确切小模块建立有限合同测试包，形成由断言产生的可信RED，再验证精确Builder admission；不得误用整组件copy/paste实现新合同。权限、可信时钟来源、完整查询白名单/ID重绑定和多阶段提交连接点不由 Builder 猜测；字段并集静态补充见[QuerySchemaDiscovery-r002.md](QuerySchemaDiscovery-r002.md)，DG-03仍待冻结与独立复审。
3. 现有 UTF-8 子合同只测原始字符串字节计数，不能替代完整 envelope serializer；后续与完整 schema 分开验证。TTL纯合同从created_at_ms与now_ms自行计算age，只证明比较函数，不得宣称时钟可信。构造可信 RED 前先确认合同和case都可执行且失败fingerprint符合预期。
4. 维护者交付真实权限模块授权来源或隔离实例后，按PermissionEnvironment建立长期 editor/viewer 及管理员权限基准；账号创建已授权，不重问。仅记录安全凭据 locator。
5. 固定代码HEAD、tracked/untracked/index差异；当前工作区有大量他人未提交内容，不全量暂存、不切换现有分支。若需要隔离checkout，先记录源基线与必要本地输入，不遗漏未提交设计。
6. 验证execution admission绑定Final Goal、合同、当前Context、设计预审及实际lane topology，action=builder、target为实际最小源码切片。没有admission不得写产品代码。
7. 独立Builder顺序执行S02.2→S02.3→S02.4；每片同identity GREEN和负例；S02.5完整真实入口验证；S02.6独立验收；S02.7最终状态/KB/Dashboard/diff对账并移交S10。

## 不能关闭的事项

- 只读不得查看/复制/粘贴，真实数据/编辑权限撤销：NOT_RUN。
- 专用复制功能、跨标签/30分钟/50叶子/1MB/完整拒绝/查询组件独立副本：NOT_IMPLEMENTED，不能以既有组件复制替代。
- 30%收益：ISS-AC-11仍缺基线，不作达到声明。
- F02设备和S01第二批清理不由本S02擅自恢复，不视为F01本身验收通过。

## 回滚与证据

规划阶段为新增本目录与共享Dashboard追加行，写前字节见planning/dashboard-before；不通过git checkout/reset回退已有共享修改。未来产品代码回滚按变更ledger逐项最小逆向补丁执行，权限测试恢复约定基准，账号保留。所有发布/推送仍不在当前授权内。
