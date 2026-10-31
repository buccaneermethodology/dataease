# G2 返回实例所有权 helper 实现独立验证 r001

## 裁定与范围

**`FAIL_FOR_HELPER_IMPLEMENTATION / NEEDS_REPAIR`：当前实现有1项P2合同内缺陷，暂不接纳为完整helper实现通过。** 同身份生产GREEN独立重跑为23/23、0执行错误，定向ESLint与严格单文件TypeScript检查通过；但同key重入replace会覆盖并丢失已经登记的cleanup，真实生产模块探针已复现。现有23例没有覆盖该交错，GREEN不能替代代码层所有权审查。

本报告属于实际helper实现交付物第1/3轮；runner修复验证r001/r002与Design3/3是各自既有交付物，不因本实现发现重开设计。修复应沿现有“已登记cleanup须释放、key replacement先清旧项”合同完成，不修改Design/Cases/runner预期，不把未接组件、G2OWN-027或真实权限缺口倒置为helper阻塞。

本helper只管理create已返回实例与已登记的同步cleanup。普通line组件、真实G2浏览器、MVP复制粘贴、stage/query/Store原子性及真实权限均未由本报告验证；原10 Goal AC / 26 must-have / 16产品义务保留，权限仍 `BLOCKED / NOT_RUN`。

## 身份、输入及验证事实

独立Reviewer/source为`/root/g2_ownership_red_validator`，Builder为`/root/g2_ownership_red`。已先复验Validation Card canonical SHA-256 `a531931473e454ab1afac0b3d88ae8251f551efc11432d9185a4878e98555ea7`，结果pass；Context `280e6f9b80f0cec71543843c56389294b295442c23caf7ae2db399f3d04fc171`结构校验退出0，17项required-read实际摘要全部匹配。

复用已实际核验且摘要未变的AGENTS/SP-010、原始Goal/26项ledger、Scope Delta、覆盖矩阵与MVP-first authority、Design/Cases r003、设计独立终审、runner独立修复验收r002基线；本次全文审查真实生产source、当前runner、Builder source_patch、GREEN原始日志/identity、实现报告与两份source/evidence admission。新identity引用17项全部重算匹配，两个admission按各自builder action及精确target重跑通过。当前源码未读取Cases、case ID或expected，无新增依赖，无活动组件接线。

| 证据对象 | SHA-256 |
|---|---|
| 被审source | d31e006939b938594ea46d4258a4b87a43cd129cbe8732ae933f26a0a652f319 |
| 冻结runner | 0155a4e0e0a9dac40046c044b21410d4121b1177542604d48fb5e43a1d01d21f |
| Cases r002 | f4348c739094943db73872ebc974d9b5048186d627c5022df2fa9c33d5fd2bba |
| Cases r003 | b8844f51bed1f0574215210003ad1d59831c75635f9b0b6ed091baf3b78bbfe7 |
| helper case数组canonical | cc85113d5c8bd395cc8773f8361f3a5b83fcec1d5cbc93751705c2507d273e80 |
| 当前生产bundle | 8cb390066ccd4799afe07805efe890198bd13993bda8cd63e49be05359e14673 |
| GREEN stdout | 809af39df27a00732274fda8906ad33d8858122e360e336c8db2b781f5d94011 |
| 未改活动组件 | e9429bf59915e5a23d4f9d70987b126ca8b8329863be3208c625367e71f607e5 |

独立输出均写`/tmp/g2-ownership-helper-validator-r001/`，未覆盖原始RED/GREEN或Builder产物。

| 独立运行 | UTC开始 | UTC结束 | exit / stderr |
|---|---|---|---|
| `green` | `2026-10-27T00:49:38.533351+00:00` | `2026-10-27T00:49:38.567090+00:00` | 0 / 0字节 |
| `oracle` | `2026-10-27T00:49:38.567521+00:00` | `2026-10-27T00:49:38.594541+00:00` | 0 / 0字节 |


