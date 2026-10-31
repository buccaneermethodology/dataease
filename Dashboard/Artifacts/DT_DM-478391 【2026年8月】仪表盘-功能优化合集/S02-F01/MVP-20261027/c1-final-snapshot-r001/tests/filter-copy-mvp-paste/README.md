# C1 接线聚焦验证

在 `core/core-frontend` 执行：

```sh
node tests/filter-copy-mvp-paste/check.mjs
```

Runner 编译完整真实 wrapper SFC，并以真实 Vue custom renderer 挂载其实际 setup。实际 composable、A clipboard、C1 专用事件/helper 与薄 `FilterPasteRenderer.vue` 都来自生产文件。API、Store、路由/身份/权限 providers 和下层 renderer 端口为明确替身，不复制 wrapper 的准备/复核/发布控制流。

覆盖八组：own undefined/缺键比较；业务/网络失败保旧；G2/S2/indicator metadata 分支与一次查询；ready 前零写及同 key/canonical/public proxy 提升；配置改回/context/identity/new copy/TTL/unmount/普通刷新作废；busy 不发第二查询；采用后公有 proxy 更换和未接图库恢复原分派；实际 composable→专用 emitter→wrapper 的成功/失败/取消；真实薄 SFC 的父错误边界捕获子组件 render 抛错，拒绝其随后谎报的 ok，并清理迟到 handle。

同一 case group 可包含多个事件/renderer 分支；八组不等于冻结 Cases 的八个完整验收用例。这里没有真实后端、图库完成信号、浏览器 DOM、保存或重开证据。下层三个真实 SFC 的 draw/render/layout/DOM 完成与失败必须由 renderer lane 和真实浏览器另验。

`--baseline` 装载完整 wrapper SFC 后，用 TypeScript AST 提取旧 `calcData` 原执行体，配合精确依赖见证执行，显示在受控渲染失败前已经写入 lastRequest，指纹 `C1-OLD-ENTRY-PUBLISHES-BEFORE-READY`，预期 exit 1。首轮已在改 wrapper 前实际运行。它说明旧入口不能直接承担保旧式粘贴；不是完整冻结 MVP-UI 案例或真实后端故障 RED。C1 保留普通旧入口语义，新粘贴接独立准备入口，因此不将该旧入口观察伪装成同函数由 RED 转 GREEN。

完整前端类型检查仍有既有 `.vue.js` / allowJs 准入问题；本 runner 的 SFC 编译与辅助模块局部类型检查不能替代完整类型通过。没有安装依赖或执行全量构建。
