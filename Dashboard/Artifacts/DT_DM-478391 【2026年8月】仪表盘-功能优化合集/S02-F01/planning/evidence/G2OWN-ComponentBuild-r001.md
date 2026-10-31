# 普通 line 实际 SFC 生命周期接线实现候选 r001

## 交付与声明上限

已在实际 `ChartComponentG2Plot.vue` 接入生产 `createG2RenderAttempt`，精确 owned 条件为 `chart.type === 'line' && chartView.library === ChartLibraryType.G2`。相同冻结 C01–C06 **6/6 GREEN**、R013 补充 **8/8 GREEN**、0 assertion failures、0 execution errors、退出 0、stderr 空；既有 helper 冻结 23 例回归 **23/23 GREEN**。定向 ESLint、SFC 脚本/模板编译、生产 helper 实际 bundle、runner 语法与差异检查均成功。

这是普通 line **实际 SFC 生命周期接线 candidate**，独立 Validation **PENDING**。真实 G2 浏览器、tooltip/legend/resize 实际渲染、权限、Copy/Paste UI/MVP、stage/query/Store 原子提交、保存重开与完整 S02 Goal 均未由此证明。原 10 Goal AC、26 must-have、16 产品义务和完整完成谓词未删减，Scope Delta none；G2OWN-027 仍保留给后续完整 stage owner。

## 准入、R014 与可信 RED

本 lane 消费 `g2-ownership-component-build-r001` Card，canonical digest `3957f2531fb1c0ea2932e68f35d47084b2260fc39b0b382a921d01d4f0af6e71`；Context 与 source/runner/evidence 三个精确 action-target admission 均已复验退出 0，16 项 required-read 实际字节摘要全部匹配。绑定 Goal/Design r003/Cases r003/终审与独立 RED Validation，未重开第 4 轮设计。

写生产组件前，先仅在 helper VM context 增加共享 host `Error` 修正 R014，**不改 frozen case/oracle/测试控制流**。修后的 runner 反向去掉这一处 Error 注入，SHA-256 精确恢复为前版 `a56ba94ff722fea2b71b4e54e747fccfc727246bc4716d7ca8627c76e8ab5233`，证明没有把其它 oracle 改动混入该修正。实际 helper 的 `cleanupError(error instanceof Error)` 现在看见同一个 Error 构造器，host fixture 的 cleanup Error 不再因 VM realm 差异被包装。额外内存 probe 对真实 helper 验证 `dispose()[0] === originalHostError`，并确认手动 dispose 不触发重复通知；没有放宽产品错误身份或接受包装值来换 GREEN。

对原字节组件重新执行同一 runner，保存 `G2OWN-COMPONENT-RED-r002.*`，未覆盖 r001。r002 RED 的原组件摘要仍为 `e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5`，绑定已实现 helper `d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319`；6 executed、5 assertion failures、1 pass(C03)、0 execution errors，首 fingerprint 精确 `G2OWN-C01: HELPER_NOT_CONNECTED`，退出 1、stderr 空。RED 开始 `2026-10-27T00:50:12.398475+00:00`，结束 `2026-10-27T00:50:12.576952+00:00`。

## 实际代码改动