- GREEN：生产TS实际bundle/import，23个冻结identity全PASS、0 assertion failures、0 execution errors，exit0、stderr0字节；stdout与Builder原始GREEN逐字节相同。GREEN的`red_rule_satisfied=false`是正常模式结果，不能误读为执行失败。
- `--self-test-oracle`：17个负例拒绝、15个通道正向控制接受、双stub正控制PASS，exit0、stderr0字节；仅为oracle诊断，不是额外生产GREEN。
- 定向`eslint`及`tsc --noEmit --target es2022 --module esnext --moduleResolution node --strict --skipLibCheck --types node <helper.ts>`独立重跑均exit0，无输出；类型检查仅单文件，不代表全项目ts:check。
- 针对源码疑点运行唯一独立生产探针`reentrant-replace-probe.mjs`：1项缺陷复现、2项相邻重入控制正常；没有机械扩测试矩阵或修改冻结23例。

## 全部发现

### G2OWN-HV-001 / P2 / OPEN：同key重入replace会遗失已登记cleanup

**源码：** `core/core-frontend/src/views/chart/components/views/components/g2-render-attempt.ts:115–122`。外层replace先删除key并执行previous（116–118）；previous可同步重入`scope.replaceCleanup`并登记同key的新cleanup；返回外层后，121行不检查当前key是否已有新登记，直接`cleanups.set(key,cleanup)`，覆盖了重入登记，没有执行其cleanup。

**合同依据：** Design r003「接口和状态合同」要求key唯一、replace先运行旧cleanup再登记新cleanup、每个登记只执行一次；dispose释放全部已登记资源。此次inner已经通过公开replace方法成功登记，并非G2OWN-027所指“尚未返回/尚未登记”的资源，因此属于当前helper所有权合同内的泄漏。

**真实生产复现：** `/tmp/g2-ownership-helper-validator-r001/reentrant-replace-probe.mjs` 使用esbuild `write=false`直接bundle/import被审source。建立ready scope后执行：

```text
replaceCleanup('key', old)
old()内部调用 replaceCleanup('key', inner)
外部调用 replaceCleanup('key', outer)
dispose(); dispose()
实际事件 = old → outer → destroy
inner次数 = 0（已登记却既未被replacement清理，也未在dispose清理）
```

`inner`的登记返回空错误数组，不存在登记失败或调用者未观察异常；它被Map覆盖后已无释放入口。重复dispose也无法补救。若inner持有adapter监听器、timer或资源句柄，会泄漏。

**相邻控制与同根残余：** old回调内同key登记inner、外层为remove时，事件为`old → inner → destroy`，正常；old回调内dispose、外层replace时，事件为`old → destroy → outer`，关闭后outer立即清理，正常。当前代码已处理previous重入关闭scope，但遗漏“previous重入登记同key”。同根也影响old先登记inner再抛错的情况；应一次处理该分支的资源与错误出口，不另造一项finding。

**最小修复要求：** 仅在helper source内补齐同key重入登记的所有权移交；外层replacement不能无清理覆盖重入登记。保留旧cleanup先清理、新登记执行一次、关闭后立即清理、已有通知/返回错误对象引用与顺序、其它key清理顺序及destroy幂等。实现方式由Builder决定，不通过禁止现有公开API重入、吞掉登记或改变Design/Cases来规避。补一个独立回归探针（可作为补充验证，不改冻结23 case identity），证明inner被替换清理一次、outer在dispose清理一次、destroy一次；同时检查inner清理抛错仍可观察且不阻断outer登记/剩余释放。

**处置：** 实现包当前`NEEDS_REPAIR`。这不是runner已关闭的RV-001/RV-002复发，也不是新增设计义务。

## 当前合同完整审查矩阵

