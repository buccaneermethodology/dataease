# G2 area 粘贴失败有界诊断设计 r003

## 目标与准入边界

本设计只处理已观察到的受支持 G2 `area` 图表粘贴失败。真实见证证明查询响应已返回、一次逻辑 `getData`、最终 `paste_render_failed`，并保留了原过滤树；目标 ID、图表类型和请求中的数据集身份也存在于见证，可用字段状态引用，不复制具体 ID。见证没有 chart result、dirty/snapshot、save/load 状态前像、renderer 阶段或异常类别；这些仍为 `not_observed`。浏览器 `readonly view` warning 无因果证据，继续作为独立观察。

Goal 保持 P1 12 + P2 原始 26 = 38 项全部验收义务，MVP 优先仅改变顺序；area 保留在受支持分母中。真实多用户权限、只读拒绝与撤权验收继续 `BLOCKED / NOT_RUN`，开发测试桩不代表真实权限。

## 只读冻结与实现准入

1. 本修订被审查接受后，Design/Cases 是只读冻结输入；Builder write scope 不得包含它们。任何修改另建修订、重新审查和重新绑定 Context。
2. `AREA-PASTE-REAL-001` 禁止注入故障制造 RED。用真实见证中的 captured request/response 驱动当前生产 Vue SFC strict prepare/render 路径；记录已到达的生产阶段/调用点、固定 `stage_code`、固定 `error_class_code` 或对应生产结果分支、paste result、query 次数及投影比较结果。SFC 装载/挂载和生产调用路径均须成功，setup/execution error=0。若不能安全观察阶段或无法复现见证语义，写 `NOT_REPRODUCED`/`BLOCKED_ORACLE`，继续只读取证，不做产品源码修改；不能拿同名合成失败充 RED。
3. Privacy-005 的诊断对象为 `null` 或严格封闭形状 `{ schema_version, stage_code, error_class_code }`，不得附加属性。schema 与枚举在 Cases r003 冻结。没有诊断时分支为 `NOT_APPLICABLE`；有诊断时必须启用唯一 canary、捕获所有可达 sink、精确校验 key/value 与 canary absence。
4. 将 canonical target state 与候选私有状态、运行计数分开。按 Cases 的 `TargetStateProjection` 在 query 前、响应返回/renderer 决策、user invalidation baseline 和 stale/dispose 之后比较；只把字段状态与脱敏差异写入 durable evidence，不落盘完整 Store、业务行或异常对象。
5. 只有可信同身份 RED 且审查、Context/Topology 摘要一致后，才允许针对 `ChartComponentG2Plot.vue` 签发精确 source-builder admission。根因指向写范围外时停止并重新界定，不静默扩写。
6. renderer ready 和原子采用只是 runner oracle；真实保存/离开/重开是隔离 UI 的独立证据。area 是否通过仍不等于其余 48 类型、P1 MVP 或 Goal 完成。

## TargetStateProjection 与历史证据

字段表、观察点与隐私约束见 `AreaPasteFailureCases-r003.json#/target_state_projection`。字段有 target ID/type、dataset identity、canonical tree、published result/data identity、dirty/snapshot revision、save/load marker 和 success feedback；值仅在 runner 内存比较。`RuntimeAreaPasteFailure-r001.json` 中 target ID/type/dataset identity 和 canonical tree 为 `observed_in_witness`，后者已报告 unchanged；稳定脱敏引用不含具体 ID。result、dirty/snapshot、save/load marker、success feedback 前像仍 `not_observed`，新 runner 不追认历史字段。

STALE 子案分开覆盖用户编辑、切换图表类型和卸载。用户编辑/切换路径先完成授权的 invalidation，再捕获 `invalidation_baseline`，之后释放迟到候选；candidate 不得回滚或污染这一新 baseline。卸载路径没有可发布目标，必须证明句柄已 dispose 且无迟到回调/事件或发布。

## 有界执行梯级

1. 只读追踪 `views/index.vue → FilterPasteRenderer.vue → ChartComponentG2Plot.vue → renderChart/renderG2 → area ChartView`，确定安全观测真实阶段的现有入口；不假定 `readonly view` 警告是根因。
2. 运行 runner 装载/只读探针。REAL-001 不注入 draw/render/afterRender 拒绝。若无法得到冻结的生产失败指纹，维持 `BLOCKED_ORACLE`，返回隔离真实 UI/G2 继续取证。
3. 取得可信 RED 后，为指定生产文件和专用 runner 建立精确 admission；最小修复不得改变 legacy 普通渲染、过滤树语义或保存合同。
4. 同 identity GREEN 并运行 query failure、renderer rejection（仅 ATOMIC-002）、各 stale 子案、状态投影、privacy canary、定向 lint 和受影响 runner suites。
5. 隔离开发 UI 独立观察 area query、ready、采用、保存、离开、重开；未执行字段维持 `NOT_RUN`。

## 声明上限

本设计不证明 area 已修复、真实 G2 SDK/浏览器、49 类型矩阵、P1 MVP、真实权限、保存重开或 S02 Goal 完成。完整 Goal 分母不因 MVP 顺序或本次 area 失败缩减。