1. 新增 typed `activeG2Scope<G2Chart>` 与 scope/instance/version 身份检查。普通 line 全量尝试先释放旧 owner 或原 legacy 资源并清空活动指针；drawChart、公共 tooltip/主题/大数据/tiled legend/assist 配置、render、SVG 修正、afterRender、slider/pagination 仍按原顺序。四个实际 disposer 登记为 scope keys，carousel/container resize 作为 initial cleanups。所有实例操作绑定局部 scope.instance，ready 后再次确认版本，才一次发布 scope/myChart 并回放；stale/empty 不发布，ready 返回到发布间若已失效就手动 dispose。
2. 普通 line 只有明确 `Array.isArray(chart.data?.data) && length === 0` 返回 empty，并跳过 drawChart；其它输入仍调用原 renderer，意外 undefined 经真实 helper 报 `G2_RENDER_INSTANCE_MISSING`。没有把 missing/null/non-array 归一化为 []。
3. autoRefresh 捕获本轮 version/scope/instance。旧 callback 在触碰 assist disposer 前、旧 cleanup 完成后再次确认身份；await updateData 后再确认，失效就结束。只有成功且仍活动时回放。replace/remove 的错误由 helper 唯一通知通道输出；旧 owner 手动 dispose 的返回错误由组件观察，不重复通知。
4. Resize 排队捕获 owned owner 的 ready version/scope/instance，出队第一次 options/forceFit 前以及 await 后回放前均确认；full-render generation 已推进但新 owner 尚未 ready 时，旧 scope 的 resize 不会被重新绑定成新 generation。legacy resize 仍沿原 myChart 路径。共享 requestAnimationFrame 回放只在 owned 情况补充捕获身份 guard，旧 frame 不因同一实例指针暂留而越代回放。
5. owned→legacy 先释放 owned scope，避免 legacy 再次 destroy；legacy→owned 保持原资源释放顺序。离开 owned line 进入非 G2 dispatch 时使 pending owned generation 失效，清其调度并释放 active scope；**未改 L7 renderer 函数本体**。这避免 pending line 迟到结果覆盖已进入的 L7 指针。
6. 卸载先同步置 unmounted/递增 version，再取消 timer、完成 schedule、dequeue resize、dispose owner；每项组件清理异常被实际观察并允许后续项继续，两个 observers 在 finally 各自尝试 disconnect。pending 尝试 settle 后由真实 helper 清理可见实例，不物理取消已开始的库 Promise。
7. `G2RenderAttemptFailure` catch 保留主错误输出；cleanup 错误已经经本尝试唯一 callback 观察的，不重复打印。手动旧 scope.dispose 错误继续经单一 warn 输出，C05 核验恰一次可见。

`calcData`、L7 renderL7Plot/renderL7、原 G2 legacy 主执行分支与 HEAD **逐字节相同**；其摘要在 identity 的 unchanged_surfaces 中。所有普通 line 的新逻辑都位于精确 owned 分支及必要的 shared ownership 清理/调度保护，不重写其它 renderer，不改数据 chartData/drill/details/origin/chart-data-change 的原发布副作用。这些副作用仍不与完整 stage commit 原子同步，不能夸大为事务交付。

## 最终绑定身份

GREEN 原始证据运行开始 `2026-10-27T00:57:57.039162+00:00`，结束 `2026-10-27T00:57:57.221778+00:00`，均为实际 UTC 采集，没有用文件 mtime 估计。

| 对象 | SHA-256 |
| --- | --- |
| 生产组件最终 candidate | `f3bf70c99bf5bcf1ebbe56e5d1caa4bd94660927a1a1785f756859cd9317503c` |
| 组件 runner（仅 R014 改动） | `4cf0933a2a6fed90df9146c010e656237367c9e763b4424a19197626c19e7e53` |
| 本次绑定的实际 helper | `d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319` |
| 冻结 Cases r003 | `b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7` |
| C01–C06 canonical identity | `b12fff5f0142dab756ec8881f9b2e2dcdfe9fb36044f9553669955dafc811426` |
| SFC+只读 seam 编译产物 | `a60921e9b68d1b6317d2b54c8fa3b8ef43f7216f91d65fa963e9d8b995e37086` |
| 生产 SFC+真实 helper bundle | `a1c10b303e565e28d4e79bf9dbf0a7ebd563daa15a799edca87012b297872d1a` |
| GREEN stdout | `ffce35fe34ad5c18a1ac964dfcbcbca57d4dee8ec205405506b6a71213c0bddf` |
| GREEN 空 stderr | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| GREEN exitcode | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |

真实 helper 在 harness 中由当前源字节编译/实际 import，未 mock；生产 bundle 的 metafile inputs 明确包含实际 SFC 与实际 g2-render-attempt.ts。compiler-sfc 3.5.44、Vue 3.5.35、esbuild 0.25.12。当前安装版本差异保留记录，编译执行成功不推论其它入口/Profile 的产品构建通过。

## 同 identity GREEN 结果

命令在 `core/core-frontend` 运行：

```sh
node tests/g2-render-ownership/component-check.mjs --mode green
node tests/g2-render-ownership/check.mjs --mode green
./node_modules/.bin/eslint src/views/chart/components/views/components/ChartComponentG2Plot.vue
```

