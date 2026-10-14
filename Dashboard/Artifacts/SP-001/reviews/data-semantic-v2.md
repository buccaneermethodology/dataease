# 数据领域独立语义复验 v2

- reviewed_at: 2026-10-14T02:34:58.082750+00:00
- snapshot_id: SP001-data-candidate-review-v2
- as_of_state: integrated-v2 进入正式静态知识前的领域复验；非全 Goal 收尾。
- artifact: Dashboard/Artifacts/SP-001/extraction/integrated-v2/data.json
- SHA-256: `2bf767cf3ccd1a07eb81aac4d9bddc4782095e11b7617c6a0ac518587af29256`
- reviewer: chart_extract / semantic-data，未编写 data 候选或本轮修正。
- verdict: PASS_WITH_BOUNDS（在下述静态范围和抽样边界内通过领域准入，无剩余阻断项）。

## 修正核实

本轮验证卡摘要通过，读取渲染提示、对象准入合同与修正清单，实际重新阅读五项修正的全部来源区间（6 个源码文件）。逐项结果如下。

| 事实 | 实际源码重读与修正 | 结果 |
| --- | --- | --- |
| DATA-002 | DatasourceApi.java:41-142 已含 save 的 POST、BusiDsRequest 与 DatasourceDTO 声明，原先从45开始的遗漏消除；接口注解不等于运行鉴权边界保留。 | 通过 |
| DATA-017 | DatasourceServer.java:324-408 已覆盖远程 Excel 的 WaitingForExecution、insert、addSchedule（406-408）；本地 Excel/API/远程 Excel 分支均与文字相符。 | 通过 |
| DATA-032 | DatasetDataManage.java:229-276；声明现明确“仅 uid 非 null 且 checkPermission=true 时加载行权限”，对应267行双条件，与 DATA-031 编辑预览传false不冲突。 | 通过 |
| DATA-035 | DatasetDataServer.java:44-94 已覆盖树值异常 return null（92行）；另重读 DatasetDataApi.java:27-35 的 read 注解。 | 通过 |
| DATA-040 | InitSqlListener.java:21-105 已覆盖 success=true 与 saveAndFlush（103-104），失败先留记录、异常阻断启动、重试分支仍有证据。 | 通过 |

前轮 B01 四个引用缺口与 B02 权限条件歧义全部关闭，5/5 修正事实通过。受影响关系 DATA-R002/R017/R024/R041/R044/R014/R032/R049 的目标事实未替换，修正后引用能支持原关系的能力归属。

## 范围与完整性

比较原 candidate 和 integrated-v2：事实仍为74，能力仍为 F01/F02/F03 三项，关系仍为87；能力契约、limits 和关系内容完全未变，只有上述五项事实发生修正，没有删除事实、能力或原始分母。新增 doc_type/version/status/output_path/metadata 属整合包装。当前 HEAD 与 metadata.source_revision 均为 `24ffb4c08a7532af26e8cd3966e5e42726a40af4`，origin 仓库身份与 metadata 的 buccaneermethodology/dataease 一致，未把上游 dataease/dataease 冒作本地 origin。

重算全部74条事实的来源 SHA 均匹配，87条关系端点和 evidence_fact_ids 一致。此机械检查不扩大语义抽样。前轮完整语义抽样为35/74条事实、24/46来源文件，核心能力逐项3/3；本轮重读五项均在前轮集合中，累计仍是35条，不虚增为40条。前轮报告中运行未验证与未独立重读测试资产的边界继续有效。

## 有界准入与保留建议

F01 数据源、F02 文件/API、F03 数据集可以按当前首版静态知识合同进入正式知识整合。status=static_verified 应解释为来源绑定、核心逐项及已披露抽样复核，不能描述成74条均经独立逐条核实，更不能解释为运行验收。

前轮 N01/N02/N03 为非阻断建议，未被本轮修正：连接校验事实放在 preconditions 时仍需连读“失败置 Error 后可保存”的事实；远程下载入口的大小/时限校验指配置合法性；缓存“未检索到删除”保留限定搜索范围及扩展未知边界。这些建议不影响已明确的静态行为事实，但不应在投影中升格为运行保证。

JCache 预建缓存 expiry none、动态创建时 TTL 与 Redis 每键 TTL 的区别保持原文，未把8小时调用参数外推为所有缓存实际TTL。真实数据库/方言、FTP/SMB、权限身份、缓存运行及测试执行仍未验证；这些属于既定范围外验证，不是本轮准入的未解决核心静态阻断。

本轮仅写本报告，没有修改候选、正式KB或产品，没有运行构建、服务、数据库、测试或外部访问。最终KB文件、确定性投影、全量diff、Dashboard和post-closeout绑定仍由后续独立最终审阅负责；本报告不替代该过程。
