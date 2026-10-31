import json,hashlib,pathlib
R=pathlib.Path('.')
B='core/core-backend/src/main/java/io/dataease/'
S='sdk/api/api-base/src/main/java/io/dataease/api/'
E='sdk/common/src/main/java/io/dataease/dao/auto/entity/'
X='sdk/extensions/extensions-datasource/src/main/java/io/dataease/extensions/datasource/'
paths={'ds':B+'datasource/server/DatasourceServer.java','dm':B+'datasource/manage/DataSourceManage.java','dg':B+'dataset/manage/DatasetGroupManage.java','dd':B+'dataset/manage/DatasetDataManage.java','dt':B+'dataset/server/DatasetTreeServer.java','dsrv':B+'dataset/server/DatasetDataServer.java','sql':B+'dataset/manage/DatasetSQLManage.java','cache':B+'dataset/manage/DatasetCacheManage.java','jpa':B+'config/JpaUpdateNonNullAspect.java','init':B+'listener/InitSqlListener.java','calc':B+'datasource/provider/CalciteProvider.java','fac':X+'factory/ProviderFactory.java','api':S+'ds/DatasourceApi.java','dapi':S+'dataset/DatasetDataApi.java','tapi':S+'dataset/DatasetTreeApi.java','fd':'core/core-frontend/src/api/datasource.ts','ft':'core/core-frontend/src/api/dataset.ts','sync':B+'datasource/manage/DatasourceSyncManage.java','excel':B+'datasource/provider/ExcelUtils.java','http':B+'datasource/provider/ApiUtils.java','jc':'sdk/common/src/main/java/io/dataease/cache/impl/DefaultCacheImpl.java','rc':'sdk/common/src/main/java/io/dataease/cache/impl/RedisCacheImpl.java','ed':E+'CoreDatasource.java','eg':E+'CoreDatasetGroup.java','et':E+'CoreDatasetTable.java','ef':E+'CoreDatasetTableField.java','repo':B+'datasource/dao/auto/repository/CoreDatasourceRepository.java','grepo':B+'dataset/dao/auto/mapper/CoreDatasetGroupRepository.java','tm':B+'dataset/manage/DatasetTableManage.java'}
facts=[]
def add(n,text,key,a,b,symbol,scope='当前 V3 已读源码；静态实现事实，不代表运行验证'):
 p=paths[key];facts.append(dict(id=f'DATA-{n:03}',statement=text,kind='implemented',scope=scope,evidence=[dict(path=p,start_line=a,end_line=min(b,len((R/p).read_text().splitlines())),symbol=symbol,sha256=hashlib.sha256((R/p).read_bytes()).hexdigest())]))
