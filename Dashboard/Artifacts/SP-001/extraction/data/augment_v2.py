import json,pathlib,hashlib,shutil
O=pathlib.Path('Dashboard/Artifacts/SP-001/extraction/data');B='core/core-backend/src/main/java/io/dataease/';U='sdk/common/src/main/java/io/dataease/utils/'
for name in ['candidate','read-log','gaps']:
 dst=O/(name+'-v1.json')
 if not dst.exists():shutil.copyfile(O/(name+'.json'),dst)
d=json.loads((O/'candidate-v1.json').read_text());r=json.loads((O/'read-log-v1.json').read_text());g=json.loads((O/'gaps-v1.json').read_text())
def ev(p,a,b,s):
 x=pathlib.Path(p);return dict(path=p,start_line=a,end_line=min(b,len(x.read_text().splitlines())),symbol=s,sha256=hashlib.sha256(x.read_bytes()).hexdigest())
def add(n,t,p,a,b,s,cap,dim='implementation',kind='implemented'):
 e=ev(p,a,b,s);f=dict(id=f'DATA-{n:03}',statement=t,kind=kind,scope='V3当前工作区静态源码/测试资产；本轮未运行',evidence=[e]);d['facts'].append(f)
 for c in d['capabilities']:
  if c['id'] in cap:c['contract'][dim].append(f['id'])
 return f
