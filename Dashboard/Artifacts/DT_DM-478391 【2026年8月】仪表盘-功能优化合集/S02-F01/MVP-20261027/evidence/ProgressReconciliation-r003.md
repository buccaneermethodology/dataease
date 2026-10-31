# S02 阶段对账 r003

本记录补充 r002 之后的真实 UI 结果，不代表完成。原 Goal、26 项身份、16 项产品义务、22 项当前验收及49个内建类型的完整分母继续保留。

- bar 到 indicator 正向采用、真实查询 6761 及保存离开重开证据见 `RuntimeIndicatorPaste-r001.json`、`RuntimeIndicatorReopen-r001.json`；bar 到 indicator 本 turn 前已完成。
- indicator 到 bar 覆盖：完整 AND/OR 过滤树与 ownKeys 一致；真实 query 返回果元店3218、南都店1284、乐园店563、水围店1141、香橙店555，与独立oracle一致，逻辑 getData 一次。粘贴成功后显式保存离开，再次用已观察的编辑器 URL 重开，树与键一致、剪贴板空；重开后 bar 数据未由诊断观测，且列表行为受未发布disabled限制。证据：`RuntimeBarPaste-r001.json`、`RuntimeBarReopen-r001.json`。
- 测试桩 unknown/deny 时按钮禁用且树不变；这不能验证真实多用户权限、只读用户查看/复制/粘贴限制或撤权。证据：`RuntimePermissionStub-r001.json`。
- 探查面积图：临时在未保存的bar配置上改为area后发起确认粘贴，后端真实查询返回，组件最终失败 `paste_render_failed`，画布原过滤树保留。控制台观察到 Vue 写入 readonly `view` 的 warning。该操作未保存；离开并明确选择“否”放弃未保存改动后，重开已保存仪表板确认回到基础柱状图，指标卡仍6761。证据：`RuntimeAreaPasteFailure-r001.json` 与同名 PNG。原因归属仍未知；面积图不计成功，需调查图表切换/绑定接线后重测。
- 独立评审：C2 第3/3轮 BLOCKED，C2V-005七fixture重复销毁；三轮用尽，不加第四轮；真实 SDK/GPU 损害未测。C3 第2/3轮 PASS_WITH_BOUNDS，真实 TinyMCE、后端、保存重开未测。
- 49类型全量运行通过仍为0；其他源/目标类型、实际渲染与保存重开、拒绝/失败/撤销/保存失败等场景继续待验。真实权限来源未提供，按用户决定保持未验证。未修改 S01。

下一步：先调查面积图 `paste_render_failed` 的准确触发层，再按内建类型逐类建真实图表/源目标验证，同时推进不依赖 C2 阻断的复杂场景；所有未完成 AC 保持未完成。无 Session registry 工具，未声称程序化对账通过。

记录时点：2026-10-27T08:29:00.197682+00:00