add(1,'前端数据源模块使用统一 request 封装；保存及更新前执行 nameTrim，分别 POST /datasource/save 与 /datasource/update，读取响应 data。','fd',101,119,'save/update')
add(2,'DatasourceApi 声明保存/更新输入为 BusiDsRequest、输出 DatasourceDTO；validate/{id}、删除、详情声明 manage，getSimpleDs/getTableField/getTables 声明 read 权限。这是接口注解声明，不能单独证明运行鉴权。','api',45,142,'DatasourceApi')
add(3,'数据源 save 在正 ID 输入时转 update；否则解码 configuration、执行 Excel 文件与前置检查、生成 snowID 和审计时间；连接状态检查异常只置 Error，随后仍调用 innerSave。','ds',296,324,'save')
add(4,'innerSave 经 datasourceResourceTree 的 XpackInteract 后置钩子，检查名称非空及同级重复后 saveAndFlush，并登记最近新增操作；查重排除自身且区分 folder 与非 folder。','dm',128,171,'innerSave/checkName')
add(5,'validate 请求解码 configuration、执行 preCheckDs 与 checkDatasourceStatus，只返回 type 和 status；getSchema 将请求转换为 DatasourceRequest 并委派所选 Provider。','ds',575,601,'validate/getSchema')
add(6,'ProviderFactory 对 es 选择 esProvider，对内置枚举类型选择 calciteProvider；其他类型走插件缓存且要求有效 License，缺实例抛插件异常；默认 Provider 为 calciteProvider。','fac',23,48,'getProvider/getDefaultProvider/getInstance')
add(7,'CalciteProvider.checkStatus 对 pg、kingbase、gaussdb 先确认 schema 存在，再建立连接执行表列表 SQL；成功返回 Success，异常向上传播。','calc',223,266,'checkStatus')
add(8,'getTables 拒绝不存在的数据源；API 走反射 getApiTables，Excel 类型走 ExcelUtils，其余走 Provider；Oracle 额外过滤回收站名称，返回前缓存表名。','ds',858,901,'getTables/isOracleRecycleBinName')
add(9,'数据源 update 缺 ID 时转 save；存在 ID 时读取旧配置并保留原 pid，解码新配置和执行前置检查，更新审计人/时间；状态校验失败置 Error。','ds',425,451,'update')
add(10,'数据源删除支持虚拟组织根目录只递归子节点；递归删除 Excel/API 时删除引擎表，API 另删同步任务，再删元数据；普通数据库类型调用 calciteProvider.delete；folder 继续递归。','ds',742,820,'delete/recursionDel')
add(11,'CoreDatasource 是 core_datasource 的 JPA 实体，Long ID；name/type/configuration/createTime/updateTime 非空，configuration 指定 EncryptDecryptConverter，另保存状态、任务状态及同步实例。此处只证明转换器绑定。','ed',12,92,'CoreDatasource')
add(12,'CoreDatasourceRepository 继承 JpaRepository 和 JpaSpecificationExecutor；状态及移动辅助方法在事务中查询实体、修改字段并 saveAndFlush；元数据仓储与分析查询 Provider 是不同路径。','repo',11,61,'CoreDatasourceRepository')
add(13,'uploadFile 按文件扩展名白名单拒绝不支持格式，解析并保存文件后合并编辑配置，检查每个 sheet 内字段名称大小写不敏感重复并抛错，返回 ExcelFileData。','ds',1014,1037,'uploadFile')
add(14,'ExcelUtils 上传解析流程校验文件名、解析并过滤无字段 sheet，持久保存上传文件；为各 sheet 生成物理表名及 UUID，保存路径、文件名、更新时间和大小，映射 TEXT/DATETIME/LONG/DOUBLE 为 DE 类型 0/1/2/3。','excel',284,350,'excelSaveAndParse')
add(15,'loadRemoteFile 解码用户名和密码后调用 parseRemoteExcel，读取已有数据源并合并编辑配置，同样拒绝 sheet 重复字段；本候选不包含任何真实凭据。','ds',1039,1059,'loadRemoteFile')
add(16,'追加模式合并 Excel 配置按 sheet 表名匹配；单 CSV 且仅一张目标表时允许按字段匹配而不要求文件名；仅字段兼容的 sheet 保留旧物理表名并进入结果。替换模式按表名合并旧字段配置。','ds',1063,1100,'mergeExcelEditConfig')
add(17,'新建本地 Excel 数据源先建立引擎表，再以 all_scope 抽取；API/远程 Excel 建立引擎表并保存同步任务，默认开始时间取当前时间前20秒，RIGHTNOW 清空 cron，非即时任务拒绝结束早于开始。','ds',324,405,'save')
add(18,'DatasourceSyncManage.createEngineTable/dropEngineTable 从当前引擎选择 Provider 与 EngineProvider，后者生成 DDL；needCheckExistTable 为真时先查表存在性，之后通过 Provider.execDDL 执行。','sync',342,378,'createEngineTable/dropEngineTable')
add(19,'同步调度 RIGHTNOW 创建一次性 ExtractDataJob，其他模式创建 cron job；结束时间为空或0表示无结束，已过期结束时间删除调度并返回。Job/Trigger 标识绑定任务 ID 和数据源 ID。','sync',380,397,'addSchedule')
add(20,'本地 Excel all_scope 抽取建立临时表、抽取后替换原表；成功记 Completed，异常尝试删临时表、记 Error 并抛异常，主键重复给专门提示；finally 保存任务日志。','sync',55,98,'extractExcelData')
add(21,'API extractedData 按表抽取；all_scope 使用临时表和替换，成功或失败均记录结束时间；异常记 Error 并尝试清临时表，finally 保存日志，本方法 catch 不重新抛出该异常。','sync',141,175,'extractedData')
add(22,'ApiUtils.getApiTables 从 configuration 的 ApiDefinition 列表生成表名/显示名/数据源ID，跳过空定义及 type=params；字段接口按物理表名查配置，异常被捕获后返回当前字段列表。','http',77,96,'getApiTables')
add(23,'API 抽取返回 fieldList 与 dataList；pageNumber 根据响应路径读取页数/总条数并按页请求，cursor 模式持续请求直到游标缺失、解析失败或与前一游标相同；无分页直接请求解析。缺少 API 定义抛 未找到。','http',113,173,'fetchApiResultField')
add(24,'checkAPIStatus 跳过参数定义，对每个 API 单独调用取数；成功/异常分别产出 Success/Error 项并序列化整个列表为字符串，不是统一单值连接状态。','http',198,221,'checkAPIStatus')
add(25,'前端创建/保存数据集先 nameTrim、cloneDeep 和 originNameHandle；请求 /datasetTree/create 或 /save 后还原返回字段。预览请求也复制、处理字段并还原响应 allFields 和 data.fields。','ft',81,104,'saveDatasetTree/createDatasetTree')
add(26,'DatasetTreeApi 声明保存/重命名/删除需目标 manage，新建需父节点 manage，移动需目标及父节点 manage，导出需 export；输入主要是 DatasetGroupInfoDTO 或资源删除/导出请求。','tapi',30,108,'DatasetTreeApi')
add(27,'DatasetTreeServer 创建与保存均委派 DatasetGroupManage.save(false,true)，重命名一般用(true,false)，组织根重命名调用 innerEdit；读取预览调用 getDatasetGroupInfoDTO(id,preview)。','dt',41,96,'save/create/rename/get')
add(28,'DatasetGroupManage.save 是事务入口：dataset 非重命名且无 allFields 时拒绝；构建 union SQL/关系JSON；新建生成 ID、审计字段和默认 pid=0，更新拒绝 id=pid；dataset 节点保存表与字段并清理不再引用项，按 encode 参数编解码。','dg',99,167,'save')
add(29,'saveTable 递归遍历 union/childrenDs；新建数据集若表 ID 已存在则拒绝；每表绑定 datasetGroupId。saveField 在 union 非空时先预览1行，已有字段保留内部别名；新计算字段生成短名，新分组字段固定文本维度并选中。','dg',364,432,'saveTable/saveField')
add(30,'DatasetTableManage 保存前限制显示名和物理表名不超过100字符，使用 JPA saveAndFlush；更新清理只有保留 ID 列表非空时执行 deleteByDatasetGroupIdAndNotInIds。','tm',25,72,'save/deleteByDatasetGroupUpdate/checkNameLength')
add(31,'DatasetDataServer 编辑预览固定 start=0,count=100,checkPermission=false,encode=true；已保存数据集的 getDatasetGroupInfoDTO 预览则传 checkPermission=true,encode=false。两条入口不得合并为同一权限语义。','dsrv',25,28,'previewData')
# 附加跨文件证据
facts[-1]['evidence'].append(dict(path=paths['dg'],start_line=496,end_line=540,symbol='getDatasetGroupInfoDTO',sha256=hashlib.sha256((R/paths['dg']).read_bytes()).hexdigest()))
add(32,'previewDataWithLimit 解码后拒绝空字段，构建 union SQL；checkPermission=true 时过滤列权限并在无列权限时拒绝，有用户时加载行权限；检查数据源状态，非跨源且不支持 full join 的类型拒绝 full join。','dd',229,276,'previewDataWithLimit')
add(33,'预览跨源选默认 Provider，非跨源按数据源类型选择；构造表、字段、行权限过滤和排序 SQL，再按 start/count 生成分页 SQL、Provider 重建 SQL、传递 prepared 参数并 fetchResultField；返回 data/allFields 和 Base64 SQL。','dd',268,316,'previewDataWithLimit')
add(34,'getTableFields 对 DB 验证表名；DB/SQL 源为 Excel/API 时切换 DE 引擎，Error 状态拒绝；SQL 输入 Base64 解码并处理默认参数为 prepared 值，DB 用零行查询获取字段，Es 使用专属 Provider。','dd',105,210,'getTableFields')
add(35,'DatasetDataApi 的 tableField 与 previewSql 声明数据源 read；DatasetDataServer 的枚举值及树值接口在异常时记录日志并返回 null，不能把 null 自动解释为确实无值。','dsrv',44,91,'getFieldEnumDs/getFieldEnum/getFieldEnumObj/getFieldValueTree')
add(36,'CalciteProvider.fetchResultField 在 isCross 为空或 false 时委派 JDBC；跨源使用 Calcite PreparedStatement 绑定参数，返回字段元信息及行数据，查询失败转 i18n_fetch_error，finally 尝试关闭结果集与语句。','calc',287,336,'fetchResultField')
add(37,'JDBC 取数使用 dsList 首个源及连接池连接；有 prepared 值时按 JDBC 类型绑定，Oracle 字符串另处理字符集/CLOB；SQL 异常转 SQL ERROR，其他异常转 Datasource connection exception，连接由 try-with-resources 关闭且 finally 关闭结果集。','calc',680,746,'jdbcFetchResultField')
add(38,'CoreDatasetGroup 保存 folder/dataset 类型、父级、关系JSON、unionSql、跨源标记及审计字段；CoreDatasetTable 保存数据源/数据集关联、表名、类型、info及SQL参数；字段实体区分 originName、展示名、内部唯一名、DE类型与原始类型、扩展字段和选中标记。','eg',14,100,'CoreDatasetGroup')
for key,end,sym in [('et',53,'CoreDatasetTable'),('ef',134,'CoreDatasetTableField')]:facts[-1]['evidence'].append(dict(path=paths[key],start_line=12,end_line=end,symbol=sym,sha256=hashlib.sha256((R/paths[key]).read_bytes()).hexdigest()))
add(39,'JpaUpdateNonNullAspect 拦截 JpaRepository 四种 save 方法；集合逐项按ID读旧实体并复制非空可赋值属性，空值不复制；无ID/无旧实体返回原对象。合并异常记录后退回原对象继续 proceed，不能当作完整 PATCH 或并发控制。','jpa',36,134,'around/mergeEntityIfExists/copyNonNullProperties')
add(40,'InitSqlListener 启动时收集 SqlBlock，按1、2、3版本组及版本排序执行；最后记录 success=false 时允许重试该版本；每块先保存失败状态，执行异常抛运行异常阻断启动，成功后更新耗时和 success=true。','init',21,102,'run/executeGroups/executeSql')
add(41,'DatasetCacheManage 只缓存表名/字段原始名；表键是数据源ID，字段键为数据源ID_表名。表缓存未命中查询数据源，字段缓存未命中返回null；表列表为空时 validateTable 放行，否则大小写不敏感校验。','cache',24,95,'DatasetCacheManage')
add(42,'JCache 实现按 spring.cache.type=jcache 启用，在首次创建 cache 时确定 ModifiedExpiryPolicy，expTime<=0 默认一分钟且 storeByValue=false；后续 put 复用已有 cache 配置。','jc',19,98,'put/configuration/defaultConfiguration')
add(43,'Redis 实现按 spring.cache.type=redis 启用，实际键为 cacheName::key；expTime<=0 直接set不设过期，否则按键设置TTL，unit为空用秒；take 通过Lua GET+DEL。','rc',19,69,'put/take')
for number,key,a,b,sym in [(1,'fd',1,2,'request import'),(22,'http',180,196,'getTableFields'),(25,'ft',198,211,'getPreviewData'),(35,'dapi',27,35,'tableField/previewSql')]:
 p=paths[key]
 facts[number-1]['evidence'].append(dict(path=p,start_line=a,end_line=b,symbol=sym,sha256=hashlib.sha256((R/p).read_bytes()).hexdigest()))
