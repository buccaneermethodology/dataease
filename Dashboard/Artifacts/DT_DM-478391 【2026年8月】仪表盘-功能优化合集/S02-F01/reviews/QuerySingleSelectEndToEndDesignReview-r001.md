# QE2E-001 独立语义设计审查 r001

## 双结论

- Design Freeze Validity：**NOT_READY**。组合方向合理，但八个identity不是可独立复算的冻结完整oracle，顶层输入与错误合同未闭合。
- Implementation Entry Readiness：**NOT_READY_FOR_BOUNDED_ADMISSION**。暂不能交Builder；先完成以下最小补充，不需要扩大到产品/UI/权限，也不需要重新审查全部子模块。

## 接收端证据

review card canonical `f83eee9b537012171a277e392d919154bba944058d38e8807cd251df25253096`，SP010接收端validate为pass、exit=0，write_scope仅本报告。Context校验exit=0，required_read_set实际摘要一致。本次阻断是内容缺口，不是卡角色/路径问题。

## Frame-first与Boundary

本切片意图为离线QPIPE→QPAYLOAD组合，成功仍只得detached VQuery候选。end-to-end名称不证明产品复制/粘贴、真实权限、确认、Store、预览或保存链。原10项Goal AC及16项产品义务保持，真实权限BLOCKED/NOT_RUN；依赖partial不得被组合成功或新Gate追认。

组合不应引入第二套引用/默认值算法。真实prepareQueryReferencePipeline接收propValue/cascade/sourceComponents/targetComponents/maps，成功value为QueryReferencePlan；真实prepareSingleSelectQueryPayload接收target/expectedTargetId/rebuildInput。设计方向可实现，但当前“字段原样交给”仍须冻结两次调用对象和成功/失败输出精确结构。

## Findings

### F-QE2E-001 — 八个identity仅叙述，没有完整oracle（P1，阻断）

Fixtures的cases均只有id、自然语言source、字符串expected。001/002没有完整target、源条件、maps、目录和完整designPayload/runtimePayload；其child引用没有明确文件SHA、case ID、定位与确定patch。007只有不变量描述；008只有“built from”文字，缺实际组合输入及调用序列。固定名称不等于冻结输入，要求从真实模块重算也不能让实现输出兼任预期oracle。

最小补充：每项给完整七键input与结构化完整expected；或提供明确不可变文件摘要/case ID及确定组合规则、再物化完整七键输入和预期输出。成功必须含两份完整VQuery根，失败必须含精确包装对象；007附具体基础向量及深冻/引用隔离断言清单，008给精确多错输入与预期真实调用计数/序列。保留八个identity，不把不变量文字当成功输出。

### F-QE2E-002 — 006目标缺字段预期与上游顺序冲突（P1，阻断）

设计同一targetComponents既供QPIPE又供QTARGET。真实query-target-component-map.ts:109–116在映射候选时要求目标包含源引用全部fieldIds；无候选直接MISSING_COMPONENT。因此“QPIPE valid + QTARGET missing-directory-field”不能通过拼接child文字自动形成可达场景：删除被选字段通常先REFERENCE_PIPELINE/QMAP/MISSING_COMPONENT，不会进入QTARGET/DIRECTORY。

最小补充：提供一个按同一输入确实可到QTARGET/DIRECTORY失败的具体结构，并解释为何QMAP接受；若所需场景不可达，保留006身份并修订为正确QMAP短路oracle，同时另用真实可达后层失败验证传播。不得通过两份不同目录、mock计划或跳过QMAP维持旧预期。

### F-QE2E-003 — 七键/普通JSON要求缺少拒绝协议（P1，阻断）

设计一方面声明“严格七键、普通JSON”，另一方面“顶层仅必要字段读取”。未定义未知/缺键、非对象、嵌套undefined/getter/循环/非有限值的返回形状和相对QPIPE优先级。真实QPIPE对原对象取属性，不是整个输入的JSON安全门；把target留给后层校验也无法在第一处读取前满足不执行getter的边界。当前仅定义REFERENCE_PIPELINE失败和QPAYLOAD透传，无法无歧义表达wrapper自身失败。

最小补充：冻结轻量ENVELOPE阶段与精确失败码，先属性描述符/递归JSON安全再构造子输入，明确是否严格七键以及缺/多键错误顺序；复用既有安全方式但不重写业务校验。新增防御和多错断言，可作为八例之外的不变量测试。普通无环共享对象必须与循环区分，输出仍彻底隔离。

## 输入映射与真实调用最小冻结项

明确QPIPE实参只含propValue/cascade/maps/sourceComponents/targetComponents；成功后QPAYLOAD实参为target、expectedTargetId和rebuildInput={source:{propValue,cascade},referencePlan:pipeline.value,targetComponents}。定义成功完整返回是否原样透传QPAYLOAD，定义REFERENCE_PIPELINE cause和QPAYLOAD原失败结构的区别。不得把计划直接返回为payload，不添加外部validated开关。

调用序列应明确：wrapper envelope失败零调用；QPIPE失败零QPAYLOAD；QPIPE成功恰一次QPAYLOAD，其内QTARGET是否调用按容器校验结果；QPIPE内部QPROJ/QMAP/QPREP按原合同。计数spy只透传真调用，不能stub结果。输入不变与输入/两输出无共享可变引用需运行断言，而非只写expected字符串。

Builder目标还应给出两个精确新文件路径；当前“新增组合模块、同目录测试与执行证据”不足以独立确定target-bound admission。不要扩写旧模块或产品入口。

## 修复后路径与声明边界

完成上述r002设计/fixtures的小范围补充后，独立复核具体八例和envelope协议即可重新判断准入；无需新增产品权限前置。本报告不批准实施，也未修改任何被审材料或源码，仅新增本报告。原Goal分母、依赖partial及真实权限NOT_RUN保持。

## 被审摘要

- `QuerySingleSelectEndToEndDesign-r001.md`：`7183dd557c355eb3c785c06faadc8816503b2013b425f41d2c70b4a313a05e6d`。

- `QuerySingleSelectEndToEndFixtures-r001.json`：`bd0409c8dbf277f8ac3a882b3fcc245948c87aaf9a75d758a3c7a15b2eabe0e3`。
