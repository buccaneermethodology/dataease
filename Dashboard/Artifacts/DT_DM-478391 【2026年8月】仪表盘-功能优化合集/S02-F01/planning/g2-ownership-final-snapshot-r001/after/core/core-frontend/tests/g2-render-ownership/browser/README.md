# G2 所有权浏览器夹具

本页真实导入生产 `createG2RenderAttempt` 与已安装 `@antv/g2.Chart`，以静态虚构双系列普通 line 数据展示原生 legend、tooltip、changeSize 和 destroy。无后端、无新依赖。它只提供 helper + 真实 G2 的浏览器观察面，不代表 DataEase line renderer、ChartComponentG2Plot 接线、产品过滤 Copy/Paste 界面 MVP、权限或完整 Goal 验收。

在 `core/core-frontend` 执行（由主代理启动，本 Builder 不启动服务）：

```sh
./node_modules/.bin/vite --config tests/g2-render-ownership/browser/vite.config.ts
```

访问 `http://127.0.0.1:7093/`。配置限定本机 7093，strictPort 为 true，不回退到其他端口。

## 浏览器检查步骤

1. 点击“渲染 O”：等待 ready，观察 activeId、created=1、destroyed=0、一个 canvas。点击原生“系列甲 / 系列乙”图例，再悬停折线数据点观察 tooltip。
2. 点击“延迟渲染 N”：旧 ready scope 先 dispose；真实 N 完成 G2 render 后停在 afterRender，status=waiting:N，activeId=null。点击“释放 N”后才发布 ready。
3. 在 N 等待时点击“渲染 O”，待 O ready 再“释放 N”：N 应返回 stale 并只销毁自己的真实 Chart；O 仍为活动实例。
4. 点击“空数据”：helper create 返回显式 empty，不构造 Chart，旧活动实例释放，canvas 数归零。
5. ready 后点击“调整宽度”：真实 changeSize 在 760/520 间切换；应用调用前后检查 scope 身份。无活动 scope 时显示跳过提示。
6. ready 后点击“卸载”：scope dispose，canvas 数归零。N 待定时卸载，再释放 N，观察 stale、destroy 和不发布。卸载后点击“渲染 O”可重新挂载夹具。
7. 点击“重复渲染 5 次”：顺序执行五次真实渲染，最终仅一个活动 Chart。created/destroyed 为页面累计值；每个 attempt 独立记录事件、清理错误和销毁次数。

“释放 N”释放当前所有待定 afterRender gate，以便重复竞争可恢复；卸载不会伪造库内 Promise 物理取消。JSON 直接显示 DOM canvas 数及实际尺寸。destroy 包装器只增加计数，始终调用该 Chart 原始 destroy；窗口运行错误、Promise rejection 和异步按钮错误在页面可见。该夹具没有覆盖 helper 未返回资源之前的 partial allocation，也没有覆盖 assist、其他 G2 类型或产品 Store 提交。

## 有界静态检查

```sh
./node_modules/.bin/eslint tests/g2-render-ownership/browser/main.ts tests/g2-render-ownership/browser/vite.config.ts
./node_modules/.bin/vite build --config tests/g2-render-ownership/browser/vite.config.ts
```

构建输出固定为 `/tmp/dataease-g2-ownership-browser-r001`。构建/lint 不能代替真实浏览器交互或独立 Validation，实际浏览器行为由后续 CUA 检查并记录。
