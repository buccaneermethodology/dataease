# S00成果同步KYM与TCO

按用户授权采用普通CLI流程，未运行supported-host自动物化管线，未宣称该管线通过。CLI 0.4.2。

## 交付与变化

KYM r007继承r005，保留5个Target Profiles；追加S00来源恢复、已完成文档事实、公式数量及D07/D08复用范围、F05明确例外、F06跨图表排除、F08右侧行汇总语义及14项后续证据依赖。旧语义保留为superseded，未批准建议与无关未决问题保留。

TCO r003继承18节点/13个M1，追加10条覆盖要求，当前178条；五个Profile分母仍为2/5/5/4/10。S00文档完成未提升产品运行Coverage，13个节点均为design_only、contract_defined、producer_checked；运行实现目标Met为0/26、Gap为26/26。合同层阈值满足不代表波次退出。W0仍含S01。

## 验证

KYM package-candidate completed / audit passed，TCO model/coverage验证、读者语言审计、候选审计及package通过。结构verify仅证明Profile分母、引用与证据字节，不证明产品功能。新增来源经CLI ingest形成精确快照；TCO使用快照文档而非读取治理状态面，来源映射见evidence-snapshot-map.json。未改产品代码、未执行产品测试、未创建accepted状态或启动S01。

独立语义结果以review-final.md为准；CLI通过不替代语义审查。旧包与原始S00材料不改。

## 阅读入口

- [KYM r007](../../../.kym-tco/dataease/kym/views/kym-r007.md)
- [TCO预览](../../../.kym-tco/dataease/reports/tco-packages/tco-package-eb682e010e7f/preview/tco-preview.html)
- [独立审查](review-final.md)

最终状态：candidate_not_approved，供下游预览/审查。

## 审查修订

r006/r002保留为首轮历史候选。当前r007/r003按独立审查补足Q103定位、最大选中数未决及原下拉选项，按F07/F08拆分联合范围投影，S00状态限定为有来源支持的独立文档审查事实。旧三项冲突中来源/同功能例外已消解，KB历史Git来源身份冲突仍保留。
