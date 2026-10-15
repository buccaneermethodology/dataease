# Goal DE-KYM-001：DT_DM-478391 需求 KYM 首稿

## 权威与目标

用户明确要求基于 `kb/requirements/DT_DM-478391.v1.json` 为该需求构建首稿 KYM，并明确授权覆盖 build-kym Skill 的 supported-host 限制、改用普通 CLI 手工构建。原始授权与该限制覆盖见 `planning/raw-user-intent-v001.txt`。

以现有 DataEase KYM r001 为基线，生成保留旧内容并纳入需求语义的 r002 候选修订。新增产品语义以用户指定 JSON 为准；它描述规范性需求，不证明当前实现。现有 r001 中源码支持的语句原样保留，不借本任务重验其代码现状。

## 范围与非目标

- 记录需求中明确的角色、功能边界、F01–F08 的用户价值与已确认规则、未决/待证事项、来源文件和本次具体 KYM 交付物。
- 保留固定 KYM 树结构、既有 statements/conflicts/unresolved questions 和 Target Profiles；不凭角色列表推定 Customer、Stakeholder 或新增 Target Profile。
- 需求 JSON 中标明的权威主文档当前在仓库不可见；该 JSON 是本次用户直接指定的权威输入，其上游文档关系记为待核，不从缺失源补写内容。
- 采用普通 `kym` CLI 生成候选包；不声明 supported-host 流水线通过。
- 不构建 TCO、M/TSP/Coverage；不核定或修改 DataEase 产品代码、API、数据库；不创建 accepted state，不提交、推送、发布或部署。

## 验收

详见 `planning/contract-v001.json`。核心分母为 F01–F08 与 Q01–Q156；Q157、跨功能冲突审查以及原文未裁事项保持未决或排除状态。

## 最大声明

仅声明 r002 KYM 候选及阅读版已按当前可见 JSON 输入制作，并通过实际运行的确定性候选检查。不能声明独立语义审阅、实现、运行、性能、安全、兼容、验收或 supported-host 通过。
