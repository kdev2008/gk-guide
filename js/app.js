const C=window.GK_CONFIG||{};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const catIcon={'India':'🇮🇳','World':'🌐','Economy':'📊','Science & Tech':'🧪','Environment':'🌱','Sports':'🏆','Awards & Honours':'🏅','Appointments':'👤','Defence':'🛡️'};
let state={articles:[],questions:[],generatedAt:''}, currentFilter='All', selectedQuiz=null;

function fallback(cat){return (C.FALLBACKS&&C.FALLBACKS[cat])||(C.FALLBACKS&&C.FALLBACKS.default)||''}
function fmtDate(d){if(!d)return 'Today';const x=new Date(d);return isNaN(x)?String(d):x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
function fmtUpdated(d){if(!d)return 'Waiting for first publish';const x=new Date(d);return isNaN(x)?'Updated daily':'Updated '+x.toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}
function sourceOf(x){return (x.sources||[])[0]||{}}
function imgTag(x,cls=''){const src=x.image||fallback(x.category);return `<img class="${cls}" src="${esc(src)}" alt="" onerror="this.src='${esc(fallback(x.category))}'">`}

async function fetchJSON(url){
  const sep=url.includes('?')?'&':'?';
  const r=await fetch(url+sep+'v='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error('HTTP '+r.status);
  return r.json();
}
async function load(){
  try{
    const [latest,quiz]=await Promise.all([
      fetchJSON(C.LATEST_URL||'data/latest.json'),
      fetchJSON(C.QUIZ_URL||'data/quiz.json').catch(()=>({items:[]}))
    ]);
    state.articles=Array.isArray(latest.items)?latest.items:[];
    state.questions=Array.isArray(quiz.items)?quiz.items:[];
    state.generatedAt=latest.generatedAt||'';
    render();
  }catch(e){
    console.error(e);
    $('#latestGrid').innerHTML='<div class="empty-feed"><b>Latest feed is not available yet.</b><br><small>Run the V4 publisher from Admin, then refresh this page.</small></div>';
    $('#heroStory').innerHTML='<div class="fallback-card">📘</div>';
  }
}
function render(){
  $('#siteName').textContent=C.SITE_NAME||'GK Guide';
  $('#lastUpdated').textContent=fmtUpdated(state.generatedAt);
  if(C.ADMIN_URL){$('#adminLink').href=C.ADMIN_URL}else{$('#adminLink').style.display='none'}
  renderNav();renderHero();renderTrending();renderFilters();renderArticles(state.articles.slice(4));renderCategories();renderQuiz();
}
function categories(){
  const live=[...new Set(state.articles.map(x=>x.category).filter(Boolean))];
  return live.length?live:(C.DEFAULT_CATEGORIES||[]);
}
function renderNav(){
  const list=['Home',...categories(),'More'];
  $('#categoryNav').innerHTML=list.map((c,i)=>`<a href="#" class="nav-item ${i===0?'active':''}" data-nav="${esc(c)}"><span>${c==='Home'?'⌂':(catIcon[c]||'•')}</span>${esc(c)}</a>`).join('');
  $$('[data-nav]').forEach(x=>x.onclick=e=>{e.preventDefault();const c=x.dataset.nav;if(c==='Home'){currentFilter='All';renderFilters();renderArticles(state.articles.slice(4));return}if(c!=='More')applyFilter(c)});
}
function renderHero(){
  const a=state.articles;
  if(!a.length){
    $('#heroStory').innerHTML='<div class="fallback-card">📘</div><div class="lead-gradient"></div><div class="lead-copy"><span class="top-story">LATEST</span><h1>No fresh stories published yet</h1><p>Run the V4 publisher from the Admin Portal to generate today’s source-backed current affairs.</p></div>';
    $('#heroStack').innerHTML='';
    return;
  }
  const h=a[0],src=sourceOf(h);
  $('#heroStory').innerHTML=`${imgTag(h)}<div class="lead-gradient"></div><div class="lead-copy"><span class="top-story">TOP STORY</span><h1>${esc(h.title)}</h1><p>${esc(h.summary)}</p><div class="meta-row"><span>▣ ${fmtDate(h.publishedAt||h.generatedAt)}</span><span>◆ ${esc(h.category||'Current Affairs')}</span><span class="verified-dot">Verified</span>${src.name?`<span class="lead-source">Source: <b>${esc(src.name)}</b></span>`:''}</div><span class="read-btn">Read Full Story →</span></div>`;
  $('#heroStory').onclick=()=>openArticle(h);

  $('#heroStack').innerHTML=a.slice(1,4).map(x=>{const s=sourceOf(x);return `<article class="mini-story" data-id="${esc(x.id)}">${imgTag(x)}<div class="mini-story-copy"><h3>${esc(x.title)}</h3><div class="mini-meta"><span>${esc(x.category||'GK')}</span><span>•</span><span>${fmtDate(x.publishedAt)}</span></div>${s.name?`<div class="mini-source">Source: ${esc(s.name)}</div>`:''}</div></article>`}).join('');
  $$('.mini-story').forEach(el=>el.onclick=()=>openArticle(a.find(x=>String(x.id)===el.dataset.id)));
}
function renderTrending(){
  const tags=[...new Set(state.articles.map(x=>x.category).filter(Boolean))].slice(0,8);
  $('#trendingTopics').innerHTML=(tags.length?tags:['Current Affairs']).map(t=>`<span class="trend-chip">${esc(t)}</span>`).join('');
}
function renderFilters(){
  const cats=['All',...categories().slice(0,8)];
  $('#filterRow').innerHTML=cats.map(c=>`<button class="filter-btn ${c===currentFilter?'active':''}" data-filter="${esc(c)}">${esc(c)}</button>`).join('');
  $$('[data-filter]').forEach(b=>b.onclick=()=>applyFilter(b.dataset.filter));
}
function applyFilter(c){
  currentFilter=c;renderFilters();
  const list=c==='All'?state.articles.slice(4):state.articles.filter(x=>x.category===c);
  renderArticles(list);
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.nav===c));
}
function renderArticles(list){
  $('#latestGrid').innerHTML=list.length?list.slice(0,16).map(x=>{const s=sourceOf(x);return `<article class="update-card" data-article="${esc(x.id)}"><div class="update-image">${imgTag(x)}<span class="category-pill">${esc(x.category||'GK')}</span></div><div class="update-body"><h3>${esc(x.title)}</h3><div class="card-meta"><span>${fmtDate(x.publishedAt)}</span><span>● ${x.verified?'Verified':'Source-backed'}</span></div>${s.name?`<div class="source-line"><span class="source-mark">✓</span><span>Source:</span><a href="${esc(s.url||'#')}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${esc(s.name)}</a></div>`:''}</div></article>`}).join(''):'<div class="empty-feed">No matching fresh updates.</div>';
  $$('[data-article]').forEach(el=>el.onclick=()=>openArticle(state.articles.find(x=>String(x.id)===el.dataset.article)));
}
function renderCategories(){
  const counts={};state.articles.forEach(x=>counts[x.category]=(counts[x.category]||0)+1);
  $('#categoryCards').innerHTML=categories().map(c=>`<article class="browse-card" data-cat="${esc(c)}"><span class="browse-icon">${catIcon[c]||'📘'}</span><span><b>${esc(c)}</b><small>${counts[c]||0} current stories</small></span></article>`).join('');
  $$('[data-cat]').forEach(x=>x.onclick=()=>applyFilter(x.dataset.cat));
}
function renderQuiz(){
  const q=state.questions[0];
  $('#quizProgress').textContent=state.questions.length?`1 / ${state.questions.length}`:'';
  if(!q){$('#quizArea').innerHTML='<p>No quiz generated yet.</p>';return}
  selectedQuiz=null;
  $('#quizArea').innerHTML=`<p>${esc(q.question)}</p>${(q.options||[]).map((o,i)=>`<button class="quiz-option" data-option="${i}"><span class="quiz-radio"></span><span>${esc(o)}</span></button>`).join('')}<div class="quiz-actions"><button class="primary-btn" id="submitQuiz">Submit Answer</button></div><div class="quiz-result" id="quizResult"></div>`;
  $$('[data-option]').forEach(b=>b.onclick=()=>{selectedQuiz=Number(b.dataset.option);$$('[data-option]').forEach(x=>x.classList.toggle('selected',x===b))});
  $('#submitQuiz').onclick=()=>{$('#quizResult').textContent=selectedQuiz===Number(q.answerIndex)?'✓ Correct! '+(q.explanation||''):'Not quite. '+(q.explanation||'')};
}
function openArticle(x){
  if(!x)return;
  sessionStorage.setItem('gk_article',JSON.stringify(x));
  location.href='article.html?id='+encodeURIComponent(x.id);
}
function findAnswer(q){
  q=String(q||'').trim().toLowerCase();
  if(!q)return 'Please enter a question or keyword.';
  const words=q.split(/\W+/).filter(w=>w.length>2);
  let scored=state.articles.map(a=>{
    const hay=(a.title+' '+a.summary+' '+a.whyImportant+' '+(a.keyFacts||[]).join(' ')+' '+a.category).toLowerCase();
    const score=words.reduce((n,w)=>n+(hay.includes(w)?1:0),0);
    return {a,score};
  }).sort((x,y)=>y.score-x.score);
  const best=scored[0];
  if(!best||best.score===0)return 'I could not find that in today’s published stories.';
  const s=sourceOf(best.a);
  return `${best.a.title}\n\n${best.a.summary}${best.a.whyImportant?'\n\nWhy it matters: '+best.a.whyImportant:''}${s.name?'\n\nSource: '+s.name:''}`;
}
function answerInto(input,target){target.classList.add('show');target.textContent=findAnswer(input.value)}
$('#searchBtn').onclick=()=>{const q=$('#searchInput').value.trim().toLowerCase();currentFilter='Search';renderArticles(state.articles.filter(x=>(x.title+' '+x.summary+' '+x.category+' '+(x.keyFacts||[]).join(' ')).toLowerCase().includes(q)))};
$('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('#searchBtn').click()});
$('#viewAll').onclick=()=>{currentFilter='All';renderFilters();renderArticles(state.articles)};
$('#themeToggle').onclick=()=>document.body.classList.toggle('dark');
$('#askBtn').onclick=()=>answerInto($('#askInput'),$('#askAnswer'));
function openAsk(){$('#askModal').classList.add('open');$('#modalBackdrop').classList.add('open');$('#askModal').setAttribute('aria-hidden','false')}
function closeAsk(){$('#askModal').classList.remove('open');$('#modalBackdrop').classList.remove('open');$('#askModal').setAttribute('aria-hidden','true')}
$('#askTop').onclick=openAsk;$('#modalClose').onclick=closeAsk;$('#modalBackdrop').onclick=closeAsk;$('#modalAskBtn').onclick=()=>answerInto($('#modalAskInput'),$('#modalAskAnswer'));
load();
