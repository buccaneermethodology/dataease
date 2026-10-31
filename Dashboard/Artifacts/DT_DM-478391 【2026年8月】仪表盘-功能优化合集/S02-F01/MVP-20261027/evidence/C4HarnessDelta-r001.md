# C4 后当前 wrapper runner 增域证据 r001

记录时间：2026-10-27T06:17:33.309381+00:00。Builder 适配候选，不变更原 C1 as-of 独立结论。

## 授权与冻结基线

增域卡 canonical SHA `68dfe6ceccc1d06a9772b53cf80afa88f11542ecbd468c12be4b14c628b7b346`，Topology r443；card/ContextBootstrap 与两个逐 target admission 实际复验 exit 0。仅写当前 `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` 与本报告。root 已冻结 `c4-harness-before-r001/manifest.json`（SHA `f87e7b127274b9d9b2944b36f41ddf66968c8926b8d0710642e83b884835695a`）；没有回写 before、c1-final-snapshot、原 C1 报告或独立结论。

## 改动与保留

原 8 组的业务拒绝/原子发布、G2/S2/indicator、过时/身份/TTL/unmount、busy、public proxy、composable→emitter→wrapper、薄 SFC 父 error boundary 等目的保留。原“未接地图恢复 legacy”在 C4 已正式支持地图后改用真正仍不支持的 plugin 分支，继续覆盖不支持类型拒绝与旧路径兼容；没有把支持后的地图预期改成拒绝来制造绿测。

当前精确 provider double 补齐新增依赖，fixture 从 UiC234ConcreteFixtures-r001 的 view_assignments 点路径、element、response_data 建立；源目录取 Object.values(fields)，不拿响应选择字段伪作完整目录。生产 wrapper/composable/helper/emitter 与完整 SFC compileScript 执行，未复制其控制流。下层 prepared ready 与 API/Store 是明确替身；active public proxy 的 prepareFilterPaste 仅作能力检查，若误调用会抛错，候选端口另行提供 ready，library instance 与 public proxy 保持不同身份。

新增 5 组，当前总计 13 组（原 8 + C4 picture + C3 rich adapter + C2 map gate + canonical rebind + missing prepare gate）：

1. picture-off/on：冻结 OFF 0 query、0 fields/metadata；ON wire table-info/antv/1，response 恢复 picture-group/custom，准备后 fields/last/details 与一次 snapshot。
2. tiny-normal/tiny-compare：无 compare 1/custom、有 compare 保 77/all，完整 chartExtRequest；成功后才发独立 utils/eventBus 的 initCurFields，prepared 前无通知/共享写。
3. map-flow：active 基础设施门 false 在 capture/query 前拒绝且 0 query；true 才走 query 与 g2 metadata。SDK 为 double，不证明真实地图。
4. canonical 对象替换：成功采用后保持 key，立刻重绑新 view/element。修前真实断言 RED C4-CANONICAL-REFERENCE-REBIND；修后 GREEN。
5. 缺实际 public proxy.prepareFilterPaste：默认节点与采用后节点都前置拒绝，0新增 query/metadata/snapshot。新增回归先对无 guard 生产运行，真实 wrapper 发了 1 次 query，指纹 C4-MISSING-PREPARE-QUERIED、expected=0/actual=1、exit1；补最小 guard 后同例两阶段 GREEN。检查的是当前真实下层 proxy，非 handle.instance。

## 实际验证

`node tests/filter-copy-mvp-paste/check.mjs`：exit 0；13 组 PASS。最终摘要：

```json
{"passed":13,"actual_wrapper_script_mounted":true,"child_ports_and_stores_doubled":true,"real_query_or_library_ready":false,"independent_validation":false}
```

runner 与 wrapper 定向 ESLint exit0；wrapper stylelint exit0（既有规则弃用提示）；完整四 SFC script/template 编译无错；定向 diff --check exit0。图片 runner 4组、A runner 14组同时回归通过，证据层级见 SliceC4PictureAndDispatch-r001。

## 字节与结论上限

| 文件 | SHA-256 |
| --- | --- |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `31ca929484c2f0d835156198166f545466a52f414d86e555c1db1e082117e416` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiC234ConcreteFixtures-r001.json` | `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC1Integration-r001.md` | `bbd6ae4793d98b13ab198e1928c733fb26fc14fbfe451bffd24170dec44ff646` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C1HarnessAdaptation-r001.md` | `88ec3b2e6b05ab88ef33a54e4771e92fbfbd34cc0969ca573ddb07b4f8ff27d0` |

这是当前 C4 接线与回归 harness 证据，不是 C1 原报告重验收，不是地图/Tiny/图片真实 SDK 或浏览器 decode、后端/权限、保存重开与全49类型验收；不关闭原 Goal 或缩小原分母。后续独立验证必须读取当前源码与此 delta，并保留原报告的时点与 claim ceiling。
