# 纯合同测试入口调查 r002：现有复制调用点

状态：只读源码证据补充；不是产品测试包、可信RED或实现准入。

## 已核实的真实入口

- `core/core-frontend/src/store/modules/data-visualization/copy.ts:150-198`：`copyStore.copy()`从当前选中图表或画布选择区复制完整组件，再由`paste()`延迟加入画布并记录快照。它复制整个组件，不提供过滤条件专用剪贴载荷。
- 同文件`:30-149`和`:265-327`：跨仪表板复用路径对组件树做深拷贝；递归收集组件ID及VQuery条件ID，为VQuery的`propValue`/`cascade`做字符串级引用替换；后续`deepCopyHelper`重设组件/条件ID。该路径涉及完整组件布局/身份，不能直接当作F01过滤条件独立复制实现。
- `core/core-frontend/src/components/data-visualization/canvas/ContextMenuDetails.vue:87-91,132-138`：普通画布菜单分别绑定整组件copy/paste。
- `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:178-185,1260-...,1591-1629`：查询条件配置持有`propValue`和独立`cascade`；确认保存时经历清空、`nextTick`、级联赋值、过滤条件赋值、快照和后续重绘/查询。它不是过滤粘贴的单次原子提交点。
- `core/core-frontend/src/custom-component/v-query/QueryCascade.vue:12-20,43-82`：级联配置节点字段包括`datasetId/name/queryId/deType/fieldId/isTree`，运行选择值在确认提交时清理/重置；联合键在源码中按`datasetId--queryId--fieldId`组织。

## 对有限纯合同测试包的影响

纯比较/计数函数应保持在独立小模块中，不耦合Pinia、Vue、画布布局或Query UI。可按已存在的`tests/map-legend-format/check.mjs`模式，用Node+esbuild直测生产纯函数模块；当前没有专用filter-copy函数/调用入口，所以尚无可运行的行为RED。不可用复制现有整组件的功能来冒充新合同的实现或测试通过。

后续集成测试必须分别验证过滤payload提取/校验/整树提交，不覆盖或弱化原有整组件copy/paste、跨仪表板组件复用、ID重绑定与快照行为；查询适配器的字段白名单、级联引用闭包和原子提交设计仍须先由独立预审冻结。

## 准入要求

1. Builder目标应是新增过滤复制纯规则模块与有限调用适配层，不能改写现有通用组件复制路径以缩小需求。
2. 测试用同一份PURE-SUBCONTRACTS-r002 case identity，直接bundle生产模块；RED须运行成功且以断言指纹失败，排除模块缺失、编译错误和测试环境错误。
3. 新建的测试卡需绑定现时Goal、PureSubcontracts-r002、Cases design-r003、本设计复审、Context packet与actual topology；任何Builder写入前另验证精确action/target的execution admission。

没有修改源码或测试文件，没有调用API、启动服务或触及数据库；未运行产品RED/GREEN。
