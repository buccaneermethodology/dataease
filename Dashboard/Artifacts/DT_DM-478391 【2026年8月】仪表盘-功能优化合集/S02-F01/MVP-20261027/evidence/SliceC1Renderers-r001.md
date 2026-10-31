# C1 renderer 实施证据 r001：真实 SFC 有界实现候选

**Builder candidate（实施候选），不是独立验收或 Goal 完成。** 本 lane 为 `/root/line_construction_builder`；A 的独立 Validation 已先写独立冻结报告，本次由 Reviewer 转入另一个 C1 Builder lane，不自称自己的 C1 交付已独立通过。原 A 报告只绑定 A 快照，没有将本轮 C1 回填为 A 已验。

## 入口、写域与身份

- Card canonical `16def03fea3f449b70a934c597513ee007364dc3483829a2d688fad77016db5c` 接收复验 pass；Context SHA `da1c6fa7659775dfe7b91b002062610683969e94ac9bbec08e2845f2461674f4`；19 项 required-read 开始时全部 SHA 匹配，Topology r434。
- 六条精确 admission（0–5）以 builder action、各自 target 逐条验证 exit0，绑定 Goal/合同/Context/独立设计 Review/Topology。写域只有三生产 SFC、专用 runner/README 与本文；未改 shared helper、wrapper、A 快照或冻结 Design/Cases/API B。
- 原 Scope Delta 仍按 `MvpScopeAuthority-20261027.json`：通用迟到响应与资源框架迁后；本轮只处理当前 paste candidate 本地结果的失败和存活检查，不重启旧通用工程。
- 未安装、启动服务、操作 root 浏览器/数据库、Git 暂存/提交/推送。root 另做的真实 UI 观察不作为本 Builder 自己运行。

## 最终变更

三个真实 SFC 增加可选 `pasteBinding` prop 与 `prepareFilterPaste(input,binding,isCurrent)`。setup 即读取 candidate phase；effective view/element 由共享 shallowRef 的 current 实时计算，后续 action/分页/尺寸交互不永久捕获 stageclone。返回 `key=props.suffixId`、同一 binding、显式 metadata 与库实例；真实组件 public proxy 不被实例替换。wrapper 的同步 setter/dirty/同 key 发布归另一 Builder。

- **G2**：仅 G2 库分支 opt-in strict，沿真实 300ms timer、串行 queue、drawChart、instance.render、afterRender 和必要 adapter 链传播失败。既有 owned line helper 与地图 legacy 保留；晚到已知实例在取得后复核并释放。prepare 本地 clone 消费 response.data，合法 null 规范化为空集合，原空态路径允许无实例成功；缺实例的非空路径失败。10s 有界等待，失败 dispose 幂等，不发布 Store。metadata 为 drillFilters、originData 与 publishOrigin 条件。
- **S2**：本地 normalize、totalItems/pageInfo/currentPageSize/actualChart，candidate setupPage 不写 Store。真实 draw 后在 render 前订阅当前 LAYOUT_AFTER_RENDER，必须同时等待实际 render Promise 与 layout，两种顺序均有效；零/断连节点、取消或无 layout 超时不 ready。dispose/unmount 取消 layout 等待，候选不启动滚动；metadata 为页信息、drillFilters 与 publishPure。沿用现有 mouseMove 资源入口，避免新增直接访问 protected facet.timer。
- **indicator**：本地 response.data/style、真实 Vue render/nextTick 后核对已连接非零 node 与 `.indicator-value` 实际文本，格式值/空态不符不 ready；同步错误或 flush/DOM 故障返回失败。自身 template 错误由另一 Builder 的薄 wrapper onErrorCaptured 与 isCurrent 一起约束；本模块还检查实际 DOM，不仅靠 callback。metadata 只有 drillFilters，instance=null。

所有 candidate action、分页/尺寸业务回调及 SFC 自己的业务写路径有 phase guard；prepare 不调用 calcData/getData，不写 Store、不发成功业务事件。无 binding 的原入口继续沿原 props/calcData。严格失败返回 `paste_render_failed`，不在组件层发送成功。

## RED 真实性与固定测试身份

最终同一个 runner 提供 `--baseline --before`：读取并核对 `c1-before-r001/manifest.json` 三原 SFC bytes，保持真实相对依赖解析。成功 compile/mount 真实完整旧 SFC 后，因旧版本无新 prepare 才调用旧真实 renderChart；draw/render/afterRender 精确故障是实际到达的 library-double 调用，不因缺新方法或编译失败而 RED。

旧 G2 三案 trace 分别实际到达 draw、draw→render、draw→render→afterRender，最后原 catch 吞掉并返回 undefined。旧 S2 render rejection 与 fulfilled 无 layout 两案实际 draw→render 后返回 undefined；另捕获原未消费 Promise rejection。五案均为明确语义失败，0 执行错误。最终 GREEN 复用相同五案与 fingerprint（通过 shared prepare 的真实 SFC 内部链），再补当前候选的边界案；未修改冻结 r002 合同、样本或旧快照。