ex=B+'datasource/provider/ExcelUtils.java';api=B+'datasource/provider/ApiUtils.java'
add(44,'ExcelFileGuard 上传目录只接受数字用户ID，拒绝符号链接；读取路径必须绝对、规范化、位于上传根目录一至二层，文件名为 UUID.csv/xls/xlsx，逐段拒绝符号链接并验证真实路径及普通文件。',B+'datasource/provider/ExcelFileGuard.java',18,64,'uploadDirectory/resolve',['F02'],'preconditions')
add(45,'Excel 配置校验要求数组；新引用须属于当前用户目录，已有服务端配置中的合法路径可保留；open 再调用 resolve 并以 NOFOLLOW_LINKS 读取。',B+'datasource/provider/ExcelFileGuard.java',66,93,'validateConfiguration/open',['F02'],'invariants')
add(46,'DatasourceServer 对本地 Excel 拒绝无登录用户或分享链接身份；修改时要求旧数据源 manage，再把服务端旧配置交给 ExcelFileGuard，IO失败统一转文件禁止错误。',B+'datasource/server/DatasourceServer.java',1194,1211,'validateExcelFiles',['F02'],'permissions')
add(47,'CSV 编码探测最多64KiB，识别UTF-8/UTF-16 BOM；非合法UTF-8样本回退GB18030。逐物理行读取限制1Mi字符，单元格32767字符、列分隔限制16384；数据行支持逗号引号和双引号转义，预览只收集100条非空行。',ex,541,623,'csvReader/readCsvLine/parseCsvLine/csvData',['F02'],'failures')
add(48,'Excel解析用 try-with-resources 关闭输入及Reader，最多100个工作表，空表头拒绝；字段名经 EngineProvider.validateIdentifier。CSV表头采用 split逗号而数据行另用引号解析器，两者规则不同；未推断类型默认TEXT，短行输出缺失字段为空字符串。',ex,735,861,'parseExcel',['F02'],'invariants')
add(49,'Excel预览监听器收集100行后抛 StopSheetException 终止当前sheet；全量模式不执行该100行停止分支；只读取表头有效列并按表头长度补null。',ex,672,721,'NoModelDataListener',['F02'],'outputs')
add(50,'远程Excel入口先校验传输大小/时限，按HTTP、SMB、FTP分派，不支持协议抛错；下载后仅xlsx执行ZIP预算校验，失败删除下载文件。',ex,437,468,'downLoadRemoteExcel',['F02'],'dependencies')
add(51,'远程xlsx独立预算为10000条目、单条32MiB、总展开128MiB、超过1MiB条目的压缩比最多100，并设置120秒/线程中断检查；超限抛IOException。',ex,470,496,'validateRemoteWorkbook',['F02'],'failures')
add(52,'ApiUtils.execHttpRequest 复制API定义并替换分页参数；将 socketTimeout秒转毫秒，传入每API响应大小和传输总时限；参数可通过其他API递归取值。GET和POST分别委派HttpClientUtil，POST缺少body.type拒绝。',api,232,255,'execHttpRequest',['F02'],'inputs')
d['facts'][-1]['evidence'] += [ev(api,330,392,'execHttpRequest query arguments / method switch')]
add(53,'HttpClientUtil 的 executeBounded 在发出请求前创建RemoteTransfer，响应头后检查声明长度并包装实体实际读取；异常中止请求。getResponseStr 对HTTP>=400抛响应内容或状态码异常。',U+'HttpClientUtil.java',394,432,'executeBounded/getResponseStr',['F02'],'failures')
add(54,'RemoteTransfer 空大小配置使用调用方默认值，1至maximumMb有效；总时限默认120秒且范围1至1800秒。包装流每次read/skip计数，超量/超时/中断调用abort；提前close先abort避免无限drain，并取消timer。',U+'RemoteTransfer.java',30,105,'sizeBytes/timeoutMillis/checkLength/wrap',['F02'],'invariants')
add(55,'HTTP下载使用UUID临时文件名并解析规范化原文件名，文件实体受下载大小和总时限控制；非成功完成时finally删除部分文件，HTTP>=400拒绝。',U+'HttpClientUtil.java',434,482,'downloadFile',['F02'],'state_changes')
add(56,'HttpClientUtil 默认 ignoreSslVerify=false，TLSv1.2/1.3加DefaultHostnameVerifier；显式开关true进入信任所有证书及NoopHostnameVerifier分支。本事实不证明运行环境开关值。',U+'HttpClientUtil.java',60,122,'buildSslSocketFactory',['F02'],'dependencies')
add(57,'CacheUtils 的无TTL参数 put 固定传8小时；remove先删键、运行consumer，再经DelayQueueUtils安排一次延迟删键。该通用删除设施本身不证明每个业务缓存均接入。',U+'CacheUtils.java',28,88,'put/remove',['F01','F03'],'dependencies')
add(58,'Ehcache配置预定义 de_v3_dataset_table/de_v3_dataset_field，使用 common-cache 的 expiry none；结合 DefaultCacheImpl 复用已存在cache的分支，不能将CacheUtils的8小时参数直接解释为这两个预建缓存的实际TTL。','core/core-backend/src/main/resources/ehcache/ehcache.xml',13,21,'common-cache',['F01','F03'],'dependencies','configured')
d['facts'][-1]['evidence'] += [ev('core/core-backend/src/main/resources/ehcache/ehcache.xml',147,156,'dataset cache aliases'),ev('sdk/common/src/main/java/io/dataease/cache/impl/DefaultCacheImpl.java',30,43,'put')]
add(59,'DatasetCacheManage 提供表名/字段名写读和表校验；表列表通过 DatasourceServer.getTables 刷新写入，字段缓存读取未命中返回null；该类源码没有删除/失效方法。限定主仓库源码检索未找到这两个缓存名的显式删除调用，不能据此承诺更新后即时失效。',B+'dataset/manage/DatasetCacheManage.java',24,95,'DatasetCacheManage',['F01','F03'],'invariants')
add(60,'内置类型枚举包括folder/API/Excel/ExcelRemote、mysql/impala/mariadb/StarRocks/es/doris/TiDB/oracle/pg/kingbase/gaussdb/redshift/db2/ck/h2/sqlServer/mongo，并声明标识符引号元信息；这是枚举能力而非每种类型在用户入口可创建的保证。','sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/vo/DatasourceConfiguration.java',13,34,'DatasourceType',['F01'],'data')
add(61,'preCheckDs 从内置枚举移除h2，License有效时追加已安装插件类型，其余类型拒绝。因此Factory可路由h2与用户新建入口接受h2并非同一契约。',B+'datasource/server/DatasourceServer.java',1213,1224,'preCheckDs',['F01'],'preconditions')
add(62,'Calcite getConnection 将mysql/StarRocks/doris/TiDB/mariadb/mongo配置按Mysql读取并设置MariaDB驱动；impala/sqlServer/oracle/db2/pg/kingbase/gaussdb/redshift/h2/ck各自解析对应配置类，之后进入SSH会话及驱动连接构造。',B+'datasource/provider/CalciteProvider.java',593,641,'getConnection',['F01'],'implementation')
add(63,'EsProvider 的getSchema返回空列表；getTables通过show tables查询并过滤点开头表名；getConnection返回null，区别于Calcite JDBC连接入口。',B+'datasource/provider/EsProvider.java',26,54,'getSchema/getTables/getConnection',['F01'],'implementation')
add(64,'引擎Provider选择器按 datasourceType+Engine 查Bean；类型为空才回退MysqlEngineProvider，不能把全部查询数据源类型等同于已实现的存储引擎类型。',B+'datasource/provider/ProviderUtil.java',6,16,'getEngineProvider',['F01','F02'],'dependencies')
# 每个引擎是单独可追溯清单项
engine_items=[('Mysql',23,28,93,95,114,118,'mysqlEngine；反引号；CREATE TABLE IF NOT EXISTS；无需先查表'),('Pg',22,27,97,99,118,122,'pgEngine；双引号；CREATE TABLE IF NOT EXISTS；无需先查表'),('H2',15,20,70,72,91,95,'h2Engine；双引号；CREATE TABLE IF NOT EXISTS；无需先查表'),('Oracle',18,21,30,32,110,114,'oracleEngine；双引号；CREATE TABLE；需先查表'),('Dm',18,21,30,32,110,114,'dmEngine；双引号；CREATE TABLE；需先查表'),('SqlServer',24,29,107,109,128,131,'sqlServerEngine；方括号；CREATE TABLE；需先查表')]
index=[]
for n,(name,a,b,c,e,f,h,desc) in enumerate(engine_items,65):
 p=B+'datasource/provider/'+name+'EngineProvider.java';fact=add(n,desc+'，createTableSql从传入表字段构造DDL；此处仅核实入口及建表存在性/引用规则。',p,a,b,name+'EngineProvider',['F02'],'dependencies');fact['evidence'] += [ev(p,c,e,'needCheckExistTable'),ev(p,f,h,'createTableSql')];index.append({'name':name,'entry':p,'difference':desc,'fact_id':fact['id']})
