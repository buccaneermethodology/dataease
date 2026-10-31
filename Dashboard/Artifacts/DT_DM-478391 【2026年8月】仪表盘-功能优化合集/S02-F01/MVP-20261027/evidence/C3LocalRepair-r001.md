# C3 富文本独立反例局部修复候选 r001

记录时间：2026-10-27T07:25:46.806081+00:00。Builder为`/root/line_construction_builder`，原C3作者为R；本轮不是独立Validation。当前仅给出C3V-001..003局部修复候选与自检，待独立第2/3轮；V004经独立审查者与父代理撤销。不能声明真实TinyMCE、22项MVP、49逐type或原Goal完成。

## 原始范围、准入与勘误

原Goal仍为同页同编辑会话、明确权限测试桩下全部支持图表的基本多条件整树复制粘贴。四个独立finding来自`reviews/SliceC3Validation-r001.md`，原字节SHA `b6f154974122a0220fff6f431cf78bda237bd5541cafb4b74360f5bbd10be211`，完整读取并先复放其附录A/B。原16项、冻结tiny-normal/tiny-compare fixture和原主case/type分母保留；未将通用异步/全面资源治理迁回本任务。

已复验卡`planning/s02-mvp-c3-local-repair-r001-card.json`，canonical SHA `74751d7fdd307fbf578639898e690570239bc1bbfdc0f4a40300a65cd7588c0f`、Context、全部required-read SHA及5条精确admission均exit0。生产/runner/README先写入准入目录`MVP-20261027/c3-local-before-r001/`，manifest SHA `317c63abb1a8ead3bd81f36a48095d345993885ab97f6cc83943d6c0a320dc44`。写前SFC为`4122e4684425e211e09b3975ae3a4deba6d3d8031cabe25712b860c5ef465322`；写前runner为`12d290a096250c9f823ae3fd45cd6356433a72c795be982da0641da36031766d`；写前README为`e97bc39ac8e593025e178ef63ac00fe6984ebaeb739564c2b2f4c20d0f657a89`。runner在读取原SFC时核原SHA，未重写snapshot或旧报告。

执行中独立审查者与父代理共同更正：C3V-004原probe在active后令s.stale，不对应真实wrapper传入的isCurrent；实际active分支基于activeKey/!unmounted，已与结清operation脱离。因此V004为false positive，撤销产品修复要求，保留原合法active契约。已撤回针对V004的临时改动；最终jumpTargetAdaptor完整区块与写前逐字节相等，成功边界仍消费真实currentPaste，不绕过activeKey失效。新增runner只留active current有效和dispose两个原契约对照，不把它们作为已修V004。旧独立报告冻结，未偷偷回写结论或SHA。finding数由4变为3是证据勘误，不删除原始AC。

## 独立反例复放与全部处置

### C3V-001 / P1：内容fulfilled后已知错误跨越成功边界

附录实际复放：normal/compare×Error/remove四个2微任务案均resolvedBeforeError=false、ok=true；remove body.connected=false仍ok。已知failure与Editor身份/initialized/body连通/尺寸/真实getContent与body内容分别复核于取得Editor、SetContent的nextTick、内容Promise完成、外层race返回及handle.metadata采用前读取。Error无payload时也记录非空failure，避免truthy检查漏判。

handle metadata保持prepare时固定的fields/drill/innerType/render对象，getter仅复核当前Editor与内容，不再次setContent/query。已读实际wrapper：metadata在任何canonical/Store同步发布之前读取，其异常走原catch。此为静态接线依据，当前runner并未挂完整wrapper+Tiny生产Editor，不能冒称真实发布实测。

新增2/3微任务案要求prepare返回false。4微任务可能已在prepare内部return并fulfilled、但观察者.then尚未执行，JavaScript无法撤销该Promise；该更晚窗口若拿到handle，getter必须拒绝已失败/移除Editor。另有明确“await prepare返回后、读取metadata前”四案，均要求拒绝采用。这一区分没有将已fulfilled结果虚报为false；未用sleep或固定延迟冒充终态门。

### C3V-002 / P2：旧Editor监听与排队工作缺归属

附录复放：Editor真实模板重建后doc监听3→6，一次mousedown两clone；dispose后监听虽为0，已排nextTick仍产生clone并隐藏原手柄。现按具体Editor持有局部cleanup，setup替换前和remove时清其doc监听/克隆；callback和mousedown/ObjectSelected延后的nextTick执行时复核具体Editor身份、初始化、failure、active与组件存活。克隆释放恢复原display值，不硬设空值。

ObjectSelected/ObjectResized即时回调也做owner检查；setEdit排队timer捕获Editor身份，reShow的nextTick使用本地版本和存活，重建完成后才安排editCursor，cursor timer再次核同Editor/body连接。initCurFields的既有nextTick仍只作用当前本组件，不扩入通用query乱序框架。新增重建案既核监听6→3，也主动调用已取下的旧handler确认无作用；额外覆盖ObjectSelected排队dispose、Editor remove后的mousedown排队，以及已创建clone在dispose时恢复/清理。

