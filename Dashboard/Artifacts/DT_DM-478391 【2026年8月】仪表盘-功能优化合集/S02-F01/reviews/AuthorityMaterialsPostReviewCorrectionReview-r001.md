# 权威材料审查后更正记录独立审查 r001

## Correction自身结论与不可跨越的边界

**Correction记录完整性与来源准确性：NEEDS_REVISION（有界更正部分成立，快照绑定及一处来源解释仍需修正）。** 这是correction交付物第1轮，只判断该更正记录及其所声称的定向变化，不是主包第4轮，不重判主包整体就绪性、不重新关闭主包12项历史finding。

原 `AuthorityMaterialsRequestReview-r003.md` 的 **NEEDS_REVISION** 保持历史有效；主包canonical ID `S02-F01-authority-materials-package`仍3/3。新报告不能被用来拼接出“主包已独立复核通过”。10/26/16分母与Scope Delta none保持，真实权限BLOCKED/NOT_RUN、身份/fencing/可信时间UNKNOWN、S01 F01 CONDITIONAL、产品Builder未准入均不变。

## 入口及完整读集

最初委派未带新卡片，已向控制面报告，并仅继续只读取证；在写报告前收到、validate并render固定card SHA `6f460d89cd39fe6f84c43ba525c1a8e229111c142dba677706eba455a95fc1e6`。对应Context SHA `398f32f321e7e923d77153a152f62d03c16fd8f5405272d3fe40a559483496a9`，29/29绑定文件摘要匹配，写前再次复核。card.delta_read_set为空但base_context_refs明确绑定完整29项Context，未据空数组跳过来源。

读集包括原草稿/UserIntent/Goal、治理、DG-02候选与三轮历史review、主包三轮历史review、correction、当前MD/JSON、Sessions相关执行记录、权限环境/S01、全部被引权限SDK/standalone/前端缓存与logout/数据库时间及纯TTL源码。复用本会话此前已读且摘要未变的历史材料；大文件只审有关执行/源码段，不宣称全仓审计。扩读FullShape Design的实际heading/段落、旧Review Context与Preparation Context，以核实correction中的导航。

唯一输出为本报告，写前不存在；未改任何受审文件/Goal/产品源码，未安装、构建、启动、发消息给维护者或执行产品验证。没有因发现首个问题停止剩余项审查。

## 全部更正主张逐项核验

| 更正主张 | 核验结果及证据上限 |
|---|---|
| 即时预览改指Q014 | 当前JSON `successful_path_preserves_required_immediate_preview.source_ref` 指 `/must_have_ledger/20/requirement`，requirement_id确为AC-F01-Q014，文本有“成功立即预览新条件”；Goal摘要一致。该定向引用正确。 |
| 拒绝不发成功反馈改指Q014 | 当前JSON组合refs含Q014和business_rules；Q014有“取消/失败不得显示该成功反馈，目标与预览保持原状”，business_rules补“不触发查询”。组合断言有依据。 |
| 服务端权限改指ORIG-01 | Pointer确实命中`/must_have_ledger/22/requirement`及AC-F01-ORIG-01；但内容只明确访问资格及不能仅隐藏按钮，“服务端”需另外的工程规范/来源解释，见CORR-03。 |
| MD/JSON待决规则同步 | 当前MD D段和JSON case_execution_order_authority一致：概览索引、细化ID及冻结Cases顺序，不再将表映射当待owner新政策。并发赢家/迟到重放/逻辑预览次数仍未知，未伪造裁定。 |
| 历史准备Context与当前审查Context区分 | 历史准备性质已说明；但“当前评审快照”链接仍是更正前旧Review Context，见CORR-02。 |
| candidate preview导航 | `#失败原子性与副作用oracle`对应FullShape Design第190行真实二级标题；source_excerpt与第194行原文片段一致，文件摘要55151a44…一致。保留CANDIDATE_NOT_FROZEN及非Goal原文边界正确。仅静态锚点/文本验证，未做浏览器点击渲染验证。 |
| 旧review不覆盖更正后字节 | correction及MD当前状态明确声明旧报告只绑定更正前快照，未独立复核、不得借用旧review；方向正确。但correction自身缺前后字节绑定，见CORR-01。 |
| 权限/环境/S01状态未变化 | 相关记录仍未提供真实authority；没有把请求模板、SDK接口或admin替补当运行证据。此处仅核对声明，没有重新验证运行环境。 |

6个frozen_goal_requirements主source_ref均可解析且Goal hash正确；其中即时预览/反馈得到实际条款支持，不将语法合法当全部语义正确。其余失败保留、不恢复、不续期引用仍有相应business_rules文字；retry明确为解释而非冒称原词。

## 完整 findings inventory

### CORR-01 / P2 / blocking：correction没有自足的前后字节绑定与可核对变更清单

位置：AuthorityMaterialsPostReviewCorrection-r001.md“更正对象”“本次修正”“静态自检”。

