from pathlib import Path
import json,hashlib
root=Path('.')
out=Path('Dashboard/Artifacts/SP-001/extraction/access')
b='core/core-backend/src/main/java/io/dataease/'
f='core/core-frontend/src/'
s='sdk/api/api-permissions/src/main/java/io/dataease/api/permissions/'
facts=[]
def fact(n,statement,path,a,z,symbol,scope='当前源码静态分支；未运行',kind='implemented'):
 p=root/path
 facts.append(dict(id=f'ACCESS-{n:03}',statement=statement,kind=kind,scope=scope,evidence=[dict(path=path,start_line=a,end_line=z,symbol=symbol,sha256=hashlib.sha256(p.read_bytes()).hexdigest())]))
fact(1,'分享管理要求登录身份且拒绝公共链接身份；资源须是未删除的 dashboard/dataV leaf；管理员代理另外通过 InteractiveAuthApi.checkAuth。',b+'share/manage/ShareAuthorizationManage.java',29,61,'requireManage/resource')
fact(2,'既有分享访问重新验证创建者、资源类型和组织绑定；权限服务存在时检查用户启用及 checkShareAuth；无服务时仅允许 uid=1、无注册资源且存在替补登录而无企业登录 Bean 的分支。',b+'share/manage/ShareAuthorizationManage.java',43,97,'requireValidShare/checkSubject')
fact(3,'保存 Ticket 要求 UUID 非空且分享属于当前用户并通过管理权限；替换 Ticket 可删除旧记录生成新值，持久化 args、exp、uuid；删除也检查拥有者。',b+'share/manage/ShareTicketManage.java',55,132,'saveTicket/deleteTicket/isShareOwner')
fact(4,'Ticket 验证对缺失、未知或 UUID 不符分别返回有效标记；首次访问持久化 accessTime 并视为未过期，后续按 exp 分钟计算，null/0 不过期，超过而非等于时过期。',b+'share/manage/ShareTicketManage.java',191,225,'validateTicket')
fact(5,'proxyInfo 检查全局分享禁用、iframe 许可、分享存在及创建者授权、密码有效期策略；只有链接未过期、密码与 Ticket 有效且 Ticket 未过期才签发 Token，否则返回不含资源/创建者/Ticket参数的挑战信息。',b+'share/manage/XpackShareManage.java',318,368,'proxyInfo')
fact(6,'validatePwd 仅比较解密的 UUID/密码并重验分享授权，不签发 Token；签发函数通过响应头返回 LinkTokenUtil 生成的链接 Token。',b+'share/manage/XpackShareManage.java',392,422,'validatePwd/generateLinkToken')
fact(7,'链接 JWT 要求 issuer=dataease、audience=share、purpose=link、version=3，绑定分享/创建者/资源/组织；寿命最多八小时且不超过分享有效期；签名派生绑定 UUID、密码、期限、Ticket要求及访客权限等当前设置。',b+'share/util/LinkTokenUtil.java',16,62,'generate/verify/algorithm')
fact(8,'链接请求仅允许 GET/POST，限定显式通用路径或带 DeLinkPermit 的匹配接口；指定资源类型查询须匹配链接资源；静态资源须在分享画布配置中且文件名不能含目录穿越结构。',b+'share/manage/LinkTokenValidationManage.java',58,108,'checkRequestPath/checkStaticResource')
fact(9,'链接请求路径验证抛 IllegalArgumentException 时拦截器返回 HTTP 403 与 DE-FORBIDDEN-FLAG。',b+'share/interceptor/LinkInterceptor.java',10,24,'preHandle')
fact(10,'DeLinkAop 对链接身份拒绝编辑快照/main-edit；图表须与持久化 chart 的 sceneId、tableId 匹配；资源ID须匹配Token，只有 subResource=true 且父画布包含子screenId才允许子资源。',b+'share/interceptor/DeLinkAop.java',49,130,'logAround/checkChart/isSubResourceOf')
fact(11,'分享访客位权限定义明细=1、数据导出=2、图片导出=4；有许可时有效权限为分享设置与创建者权限交集，无许可的现有链接分支返回7；require 位不满足时抛异常。',b+'share/manage/ShareVisitorPermissionManage.java',15,59,'currentPermissions/require')
fact(12,'Axios 请求优先发送 X-DE-LINK-TOKEN，否则发送嵌入 X-EMBEDDED-TOKEN；响应中的 x-de-link-token 写入链接 Store。',f+'config/axios/service.ts',126,130,'request interceptor')
facts[-1]['evidence'].append(dict(path=f+'config/axios/service.ts',start_line=175,end_line=183,symbol='response interceptor',sha256=facts[-1]['evidence'][0]['sha256']))
fact(13,'EmbeddedApi 仅声明 XpackResource 嵌入管理契约：分页、创建/编辑/删除/重置、域名集合、initIframe、Token参数及注销；创建编辑删除重置标有 m:read。',s+'embedded/api/EmbeddedApi.java',29,92,'EmbeddedApi',scope='仅SDK接口声明，不证明企业后端实现')
fact(14,'嵌入 Store 保存 token、busiFlag、outerParams、资源/图表ID等；setIframeData 把宿主消息字段写入状态，getIframeData 输出 embeddedToken 等字段。',f+'store/modules/embedded.ts',108,121,'getIframeData')
facts[-1]['evidence'].append(dict(path=f+'store/modules/embedded.ts',start_line=188,end_line=200,symbol='setIframeData',sha256=facts[-1]['evidence'][0]['sha256']))
fact(15,'嵌入 iframe 的 initApi 向 /embedded/initIframe POST token 与 origin。',f+'views/component/embedded-iframe/embedded.ts',1,3,'initApi')
fact(16,'嵌入交互函数在宿主窗口存在且传 eventName 时，以 dataease-embedded-interactive 消息类型向宿主 postMessage；methodName 分支直接返回。',f+'views/component/embedded-iframe/EmbeddedIntractive.ts',1,25,'interactive')
fact(17,'图表明细导出首先要求访客 EXPORT_DATA；有链接Token且非DataEaseBi，或DataEaseBi无链接Token且配置非async时同步写Excel，其余分支加入导出任务。',b+'chart/server/ChartDataServer.java',257,265,'innerExportDetails')
facts[-1]['evidence'].append(dict(path=b+'chart/server/ChartDataServer.java',start_line=360,end_line=381,symbol='innerExportDetails',sha256=facts[-1]['evidence'][0]['sha256']))
fact(18,'创建图表/数据集导出任务绑定当前 uid，记录 PENDING、进度0、参数、来源、文件名、时间和机器名；数据集先调用 getDatasetGroupInfoDTO，再交给对应异步执行器。',b+'exportCenter/manage/ExportCenterManage.java',253,288,'addTask')
fact(19,'数据集异步导出捕获 uid、代理组织、IP 并在线程中恢复，保存任务且校验许可；执行列过滤、行权限与导出筛选树，字段为空或无列权限时报错；结束记录成功/失败并 finally 清理 IP 和用户上下文。',b+'exportCenter/manage/ExportCenterDownLoadManage.java',309,391,'startDatasetTask')
facts[-1]['evidence'].append(dict(path=b+'exportCenter/manage/ExportCenterDownLoadManage.java',start_line=510,end_line=521,symbol='startDatasetTask',sha256=facts[-1]['evidence'][0]['sha256']))
fact(20,'导出任务分页按当前 uid 和状态查询；删除及重试检查任务属于当前用户，重试仅允许 FAILED 并重设 PENDING 与进度0后按来源分发。',b+'exportCenter/manage/ExportCenterManage.java',103,187,'delete/retry/pager')
fact(21,'下载URI只能为当前用户任务生成；数据库记录下载创建时间，新记录有效期5分钟；JWT绑定 taskId、uid、ts与有效期。',b+'exportCenter/manage/ExportCenterManage.java',343,367,'generateDownloadUri/getCurrentUserExportTask')
facts[-1]['evidence'].append(dict(path=b+'exportCenter/manage/ExportCenterManage.java',start_line=527,end_line=549,symbol='buildDownloadTicket/resolveTicketSecret',sha256=facts[-1]['evidence'][0]['sha256']))
fact(22,'下载校验要求Ticket与下载/导出记录存在，校验签名、任务ID、所有者UID、签发时间与有效期；通过后删除下载记录再返回任务。该方法未以当前登录UID代替Ticket绑定验证。',b+'exportCenter/manage/ExportCenterManage.java',478,508,'validateDownloadTask')
fact(23,'列权限过滤把启用且选中的规则按用户/角色分组，用户规则优先；匹配脱敏规则时保留字段并登记脱敏项，否则匹配规则字段不进入结果；无匹配保留。规则查询在行/列API缺失或系统管理员时返回空规则。',b+'dataset/manage/PermissionManage.java',58,141,'filterColumnPermissions/columnPermissions')
fact(24,'行权限入口获取规则后解析字段，applyRowPermissions 将当前用户规则交给 WhereTree2Str；按角色入口过滤角色白名单；rowPermissionsTree 对系统管理员直接返回空规则，否则读取用户角色并查询启用规则。',b+'dataset/manage/PermissionManage.java',144,210,'getRowPermissionsTree/applyRowPermissions/rowPermissionsTree')
fact(25,'InteractiveAuthApi 声明资源登记/编辑/删除、checkAuth与queryAuth；checkShareAuth默认实现抛 UnsupportedOperationException，旧实现不能靠默认方法通过分享授权。',s+'auth/api/InteractiveAuthApi.java',44,86,'InteractiveAuthApi/checkShareAuth',scope='公共接口及默认方法，不证明企业实现')
fact(26,'替补登录 Bean 仅在缺少 loginServer 时启用，只接受 admin 名称与配置密码，返回uid=1的签名Token；不能由该实现推出企业用户登录行为。',b+'substitute/permissions/login/SubstituleLoginServer.java',19,57,'SubstituleLoginServer')
fact(27,'前端用户API封装查询、创建、编辑、删除、角色绑定与组织切换；SDK UserApi 对详情、编辑、删除声明菜单/资源级 DePermit，具体企业持久化不由此接口证明。',f+'api/user.ts',3,56,'user API')
p=s+'user/api/UserApi.java'; facts[-1]['evidence'].append(dict(path=p,start_line=53,end_line=100,symbol='UserApi',sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()))
fact(28,'登录或桌面模式前端从 getRoleRouters 生成并动态加入可访问路由；路径不可访问时转首个授权菜单或404，组织无权时回工作台。',f+'permission.ts',95,150,'router guard')
fact(29,'后端 standalone Profile 默认激活；distributed 引入 distributed 依赖并在编译时排除 io/dataease/substitute/**。', 'core/core-backend/pom.xml',134,147,'profiles',kind='configured')
p='core/core-backend/pom.xml';facts[-1]['evidence'].append(dict(path=p,start_line=272,end_line=299,symbol='distributed profile',sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()))
fact(30,'前端图表导出经统一 request POST innerExportDetails/innerExportDataSetDetails 并请求 blob；SDK 对两者分别声明 export_view/export_detail 资源权限，参数为 ChartExcelRequest。',f+'api/chart.ts',118,136,'innerExportDetails/innerExportDataSetDetails')
p='sdk/api/api-base/src/main/java/io/dataease/api/chart/ChartDataApi.java';facts[-1]['evidence'].append(dict(path=p,start_line=35,end_line=43,symbol='ChartDataApi',sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()))
fact(31,'导出中心 SDK 声明分页记录、删除、下载、生成下载URI、重试与导出限制接口，分页声明 m:read，下载Ticket请求参数声明可选但业务管理器会拒绝空值。','sdk/api/api-base/src/main/java/io/dataease/api/exportCenter/ExportCenterApi.java',24,59,'ExportCenterApi')
keys=['trigger','inputs','outputs','preconditions','state_changes','postconditions','invariants','failures','permissions','implementation','dependencies','data','tests']
def ids(ns):return [f'ACCESS-{n:03}' for n in ns]
def cap(i,name,depth,mapping,limits):
 return dict(id=i,name=name,depth=depth,summary=name+'的已读源码行为与公共契约',contract={k:ids(mapping.get(k,[])) for k in keys},limits=limits)
