from pathlib import Path
import json,hashlib
r=Path('Dashboard/Artifacts/SP-001/extraction/access');d=json.loads((r/'candidate-v1.json').read_text())
b='core/core-backend/src/main/java/io/dataease/';f='core/core-frontend/src/'
def add(n,statement,ev,scope='当前源码静态行为；未运行'):
 es=[]
 for p,a,z,s in ev:es.append(dict(path=p,start_line=a,end_line=z,symbol=s,sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()))
 d['facts'].append(dict(id=f'ACCESS-{n:03}',statement=statement,kind='implemented',scope=scope,evidence=es))
add(32,'分享开关先查管理权限，以uid:resourceId为键在JVM内加锁再调用事务方法；已有记录则删除当前创建者资源的全部分享和各UUID Ticket；新建记录包含Snowflake ID、创建者、组织、资源、随机8位UUID及访客权限0，并按资源类型设置1/2后saveAndFlush。',[(b+'share/manage/XpackShareManage.java',119,170,'switcher/doSwitcher')])
add(33,'编辑分享UUID校验存在、非空、重复和8至16位字母数字格式，通过后先级联更新Ticket UUID再保存分享；编辑有效期把null转0；密码编辑要求现有分享并保存密码和autoPwd。',[(b+'share/manage/XpackShareManage.java',172,230,'editUuid/editExp/editPwd')])
add(34,'链接操作栏PDF入口和PreviewCanvas下载处理都检查shareAllows(4)；canvasDownload事件携type进入downloadCanvas2，默认img；shareAllows只根据前端linkToken与visitorPermissions位判断，不构成服务端鉴权证据。',[(f+'components/data-visualization/canvas/LinkOptBar.vue',111,139,'exportPDF'),(f+'views/data-visualization/PreviewCanvas.vue',185,215,'downloadH2/canvasDownload'),(f+'utils/utils.ts',268,278,'shareAllows/exportPermission')])
add(35,'downloadCanvas2先等待本次DOM使用的资源图片，再用domToPng按不低于3的scale渲染；img以PNG下载，其他type用JsPDF按DOM尺寸方向写一页PNG后保存PDF；失败回调并记录错误。PreviewShow的canvasDownload订阅固定选择img。',[(f+'utils/imgUtils.ts',165,201,'downloadCanvas2'),(f+'views/data-visualization/PreviewShow.vue',112,119,'download'),(f+'views/data-visualization/PreviewShow.vue',211,217,'canvasDownload')])
add(36,'图片导出准备仅等待当前DOM src/background实际引用的缓存图片；加载失败或中止抛异常取消导出，然后等待引用img.decode完成。',[(f+'utils/resourceImageCache.ts',91,115,'waitForResourceImages')])
add(37,'导出路径由绝对归一化基目录、taskId目录和taskId.xlsx构成，并以Path.startsWith检查目录包含关系；旧导出时间分支使用经文件名校验的原始文件名；删除遍历再次检查归一化路径。此实现的字符串归一化不是符号链接真实路径证明。',[(b+'exportCenter/manage/ExportCenterManage.java',386,475,'resolveExportTaskDirectory/resolveDownloadTarget/validateExportPath')])
add(38,'导出文件名校验拒绝空值、斜线、反斜线、双点、NUL和ISO控制字符；ExportTaskFileTarget用Files创建目录与读写文件；下载使用try-with-resources传输，IOException设置HTTP500。', [('sdk/common/src/main/java/io/dataease/utils/FileUtils.java',21,38,'validateUploadFilename'),(b+'exportCenter/manage/ExportTaskFileTarget.java',41,55,'newInputStream/newOutputStream'),(b+'exportCenter/manage/ExportCenterDownLoadManage.java',730,740,'download')])
add(39,'行权限查询汇总用户、角色和sysParams规则；按用户白名单或角色交集剔除规则；代码虽解析部门白名单，在此循环没有部门白名单过滤条件；sysParams规则解析表达式树并替换变量。',[(b+'dataset/manage/PermissionManage.java',188,240,'rowPermissionsTree')])
add(40,'系统变量替换递归处理子树，保留替换成功项；内置userId实际取用户account，并支持邮箱/姓名/电话/组织名；自定义变量仅匹配有效ID，文本in/not in拼接选值，其余取单值；无法解析返回null并从树移除该项。',[(b+'dataset/manage/PermissionManage.java',243,329,'replaceSysVariables/replaceSysVariableValue/handleSysVariable')])
add(41,'脱敏支持全脱敏、保留中间三位、首尾三位和自定义首M尾N或M至N；短文本采用预定义占位或X占位，M>N/长度<M返回*** ***；数据集buildPreviewData和普通表transTableNormal按字段脱敏映射调用该算法。',[(b+'chart/utils/ChartDataBuild.java',1333,1400,'desensitizationValue/transTableNormal'),(b+'dataset/manage/DatasetDataManage.java',552,585,'buildPreviewData')])
add(42,'分享查询切面拦截字段枚举和字段树：链接身份的显式userId须等于当前uid，查询/显示/排序/筛选字段须在当前分享画布componentData JSON中；解析异常或未知请求类型拒绝。',[(b+'share/interceptor/ShareQueryScopeAop.java',31,86,'checkQuery/checkRequest/requireFields')])
add(43,'核心MVC把LinkInterceptor注册到所有路径；可视化辅助名称读取要求正ID、登录且非链接身份，基于持久化资源类型调用READ权限；权限服务缺失时仅实际uid1替补模式允许，返回仅id/name。',[(b+'config/DeMvcConfig.java',49,54,'addInterceptors'),(b+'visualization/server/DataVisualizationServer.java',246,277,'findResourceName/requireVisualizationPermission')])
add(44,'visualization-read-security/Regression.java是可执行main回归资产：用Mockito模拟资源与权限提供方，断言最小响应、READ/MANAGE区别、匿名/分享拒绝、企业权限服务缺失拒绝和替补模式边界；本次仅读源码，未运行。',[('tests/visualization-read-security/Regression.java',50,130,'Regression.main')],scope='测试资产内容；模拟依赖，不证明真实跨组织运行行为')
add(45,'static-resource-security/Regression.java包含图片扩展名/内容、活动SVG、超限输入、模板路径穿越拒绝及HTTP内容安全响应头断言；测试为静态资源边界资产，不能替代导出端到端或分享Token测试，本次未运行。',[('tests/static-resource-security/Regression.java',20,55,'Regression.main')],scope='测试资产内容；未运行')
add(46,'画布Excel管理器读取core画布与图表，用户指定viewIdList时只保留画布组件中且在选择列表的图表并按选择顺序排列；给ChartExtRequest设置当前uid后逐图表导出，最终生成Excel文件；资源不存在抛异常，无图表返回null。',[(b+'visualization/manage/CoreVisualizationExportManage.java',56,106,'exportExcel')])
# 最初事实中关于算法缺读的局部边界由新增事实补齐，原事实不改写。
d['domains']=['K03','K04','K05','K07','K09','K10']
updates={'F08':{'state_changes':[32,33],'implementation':[32,33,42,43],'invariants':[42],'tests':[44]},'F10':{'trigger':[34],'outputs':[35,46],'preconditions':[34,36],'postconditions':[35,38],'invariants':[37,38],'failures':[36,38],'permissions':[34,41],'implementation':[34,35,36,37,38,46],'dependencies':[41],'data':[37,38],'tests':[45]},'F15':{'implementation':[39,40,41,42,43],'permissions':[39,42,43],'outputs':[41],'invariants':[39,40],'tests':[44]},'F23':{'implementation':[37,38]}}
for c in d['capabilities']:
 for k,ns in updates.get(c['id'],{}).items():c['contract'][k]+=[f'ACCESS-{n:03}' for n in ns]
 if c['id']=='F08':c['limits']=['已补读创建关闭、UUID级联与局部专用权限切面；未运行浏览器、过期或多JVM并发验证；测试资产只覆盖相邻读取身份边界，不证明分享全链。']
 if c['id']=='F10':c['limits']=['已补读前端PNG/PDF与核心Excel/任务下载路径；未运行浏览器导出、下载并发或文件系统符号链接测试；静态资源测试资产不等于导出端到端测试；不声称全部产品入口均已运行验证。']
 if c['id']=='F15':c['limits']=['已补读行规则白名单、变量替换、脱敏算法及core身份消费/专用切面；V3UserUtil、TokenUtils和通用DePermit切面定义未在当前sdk/core源文件定位，不能推测其来源或实现；企业用户组织持久化仍只确认公共接口；测试资产使用模拟权限提供方且未运行。']
