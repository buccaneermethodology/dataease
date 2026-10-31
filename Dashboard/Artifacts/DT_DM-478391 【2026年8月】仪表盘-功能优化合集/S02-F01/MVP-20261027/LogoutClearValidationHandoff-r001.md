# U4 正常退出与重入验证交接

累计首轮 1/3。目标是 UI09 身份边界的前端正常 logout 清空与重入空剪贴板，不证明真实鉴权。P1 12 + P2 26 = 38，49 类型完整验收仍 0/49；C2 3/3 BLOCKED 不重开。

核验全部 LogoutClear 原始控制失败 r001/r002、恢复/读回、成功 r003，以及独立重入 r001。r001 convenience context 创建辅助页失败，未退出；r002 networkidle 超时但 DOM 已就绪，未退出。r003 显式同 context 辅助账户页正常退出，主旧编辑页先完整绑定实际非空 clipboard descriptor/createdAt/revision/session，再观察 epoch 1→2、clip null、351ms，发生于 reload/reentry 前。不能由后来的 reload 反证退出清空。

认证恢复在观察器外，不记录认证数据。重入实际 copy 输入有效、pasteReason clipboard_empty，最终三个 DEV role unknown。新运行域 epoch 不与旧域直接比较。DEV 三态与 standalone admin 不是真实权限；logout 后端仅日志，不能声称服务端撤权或跨身份隔离验收。

请一次检查全部问题、无问题维度、未查原因、同类残余、修复后准入预测。仅写指定中文报告，不修改产品、原件、不 UI/DB/安装。报告含 reviewed_at、snapshot_id、as_of_state，独立复算摘要及源码链、Context/admission、观测器是否调用清空或读取敏感信息。局部链通过不等 S039/P1/Goal 通过。
