# 保存传输失败 loading 最小清理设计

原AC09/U3受控save网络失败已经真实观察：正常按钮发updateCanvas，浏览器abort，query/paste500有效且无保存成功；正常panel0/find读回仍bubble200，但全页dv-common-layout loading不释放，遮罩拦截重新选择。原失败与正常reload恢复另存，重载不是修复证据。

源码service.ts的response rejection回调在 `!error?.response` 时直接reject，早于后续已有tryHideLoading；原tryHideLoading只在当前key计数>0时减一。拟只在该无response分支、返回原Promise.reject前，若error.config?.loading为真则调用已有tryHideLoading(permissionStore.getCurrentPath)。不使用全局reset、不改业务响应/鉴权/重试，也不改本轮之前的专有图片handleErrorLocally分支。

冻结Cases-r001覆盖8个有界见证，尤其两并发引用/其它path保持/缺config/非loading/图片local分支/取消错误/原HTTP400拒绝。用TypeScript AST定位实际service.interceptors.response.use第2回调，原文提取并转译，仅替换外围store/UI provider；tryHideLoading也提取真实现有helper，不复制被测判断。真实callback层runner执行无错、预期STL01/02/07 loading计数失败才算可信RED；同cases/同runner GREEN。不是整个Axios模块启动或真实权限证明。

Builder只改无response分支最小几行，冻结Cases/runner/预像不许随实现改期望。RED后如发现执行前提/设计错误，保留并回到当前轮次，不假称RED。定向lint只检查本改动source和runner；无需重做无关整包。新U3 runtime保留真实query/单abort/save不成功/loading释放/正常离开重开旧保存树，另交独立核；不扩大到所有错误/所有路由/全部Profile。

此新问题来自原保存失败共享要求，与C1/C2/SliceA耗尽3/3包无同一修复关系；新最小修复单元累计预算最多3轮，当前设计审查拟第1/3。请一次查全范围、原始failure到source因果、cases/oracle、AST提取可信度、并发引用、缺config、图片分支、共享影响、回滚及声明上限；不因“还能更严格”追加全HTTP重构。本设计尚未改源或执行RED。
