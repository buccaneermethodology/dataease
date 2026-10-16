# S01 任务入口与审查设计

原始请求见 raw-user-intent.md；目标为审查定稿、登记 Dashboard 并执行 S01，保留原十项 AC。用户最新明确关键运行证据是完成必要条件，必须先列具体环境和操作并获得确认。当前只执行资料读取与文档准备，不启动产品、不运行产品测试或连接数据库。

参照 S00 Final r001 的十二节结构，但旧输入缺口和当时 BLOCKED 不复制为当前事实；当前 S00 r004 最终审查 accept，VALID_WITH_CONDITIONS / CONDITIONAL。历史 receipt 为当时证据，不把后续 Dashboard 变化误当 S00 未完成，也不声称历史 receipt 可重新绑定当前状态。

需求权威：用户原裁定及两条追加裁定、S00 核准映射；KYM/TCO 仅参考，当前未提交修订不作自动权威。禁止更改源资料、生产代码、KYM/TCO、Skill、数据库；禁止 Git 提交推送。文档产物在 SP-005；执行状态在 Dashboard 四面。XPack 仅公共契约和必要本地受限检查，不复制专有实现到产物。

审查点：原范围与十项 AC 不缩减；171 AC 和14项技术依赖有映射；关键运行见证应有固定场景、独立判定 oracle、环境与命令、期望/实际、证据；缺环境授权不等于完成。全功能运行覆盖与高风险导出权限、持久化重开、透视格式/汇总、移动交互不可被 mock 或静态数组替代。D07/D08 缺失不新增，Unknown 不当缺失；D11 每表10条且小计总计分别计数。

Topology：主代理负责 Design/文档 Builder/Closure；独立 semantic reviewer 做 Goal 预审，独立 Validation 检查完整执行成果。依项目 SGE G10/G11 使用隔离上下文的子 Agent；文档预审不是最终验收。原始资料只读；审阅仅写自己的输出文件。具体调查阶段再固定 lane 卡及 admission。没有用户可见聊天强制条件。

完成门槛：静态链路+关键运行证据+完整映射+独立审查+最终对账与有效 Stop Gate；运行未授权时继续不依赖它的工作，最终只能请求具体授权、不能完成 Goal。

本次不产生新的稳定产品规则，KB 更新不适用；不改 maintained gate，BDD 同步不适用。无 Session registry，不冒充程序化对账。
