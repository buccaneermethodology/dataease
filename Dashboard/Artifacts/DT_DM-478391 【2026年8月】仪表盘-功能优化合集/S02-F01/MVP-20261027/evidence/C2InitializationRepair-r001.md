# C2 初始化依赖有限修复 r001

Builder候选；原C2报告冻结不改。本修复不提升地图/49type验收。

- Card canonical SHA `e481dac51223db7837ee597527b5de05354eccad0b707aa054ac507a9c5315e3`，Topology448；Context required-read与两target admission逐一复验pass。
- root真实冷数据源菜单导航于2026-10-27T06:05:49Z观察到bar.ts:61的 `ReferenceError: Cannot access G2ChartView before initialization`。这是root的真实浏览器观察，非本lane自行重演。
- 只读确认新增helper的唯一util.parseJson用途是customAttr.map.id；types/index对应type import会被擦除。util顶层还引入DEFAULT_TITLE_STYLE、API/axios/service/router等重依赖。已检查这些直接边；静态搜索未还原完整实际模块初始化闭环，不能宣称完整因果已证。
- 唯一生产修复：删除helper→图库util的新增value import，在原函数局部保留原parseJson的string/object语义，并保持preparedAreaId truthy时不求值customAttr的原短路（包括损坏JSON此时原本不解析）。字符串仍JSON.parse，非字符串原样读；无新catch或默认放行，不改mapStore、全局router、类初始化或tsconfig。

## 已执行

- `./node_modules/.bin/eslint src/views/chart/components/js/panel/charts/map/filter-paste-ready.ts`：exit0。
- `node tests/filter-copy-mvp-maps/check.mjs`：exit0。
- `node tests/filter-copy-mvp-renderers/check.mjs`：exit0。

C2当前49组件检查全部通过；C1 renderer24全部通过。仅模块/明确SDK-double回归；未代替真实冷路由复验，未跑安装或全量构建。

Root已收到helper写入/lint0消息，冷导航由root重演。证据上限：此单边删除与回归成立，实际运行问题是否消失等待root当前浏览器观察，未以lint绿代替运行恢复。

最终helper SHA-256：`71ee524fe26eba795c9d34ed70ea124b4132f198940b287fc2f77e99054b9dcb`

报告时点：2026-10-27T06:17:02.053351+00:00