## 运行结果与证据上限

- `node tests/filter-copy-mvp-renderers/check.mjs --baseline --before`：exit 1。
- `node tests/filter-copy-mvp-renderers/check.mjs`：exit 0。
- `node tests/filter-copy-mvp-renderers/check.mjs --types`：exit 0。
- `./node_modules/.bin/eslint src/views/chart/components/views/components/ChartComponentG2Plot.vue src/views/chart/components/views/components/ChartComponentS2.vue src/custom-component/indicator/DeIndicator.vue tests/filter-copy-mvp-renderers/check.mjs`：exit 0。
- `git diff --check -- src/views/chart/components/views/components/ChartComponentG2Plot.vue src/views/chart/components/views/components/ChartComponentS2.vue src/custom-component/indicator/DeIndicator.vue`：exit 0。

组件行为 **24/24 PASS，0 语义失败、0 执行错误、0 未处理拒绝**。G2 bar/owned line 三故障、晚到 draw；S2 两顺序、缺 layout 超时/拒绝/卸载；三正常与空态；indicator Vue 故障；drill metadata 与 general 页40；自定义 Vue host 同 node 提升和实际模块后续 canonical 重绘/名称更新均执行。候选 effects（query/Store/emitter）为零，active 后续重绘的绘制计数单独发生，未假装首次 paste 只有这些测试中的总 draw 数。

**Focused ESLint exit0**（三生产 SFC+runner，不带 --fix）；**git diff --check exit0**（三生产路径）。只针对本写域格式，不安装或全量构建。

**局部语义类型对照：冻结前30项、当前30项，新增0。** runner `--types` 使用真实 compiler-sfc、项目 tsconfig、TypeScript program 与全项目声明，只汇报三虚拟 SFC 的诊断 multiset（文件+code+message）差异，不把原有 IResponse/ChartObj/保护字段等诊断抹掉或声称类型全绿。allowJs 只作为此内存对照选项；未修改 tsconfig，不代替全项目 ts:check/构建。当前 shared 依赖被两次 program 同样消费，不宣称原始整个仓库回溯。

运行中修复的**harness诊断**另列，不当产品 RED：最初缺 Store pagerColor 导致 general 页展示失败；VM 空数组深比较因 realm 原型不同失败；初版测试 timeout700ms之前曾误设40ms早于原500ms防抖。已补实际所需 Store provider 属性、用长度/内容断言、维持 timeout 在防抖后。真实生产修复另列：S2 原 Promise.fulfilled 后立即检查 layout 的候选首稿改为双 Promise；新增 protected timer 访问复用既有方法；G2 null DTO 按原空态消费。

## 已检查无问题、残余与后续准入

已检查：三 SFC 完整真实编译/mount；prepare chain 与失败传播；本地候选派生/metadata 分支；同 binding 的 effective canonical 读取；phase guard 与候选 Store 零写；S2 页信息本地保留；G2 owned line helper仍实际参与测试；合法空态与 indicator 值6761/空横线；回调取消和已知实例 dispose；定向 lint/新增类型差异/whitespace。所有库方法由显式 stub 驱动，未替换被测 prepare/render 实现。

未验证：真实 AntV/S2 像素、真实浏览器布局、库内部所有 adapter/event；wrapper 的真实一次 query、所有业务 setter/dirty、覆盖确认、undo/redo/保存离开重开；生产认证、多用户/组织与拒绝权限；全部49类型/插件；地图、TinyMCE、picture分支。原因分别是本 lane 的 renderer 模块边界与 doubles，不是默认通过。root 或独立 Validation 继续相应链。

**显式非关键交互限制**：G2 候选 clone 关闭 carousel.enable，SFC 自己的 tooltip/轴标题 handler 在 candidate 不安装；同 key 提升不二次 render，这些非关键交互到后续普通 active 重绘恢复。库 draw 内 G2TooltipCarousel 构造仍可能先登记其实例级 tooltip:show listener（enable=false 阻止其全局 carousel 注册/启动）；本 harness 没有装载真实该库 constructor/event，不宣称完整共享 tooltip 隔离已动态验证。此边界已单独通知 root，独立 Validation 应继续核对。S2 候选不启动滚动，后续 active mouseLeave/resize/正常重绘走原启用入口；未新增激活重绘。

**修复/准入预测**：三个候选接口可继续与 wrapper 集成并做独立 Validation；24绿不能关闭 MVP-UI-08/10/11 全案、49分母或完整 S02。组件 module GREEN 只推进准备/失败信号的代码见证，不提升 Goal/TSP/Coverage lifecycle。

## 最终字节与完整测试摘要

生产路径以本表时点为准，后续其他 lane 修改需 delta 复验；本文不是最终 closeout receipt。报告时间：2026-10-27T05:33:12.221462+00:00

