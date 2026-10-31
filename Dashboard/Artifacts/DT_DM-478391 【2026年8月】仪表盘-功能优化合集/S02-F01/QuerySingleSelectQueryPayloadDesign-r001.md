# 普通文本单选 detached 查询容器组合设计 r001

状态DESIGN_CANDIDATE_REVIEW_REQUIRED，仅可送独立审查。QPAYLOAD-001是真实VQuery组件根的离线双槽组合helper，不是HTTP查询参数、searchQuery过滤列表或完整画布保存对象。卡268ea030b40e5f8d819e3f6f147a17ec2111d9cbf1a09385e7727e3b5a70c056、Context均SP010复验通过，prompt已消费；只新增本文与fixtures。

## 实际容器与来源证据

component-list.ts:320–345的VQuery定义component/innerType='VQuery'，propValue初始为空字符串，含name/label/icon、布局、style/request/matrixStyle；250–290的commonAttr及699–704循环混入公共元数据、commonBackground/state。初始没有cascade。DeCanvas.vue:97–108从列表构造后赋component.id。QueryConditionConfiguration.vue:74–82直接接收queryElement对象，1591–1625只向其propValue/cascade写确认后的完整条件和级联；Component.vue:311–337读取这些槽及自身组件id。由此可证VQuery根和两个替换槽，不能虚构一个payload.data.query结构。

canvasUtils.ts:843–864对当前组件根深拷贝再JSON序列化，仅为detached JSON对象形式依据。本函数不调用它；r007最新根overlay原则要求保留目标后续普通编辑，所以保留字段来自调用时目标快照，而非来源组件。容器id='query-B'与引用目录chart-B是不同身份，严禁互换。

## 输入和完整输出

prepareSingleSelectQueryPayload(input:unknown)输入精确{target,expectedTargetId,rebuildInput}。target是一个已JSON化VQuery根快照；expectedTargetId固定调用方选择的容器；rebuildInput原样传真实rebuildSingleSelectTarget，不接受伪造成功结果。输出{ok:true,value:{designPayload:完整VQuery根,runtimePayload:完整VQuery根}}。designPayload.propValue/cascade来自QTARGET design，runtimePayload对应runtime；除此所有目标字段原值深拷贝保留，包含目标自己的样式/布局/事件/请求配置，但不执行它们。没有源外层组件输入，因而不会复制源样式。

目标必有id/component/innerType/propValue，cascade可缺省。propValue允许''或JSON数组（新空目标与有旧配置），cascade若有必须JSON数组。旧槽整体覆盖，不解释其内容、更不声称旧配置合法或已确认覆盖；真实用户确认只能在产品层完成。

允许根键逐项列在JSON container_contract与field_matrix，来自当前VQuery/commonAttr以及已观察id/cascade。未知根键拒绝UNSUPPORTED_FIELD，防止未知引用字段被盲目保留；这是版本化子域，不是最终永久拒绝新/历史合法容器。公共元数据字段可缺省且保持缺省，只验给定顶层类型和递归JSON安全，内嵌事件/样式原样透传，不证明其业务有效。JSON正例给出完整允许域根对象及完整两输出，元数据值是明确合成目标状态，不冒充初始组件全部默认值。

## 逐字段动作和组合算法

KEEP：id/component/innerType及每个允许元数据键，保留目标自身值与缺省性；不重新生成id、不清requestCount、不重算布局/主题、不触发事件。REPLACE：仅propValue/cascade；两输出都必须有cascade，即目标缺省时由真实重建结果[]引入。REMOVE集合为空（旧槽内容整体替换不是逐字段删除），未知根键REJECT。条件内部KEEP/REBIND/RESET由已审QTARGET/QCARRIER负责，本层不重复解释默认A/运行B。

先递归校验整个输入JSON安全与精确三键；再校验容器；通过后恰一次真实QTARGET调用。成功才分别深拷贝target两份并写两槽的独立拷贝。任何失败没有value或partial，中间QTARGET结果不向外泄漏。clone必须正确保存普通自有键，不得通过__proto__赋值改变原型；各层拒绝getter/symbol/非plain对象/稀疏数组/循环/undefined/非有限数，描述符检查先于取值。

两份payload及输入间任一可变对象完全不共享，包括KEEP的style/request/events/background，也包括重建的条件和cascade；不能仅浅拷贝根。改变输出style不得改目标/另一个输出。即使源与目标输入恰有共享对象，返回也必须完全拆开。

## 精确失败优先级

ENVELOPE：非法JSON/根非对象INVALID_INPUT；根缺/多键UNSUPPORTED_FIELD。

CONTAINER：target非plain对象先INVALID_TARGET_SHAPE；对象成立后先必要/未知键UNSUPPORTED_FIELD；再id/expectedTargetId非空不含--字符串，否则INVALID_TARGET_SHAPE；然后id不等TARGET_ID_MISMATCH；再component/innerType任一非VQuery为TARGET_KIND_MISMATCH；最后槽/元数据类型错误INVALID_TARGET_SHAPE。所有容器错误先于QTARGET，故不调用内核。

QTARGET：真实内核失败返回{ok:false,stage:'QTARGET',cause:{stage:原stage,reason:原reason}}，不拍平其ENVELOPE/QCARRIER/PLAN/DIRECTORY优先级、不假造成功。包装器其它错误为{ok:false,stage:'ENVELOPE'|'CONTAINER',reason}。实现不调用QPIPE或重新选目标；错误优先级仅扩一层，不修改任何依赖合同。

## 完整oracle和验证义务

14个固定identity均有完整input/expected：001新空容器且无cascade，002有旧配置/级联并保777宽度且无默认，003目标groupStyle保持，004目标ID错，005/006类别错/标志冲突，007未知根键，008/009槽类型错，010缺必要键，011真实QTARGET计划错误cause，012目标与计划同时错，013额外envelope键，014非法根。任何旧配置替换都是detached候选，不算实际用户确认。

后续实现测试必须导入真实QTARGET，spy仅记录调用不能mock返回；全量字段深等、只两槽改变、源输入不变、跨输出引用隔离、getter不执行、JSON往返、容器失败零内核调用/成功恰一次均需验证。完整fixture为源码派生合成oracle，不是浏览器运行证据。

## 兼容性和准入

候选新文件仅core/core-frontend/src/custom-component/filter-copy/query-single-select-query-payload.ts及core/core-frontend/tests/filter-copy-query-reference/query-single-select-query-payload.test.ts，须独立审查及新Builder admission后实施。当前QTARGET源码摘要已绑定卡；Validation-r002在审阅时为partial，之后父流程的Stop Gate不能由本文倒推该报告PASS。本设计不改依赖治理状态。

此helper只接受单个根，不遍历Group/DeTabs、不证明文档内id唯一、不检查当前版本/权限/用户确认。groupStyle KEEP不等于嵌套挂载验证。输出不得直接回放到后续变化的Store；未来提交仍按r007重取最新目标并复验。历史未知根键、metadata合法性、全shape、保存/undo、预览、权限仍保留原Goal义务；10+16分母不缩减，不注册产品adapter。
