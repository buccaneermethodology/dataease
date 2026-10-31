# 保存传输失败 loading 最小修复验证交接

新且独立Axios清理单元累计第2/3轮（设计为1/3），不重开C2/C1/SliceA。原AC09/U3真实受控网络失败发现全页loading滞留；首次run FAILED/正常find旧200/被遮罩挡住/正常reload仅恢复均原迹保留。

源码仅在无response早退分支增加一行 `error.config?.loading && tryHideLoading(permissionStore.getCurrentPath)`，其它字节逐字与service.ts.before相等；没有改fulfilled/local/timeout/HTTP错误/请求拦截器，没有globalreset、自动重试或权限改动。Scope为同一路由已取得loading引用的失败。路由key归属和其它既有错误路径按设计限界，不称全HTTP所有错误修复。

8 Cases与runner在RED前冻结。runner用TS AST唯一定位实际service.interceptors.response.use第2箭头函数和真实tryHideLoading；只外围Store/UI provider为替身，标准AxiosHeaders真实。可信RED=5pass+STL01/02/07三个指定计数语义失败、0执行错误；只改源后同runner/同Cases GREEN8/0/0，source与runner定向lint0。不是完整Axios模块初始化或真实权限证明。可以在隔离临时目录放相同runner、source.before、真实helper、node_modules/Dashboard软链接独立复跑RED，禁止临时替换workspace正在运行的源码；GREEN可直接复跑。

真实U3新r002已完成：单save transport abort、无success、当前编辑500保持，800ms实际maskCount0；无需reload/force，正常panel0/find读回旧保存bubble200，clip空、三unknown。query为真实，不改响应；save是在浏览器发送前abort，不能冒充后端写入失败/事务回滚。首r001失败和后r002成功分开，实际PNG请独立查看，保存前后完整树/clip/session与raw query/save失败/find应逐CSV核。

请一次查全原目标、source最小diff、固定Cases/runner与RED/GREEN可信度、真实U3/恢复及声明边界，明确全部发现/无问题维度/未查原因/同类残余/准入预测。只写独立报告，可只读运行本unit/lint与临时shadow RED，不源码/UI/DB/安装/构建，不机械补所有错误/所有路由/所有类型或为报告再发review。BDD：本修复新增unit，不改冻结maintained非unit cases；本次U3是原case一次性运行见证。
