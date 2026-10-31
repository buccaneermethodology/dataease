# Goal DE-TCO-001：DT_DM-478391 KYM r004 到 TCO 首版

## 权威与目标

用户明确授权本次 TCO 覆盖 `build-tco-coverage` 的 supported-host 限制，改用普通 CLI。输入 KYM 为 `.kym-tco/dataease/kym/revisions/kym-r004.json`；它仍是未批准候选。本 Goal 将其作为用户指定的规范性内容输入，不隐式继承任何批准状态。

构建 TCO v4 候选模型、Coverage 提案和可筛选 HTML 预览，按主要产品功能方向组织能力层级，并基于当前可见 DataEase Repo/KB 代码证据给出保守的 Coverage。Coverage 只陈述被证据支持的实现边界。

## 范围与非目标

- 覆盖 KYM r004 中与目标能力相关的 Product Business Rules、Scope、Problems Unsolved、Project 信息，以及 F01–F08 的需求语句。
- 使用 `.kym-tco/dataease/config.json` 声明的 coverage vocabulary 和 evidence roots；逐项记录 M1/Policy 的 evidence、Coverage 与缺口。
- HTML 预览可浏览、筛选，并呈现层级、Coverage、需求与证据边界。
- 不修改 KYM r004、不改产品代码/数据库、不将 candidate evidence 计为实现、不生成 accepted Coverage、不提交/推送/发布/部署。
- 不将需求决定当作实现事实；不将静态代码或测试文件存在提升为运行或集成证据；不将 unsupported host 的普通 CLI 路径称为 supported-host 通过。

## 验收边界

- 合同与验收标准见同目录的 Intake、Acceptance、Design 工件。
- 最终交付包含模型 JSON、Coverage proposal JSON、HTML 预览、包 manifest 和可定位验证证据。
- `tco` validate、strict audit（如适用）、package 和 preview 实际通过；独立重渲染/结构核对通过；独立 reviewer 审查输入覆盖、层级、证据映射与声明上限。
- 最大声明：仅为基于 KYM r004 和当前仓库证据的 TCO/Coverage candidate；`candidate_not_approved`。不代表代码完整实现、运行通过、业务批准或发布就绪。