d['relations']=[]
for c in d['capabilities']:
 for n in sorted(set(x for a in c['contract'].values() for x in a)):
  d['relations'].append(dict(id=f'ACCESS-R{len(d["relations"])+1:03}',type='CAPABILITY_REALIZED_BY',**{'from':c['id'],'to':n},evidence_fact_ids=[n]))
(r/'candidate.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
reads={}
for x in d['facts']:
 for e in x['evidence']:reads.setdefault(e['path'],[]).append({k:e[k] for k in ['start_line','end_line','symbol']})
log=dict(lane='access',version=2,method='nl/sed亲读；rg只定位。以下记用于候选的实际已读区间，不声称全文件阅读。',files=[dict(path=p,ranges=a,sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()) for p,a in reads.items()],search_limits=['rg --files --no-ignore sdk core未定位V3UserUtil/TokenUtils/通用DePermit切面定义，不读取二进制推测','tests及core后端src/test已搜索；未发现命名为分享/导出/权限的直接回归，读取相邻身份/静态资源回归资产'])
(r/'read-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n')
g=[dict(id='ACCESS-G01',capabilities=['F09','F15'],gap='嵌入签发/域名/注销及企业用户组织持久化实现未核实',reason='已读SDK契约与前端/core调用，无可引用实现证据',next='具备合法访问后由独立审阅补核；不公开专有实现'),dict(id='ACCESS-G02',capabilities=['F08','F09','F10','F15'],gap='无本次运行与测试通过证据',reason='只读提取；现存测试仅记录为资产',next='独立静态验证；如需运行结论在隔离环境另行测试'),dict(id='ACCESS-G03',capabilities=['F10'],gap='PNG/PDF浏览器效果、并发下载消费及符号链接运行行为未验证',reason='已补齐前端调用与路径源码，不以静态normalize证明全部文件系统安全',next='按实际环境进行反例测试'),dict(id='ACCESS-G04',capabilities=['F15'],gap='V3UserUtil/TokenUtils/通用DePermit切面定义未在可访问sdk/core源码定位',reason='可见core imports与调用、分享专用切面；不能据此把定义归因某专有模块',next='提供合法源定义或保持依赖接口边界')]
(r/'gaps.json').write_text(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
print(len(d['facts']),len(d['relations']),len(reads))