| 域 | 实际源码与独立证据 | 结论 |
|---|---|---|
| 每次尝试独立资源 | 66–71行Map/instance/closed/errors均局部；无全局当前实例；017 A/B隔离通过 | 已检查通过 |
| 阶段身份 | create前、create await后、setup后、render/afterRender await后均检查current；closed也使后续终止，139–169行 | 001–006/017通过，无新增问题 |
| 显式empty与无实例 | empty释放initial；undefined/无destroy对象拒绝missing-instance，140–152行 | 007/019通过；未把undefined折叠成empty |
| 逆序释放与destroy幂等 | 95–104行先closed、快照逆序、清Map、逐项捕错、destroy一次；二次dispose[] | 012/013/018通过；重入dispose控制正常 |
| remove重入 | 107–112行先删除，再调用；相同登记不会被重入remove再次执行 | 015及补充控制正常 |
| replace与closed登记 | 115–122行清旧、再判closed；关闭后新登记立即清理 | 014/016/022通过；同key嵌套登记漏项见HV-001 |
| 原业务异常身份 | Failure.originalError/cause保留原对象/非Error值；missing-instance使用明确code；173–180行清理后包装 | 008–011/021通过，未用cleanup覆盖主异常 |
| cleanup错误出口 | runCleanup保留Error引用；报告通知与结果分别复制数组；notify异常附加、不递归通知；ready后manual dispose只返回 | 013/018/020–023及17项oracle负例通过 |
| 自动stale/失败释放 | release统一dispose+通知，terminal与catch保留attemptErrors；ready前不返回scope | 已检查通过；不等于组件发布边界已实现 |
| no hardcoded cases | 实现无caseId/fixture/expected判断，生产入口被runner真实导入 | 已检查通过 |
| 授权、字节与角色 | 新source精确admission、未改runner/Case/Design/Goal/组件；独立Producer/Reviewer | 已检查引用与当前绑定；首次写入宿主强制执行仍不由自报证明 |

除HV-001外未发现当前helper合同内其它阻塞。未将任意恶意回调、异步disposer、库内物理取消或全部可能并发排列新增为强制合同；正常返回/失败清理、通知及既有可重入API均按当前规则审查。

## 未检查、继承残余与范围对账

- 未运行普通line的C01–C06真实SFC、G2浏览器、MVP复制粘贴/保存重开、query/Store原子提交及真实权限；这些不属于本helper验证卡，不据此阻断该helper修复。
- G2OWN-027仍开放：renderer/installer返回句柄前partial allocation不是本helper保证；本次发现的inner属于已经登记资源，二者不得混同。
- Design终审R013的line missing/null/non-array输入可达性仍归组件阶段；不在本次扩改Cases或要求重开Design第4轮。
- 原始RED-r001/r002、runner独立验证r002保留；当前23GREEN真实成立，但不能升级为所有权合同完整通过。修复后的source摘要会变化，依赖该helper旧摘要的组件/浏览器候选及最终验证应显式重绑定，不能用当前d31源码冻结记录掩盖后续变化。
- 稳定产品KB未改；本报告仅为Dashboard下执行证据。Goal10/26/16、MVP后续义务及权限`BLOCKED / NOT_RUN`均未关闭；本报告不是Goal closeout或最终Stop Gate凭证。

## 修复后准入预测

1. Orchestrator针对HV-001签发新的helper source窄修卡/Context/精确admission，由独立Builder修源码；本Validator不修。保持当前runner、Design/Cases与历史证据原字节。
2. 补充同key重入回归及错误出口控制，重跑冻结23GREEN、自测和必要定向检查，保存新source摘要与独立修复证据。
3. 以本报告为首轮基线做第2/3轮独立delta Validation；若HV-001关闭且没有新合同内回归，可给returned-instance helper有界通过，不再追加设计review轮次。组件/浏览器最终验证须消费修复后的实际helper摘要。

**当前不能声明helper完整实现通过；唯一阻塞是HV-001已登记资源丢失。23GREEN与工具诊断有效，完成源码窄修及独立delta后可重新判断有界接纳。**
