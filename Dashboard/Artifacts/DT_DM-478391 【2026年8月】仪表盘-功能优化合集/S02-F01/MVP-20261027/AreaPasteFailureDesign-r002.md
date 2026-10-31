# G2 area 粘贴失败有界诊断设计 r002

## 目标与准入边界

本设计只处理已观测到的受支持 G2 `area` 图表粘贴失败。真实见证记录：查询响应已返回、一次逻辑 `getData`、最终 `paste_render_failed`、原过滤树保持、该 area 配置未保存。见证没有 renderer 阶段、异常类别或结果/dirty/save 状态前像；这些字段明确为 `not_observed`，不得从当前代码推断或补写。`readonly view` 警告仍是无因果证据的独立观察。

Goal 仍为 P1 12 + P2 26 = 38 项全部验收义务，area 继续在受支持图表分母内。真实多用户权限及撤权验收维持 `BLOCKED / NOT_RUN`，开发测试桩不代表真实权限。

## 设计与准入原则

1. 本修订冻结后，Design/Cases 都是只读输入；任何变更必须创建新修订并独立评审，不能由 Builder 为变绿修改。
2. `AREA-PASTE-REAL-001` 不允许用注入故障制造 RED。使用捕获的请求/响应和当前生产 Vue SFC strict prepare/render 路径。执行前需完成 SFC 装载/挂载，检查实际生产阶段/调用点、allowlisted failure-stage 与异常类别（或生产返回分支）、最终 paste result、query count 和候选/目标状态。若无法从真实路径得到与见证相符的脱敏指纹，记录 `NOT_REPRODUCED` / `BLOCKED_ORACLE`，回真实隔离 UI/G2 取证；不准修改源文件或将同名合成失败称为 RED。
3. 区分 canonical target state 与候选私有状态/运行计数。按 Cases 中字段投影在 query 前、响应返回/renderer 拒绝及 stale/dispose 时点比较；只输出比较结果和 allowlisted 状态标记，不把整份业务数据或整个 Store dump 到证据。
4. 可信 RED 成立后，才可为该冻结身份签发精确 source-builder admission。若根因超出 `ChartComponentG2Plot.vue`，先停止并另行核对最小影响与准入。
5. 修复后复用同一冻结身份做 GREEN；故障注入只用于 ATOMIC-002，验证失败保旧。`readonly view` 仅在新的因果证据成立后加入范围。
6. renderer ready 与原子发布只属于 runner oracle；真实保存、离开、重开是独立隔离 UI 子步，不能由 READY-003 的 runner 置通过。
7. 隐私诊断用例若未实现诊断为 `NOT_APPLICABLE`；若实现，则必须运行唯一 canary 并捕获本实现可达的所有日志/事件/诊断 sink，验证只有静态 allowlist 键和值且无 canary 回流。

## 可执行观察投影

冻结的 `TargetStateProjection` 见 `AreaPasteFailureCases-r002.json`：target 身份与类型、dataset identity、canonical filter tree、已发布 chart result/data identity、dirty/snapshot revision、保存/最近加载标记、成功反馈计数。值在 runner 内存捕获并比较；业务行、完整 Store 和原始异常不写入持久证据。query 计数、准备阶段和候选私有状态单独观察，不能与 canonical 不变量混为一谈。

历史 area 见证只有“过滤树与原目标树相同”这一状态可观察。其余 projection 字段保持 `not_observed`。新 runner 在当前受控 setup 捕获完整 before/after，不能追认历史见证。

## 实施与验证顺序

1. 只读跟踪 `views/index.vue → FilterPasteRenderer.vue → ChartComponentG2Plot.vue → renderChart/renderG2 → area ChartView`，厘清实际错误阶段和安全观测办法；不将既有只读 warning 当根因。
2. 先运行只读探针/受控适配器装载检查。缺真实阶段证据时保持 `BLOCKED_ORACLE`。随后才运行冻结 REAL-001 同身份 RED，且不得注入 renderer 错误。
3. RED 满足全部指纹且 setup/execution error 为 0 后，为 `ChartComponentG2Plot.vue` 和专用 runner 生成精确 admission；最小修复不得改变 legacy 普通渲染、过滤树合同或保存合同。
4. 同身份 GREEN，执行 query failure、renderer rejection、stale/dispose、状态投影及 canary 回归，定向 ESLint 与相关 runner suites。
5. 在隔离开发 UI 另行观察 area query、ready、采用、保存、离开、重开；缺项逐一保留 `NOT_RUN`。

## 声明上限

本设计不证明 area 已修复、真实 G2 SDK/浏览器行为、其他 48 个内建类型、49 类型矩阵、P1 MVP、真实权限、保存重开或 S02 Goal 完成。Area 每个阶段仍属于完整 Goal 的验收义务；本设计只排序和隔离当前失败诊断。