| 文件（相对 core/core-frontend） | SHA-256 |
| --- | --- |
| `src/views/chart/components/views/components/ChartComponentG2Plot.vue` | `f4d6b840018f429c3fc3cd94a5ec9df76e2a387c0085459d044ac56a29428549` |
| `src/views/chart/components/views/components/ChartComponentS2.vue` | `50d57d96d863d407e84a6516e958ce06cd8ef144899a05642a0a3343c41bb2f2` |
| `src/custom-component/indicator/DeIndicator.vue` | `9429ff118457c38616ceb801d9d89b2f70a034b72c948b9c155805e6db60150b` |
| `tests/filter-copy-mvp-renderers/check.mjs` | `7d00e3274b48c6629336c083bdb9029cd82bc2202ed89bf54f949f48ea59745f` |
| `tests/filter-copy-mvp-renderers/README.md` | `ce3dc4d7b2bdb0365d4e902cd8cf6514228be06e2fc41b34a466f2a67b0f9458` |

RED 最终摘要：

```json
{
  "pass": 0,
  "semantic_failures": 5,
  "execution_errors": 0,
  "unhandled": [
    "Error: fixture:render"
  ],
  "records": [
    {
      "id": "MVP-UI-10-G2-DRAW",
      "verdict": "SEMANTIC_FAIL",
      "message": "真实G2失败必须显式返回失败\n+ actual - expected\n\n+ undefined\n- false\n",
      "trace": [
        "draw",
        [
          "error",
          "renderG2Plot error",
          {}
        ]
      ]
    },
    {
      "id": "MVP-UI-10-G2-RENDER",
      "verdict": "SEMANTIC_FAIL",
      "message": "真实G2失败必须显式返回失败\n+ actual - expected\n\n+ undefined\n- false\n",
      "trace": [
        "draw",
        "render",
        [
          "error",
          "renderG2Plot error",
          {}
        ],
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-G2-AFTERRENDER",
      "verdict": "SEMANTIC_FAIL",
      "message": "真实G2失败必须显式返回失败\n+ actual - expected\n\n+ undefined\n- false\n",
      "trace": [
        "draw",
        "render",
        "afterRender",
        [
          "error",
          "renderG2Plot error",
          {}
        ],
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-S2-RENDER",
      "verdict": "SEMANTIC_FAIL",
      "message": "真实S2 render拒绝不得成为ready\n+ actual - expected\n\n+ undefined\n- false\n",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-S2-LAYOUT",
      "verdict": "SEMANTIC_FAIL",
      "message": "fulfilled但无layout不得ready\n+ actual - expected\n\n+ undefined\n- false\n",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    }
  ]
}
```

GREEN 最终摘要：

```json
{
  "pass": 24,
  "semantic_failures": 0,
  "execution_errors": 0,
  "unhandled": [],
  "records": [
    {
      "id": "MVP-UI-10-G2-DRAW",
      "verdict": "PASS",
      "trace": [
        "draw"
      ]
    },
    {
      "id": "MVP-UI-10-G2-RENDER",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-G2-AFTERRENDER",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "afterRender",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-S2-RENDER",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-S2-LAYOUT",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-G2-READY",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "afterRender",
        "destroy",
        "draw",
        "render",
        "afterRender",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-S2-READY",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy",
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-INDICATOR-READY",
      "verdict": "PASS",
      "trace": []
    },
    {
      "id": "MVP-UI-10-S2-layout-late",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-S2-render-late",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-G2-LINE-draw",
      "verdict": "PASS",
      "trace": [
        "draw"
      ]
    },
    {
      "id": "MVP-UI-10-G2-LINE-render",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-G2-LINE-afterRender",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "afterRender",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-G2-LINE-READY",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "afterRender",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-METADATA-g2-true",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "afterRender",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-METADATA-g2-false",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "afterRender",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-METADATA-s2-true",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-11-METADATA-s2-false",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-S2-UNMOUNT-WAIT",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-G2-LATE-DRAW",
      "verdict": "PASS",
      "trace": [
        "draw",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-10-INDICATOR-ERROR",
      "verdict": "PASS",
      "trace": []
    },
    {
      "id": "MVP-UI-08-DTO-g2-EMPTY",
      "verdict": "PASS",
      "trace": []
    },
    {
      "id": "MVP-UI-08-DTO-s2-EMPTY",
      "verdict": "PASS",
      "trace": [
        "draw",
        "render",
        "destroy"
      ]
    },
    {
      "id": "MVP-UI-08-DTO-indicator-EMPTY",
      "verdict": "PASS",
      "trace": []
    }
  ]
}
```

TYPE 摘要：

```json
{
  "scope": "真实compileScript+tsconfig+声明，仅三虚拟SFC语义诊断multiset对照，非全项目类型通过",
  "before": 30,
  "current": 30,
  "added": []
}
```
