# C1 tooltip 修复候选 r001

记录时间：2026-10-27T06:35:35.861588+00:00。角色：C1V-001 有限修复 Builder；结论为候选实现与自检证据，非独立 Validation、非 MVP/Session 完成。

## 授权与范围

原始要求仍为完整筛选复制/粘贴交付，本报告仅处理独立报告 `reviews/SliceC1Validation-r001.md` 的 C1V-001/P2：prepared candidate 与 discard late 不得通过 shared tooltip/axis 路径影响 body、旧 hover 或 document listeners；active 同一实例恢复 hover；legacy 默认行为保留。C1V-002 已被独立 Reviewer 撤销，不修 S2 分页。

消费的修复卡为 `planning/s02-mvp-c1-tooltip-repair-r001-card.json`，canonical SHA `e007a44f64526892a621de8bcbe622a3f360d7e9040af887e4ecb707a7264103`；Context SHA `b62fbeb12ab744ec58ca21a17381343e8df0a00b2cde63032443564902cd5c50`，Topology r447。卡、十项 required-read 摘要与八条精确 admission 已复验。父代理明确放行 tooltip 生产写入后落地；八路径写域内完成。38 个 handler、wrapper、其他 runner、C2 原报告及初始化报告均未改写；无安装、构建、服务操作或 Git 发布。

## 全部发现与落地处理

1. 真实 bar/line draw 的 Carousel 构造会在 enable 判断前注册 shared listener，SFC 单独不注册或仅禁用 carousel 无法覆盖。现在 shared listener 始终注册，具体 callback 动态检查 phase/alive；candidate Carousel 在 cache、销毁已有实例、visibility/scroll 初始化前退出。构造入口先保存 chart/newChart，因此后续 start 检查同一动态 guard。
2. wrapper 原先默认挂 body。candidate 现在挂本 chart container 并隐藏，无容器则 detached；同一实例 active 首次 show 才经既有 switchHost 转移 body、恢复显示。show、mouseleave、hover 两级 RAF 与 carousel fit RAF 均检查动态存活，避免晚到外部变化；销毁仅清理自身 opt-in wrapper。
3. common_antv 的 axis label/title move 与旧 mouseenter/mouseleave 路径可创建/更改全局 tooltip。实际回调、立即 hide、200ms 延迟 hide 均检查同一 guard。
4. 新 `filter-paste-interaction.ts` 无 runtime imports，不新增 util/Store 循环边。无 guard 按 legacy 允许；function guard 仅严格 true 允许，抛错 fail closed。输入使用 object 并以 in/typeof 窄化，避免对旧 Chart 强行添加索引签名。首轮语义检查捕获 14 个 TS2559 新诊断后在该窄 helper 内修正，最终新增 0。
5. guard 仅附加 G2 prepared 的临时 deepCopy chart，使用可枚举 string/function 字段。当前 deepCopy 是 for-in，函数原引用保留；Symbol 或只绑原对象 WeakMap 不足。真实模块检查实际执行两次 deepCopy+spread，保留同一动态闭包；没有写入 canonical view、请求、持久 DTO 或 clipboard。active guard 绑定存活与 `binding.current.phase === active`，不绑定已结束 operation.isCurrent，避免提升后永远禁用。
6. 专用检查的 DOM 投影包含 dataset，已排定 hover RAF 在 discard 后修改位置就绪属性也能观测；旧 hover 初始两级 RAF 先排空，避免污染对比。没有用缺 helper、缺 VM navigator 或执行异常冒充 RED。

## RED/GREEN 与回归（实际执行）

| 命令（core/core-frontend） | 实测结果 | 证明上限 |
| --- | --- | --- |
| `node tests/filter-copy-mvp-tooltip/check.mjs --before` | exit 1；8 semantic failure、1 legacy pass、0 execution error | 冻结旧四文件字节上复现共同 tooltip/axis 越界；active 恢复为新增实现专属项，不计旧分母 |
| `node tests/filter-copy-mvp-tooltip/check.mjs` | exit 0；10/10；0 semantic/execution | 完整真实 shared 模块、真实 deepCopy，宿主设施替身 |
| `node tests/filter-copy-mvp-tooltip/check.mjs --types` | exit 0；84→84；added=[] | 四既有生产文件语义诊断多重集与新 helper；非全项目类型通过 |
| `node tests/filter-copy-mvp-renderers/check.mjs` | exit 0；24/24；0 semantic/execution/unhandled | 当前完整 SFC 组件回归 |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit 0；13/13 | C4 同事扩充后的当前 wrapper runner，真实 script mounted，子端口/Store 替身；本轮执行时包含 public proxy/undo-redo 项 |
| `node tests/filter-copy-mvp/check.mjs` | exit 0；14/14 | A 模块与 Vue/Editor 编译回归 |
| `node tests/filter-copy-mvp-api/check.mjs` | exit 0；9/9；0 assertion/execution | B 实际 API/decoder；网络 envelope 替身 |
| `node tests/filter-copy-mvp-maps/check.mjs` | exit 0；49/49；0 semantic/execution | 七地图 fixture 的组件检查条目，不是 49 个图表类型；不覆盖新独立 C2 时序发现 |
| 六路径 focused ESLint（五生产 + 新 check.mjs） | exit 0 | 定向 lint |
| G2 SFC stylelint | exit 0；只有已有规则 deprecated 警告 | 定向样式检查 |
| 本写域 `git diff --check` | exit 0 | 差异空白检查，不是行为验收 |

