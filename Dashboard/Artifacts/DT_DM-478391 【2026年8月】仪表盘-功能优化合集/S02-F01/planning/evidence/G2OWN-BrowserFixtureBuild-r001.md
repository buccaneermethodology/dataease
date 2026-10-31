# G2 浏览器夹具构建报告 r001

## 交付与范围

已建立真实 AntV G2 普通 line + 生产 createG2RenderAttempt 浏览器夹具 candidate。仅新增 tests/g2-render-ownership/browser 内文件及本报告，未修改生产 helper、组件或其它 runner；未启动服务、后端、数据库，未安装依赖、提交或推送。

本页不是 DataEase line renderer、ChartComponentG2Plot 接线、过滤 Copy/Paste 界面 MVP、权限或完整 Goal 验收。10 Goal AC / 26 must-have / 16 产品义务保持，Scope Delta none；G2OWN-027 partial allocation 仍未被本单元关闭。实际浏览器交互尚未运行，须由主代理 CUA 验证。

## 准入复验

- 接收端 lane_task_card.py validate 返回 pass，canonical Card SHA-256 为 `10c9069a64b50e18a0a4cf24d7774b4ebbec325b549f371902f02dc197126c66`。
- Context Bootstrap 校验 exit0，11 份 required_read_set 材料逐字节 SHA-256 均 MATCH。目标/authority/claim ceiling/依赖按当前材料重新确认。
- 两个 execution_admission.py 校验均 exit0：G2-OWNERSHIP-BROWSER-FIXTURE-r001-0 精确对应 browser 目录，r001-1 精确对应本报告；action 均为 builder。
- 生产 helper 在本次收尾复算仍为 `d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`，与绑定输入相同。

## 行为与可观察面

main.ts 直接 import 真实 @antv/g2.Chart 及生产 createG2RenderAttempt。每次 attempt 独立记录 id/version/status、created/destroyed、cleanupErrors 和完整事件。Chart destroy 包装器增加计数后始终调用该实例原始 destroy；没有 mock Chart 或复制 helper 实现。

中文控件包括渲染 O、延迟渲染 N、释放 N、空数据、调整宽度、卸载、重复渲染 5 次。延迟 N 在真实 chart.render 完成后暂停于 afterRender；只有 helper 返回 ready 且身份仍有效才发布活动 scope。替换时释放旧 ready scope；待定 N 被新 generation 或卸载失效后，由释放按钮使其继续并观察真实 helper stale 清理。卸载后 O 可重新挂载夹具。

静态虚构双系列 line 使用 G2 原生 legendFilter 与 tooltip。resize 调用真实 changeSize(760/520, 340)，前后核对 scope/current/closed；无 ready scope 不调用库。DOM JSON 同时显示 activeId、累积与逐实例计数、canvas 数、slot 数、实际尺寸、待定 N 和 runtimeErrors。异步按钮、window.error 与 unhandledrejection 都有可见错误出口。

README 提供逐项操作与预期观测。释放按钮会释放所有待定 N gate，不承诺物理取消已进入 G2 的 Promise；未覆盖 assist、其它 G2 类型、产品 stage/Store 提交或返回前 partial allocation。

## 检查结果

工作目录为 core/core-frontend，原始 lint/build stdout、stderr、exitcode 与精确命令/起止时间保存于 browser/checks/。

| 检查 | 实际结果 |
| --- | --- |
| 定向 ESLint main.ts + vite.config.ts | exit0，无输出 |
| Vite build，输出到 /tmp/dataease-g2-ownership-browser-r001 | exit0，1720 modules；存在单 chunk 超 500 kB 提示（真实 G2 依赖），非构建失败 |
| 全部新增文件 no-index --check | 无空白问题 |
| 补充严格类型检查 | 未通过：安装的 TypeScript 不支持 moduleResolution bundler；改用 node 后，@types/d3-dispatch 的 const type parameter 语法产生 TS1139/TS1005 等解析错误。未升级依赖，未声称类型检查通过 |
| 真实浏览器 line/legend/tooltip/resize/stale/unmount | NOT_RUN，待主代理 CUA |

首次 ESLint 发现 3 处 prettier 换行，已在本次新文件局部修复后复验 exit0。构建与 lint 仅为 Builder 静态证据，不代替独立 Validation。

## 文件摘要与交接

- `tests/g2-render-ownership/browser/README.md`：`a44f55aa41bf6edee643250b8b85dfcdc68079455248c8367aba1511ae72fce8`。
- `tests/g2-render-ownership/browser/index.html`：`e119b7fef3c2574aff09e495fe16ca520ac2e3ff78868daa5db9fd1fd0718d67`。
- `tests/g2-render-ownership/browser/main.ts`：`40ff652af61ff9a41c339df12f13249589d188a2d0ed02392d5304ed4a894cfa`。
- `tests/g2-render-ownership/browser/vite.config.ts`：`61b756f290f82c43b06b1217f89d6b416954d9f5cc2ba5717bc24bd32b22b887`。

主代理可在 core/core-frontend 执行 `./node_modules/.bin/vite --config tests/g2-render-ownership/browser/vite.config.ts`，访问 `http://127.0.0.1:7093/`。host 为 127.0.0.1，port 7093，strictPort true。Builder 未执行该启动命令。

下一步按 README 用 CUA 检查原生图例筛选、tooltip、O/N ready 发布、迟到 stale、显式 empty、实际 changeSize、卸载与五次重复渲染，保留截图/DOM/错误及独立结论；本报告只交接可供检查的夹具 candidate。
