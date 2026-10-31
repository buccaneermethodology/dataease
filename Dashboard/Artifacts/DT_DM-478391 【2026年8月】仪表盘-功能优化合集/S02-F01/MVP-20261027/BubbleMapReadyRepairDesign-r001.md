# 气泡地图候选完成事件修复设计 r001

本交付物是2026-10-29真实UI首次发现的具体实现/测试缺陷修复，第1/3轮；不重开C234已耗尽的设计。38义务、49类型与权限边界不变。

## 触发和已观察
中国省份province/amount合法图表正常绘制；>200目标粘贴>500后一次逻辑query返回1982/1243/1868，最终paste_render_failed，旧树仍200。冻结证据BubbleMapFailureSnapshot-r001.json。不是已证RED根因。

## 候选根因与实现
bubble-map.ts候选先wait Dot add再wait loaded。安装的@antv/l7plot 2.1系列源码Plot.addToScene→attachToScene→initSource→render→onSceneLoaded→LayerGroup inited-all→onLayersLoaded只emit loaded，没有Dot add；旧double人为发add+loaded掩盖问题。审查必须核实际package entry/version和esm/lib实现，不依此文字假定。
最小改动：候选去除等待不存在的Dot add，把必要mapRendered(container)放到Dot loaded的wait callback中；依然在addToScene之前注册error/destroy/loaded，等待真实全部layers初始化与必要callback完成。保留30秒、isCurrent、取消/卸载清理；legacy不在本修复范围。

## 测试与边界
新增独立修复测试文件，不改冻结旧check.mjs及旧49/99输出。新runner消费真实完整SFC和真实五地图类，通过当前组件runner的受控模块入口，Dot仅发真实loaded、不发add。记录/校验安装包源码契约与摘要，避免单纯新mock宣称真实SDK。至少覆盖：正常无add loaded成功；loaded前pending；loaded前注销/取消失败；超时后loaded失败无副作用；error/destroy失败；同步loaded（监听先于addToScene）；mapRendered回调抛错失败。旧source同test identity先RED（仅bubble polygon预期timeout，不能缺依赖/compile算RED），修后同文件GREEN，其他地图回归。必要时拷贝旧runner到新版本并只修Dot事件模型和追加上述case，保持fixture身份。
真实UI复测同中国省份200→500，query一次/CSV/树/画面/显式save/reopen；双向来源测试与失败旧态保持单列；完整产品权限仍NOT_RUN。

## 精确写域和上限
生产只允许bubble-map.ts候选分支2行级改动；测试新增check-dot-loaded-r001.mjs及本证据文档。不改共有ready、第三方依赖或冻结fixtures，不降低完成判定到void addToScene/scene loaded，不重做地图框架。这是候选方案，未经独立审查和RED不修改生产代码。
