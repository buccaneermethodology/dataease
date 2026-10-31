# 本地测试底图环境方案 r002

承接用户直接授权“允许准备并配置本地测试底图”；r001保留。本交付物设计审查第2/3轮。保持P1 12+P2 26=38义务、49类型分母。只影响隔离实例localhost:7070/8100、MySQL socket的dataeasev3（@@port=3307），不得触碰S01资源、其他库、供应商凭据或真实权限。

## 已核实与改动范围
本轮通过既有私密mysql-root.cnf只读查询DATABASE()/@@port及精确14键；14键当前全部缺失，未读取无关配置或输出秘密。此前TCP密码身份不匹配失败；实际可用的是既有本机socket，禁止改账号或打印配置。上述只读观察不是写前快照；保存前再次精确保全并作漂移守卫。
文件与渲染设计维持r001：唯一新增public/s02-test-basemap/style-r001.json，MapLibre v8、内联自生成经纬网格，background+line，不含外部URL/fonts/sprites/tiles/key。纬度[-80,80]，经纬10度间隔，线段按5度采点，避免横跨±180歧义。metadata和署名标识仅本地功能测试；URL /s02-test-basemap/style-r001.json，vector，zoom0–18。文件不存在才创建，已有不同字节拒绝覆盖。生产代码不变，不安装或部署。

## B1/B2修正：原始保全及精确恢复
不再承诺只从UI恢复空态。保存前以已有MySQL本机socket、既有凭据文件只读执行参数范围固定的查询，取core_sys_setting精确14键全部列id/pkey/pval/type/sort；记录缺失键并拒绝重复pkey。键为map.mapType及customTile.map.下serviceType,tileUrl,styleUrl,tileScheme,tileSize,tileMinZoom,tileMaxZoom,tileAttribution,styleAttribution,tileAttributionEnabled,styleAttributionEnabled,key,securityCode。未匹配行不读，gaode/qq/tianditu密钥不读。
精确原始JSON备份写本机/private/tmp下唯一随机目录0700、文件0600；不写入仓库。执行证据只保存备份路径、SHA256、14键存在/空布尔与库端口身份，不保存原值/URL。保存前重读同范围原始行并逐字节比较快照；漂移则拒绝保存并重新评估，不覆盖他人配置。临时目录可能被系统清理；只有备份实际存在且摘要一致才允许后续恢复，不能宣称永久备份。
配置经现有登录后的正常在线地图UI，预览实际网格且无资源错误后保存custom。原14键缺失时API/UI不能表达精确删除，故回退使用单独的本机事务恢复工具，不伪造key，不改产品UI，不绕鉴权。保存后立即读取14键全部原始行至私密after.json，确认13个custom字段和map.mapType符合本次无秘密payload且其他行字段可解释。恢复工具默认dry-run：使用事务SERIALIZABLE+SELECT ... FOR UPDATE锁住精确14键范围，当前全部行必须与after.json一致（id及所有字段），before/after摘要与实例身份均须匹配；有任何漂移/重复键/缺备份则ROLLBACK退出。只删除after独有行、更新before已有行、重建before确有而after缺失行；SQL字符串用UTF8 hex literal，不拼接原值，不操作范围外键，不修改其他供应商配置。当前实测before为空，实际恢复仅会删除本次新增14行，不做数据库整库回滚。工具生成同事务最终读回与before逐字段一致校验；dry-run最终ROLLBACK并重读当前after未变；显式apply才COMMIT，随后独立读回before。恢复仅用于撤销本次已授权隔离配置，不执行普通业务数据删除。
正常保持本地fixture配置供开发复用，不在本轮立即恢复为不可用空地图；在保存后执行一次恢复dry-run验证可执行性，结果只称事务回滚演练。若恢复工具未准备好、备份失败、前态漂移、预览失败、保存后状态无法解释，则不继续后续地图验收；保存已发生时优先保护证据并按守卫恢复，不能重复覆盖。

## 执行准入及验证
根Agent创建/核验本环境独立topology、Context、admission；分别绑定唯一fixture路径与local://127.0.0.1:7070/dataeasev3/online-map。写前记录Git基线/状态、新fixture不存在、原始用户授权；私密备份不进入Git。文件准备已获r001分阶段通过，可独立执行。配置保存须本r002获独立通过、工具及私密快照准备就绪才执行。全局map.mapType会影响隔离实例所有后续在线地图客户端；本轮不声称不影响其他客户端，重开页面读回mapStore。
静态JSON检查version/sources/layers/有限坐标及无远程引用；本机HTTP200并比对字节；实际MapLibre预览网格；保存后离开重开在线地图，核provider/配置，后端原始只读核验；恢复dry-run。随后重新进入S02测试dashboard，对flow/heat/symbolic分别正常UI合法轴、双向复制粘贴、每次1逻辑query、500与200独立oracle、显式保存离开重开。不得用HTTP200、可保存按钮、SDK替身测试或DB配置成功代替实际地图图层通过。日志不夹带前态秘密，新的无秘密测试设置截图可落盘。

## 证据上限与失败恢复
当前正式CUA入口消失、旧会话不可读取，正在用已安装Chrome/Playwright恢复本机正常UI能力；不安装浏览器、不读取旧用户profile或会话凭据。新浏览器若需要登录而无已授权可用入口，保留UI验收未验证并推进独立工作。只声明实际观察层；底图不是生产地理数据，不证明商业服务、地理准确性、跨入口、权限、MVP或Goal完成。r001 B1/B2逐项由原始14键保全和精确守卫事务恢复替代，其他范围与无秘密限制保留。
