# 图片组真实资源就绪修复设计 r001

## 权威、范围与声明上限

本交付物只修复已批准界面MVP的图片候选就绪边界，归属DE-EXEC-S038 / MVP-UI-10-PICTURE。完整P1 12+P2 26=38项不变，49种类型分母不变，真实权限仍BLOCKED/NOT_RUN。独立评审本交付物第1/3轮，一次查全所有问题。不能重开已耗尽3轮的UiIntegrationDesign评审，也不能凭运行success宣称真实图像就绪。

## 观察与待证假说

RuntimeEntryBoundary-r001保留图片组双向复制粘贴；table-info明细返回277，不是6761汇总。候选DOM曾出现24x24交叉SVG而非上传120x80源图。resourceImageCache.ts的placeholder(true)恰生成失败交叉SVG。Component.vue waitForPreparedImage把imgUrlTrans当前返回字符串单次写入candidateImageSrc，随后只检查complete/naturalWidth/decode：待加载或失败占位本身也能解码。此为静态可定位风险，浏览器事件未独立证明完整根因；须可信RED再改。

## 最小改动

仅改picture-group/Component.vue的候选图片准备，以及聚焦测试；不修改或回退已有通用resourceImages.ts/resourceImageCache.ts、认证、后端、图片上传和普通图片展示。复用现存waitForResourceImages候选根DOM等待逻辑。先冻结这些依赖摘要，漂移则重新核对。

候选顺序：注册load/error、10秒timeout和dispose取消；将imgUrlTrans(showUrl)的临时显示值赋给候选img；nextTick后对pictureRoot调用waitForResourceImages；在它成功后再次检查alive/current/settled，重新调用imgUrlTrans取得已解析真实内容，并在第二次Vue patch前设置resourceReady门。load在resourceReady=false时不得触发ready或错误成功。最终只在当前img实际src对应最终URL、已连接、complete、naturalWidth>0且decode成功时ready。缓存失败/取消/超时返回paste_render_failed或既有stale语义；不把占位图形状、24像素或特定URL前缀作为通用失败判断。

只等待候选root内实际使用资源，不能等整个canvas的无关失败图；不清除/中止共享cache，不影响其他图。外链或data URL不经过cache，也必须走本候选的真实load/decode。无showUrl仍沿合法empty分支，不强造图片；条件样式OFF仍零查询。保持响应wire table-info到prepared picture-group/custom转换。

资源ready Promise可能晚于10秒结束；必须捕获其异常，late continuation在settled/alive/current检查后退出，既不改候选src也不提交。所有路径解绑监听、清timer，dispose幂等。使用现存helper若无法满足区分真实内容与占位的边界，先报告设计缺口，不能扩大修改通用缓存。

## 可信RED与GREEN

新增有界测试执行实际SFC和生产resourceImageCache核心，网络端口使用显式deferred Blob，DOM宿主/load/decode是标明的替身，不把它当真实浏览器。先运行当前源码，预期在资源pending却占位load/decode完成后错误ready，或加载失败后仍ready指纹失败；须编译执行成功且身份不变，再允许Builder。固定case ID、输入与断言，不由Builder改冻结case。

同身份GREEN必须覆盖pending占位不ready、成功后最终真实URL与尺寸/解码、HTTP失败和非image Blob、旧缓存失败、取消/卸载/身份过期、timeout后late、其他root无关失败、data/external URL及empty/OFF回归。运行原picture与paste聚焦runner，定向lint。之后正常浏览器配置amount>0命中图片，核120x80图片与实际文字并正常保存/离开/重开；如环境资源仍失败，失败证据保留，不能降级为pass。

## 实现阶梯与写入排除

独立设计评审→冻结Cases及baseline摘要→可信RED→精确Builder admission→最小实现→同身份GREEN和既有回归→独立Validator→真实UI。冻结Goal/UiIntegrationDesign/Cases、通用缓存和其他业务源码为排除项。最终只允许声明此有界修复，不能宣布MVP/Goal通过。