### C3V-003 / P2：过宽归一化吞可见空白

附录真实initializer复放：`<p><span>甲</span> <span>乙</span></p>`与缺空格版本文本分别为“甲 乙”/“甲乙”，原谓词却判等。现保留所有行内空格、NBSP及pre内容；只允许根层两个无display覆盖的标准block之间ASCII缩进差异。Tiny data-mce元数据与既有CSS序列化处理保留，未改actual为expected。

新增谓词检查直接从当前真实TS AST读取完整未改写initializer，通过Vue实际HTML parser建立明确DOM树double：inline空格、NBSP、pre负例必须不等；block间换行缩进正例必须等。原scenario.createElement为flat innerHTML seam，专项补足children/空白分支；仍不称真实浏览器serializer或所有white-space/CSS上下文已穷举。策略保守，非根层格式差异不会被无依据丢弃。

## 实际 RED/GREEN 与回归

先执行独立附录原样内存probe，四类历史现象全部重现、0执行异常；V004随后经真实接线撤销，不计有效修复RED。然后追加本轮同identity检查，保留原16期待不变。新增27条：V001 12微任务+4handle、V002 5条、V003 4条、原active/dispose timer对照2条。对写前生产字节同driver执行19 PASS / 24语义RED / 0执行错误；当前43 PASS / 0语义失败/执行错误。27条不是27个独立缺陷或图表类型，旧版3个正对照保持绿。

| 实际命令（core/core-frontend） | 实测 | 证据上限 |
| --- | --- | --- |
| `node tests/filter-copy-mvp-richtext/check.mjs --repair-before` | exit1；19 PASS、24 semantic fail、0execution | 当前驱动与SHA绑定写前完整SFC |
| `node tests/filter-copy-mvp-richtext/check.mjs` | exit0；43 PASS、0semantic/execution | 完整真实SFC/Tiny协议double及真实谓词有界DOM树double |
| `node tests/filter-copy-mvp-richtext/check.mjs --baseline --before` | exit1；0 PASS/3 semantic/0execution | 原FONT/PARAGRAPH/CHANNEL指定指纹；非缺prepare或编译失败RED |
| `node tests/filter-copy-mvp-richtext/check.mjs --repair-types` | exit0；1→1、added=[] | 写前本SFC真实compileScript+tsconfig诊断multiset；非全项目类型通过 |
| `node tests/filter-copy-mvp-richtext/check.mjs --types` | exit0；1→1、added=[] | 原C234基线局部诊断multiset |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit0；13/13 | 当前wrapper/adapter接线回归，子端口/Store double |
| SFC+runner focused ESLint | exit0 | lint |
| SFC stylelint | exit0，仅3条既有规则deprecated | style |
| SFC parse/inline compileScript/compileTemplate | exit0；errors=[] | Vue实际编译 |
| 本写域git diff --check | exit0 | 空白差异 |

## 同类残余、限制与下一步

当前已覆盖必须在内容/Editor健康时才可采用、Editor重建与queued callback、可见空白比较、candidate全局隔离、activation同key/不二次setContent/query、legacy query/font/局部paragraph与公开channel默认行为。Builder在该有限范围未发现剩余确定blocker，不等同独立第2轮关闭001..003。

未检查真实Tiny skin/language/plugin资产、浏览器HTML净化/serializer/布局、Tiny供应商内部监听释放、后端query/真实权限、save/leave/reopen、移动/嵌入、49逐type/source-target/插件installed盘点；阈值fixture关闭，mappingColorCustom仍unexpected-call seam。Editor/doc/body/Store为协议double，真实字段映射/formatter/assignment/准备控制流运行。normalizer专项为原函数有界直接验证，不以DOM树double冒充真实Tiny序列化。

最终生产在`2026-10-27T07:23:28Z`通知父代理冻结（替代此前临时35ee...快照）。仅本富文本SFC修改，未动C2/tooltip/C4/wrapper/冻结设计/fixture/历史报告，无安装、服务操作、提交或推送。下一步独立第2/3轮按有效001..003与V004勘误重新判断；若通过也只能给有界C3模块准入，不能提升整体MVP/Goal。

## 最终字节

路径相对core/core-frontend。

| 文件 | SHA-256 |
| --- | --- |
| `src/custom-component/rich-text/DeRichTextView.vue` | `5e493a7d261318717d9192f34df2db17810fe8dd286401954b5db4aa1b1ede8d` |
| `tests/filter-copy-mvp-richtext/check.mjs` | `74da80178a432155030386f9830cea8d79b94b2283f08582e72122d121332e40` |
| `tests/filter-copy-mvp-richtext/README.md` | `1e9e1eba574ff34f3dc9f503d3b1ff209d10e65fa3a5815ca639eb212250ed49` |
