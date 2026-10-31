# DEV 查询观测面实施证据 r001

记录时点：2026-10-27T07:31:51.271291+00:00。Builder实施候选，非独立Validation，未操作真实浏览器或后端，不声称物理网络请求计数、SQL oracle已匹配或MVP完成。原22项、49内建type、冻结Design/Cases和审查预算保持，Scope Delta: none。

## 准入与保全

Card canonical SHA：`6b7f948415ff8160a493e17d6738a0e3341d96c3971601ccf4e88c9a6dad5c39`；Topology r460；Context SHA：`ad2c050bda9d6e6380b31280fc6c349f0332782907812744d1711e0583ea7a2c`。写前实际复验card/context和7个精确target admissions均exit0，11项required-read原字节SHA全部匹配。首次修改前将5个现存写域文件原字节保全到dev-query-observation-before-r001，manifest SHA：`d7e602080af6e5666edc86c132b8085b3da20ae5fcc2fcdd1a0983a77593fc52`，写报告前逐snapshot重新计算一致。

实际仅改本卡的copy service、composable、wrapper、当前paste runner/README，另写已准入before和本文。未新增组件，未改冻结Design/Cases/fixture/旧C1/C4独立报告、API B、任何renderer SFC或地图/Tiny实现。无安装、构建、启动应用、DB、暂存或提交。原工作树中其它lane/用户修改保留，不归为本次成果。

## 实际行为

现有 `chart-filter-copy-diagnostic` 的只读JSON新增 `queryObservation`，没有新增用户操作/组件。仅在 `import.meta.env.DEV && VITE_FILTER_COPY_DEV_VALIDATION === 'true'` 采集与导出；production和flag=false时begin返回null、所有update/get不采集且diagnostic返回空串。

只保留最近一次attempt的一个内存记录：

| 字段 | 含义 |
| --- | --- |
| targetId / operationId | 当前paste尝试的目标与请求操作id；不是跨会话全局id |
| logicalGetDataCalls | 本次paste调用getData之前递增；明确**不是物理HTTP请求次数** |
| counterScope | 固定logical_getData_calls_not_physical_HTTP，避免把逻辑调用冒充网络次数 |
| queryPlan | not-dispatched / queried / static-picture |
| request | 仅id/type/render/tableId/customFilter五键的独立clone；不含user/token/proxy/chartExtRequest等上下文 |
| responseData | 成功API outcome.value.data的完整独立clone，不限为某几列/前几行，不导出整个response envelope |
| outcome / reason | pending/success/failure/cancelled与既有明确reason；失败保留已经发出的逻辑次数 |

composable在尝试开始记录取消/前置拒绝（0调用）；wrapper只在同target/opId且记录pending时复用该诊断token，保证外层request timeout也可settle同一记录。终态或其它target/opId不复用。最新attempt替换旧记录，旧token/迟到response/重复settle不能覆盖新记录或终态。

wrapper在现getData调用前记queried与次数，static分支只记plan、不增加次数、不伪造response.data。成功响应数据只为只读oracle观察而clone，准备/业务失败路径仍按原顺序、原Promise和原决策执行；resolve旁仅增加不抛错的观察settle，现有query、render、canonical/metadata发布和snapshot顺序未改变。

get只允许当前targetId匹配；composable诊断随view改变显示null，避免查看其它图表的旧数据。invalidateMvpFilterSession清记录和token，旧异步工作不能恢复记录。没有localStorage/sessionStorage/OS剪贴板/全局window数据出口；读取返回clone，传输/prepare/读出对象后续修改不污染内存观测。

投影、clone、诊断订阅分别在观察边界捕获；单个诊断订阅失败不影响其它订阅或业务。计数先于request投影，即使受控getter投影失败，已经发起的逻辑调用也不伪写成0。异常吞掉的范围仅诊断，不替代或吞掉getData/准备的业务结果。

## C4V-001文档同步

当前README原“八组/下层三个SFC”已更新：原C1八组+C4五组=13组（picture OFF/ON、rich normal/compare、map基础设施门、canonical重绑、缺prepare前置拒绝）；本次另加7组观测回归，当前总计20组。保留group不等于冻结完整AC/case的说明，明确renderer/API/Store doubles和真实浏览器/后端未验。原C4首轮报告保持其as-of SHA，不回写成已经审过本增量。

