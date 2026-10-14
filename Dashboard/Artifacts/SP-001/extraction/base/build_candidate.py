from pathlib import Path
import json,hashlib
R=Path.cwd();O=R/'Dashboard/Artifacts/SP-001/extraction/base';facts=[];caps=[];rels=[]
def ev(path,start,end,symbol):
 p=R/path
 return {'path':path,'start_line':start,'end_line':min(end,len(p.read_text().splitlines())),'symbol':symbol,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def fact(n,text,path,start,end,symbol,kind='implemented',scope='当前V3静态源码'):
 i=f'BASE-{n:03}';facts.append({'id':i,'statement':text,'kind':kind,'scope':scope,'evidence':[ev(path,start,end,symbol)]});return i
def cap(id,name,refs,limits):
 axes=['trigger','inputs','outputs','preconditions','state_changes','postconditions','invariants','failures','permissions','implementation','dependencies','data','tests']
 caps.append({'id':id,'name':name,'depth':'navigation','summary':name+'的可见入口与契约导航','contract':{a:refs if a=='implementation' else [] for a in axes},'limits':limits})
 for n,f in enumerate(refs):rels.append({'id':f'BASE-R-{id}-{n}','type':'CAPABILITY_REALIZED_BY','from':id,'to':f,'evidence_fact_ids':[f]})
fact(1,'根Maven聚合器只列sdk；不能将根聚合构建等同核心前后端构建。','pom.xml',1,28,'modules/properties','configured')
fact(2,'core聚合core-frontend和core-backend。','core/pom.xml',1,22,'modules','configured')
fact(3,'sdk聚合common、api和extensions，用于共享代码、业务接口与扩展契约。','sdk/pom.xml',1,21,'modules','configured')
fact(4,'根POM声明DataEase版本3.2.0、Java 21及Spring Boot 3.5.15；这些是构建声明，不代表安装环境版本。','pom.xml',14,30,'properties','configured')
fact(5,'CoreApplication启用缓存、调度和io.dataease包下JPA Repository，排除QuartzAutoConfiguration，并在Spring启动前添加EhCacheStartListener。','core/core-backend/src/main/java/io/dataease/CoreApplication.java',12,30,'CoreApplication')
fact(6,'多页面配置读取src/pages直接子目录，排除点/下划线开头和lib开头目录；没有匹配页面时返回index入口。','core/core-frontend/config/pagesConfig.ts',10,30,'readPages','configured')
fact(7,'嵌入lib配置使用src/pages/lib/main.ts入口、ES格式，并把vue设为外部依赖。','core/core-frontend/config/lib.ts',1,29,'build.lib/rollupOptions','configured')
fact(8,'开发配置声明前端7070端口；/api/f转发localhost:8100并移除前缀，/api转发同端口并将前缀改成de2api。','core/core-frontend/config/dev.ts',1,22,'server.proxy','configured')
fact(9,'前端包声明版本3.0.0；build:base和build:distributed后运行build:flush，其中包含npm i；lint与lint:stylelint启用自动修复。','core/core-frontend/package.json',1,16,'scripts','configured')
fact(10,'前端Maven的npm build执行run build:distributed。','core/core-frontend/pom.xml',69,80,'npm run build','configured')
fact(11,'后端standalone Profile通过activeByDefault默认激活，并声明profiles.active=standalone。','core/core-backend/pom.xml',133,145,'standalone','configured')
fact(12,'后端distributed Profile引入distributed依赖，编译配置排除io/dataease/substitute/**。','core/core-backend/pom.xml',272,300,'distributed','configured')
fact(13,'后端maven-surefire-plugin配置skip=true；不能将普通Maven测试生命周期的成功视为测试已执行。','core/core-backend/pom.xml',374,381,'maven-surefire-plugin','configured')
fact(14,'Dockerfile使用OpenJDK21 JRE基础镜像，将CoreApplication.jar放入/opt/apps/app.jar，声明RUNNING_PORT=8100和额外配置目录/opt/apps/config/；健康检查是端口探测。','Dockerfile',1,24,'image/runtime','configured')
fact(15,'许可证将V3描述为带附加条件的GPLv3修改版，包含Logo/版权信息及贡献者条款，应保留原文约束。','LICENSE',1,14,'Open Source License','normative')
fact(16,'后端MenuServer.query从MenuManage取得coreMenus后转换为MenuVO列表。','core/core-backend/src/main/java/io/dataease/menu/server/MenuServer.java',15,30,'query')
fact(17,'前端动态路由生成器从views/pages的glob映射查找组件，并递归处理children；页面文件存在不等于已经分配菜单。','core/core-frontend/src/router/establish.ts',1,62,'generateRoutesFn2')
fact(18,'Permission Store的generateRoutes调用generateRoutesFn2，将结果加入动态路由并与基础routes合并。','core/core-frontend/src/store/modules/permission.ts',47,71,'generateRoutes')
fact(19,'电子表格SDK在/spreadsheet资源下声明创建、更新、读取、编辑稿、移动、删除、发布状态和恢复到发布版方法；部分方法声明DePermit资源权限。这里只确认契约。','sdk/api/api-base/src/main/java/io/dataease/api/spreadsheet/SpreadsheetApi.java',23,97,'SpreadsheetApi')
fact(20,'电子表格菜单页导入UniverSheet、工作簿数据类型、资源API及发布状态类型。','core/core-frontend/src/views/pages/menu/spreadsheet/index.vue',49,78,'spreadsheet imports')
fact(21,'填报SDK在/data-filling下声明表单资源、行数据查询/保存/删除与任务操作；行数据修改方法声明manage权限。这里只确认契约。','sdk/api/api-base/src/main/java/io/dataease/api/xpack/dataFilling/DataFillingApi.java',28,130,'DataFillingApi')
fact(22,'填报管理页导入RowDataForm、FilterSearchDrawer以及搜索、删除、批量删除、清空和导出相关客户端函数。','core/core-frontend/src/views/pages/menu/data/data-filling/manage/index.vue',30,62,'data filling imports')
fact(23,'同步TaskApi声明/sync/task下的分页、新增、更新、启动、停止、执行一次和目标键策略契约；并不证明同步引擎运行。','sdk/api/api-sync/src/main/java/io/dataease/api/sync/task/api/TaskApi.java',26,92,'TaskApi')
fact(24,'同步前端API将执行一次、启动、停止、新增和修改分别请求/sync/task下对应端点。','core/core-frontend/src/api/sync/syncTask.ts',216,254,'executeOneApi/startTaskApi')
fact(25,'报表SDK声明任务创建/更新/立即执行/启停、日志查询/删除和导出方法；此接口自身没有提供调度执行实现。','sdk/api/api-base/src/main/java/io/dataease/api/report/ReportApi.java',29,99,'ReportApi')
fact(26,'报表菜单页切换任务与实例视图，openTaskLog将taskId/name传给ReportInstance并切换到instance。','core/core-frontend/src/views/pages/menu/system/report/index.vue',1,38,'openTaskLog')
fact(27,'PluginComponent在dev模式设置distributed=false；其他模式读取xpackModel。distributed路径使用window模块mapping或加载pluginStaticInfo，非distributed路径调用loadComponent。','core/core-frontend/src/components/plugin/src/PluginComponent.vue',127,184,'onMounted')
fact(28,'PluginComponent在组件未就绪时把invokeMethod调用放入pendingMethods，watch插件后通过nextTick刷新；非distributed导入失败显示noLic，加载接口失败还发出loadFail。','core/core-frontend/src/components/plugin/src/PluginComponent.vue',38,127,'invokeMethod/importProxy/loadComponent')
fact(29,'插件客户端请求/xpackComponent/contentPlugin/{key}及/xpackModel。','core/core-frontend/src/api/plugin.ts',1,6,'loadPluginApi/xpackModelApi')
fact(30,'SQLBot页面请求/sysParameter/sqlbot后读取domain/id/enabled/valid；enabled或valid为false时记录console.error，仍继续调用loadSqlbotPage。','core/core-frontend/src/views/sqlbot/index.vue',25,45,'loadSqlbotInfo')
fact(31,'SQLBot页面从配置域名加载xpack_static/sqlbot-embedded-dynamic.umd.js，调用全局sqlbot_embedded_handler.mounted；每30秒重新读取配置，卸载时清除interval。','core/core-frontend/src/views/sqlbot/index.vue',47,110,'loadSqlbotPage/mountedEmbeddedPage')
fact(32,'FontServer在/typeface实现FontApi，将字体列表、创建/编辑/删除、上传/下载和默认字体委派给FontManage，设置读写委派给FontSettingsManage。','core/core-backend/src/main/java/io/dataease/font/server/FontServer.java',18,85,'FontServer')
fact(33,'静态资源上传校验文件名、按上限读取内容并调用StaticResourceContentGuard.validate，随后使用CREATE_NEW写入；捕获异常时抛出国际化错误。','core/core-backend/src/main/java/io/dataease/visualization/server/StaticResourceServer.java',25,57,'upload')
fact(34,'模板静态资源保存先验证文件名、Base64长度及解码内容，再拒绝符号链接目标，并仅在不存在时CREATE_NEW写入。','core/core-backend/src/main/java/io/dataease/visualization/server/StaticResourceServer.java',71,96,'saveSingleFileToServe')
fact(35,'MsgCenterServer.count声明XpackInteract replace=true，主仓库可见方法体返回0；不能将该默认实现解释为完整消息中心能力。','core/core-backend/src/main/java/io/dataease/msgCenter/MsgCenterServer.java',8,16,'count')
fact(36,'可视化读取安全Regression构造DataVisualizationServer并模拟Repository/InteractiveAuthApi，断言名称最小响应、资源类型与READ/MANAGE拒绝路径。这里只记录测试资产，不记录执行结果。','tests/visualization-read-security/Regression.java',49,91,'Regression.main',scope='测试源码；未运行')
fact(37,'静态资源Regression引入生产内容校验器、StaticResourceServer和响应拦截器，提供check/denied断言辅助函数。这里只记录测试资产，不记录执行结果。','tests/static-resource-security/Regression.java',1,25,'Regression',scope='测试源码；未运行')
fact(38,'饼图标签check.py使用Playwright访问测试页面，对标签边界、重叠、原版溢出及换行进行断言，并输出截图。这里只记录自动化脚本，不声称本次运行通过。','core/core-frontend/tests/pie-label-overflow/check.py',1,70,'Playwright label checks',scope='测试源码；未运行')
fact(39,'Desktop Builder由workflow_dispatch触发，branch/tag默认仍为dev-v2，构建步骤包含mvn clean和-Pdesktop及跳过测试参数；这是当前工作流配置，不是V3开发目标规定。','.github/workflows/desktop_build.yml',1,40,'workflow_dispatch/build','configured')
cap('F11','电子表格',['BASE-019','BASE-020'],['只核实前端导入与SDK契约；XPack实现、授权和保存计算运行未核实'])
cap('F12','数据填报',['BASE-021','BASE-022'],['只核实管理页与SDK契约；提交落库、任务执行和授权完整实现不可见'])
cap('F13','数据同步',['BASE-023','BASE-024'],['只核实客户端及公共契约；调度引擎、Source/Sink支持与失败恢复未核实'])
cap('F14','报表任务',['BASE-025','BASE-026'],['只核实界面与SDK；实际调度、模板和发送依赖未核实'])
cap('F16','插件加载',['BASE-027','BASE-028','BASE-029'],['核实主仓库加载桥；不推测专有mapping实现或全路径失败处理均完善'])
cap('F17','SQLBot嵌入',['BASE-030','BASE-031'],['外部脚本集成；不代表仓库自带问数引擎或enabled/valid前端拒绝加载'])
cap('F19','字体管理',['BASE-032'],['服务委派导航；字体内容验证与用户授权需专项核实'])
cap('F20','静态资源上传与模板资源',['BASE-033','BASE-034','BASE-037'],['限定两个写入入口；未做全站安全评估或运行测试'])
cap('F21','消息中心入口',['BASE-035'],['仅可见替换挂点与默认0；最近操作功能需独立导航补充'])
cap('F22','菜单装配',['BASE-016','BASE-017','BASE-018'],['只核实菜单服务和动态路由；不把菜单可见等同后端鉴权'])
rels += [{'id':'BASE-R-MODULE01','type':'MODULE_DEPENDS_ON','from':'BASE-002','to':'BASE-003','evidence_fact_ids':['BASE-001','BASE-002','BASE-003']}]
# 聚合关系不能据目录声称依赖；删除上述候选直到读取真实依赖。
rels=rels[:-1]
d={'doc_id':'architecture-extensions','title':'架构、运行配置与扩展导航','domains':['K00','K01','K02','K05','K06','K08','K09','K10'],'facts':facts,'capabilities':caps,'relations':rels}
(O/'candidate.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
(O/'read-log.json').write_text(json.dumps({'method':'逐条事实所引切片已经由root工具输出阅读；非全文件已读声明','slices':[e for f in facts for e in f['evidence']]},ensure_ascii=False,indent=2)+'\n')
gaps=[{'id':'BASE-G01','question':'根POM3.2.0、前端3.0.0及workflow dev-v2默认的版本策略是什么？','disposition':'配置事实分别保留；不自行统一或修改','blocking_canonical':'不得声称实际安装版/支持矩阵已确认'}, {'id':'BASE-G02','question':'电子表格/填报/同步/报表的版本授权矩阵及专有运行实现','disposition':'仅公共契约导航；XPack为范围外','blocking_canonical':'不得声称功能全版本可用'}, {'id':'BASE-G03','question':'测试README历史运行结果是否仍适用于冻结基线','disposition':'不复用历史PASS；仅记录源码测试资产','blocking_canonical':'不得标tested'}]
(O/'gaps.json').write_text(json.dumps(gaps,ensure_ascii=False,indent=2)+'\n')
print(len(facts),'facts',len(caps),'capabilities')
