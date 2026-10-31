# 普通文本单选完整载体提取与运行水合 r001

QCARRIER-001状态：READY_FOR_INDEPENDENT_DESIGN_REVIEW，可进入独立审查；不是设计作者自授予Builder。专属SP010卡/Context首次校验通过，card canonical digest ab0407947e9dd22925f9441df4f554d733e131d0a202c568fcad1dd221a9c055，render已消费。只写本文、fixtures和专属卡/Context，未改源码。

## 对r004最短路径的补齐

QVALUE已实现九键投影的显式默认水合，但没有完整condition输入、无默认分流或JSON缺键形态。本slice新增完整单条件{propValue:[condition],cascade:[]}→{design,runtime}，保持条件及目标引用ID，不做复制目标映射；因此既不重做QVALUE，也不重复default-copy的身份重绑及运行值透传。

来源明确为查询配置确认后、经JSON序列化的源propValue/cascade，可包含用户当前运行选择。QueryConditionConfiguration.vue:1591–1625确认写完整conditions，canvasUtils.ts:843–864深拷贝当前根后JSON.stringify，因此缺省undefined键会消失；本函数不是读取live Vue对象、整个组件或任意历史数据的通用提取器，也不自己认证来源。

Select.vue:248–273确认配置默认与运行值写入分离；Component.vue:674–683无默认时单选defaultValue设undefined，显式默认时selectValue恢复defaultValue、非空defaultMapValue复制mapValue。Select.vue:172–179明确清选择时mapValue=[]。useFilter.ts:140–149首次消费defaultMap，之后消费map。因此design可剥select/map而保默认，runtime按默认模式独立恢复；不凭字段名盲删所有value。固定为空的其他conditionValue*/numValue*仍按基准KEEP，非空这些分支超域，不误保活动运行语义。

## 精确完整域

输入根恰propValue/cascade，propValue恰一个完整普通文本单选condition，cascade必须[]。condition字段全集、逐字段KEEP/REMOVE/REGENERATE和固定基准值全部见Fixtures；基础来自当前options/parameterCompletion与已审普通条件形态。displayType='0',multiple=false,optionValueSource=1,required=false,defaultValueFirstItem=false，VARCHAR/deType=0，无树/参数/日期活动。dataset.fields=[]；field/dataset/timeRange精确键。defaultValueCheck允许true/false。

显式模式：defaultValue必要非空字符串，defaultMapValue恰一个非空字符串；不要求显示值和编码相同。无默认模式：defaultValue必须缺省、defaultMapValue=[]，遗留defaultValue=''也拒绝本域，不猜其历史意义。两模式源selectValue允许缺省/空串/非空字符串，mapValue为[]或一个非空字符串；拒绝null/数组select。除这两个可条件缺省字段外，缺任一已列必要键失败；不补历史默认。

id/field/dataset/checkedFields/Map等约束全部给出；完整载体KEEP条件name等已有字段，不引入外层组件样式或布局。这是同条件内部值提取，不意味着已决定跨组件复制应携带何种条件展示设置。

## 实现责任与QVALUE复用

先JSON安全与精确键/完整支持域校验，再分别构造design和runtime。design按显式字段表深拷贝KEEP键，移除selectValue/mapValue；默认字段按两模式保持。runtime另行深拷贝design，不能共享任一嵌套对象。

显式模式调用真实prepareSingleSelectValueState恰一次：七个设计值来自源，传给内核的selectValue/default-map工作投影分别设为defaultValue/defaultMapValue。此规范化只是使用QVALUE恢复默认的API前提，不称为源运行证据；外层已经验证源当前值形态，源B完全不进入design。将内核返回的design/runtime值显式装入完整两载体。缺省或空运行值无需修改QVALUE现有非空合同；不得用mock返回替代真实调用。

无默认模式不调用QVALUE；design无defaultValue/select/map；runtime加mapValue=[]，selectValue仍缺省（JSON态undefined）。不调用旧QPAD/COPY，不改其冻结行为。函数返回完整两载体，非只返回七个值字段。

## 错误与oracle

顺序INVALID_INPUT→UNSUPPORTED_FIELD→UNSUPPORTED_SHAPE。非法JSON/循环/非有限数/访问器/特殊对象/根非对象或propValue非数组为INVALID_INPUT，禁止执行getter；根/condition/固定嵌套额外或缺键为UNSUPPORTED_FIELD；数组基数非1、cascade非空、分支固定值、空默认/映射形态、null及非法ISO日期为UNSUPPORTED_SHAPE。defaultValue是已知键：false模式出现它为SHAPE，true模式缺它为FIELD；selectValue任意模式可缺省。阶段完整检查后才构造，失败无partial。QVALUE在完整已验证投影上应成功；如返回失败，reason原样传播，不包装成功。

14个固定identity均完整input/expected：001默认A运行B；002无默认运行B；003显式模式当前空串；004/005缺省select；006空默认拒绝；007 null运行拒绝；008未知键；009多选；010显式空map；011必要键缺失；012非空级联；013源JSON往返；014无默认遗留默认键。全部成功结果还需JSON往返、三方深度不共享、源只改运行值输出不变、设计无运行键测试。不能将失败SHAPE用于产品永久拒绝合法复杂形态。

r004审查要求在此域均由明确oracle覆盖：来源阶段、完整carrier、A/B、无默认/显式默认、缺键/空串/JSON往返；不是只提供diagnostic expected=null。剩余全形态、历史缺省、级联、元数据缓存、权限/UI/保存/产品接线均不由本slice关闭。

## 后续Builder写目标

仅新增core/core-frontend/src/custom-component/filter-copy/query-single-select-carrier.ts与core/core-frontend/tests/filter-copy-query-reference/query-single-select-carrier.test.ts；导入现有QVALUE，禁止修改其实现/测试、其它纯模块、UI/Store。独立审查接受后父流程生成真正Builder card/target-bound admission；本卡是设计及Builder前置材料，不是execution admission。真实RED/GREEN测试需导入QVALUE，spy只能计数，不替换结果。

SP010 card/context验证和构造自检通过；没有执行产品或独立验收。Goal原10+16义务、权限状态、r004 NOT_READY全域状态保持。