caps=[cap('F08','通过链接分享和预览','core',dict(trigger=[5],inputs=[3,5],outputs=[5,6],preconditions=[1,2],state_changes=[3,4],postconditions=[6,7],invariants=[7,8,10],failures=[4,5,9],permissions=[1,2,11],implementation=[5,6,12],dependencies=[25],data=[3,4]),['仅静态核实，未运行浏览器/过期/并发测试；未全读分享创建与关闭的完整持久化分支。']),cap('F09','将内容嵌入其他系统','core',dict(trigger=[15],inputs=[14,15],outputs=[13,16],preconditions=[13],state_changes=[14],postconditions=[12],invariants=[12],failures=[16],permissions=[13],implementation=[12,14,15,16],dependencies=[13]),['后端签发、域名校验、过期、注销、应用持久化属不可见企业实现，不能从SDK推断；核心深度目标仍保留，当前仅部分源码/契约证据；无运行或测试资产证据。']),cap('F10','导出分析结果','core',dict(trigger=[17,30],inputs=[17,18,30],outputs=[17,21],preconditions=[17,19],state_changes=[18,19,22],postconditions=[19,22],invariants=[20,21,22],failures=[19,20,22],permissions=[11,17,20,23,24],implementation=[17,18,19],dependencies=[23,24],data=[18,21]),['未运行导出、下载并发或权限集成测试；文件路径解析与图片/PDF完整导出未深读；不能声明全部导出格式核实。']),cap('F15','管理用户、组织与数据权限','core',dict(trigger=[27,28],inputs=[23,24,27],outputs=[23,24,25],preconditions=[26],state_changes=[27],postconditions=[23,24],invariants=[1,2,25],failures=[1,2,25,26],permissions=[1,2,23,24,25,27],implementation=[23,24,26,28],dependencies=[25,27,29],data=[23,24]),['用户/组织/角色企业持久化、Token上下文底层实现未核实；列规则缺失返回空列表不等同全链权限放行；行规则实现后续分支及脱敏格式算法未全读；SDK写操作只声明契约，不证明状态实际改变；无运行/测试资产证据。']),cap('F23','导出任务中心','navigation',dict(trigger=[20,31],inputs=[20,21],outputs=[20,21],state_changes=[20,22],failures=[20,22],implementation=[20,21,22]),['导航深度；没有运行任务中心UI或调度测试。'])]
relations=[]
for c in caps:
 for n in sorted(set(x for a in c['contract'].values() for x in a)):
  relations.append(dict(id=f'ACCESS-R{len(relations)+1:03}',type='CAPABILITY_REALIZED_BY',**{'from':c['id'],'to':n},evidence_fact_ids=[n]))
