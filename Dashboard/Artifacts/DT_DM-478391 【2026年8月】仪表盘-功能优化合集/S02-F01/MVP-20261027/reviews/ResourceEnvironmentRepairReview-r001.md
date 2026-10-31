# 本地资源根目录配置恢复方案独立审查 r001

- 审查轮次：本交付物第 1/3 轮；图片候选代码已完成的 3/3 轮不重开、不重置。
- 审查者：独立 semantic_review lane `resource_environment_reviewer`。
- 审查时间：2026-10-29T07:29:18.612551+00:00。
- 绑定卡：`S02-MVP-RESOURCE-ENVIRONMENT-REVIEW-r001`；canonical SHA-256 `fd2a7c68851a4f666f31e8a94dbf264e177792c15e48dc6995d97b5c14856cd6`。入口脚本验证 PASS，写报告前逐项重核 Goal 和七个 base refs 摘要一致。
- 基线 commit：`1e84e7438462e5d6fc371358da3bdad7d24a5c1a`。工作区已有大量修改和未跟踪证据，本 lane 未修改、暂存、回退其中任何文件。本报告写前不存在，是唯一写入目标。
- 适用技能：项目 `sge-governed-checkpoints` kernel、semantic-review recipe、Frame-First 与 Protocol v2、写前保全与冻结要求。

## 结论

**Overall Verdict：PASS（仅此环境恢复方案的有界可执行性通过）**。

**Design Freeze Validity：PASS。Implementation Entry Readiness：PASS。** 没有发现需要改写方案才能开始的阻断项。可进入已授权目标的执行准入检查；本审查本身不替代 execution admission、文件系统执行许可、写前漂移检查或恢复后运行验证，也未执行配置变更或重启。

`dataease.path.data` 补齐为已有上传目录的父目录，与当前读取链条相符，最小变更清晰。配置恢复仍是待执行动作，图片根因仍为候选；尚不能声明图片已显示、MVP 完成、真实权限通过或 Goal 完成。

## 已检查证据与无问题维度

| 维度 | 直接检查与结论 |
|---|---|
| 原始目的与分母 | 已读 `Goal.final.json` mission、claim policy、completion rule；P1 12 项和原始 26 项合计 38 项、49 类型及真实权限边界保持。环境计划还提到 AC-MVP-F01-09；审查卡列 06/08/12。本次只是环境前置恢复，不据此删减 09 或验收任何 AC。 |
| 绑定与阅读清单 | 完整阅读受审计划、资源路径诊断、RuntimePictureResource-r001.json、StaticResourceConstants、ConfigUtils、DeMvcConfig、StaticResourceServer；额外读取 StaticResourceUtils、SysParameterServer.i18nOptions、InitSqlListener、启动脚本必要白名单行，完成引用摘要复验。 |
| 配置最小差异 | 当前配置 SHA 与方案 `9fbf68142b85be6a01640333812061eb6c05cf4ccb7b8ac7bdb86ea37a282c11` 一致；唯一 `dataease:\n  path:\n` 锚点存在；现有 static-resource 指向用户目录，data 未配置。单行插入不会主动变更其他键，执行时仍须逐字节差异核验。 |
| 保密与备份 | 目标普通文件非 symlink，权限 0600，父配置目录 0700。方案要求同目录唯一 0600 备份、原子替换、字节与权限复验，不把完整配置写入仓库；可满足恢复需要。仅输出路径、摘要和布尔检查值，没有输出凭据。 |
| 读写根目录链条 | 上传依赖 dataease.path.static-resource；HTTP 静态资源读取经 WORK_DIR，导出图片/base64 读取经 StaticResourceUtils.FILE_BASE_PATH，均由 data 根派生。ConfigUtils 从 user.home 下固定外置 application.yml 读取。新增键会统一这些本地目录；无需改鉴权或将文件复制到 /opt。 |
| 资源实物 | 指定 SVG 是普通可读文件、非 symlink，SHA `4ee1f90162a2054113954838d0f837f514d027fc60b22ac9e270dcea94af0c4b` 与诊断一致；旧 /opt/dataease3.0/data 不存在，新根现有 static-resource、excel、report、exportData。 |
| 同包与进程 | jar SHA 与方案 `0e9840bea80caefc3d353a7b62d203505c280396923f91001769f62d7c3e66e5` 一致；包中 common 类含 data 配置键和默认路径，ConfigUtils 含 user.home 与 application.yml 读取字面量。lsof 只见 java PID1730 监听 127.0.0.1:8100。获准只读 ps 核对：同 jar、standalone、同 additional-location、同 loopback 绑定均为 true，没有 user.home override。 |
| 启动方式 | 已核启动脚本 ROOT 为当前 repo，使用 Java21、相同 jar/profile/config/address，日志在用户 opt 下。计划只摘取该后端启动命令，不执行包含其他服务操作的完整脚本。执行时再次核验 PID 与命令，不能仅复用本报告的历史 PID。 |
| 数据库与启动副作用 | 白名单只确认配置中存在方案给出的 127.0.0.1:3307 和 dataeasev3 标记；未输出连接串/用户/密码、未连库。方案已明确同包重启仍会运行既有初始化/迁移，且不承诺数据库回滚；本审查不将“同包”解释为“零数据库写入”。 |
| 失败处置 | 精确 PID TERM、30 秒未退出即停、不强杀、端口被占不杀未知进程、仅在本次进程退出后恢复备份再用原命令启动，均有边界。恢复配置不等于撤销数据库或资源写入，方案对此没有错误承诺。 |
| 运行 oracle | 方案要求正常浏览器请求、120×80 SVG 与文字实际显示、图片组有值粘贴、保存离开重开及过滤树，区分健康响应、匿名 401 与产品行为；失败不得假报成功。 |
| 语义与治理 | 计划是执行记忆中的环境准备方案，不是 canonical 产品知识。没有 Scope Delta、truth carrier 替换、权限放宽或无依据完成声明；没有因本次资源恢复新增通用控制器或重复治理机制。 |

