# G2 真实浏览器观察记录

## 范围与证据上限

主代理 `/root` 通过 CUA 在本机 `127.0.0.1:7093`、browser 2/tab 1 操作真实 AntV G2 和生产 helper。它是原始观察候选，不自报独立验收；最终独立收尾审查另行绑定。本页是隔离测试夹具，不是 DataEase 完整 line renderer，更不是过滤 Copy/Paste 产品界面 MVP。静态虚构数据，无后端、无数据库、无权限替补。

## 可见观察

| 操作 | 实际观察 |
| --- | --- |
| 渲染 O | O-1 ready；created=1/destroyed=0；canvas=1 |
| 调整宽度 | 真实 changeSize 从760到520，canvas CSS宽520，活动scope不变 |
| 延迟 N | N-2在afterRender等待；activeId=null；O已destroy一次 |
| 释放 N | N-2 ready后才发布 |
| N等待时建立O，再释放N | N-3 stale且destroy一次；O-4仍活动，canvas=1 |
| 原生图例 | 点击系列甲后文字灰色、蓝线消失；后续重建恢复双系列 |
| 原生 tooltip | 先click产生隐藏DOM不作可见通过；轻微原生drag后computed visibility=visible，截图显示4月、系列乙36、系列甲23 |
| 空数据 | 不构造新Chart；created=4/destroyed=4，canvas=0 |
| 重复5次 | created=9/destroyed=8，活动R-10，仅1个canvas |
| N等待期间卸载，再释放 | N-11 stale；created=10/destroyed=10，activeId=null，canvas=0 |
| 再挂载O后卸载 | created=11/destroyed=11，canvas=0，pending=[] |
| 错误 | 所有步骤runtimeErrors/cleanupErrors=[]，console error/warn=[] |

[原始可见状态JSON](G2OWN-BrowserObservation-r001.json) 保存15个步骤及逐实例事件，不只汇总计数。截图保存在[ready截图](../g2-ownership-final-snapshot-r001/browser-ready.jpg)和[tooltip截图](../g2-ownership-final-snapshot-r001/browser-tooltip.jpg)。helper最终摘要与源文件清单见JSON及[最终快照](../g2-ownership-final-snapshot-r001/manifest.json)。

## 环境与限制

Node/Vite使用既有依赖。首次sandbox绑定7093遇EPERM，经工具权限升级后仅启动127.0.0.1:7093成功；没有改网络暴露范围或启动产品服务。服务会在独立复核后停止。未验证DataEase完整renderer的assist/自定义legend adapter、返回句柄前partial allocation、stage/query/Store事务、Copy/Paste、保存重开或真实权限。主代理手动采证是明确的单代理观察例外，独立结论仅由后续审查给出。
