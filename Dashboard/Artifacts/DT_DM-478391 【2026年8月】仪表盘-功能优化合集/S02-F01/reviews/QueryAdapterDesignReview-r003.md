# 查询适配器增量独立语义审查 r003

## 裁定与证据

审查者：`/root/s02_goal_review`。卡片 `query-adapter-design-review-card-r003.json` 以expected canonical digest `749a83ba70b523ba7666a057581ed3a4354b0404766eb06e0ee4b432e0d55903` 复验PASS。设计r004摘要 `07eba5d5372b91bd3739844c1cc48e672d2bd4362cf93b95532c165a7c5c3bfe`；fixture r004摘要 `9ca707789833c12154b64347b7e81940ff4811bd248cc3f5cb29eaee7bb0b17f`。

总体：`PARTIALLY_ACCEPTED / FULL_QUERY_DESIGN_NOT_READY`。纠正的时序事实、树逐层绑定、组合typed引用和失败状态分类可接收；三个原项不能全部关闭。该裁定不授予Builder准入，不构成产品、权限或最终Goal验收。仅新增本报告，未修改被审文件或运行产品。

本次直接核对canvasUtils的加载/保存接缝，QueryConditionConfiguration的参数构造、配置确认、面板副本、目标字段目录与树历史补全，Component挂载/重置，Tree监听/初始化，dvMain两种替换，以及QueryCascade placeholder生成。未以设计作者自检替代独立审查。

## 原发现逐项处置

| 原编号 | 处置 | 依据与剩余最小缺口 |
|---|---|---|
| QAR2-01 / P2 | PARTIALLY_CLOSED | r004:7–13已将可信副本明确为拟新增载体，指定加载、面板、版本、销毁及保存责任，不再冒充现存能力；但加载前置仍待核，且粘贴提交与载体一致性遗漏，见QAR3-01。候选载体方向可接收，完整来源合同未关闭。 |
| QAR2-02 / P2 | PARTIALLY_CLOSED；时序误述子项CLOSED | r004:17–24正确区分挂载、用户重置、配置确认和控件消费，与Component:332–339、658起及配置面板:1591–1629一致。r004:28、57及fixture:441、455–457仍无完整参数/日期可消费oracle，不能将纠错等同完整形态补证。 |
| QAR2-03 / P2 | PARTIALLY_CLOSED | fixture:30–289补齐有限两条件源/目标、typed重绑及placeholder；r004:40–53有版本漂移与提交前后失败的明确责任，可接收为候选状态合同。但参数对象仍占位，发布门控/commitId如何与根替换及carrier共同形成确定提交点未定，INDETERMINATE仍留到实现消除。见QAR3-01/03。 |

## 未关闭发现

### QAR3-01（P2）：载体和粘贴提交未形成同一设计版本

来源：设计r004:11–13、36–38；fixture:14–28、474–519。载体更新明确列配置确认、新增/删除、撤销/重做、重新载入，粘贴commit仅描述componentData根替换与curComponent重定位；未说明新propValue/cascade何时写入carrier、何时递增editRevision及失败时如何对齐。保存又以carrier覆盖待序列化配置。因此按目前文字实现，可能预览显示新粘贴配置，复制/正常保存却读旧carrier并覆盖它；revision比较也没有唯一权威版本。

处置：OPEN，阻塞完整来源/提交合同冻结。最小处理：把成功粘贴列为carrier设计写入事件，定义prepare基线revision、根对象/设计快照/commitId的单一发布点，以及发布前失败、发布后降级、撤销/重做的版本对应；不要求先实现。载入hook是否在注入前可继续静态追踪，不能无限以安全前置未证替代所有正常来源。

### QAR3-02（P2）：完整参数、树默认及日期正例仍不足

来源：设计r004:24–28、57；fixture:355、391、394–457。参数type值域是声明过的合成占位，expected为文字替换规则而非精确完整对象；日期没有固定时钟/时区输出，树仅验证绑定表/赋值而非完整可消费形态。源码QueryConditionConfiguration:633直接解构type，Tree:121–130可能清默认；这些差异会影响正常成功路径，不能靠参数ID和最终对象投影掩盖。

处置：OPEN，承接QAR2-02/03剩余部分。最小处理：沿现有开源参数生成/消费及日期子组件各补一份受支持形态的完整输入与精确转换输出，树覆盖默认与监听时序约束。无需真实权限运行才能继续静态设计；不得将这些形态永久拒绝，或将合成占位称作运行合法样本。

### QAR3-03（P2）：发布后异常分类已明确，但确定提交点仍是待实现条件

来源：设计r004:36–38、47、53；fixture:491–507。一次setComponentData（dvMain:521–523）确为单次根赋值，但commitId的存放/原子关联和门控消费者未指定；“读取commitId判断”尚不能判定根已发布但ID未发布的中间状态。Tree监听会改默认并请求枚举，单纯门控查询/快照尚未明确如何防止此状态变更。状态矩阵是有效进展，但当前INDETERMINATE终止责任仍不足以交给Builder作为完整冻结oracle。

处置：OPEN。最小处理：指定commitId与根版本的共同载体、门控实际入口/释放次序、观察后抛错的可判定后态；明确Tree默认清空监听在发布中的处理。快照/通知失败保留已提交配置及错误反馈的分类可接收，后续故障注入属于实现验证，不必此时运行产品。

## 可接收内容与边界

树oldTreeLoad两分支恢复与源码QueryConditionConfiguration:2326–2341一致；同数据集后继placeholder/空fieldId与QueryCascade:151–165一致。显式目标chart绑定避免同dataset任意选取，保留目标style、重生condition/node ID的候选方向可接收；其新增绑定界面仍需正常设计审查，不认定已有产品入口。

fixture已明确全部合成、宿主默认字段未完整执行，产品测试NOT_RUN、真实权限BLOCKED，没有把合成数据冒充运行证据。不存在本次审查发现的P0/P1。完整设计仍NOT_READY，DG-03与原10项Goal AC、14项F01及Q066/Q067分母保留；17项纯规则既有结论不因本报告扩大或撤销。
