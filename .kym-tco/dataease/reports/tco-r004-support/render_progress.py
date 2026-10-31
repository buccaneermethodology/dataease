import json,os,html
from pathlib import Path
from collections import Counter
S=Path('.kym-tco/dataease/reports/tco-r004-support');A=Path('Dashboard/Artifacts/S00-S01-TCO-Update')
def read(p):return json.loads(Path(p).read_text())
p=read(S/'progress.json');m=read(p['model_ref']);c=read(p['coverage_ref']); comp=read(S/'profile-comparison.json');pack=read(A/'package-result-final.json')
titles={n['id']:n['title'] for n in m['nodes'] if n['node_kind']=='m1'};labels=p['states'];links={x['snapshot_ref']:os.path.relpath(x['snapshot_ref'],S) for x in read(S/'source-ledger.json')['sources']}
cli=Path('.kym-tco/dataease/reports/tco-packages')/pack['package_id']/'preview/tco-preview.html';assert cli.exists()
counts=Counter(i['status'] for i in p['items']); profile_rows=[]
for x in comp['target_profiles']:
 goals={g['id']:{'met':g['met_count'],'gap':g['gap_count']} for g in x['coverage_goals']}
 profile_rows.append({'id':x['id'],'label':x['label'],'denominator':x['requirement_count'],'goals':goals})
