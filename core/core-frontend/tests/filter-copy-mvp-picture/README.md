# 图片组 C4 聚焦验证

在 `core/core-frontend` 执行 `node tests/filter-copy-mvp-picture/check.mjs`。

Runner 消费冻结 `UiC234ConcreteFixtures-r001.json` 的 picture-on/off、字段与 data SVG；编译完整实际图片 SFC，并由真实 Vue custom renderer 执行其 prepared 分支、initCurFields、conditionAdaptor。mappingColorCustom 从生产 TypeScript AST 提取完整原函数执行，不重写规则。图片 host、load/decode、计时器、API 与 Store 为明确替身，不能声称浏览器真实图片解码通过。

四组覆盖：6761/200/0/null 分别选 green/red/red/gray；监听先于 src，load 后 decode 前仍 pending 且共享写入为零；OFF 只选首图、不 query、不伪造 fields/DTO；合法 empty 没有图片；error/decode reject/10秒 timeout/unmount 后 late 不成功。真实 Attr setup 调同一个 composable，目录 type=table-info；未触发原改轴 onDatasetUpdate、没有图表查询。Attr 模板另编译并核真实按钮 testid；实际可访问 UI 与 decode 留给浏览器验证。

`node tests/filter-copy-mvp-picture/check.mjs --baseline` 从已冻结 c234-before-r001 manifest 绑定的旧图片 SFC 装载，原 calcData 在图片尚未 load/decode 时就写共享 metadata，按 `MVP-UI-10-PICTURE / PICTURE-METADATA-BEFORE-LOAD-DECODE` 预期 exit 1。不是缺 prepare 方法或编译错误。当前 prepared 链复用相同“load/decode 前零写、仍 pending”谓词，但不将这一有界见证冒充该主 ID 的完整产品验收。

wrapper 的 OFF/ON queryPlan、wire table-info/antv/1→prepared picture-group/custom、rich compare、地图预热门由现 paste runner 的增量组检查；该 runner 同样使用 API/renderer 端口 doubles。实际图库、后端、图片资产、保存重开和49逐 type仍须独立验收。
