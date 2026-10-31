# 普通折线构造阶段全量 RED 候选证据 r001

本 lane 为独立 Builder，消费最终 runner-only Card `ecf41b7ea9c3e53d622694a787735f9be313d540a52ae6b88bc2ebe73262a84b`。Card、Context 及精确 admission-0/1 均退出 0；Context 的 14 项 required-read 原字节摘要全部匹配。冻结 manifest SHA-256 为 `3f44784c2607370c99a647e80eb7ae904f5cc7add8c28bb703d20ffbc1d2a216`，不修改冻结 Design/Cases/Review/Goal。

## 实际结果与声明上限

真实完整 Line、Carousel、line/common 三模块分别全量 TypeScript→内存 CJS，每例重新执行于全新 VM 与类静态状态；使用已装 lodash、具名 require/导出 allowlist、host Error、具体 DOM/Observer/timer/frame/scroll/background 注册表，未复制 drawChart/constructor/start/destroy/stop/clearTimer，未用万能 Proxy。唯一透明观察包装为 dequeueStart、restoreColumnSelectionAttributes、clearInteractionBackgrounds，均原 this/参数调用保存的真实函数一次。Cache 是原 Map 的精确 set/delete 观察与声明故障 seam。

全部 **55/55** 被调度并执行：**7 PASS（通过）、47 ASSERTION_FAILURE（实际合同断言失败）、1 CONTRACT_DISCREPANCY（冻结合同字段矛盾）、0 EXECUTION_ERROR（执行错误）**；退出码 **1**。stderr 为空。首例通过真实 Line.drawChart 到 setupOptions double 抛原 E，Chart 已取得，实际 destroy 次数 0；首 fingerprint 精确为 `LSC-001: chart_destroy_count expected=1 actual=0`。

`contract_structure_valid=true` 仅为结构自洽检查；因 LSC-046 保留的字段冲突，`contract_valid=false`、`red_rule_satisfied=false`、`formal_red_proven=false`。这是完整执行的 **RED 候选包**，等待独立 Validator；不能称整个55例可信RED或给予生产写入准入。

通过的7例为 LSC-002/003/004/028/029/030/031。其余实际违反项的完整断言、主错误原引用判定、warning顺序及每次occurrence、资源释放trace、初态与终态、具体数字handle/deadline、全局queue/cache、实际IO callback和clock轨迹均在 `report.json` 与逐行 `stdout.jsonl`，没有首失败停止。

## 合同冲突、真实缺陷与不可观察项

- **LSC-046 唯一合同冲突**：`arrange.tooltip_wrapper=W_old`、cleanup oracle为 `listener.remove:W_old:hoverLeave`；但 `startup_plan.owners_before_subject[C].tooltip_wrapper_target=W`。真实 fixture 按 arrange 创建 W_old，严格 startup 比对失败；未改 frozen 字节、未偷偷别名、未跳过断言。Case 单列 CONTRACT_DISCREPANCY，保留其余真实行为断言；由独立 Validator 裁定可独立准入的无歧义义务。Design 已 3/3，不由本 lane 开第4轮。
- **LSC-052 真实 target 身份缺陷**：生产旧 destroy 重新查询当前 W（非 W_old），所以声明在 W_old.remove 的 E_OLD 尚未触发；未强行把故障转移到 W。实际返回、旧/新资源与不匹配trace全部保留。未来修复 captured target 后该具名 seam 才可被真实路径到达。
- **partial this 私有初态 not_observed**：LSC-039/052 在 constructor 抛出/返回前无法由 JS new 拿到 this，且合同禁止包裹 constructor。已经用真实 acquisition registry核验独立 G/H/W/O 取得状态；052 O=null/未连接由真实无新 Observer 直接记录。未能读取的私有字段逐项列于 `observability-gaps.json`，没有将它们声称通过。合法 dequeueStart spy在实际 cleanup 到达时读取 this 的消费后状态；当前生产尚无 constructor rollback 时，该次 cleanup缺席如实为失败。
- LSC-050 是**真实 Carousel.removeEventListeners 的无 host TypeError**，为本例明确禁止的产品兼容行为，单独记断言失败；不把模块导入错误、未知 seam、编译错误或超时包装成RED。原异常文本和其余断言留在报告。

具名 timer/IO 的真实启动已核验：LSC-026真实IO+clock40取得S及新TQ；LSC-042/045在t40真实next/wait自然得到TN(handle2,due200)+TQ(handle3,due80)及首次column字段；area/pie仅新TQ(handle2,due80)。未写私有可见性、执行锁、首帧、queue或共享timer来追绿。只有合同显式synthetic cleanup stress在真实启动后经具体registry分配S/TI/TN/TH/F/B，再写其声明资源字段；不覆盖live资源。

## 身份与重放

- Runner SHA-256：`bddacb2df76dee7789a18260f65c1a0eca9f966401cd6a8551f6409233b9e7d8`。
- Cases raw SHA-256：`9e64b852fc50a3aeb9c4f4050d0a8a007fba3a9e8341af15a35e00bda0a7c50d`。
- Cases canonical SHA-256：`b18a08dc4bfc6c75462e5f0666e39c308aa8555083b0de493d4b120eeb75e97b`。
- 生产输入和逐模块编译字节 SHA 在 `bindings.json`/`report.json`；RED入口另逐项比对源保全manifest及源snapshot，全部保持baseline，未写生产、旧runner或冻结资产。
- 原始命令（在仓库根目录）：

```sh
node core/core-frontend/tests/line-stage-construction/check.mjs --manifest 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/LineStageConstructionFreeze-r001.json' --mode red --report 'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/evidence/LSC-RED-r001/report.json'
```

独立重放应选择新的report路径，保留本轮 `report.json`、stdout、stderr与exitcode原字节。`node --check`已通过；定向 `git diff --check -- core/core-frontend/tests/line-stage-construction`退出0。模块转换与具名registry测试不代表真实G2浏览器、整包TypeScript、应用、数据库或权限验收，本lane未执行这些入口。

原10项Goal AC / 26 must-have / 16产品义务、真实source READ/多用户拒绝/撤权/组织隔离BLOCKED/NOT_RUN、独立stage host/adopt-abort、query/Store原子提交、Copy/Paste/保存重开及旧r003全部残余保持。下一动作是独立RED Validation一次核验完整包与上述冲突/观测上限，再由控制面决定有界后续准入；本lane不能自报可信RED或生产READY。
