# DE-GOV-003 观察机制建立与交接

## 关键结论中文展开

已设计长期观察 Goal：后续每5个已结束任务出一轮报告，持续记录耗时、返工、质量和测量成本。长期 Goal 保持 doing，本轮仅交付 setup；当前真实前瞻样本为0，尚无收益结论。

## 实现变更与原始范围覆盖

适用 Implementation Delta：AGENTS 增加前瞻采集入口，新增协议/JSON模板/报告模板/空台账及每日当前聊天 heartbeat。虽无产品代码变化，后续任务流程会增加有限测量工作。源Skill完全不改，基线见 baseline/manifest.json；协议规则是观察Goal的执行约定，不建立平行产品KB。

| AC | 交付与证据 |
|---|---|
| AC-01 | protocol.md 定义墙钟、区间并集、可比配对、原始分母和null语义 |
| AC-02 | 每5个已结束观察分批；失败/中止/缺失仍纳入，进行中单列 |
| AC-03 | AGENTS入口、任务模板、cohort摘要与逐版本数据目录 |
| AC-04 | 质量红线、采集成本及预固定实用阈值；无因果证明声明 |
| AC-05 | automation.json 记录 ACTIVE heartbeat 配置读回；初始扫描记录0样本，未来采集未验证 |
| AC-06 | 完整候选包交独立review；报告通过后绑定setup Gate，长期观察不关闭 |

用户“每观察5个任务”的更正已在协议冻结前纳入，原建议10个/30天未实施且已撤下。没有缩小用户要求的持续观察范围。

## 验证、角色与限制

根代理依序设计/落地/交接，独立 Validation 检查统计口径、合同八个场景和全部候选状态面；无需重复Semantic lane。JSON/链接、admission、Skill保持和配置读回结果见checks.json。Closeout language verdict: PASS（中文格式检查）；这些结构检查不替代独立设计审阅。

本次没有运行未来任务，未验证真实自动唤醒、首次定时数据采集或任何效率收益。每日本地检查依赖电脑与桌面应用可运行；仅已成功配置不等于执行成功。没有Session registry，手工台账不声称程序化校验。无新执行gate，BDD不适用。

## 后续执行与收尾顺序

setup 候选齐备冻结 → 独立 review.md → wrapper/state → stop-gate/receipt.json → 只读读回。Gate完成仅指setup；data/和reports/是长期观察输出，先保全initial-data-snapshot.json，不将未来数据变化倒推为本次快照漂移。

长期观察第5/10/15……个任务触发新报告，遇质量红线及时通知；无数据不伪造，无新变化保持安静。观测结论不足时如实报告。协议或Skill的后续修改须单独记录版本及授权，不能为了改善指标改写旧样本。