| Case | 最终实际观察 |
| --- | --- |
| C01 | create:N resolve 后 render pending 时 myChart=null、N_published=false、O destroy=1；afterRender 完成后 myChart=N、scope.instance=N，O 仍只 destroy 1。 |
| C02 | 旧 O callback 两次跨代调用：assist install=0、replay=0、N cleanup untouched=true；N 最终 ready。 |
| C03 | queued、forceFit pending 两子例：卸载后 options/forceFit 新调用/replay 各 0；O destroy=1，两个 observer disconnect=1；库 Promise 允许 settle。 |
| C04 | ready O 的 assist cleanup Error 可见，剩余 cleanups 执行、O destroy=1；pending N 子例 O/N destroy=1/1，无卸载后新发布；两子例 observers 各 1、timer cancelled、resize dequeued。 |
| C05 | cleanup-assist-O 恰一次可见，剩余 O cleanup 与 destroy 继续，O destroy=1，N ready=true；替换期间 observers disconnect=0。 |
| C06 | area、mix-dual-line、bidirectional-bar undefined legacy 均真实 draw=1、完成且无新 missing error。line [] draw=0、无发布/错误；line 非空+undefined draw=1，报精确 missing-instance、不发布。 |
| R013 8 项 | missing response.data、null、missing rows、null rows、object rows、0 rows、[]、非空数组均按冻结明确规则通过：仅 [] empty且无 draw；其它都调用 renderer，fixture undefined 返回必须报 missing-instance，无发布。 |

helper 既有 23 例同 identity GREEN、生产 source digest 与该表一致、0 assertion failures/0 execution errors；helper runner 保持原字节，组件 runner 仅 Error realm 修正。helper 测试 stdout(JSONL)、stderr、退出结果及命令摘要嵌入 GREEN identity 的 verification_runs，未覆盖旧 helper 证据。

`node --check`、`git diff --check` 均通过。定向 ESLint 初次发现三处新块排版，已只修这三处并重新检查成功；没有自动 lint --fix 或全文件格式化。SFC 以实际 compiler-sfc 编译 script/template，再用 esbuild bundle 真 helper，成功。未运行全量 ts:check 或整个产品 build；当前最小验证针对该组件实际编译/接线，未把 esbuild 的 TS 转译称作全仓类型检查。

## 额外边界验证与已知残余

使用 runner 已有 environment/实际源码编译函数在**内存追加**补充驱动，未持久修改 frozen runner/oracle，记录于 GREEN identity 的 additional_in_memory_checks：owned→legacy O destroy=1/scope clear；legacy→owned A destroy=1/P scope ready；三实例卸载无双 destroy；owned→L7 O 释放一次、L7 指针保持；pending owned→L7 N settle 后 destroy=1且不覆盖 L7。附带真实 helper 的共享 Error 原引用 probe 与手动 dispose 不重复通知，均通过。这些是补充 Builder 检查，不替代独立 Validation 或真实库行为。

Orchestrator 已报告独立 helper finding **HV-001：同 key nested replace 遗失 inner cleanup**，准备另派窄修。此 lane 没有修改 helper；本次冻结 GREEN 绑定修前 helper `d31e0069...`。该缺口不由组件绿测关闭。后续最终组件 Validator 必须对修后 helper **重新绑定摘要并重跑 C01–C06 + R013 8 项以及相关 helper 回归**，不能把本份修前绑定的 GREEN 冒充修后最终状态。上述判断来自 Orchestrator 已转交的独立 finding，本报告未自行扩写其合同或实施修复。

其它限制继续保留：G2OWN-027 renderer/installer 返回句柄前 partial allocation；同步 disposer 不承诺等待异步 cleanup；库内已开始的 forceFit 不承诺物理取消；R013 正式 API 实际 payload 分布 Unknown。没有安装依赖、启动产品/数据库、Git 暂存/提交/推送或公开 XPack 内容。

## 交接与后续准入

只写新 Card 允许的实际组件、R014 runner 修正、COMPONENT-RED-r002 四证据、COMPONENT-GREEN-r001 四证据与本报告；旧 r001 RED、原 frozen Design/Cases/Goal、helper 与 helper runner 未改。实际组件与 runner 已按上述摘要冻结，后续 helper 窄修可独立进行。

交给独立 Validator 检查真实完整差异、scope/instance/version guard、error return/notification 通道、ordinary line 边界、legacy/L7 兼容与修后 helper 最终绑定。Builder 当前不写 accepted/pass/done，不推动完整 Goal 生命周期；全 Goal 的持续执行与 Stop Gate 由 Orchestrator 维护。