add(71,'kingbaseEngine直接继承PgEngineProvider且本类无方法覆盖；StarRocksEngine继承MysqlEngineProvider并覆盖建表，DDL包含HASH分布、10个bucket和replication_num=1。',B+'datasource/provider/KingbaseEngineProvider.java',10,12,'KingbaseEngineProvider',['F02'],'dependencies')
d['facts'][-1]['evidence'].append(ev(B+'datasource/provider/StarRocksEngineProvider.java',19,42,'StarRocksEngineProvider/createTableSql'))
add(72,'Excel文件访问Regression是独立main资产，构造用户101/202临时文件并断言跨用户、新建认领历史文件、越界/相对/穿越/非法文件名/符号链接拒绝，另调用真实ExcelUtils.fetchDataList；本轮只读未执行。','tests/excel-file-access/Regression.java',36,111,'Regression.main',['F02'],'tests')
add(73,'remote-response Regression搭建本地随机端口HTTP服务，断言声明/分块/gzip超量、错误状态、慢响应与响应头时限、API配置传递、部分文件清理、CSV引号及100行预览、双sheet XLS/XLSX全量与预览、ZIP压缩比拒绝；本轮未执行。','tests/remote-response/Regression.java',21,92,'Regression.main',['F02'],'tests')
add(74,'后端SmbFileDownloaderRegression验证domain序列化与旧配置兼容、非法SMB地址/扩展名/空用户名拒绝；真实下载及错误密码/不存在文件测试仅在SMB_TEST_URL存在时执行，否则明确SKIP。本轮没有运行任何分支。',B.replace('src/main/java','src/test/java')+'datasource/provider/SmbFileDownloaderRegression.java',20,104,'SmbFileDownloaderRegression.main',['F02'],'tests')
# Update limits, relations, read log
for c in d['capabilities']:
 c['limits']=[x for x in c['limits'] if 'tests 为空' not in x and '远程下载协议及所有解析格式未穷尽' not in x]
 c['limits'].append('测试资产只在F02建立静态关联，均未运行；F01/F03未关联独立测试资产。')
 if c['id']=='F02':c['limits'].append('已补读文件解析、HTTP限额/时限及现有回归；真实FTP/SMB网络、所有API参数组合与方言运行行为仍未验证。')