证据：记录仅给可变MD/JSON路径和Goal SHA，没有更正前、后对象摘要或旧字节定位。旧review给前MD `d6620e24426d18879c2e9326509f6793df85133d2e8b6d002c379f341ad97571` / JSON `87f37de2856e1e13a536f1e87c06d440ec80bba83f88c7cacb7e25fd58bab733`；当前分别为 `d935b17e5d092f03deed5509a8890de1f050abfc33f069a9ce770f5d172467dc` / `71bbf7714ee131c60874914857327471f0379fd200348b2a4f9ecfb10fa60249`。新审查Context虽绑定当前字节，correction本身未引用它。绑定读集未提供前MD/JSON原始字节；在S02目录按AuthorityMaterial名称与backup/snapshot/archive位置检查未找到对应副本。这只是可定位证据缺失，不声称全机不存在。

影响：可以验证当前具体指针正确，却无法独立证明“本次仅这些定向修改”或完整前后diff；未来路径内容再变时correction的对象身份也不稳定。不能用旧hash代替历史原始字节。

建议：在correction层记录前后摘要、已有旧字节的安全locator及逐项变更位置；若历史原件不可得，诚实限定为“当前指定条款核查，完整diff不可复核”，不重建字节冒充历史。不修改旧review、不重开主包。Disposition：OPEN；阻断correction作为完整可追溯更正证据的通过，不阻止有界收集authority。

### CORR-02 / P2 / non-blocking：更正后的MD把旧审查Context继续称为当前快照

位置：AuthorityMaterialsRequest-r003.md源码快照段“当前评审快照见Authority Materials Review Context r003”；correction“区分历史准备Context与当前审查Context”。

证据：该旧Context SHA `6b8f8b1bb9a382ad419963de356e12250708cbf44fac8097413988cbf0f4643c` 仍绑定CORR-01列出的更正前MD/JSON摘要，并非当前内容。MD末尾虽诚实说明审后更正，前段“当前”仍造成相反导航印象。新correction Context已正确绑定当前字节，但尚未出现在受审correction导航中。

影响：维护者沿“当前”入口复算会看到漂移，可能误借旧review，或误以为新输入无效。建议标为“主包第3轮更正前审查快照”，把当前correction快照单列；不覆写旧Context来追认历史。Disposition：OPEN；不否定已正确区分Preparation Context的那部分。

### CORR-03 / P2 / non-blocking：ORIG-01支持权限义务，不能独自冒充服务端落点的直接原文

位置：correction“服务端权限定位到…22”；JSON frozen_goal_requirements.server_side_authorization_required及其quoted_or_interpreted_clause。

证据：Q022条款为U_view不可查看/复制/粘贴、目标不变、不能只隐藏按钮；business_rules要求每次身份/数据权/编辑权重验，但二者没有直接写“服务端”。仓库AGENTS第5节另明确“前端隐藏菜单或按钮不等于鉴权。后端必须检查实际资源、操作和访问身份”，可以支持工程落点。SDK InteractiveAuthApi定义checkAuth及默认checkShareAuth抛异常，仅为契约，未证明实际权限实现或拒绝行为。

影响：correct pointer与更强断言的完整来源混为一项，降低本更正宣称的精确性。建议组合引用Goal义务与AGENTS后端强制检查规范，明确“服务端”属于工程约束/解释，不是Q022逐字原文；仍保留真实运行NOT_RUN。此finding不反对服务端鉴权、不要求新业务裁定。Disposition：OPEN。

## 源码与链接核对

correction三条Markdown链接均存在；实际第三轮报告名是AuthorityMaterialsRequestReview-r003.md，不是未找到的AuthorityMaterialsReview-r003.md，已按真实文件审查。Preview章节及可搜索片段存在，路径基准为仓库根，不能按JSON文件目录重复拼接。

主包源码表在本次重新读取后仍仅支持其明确的静态边界：AuthApi/ResourceAuthApi为API签名；InteractiveAuthApi默认分享检查fail closed；SubstituteUserServer固定admin，SubstituleLoginServer仅admin/logout日志/uid token；user.clear删除缓存键，logout另reset Store；DatabaseTimeManage供DatasourceServer Quartz状态判断；pure-guards仅整数TTL比较。这些源码均不能提供真实generation/fencing/time authority。未读取XPack私有实现，未将gitlink存在当作可访问。

历史主包AM-09关于Q014的具体引用缺口在当前字节已有对应修正证据；AM-Q02文案同步也有证据。这里描述的是correction主张核查，不重新将主包AM编号标CLOSED或改变其第3轮总评。AM-08当前仍有CORR-02的时点导航限制。其它主包已审条目只作为边界背景，不作第四轮全量就绪性裁决。

## 声明上限及快照

允许结论：“correction中Q014指针、候选预览锚点和待决规则同步获得静态证据支持；correction仍有3项finding，含1项完整追溯阻断。”不允许“主包全面通过”“authority已补齐”“产品可实施”或“Goal完成”。correction中的“未独立复核”是送审时点声明，本报告出现后也不倒写历史原件制造同步。

审阅UTC：2026-10-21T03:45:15.324370+00:00。