payload=dict(doc_id='access',title='分享、嵌入、导出与权限',domains=['K08','K09'],facts=facts,capabilities=caps,relations=relations)
(out/'candidate.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
reads={}
for x in facts:
 for e in x['evidence']:
  reads.setdefault(e['path'],[]).append({k:e[k] for k in ['start_line','end_line','symbol']})
(out/'read-log.json').write_text(json.dumps(dict(lane='access',method='nl/sed亲读源码；rg仅用于定位；只记录实际用于断言的已读范围，非全文件阅读',files=[dict(path=p,ranges=r,sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()) for p,r in reads.items()]),ensure_ascii=False,indent=2)+'\n')
gaps=[dict(id='ACCESS-G01',capabilities=['F09','F15'],gap='企业身份、嵌入管理和用户组织写入实现未核实',reason='本lane只确认公共SDK及core调用，不读取或搬运专有实现',next='由具备合法访问的独立检查核实实现；保持公共KB契约边界'),dict(id='ACCESS-G02',capabilities=['F08','F09','F10','F15'],gap='无运行与测试通过证据',reason='只读源码提取，不执行构建/启动/数据库',next='独立审阅源码候选；若需要运行结论另行隔离测试'),dict(id='ACCESS-G03',capabilities=['F10'],gap='PDF/图片完整导出、文件路径边界及并发下载消费未深读',reason='当前核心提取集中Excel/任务/下载Ticket',next='补充对应源码路径，不能用当前事实覆盖所有导出格式'),dict(id='ACCESS-G04',capabilities=['F15'],gap='行权限后续白名单/变量分支、脱敏格式算法及企业资源鉴权底层未全读',reason='事实限定已读核心调用/局部分支',next='补充委派或后续深读，不声明全链权限行为已验证')]
(out/'gaps.json').write_text(json.dumps(gaps,ensure_ascii=False,indent=2)+'\n')
print(len(facts),len(relations),len(reads))
