# C1/C4 接线与 DEV 查询观测聚焦验证

在 `core/core-frontend` 执行：

```sh
node tests/filter-copy-mvp-paste/check.mjs
```

Runner 编译完整真实 wrapper SFC，并以真实 Vue custom renderer 挂载其实际 setup。实际 composable、A clipboard、C1 专用事件/helper 与薄 `FilterPasteRenderer.vue` 都来自生产文件。API、Store、路由/身份/权限 providers 和下层 renderer 端口为明确替身，不复制 wrapper 的准备/复核/发布控制流。

当前共 **20 组**：原 C1 八组保留业务/网络失败、G2/S2/indicator metadata、一次查询、同 key/canonical/public proxy、局部失效/busy、专用事件和薄组件父错误边界；C4 新增五组为 picture OFF/ON wire adapter、rich normal/compare adapter、地图基础设施前置门、canonical 对象替换重绑、默认/采用后节点缺 prepare 接口的零 query 拒绝。原未支持地图场景在正式支持后改用仍未支持的 plugin，保留旧分派兼容目的。上述 **13 组** 与 C4HarnessDelta-r001 的分组对应，原 C1/C4 冻结报告不回写。

另有 **7 组 DEV 观测回归**：成功时逻辑 getData 一次、完整 response.data 与 request 的独立 clone/当前 target 筛选；业务/网络失败保留已发次数；static-picture 零调用且不造响应；真实 composable 取消/前置拒绝零调用与诊断筛选；实际 production 或显式 flag=false 编译不采集/不导出；仅最近 attempt 可更新且会话 invalidation 清空；投影/订阅异常不改变业务成功或抛错。

DEV 观测只在 `import.meta.env.DEV && VITE_FILTER_COPY_DEV_VALIDATION === 'true'` 下采集，复用现有只读诊断区的 `queryObservation`。`logicalGetDataCalls` 是当前一次 paste attempt 的逻辑 API 调用数，**不是物理 HTTP 请求数**，不包括 Axios 重试或普通图表刷新。请求只投影 id/type/render/tableId/customFilter，不含 user/token/代理或 chartExtRequest；成功响应只完整 clone response.data，不导出完整 envelope/context。只保留最近一次内存记录，无 local/sessionStorage 或 OS clipboard，按当前 targetId 读取，会话失效清空。

同一组可含多个事件/renderer 分支，20 组不等于冻结 Cases 的 20 个完整验收用例。API/Store/renderer 端口为明确替身；runner 执行真实 wrapper/composable/helper，不把逻辑计数当物理网络观测。这里没有真实后端、图库 SDK 完成、浏览器 DOM、保存或重开证据。G2/S2/indicator、地图、TinyMCE 和图片实际就绪/失败由各自 renderer lane 与真实浏览器另验。

`--baseline` 装载完整 wrapper SFC 后，用 TypeScript AST 提取旧 `calcData` 原执行体，配合精确依赖见证执行，显示在受控渲染失败前已经写入 lastRequest，指纹 `C1-OLD-ENTRY-PUBLISHES-BEFORE-READY`，预期 exit 1。首轮已在改 wrapper 前实际运行。它说明旧入口不能直接承担保旧式粘贴；不是完整冻结 MVP-UI 案例或真实后端故障 RED。C1 保留普通旧入口语义，新粘贴接独立准备入口，因此不将该旧入口观察伪装成同函数由 RED 转 GREEN。

完整前端类型检查仍有既有 `.vue.js` / allowJs 准入问题；本 runner 的 SFC 编译与辅助模块局部类型检查不能替代完整类型通过。没有安装依赖或执行全量构建。