contracts={
'F01':{'trigger':[1,2],'inputs':[2,3],'outputs':[5,8],'preconditions':[4,7],'state_changes':[3,9,10,12],'postconditions':[3,4,5],'invariants':[4,9,11],'failures':[3,6,7,8],'permissions':[2],'implementation':[3,4,6,7,8,9,10],'dependencies':[6,39,40,42,43],'data':[11,12],'tests':[]},
'F02':{'trigger':[13,15,17],'inputs':[13,15,16,22],'outputs':[13,14,23,24],'preconditions':[13,16,17],'state_changes':[14,17,18,19,20,21],'postconditions':[20,21,23,24],'invariants':[16,18,22],'failures':[13,17,20,21,23,24],'permissions':[2],'implementation':[13,14,15,16,17,18,19,20,21,22,23,24],'dependencies':[6,18,19,40],'data':[11,14,22],'tests':[]},
'F03':{'trigger':[25,26,27,31],'inputs':[25,26,28,34],'outputs':[31,33,35,38],'preconditions':[28,30,32,34],'state_changes':[28,29,30],'postconditions':[28,29,33],'invariants':[29,30,31,38,39],'failures':[28,30,32,35,36,37],'permissions':[26,31,32,35],'implementation':[27,28,29,31,32,33,34,36,37],'dependencies':[6,39,40,41,42,43],'data':[38],'tests':[]}}
names={'F01':'创建和管理数据源','F02':'文件/API 数据接入','F03':'建立和管理数据集'}
limits=['仅覆盖已读主仓库 V3 静态实现，未启动服务、连接数据库或访问远端。','未执行测试；tests 为空表示本轮没有已读测试资产支撑，不能声明测试通过。','权限仅核实声明与核心调用分支，未读取专有 XPack 实现，也未验证实际不同身份的允许/拒绝。']
caps=[dict(id=k,name=names[k],depth='core',summary=names[k]+'的输入输出、状态变化、错误和依赖契约；具体断言见引用事实。',contract={d:[f'DATA-{n:03}' for n in ns] for d,ns in v.items()},limits=limits+(['仅核实上传/解析入口、内置API分页和同步编排；远程下载协议及所有解析格式未穷尽。'] if k=='F02' else [])) for k,v in contracts.items()]
rels=[]
for c in caps:
 for f in sorted(set(sum(c['contract'].values(),[]))):rels.append(dict(id=f'DATA-R{len(rels)+1:03}',type='CAPABILITY_REALIZED_BY',**{'from':c['id'],'to':f},evidence_fact_ids=[f]))
