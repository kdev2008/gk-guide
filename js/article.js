const C=window.GK_CONFIG||{};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function fallback(cat){return (C.FALLBACKS&&C.FALLBACKS[cat])||(C.FALLBACKS&&C.FALLBACKS.default)||''}
function fmtDate(d){if(!d)return 'Today';const x=new Date(d);return isNaN(x)?String(d):x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
async function getArticle(){
  const id=new URLSearchParams(location.search).get('id');
  let cached=null;try{cached=JSON.parse(sessionStorage.getItem('gk_article')||'null')}catch(e){}
  if(cached&&(!id||String(cached.id)===String(id)))return cached;
  const r=await fetch((C.LATEST_URL||'data/latest.json')+'?v='+Date.now(),{cache:'no-store'});
  const d=await r.json();
  return (d.items||[]).find(x=>String(x.id)===String(id))||null;
}
async function load(){
  let x=null;try{x=await getArticle()}catch(e){console.error(e)}
  if(!x){$('#articleMain').innerHTML='<div class="empty">Article not found. It may have been replaced by today’s new feed.</div>';$('#whyImportant').textContent='Return to the homepage for the latest current affairs.';return}
  document.title=x.title+' — GK Guide';
  $('#breadcrumbs').textContent='Home › '+(x.category||'Current Affairs')+' › '+x.title;
  const cats=['Home',...(C.DEFAULT_CATEGORIES||[])];
  $('#articleNav').innerHTML=cats.map((c,i)=>`<a href="index.html${i?'#':''}" class="nav-item ${c===x.category?'active':''}">${esc(c)}</a>`).join('');
  const src=(x.sources||[])[0]||{};
  $('#articleMain').innerHTML=`<img class="article-cover" src="${esc(x.image||fallback(x.category))}" onerror="this.src='${esc(fallback(x.category))}'"><div class="article-content"><h1>${esc(x.title)}</h1><div class="article-meta"><span class="category-pill" style="position:static">${esc(x.category||'GK')}</span><span>▣ ${fmtDate(x.publishedAt||x.generatedAt)}</span><span class="verified-dot">Verified</span></div>${src.name?`<div class="article-source-banner"><span class="source-mark">✓</span><span>Primary source:</span><a href="${esc(src.url||'#')}" target="_blank" rel="noopener">${esc(src.name)}</a></div>`:''}<h3>What happened?</h3><p>${esc(x.summary||'')}</p><h3>Key Facts</h3><table class="keyfacts-table">${(x.keyFacts||[]).map(f=>{const p=String(f).split(':');return `<tr><td>${esc(p.shift()||'Fact')}</td><td>${esc(p.join(':').trim()||f)}</td></tr>`}).join('')||'<tr><td>Update</td><td>See summary above.</td></tr>'}</table></div>`;
  $('#whyImportant').textContent=x.whyImportant||'This development is relevant to current affairs and general knowledge.';
  $('#articleSources').innerHTML=(x.sources||[]).map(s=>`<a class="source-item" target="_blank" rel="noopener" href="${esc(s.url)}">▣ ${esc(s.name||s.url)}</a>`).join('')||'<small>No source links available.</small>';
  renderQuickQuestion(x);
}
function renderQuickQuestion(x){
  const options=[x.category,'World','Sports','History'].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,4);
  while(options.length<4)options.push(['India','Economy','Science & Tech','Environment'].find(v=>!options.includes(v))||'General Knowledge');
  $('#articleQuiz').innerHTML=`<p style="font-size:11px"><b>Which category does this update belong to?</b></p>${options.map((o,i)=>`<button class="quiz-option" data-q="${i}"><span class="quiz-radio"></span><span>${esc(o)}</span></button>`).join('')}<button class="primary-btn wide" id="showAnswer">Show Answer</button><div class="quiz-result" id="articleQuizResult"></div>`;
  document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>document.querySelectorAll('[data-q]').forEach(z=>z.classList.toggle('selected',z===b)));
  $('#showAnswer').onclick=()=>$('#articleQuizResult').textContent='Answer: '+x.category;
}
$('#articleSearchBtn').onclick=()=>{const q=$('#articleSearch').value.trim();if(q)location.href='index.html?q='+encodeURIComponent(q)};
load();
