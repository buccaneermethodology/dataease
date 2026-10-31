# S02 图片候选资源就绪：可读行为卡

权威为冻结 PictureResourceReadyCases-r002.json 及设计r002；本文件仅可读投影。Goal追溯更正为 AC-MVP-F01-06/08/12，局部MVP-UI-10-PICTURE不等于TTL条款AC-MVP-F01-10。完整38项验收保留。

| 用例 | 假如 | 当 | 那么 |
|---|---|---|---|
| PIC-RR-01 | 资源请求未完成，占位图可以解码 | 占位图触发load | 候选保持等待，目标无写入 |
| PIC-RR-02 | 真实资源加载成功 | 加载在扫描前或后完成 | 地址稳定且真实内容解码后才就绪 |
| PIC-RR-03 | 真实资源请求失败 | 失败占位可以解码 | 候选失败，不采用占位 |
| PIC-RR-04 | 响应不是image Blob | 资源准备完成 | 拒绝并保持零共享写 |
| PIC-RR-05 | 缓存已有失败资源 | 再次准备候选 | 失败缓存不能被当作成功 |
| PIC-RR-06 | 候选等待或已就绪 | 卸载或重复dispose | 只收束一次，监听和计时器清除 |
| PIC-RR-07 | 候选在资源或解码阶段 | 当前身份失效 | 迟到完成不能采用 |
| PIC-RR-08 | 候选尚未就绪 | 总时限达到10秒 | 失败；之后资源完成不写src |
| PIC-RR-09 | 另一个根节点引用失败图 | 当前根节点的资源成功 | 无关失败不阻断当前候选 |
| PIC-RR-10 | 直接data URL | load已到而decode未完成 | 继续等待decode |
| PIC-RR-11 | 合法外链或相对URL | 加载成功或触发error | 成功需decode；error拒绝 |
| PIC-RR-12 | 条件匹配后没有showUrl | 准备空图片候选 | 合法空态，不强造图片 |
| PIC-RR-13 | 条件样式关闭 | 准备静态第一张图 | 零query并保持非queried语义 |
| PIC-RR-14 | 真实图片的decode失败 | 解码返回reject | 候选失败 |
| PIC-RR-15 | 缓存清理并可能重建 | 清理发生在扫描/两轮等待/最终解码阶段 | 重新稳定真实内容或拒绝；不能采用废弃占位 |
| PIC-RR-16 | 已捕获源和候选节点 | 源地址/src变化或节点断连 | 不得采用过期候选 |

执行入口：`node core/core-frontend/tests/filter-copy-mvp-picture/check-resource-ready-r005.mjs`；`--baseline`运行冻结旧SFC。当前37实例为本地宿主测试，DOM、网络、FileReader和decode为明确替身；浏览器展示、正常保存离开重开、真实权限仍需各自证据。
