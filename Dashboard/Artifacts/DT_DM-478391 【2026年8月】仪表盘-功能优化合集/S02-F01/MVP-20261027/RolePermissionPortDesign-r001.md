# 界面 MVP 三角色权限端口补齐

原始依据：AC-MVP-F01-05 / UiIntegrationCases-r002 的 MVP-UI-04；不改变真实权限阻塞。S039 首次审查确认当前单 permission ref 不能逐维度参数化。此项是既有 Slice A 的补齐，累计评审预算延续，不能重开 UI 集成设计三轮。

变更限定 useChartFilterCopyMvp.ts 与 editor/index.vue 的 DEV 验证控件，以及必要现有测试。保留原统一权限控件 testid 与 setter，同时增加 read-source、read-dataset、edit-target 三个明确三态端口；初值均 unknown。统一控件设置同步三端口，任一单端口更改立即反映聚合值。聚合优先级 deny > unknown > allow，只有三端口均 allow 才 allow。copy/paste 两者均消费这个聚合值，沿用当前同一 baseReason 和提交前 isCurrent 重检；三项共同作为该 DEV 能力的明确测试门槛，不声称是生产权限定义。

不修改 service/clipboard 载荷、身份规则、TTL、真实鉴权替补或生产开关。诊断只导出三态，不导出身份凭据。现统一控件仍能完成已有 runtime fixture 协议。

有界验收：初始 unknown；全部 allow；每维单独 deny 和 unknown（其他两项 allow）；deny 与 unknown 混合 deny 优先；统一 setter 同步三项；单项恢复全 allow；准备中任一项改 deny/unknown 时提交前重检拒绝且旧状态不变；身份缺失仍拒绝。不是新增27组合矩阵。生产关闭维持，不从 DEV 桩提升真实多用户权限验收。

审查要求：核对冻结 UI04 是否允许此映射、copy 所需门槛是否一致、同步响应窗口、旧统一测试接口兼容、诊断与国际化/作用域。本设计无 Builder 副作用；若原预算无法进入实施应明确指出且保留缺口。一次返回全部发现。
