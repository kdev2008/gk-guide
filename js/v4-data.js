
/* GK Guide V4 frontend loader */
const GK_V4 = {
  LATEST_URL: './data/latest.json',
  QUIZ_URL: './data/quiz.json'
};

async function loadGKV4() {
  const bust = '?v=' + Date.now();
  const [latest,quiz] = await Promise.all([
    fetch(GK_V4.LATEST_URL+bust).then(r=>r.json()).catch(()=>({items:[]})),
    fetch(GK_V4.QUIZ_URL+bust).then(r=>r.json()).catch(()=>({items:[]}))
  ]);
  window.GK_DATA = latest;
  window.GK_QUIZ = quiz;
  document.dispatchEvent(new CustomEvent('gk:v4loaded',{detail:{latest,quiz}}));
}
document.addEventListener('DOMContentLoaded',loadGKV4);