seen={(x['from'],x['to']) for x in d['relations']}
for c in d['capabilities']:
 for fid in sorted(set(sum(c['contract'].values(),[]))):
  if (c['id'],fid) not in seen:d['relations'].append(dict(id=f"DATA-R{len(d['relations'])+1:03}",type='CAPABILITY_REALIZED_BY',**{'from':c['id'],'to':fid},evidence_fact_ids=[fid]))
for fact in d['facts'][43:]:
 for e in fact['evidence']:
  en=next((x for x in r['entries'] if x['path']==e['path']),None)
  if not en:en=dict(path=e['path'],sha256=e['sha256'],ranges=[]);r['entries'].append(en)
  en['ranges'].append(dict(start_line=e['start_line'],end_line=e['end_line'],symbol=e['symbol'],method='v2亲读源码/测试资产；未运行'))
r['searches']=[dict(scope=['core/core-backend/src','sdk'],method='rg --no-ignore -n',pattern='DATASET_TABLE_CACHE|DATASET_FIELD_CACHE|de_v3_dataset_table|de_v3_dataset_field|cacheFieldsByTable|cacheTablesByDatasource',result='仅常量、XML配置、DatasetCacheManage及DatasourceServer.getTables写入命中；未发现显式删除调用。源码搜索结论不等于运行期无动态失效。')]
for x in g['gaps']:
 if x['id']=='DATA-G01':x['uncertainty']='已建立内置类型、Factory及8类引擎静态差异清单；运行期方言与外部插件仍未验证。'
 if x['id']=='DATA-G04':x['uncertainty']='已补读CSV/Excel主要解析边界、远程文件预算、API参数入口与HTTP执行器控制；真实FTP/SMB及全部参数组合运行表现未验证。';x['next_action']='仅运行范围保留：隔离网络及文件夹具执行既有回归。'
 if x['id']=='DATA-G05':x['uncertainty']='已亲读并关联三项文件/API回归源码；本轮未运行，因此不能给出通过率。'
 if x['id']=='DATA-G06':x['uncertainty']='静态调用链已补读：主仓库搜索未见数据集表/字段缓存显式删除；Ehcache预建缓存expiry none与默认put八小时存在不同层语义。运行配置/并发和刷新时效未验证。';x['next_action']='针对实际启用缓存配置验证更新后的可见性，必要时另立修复任务。'
g['resolved_static_gaps']=['CSV/Excel主要解析失败边界','API网络执行器大小/总时限/错误状态控制','缓存写入读取和通用删除设施及预建配置差异','内置Provider类型、连接分派和引擎差异索引','已有文件/API/SMB回归测试资产关联']
for name,obj in [('candidate',d),('read-log',r),('gaps',g)]: (O/(name+'.json')).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
(O/'provider-index.json').write_text(json.dumps({'scope':'静态Provider路由与存储引擎入口清单；不是运行支持认证','query_provider_facts':['DATA-006','DATA-060','DATA-061','DATA-062','DATA-063'],'engine_selector_fact':'DATA-064','engines':index+[{'name':'Kingbase','fact_id':'DATA-071','difference':'继承Pg无覆盖'},{'name':'StarRocks','fact_id':'DATA-071','difference':'继承Mysql；自定义HASH建表'}]},ensure_ascii=False,indent=2)+'\n')
print('facts',len(d['facts']),'relations',len(d['relations']))
