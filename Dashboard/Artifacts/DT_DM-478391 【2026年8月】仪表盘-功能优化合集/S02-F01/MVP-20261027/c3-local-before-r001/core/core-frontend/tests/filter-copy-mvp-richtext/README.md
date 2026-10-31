# C3 富文本候选组件见证

在 `core/core-frontend` 使用已安装依赖运行：

```sh
node tests/filter-copy-mvp-richtext/check.mjs --baseline --before
node tests/filter-copy-mvp-richtext/check.mjs
./node_modules/.bin/eslint src/custom-component/rich-text/DeRichTextView.vue tests/filter-copy-mvp-richtext/check.mjs
```

`--before` 按 `c234-before-r001/manifest.json` 读取并核验原富文本 SFC 字节。基线真正编译、挂载完整旧 SFC，执行原 `viewInit/assignment` 及 1 秒 timer，触发公开 fieldSelect；字体、旧段落、公开 channel 三个语义断言失败才是 RED。缺新 prepare 方法、编译错误或 provider 缺方法不是 RED。

绿色检查加载完整真实 `DeRichTextView.vue`，Vue custom renderer 执行其 template/生命周期。TinyMCE Editor/事件/connected body、DOM 及 Store 为明确协议替身；测试不替换真实字段映射、格式化、assignment、候选 ready/失效控制流。HTML 字符串来自真实 SFC 的 setContent 调用，替身不替换占位值。地图、图片和 C1 wrapper 不属于本 runner。

输入来自已冻结 `UiC234ConcreteFixtures-r001.json` 的 tiny-normal/tiny-compare。案例均沿用 MVP-UI-10-TINY / MVP-UI-08-ADAPTER / MVP-UI-11-CANONICAL 的分支身份；不是新增主子案预算。包括 init 未到、同步/异步 SetContent、内容错误、资产错误、timeout/unmount/late、公共 channel 与字体/段落隔离，以及同实例激活后的 canonical 内容更新。

这些结果属于组件与协议层见证，不证明真实 TinyMCE skin/lang/插件资产加载、浏览器富文本净化、后端查询数据、保存重开或全部 49 种类型。真实运行与独立 Validation 另行记录。