data={'progress':p,'titles':titles,'links':links,'profiles':profile_rows,'coverage':{r['tco_node_id']:r['claim_ceiling'] for r in c['records']}}
page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DataEase TCO r004 · S00 → S01</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#17243c;font:15px/1.65 system-ui,-apple-system,sans-serif}main{max-width:1260px;margin:auto;padding:32px 24px}h1{font-size:32px;line-height:1.25;margin:12px 0}h2{font-size:23px;margin-top:32px}h3{font-size:19px}a{color:#235ac1}header{padding:24px 28px;background:#102842;color:white;border-radius:18px}header p{color:#dae4f2}header a{color:#b9d8ff}small,.muted{color:#62718a}.tag{display:inline-block;padding:3px 9px;border-radius:6px;background:#e8edf5;margin:2px;font-size:13px}.completed,.completed_with_bounds{background:#d9f0e4;color:#126040}.partial{background:#fff0cf;color:#805709}.blocked,.paused{background:#fbe3e5;color:#962e3a}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}.metric,article,.panel{background:white;border:1px solid #dce2ec;border-radius:12px;padding:18px}.metric strong{display:block;font-size:28px}.toolbar{display:flex;flex-wrap:wrap;gap:10px;padding:16px 0;position:sticky;top:0;background:#f4f6faf5;z-index:1}input,select,button{font:inherit;padding:8px 12px;border:1px solid #b9c6d7;border-radius:6px;background:white}input{min-width:240px;flex:1}article{margin:14px 0}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #e5eaf1}th{font-size:13px;color:#51627a}details{margin:8px 0;border-top:1px solid #e5eaf1;padding-top:8px}summary{cursor:pointer}.note{border-left:4px solid #ddad44;padding:12px 16px;background:#fff7e4}#acRows{font-size:13px}.scroll{overflow:auto;max-height:550px}footer{margin-top:32px;color:#62718a}.rowtop{display:flex;justify-content:space-between;align-items:center}.evidence{font-size:13px;word-break:break-all}@media(max-width:700px){.grid{grid-template-columns:repeat(2,1fr)}main{padding:16px}.rowtop{display:block}table{font-size:13px}}</style>
<main><header><span>TCO r004 · candidate_not_approved（未批准候选）</span><h1>从规格完成，到技术调查有条件完成</h1><p>以 S01 收尾为事实截止，呈现 S00 → S01 对每个 M1 的实际贡献。读取日期：2026-10-21。S02 正在进行的工作未纳入。</p><a href="CLI_LINK">打开正式 CLI TCO 预览</a> · <a href="progress.md">Markdown 阅读版</a> · <a href="progress.json">推进项与逐 AC 数据</a></header>
<div class="grid"><div class="metric"><strong>13</strong>M1 能力，原有结构保留</div><div class="metric"><strong>52</strong>可追溯推进项，非产品完成率</div><div class="metric"><strong>76 / 95</strong>AC 部分静态绑定 / 显式缺口</div><div class="metric"><strong>0 / 26</strong>产品实现 Target Met / 原分母</div></div>
<p class="note">推进项完成 ≠ 功能实现或验收通过。七功能的局部观察来自 S01 当时的环境；真实权限与指定 App／真设备延期。第二批清理及新增 F05 归档暂停，不能宣称零残留。当前工作树已有源码变化，历史观察不证明今天的行为。</p>
<h2>任务贡献与下一步</h2><p>每条推进项都有稳定 ID、阶段输入状态 → 阶段输出状态、证据和责任。S00 之前没有记录的状态保留“历史未建立记录”；不按任务数计算功能完成百分比。</p>
<div id="summary"></div><div class="toolbar"><input id="search" aria-label="搜索推进项" placeholder="搜索功能、推进项、证据或下一步"><select id="node" aria-label="按M1筛选"><option value="">全部 M1</option></select><select id="stage" aria-label="按阶段筛选"><option value="">全部阶段</option><option>S00</option><option>S01</option><option>后续</option></select><select id="status" aria-label="按推进状态筛选"><option value="">全部推进状态</option></select><button id="reset">重置</button></div><p id="visible" aria-live="polite"></p><div id="cards"></div>
<h2>原有 Target Profiles</h2><p>原分母 2 / 5 / 5 / 4 / 10 保留，合计26。严格门槛仍未满足；推进项不改变 Target 谓词、阈值或业务要求。</p><div class="panel scroll"><table><thead><tr><th>Profile</th><th>分母</th><th>合同目标 Met / Gap</th><th>实现目标 Met / Gap</th></tr></thead><tbody id="profiles"></tbody></table></div>
<h2>171 条 AC 的证据绑定明细</h2><p>76 条部分静态绑定，95 条显式缺口；不是产品通过率。GLOBAL 四条独立保留。上方 M1 筛选同时作用于此表；搜索与阶段筛选只作用于推进项。</p><div class="panel scroll"><table><thead><tr><th>AC / 功能</th><th>证据状态</th><th>原验收结果要求</th><th>缺口与后续</th></tr></thead><tbody id="acRows"></tbody></table></div>
<h2>模型状态边界</h2><p>13个M1仍为 design_only（整体合同证据）、contract_defined（合同已定义）、producer_checked（候选生产者已检查）。本次独立候选审查不升级产品验证状态。原178条Coverage要求保留。项目级推进账本是补充观察轴，不是CLI新增的保留状态。</p>
<footer>来源：S00规格与独立文档审查；S01独立有条件收尾、TestabilityMatrix-r012、TechnicalDependencyLedger-r003及局部运行记录。<a href="source-ledger.json">来源及快照摘要</a> · <a href="CLOSEOUT_LINK">本次收尾与独立复核入口</a></footer></main><script id="data" type="application/json">DATA_JSON</script><script>
const D=JSON.parse(document.getElementById('data').textContent),P=D.progress;
const $=id=>document.getElementById(id);const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [id,title] of Object.entries(D.titles))$('node').add(new Option(id.toUpperCase()+' · '+title,id));for(const [id,label] of Object.entries(P.states))$('status').add(new Option(label,id));
const badge=s=>`<span class="tag ${esc(s)}">${esc(P.states[s])}</span>`;
$('summary').innerHTML=Object.entries(P.states).filter(([s])=>P.items.some(i=>i.status===s)).map(([s,l])=>`<span class="tag ${s}">${l} ${P.items.filter(i=>i.status===s).length}项</span>`).join('');
$('profiles').innerHTML=D.profiles.map(p=>`<tr><td>${esc(p.label)}</td><td>${p.denominator}</td><td>${p.goals.contract.met} / ${p.goals.contract.gap}</td><td>${p.goals.implementation.met} / ${p.goals.implementation.gap}</td></tr>`).join('');
function render(){const q=$('search').value.trim().toLowerCase(),node=$('node').value,stage=$('stage').value,status=$('status').value;
const selected=P.items.filter(i=>(!node||i.node_id===node)&&(!stage||i.stage===stage)&&(!status||i.status===status)&&(!q||(JSON.stringify(i)+D.titles[i.node_id]).toLowerCase().includes(q)));
$('visible').textContent=`显示 ${selected.length} / ${P.items.length} 个推进项`;
$('cards').innerHTML=Object.entries(D.titles).map(([id,title])=>{const rows=selected.filter(i=>i.node_id===id);if(!rows.length)return '';return `<article><div class="rowtop"><h3>${id.toUpperCase()} · ${esc(title)}</h3><span class="tag">整体 Coverage：design_only</span></div><p class="muted">${esc(D.coverage[id])}</p>${rows.map(i=>`<details><summary><strong>${esc(i.title)}</strong> <span class="tag">${esc(i.stage)}</span> ${badge(i.before_status)} → ${badge(i.status)}</summary><p>${esc(i.result)}</p><p><b>下一步：</b>${esc(i.next)}<br><b>责任：</b>${esc(i.owner)} · <small>${esc(i.id)}</small></p><div class="evidence">${i.evidence_refs.map(r=>`<a href="${esc(D.links[r])}">${esc(r.split('/').pop())}</a>`).join('<br>')}</div></details>`).join('')}</article>`}).join('')||'<p>没有匹配的推进项。</p>';
const ac=P.ac_bindings.filter(x=>!node||x.function_id.toLowerCase()===node);$('acRows').innerHTML=ac.map(x=>`<tr><td>${esc(x.ac_id)}<br>${esc(x.function_id)}</td><td>${x.status==='partial_static_binding_runtime_required'?'部分静态绑定，待运行验证':'显式缺口'}</td><td>${esc(x.then)}</td><td>${esc((x.gaps||[]).join('；'))}<br>${esc(x.disposition||x.claim_binding_ceiling||'')}</td></tr>`).join('');}
for(const id of ['search','node','stage','status'])$(id).addEventListener('input',render);$('reset').onclick=()=>{for(const id of ['search','node','stage','status'])$(id).value='';render()};render();
</script></html>'''
page=page.replace('CLI_LINK',html.escape(os.path.relpath(cli,S))).replace('CLOSEOUT_LINK',html.escape(os.path.relpath(A/'Closeout.md',S))).replace('DATA_JSON',json.dumps(data,ensure_ascii=False).replace('<','\\u003c'))
(S/'tco-preview.html').write_text(page)
md=['# S00、S01 后的 TCO r004','',f"事实范围：{p['as_of']}。未批准候选；不包含 S02 进行中成果。",'',f'[交互预览](tco-preview.html) · [正式CLI预览]({os.path.relpath(cli,S)})','', '## 进展与边界','', 'S00规格整理完成；S01技术调查按批准范围有条件完成。52个推进项独立记录，不能换算为产品完成率。13个M1整体Coverage未自动升级。171AC中76部分静态绑定/95显式gap，不是通过率。真实权限/App真设备延期，第二批清理与新增F05归档暂停。','', '| M1 | S00 → S01 推进 | 下一步 |','|---|---|---|']
for id,title in titles.items():
 rows=[x for x in p['items'] if x['node_id']==id];md.append(f"| {id} {title} | "+'；'.join(x['title']+'：'+labels[x['status']] for x in rows)+' | '+rows[-1]['next']+' |')
md+=['','## 原Target分母与门槛','', '| Profile | 分母 | 合同Met/Gap | 实现Met/Gap |','|---|---:|---:|---:|']
for x in profile_rows:md.append(f"| {x['label']} | {x['denominator']} | {x['goals']['contract']['met']}/{x['goals']['contract']['gap']} | {x['goals']['implementation']['met']}/{x['goals']['implementation']['gap']} |")
md+=['','## 逐推进项证据','']
for x in p['items']:
 md.extend([f"### {x['id']} · {x['title']}",'',f"{x['stage']}：{labels[x['before_status']]} → **{labels[x['status']]}**",'',x['result'],'',f"责任：{x['owner']}。下一步：{x['next']}",'','证据：'+'、'.join(f'[{Path(r).name}]({os.path.relpath(r,S)})' for r in x['evidence_refs']),''])
md+=['## 来源时点与未覆盖项','',f"S01的70条历史源码claim中，{len(p['current_source_drift'])}条对应源码摘要与当前工作树不同；保留历史观察，不声称今天仍成立。逐条AC与14项依赖见[数据账本](progress.json)，42份来源快照见[来源表](source-ledger.json)。历史FixtureTraceLedger及RuntimeEvidenceLedger中的早期状态须结合S01_Closeout和ScopeDelta-r002阅读。"]
(S/'progress.md').write_text('\n'.join(md)+'\n')
print('Rendered',S/'tco-preview.html',counts)
