(() => {
'use strict';

/* ------------------------------------------------------------------ *
 *  CONFIG + CONTENT
 * ------------------------------------------------------------------ */
const USER = 'Param031010';
const API = 'https://api.github.com';
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;

const LANG = { TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#4b8bbe', HTML: '#e34c26', CSS: '#8b5cf6', Java: '#e08a2c', 'Jupyter Notebook': '#da5b0b', React: '#61dafb', 'Node.js': '#6cc24a', Docker: '#2496ed', Git: '#f05032', Pandas: '#8b7cf6', 'scikit-learn': '#f7931e', Shell: '#89e051' };

// Featured projects, in the order shown on the page.
const ART = {
  graph: `<svg viewBox="0 0 240 112" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path class="stroke" d="M52 80L112 52M112 52L200 30M112 52L208 86"/><circle class="pur float" cx="52" cy="80" r="6"/><circle class="mint pulse" cx="112" cy="52" r="12"/><circle class="pur float" cx="200" cy="30" r="6" style="animation-delay:-1s"/><circle class="pur float" cx="208" cy="86" r="6" style="animation-delay:-2s"/></svg>`,
  flow: `<svg viewBox="0 0 240 112" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path class="stroke" d="M34 80H206"/><circle class="stroke" cx="52" cy="80" r="5"/><circle class="stroke" cx="80" cy="80" r="5"/><path id="gs-p" class="dash" d="M80 80C98 80 98 34 118 34H150C170 34 168 80 206 80"/><circle class="mint" cx="118" cy="34" r="6"/><circle class="mint" cx="150" cy="34" r="6"/><circle class="pur" cx="206" cy="80" r="6"/><rect class="ring" x="106" y="90" width="68" height="12" rx="6" style="stroke:var(--mint)"/><circle class="mint" r="3"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#gs-p"/></animateMotion></circle></svg>`,
  route: `<svg viewBox="0 0 240 112" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path id="wf-p" class="dash" d="M30 88C60 88 60 52 94 56S130 92 156 66 190 34 210 30"/><circle class="stroke" cx="30" cy="88" r="5"/><circle class="pur" cx="94" cy="56" r="5"/><circle class="pur" cx="156" cy="66" r="5"/><circle class="mint pulse" cx="210" cy="30" r="8"/><circle class="mint" r="3"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#wf-p"/></animateMotion></circle></svg>`,
  wave: `<svg viewBox="0 0 240 112" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path class="dash" d="M24 84C54 42 84 42 112 72S168 96 210 34"/><circle class="mint pulse" cx="24" cy="84" r="7"/><circle class="ring pulse" cx="210" cy="34" r="8"/></svg>`,
};

const PROJECTS = [
  {
    id: 'medsys', name: 'MedSys AI', repo: 'MedSysAI_01', art: 'graph',
    tags: ['TypeScript', 'GenAI', 'Knowledge graph'],
    desc: 'Health app with document-grounded chat, symptom knowledge graphs and nearby-care search.',
    points: ['Chat that answers from your own health documents instead of guessing', 'Symptom knowledge graphs to relate symptoms and conditions', 'Nearby-care search to find a clinic or hospital close to you', 'Built in TypeScript as a full application'],
  },
  {
    id: 'gitshow', name: 'GitShow', art: 'flow', demo: 'https://git-show-seven.vercel.app/',
    tags: ['Python', 'React', 'AI agents'],
    desc: 'Chat assistant for exploring and acting on GitHub repos, with confirm-before-write.',
    points: ['Explore repositories through conversation', 'Can act on repos, but asks for confirmation before any write', 'Python backend with a React interface', 'Deployed on Vercel with a live demo'],
  },
  {
    id: 'wayfarer', name: 'Wayfarer', art: 'route', url: 'https://github.com/Priyanshu-Madhup/Wayferer',
    tags: ['Python', 'React', 'AI agents'],
    desc: 'AI travel planner: a Gemini-powered agent researches a trip with tools, then shows the itinerary, budget and map.',
    points: ['Agentic tool-calling loop that streams its research progress live to the UI', '15 tools covering places, routing, weather, flights, hotels, events, visas and currency', 'Budget, optimization and validation done in deterministic code, not by the LLM', 'FastAPI backend with a React + Vite frontend'],
  },
  {
    id: 'dispatch', name: 'Dispatch.AI', repo: 'Dispatch.AI', art: 'wave',
    tags: ['TypeScript', 'AI'],
    desc: 'AI-assisted dispatch application.',
    points: ['AI-assisted dispatch workflow', 'Built in TypeScript'],
  },
];

const SKILLS = {
  Languages: ['Python', 'TypeScript', 'JavaScript', 'Java'],
  Web: ['React', 'Node.js'],
  'ML & Data': ['scikit-learn', 'Pandas'],
  Tooling: ['Docker', 'Git'],
};
const ORBIT = {
  a: ['Python', 'TypeScript', 'JavaScript', 'Java'],
  b: ['React', 'Node.js', 'scikit-learn', 'Pandas', 'Docker', 'Git'],
};

/* ------------------------------------------------------------------ *
 *  HELPERS
 * ------------------------------------------------------------------ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dot = name => `<i style="background:${LANG[name] || '#4fe3c1'}"></i>`;
const chip = name => `<span class="chip">${dot(name)}${esc(name)}</span>`;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ago = iso => {
  const d = (Date.now() - new Date(iso)) / 864e5;
  if (d < 1) return 'today';
  if (d < 2) return 'yesterday';
  if (d < 31) return `${Math.floor(d)} days ago`;
  if (d < 365) return `${Math.floor(d / 30)} mo ago`;
  return `${Math.floor(d / 365)} yr ago`;
};

async function getJSON(url, ttl = 10 * 60 * 1000) {
  const key = 'pr:' + url;
  try { const c = JSON.parse(sessionStorage.getItem(key)); if (c && Date.now() - c.t < ttl) return c.d; } catch (e) { /* no cache */ }
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* quota */ }
  return d;
}
const failBox = (retry) => `<div class="err">Couldn't load live data from GitHub right now (possibly rate-limited).<button type="button" data-retry="${retry}">Retry</button></div>`;

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

