# 气泡与点几何候选事件补丁独立验证 r001

- reviewed_at：2026-10-29T13:11:46.814423+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`，非本补丁 Builder。
- snapshot_id：`S02-MVP-BUBBLE-READY-VALIDATION-r001`；as_of_state：两文件已实施、冻结 GREEN 已提供，真实修后 UI/query/保存重开仍待验证，未进入 Goal 收尾。
- 本交付物实现验证 **第1/3轮**，承接此前退出且未落报告的同一轮；没有增加轮次。设计审查已3/3，不重开。此前 C234/图片预算保持。
- 接收端及写前 canonical card SHA：`df1db0db444fb8d285451263484607c798c8637f1e23a4526a078489459951ce`，validate exit0/PASS。

## 裁决与任务含义

**最小实现合同验证：有界通过（PASS_FOR_BOUNDED_IMPLEMENTATION_WITH_FINDINGS）。新增补丁阻断：0。真实产品运行准入：可以继续既定隔离 UI 验证。MVP/Goal 验收：尚未通过，不能声明完成。**

本补丁解决三个具体 fixture 的候选准备缺陷：Dot 挂载前错误订阅 scene 代理 destroy，以及等待真实 SDK 不发出的 Dot 顶层 add。它把必要 mapRendered 回调移到 Dot.loaded，并在 addToScene 返回后检查候选有效性，拦住同步失败后继续安装交互或标签的路径。独立复跑支持这些局部行为；没有将受控 scene/layer/WebGL 或手工错误注入升级为真实浏览器、权限或全生命周期证据。

原始用户意图仍是“先完成界面 MVP，再补齐复杂场景，完整验收要求没有删减”。Goal ledger 与 phase crosswalk 独立计数均为 **38项（P1=12、P2=26）**，ID 集合一致；49个内置图表分母与插件 installed unknown 保留。本轮涉及 AC-MVP-F01-06/08/12 的准备层证据，不足以将这些完整 AC 标为完成，也不提高全部图表真实运行通过数。

## 证据读取与冻结核验

Read Manifest 原始摘要保存在 `/tmp/bubble-ready-validator-resumed/read-manifest.json`。本轮读取根 AGENTS、本地 SGE kernel/validation recipe、完整 lane card/prompt、Goal 全 ledger/阶段规则/声明规则、最新授权、TSP、38项 phase crosswalk、handoff、r003设计及r001/r002/r003审查、两写前快照/manifest、RED两版/GREEN/旧回归/checks/冻结patch、测试源码、SDK事件/加载/清理方法，以及 ready/SFC/labels 控制流；同时查看 Dashboard 四面相关执行投影。

- handoff全部12项ref与freeze全部15项input逐一重算一致；重复引用未被当独立来源。
- 新runner SHA：`eef39e7a7e8a72e3da189d24515b7a53af7906caef1ceafd5286686a4c6defdc`。旧runner SHA：`c2d4d18c37e328faa0611d7ea0dee90a6117fcab29dcb957e96048b67a01522b`；两者及fixture未改。
- 两写前快照 SHA 均匹配 manifest；按快照独立重建的统一diff与冻结 `BubbleReady-Implementation-r001.patch` **逐字节相同**。bubble-map.ts 只有一个候选事件/检查 hunk；point-fallback.ts 只有一个候选事件/回调时点/检查 hunk。
- 本结论绑定以上补丁delta；工作区原有大量其它改动不属于本次补丁，未据此声称完整 workspace diff/最终KB/Dashboard已验收。

## 实际运行与结果

原始stdout/stderr均存 `/tmp/bubble-ready-validator-resumed/`，未覆盖任何冻结证据。

| 独立运行 | 命令/范围 | 结果 |
|---|---|---|
| 当前新runner | frontend下 `node tests/filter-copy-mvp-maps/check-dot-loaded-r001.mjs` | exit0；57 PASS，0语义失败，0执行错误 |
| 冻结旧源RED重跑 | 同一新runner加 `--repair-before --repair-manifest=<bubble-ready-before-r001/manifest.json绝对路径>` | exit1；4 PASS，53语义失败，0执行错误；result与冻结RED-r002逐字段完全相等 |
| 原始旧runner | frontend下 `node tests/filter-copy-mvp-maps/check.mjs` | exit1；308 PASS，9语义失败，0执行错误；9项ID/轴与冻结输出一致 |
| 旧runner栈诊断副本 | `/tmp/legacy-stack-diagnostic.mjs`，仅固定root、在既有记录加stack，经node module eval运行 | 9项全部定位原check.mjs:819:57的 `assert.equal(d.addHadListeners,true)` |
| 旧runner后续断言诊断副本 | `/tmp/legacy-loaded-only-diagnostic.mjs`，仅把上述断言替换为当前确实存在loaded监听的断言；root按运行位置固定 | exit0；317 PASS，0失败/执行错误；不能把此诊断副本算冻结旧runner全绿 |
| 定向eslint | 两修改ts文件，无--fix | exit0，空输出 |
| diff空白检查 | `git diff --check --` 两修改文件 | exit0，空输出 |

RED不能只按断言message分类。51条运行失败虽然都带 `PRE_ATTACH_DESTROY_PROXY_ABORTED` 标签，实际trace中 **47条**含未挂载destroy代理异常，**4条**为两个point fixture的callback/sync-callback在更早mapRendered处抛错（trace只有getGeoJsonFile→callback→cleanup）；另2条为静态no-add合同失败。r002 fingerprint修正与实际trace相符。r001旧包装错误保留，没有将其混当可信最终分类。无add部分是**静态SDK合同证据**，未冒充旧源timeout运行复现。

新57项为3 fixture×17故障轴=51、其它四地图基础回归=4、两条静态合同=2。17轴为normal、sync-normal、callback、sync-callback、sync-error、sync-cancel、dot-error、scene-error、scene-destroy、timeout、unmount、late-loaded、duplicate-loaded、same-turn-error、microtask-error、metadata-error、dispose-replay。

## 已检查无问题的实现维度

1. **真实事件层级。** 安装l7plot为0.5.11。实际Map.on/off/once/proxyEventHander、Plot构造/attach/add/render/onSceneLoaded/onLayersLoaded、LayerGroup与EventEmitter参与新runner。options-only Dot没有scene；destroy由Map代理scene，error/loaded走自身emitter。补丁不再在挂载前调用errors(Dot)，没有手工给SDK.scene赋值。
2. **完成门槛。** loaded监听先于addToScene；实际Plot等所有LayerGroup层inited-all、initComponents完成后才发loaded。独立新runner证明view未loaded、最后一层未inited时均未成功；两条静态断言确认候选不等待顶层add。仍保留view pending，不能以同步Dot.loaded越过外层afterLoaded。
3. **同步失败闭合。** 三fixture各自sync-callback/sync-error/sync-cancel均拒绝；addToScene后的check退出后续keyboard/click等效果。point失败不会继续增加labels/fitBounds；bubble预先建立的labels不伪称“从未分配”，已有cleanup按原策略尝试释放。
4. **正常后续行为。** 同步与异步正常均成功，必要keyboard/click、point fitBounds与预期label文本仍出现；同步正常没有因新增check被误拒绝。没有移动legacy回调和carousel的执行位置。
5. **失败、迟到与采用前检查。** Dot局部error、受控scene error/destroy、超时、卸载、晚到/重复loaded均符合局部拒绝/单次回调规则；same-turn/microtask error不可被Promise成功掩盖。handle返回后metadata前error会令getter拒绝；SFC的await后check和metadata getter二次check未改。
6. **清理层次。** 新runner对已登记view和Dot句柄各自cleanup次数为1、重复dispose无新增cleanup、具名loaded/error监听解绑；EventEmitter真实off('*')只清通配符语义有probe。没有新增removeFromScene路线。该结果只证明本方已登记闭包的行为，不证明共享scene/GPU恰好释放一次。
7. **同类影响。** map-point/bubble-map-point共用point-fallback已纳入，bubble polygon另一路纳入；flow/heat/symbolic及map polygon基础回归通过。没有从七个fixture推出49类型、其它地理数据或插件通过。
8. **最小写域。** 补丁与冻结patch一致；公共ready、SFC、SDK、旧runner/fixture及legacy正常分支保持本轮前字节。候选专属if条件保留legacy原mapRendered时点，bubble原legacy add/carousel已知问题未被包装成修复。

## 全部发现及保留项

### V1-N01｜P2非阻断：旧runner仍含已过时的顶层add前提

位置check.mjs:427–428、819。三受影响fixture各normal/callback/scene-wait共9项失败，全部是同一addHadListeners断言；临时loaded-only诊断继续执行后317项通过，支持本补丁没有在这些旧受控路径后段新增其它失败。**原旧runner结果仍为308/9，不改写成通过。** 后续维护测试时应以真实SDK loaded合同更新活跃测试入口，保留已冻结历史；本lane不修测试，也不能以本诊断证明浏览器。

### V1-N02｜既有N3、P2保留：共享scene所有权和异常清理可见性未解决

view.destroy与dot.destroy仍可能调用同一个scene.destroy两次；ready.release仍逐项catch继续，清理失败未向外暴露。真实SDK Map.destroy的super.off('*')不是清空局部事件，实际清理由ready具名off负责。新测试的scene为double，不代表真实SceneService/GPU；构造未返回句柄、内部未发布layer、SDK方法体在候选关闭后仍继续分配资源均未证无泄漏。此项已由r003明确保留，不作为本最小事件修复新增阻断，完整生命周期要求仍未完成。

### V1-N03｜既有N4/N5、P2保留：自主错误传播和legacy事件时序仍未验/未修

scene-error/destroy是受控emit，不能证明真实SDK自主destroy一定通知观察者，或所有底层layer错误必然冒泡至Dot/scene。legacy bubble仍在addToScene后once('add')且后置注册loaded carousel，顶层add缺失与同步loaded遗漏均保留。候选修复不等于所有气泡地图路径修好；point legacy保持原行为，不将未改写成已验收。

### V1-N04｜P3执行证据维护项：投影和恢复身份需要后续吸收

绑定Topology-actual-r510的validator仍为先前`/root/picture_resource_validator`；本次实际报告source为`/root/bubble_ready_validator_resumed`。应由root按append-only生命周期/实际拓扑记录恢复执行，不能改写历史r510或把前一agent无报告算一轮。共享Dashboard及Goal AC-MVP-F01-12仍有历史“当前22项”文字，TSP/最新Goal阶段分母为38（P1 12/P2 26）；本报告按后者，不顺手修改这些投影。二者均不影响本次两文件控制流结论，但不允许据本报告声称最终治理对账完成。

### V1-N05｜P2证据边界：计时、布局与真实运行仍有明确缺口

runner把>=10000ms定时器缩为80ms，300ms以上其它等待缩为0；30秒ready与31秒外层不保持真实差值。mapRendered在实际生产仅添加CSS class，本测试以回调替身断言时点和抛错，不能证明GPU第一帧或长文本最终布局。正常source/target、独立CSV oracle、整树即时相等、显式保存离开重开、失败保留旧态仍需实际UI证据。

以上为本轮全部发现；没有在第一个失败或已知残余处早退，没有以预算或旧mock绿色忽略同类路径。

## 未检查与原因

- 未操作浏览器、查询/保存后端、真实地图SDK/WebGL、真实多用户权限、导出/分享/嵌入/移动端、完整49类型/插件。卡限定代码与受控测试验证；实际UI由后续专门工作完成，真实权限仍BLOCKED/NOT_RUN。
- 未运行全量ts:check/构建/Maven/安装；本补丁两ts局部事件改动已有定向eslint与真实源码装载运行，且全构建会触发其它副作用。本报告不声称全项目类型或构建通过。
- 未独立运行真实30/31秒墙钟竞争、SDK自主destroy通知、构造失败内存/GPU泄漏、清理异常恢复；现合同明确保留这些边界，没有用stub补成事实。
- 未完成Session/Goal closeout、最终KB/Dashboard绑定、post-closeout reconciliation或最终Stop Gate。本报告不是final-pass，不改变registry/覆盖状态；本项目没有Session registry/reconcile工具，不声称已校验。
- 仅读执行相关Dashboard投影；未对整个工作区历史改动作全面安全/产品验收。未修改产品、测试、依赖或共享台账。

## 准入预测及下一动作

无需为本两文件补丁新增修复轮，即可进入既定隔离环境真实UI验证。先对中国省份bubble目标200→500执行真实query/独立三省CSV oracle/完整树即时相等/画面/显式保存/离开重开；三点geometry fixture按已审合法数据验证，保留source与target角色及失败旧态证据。新实际失败应按具体触发和原合同评估，不能将本报告预判为成功。

root后续吸收恢复身份、测试模型处置和执行投影；不重开设计第4轮，也不把修复切片改名重置旧预算。原38义务、49内置类型、插件unknown、真实权限和最终验收要求均继续追踪。本轮推进的是“候选地图准备可进入真实运行的局部实现证据”，剩余产品与治理门槛不变。

## 独立运行文件摘要

所有以下文件位于 `/tmp/bubble-ready-validator-resumed/`；其中两个diagnostic脚本只在tmp执行，冻结runner未改。原始stdout/stderr供现场复查，报告中的命令、计数、trace与断言栈是持久结论；tmp不保证长期保存，不能替代后续最终证据归档。

| 文件 | SHA-256 |
|---|---|
| card-validation.txt | 8b6e6366ee24357618831b9fc3fa8f7911e6c9a9610e76eb31f77c764a1d057f |
| independent.patch | 3a3f80601b95db7e6750b64f0c35dc05502c3eca4e6e08bbcd8f4521c220ce47 |
| legacy-diagnostic.stderr.txt | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| legacy-diagnostic.stdout.json | d5875989d742cb9afac7546dfa9222e0f6eb2a87aaedd399d07eb7cb38fc6f61 |
| legacy-loaded-only-diagnostic.mjs | 3c1e933ef504970ab718273376c98f42930b11602459ab52983492d6de6e1953 |
| legacy-loaded-only.stderr.txt | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| legacy-loaded-only.stdout.json | 1734451abab06e457cac9acab19c536bcf9a99b1816ddcd86d4eddf9691bdd89 |
| legacy-stack-diagnostic.mjs | ac3e5688a18cbaaa4f99f176e1cf8541fe0e3f410fc7a36d27f431dad0f8d08d |
| legacy.stderr.txt | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| legacy.stdout.json | 2eaf19b417e55a988cb51129c872ade23df1e356b90ef40c731a5bbe52bc1b13 |
| new.stderr.txt | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| new.stdout.json | 07b683920e889f4627758165a83d4dfc38590db8020dbf34e469dcbe59f8bf4a |
| read-manifest.json | 257fd97a63d2f483d72f4a78ffcbd661c5b7db3577b050357df14c018f0107b1 |
| red.stderr.txt | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| red.stdout.json | 361ae9318720086f7116823390b1b5ade550d292c08a37ae7b8c5251f84bba70 |
| runs.json | 5ff04af315ab568cfc480326ba9d09d53bc710d3bf94f165578c7b20b09622c6 |