tooltip 十项身份：CANDIDATE-MOUNT、CANDIDATE-SHOW、AXIS-LABEL、AXIS-TITLE、DISCARD-LATE、CAROUSEL-ENABLED-CANDIDATE、LEGACY-HOVER-AXIS、DISCARD-PENDING-AXIS-TIMER、DISCARD-PENDING-HOVER-RAF、ACTIVE-SAME-INSTANCE-HOVER，均使用 `C1V001-` 前缀。旧版除 legacy 成功外八项语义失败；新版十项成功。before manifest 的四源码 SHA 已在 runner 读取时核验。

## 证据限制、同类残余与后续

加载完整真实 barUtil/common_antv/G2TooltipCarousel/utils/helper；DOM/G2 实例、布局、observer、timer/RAF 与不相关 provider 均为明确 doubles。本检查并未运行真实 bar/line class draw，也未观察真实浏览器 pointer/axis、G2/L7 SDK、后端查询/权限、save/reopen、mobile/lib 或完整 49 type。当前 guard 在 candidate 构造期间阻止 carousel 初始化；active 同实例 hover/axis 已测，自动 carousel 恢复仍依赖后续 ordinary active redraw，未将其称为完整 carousel 验收。

已检查的 tooltip 同类维度为 create/switch-host、show、mouseleave、axis label/title、timer/RAF、constructor/start/queue/hover/scroll resume、legacy 默认与 active 提升。Builder 自检未发现本有限范围剩余确定 blocker；这不替代独立第二轮 delta Validation。C2 独立 Validator 已另外报告 ready 后同 turn error 的 C2V-001，仍待其完整审查与父代理精确修复入口；本 tooltip 修复没有更改地图/ready bridge，也不以 maps49 绿覆盖该发现。

生产在 `2026-10-27T06:32:58Z` 通知父代理冻结；最终重启 7070 和真实 UI 由父代理统一执行，Builder 未自行操作。Vite retained lint 旧诊断的最终恢复由真实冷导航证据另行说明，不由当前 lint0推断。下一步：父代理真实 UI 与独立 C1 第二轮 delta Validation；修复后准入仅为可提交该有限候选审查，不提升完整 Goal/MVP 状态。

## 最终字节绑定

以下是本报告收尾时实际读取的 SHA-256（路径相对 core/core-frontend）：

| 路径 | SHA-256 |
| --- | --- |
| `src/views/chart/components/js/panel/charts/g2/bar/barUtil.ts` | `8f6ee3ea38be94aac8e748bb10a1b194988cd408cfa2bd8619593e8fa59a02ff` |
| `src/views/chart/components/js/panel/common/common_antv.ts` | `d1ae2347516af2cfb96667ce721c0394ab93d32ac20f8af745940d7d209da77d` |
| `src/views/chart/components/js/G2TooltipCarousel.ts` | `30fb136f75273d37f58c0bf5d75e0c954c1dc87922f17fd1e5e25baddcaf5cf5` |
| `src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `c806b8375062aa423ea9301721cf9a3445b2a845d704e026a67c07e51acf1805` |
| `src/views/chart/components/js/panel/common/filter-paste-interaction.ts` | `55759b665985a605322fbc17fd6350e0b0b38de9bee383819f13040887dd23d1` |
| `tests/filter-copy-mvp-tooltip/check.mjs` | `79545a2f255b07622c313b4237946a89bf0b87d08fa2522ef0b7a0375fbe7c65` |
| `tests/filter-copy-mvp-tooltip/README.md` | `6dd5fef443cadc47d9bfe809ef69bdcb3456ed5506e6dafdaf9a5dbb79dbbc9a` |

五生产字节冻结后未改；后续只补 runner 外部 DOM dataset 投影、README 与本报告。此报告不改写此前 C1 renderer、C2 maps 或 C2 initialization 的历史证据。