out=R/'Dashboard/Artifacts/SP-001/extraction/data'
(out/'candidate.json').write_text(json.dumps(dict(doc_id='data',title='数据源、文件/API接入与数据集',domains=['K03','K04','K05'],facts=facts,capabilities=caps,relations=rels),ensure_ascii=False,indent=2)+'\n')
read={}
for f in facts:
 for e in f['evidence']:
  read.setdefault(e['path'],[]).append(dict(start_line=e['start_line'],end_line=e['end_line'],symbol=e['symbol'],method='亲读源码片段；cat/sed工具输出'))
(out/'read-log.json').write_text(json.dumps({'lane':'data','claim_ceiling':'已亲读的候选事实；无独立验证结论','entries':[{'path':p,'sha256':hashlib.sha256((R/p).read_bytes()).hexdigest(),'ranges':rs} for p,rs in read.items()]},ensure_ascii=False,indent=2)+'\n')
gaps=[('DATA-G01','全部数据库方言、Provider和插件尚未逐项执行。','需要隔离数据库与方言回归，插件实现按专有边界另审。'),('DATA-G02','完整鉴权切面及XPack权限实现不在本lane深读范围。','与access lane拼接静态调用证据；实际身份矩阵需运行验证。'),('DATA-G03','迁移只核实调度器成功/失败/重试状态，未逐个证明SqlBlock幂等。','按实际历史版本和目标数据库建立隔离升级验证。'),('DATA-G04','CSV/Excel解析细节、远程下载协议及HTTP执行器未穷尽；分页算法按源码记录而非正确性背书。','补读具体解析与网络执行器；使用受控文件和API分页夹具验证。'),('DATA-G05','未运行测试或读取对应测试文件，不能给出通过率。','独立验证按产品核心场景补充静态复核或隔离测试证据。'),('DATA-G06','缓存失效全调用链与并发/引用共享未全面验证。','针对元数据修改后读表字段与JCache/Redis分别验证。'),('DATA-G07','元数据事务与引擎DDL/文件写入跨资源原子性不由@Transactional自动证明。','用失败注入核实部分接入失败时回滚/补偿行为。')]
(out/'gaps.json').write_text(json.dumps({'lane':'data','gaps':[dict(id=i,uncertainty=u,next_action=n) for i,u,n in gaps]},ensure_ascii=False,indent=2)+'\n')
print('facts',len(facts),'capabilities',len(caps),'relations',len(rels))
