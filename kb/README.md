# DataEase V3 知识库

本目录与执行 Dashboard 平行，包含源码核实型产品事实及独立标注状态的规范型需求基线。源码事实与产品需求分型保存；需求投影不冒充实现证据。产品全景 Dashboard 只作为提取参考，不作为正式事实证据。

## 阅读入口

- [仪表盘八项功能需求基线（F01–F08 / Q01–Q156）](generated/dashboard-requirements-DT_DM-478391-v1.md)：需求决策真源与阅读投影；实现状态为未评估；真源、版本与维护方式见 [需求型 KB 真源](requirements/README.md)。
- [分享、嵌入、导出与权限](generated/access.md)：K03、K04、K05、K07、K09、K10
- [产品术语、架构、运行配置与扩展导航](generated/architecture-extensions.md)：K00、K01、K02、K05、K06、K08、K09、K10
- [图表取数、仪表板与大屏](generated/chart.md)：K03、K04、K05、K06、K07、K09
- [数据源、文件/API接入与数据集](generated/data.md)：K03、K04、K05

## 维护与使用

源文件位于 `data/`；禁止手工改写 `generated/`。所有内容绑定各文档中的源码提交与文件摘要；代码变化后先检查影响、重新核实 JSON，再生成。

在仓库根目录执行：

```sh
python3 kb/tools/kb.py validate
python3 kb/tools/kb.py check-render
python3 kb/tools/kb.py impact path/to/changed/source
python3 kb/tools/kb.py render
```

工具使用 Python 3 和 jsonschema；不自动安装依赖。校验只检查结构、引用与来源摘要，不能替代语义复核。测试资产关联不等于测试运行通过。

候选、缺口、冲突、覆盖统计和审查报告均属于执行材料，不在本知识目录保存。

## 横向导航

- [能力地图](generated/capability-map.md)
- [源码定位与变更影响](generated/source-index.md)
