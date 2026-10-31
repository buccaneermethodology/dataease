# 本地测试底图环境方案

用户本轮直接批准：“允许准备并配置本地测试底图”。目标：解除flow/heat/symbolic正常UI“请填写key”的隔离环境阻塞，复用现有customTile+vector Style JSON+MapLibre/L7，禁止伪造key、替换渲染器或把测试网格当生产地图地理准确性验收。

## 方案和写域
仅新增core/core-frontend/public/s02-test-basemap/style-r001.json；MapLibre v8，sources内联自生成GeoJSON经纬网格（经度每10度，纬度每10度，纬度[-80,80]；无国界或行政地理数据）。背景淡色、网格灰线，不使用font/sprite/tile网络源。name/metadata标识S02 LOCAL TEST GRID。页面正常自定义服务vector设置styleUrl为同源/s02-test-basemap/style-r001.json，zoom0–18，署名“S02 本地测试网格，仅用于功能验证”。Vite public提供静态JSON，不部署新服务、不安装依赖、不修改生产逻辑/鉴权。

## 配置保全与执行门
配置操作仅当前127.0.0.1:7070/后端8100/库dataeasev3隔离实例。先正常UI打开在线地图，读取当前mapType以及key/securityCode是否为空（不输出凭据）；再切到自定义读取现存字段。若当前或custom任何密钥/URL带秘密或自定义配置非空，不直接覆盖：先按现有正常UI可恢复机制保全到本机私密位置，证据仅保存脱敏指纹与位置；无法保全则停写该配置，其他修复继续。若gaode空key且custom为空，仅记录无秘密的完整前态，保存测试custom配置不会丢外部服务凭据。须查后台saveMapKey具体作用域，不能假设只更新当前type；若会覆盖其他type，方案必须据实修正后再执行。
准备文件前确认路径不存在；已存在不同内容则不覆盖。JSON自检version8、内联source、无远程URL。经现有本地HTTP读取确认200与解析内容相同。UI预览显示网格后再点击保存；离开重开在线地图核持久化。随后返回测试dashboard，正常配置flow/heat/symbolic并执行双向copy/paste及显式保存重开；各次结果独立oracle核对。此次配置是长期本地开发fixture，但原mapType及空配置保留为回退依据，恢复只通过同一UI完成。前后截图、配置差异、文件摘要均落执行证据，秘密不写Dashboard。

## 证据上限
通过实际L7图层、坐标、过滤、query、保存链路；测试网格不是真实地理底图，不证明外部商业服务、精确边界、跨环境/权限或生产就绪。原三地图NOT_RUN保留直到各自真实验证完成。不改变任何Goal完成口径，当前P1范围直接相关。