| 输入 | SHA-256 |
|---|---|
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints-sp010/SKILL.md` | `b3e5d00193f88608e8deb3214071444ce89fa66431daf115b35f72fedbecbe3f` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/DataEase_S02_F01_Loop_Goal_Draft_r001.md` | `118986e578d3afd19548abf45836a6f4d03cd70323b6edd4625d2c3cd468e8b9` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/UserIntent.md` | `e64919a69df515670a4bd0ce225ccffd59b3428222633e0e7183d202d73935c7` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/AuthorityMaterialsRequest-r003.md` | `d935b17e5d092f03deed5509a8890de1f050abfc33f069a9ce770f5d172467dc` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/AuthorityMaterialIntakeTemplate-r003.json` | `71bbf7714ee131c60874914857327471f0379fd200348b2a4f9ecfb10fa60249` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/DG-02-IdentityGeneration-TrustedTime-Design-candidate-r004.md` | `e3eafb37c88a1c4d92bbdb815da35d5ea8602cd54ed252ec472ab6361cf25ae6` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DG-02-IdentityGeneration-TrustedTime-DesignReview-r001.md` | `7ced2c1db1df264da65f2eebd2dae76199db39125ac57139708df093c74eeba5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DG-02-IdentityGeneration-TrustedTime-DesignReview-r002.md` | `b8d967916e6d24e9539f3781e4b182e52a3028847b27dd8b847db90b98668a18` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/DG-02-IdentityGeneration-TrustedTime-DesignReview-r003.md` | `d1e8578f22d6958cd3ddde03bdf7dfd621658318a4a7e47f39e4efa769476050` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/PermissionEnvironment.md` | `bf1498aa23f4f864e2c5c3d999b6b1a6044849ba25a9cd7d7d85104b6f233b9d` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/SP-005/S02-S09_EntryPacket.md` | `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Sessions.md` | `0b2c0ab23029bdb83455630ab36b9928ab8d5691606c6967999e7b16005e0af9` |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/AuthApi.java` | `f51dd4cdd76b28c4e9618eb06aba08a42c2b1db916568aa6d343098aabd5d06d` |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/InteractiveAuthApi.java` | `4689e9ec1eaf1c9573462de71e4290a2b0e0ce464094fff21f2da36cf01fe63d` |
| `sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/auth/api/ResourceAuthApi.java` | `4555a5fcd67e83f7f27fcc4cc6b1fc512c039cfdf41d71de4a68ea666dfec06c` |
| `core/core-backend/src/main/java/io/dataease/substitute/permissions/user/SubstituteUserServer.java` | `d1ad0833e7b8e1c8604cc8f26bb9fb9fff80c22836441513f89ed60d04b49d1a` |
| `core/core-backend/src/main/java/io/dataease/substitute/permissions/login/SubstituleLoginServer.java` | `88bc3cd9e72697e72726f25dfde3adaae9d2331ffc8902356a316fd08c383ad4` |
| `core/core-frontend/src/store/modules/user.ts` | `b6deca80ca5e6590fdaebffe7105db62a30db2a76bdb90418d29f64267885fdc` |
| `core/core-frontend/src/utils/logout.ts` | `878cb98f412c6c9263d615aaa59a1b7eb6aeaa18c41259f09861a517897d3434` |
| `core/core-backend/src/main/java/io/dataease/datasource/manage/DatabaseTimeManage.java` | `87cc563d477754329cc530e948a3cf491a7812698c8bcf0fd6f915bfd99ecdd8` |
| `core/core-backend/src/main/java/io/dataease/datasource/server/DatasourceServer.java` | `3138ce6d1ba7cc7a103cda25aa98b45f9510b00a0835d8bb255541a2c3dd5a3c` |
| `core/core-frontend/src/custom-component/filter-copy/pure-guards.ts` | `579bfaf261b3d9a2325554f2e21f6ac44c7bd3a66f611661d97bcd05188de844` |
| `.gitmodules` | `720091481e34953421f42c136418c8c59852e77a4225cbab6974678554e63ca4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/AuthorityMaterialsRequestReview-r001.md` | `e05392a506d3b44b967c305206785e6fe1a7030071c0b2ba4244d9e3ca1e5bf2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/AuthorityMaterialsRequestReview-r002.md` | `60da087334947cd8924ad0de17266d92d17e038fa824184903f399ae843d40aa` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/AuthorityMaterialsPostReviewCorrection-r001.md` | `f2ebd7025be7429bc31151bcfa3f57108883e7a5ed3ec985f37531759095a9db` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/AuthorityMaterialsRequestReview-r003.md` | `b64f0917b1951b07f7469e943955f1478ee73040af3bc9f642587f8b75069e94` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QueryProductAdapterFullShapeDesign-r001.md` | `55151a44c4d8ff2eed5893bda071e2c6e3d1ee69d8f0547ad2777e35d75fdc67` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-AuthorityMaterialsReview-r003.json` | `6b8f8b1bb9a382ad419963de356e12250708cbf44fac8097413988cbf0f4643c` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/ContextBootstrap-AuthorityMaterialsPreparation-r001.json` | `b8323116b413ed60379600308142a78ac7f98941ad734f3faa7b4fcc01fc5cfb` |