const state = { repos: null, user: null, contrib: null, events: null };

/* ------------------------------------------------------------------ *
 *  ROUTER + TABS
 * ------------------------------------------------------------------ */
const VIEWS = ['overview', 'repositories', 'projects', 'packages', 'stars'];
function route() {
  const raw = location.hash.replace(/^#\/?/, '') || 'overview';
  const v = VIEWS.includes(raw) ? raw : 'overview';
  $$('[data-view]').forEach(s => { s.hidden = s.dataset.view !== v; });
  $$('#tabs a').forEach(a => { const on = a.dataset.tab === v; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#crumb').textContent = v[0].toUpperCase() + v.slice(1);
  document.title = `${v === 'overview' ? '' : v[0].toUpperCase() + v.slice(1) + ' · '}Param Raval · AI/ML Engineer`;
  moveInk();
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  if (v === 'stars') loadStars();
  observeReveals();
}
function moveInk() {
  const on = $('#tabs a.on'), ink = $('#tab-ink');
  if (!on) return;
  ink.style.width = on.offsetWidth + 'px';
  ink.style.transform = `translateX(${on.offsetLeft}px)`;
}
addEventListener('hashchange', route);
addEventListener('resize', moveInk);

/* ------------------------------------------------------------------ *
 *  SIDEBAR: typewriter, follow counts, copy
 * ------------------------------------------------------------------ */
function typewriter() {
  const el = $('#typer');
  const words = ['AI agents', 'data pipelines', 'things that ship'];
  if (reduce) { el.textContent = words[0]; return; }
  let w = 0, i = 0, del = false;
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, i);
    if (!del && i === word.length) { del = true; return setTimeout(tick, 1500); }
    if (del && i === 0) { del = false; w = (w + 1) % words.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
}

function renderFollow() {
  const u = state.user;
  $('#follow').innerHTML = u
    ? `<b>${u.followers}</b> follower${u.followers === 1 ? '' : 's'} · <b>${u.following}</b> following`
    : '';
}

document.addEventListener('click', e => {
  const c = e.target.closest('.copy');
  if (c) {
    const v = c.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast('Email copied'), () => { location.href = 'mailto:' + v; });
  }
  const r = e.target.closest('[data-retry]');
  if (r) { sessionStorage.clear(); boot(); }
});

/* ------------------------------------------------------------------ *
 *  PROJECTS
 * ------------------------------------------------------------------ */
let projFilter = 'All';
function projectCard(p, wide) {
  const live = state.repos && p.repo ? state.repos.find(r => r.name === p.repo) : null;
  return `
  <article class="proj" tabindex="0" role="button" aria-label="Open ${esc(p.name)} details" data-id="${p.id}">
    <div class="art">${ART[p.art]}</div>
    <div class="pbody">
      <h3>${esc(p.name)}<span class="go" aria-hidden="true">↗</span></h3>
      <p>${esc(p.desc)}</p>
      ${wide ? `<ul class="extra">${p.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <div class="chips">${p.tags.map(chip).join('')}${live ? `<span class="chip">updated ${ago(live.pushed_at)}</span>` : ''}</div>
    </div>
  </article>`;
}
function renderProjects() {
  const filters = ['All', 'TypeScript', 'Python', 'AI agents'];
  $('#proj-pills').innerHTML = filters.map(f => {
    const n = f === 'All' ? PROJECTS.length : PROJECTS.filter(p => p.tags.includes(f)).length;
    return `<button class="pill" role="tab" type="button" data-f="${esc(f)}" aria-selected="${f === projFilter}">${esc(f)}<b>${n}</b></button>`;
  }).join('');
  const list = PROJECTS.filter(p => projFilter === 'All' || p.tags.includes(projFilter));
  $('#proj-grid').innerHTML = list.map(p => projectCard(p, false)).join('');
  $('#proj-grid-2').innerHTML = PROJECTS.map(p => projectCard(p, true)).join('');
}
document.addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (pill) { projFilter = pill.dataset.f; renderProjects(); return; }
  const card = e.target.closest('.proj');
  if (card) openProject(card.dataset.id);
  const jump = e.target.closest('.jump');
  if (jump) openProject(jump.dataset.project);
});
document.addEventListener('keydown', e => {
  const card = e.target.closest && e.target.closest('.proj');
  if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProject(card.dataset.id); }
});
// spotlight follows pointer
document.addEventListener('pointermove', e => {
  const el = e.target.closest && e.target.closest('.spot, .proj');
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
});

const dlg = $('#proj-dialog');
async function openProject(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  $('#pd-art').innerHTML = ART[p.art];
  $('#pd-title').textContent = p.name;
  $('#pd-desc').textContent = p.desc;
  $('#pd-chips').innerHTML = p.tags.map(chip).join('');
  $('#pd-points').innerHTML = p.points.map(x => `<li>${esc(x)}</li>`).join('');
  $('#pd-live').innerHTML = '';
  const actions = [];
  const repo = state.repos && p.repo ? state.repos.find(r => r.name === p.repo) : null;
  if (p.repo) actions.push(`<a class="btn primary" href="https://github.com/${USER}/${esc(p.repo)}" target="_blank" rel="noopener">View repository ↗</a>`);
  if (repo && repo.homepage) actions.push(`<a class="btn" href="${esc(repo.homepage)}" target="_blank" rel="noopener">Live demo ↗</a>`);
  if (p.url) actions.push(`<a class="btn primary" href="${esc(p.url)}" target="_blank" rel="noopener">View repository ↗</a>`);
  if (p.demo) actions.push(`<a class="btn primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ↗</a>`);
  if (!p.repo && !p.url && !p.demo) actions.push(`<p class="note">No public link yet.</p>`);
  $('#pd-actions').innerHTML = actions.join('');
  if (!dlg.open) dlg.showModal();
  if (p.repo) {
    $('#pd-live').innerHTML = '<h5 class="mono">LIVE FROM GITHUB</h5><div class="skel block" style="height:30px"></div>';
    try {
      const langs = await getJSON(`${API}/repos/${USER}/${p.repo}/languages`);
      const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
      const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]);
      $('#pd-live').innerHTML = `<h5 class="mono">LIVE FROM GITHUB${repo ? ` · UPDATED ${ago(repo.pushed_at).toUpperCase()}` : ''}</h5>
        <div class="langbar">${entries.map(([n, v]) => `<i style="width:${(v / total) * 100}%;background:${LANG[n] || '#4fe3c1'}" title="${esc(n)}"></i>`).join('')}</div>
        <div class="langkey">${entries.slice(0, 5).map(([n, v]) => `<span>${dot(n)}${esc(n)} ${(v / total * 100).toFixed(1)}%</span>`).join('')}</div>`;
    } catch (e) { $('#pd-live').innerHTML = ''; }
  }
}
$('#pd-close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ------------------------------------------------------------------ *
 *  STACK
 * ------------------------------------------------------------------ */
function renderStack() {
  const ring = (list, off) => list.map((n, i) => {
    const a = off + (360 / list.length) * i;
    return `<div class="on-" style="--a:${a}deg"><div class="nin" style="--a:${a}deg"><span class="sk" data-skill="${esc(n)}">${dot(n)}${esc(n)}</span></div></div>`;
  }).join('');
  $('#orbit').innerHTML = `<div class="orb o1">${ring(ORBIT.a, 20)}</div><div class="orb o2">${ring(ORBIT.b, 0)}</div><div class="core">stack</div>`;
  $('#skills').innerHTML = Object.entries(SKILLS).map(([g, list]) =>
    `<div class="skill-box"><h5>${esc(g.toUpperCase())}</h5><div class="chips">${list.map(n => `<span class="chip" data-skill="${esc(n)}">${dot(n)}${esc(n)}</span>`).join('')}</div></div>`).join('');
  const toggle = (name, on) => $$(`[data-skill="${CSS.escape(name)}"]`).forEach(el => el.classList.toggle('hl', on));
  ['#orbit', '#skills'].forEach(sel => {
    const root = $(sel);
    root.addEventListener('pointerover', e => { const s = e.target.closest('[data-skill]'); if (s) toggle(s.dataset.skill, true); });
    root.addEventListener('pointerout', e => { const s = e.target.closest('[data-skill]'); if (s) toggle(s.dataset.skill, false); });
  });
}

/* ------------------------------------------------------------------ *
 *  REPOSITORIES (live)
 * ------------------------------------------------------------------ */
function repoCard(r) {
  const lang = r.language;
  return `
  <a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
    <div class="top"><span class="nm">${esc(r.name)}</span><span class="vis">${r.private ? 'Private' : 'Public'}</span></div>
    ${r.description ? `<p class="desc">${esc(r.description)}</p>` : (r.fork ? '<p class="desc">Forked repository</p>' : '')}
    <div class="meta">${lang ? `<span>${dot(lang)}${esc(lang)}</span>` : ''}${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ''}<span>Updated ${ago(r.pushed_at || r.updated_at)}</span></div>
  </a>`;
}
function popularRepos() {
  // pinned-style: non-fork first, by stars then most recently pushed
  return [...state.repos].filter(r => r.name !== USER)
    .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
    .sort((a, b) => a.fork - b.fork).slice(0, 6);
}
function renderPopular() { $('#pop-repos').innerHTML = popularRepos().map(repoCard).join(''); }

function renderRepoList() {
  const q = $('#repo-q').value.trim().toLowerCase();
  const lang = $('#repo-lang').value, sort = $('#repo-sort').value, forks = $('#repo-forks').checked;
  let list = state.repos.filter(r => (forks || !r.fork) && (!lang || r.language === lang) && (!q || (r.name + ' ' + (r.description || '')).toLowerCase().includes(q)));
  list.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'created' ? new Date(b.created_at) - new Date(a.created_at) : new Date(b.pushed_at) - new Date(a.pushed_at));
  $('#repo-count').textContent = `${list.length} of ${state.repos.length}`;
  $('#repo-list').innerHTML = list.length ? list.map(repoCard).join('') : '<div class="empty"><h4>No repositories match</h4><p>Try a different search or filter.</p></div>';
}
function setupRepoTools() {
  const langs = [...new Set(state.repos.map(r => r.language).filter(Boolean))].sort();
  $('#repo-lang').innerHTML = '<option value="">All languages</option>' + langs.map(l => `<option>${esc(l)}</option>`).join('');
  ['#repo-q', '#repo-lang', '#repo-sort', '#repo-forks'].forEach(s => $(s).addEventListener('input', renderRepoList));
  $('#n-repos').textContent = state.repos.length;
  renderRepoList();
}

let starsLoaded = false;
async function loadStars() {
  if (starsLoaded) return;
  const box = $('#star-list');
  try {
    const s = await getJSON(`${API}/users/${USER}/starred?per_page=50`);
    starsLoaded = true;
    box.innerHTML = s.length ? s.map(repoCard).join('') : '<div class="empty"><h4>No starred repositories yet</h4><p>Repositories I star will show up here.</p></div>';
  } catch (e) { box.innerHTML = failBox('stars'); }
}

/* ------------------------------------------------------------------ *
 *  CONTRIBUTIONS (live)
 * ------------------------------------------------------------------ */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function renderHeatmap(data) {
  const days = data.contributions;
  const total = data.total.lastYear ?? days.reduce((a, d) => a + d.count, 0);
  const first = new Date(days[0].date + 'T00:00:00');
  const pad = first.getDay();
  const cells = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  days.forEach(d => cells.push(d));
  const weeks = Math.ceil(cells.length / 7);

  // month labels: first week whose first real day is in a new month
  let lastM = -1; const labels = [];
  for (let w = 0; w < weeks; w++) {
    const d = cells.slice(w * 7, w * 7 + 7).find(Boolean);
    if (!d) continue;
    const m = new Date(d.date + 'T00:00:00').getMonth();
    if (m !== lastM) { if (w <= weeks - 2) labels.push(`<span style="grid-column:${w + 1}">${MONTHS[m]}</span>`); lastM = m; }
  }
  // stats
  let best = days[0], streak = 0, longest = 0;
  days.forEach(d => { if (d.count > best.count) best = d; streak = d.count ? streak + 1 : 0; longest = Math.max(longest, streak); });
  let cur = 0; for (let i = days.length - 1; i >= 0; i--) { if (days[i].count) cur++; else if (i === days.length - 1) continue; else break; }
  const active = days.filter(d => d.count).length;

  $('#contrib-title').textContent = `${total} contributions in the last year`;
  $('#heat').innerHTML = `
    <div class="hm">
      <div class="hm-days"><span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span></div>
      <div class="hm-main">
        <div class="hm-months" style="grid-template-columns:repeat(${weeks},11px)">${labels.join('')}</div>
        <div class="hm-grid">${cells.map((d, i) => d
          ? `<span class="cell l${d.level}" style="--c:${Math.floor(i / 7)}" data-d="${d.date}" data-n="${d.count}"></span>`
          : '<span class="cell pad"></span>').join('')}</div>
      </div>
    </div>
    <div class="hm-foot">
      <div class="hm-facts"><span>Active days <b>${active}</b></span><span>Longest streak <b>${longest}d</b></span><span>Current streak <b>${cur}d</b></span><span>Best day <b>${best.count}</b></span></div>
      <div class="legend">Hover a day to explore · Less ${[0, 1, 2, 3, 4].map(l => `<span class="cell l${l}"></span>`).join('')} More</div>
    </div>`;
  const sc = $('#stat-contrib'); sc.dataset.count = total; sc.dataset.pad = 2; sc.textContent = String(total).padStart(2, '0');
  countUp(sc.parentElement);
}
const tip = $('#tip');
document.addEventListener('pointerover', e => {
  const c = e.target.closest && e.target.closest('.cell[data-d]');
  if (!c) return;
  const d = new Date(c.dataset.d + 'T00:00:00'), n = +c.dataset.n;
  tip.textContent = `${n ? n : 'No'} contribution${n === 1 ? '' : 's'} on ${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
  const r = c.getBoundingClientRect();
  tip.style.left = r.left + r.width / 2 + 'px'; tip.style.top = r.top + 'px';
  tip.classList.add('show');
});
document.addEventListener('pointerout', e => { if (e.target.closest && e.target.closest('.cell[data-d]')) tip.classList.remove('show'); });

/* ------------------------------------------------------------------ *
 *  ACTIVITY (live public events)
 * ------------------------------------------------------------------ */
let activityRows = [], activityShown = 6;
function buildActivity(events) {
  const groups = new Map();
  const add = (d, key, row) => { const k = d.slice(0, 7); if (!groups.has(k)) groups.set(k, []); groups.get(k).push({ key, ...row }); };
  const push = new Map();
  events.forEach(ev => {
    const day = ev.created_at.slice(0, 10), repo = ev.repo.name, p = ev.payload || {};
    if (ev.type === 'PushEvent') {
      const k = `${day}|${repo}`; push.set(k, (push.get(k) || 0) + 1);
    } else if (ev.type === 'CreateEvent' && p.ref_type === 'repository') {
      add(day, 'c' + repo, { title: 'Created 1 repository', repo, day });
    } else if (ev.type === 'PullRequestEvent' && p.action === 'opened') {
      add(day, 'p' + ev.id, { title: 'Opened a pull request', repo, day });
    } else if (ev.type === 'IssuesEvent' && p.action === 'opened') {
      add(day, 'i' + ev.id, { title: 'Opened an issue', repo, day });
    } else if (ev.type === 'WatchEvent') {
      add(day, 'w' + repo, { title: 'Starred a repository', repo, day });
    } else if (ev.type === 'ForkEvent') {
      add(day, 'f' + ev.id, { title: 'Forked a repository', repo, day });
    }
  });
  push.forEach((n, k) => { const [day, repo] = k.split('|'); add(day, 'x' + k, { title: `Pushed ${n} time${n === 1 ? '' : 's'} to 1 repository`, repo, day }); });
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([m, rows]) => ({ m, rows: rows.sort((a, b) => b.day.localeCompare(a.day)) }));
}
function renderActivity() {
  const box = $('#activity');
  if (!activityRows.length) { box.innerHTML = '<p class="err">No recent public activity.</p>'; return; }
  let shown = 0, html = '';
  for (const g of activityRows) {
    if (shown >= activityShown) break;
    const [y, mo] = g.m.split('-');
    html += `<div class="tl-month">${MONTHS[+mo - 1]} ${y}</div>`;
    for (const r of g.rows) {
      if (shown >= activityShown) break; shown++;
      html += `<div class="tl-item">${esc(r.title)}<a class="sub" href="https://github.com/${esc(r.repo)}" target="_blank" rel="noopener">${esc(r.repo)} <em>· ${new Date(r.day + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</em></a></div>`;
    }
  }
  const total = activityRows.reduce((a, g) => a + g.rows.length, 0);
  if (shown < total) html += '<button class="more" id="more-act" type="button">Show more activity</button>';
  box.innerHTML = html;
  const more = $('#more-act'); if (more) more.onclick = () => { activityShown += 8; renderActivity(); };
}

/* ------------------------------------------------------------------ *
 *  COUNT-UP + REVEAL
 * ------------------------------------------------------------------ */
function countUp(root) {
  $$('[data-count]', root).forEach(el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pad = +(el.dataset.pad || 0);
    const fmt = v => dec ? v.toFixed(dec) : String(Math.round(v)).padStart(pad, '0');
    if (reduce || !end) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1100;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
}
let io;
function observeReveals() {
  if (!io) io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.08 });
  $$('.reveal:not(.in)').forEach(el => { if (el.closest('[hidden]')) return; io.observe(el); });
}

/* ------------------------------------------------------------------ *
 *  COMMAND PALETTE
 * ------------------------------------------------------------------ */
const pal = $('#palette'), palQ = $('#pal-q'), palList = $('#pal-list');
let palItems = [], palSel = 0;
function paletteSource() {
  const items = [
    ...VIEWS.map(v => ({ label: v[0].toUpperCase() + v.slice(1), hint: 'page', run: () => { location.hash = `#/${v}`; } })),
    ...PROJECTS.map(p => ({ label: p.name, hint: 'project', run: () => { if (location.hash !== '#/overview') location.hash = '#/overview'; openProject(p.id); } })),
    { label: 'Copy email address', hint: 'action', run: () => { navigator.clipboard?.writeText('paramraval2005@gmail.com'); toast('Email copied'); } },
    { label: 'LinkedIn', hint: 'link', run: () => open('https://www.linkedin.com/in/paramraval', '_blank', 'noopener') },
    { label: 'LeetCode', hint: 'link', run: () => open('https://leetcode.com/Param_03', '_blank', 'noopener') },
    { label: 'GitHub profile', hint: 'link', run: () => open('https://github.com/Param031010', '_blank', 'noopener') },
    { label: 'Game mode', hint: 'page', run: () => { location.href = 'game/'; } },
  ];
  (state.repos || []).forEach(r => items.push({ label: r.name, hint: 'repo', run: () => open(r.html_url, '_blank', 'noopener') }));
  return items;
}
function drawPalette() {
  const q = palQ.value.trim().toLowerCase();
  palItems = paletteSource().filter(i => !q || i.label.toLowerCase().includes(q)).slice(0, 30);
  palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
  palList.innerHTML = palItems.length
    ? palItems.map((i, n) => `<li role="option" data-n="${n}" aria-selected="${n === palSel}">${esc(i.label)}<small>${i.hint}</small></li>`).join('')
    : '<li aria-disabled="true">No results</li>';
  const s = $('[aria-selected="true"]', palList); if (s) s.scrollIntoView({ block: 'nearest' });
}
function openPalette() { palQ.value = ''; palSel = 0; drawPalette(); if (!pal.open) pal.showModal(); palQ.focus(); }
function runPalette(n) { const it = palItems[n]; if (!it) return; pal.close(); setTimeout(it.run, 0); }
$('#open-palette').addEventListener('click', openPalette);
palQ.addEventListener('input', () => { palSel = 0; drawPalette(); });
palQ.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); drawPalette(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(0, palSel - 1); drawPalette(); }
  else if (e.key === 'Enter') { e.preventDefault(); runPalette(palSel); }
});
palList.addEventListener('click', e => { const li = e.target.closest('li[data-n]'); if (li) runPalette(+li.dataset.n); });
pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
addEventListener('keydown', e => {
  const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPalette(); }
  else if (e.key === '/' && !typing && !pal.open && !dlg.open) { e.preventDefault(); openPalette(); }
});

