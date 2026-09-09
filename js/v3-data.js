
/**
 * GK Guide V3 frontend adapter
 * Reads GitHub Pages JSON directly.
 */

const GK_V3 = {
  LATEST_URL: './data/latest.json',
  QUIZ_URL: './data/quiz.json'
};

async function gkLoadV3() {
  const [latest, quiz] = await Promise.all([
    fetch(GK_V3.LATEST_URL + '?v=' + Date.now()).then(r => r.json()).catch(() => ({items:[]})),
    fetch(GK_V3.QUIZ_URL + '?v=' + Date.now()).then(r => r.json()).catch(() => ({items:[]}))
  ]);

  window.GK_DATA = latest;
  window.GK_QUIZ = quiz;

  // Optional automatic integration points.
  if (typeof renderV3Stories === 'function') renderV3Stories(latest.items || []);
  if (typeof renderV3Quiz === 'function') renderV3Quiz(quiz.items || []);

  document.dispatchEvent(new CustomEvent('gk:v3loaded',{detail:{latest,quiz}}));
}

document.addEventListener('DOMContentLoaded',gkLoadV3);
