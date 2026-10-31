# Slice A 实施与自检证据 r001

记录时间：2026-10-27 04:17 UTC。状态：真实生产入口与复制链已实施，Builder 聚焦自检通过；未作独立验收，不声明粘贴、49 类型运行或 Goal 完成。

## 准入与范围

消费 `planning/s02-mvp-ui-slice-a-builder-r001-card.json`，canonical SHA `cba4277d3cc6a851ff4bc1aa8e90e18aa6ed638652a99deaa5ae8599d0039013`；已复验 Card、Context 全部 25 个 required-read SHA，并对 admission-0 至 admission-10 分别执行项目 SP010 `execution_admission.py`，11/11 exit 0。原始新人类 authority、最新 Goal、独立 UiIntegrationDesignReview-r001 的 A 边界保持原样；未修改冻结 Design/Cases/fixture、Goal、旧 query/helper/G2 或其他 lane 的源码。

本次只写精确准入的十个源码/测试文件与本证据。locale 原有未提交改动保留，仅新增 `chart.filter_copy_mvp` 区域；未提交、推送、安装依赖、启动业务、改运行参数或写业务数据。

## 已落行为

真实 `Editor/index.vue` 原结果过滤区增加两个 ElButton：`chart-filter-copy` / `chart-filter-paste`，中文可访问名“复制过滤条件”/“粘贴过滤条件”；原过滤器入口与清空行为保留。DEV 即可见入口；显式 `VITE_FILTER_COPY_DEV_VALIDATION === 'true'` 才显示权限测试桩与只读诊断，默认 unknown；deny/unknown/未启 flag 均有具体禁用原因。实际 production 分支关闭入口及开发权限放行路径。

复制从当前 `customFilter` 直接 cloneDeep，不重走 FilterTree submit、不构造精简 leaf、不经 JSON roundtrip。支持原生 root/group AND/OR、enum/logic/静态日期，以及真实持久树中的 `field:null`、`valueType:null`、六 null 动态占位；保留缺失 timeValue、own undefined/null/缺键。未知扩展、动态条件、非法/空组整包拒绝，失败保留旧 clip。字段目录独立走已有 getFieldByDQ，按原始 tableId、fieldId/deType 校验完整目录；未加载、缺失、类型不符或能力未知拒绝。未写 49 类型 pair 白名单，未知插件未被永久排除。

同编辑页纯内存 service 保存 immutable tree、字段元数据与不透明 epoch/session/revision；不存 token/proxySecret 或结果数据。身份使用实际 user/cache 中 uid/oid/token/session time/proxy 只做内部比较。TTL 使用 performance.now，精确 `[0,1800000)`；操作不续期。切源/目标、普通刷新、Editor 因选空白/其他属性临时卸载均不清 clip。换资源、退出编辑、离开编辑路由、身份变化、user.clear/cache.clear 主动清空；同路由切新资源后仍能监听后续退出。局部目录请求代次、订阅与定时器按 Editor 卸载注销，会话级 detached watch 在真实编辑/路由退出时注销。目录请求晚到不采用。

Slice A **没有粘贴准备端**。粘贴始终明确 `preparation_unavailable`（或前置具体拒绝）；不发粘贴 query，不改目标树/dirty，不发成功信号。复制成功仅显示“过滤条件已复制”。

## 实际验证与限制

- `node tests/filter-copy-mvp/check.mjs`：exit 0，14/14 聚焦组通过。装载实际生产 service/composable、产品原生静态 operator options；消费冻结真实 DB 持久 fixture SHA `2832b27bb94e5d5435800ef390993b2781f97968d65fbe554f83acfca8ea9cbc`。验证完整两条件与子组/六店、own undefined/缺键/深克隆不可变、空源/空目标、动态/结构整拒与保旧、原始 ID/字段类型、三态权限、精确 TTL、身份/资源/编辑状态失效。
- 其中实际 Vue custom renderer mount 生产 composable，明确 cache/user/route/目录 API/能力为 provider doubles。覆盖目录等待及晚到、源→目标、临时卸载、同路由资源切换后退出、cache 失效、未知 plugin。额外以 DEV=false 编译真实 composable，即便 flag=true/allow 也关闭，目录请求 0。完整真实 Editor SFC 经 compiler-sfc script/template 编译无错误，入口与原 openTreeFilter 共存。该组不是浏览器 DOM、真实权限或真实 query/save 证据。
- 定向 `./node_modules/.bin/eslint` 检查八个本次源码（service/composable/Editor/user/cache/三 locale），不带 --fix：exit 0。只对新文件及 Editor 新增模板块格式化，未格式化 locale 或 Editor 的其他区域。
- 用当前 tsconfig 选项创建真实 TypeScript Program，仅 root 新 service：exit 0，`isolated_service_diagnostics=0`。这不等于完整前端类型检查。
- `npm run ts:check`：exit 2。TS6504 阻断于 `src/custom-component/rich-text/DeRichTextViewV3.vue.js`、`src/views/pages/menu/system/watermark/index.vue.js`、`src/views/watermark/index.vue.js` 被 `src/**/*` include 命中但 allowJs 未启；三文件不在 A 写范围，未改动。完整类型检查不能声明通过；未通过扩大 allowJs/删产物绕过问题。
- 本次已跟踪源码的定向 `git diff --check`：exit 0。完整改动/未跟踪新文件仍交独立 Validation 检查。

