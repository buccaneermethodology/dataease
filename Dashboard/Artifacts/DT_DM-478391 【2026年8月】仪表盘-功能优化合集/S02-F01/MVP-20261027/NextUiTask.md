# 下一真实界面任务：DE-EXEC-S036

**Topic**：真实DataEase Editor的基本过滤复制/粘贴。  
**Scope**：新MVP同页面同编辑会话、全部SupportedCharts eligible类型共用customFilter入口、DEV显式权限测试桩。  
**Purpose**：交付能看到/点击的真实界面与query/保存路径，不能只交离线helper或另一个framework设计。

## 实际接点与最小写范围

- Editor `src/views/chart/components/editor/index.vue:1594-1601` 的changeFilterData/openTreeFilter、`:4288` FilterTree filter-data绑定、`:3381`附近原清空区：增加专用copy/paste，不借组件复制/改类型代替。
- `src/views/chart/components/editor/filter/FilterTree.vue:27-44,71-80` 的真实RowAuth submit/changeFilter/logic-items输出：复用产品序列化，不再造单叶或简化树；copy只读已确认customFilter，避免submit顺带dirty。
- 新 `src/custom-component/filter-copy-mvp/session.ts` 做纯内存快照/identity/TTL/clear；新 `useChartFilterCopyMvp.ts` 在Editor连接按钮/校验/确认/权限port/真实query/采用。位置可依既有模式调整，实际产品接点不可消失。
- `src/api/chart.ts:getData` 用candidate深clone走真实axios；不把SFC.calcData当prepare（它提前写data/Store/drill/events）。不启动旧通用candidate取消registry或29例双host框架。
- `views/chart/components/views/index.vue`及各实际renderer作为基本query结果准备/采用接点；只为当前实证缺口新增最小接口。query+必要预览都成功且target检查有效才改活动树；不能先改tree再query。
- 真实保存：`components/dashboard/DbToolbar.vue:271-319` / `components/data-visualization/DvToolbar.vue:193-234` → `utils/canvasUtils.ts:844..1001` → saveCanvas/updateCanvas。保留S01 capture/save，不另拼保存payload，不自动保存。
- `src/locales/zh-CN.ts/en.ts/tw.ts`补入口/进行中/拒绝/不匹配/成功/开发权限测试桩标签。其余源码只在明确缺口/精确admission下扩最小范围，保留已有dirty/S01修改。

## 直接实施切片

1. 先让真实Editor出现copy/paste、空源/无clipboard/进行中禁用和开发桩标记；按SupportedCharts实际承载能力统一接入，不写bar/line白名单。
2. 建议开关 `import.meta.env.DEV && import.meta.env.VITE_FILTER_COPY_MVP==='true'`。permission port对source-read/dataset-read/target-manage明示allow/deny/unknown，默认unknown拒绝。只有受控DEV fixture明确allow；不能从standalone/admin推断。非DEV/未开关不创建allow桩，真实query/save后端鉴权原样保留。
3. 从真实FilterTree配至少两条件及分组/运算符/值，copy深拷贝进当前editor内存；成功才替换旧clipboard。paste严格dataset ID/字段完整兼容、三态桩、TTL和target状态；unsupported整次提示拒绝，不裁叶子。
4. 非空目标先确认，取消不query不改state；空目标直接准备。候选真实query/基本预览独立准备，单目标禁重入，捕获operationId/targetId/目标编辑摘要，切目标/再编辑/卸载失效；ready且复验一致才采用tree/data/画面与一次dirty/snapshot/成功反馈，失败丢候选保旧。
5. performance.now单调elapsed，[0,1800000)有效；paste或图表data refresh不延寿不清除。reload内存自然消失；editor dispose清空；uid/oid变化清空并拒绝。真实logout/clearCache接纯session.clear前读实际调用方/防循环依赖，不扩成跨context身份框架。
6. 用真实UI走配置→复制→同dataset目标粘贴→实际结果→显式保存→离开→重开比较完整树和记录ID。首条路径只是见证，S037/S038对全部eligible source/target补齐；不能据bar-line首例称全类型完成。

## 基本失败确需渲染修复时

必须记录具体renderer/type、哪一步破坏旧tree/data/画面、最小局部prepare/可用性检查或临时候选预览接点、验证及降级“不采用并明确提示”。允许完成当前路径所必需的局部candidate host/adapter，但不能把旧通用29例stage/55例资源全包变回前置。失败降级不等于支持类型通过或移出分母。需要增量源码范围时root为具体触发绑定Card/Context/admission，同时继续独立UI工作。

## 验证、准入与交付

真实UI操作记录/截图、实际POST/query独立oracle、完整树、DEV allow/deny/unknown、覆盖取消、跨dataset/缺字段、query失败保旧、同目标禁重入/target失效、TTL/清空、真实保存离开重开；定向lint/类型检查区分基线。非Builder独立验证，不把离线/配置对象正确当浏览器验收，权限headers/桩不算真实权限。不要安装、启动业务库、改子模块、提交/推送或覆盖S01改动。

自然语言范围/实现授权已经核实，不再问同项授权或伪造token。控制面消费七文件独立Review、SupportedCharts和新native root后发精确admission，直接UI Builder。旧通用query/双host/资源safe收束迁S043/S044。

交付实际运行界面、已查无问题维度、所有发现、未完成支持类型及可追溯证据；S036并不等于22项全部完成。最终上限仅独立验收后的“权限测试桩下界面MVP”，原全量/真实权限/生产ready禁止提升。

## 已有输入直接复用

SupportedCharts现有静态49内置类型，47 palette可见、2隐藏，runtime验证0；按清单逐类覆盖，不把49/2401静态数字写成运行通过。已有人机可见样本在 `evidence/ExistingTwoConditionSample-r001.json/.png`：AND amount>200，子组OR shop枚举为果元店、南都店、香橙店、乐园店、红叶店、水围店。此样本serializationStatus只证UI，实施应由真实serializer/已有持久化取得精确payload再作golden，不能从AX反推。
