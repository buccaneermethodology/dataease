# 本地静态资源目录诊断候选

记录时间：2026-10-29T07:17:00.081582+00:00。只读诊断，未改配置、未重启、未动数据库。

## 已观察

- 图片规则 amount > 0 已保存，主动离开到数据集页再重开后保留；两次均只显示24x24失败标记。粘贴失败能保留原过滤树、修订号和禁用的保存按钮。
- 唯一与120x80测试SVG原始SHA一致的上传文件：`/Users/xiaomei/opt/dataease3.0/data/static-resource/7521416492009656320.svg`。SHA为4ee1f90162a2054113954838d0f837f514d027fc60b22ac9e270dcea94af0c4b。默认`/opt/dataease3.0/data/static-resource`不存在。
- 外置配置的`dataease.path.static-resource`指向上述用户目录，但没有`dataease.path.data`。仅读取白名单路径，未复制配置其他内容。
- 当前8100监听Java进程1730使用CoreApplication.jar、standalone及该外置配置；运行包包含读取`dataease.path.data`和默认`/opt/dataease3.0/data`的common类。进程参数读取首次sandbox禁止，获准只读重试；包扫描在common类命中后遇另一个无该类jar报KeyError，不作为完整包扫描通过。
- 源码StaticResourceServer使用static-resource配置写入，而DeMvcConfig经StaticResourceConstants读取data配置作为下载目录；ConfigUtils读取用户目录config/application.yml。
- 不携带凭据的两次HTTP探测（7070/api及8100/de2api）均401；这只能说明匿名被拒绝，不能证明已登录请求404或验证真实多用户权限。

## 推断与修复候选

上传与读取根目录配置不一致是当前图片失败及地图资源404的候选原因。尚未观察已登录图片请求的响应码/Content-Type，不能把推断当确定根因。候选配置只在现有`dataease.path`增加`data: /Users/xiaomei/opt/dataease3.0/data`，保留static-resource路径与全部其他配置。不要复制资源到/opt，不改变鉴权，不读写凭据。

需要先核实同进程是否被其他开发工作使用、配置当前精确字节与安全备份方式、现有启动方式及是否会触发迁移；然后通过独立环境变更准入并重启同一本地后端。若有冲突，建立维护窗口；未确认前不动共享后端。成功判据为当前已上传图片经应用正常请求显示120x80与S02 MVP文字，再正常粘贴/保存/离开重开；不能以匿名401或配置存在替代。

## 边界

这是独立的环境准备候选，不重开已完成3/3轮的PictureResourceReady局部代码验证。该代码仍为绑定源码的有界PASS。图片正常显示仍未完成；38义务、49类型与真实权限分母保持。