/* ------------------------------------------------------------------ *
 *  BOOT
 * ------------------------------------------------------------------ */
async function boot() {
  renderProjects();
  const settle = (p, ok, bad) => p.then(ok).catch(bad);

  const repos = settle(getJSON(`${API}/users/${USER}/repos?per_page=100&sort=pushed&type=owner`), r => {
    state.repos = r;
    renderPopular(); setupRepoTools(); renderProjects();
  }, () => {
    $('#pop-repos').innerHTML = failBox('repos');
    $('#repo-list').innerHTML = failBox('repos');
  });
  const user = settle(getJSON(`${API}/users/${USER}`), u => { state.user = u; renderFollow(); }, () => { $('#follow').textContent = ''; });
  const contrib = settle(getJSON(CONTRIB_API, 30 * 60 * 1000), d => { state.contrib = d; renderHeatmap(d); }, () => {
    $('#heat').innerHTML = failBox('contrib');
    $('#stat-contrib').textContent = '—';
  });
  const events = settle(getJSON(`${API}/users/${USER}/events/public?per_page=100`), ev => { activityRows = buildActivity(ev); renderActivity(); }, () => { $('#activity').innerHTML = failBox('events'); });
  await Promise.all([repos, user, contrib, events]);
}

renderStack();
typewriter();
addEventListener('pointermove', e => { const g = $('#glow'); if (g) { g.style.setProperty('--gx', e.clientX + 'px'); g.style.setProperty('--gy', e.clientY + 'px'); } }, { passive: true });
route();
boot();
// keep static counters animating on first paint (contributions animates once loaded)
$$('.stats [data-count]').forEach(el => { if (el.id !== 'stat-contrib') countUp(el.parentElement); });
})();
