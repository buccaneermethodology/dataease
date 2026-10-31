# C1 tooltip 修复独立增量验证 r002

结论：**PASS_WITH_BOUNDS（有界通过）**。这是 C1 实现交付物第 2/3 轮，只关闭 C1V-001 的候选共享 tooltip / axis / Carousel 交互泄漏；C1V-002 原撤销决定保留。本报告不证明完整 C1、真实浏览器视觉、49 类型或 Goal 完成。

## 身份与证据

Validator `/root` 未编写本次 tooltip 五路径修复或专用 runner；root 既有 wrapper/控制面工作不在本独立通过结论内。Card canonical SHA `95c34da9bd2d1dcf4ccb8a37a5fcef3aad26e5db95939b89b518ee5f444d3fa2`，Topology r452。读取原独立首轮、冻结 before manifest、新报告、完整 runner/helper 和四个旧文件的完整增量，并扩读实际 shared hover/axis/Carousel constructor/start、SFC strict guard 注入链。原 before 与当前 G2 SFC 的差异仅本报告审读时点 `c806b8375062aa423ea9301721cf9a3445b2a845d704e026a67c07e51acf1805` 的 tooltip delta；随后 C2 局部修复必须另验，不作本报告字节范围。

## 实际独立重放

- `node tests/filter-copy-mvp-tooltip/check.mjs`：10 PASS、0 semantic fail、0 execution error，exit 0。
- 同 runner `--before`：8 指定语义 RED、legacy 1 PASS、0 execution error，exit 1。真实 before 输入摘要由 runner 重算；不是缺方法/编译错误的 RED。
- `node tests/filter-copy-mvp-renderers/check.mjs`：24 PASS、0 semantic/execution/unhandled，exit 0，日志实际 G2 source 为上述 c806 字节。
- 定向 ESLint：barUtil/common_antv/G2 SFC/rich SFC，exit 0（rich 仅为前端恢复排除编译干扰，不构成 C3 独立验收）。

完整真实 shared barUtil/common_antv/Carousel/utils.deepCopy 在 VM 中执行，使用明示 DOM/G2/layout/time doubles。guard 经真实 deepCopy 两次和 spread，未改写被测 listener 函数体。外部投影包括 body 根节点、旧 hover visibility/events、document pointercancel 及外部 DOM attrs/style/dataset。

## 查全结果与边界

未发现本次候选隔离修复的新增阻断。候选 wrapper 保留在本 container 且隐藏，show/axis/晚到 timer 与 RAF 动态检查；constructor 在 global cache/destroy/listener 初始化前退出；active 同一 instance 首次 hover 能迁回 body，legacy 没有 guard 时沿原行为。string/function 字段仅在 strict G2 临时 renderer chart 注入，canonical view/DTO/request/clipboard 不经过该注入点；helper 无运行依赖，未新增 util 初始化依赖。

同类残余：axis tooltip 在已激活之后的全面 DOM 回收、全部普通刷新与任意 SDK 隐式资源属于既有通用生命周期责任，本次仅证候选与 discard 后晚到不影响外部状态；不将之伪称全面资源清理通过。candidate constructor 提前退出意味着采用后本次不自动恢复 carousel cache/全局轮播；基本 hover/axis 仍可用，后续普通重绘沿 legacy，按当前设计的非关键交互降级边界接受。未通过真实鼠标/真实浏览器测量，因此字体、像素位置、真实 G2 SDK 全类型和 hover 性能未查；理由是此增量为 shared 模块验证，root 后续 UI 责任未删除。

修后准入预测：C1V-001 可以关闭；C2 第 1 轮独立 BLOCKED 的 C2V-001/002 必须在独立地图 delta 中闭合。允许继续真实 UI，不能据本报告关闭 22 必须项、49 类型分母或最终 Goal。

## 审读后的稳定字节

```json
{
  "src/views/chart/components/js/panel/charts/g2/bar/barUtil.ts": "8f6ee3ea38be94aac8e748bb10a1b194988cd408cfa2bd8619593e8fa59a02ff",
  "src/views/chart/components/js/panel/common/common_antv.ts": "d1ae2347516af2cfb96667ce721c0394ab93d32ac20f8af745940d7d209da77d",
  "src/views/chart/components/js/G2TooltipCarousel.ts": "30fb136f75273d37f58c0bf5d75e0c954c1dc87922f17fd1e5e25baddcaf5cf5",
  "src/views/chart/components/js/panel/common/filter-paste-interaction.ts": "55759b665985a605322fbc17fd6350e0b0b38de9bee383819f13040887dd23d1",
  "tests/filter-copy-mvp-tooltip/check.mjs": "79545a2f255b07622c313b4237946a89bf0b87d08fa2522ef0b7a0375fbe7c65",
  "tests/filter-copy-mvp-tooltip/README.md": "6dd5fef443cadc47d9bfe809ef69bdcb3456ed5506e6dafdaf9a5dbb79dbbc9a"
}
```

记录时点：2026-10-27T06:47:22.331894+00:00
