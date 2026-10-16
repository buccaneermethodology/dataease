# S01 技术调查执行入口

归属：SP-005 / DE-EXEC-S025 / DE-KNOW-BI01。当前：doing（进行中），Goal已定稿并通过独立预审，S01调查尚未完成。

- [最终Goal](LoopGoal_Final_r001.md)
- [独立Goal预审](planning/GoalPreReview.md)、[处置](planning/GoalReviewDisposition.md)、[Final独立复核](planning/GoalFinalReview.md)
- [输入清单](planning/input-manifest.json)、[原用户意图](planning/raw-user-intent.md)
- [初步调查](InitialInvestigation.md)、[运行方案](RuntimeEvidencePlan.md)
- [循环进度](CycleLedger.md)

关键运行证据为完成必要条件；环境参考用户指定的Dashboard/debugging_env.md，具体环境及操作需确认。本入口不声明S01完成或后续实施READY；产品代码和原需求未改，未启动服务或执行产品测试。

## 最新检查点

- [F01–F04静态连接点](FunctionConnectionMap_F01-F04.md)、[F05–F08静态连接点](FunctionConnectionMap_F05-F08.md)：51条源码证据，尚无产品运行见证。
- [影响矩阵](TechnicalImpactMatrix.md)、[技术依赖](TechnicalDependencyLedger.md)、[验证映射候选](TestabilityMatrix-r002.json)。
- [A阶段结果](PreflightA-Result.md)：应用用户只读连接和Redis PING成功，无产品启动/业务写入。
- [B阶段方案](RuntimeEvidencePlan-B.md)：B1离线构建待确认；B2未授权。
- 最新续跑判断见[检查点回执](stop-gate/receipt-003.json)，不是Goal完成回执。

## B1最新结果

[B1已执行但失败](B1-Result.md)：离线缺Spring Boot父POM 3.5.15，未进入编译；不再等待B1批准。需要批准联网依赖恢复或提供现有离线缓存。产品服务未启动。最新待决状态见[回执004](stop-gate/receipt-004.json)。

## 联网恢复执行中

用户已明确授权联网下载当前声明依赖，B1-online 准入通过，原命令移除 -o 后正在执行。旧回执004等待联网授权的条件已解除；当前续跑见[回执006](stop-gate/receipt-006.json)。[映射r003](TestabilityMatrix-r003.json)补9项具体绑定，尚非运行验证。

## 当前结果

[联网构建结果和SDK恢复方案](B1-online-Result.md)：依赖解析失败，待确认本地SDK构建安装；此前联网授权已执行，不再待决。当前回执007，不是完成回执。

## 构建恢复完成

[SDK与后端构建证据](B1-Build-Verified.md)：均成功，测试跳过，未启动产品。[B2a启动方案](RuntimeEvidencePlan-B2-startup.md)待明确启动写入例外。此前联网与SDK安装授权均已执行，旧待决状态不再适用。

## 最新静态调查

[F05](F05-static-followup.md)、[F06](F06-static-followup.md)、[F08](F08-static-followup.md)补充局部源码事实；[映射r007](TestabilityMatrix-r007.json)共39项部分绑定，132项待具体绑定，全部运行NOT_RUN。当前B2a待决见[回执012](stop-gate/receipt-012.json)。

## 当前证据索引（取代上文历史状态）

- [构建基线r002](BuildTestBaseline-r002.md)：SDK及后端成功，测试跳过。
- [70条源码证据](ClaimsLedger-r002.json)：摘要复核一致，静态候选。
- [验证映射r010](TestabilityMatrix-r010.json)：76条部分绑定，95条仍需具体入口或缺口处置。
- [19组fixture追溯](FixtureTraceLedger.json)、[14项依赖追溯](TechnicalDependencyLedger-r002.json)。
- [10条关键运行台账](RuntimeEvidenceLedger.json)：全部NOT_RUN；B2a待授权，后续合成对象/设备条件尚缺。

## 进入资料与显式缺口

[S02–S09候选进入包](S02-S09_EntryPacket.md)八片当前BLOCKED；[映射r011](TestabilityMatrix-r011.json)与[95项缺口台账](ACGapLedger.json)保留原分母和未解决状态。缺关键运行与独立审查，Goal未完成。

## B2a启动检查点（2026-10-15T10:19:00.604596+00:00）

B2a已批准并执行成功，HTTP 200后停止本轮进程。详见B2a-Startup-Result.md。此前“B2a待批准”已过时；下一步RuntimeEvidencePlan-B2b-ui.md，产品运行见证与最终独立审查仍缺。

## B2b入口检查（2026-10-15T10:29:06.075417+00:00）

B2b已批准，前后端成功启动并到达登录页；未登录、未执行示例交互。已停止本轮进程。详见B2b-UI-Result.md；下一步补齐测试身份后沿用B2b授权继续。

## B2b登录及交互（2026-10-15T10:39:45.642720+00:00）

测试身份已指定且成功登录；4条运行场景取得部分UI见证，6条仍NOT_RUN，无完整场景PASS。见B2b-UI-Result-r002.md。下一步B2c合成数据方案待批准，真实权限实例与移动设备仍缺。