## 全部发现

**阻断发现：0。以下 3 项为非阻断注意事项，不要求新增设计交付物或重开图片代码审查。**

1. **F-01：根目录变更的影响比图片 HTTP 显示更宽。** `StaticResourceConstants` 同时派生 map、map-origin、geo、appearance、report、plugin、i18n/front；已确认主程序 i18n 资源处理与 `SysParameterServer.i18nOptions` 读取，以及 StaticResourceUtils 的导出/base64 读取。方案明确地图限制，但未逐一列出其他常量。当前旧根不存在，新根也无 map/map-origin/geo/i18n，未见由此丢失已有这些目录资源的证据。执行记录应保留影响清单；不能将这次 PASS 延伸为地图、扩展报告或插件兼容性通过。
2. **F-02：配置文件恢复与运行进程恢复是两个状态。** 若 TERM 超时，方案要求停止；此时配置可能已修改而旧进程仍运行。执行者应记录“配置已变、进程未重启”的准确状态，后续重试先重新核对配置摘要与进程身份；不得根据旧配置 SHA 或旧 PID 盲目再次执行。正常回滚前也应核对目标仍为本次写入版本，存在后来修改则停止覆盖。这是既有“漂移则失败不写”的具体应用。
3. **F-03：同包同库不证明迁移绝不会写入。** `InitSqlListener` 启动时依据数据库版本记录决定执行和失败重试。受审方案已承认既有启动行为，故不作为阻断；执行记录须保留启动结果，异常不能只恢复 YAML 就宣称环境完全回到原状态。数据库隔离归属沿用当前任务已有环境事实，本报告只做静态标记核对。

## 未检查、原因与同类残余

- 未实际修改外置配置、生成备份、TERM/启动进程、调用健康接口或操作浏览器：本 lane 严格只读，唯一允许写报告。相关运行结果均为未观察。
- 未连接数据库、读取迁移状态、证明无活跃外部客户端；不从本地地址和聊天 active 状态推导绝对无人使用。计划已承认未知客户端与短时失败，未给出“完全无影响”的错误承诺。
- 未审查 XPack 专有源码及所有运行包扩展消费者；本次不修改/发布 XPack，也不作全扩展兼容性或生产运行承诺。appearance/report/plugin 的扩展行为是同类残余，不据此扩大本次修复分母。
- 当前 Python 环境没有 PyYAML，未安装依赖；因此未做候选 YAML 的库解析。精确锚点/层级/单行插入已人工核对，实际 Java 配置读取和运行仍由恢复后验证确认。
- 首次 sandbox 内 ps 被禁止；随后获自动批准执行同一只读白名单布尔核验并成功。未放大读取范围、未打印完整启动参数。
- 运行包只核对相关类的存在和关键字面量，未反编译证明它与当前所有源码完全一致；包摘要固定支持“重启同一本地包”，不支持“当前全部工作区代码已编入后端”。
- RuntimePictureResource 的截图及事件流未重新回放，本审查不重新裁决既有图片代码验证，也不把父 lane 的 UI 自测升级为独立运行验收。

## 准入预测与下一步

最小可执行片段是：消费有效、绑定本方案的 execution admission → 重核配置/包/PID/目录与权限 → 私密备份并单行原子变更 → 仅重启同一本地后端 → 留存健康与已登录图片请求/视觉证据 → 正常复制粘贴、保存离开重开证据。任一输入漂移时停止该执行入口并重新绑定，不能把本报告 PASS 用于不同包、不同库、不同进程或不同路径。

按照该片段执行且检查通过，预计可解除“本地上传/读取资源根不一致”的环境障碍；是否确为当前图片失败根因、是否解除图片 UI 阻断仍须真实运行确认。地图合法资源准备、全部类型与真实多用户权限继续各自原有下一步；本报告不启动第四轮图片候选代码审查。

未来压缩引用本报告时只能写：**“资源目录恢复方案第 1/3 轮 PASS；配置恢复和运行验证尚未执行。”** 不得压缩为“图片已修复”“资源环境验收通过”或“S02 完成”。

误用场景及控制：把静态根配置 PASS 当图片运行 PASS，必须以已登录 UI 证据阻断；把图片恢复当地图/权限恢复，保留各自未观察状态与原分母；把同包重启当零副作用或完全可回滚，分别记录初始化/迁移、配置状态和进程状态。