## 实际验证

命令工作目录为core/core-frontend，使用已有依赖。

| 检查 | 结果与上限 |
| --- | --- |
| node tests/filter-copy-mvp-paste/check.mjs | exit0，20组；原13组保留，新增7组见下；实际wrapper/composable/helper/emitter，API/renderer/Store明示double |
| node tests/filter-copy-mvp/check.mjs | exit0，14组；实际A回归，生产编译分支关闭不变 |
| 定向ESLint：3生产文件+paste runner | exit0，无自动fix |
| wrapper定向stylelint | exit0，仅既有3条deprecated rule提示 |
| 实际wrapper parse/compileScript/compileTemplate | exit0，无errors |
| 两helper+models/types声明的TypeScript Program | isolated_helpers_diagnostics=0，exit0；原tsconfig options，非全项前端类型通过 |
| 本次5路径git diff --check | exit0 |
| before manifest/snapshot重算 | 5项原字节一致 |

新增7组是：

1. 实际wrapper成功：逻辑调用1、pending→success、完整fields/data/extra/own undefined保留；请求严格五键，user/token sentinel不导出，别的target读null；修改transport/prepare/读出对象均不改记录。
2. 业务失败与network reject：次数仍1、最终reason分别paste_query_failed/paste_failed；responseData=null、共享业务写0。
3. 静态图片：static-picture、次数0、不造data、成功沿原兼容分支。
4. 实际composable取消/permission deny：次数0/not-dispatched、原reason与状态、当前target才显示。
5. 实际production/flag=false两个编译分支：begin/get null、投影getter不触发，diagnostic空串。
6. 最近attempt/会话清空：旧token不覆盖；pending同target/opId可复用；timeout终态能结清；终态/其它target不复用；invalidate后迟到不恢复。
7. 投影/订阅异常：不抛错、逻辑次数先记；真实wrapper仍成功且query1。

首次新增测试曾因隔离production host缺remove出现测试执行错误，补齐明确host.remove协议后所有检查通过；不将其称生产RED。本增量没有用缺新方法的旧版本制造可信RED；before仅是写前保全，20绿只证明当前实现的有界协议行为。

## 当前字节与delta

| 文件 | before SHA-256 | 当前SHA-256 |
| --- | --- | --- |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `ca144eb978ba334c9ba71fc4c6c5d6cefcb4c025ecac15ff2a446f54e8c8cc79` | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `e31befa9b1888db6b87f8a28f9eed3f1c7a17d13aa394c1bdfcfddb054e2ca9e` | `658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `7f5ce4037b3899b34b4546b53cf4f8278a09ec8fbd6501cd0b8202d42c07b5f1` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `31ca929484c2f0d835156198166f545466a52f414d86e555c1db1e082117e416` | `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a` |
| `core/core-frontend/tests/filter-copy-mvp-paste/README.md` | `a1e9e007b3841c3323a1c47c500a2f1c4c07fdbdabee995f38650e339f5aaf3a` | `0728c4ec0886094648a27b546d9be537d70ab0d5ebbf60b5348eea32c123e84c` |

## 未验与交接

真实UI诊断可见性、真实API响应与独立SQL/数据oracle比较由root执行并单独留证；本lane没有自行重演root已有UiC1FirstQuerySaveChain或新dataset/dashboard的结果。逻辑调用只覆盖当前paste attempt的这处getData，普通图表刷新、Axios重试、浏览器取消/重发等物理请求未计数，也不能以此证明物理HTTP=1。只保留最近一条，不是审计历史或跨会话持久记录。

全量TypeScript先前存在.vue.js/allowJs基线问题，本轮未改设置或删产物，不称全项类型通过。大响应的完整clone/JSON显示只在显式DEV诊断路径，真实大体量交互性能未测；没有以字段裁剪替代完整oracle数据。

生产最终freeze已经通知root，后续仅可由非作者审本次完整delta/最终字节并补真实UI；本文不晋升KB/Coverage、Session或Goal终态。
