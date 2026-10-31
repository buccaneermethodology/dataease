# 图片资源准备第三轮独立验证

- reviewed_at：2026-10-29T06:54:04.118229+00:00。
- Session：DE-EXEC-S038；snapshot_id：S02-MVP-PICTURE-RESOURCE-READY-VALIDATION-r003；本交付物Validation第3/3轮。
- as_of_state：卡c4c07951d39e78ff2ca7cf51ce4523e4d69f77375ce71f8e25dbf58cd35cde36；SFC 077c69a92610691ab4d1bfb8b088b942a8c7d93d65a5cc46604df860f9901ea0；runner r005 6dde32152b3db01701aa35d3385ff53391def99230e13f1762a2b67a223cc7da。
- 总verdict：PASS（仅图片候选资源准备的局部代码与本地宿主测试准入）。代码有界正确性：PASS。覆盖充分性：PASS（冻结16case/37实例、明确替身边界）。真实UI/真实权限：NOT_RUN。

这里通过的是候选等待真实资源、最终load/decode与失败取消边界的局部交付。不会据此关闭38项Goal义务、49类型分母或宣布MVP/Goal/产品完成。正常浏览器120x80图像与文字、正常保存离开重开及真实身份权限仍需后续独立证据。本lane未修改源码、测试或冻结资产，只写报告。

## 输入、差异与独立执行

实际执行lane_task_card.py validate --expected-card-sha256，exit0/pass；逐项重算Goal及16个base_context_refs，17/17摘要一致。读取Freeze r005、Handoff r003、r004→r005完整差异、BDD执行入口更新并核Errata沿用正确AC-MVP-F01-06/08/12。SFC、resourceImageCache与resourceImages摘要均与前轮相同，复用前轮完整局部diff、静态检查、旧picture4组/paste20组/lint通过证据，不重复无关Goal审计。

| core/core-frontend执行命令 | 独立复跑结果 |
| --- | --- |
| node tests/filter-copy-mvp-picture/check-resource-ready-r005.mjs --baseline | exit1；18 PASS / 19 FAIL；37实例、16case ID；stderr为空 |
| node tests/filter-copy-mvp-picture/check-resource-ready-r005.mjs | exit0；37 PASS / 0 FAIL；37实例、16case ID；stderr为空 |

baseline业务指纹含PIC-RR-PENDING-PLACEHOLDER-READY、PIC-RR-FINAL-URL-NOT-RESOLVED、PIC-RR-INVALID-READY、PIC-RR-REBUILT-PLACEHOLDER-READY、PIC-RR-DECODE-GENERATION-REUSED。部分扩展schedule在旧SFC因缺helper不会到达指定位置，其PIC-RR-PHASE-SCHEDULE-MISSED仅为该schedule未成立的失败，不拿它当主要可信RED；占位过早ready、真实URL不等和失败资源ready等独立业务指纹已经成立。当前SFC相同输入及runner全部通过。没有import错误或未处理拒绝，r005可信RED/GREEN成立。

## 本轮问题逐项关闭

### R2-F1：关闭

完整差异仅在共用deferred工厂为原promise增加独立promise.catch(() => undefined)观察器，工厂返回的仍是原promise；没有把catch结果赋回，也没有把被测await转成成功。该观察器把可能未被旧SFC消费的deferred拒绝标记为已观察，同时实际生产candidate await仍收到相同reject并走原失败路径。

当前data decode reject及cache最终candidate decode reject仍实际执行并返回失败；cache finalDecodeFixture仍严格断言两次decode进入。baseline不再出现TEST_FINAL_DECODE未处理拒绝，两端stderr均为空。统一工厂覆盖所有图片decodeTask/finalDecode，修复同类未消费deferred问题；没有禁用Node异常检查或吞掉case断言。

### R2-N1：关闭

src attribute changes during decode现在仅变更src，明确assert complete=true和naturalWidth=120后完成deferred，候选仍拒绝。旧SFC该例从原先PASS变成业务FAIL，当前仍PASS；说明不再依靠同时设置无尺寸/未完成状态来替代src身份守卫。

## 前轮关闭项无回归

r005相对r004仅上述两处测试差异，原16case/37实例及共通oracle保持。当前全部通过：扫描前占位load；扫描前后成功/失败；门前最终load；src代际独立decode；非image/已失败cache；unmount/重复dispose；helper/decode期间stale；timeout/late与写入历史；无关root失败隔离；data/external/relative及error；empty/OFF；最终decode reject；clear before scan/barriers间重建/final decode；source/src变化、image/root断连和仍连接对象替换。

finish前监听/timer清理、零共享write/query、late src累计写入历史、候选取消不abort共享signal仍由共通oracle执行。统一performance/timer clock、9999/10000、timer未dispatch的deadline、跨资源阶段共享原10秒timer未变且通过。此轮没有发现新阻断、非阻断或待决问题。

Errata与BDD保留局部MVP-UI-10-PICTURE不等于Goal TTL AC10的解释，Goal及原范围未改；历史旧报告与旧runner继续保留，不重写前轮结论。首轮F1-F4、第二轮R2-F1/R2-N1均在当前有界包中关闭。

## 证据上限与后续

代码PASS依赖绑定的当前源码、前轮完整静态审查及本轮本地37实例。实际生产cache/helper核心执行，调度包装及测试访问口保持显式；DOM、网络、转换身份、FileReader、load/decode仍是替身，不能提升为浏览器和真实权限证据。

未检查：真实浏览器图片像素/文字及交互、正常保存离开重开、真实认证多用户权限、移动/嵌入与全49类型、最终KB/Dashboard/Goal closeout。原因是卡限定局部代码与宿主测试裁决，后续由对应运行与收尾lane负责。上述全部维持NOT_RUN/未完成，局部PASS不能替代。

同类残余：当前冻结图片候选范围未发现未关闭的同类缺口；不对其他renderer、共享cache架构或真实身份机制作无证据推广。准入预测：此局部包可进入计划中的真实UI验证，并由root绑定Session/最新Stop Gate；本报告本身不是Goal final-state receipt，也不授予停止未终止Loop的权限。3/3轮预算已用完，不自动另开第四轮同交付物评审。
