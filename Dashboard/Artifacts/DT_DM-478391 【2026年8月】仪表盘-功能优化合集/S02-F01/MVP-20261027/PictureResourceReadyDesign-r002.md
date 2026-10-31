# 图片组真实资源就绪修复设计 r002

## 权威、范围与声明上限

本交付物只修复已批准界面MVP的图片候选就绪边界，归属DE-EXEC-S038 / MVP-UI-10-PICTURE。完整P1 12+P2 26=38项不变，49种类型分母不变，真实权限仍BLOCKED/NOT_RUN。独立评审本交付物第2/3轮，一次查全所有问题。不能重开已耗尽3轮的UiIntegrationDesign评审，也不能凭运行success宣称真实图像就绪。

## 观察与待证假说

RuntimeEntryBoundary-r001保留图片组双向复制粘贴；table-info明细返回277，不是6761汇总。候选DOM曾出现24x24交叉SVG而非上传120x80源图。resourceImageCache.ts的placeholder(true)恰生成失败交叉SVG。Component.vue waitForPreparedImage把imgUrlTrans当前返回字符串单次写入candidateImageSrc，随后只检查complete/naturalWidth/decode：待加载或失败占位本身也能解码。此为静态可定位风险，浏览器事件未独立证明完整根因；须可信RED再改。

## 最小改动

仅改picture-group/Component.vue的候选图片准备，以及聚焦测试；不修改或回退已有通用resourceImages.ts/resourceImageCache.ts、认证、后端、图片上传和普通图片展示。复用现存waitForResourceImages候选根DOM等待逻辑。先冻结这些依赖摘要，漂移则重新核对。

候选冻结 sourceUrl、pictureImage、pictureRoot 及当前binding。全程一个10秒timer，不分阶段续期。每次await之后、src写入之前都检查settled/alive/current、sourceUrl不变、img/root对象相同且连接。

使用局部稳定化，不以固定两次barrier作为充分条件：在总期限内循环“imgUrlTrans(sourceUrl)取得expectedSrc → 写candidateImageSrc → nextTick → waitForResourceImages(仅pictureRoot) → 再调用imgUrlTrans(sourceUrl)”。前后转换不一致时门保持关闭并重跑该轮；只有helper成功且转换值保持一致才开resourceReady门。helper必须接入现存生产实现；任一reject直接失败，不清缓存或中止共享请求。缓存清理导致新entry时新占位的唯一值会使稳定性比较失败，不能采用旧占位。循环没有独立续时；每轮需验证总deadline，禁止无限微任务轮询。

load在resourceReady=false时不判成功。最终开门后主动检查已complete图片，防止load先到。解码前后同时检查原始src属性===expectedSrc（相对URL不与绝对化src混比）、冻结对象/源、connected/complete/naturalWidth>0、alive/current，以及再次imgUrlTrans(sourceUrl)===expectedSrc；若清理重建了缓存或src变化，fail closed。decode reject、error、timeout、dispose均结束且解绑；晚到helper/decode不能重写src或再次resolve。

外链/data URL无需cache entry，由最终load/decode核对。showUrl为空沿合法empty分支；条件样式OFF零query。保持table-info到picture-group/custom适配与metadata。只等候选root，不等canvas无关失败图。仅调整图片候选与聚焦测试，绝不修改通用cache。

## 可信RED与GREEN

新增有界测试执行实际SFC和生产resourceImageCache核心，网络端口使用显式deferred Blob，DOM宿主/load/decode是标明的替身，不把它当真实浏览器。先运行当前源码，预期在资源pending却占位load/decode完成后错误ready，或加载失败后仍ready指纹失败；须编译执行成功且身份不变，再允许Builder。固定case ID、输入与断言，不由Builder改冻结case。

同身份GREEN必须覆盖pending占位不ready、成功后最终真实URL与尺寸/解码、HTTP失败和非image Blob、旧缓存失败、取消/卸载/身份过期、timeout后late、其他root无关失败、data/external URL及empty/OFF回归。运行原picture与paste聚焦runner，定向lint。之后正常浏览器配置amount>0命中图片，核120x80图片与实际文字并正常保存/离开/重开；如环境资源仍失败，失败证据保留，不能降级为pass。

## 实现阶梯与写入排除

独立设计评审→冻结Cases及baseline摘要→可信RED→精确Builder admission→最小实现→同身份GREEN和既有回归→独立Validator→真实UI。冻结Goal/UiIntegrationDesign/Cases、通用缓存和其他业务源码为排除项。最终只允许声明此有界修复，不能宣布MVP/Goal通过。

## 首轮发现处置

F1：以稳定化循环覆盖扫描前成功/失败造成的空匹配。F2：冻结源和对象；每轮及decode前后重新转换核对，cache clear/recreate、stale、source/src变化均fail closed或在准备期重入barrier。F3：Cases r002保留16个ID并补明确交错oracle；旧runner仅对data fixtures显式passthrough资源端口，新runner执行实际cache/helper与SFC，DOM/FileReader/network仍明示替身。测试准备可先行，产品写入仍待设计复审及可信RED。