测试实际暴露并修复了两个局部边界：诊断时钟采样早于新 copy.createdAt 会短暂误报过期，改为每次 guard 读实时 monotonic clock；同一 Editor 切换资源后需保留编辑页身份监听，且离开路由后旧 Editor 定时器不得重建会话，新增 ownerPath fence 与真实 Vue 回归。没有重开冻结 Cases，也未把这些测试失败冒充被冻结的 UI RED。

独立浏览器 lane（root）另报首 UI GREEN 已落 `evidence/MVP-UI-01-green-r001.*`；本 Builder 未执行浏览器，不将其记作自身验证。冻结首 UI RED/其 DOM 补充仍原样保留。真实 flag/allow 复制、完整 payload own-key 捕获、真实权限、真实 query/预览/刷新/保存/重开、49 类型入口与 12 family 均不能由本证据推出。

## B/C 接口交接

`mvp-chart-filter-copy.ts` 导出：

- `MvpFilterTree`、`MvpField { id: string | number; deType: number }`、`MvpFilterTarget { tableId,fields,fieldsReady,tree }`、`MvpClipboard`、`MvpPermission`、`MvpFilterReason`。
- `getMvpFilterClipboard(now = performance.now())`：有效时返回 defensive clone + freeze 的 tree/tableId/完整字段元数据/createdAt/identityEpoch/editSessionId/revision，无效返回 null。
- `checkMvpFilterTarget(target, now?)`：同会话、TTL、原始 dataset/字段类型及完整树校验，返回具体 reason 或 null；空 target 合法。
- `getMvpFilterSessionToken()`：只暴露 identityEpoch/editSessionId/revision；`subscribeMvpFilterClipboard(listener)` 返回 unsubscribe。
- `copyMvpChartFilter`、`checkMvpFilterTree`、`checkMvpFilterPermission`、`syncMvpFilterSession`、`invalidateMvpFilterSession`、`describeMvpFilterTree`。

B/C 可读取该纯 service，不应提前 publish 未准备的结果；Editor/composable 的 paste 仍由后续精确准入接入 typed request/prepare。user/cache 对 service 的轻通知只新增清理，不改变认证模型。后续新 consumer 需在提交前重新校验会话、clip、目录、权限与目标配置，并由独立验收绑定真实调用和失败保旧。

## 本轮落盘源码摘要

| 路径 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/views/chart/components/editor/index.vue` | `0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee` |
| `core/core-frontend/src/store/modules/user.ts` | `f6df395cdaf628101440bc52df47c8ab952496244adcb6ccd263863e0737b159` |
| `core/core-frontend/src/utils/cacheUtil.ts` | `029bb9b5f10074dc1ca43c0e15126cbc2b4148552ca3329ebda7fb2eb67cb567` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `ca144eb978ba334c9ba71fc4c6c5d6cefcb4c025ecac15ff2a446f54e8c8cc79` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `f005f87da1281e75bf7d84dd92527be55765bf636a70a8393ef241449d504485` |
| `core/core-frontend/src/locales/zh-CN.ts` | `4e04d8672dac6f1758396c20cc4175387d1a6e4ca68e6c5fea7d61d6bcd45d30` |
| `core/core-frontend/src/locales/en.ts` | `3efcff97e0ba863c82bd4032757f6f5e2de1cf62ee214f5c4753b7d6ee723d80` |
| `core/core-frontend/src/locales/tw.ts` | `60b0203bb6883b33cee82c2d64371fdcc24329e959403b99bcdfbd86fd1db572` |
| `core/core-frontend/tests/filter-copy-mvp/check.mjs` | `1dbffdacf9cbf068da3b75ad972c57a1d9c65ab35732035c1e57457e9c24de89` |
| `core/core-frontend/tests/filter-copy-mvp/README.md` | `a5eace3863fae6538dd1f5228df3fe221709f9265127d91ec89e970b49f91b9e` |

## 冷启动国际化异常的后续只读核查

root 在启用 DEV flag 后报告旧主列表 tab 出现既有文案 key；Builder 按该报告读取真实依赖，确认 service 仅依赖 lodash-es 与无 import/useI18n 的纯静态 dataset/options.js，composable 也没有顶层翻译捕获。随后 root 从新的真实编辑 tab 冷开确认全部既有 Editor 文案、新按钮、权限测试桩与诊断中文正常，未复现新命名空间 key；旧 tab 的重载现象不能归因为 A，新冷编辑器的结果也不证明所有 HMR 路径无问题。本轮没有无依据修改国际化/全局布局。该段为 root 外部报告及 Builder 静态核查，未改写为 Builder 的浏览器运行证据。
