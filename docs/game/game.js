(() => {
'use strict';

/* ------------------------------------------------------------------ *
 *  CONTENT
 * ------------------------------------------------------------------ */
const LINKS = {
  github: 'https://github.com/Param031010',
  linkedin: 'https://www.linkedin.com/in/paramraval',
  leetcode: 'https://leetcode.com/Param_03',
  mail: 'mailto:paramraval2005@gmail.com',
  collegeMail: 'mailto:rapa23csaiml@cmrit.ac.in',
};

const tag = (...t) => `<div class="tags">${t.map(x => `<span class="tag">${x}</span>`).join('')}</div>`;
const project = (name, href, stars, desc, tags) => `
  <div class="card">
    <div class="meta"><h3>${href ? `<a href="${href}" target="_blank" rel="noopener">${name} ↗</a>` : name}</h3><span class="stars" title="Difficulty">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span></div>
    <p>${desc}</p>${tag(...tags)}
  </div>`;

// Zones: one building each. Doors face south.
const ZONES = [
  {
    id: 'about', name: 'GUILD HALL', icon: '🏰', color: '#8b5cf6', col: 0, row: 0,
    title: 'Guild Hall · About',
    html: `
      <p class="lead">Hi, I'm <b>Param Raval</b>, a Computer Science (AI &amp; ML) undergraduate at <b>CMR Institute of Technology, Bengaluru</b> with a <b>9.28 CGPA</b>.</p>
      <p>I grew up in Gujarat and moved to Bengaluru with my family to pursue my bachelor's degree.</p>
      <p>I'm especially interested in <b>Generative AI and AI agents</b>. On weekends I read technical articles on LinkedIn, listen to podcasts and experiment with new tools. That curiosity shows up in my projects <b>MedSys AI</b>, <b>GitShow</b> and <b>Wayfarer</b>, where I explore AI applications and agent-based systems.</p>
      <p>I've filed <b>two patents</b>, one on an AI-powered autonomous height detection system and one on a multilingual transliteration system. Outside academics I play sports, and I like to apply what I learn by building practical projects.</p>
      <div class="facts">
        <div class="fact"><span>Degree</span><b>B.Tech CSE (AI &amp; ML)</b></div>
        <div class="fact"><span>Institute</span><b>CMR Institute of Technology</b></div>
        <div class="fact"><span>CGPA</span><b>9.28</b></div>
        <div class="fact"><span>Focus</span><b>GenAI &amp; Agents</b></div>
        <div class="fact"><span>Patents</span><b>2 filed</b></div>
        <div class="fact"><span>Based in</span><b>Bengaluru, India</b></div>
      </div>`,
  },
  {
    id: 'projects', name: 'QUEST BOARD', icon: '📜', color: '#f472b6', col: 1, row: 0,
    title: 'Quest Board · Projects',
    html: `
      <p class="muted">Difficulty stars are my own rating of how much I learned and how complex the build was.</p>
      <div class="cards">
        ${project('MedSys AI', 'https://github.com/Param031010/MedSysAI_01', 5, 'Personal health app with document-grounded chat, symptom knowledge graphs and nearby-care search.', ['TypeScript', 'GenAI', 'Knowledge graph'])}
        ${project('GitShow', 'https://git-show-seven.vercel.app/', 4, 'Chat assistant for exploring and acting on GitHub repos, with confirm-before-write. Live demo.', ['Python', 'React', 'AI agents'])}
        ${project('Wayfarer', 'https://github.com/Priyanshu-Madhup/Wayferer', 4, 'AI travel planner: a Gemini-powered agent researches trips with tools, then shows itinerary, budget and map.', ['Python', 'React', 'AI agents'])}
        ${project('Traffic Accident Analytics', 'https://github.com/Param031010/MLOPS', 4, 'End-to-end ETL, API, dashboard and MLOps pipeline for accident data.', ['Python', 'ETL', 'MLOps', 'Dashboard'])}
        ${project('Chatbot', 'https://chatbot-f4ki.vercel.app', 3, 'Deployed conversational assistant with a live demo on Vercel.', ['JavaScript', 'Vercel'])}
        ${project('Dispatch.AI', 'https://github.com/Param031010/Dispatch.AI', 3, 'AI-assisted dispatch application.', ['TypeScript'])}
        ${project('Electricity Consumption Analysis', 'https://github.com/Param031010/Electricity_Consumption_Pattern_Analysis', 3, 'Exploratory analysis of electricity consumption patterns.', ['Jupyter', 'Data analysis'])}
      </div>
      <div class="btnrow"><a class="btn main" href="${LINKS.github}?tab=repositories" target="_blank" rel="noopener">All repositories ↗</a></div>`,
  },
  {
    id: 'skills', name: 'ARMORY', icon: '⚔️', color: '#22d3ee', col: 2, row: 0,
    title: 'Armory · Skills',
    html: `
      <h4>LANGUAGES</h4>${tag('Python', 'TypeScript', 'JavaScript', 'Java', 'HTML / CSS')}
      <h4>AI &amp; GENERATIVE AI</h4>${tag('LLM applications', 'Document-grounded chat (RAG)', 'AI agents', 'Knowledge graphs', 'Prompt engineering')}
      <h4>ML &amp; DATA</h4>${tag('scikit-learn', 'Pandas', 'Jupyter', 'ETL pipelines', 'MLOps')}
      <h4>WEB &amp; BACKEND</h4>${tag('React', 'Node.js', 'Vite', 'Streamlit', 'REST APIs')}
      <h4>TOOLS</h4>${tag('Git &amp; GitHub', 'Docker', 'Vercel')}`,
  },
  {
    id: 'awards', name: 'TROPHY ROOM', icon: '🏆', color: '#fbbf24', col: 0, row: 1,
    title: 'Trophy Room · Achievements',
    html: `
      <ul class="ach">
        <li><span class="ico">🥇</span><div><b>Patent filed · AI-powered autonomous height detection system</b><span>An applied computer-vision and AI idea taken to a patent filing.</span></div></li>
        <li><span class="ico">🥇</span><div><b>Patent filed · Multilingual transliteration system</b><span>A language technology system designed to work across multiple languages.</span></div></li>
        <li><span class="ico">🎓</span><div><b>9.28 CGPA · B.Tech CSE (AI &amp; ML)</b><span>CMR Institute of Technology, Bengaluru.</span></div></li>
        <li><span class="ico">🤖</span><div><b>Built agent-based AI applications</b><span>MedSys AI, GitShow and Wayfarer.</span></div></li>
        <li><span class="ico">🚀</span><div><b>Shipped end-to-end projects</b><span>From data pipelines and APIs to deployed web apps.</span></div></li>
      </ul>`,
  },
  {
    id: 'arcade', name: 'ARCADE', icon: '🕹️', color: '#34d399', col: 1, row: 1,
    title: 'Arcade · Live Stats',
    html: `
      <p>Live numbers from GitHub and LeetCode. If a card doesn't load, the services may be rate-limited; the profile links below always work.</p>
      <div class="statimgs">
        <img src="https://github-readme-stats.vercel.app/api?username=Param031010&show_icons=true&theme=radical&hide_border=true&include_all_commits=true" alt="GitHub statistics" loading="lazy" onerror="this.remove()">
        <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Param031010&layout=compact&theme=radical&hide_border=true" alt="Top languages" loading="lazy" onerror="this.remove()">
        <img src="https://leetcard.jacoblin.cool/Param_03?theme=dark&ext=heatmap" alt="LeetCode statistics" loading="lazy" onerror="this.remove()">
      </div>
      <div class="btnrow">
        <a class="btn main" href="${LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a>
        <a class="btn" href="${LINKS.leetcode}" target="_blank" rel="noopener">LeetCode ↗</a>
      </div>`,
  },
  {
    id: 'contact', name: 'PORTAL', icon: '🌀', color: '#fb7185', col: 2, row: 1,
    title: 'Portal · Contact',
    html: `
      <p class="lead">Open to internships, collaborations and conversations about GenAI and agents.</p>
      <div class="btnrow">
        <a class="btn main" href="${LINKS.mail}">✉ paramraval2005@gmail.com</a>
        <a class="btn" href="${LINKS.collegeMail}">🎓 rapa23csaiml@cmrit.ac.in</a>
      </div>
      <div class="btnrow">
        <a class="btn" href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
        <a class="btn" href="${LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a>
        <a class="btn" href="${LINKS.leetcode}" target="_blank" rel="noopener">LeetCode ↗</a>
      </div>`,
  },
];

const TITLES = ['NEWCOMER', 'SCOUT', 'EXPLORER', 'RANGER', 'VETERAN', 'ELITE', 'LEGEND'];

/* ------------------------------------------------------------------ *
 *  WORLD
 * ------------------------------------------------------------------ */
const WORLD = { w: 760, h: 480 };
const BOUNDS = { x0: 14, x1: WORLD.w - 14, y0: 30, y1: WORLD.h - 12 };
const COLS = [110, 380, 650];            // door centres (x)
const ROW_Y = [50, 250];                 // building top (y)
const BW = 100, BH = 66;

ZONES.forEach(z => {
  z.cx = COLS[z.col];
  z.x = z.cx - BW / 2;
  z.y = ROW_Y[z.row];
  z.w = BW;
  z.h = BH;
  z.doorY = z.y + z.h;
  z.trigger = { x: z.cx - 24, y: z.doorY, w: 48, h: 26 };
  z.stand = { x: z.cx, y: z.doorY + 16 };
});

const solids = [];
ZONES.forEach(z => solids.push({ x: z.x, y: z.y + 4, w: z.w, h: z.h - 4 }));

const NODE = { x: 380, y: 218 };
solids.push({ x: NODE.x - 10, y: NODE.y - 4, w: 20, h: 8 });

const TREES = [
  [205, 150], [555, 150], [205, 228], [555, 228], [60, 190], [700, 190],
  [210, 415], [550, 415], [380, 425], [60, 425], [700, 425], [300, 410], [460, 410],
];
TREES.forEach(([x, y]) => solids.push({ x: x - 5, y: y - 4, w: 10, h: 6 }));

const LAMPS = [[180, 172], [310, 172], [450, 172], [580, 172], [180, 367], [310, 367], [450, 367], [580, 367]];
LAMPS.forEach(([x, y]) => solids.push({ x: x - 2, y: y - 3, w: 4, h: 4 }));

// walkable paths (decorative)
const PATHS = [
  { x: 103, y: 178, w: 554, h: 14 },            // main east-west road
  { x: 103, y: 343, w: 554, h: 14 },            // south road
  ...COLS.map(c => ({ x: c - 7, y: 116, w: 14, h: 69 })),   // to top doors
  ...COLS.map(c => ({ x: c - 7, y: 316, w: 14, h: 34 })),   // to bottom doors
  { x: 238, y: 185, w: 14, h: 165 },            // west connector
  { x: 508, y: 185, w: 14, h: 165 },            // east connector
];

/* ------------------------------------------------------------------ *
 *  STATE
 * ------------------------------------------------------------------ */
const $ = s => document.querySelector(s);
const canvas = $('#game');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(pointer: coarse)').matches;

const player = { x: 320, y: 206, face: 1, moving: false, step: 0 };
const drone = { x: 300, y: 180 };
const cam = { x: 0, y: 0, zoom: 3 };
const keys = new Set();
let started = false, paused = true, target = null, autoZone = null, stuck = 0;
let nearZone = null, t = 0, last = 0;
let muted = false;
let visited = new Set();
const confetti = [];

try { visited = new Set(JSON.parse(localStorage.getItem('pr-visited') || '[]')); } catch (e) { /* storage unavailable */ }
const saveVisited = () => { try { localStorage.setItem('pr-visited', JSON.stringify([...visited])); } catch (e) { /* ignore */ } };

/* ------------------------------------------------------------------ *
 *  AUDIO (tiny synth, no assets)
 * ------------------------------------------------------------------ */
let actx;
function beep(freq, dur = 0.09, type = 'square', vol = 0.035, delay = 0) {
  if (muted) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), n = actx.currentTime + delay;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, n);
    g.gain.exponentialRampToValueAtTime(0.0001, n + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(n); o.stop(n + dur);
  } catch (e) { /* audio not available */ }
}
const sfx = {
  start: () => [392, 523, 659, 784].forEach((f, i) => beep(f, 0.12, 'square', 0.04, i * 0.08)),
  open: () => { beep(660, 0.07); beep(880, 0.1, 'square', 0.035, 0.07); },
  close: () => beep(440, 0.08),
  near: () => beep(740, 0.05, 'triangle', 0.03),
  discover: () => [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.14, 'triangle', 0.05, i * 0.09)),
};

/* ------------------------------------------------------------------ *
 *  HELPERS
 * ------------------------------------------------------------------ */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function hash(x, y) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = s => clamp(Math.round(((n >> s) & 255) * (1 + amt)), 0, 255);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
}
const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const inside = (px, py, r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;

/* ------------------------------------------------------------------ *
 *  RENDERING
 * ------------------------------------------------------------------ */
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  cam.dpr = dpr;
  cam.zoom = clamp(Math.min(innerWidth / 480, innerHeight / 300), 1.3, 3.2);
}

function drawGround() {
  const vw = innerWidth / cam.zoom, vh = innerHeight / cam.zoom;
  const x0 = Math.max(0, Math.floor(cam.x / 16)), y0 = Math.max(0, Math.floor(cam.y / 16));
  const x1 = Math.min(Math.ceil(WORLD.w / 16), Math.ceil((cam.x + vw) / 16));
  const y1 = Math.min(Math.ceil(WORLD.h / 16), Math.ceil((cam.y + vh) / 16));
  rect(0, 0, WORLD.w, WORLD.h, '#0a1226');
  for (let ty = y0; ty < y1; ty++) {
    for (let tx = x0; tx < x1; tx++) {
      const x = tx * 16, y = ty * 16, h = hash(tx, ty);
      rect(x, y, 16, 16, (tx + ty) % 2 ? '#0c1630' : '#0a1328');
      if (h > 0.86) rect(x + (h * 97 % 12 | 0), y + (h * 53 % 12 | 0), 2, 2, 'rgba(34,211,238,.22)');
      else if (h < 0.07) { // grass tuft
        rect(x + 5, y + 8, 1, 3, '#0f766e'); rect(x + 7, y + 6, 1, 5, '#14b8a6'); rect(x + 9, y + 8, 1, 3, '#0f766e');
      }
    }
  }
}

function drawPaths() {
  PATHS.forEach(p => {
    rect(p.x, p.y, p.w, p.h, '#16204a');
    rect(p.x, p.y, p.w, 1, 'rgba(34,211,238,.35)');
    rect(p.x, p.y + p.h - 1, p.w, 1, 'rgba(34,211,238,.35)');
    rect(p.x, p.y, 1, p.h, 'rgba(34,211,238,.18)');
    rect(p.x + p.w - 1, p.y, 1, p.h, 'rgba(34,211,238,.18)');
  });
  // pulsing data-flow dots on the main roads
  if (!reduceMotion) {
    for (let i = 0; i < 14; i++) {
      const x = 103 + ((t * 40 + i * 40) % 554);
      rect(x, 184, 2, 1, 'rgba(244,114,182,.7)');
      rect(554 - ((x - 103) % 554) + 103 - 2, 349, 2, 1, 'rgba(34,211,238,.6)');
    }
  }
}

function drawTree(x, y) {
  rect(x - 5, y - 1, 10, 2, 'rgba(0,0,0,.3)');
  rect(x - 1, y - 6, 3, 6, '#3b2a2a');
  rect(x - 7, y - 12, 14, 7, '#0b4f4a');
  rect(x - 5, y - 17, 10, 6, '#0f766e');
  rect(x - 3, y - 21, 6, 5, '#14b8a6');
  rect(x - 1, y - 23, 2, 2, '#5eead4');
  const tw = (Math.sin(t * 2 + x) + 1) / 2;
  rect(x - 4, y - 14, 1, 1, `rgba(244,114,182,${0.4 + tw * 0.5})`);
  rect(x + 3, y - 10, 1, 1, `rgba(34,211,238,${0.4 + (1 - tw) * 0.5})`);
}

function drawLamp(x, y) {
  rect(x - 3, y - 1, 6, 2, 'rgba(0,0,0,.3)');
  rect(x - 1, y - 14, 2, 14, '#2a3a78');
  rect(x - 3, y - 18, 6, 5, '#fde68a');
  rect(x - 2, y - 17, 4, 3, '#fffbeb');
}

function drawLampGlow(x, y) {
  const g = ctx.createRadialGradient(x, y - 14, 0, x, y - 14, 38);
  g.addColorStop(0, 'rgba(253,230,138,.28)');
  g.addColorStop(1, 'rgba(253,230,138,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - 40, y - 54, 80, 80);
}

function drawNode() {
  const { x, y } = NODE;
  rect(x - 13, y - 2, 26, 6, 'rgba(0,0,0,.35)');
  rect(x - 10, y - 4, 20, 8, '#1b2a63');
  rect(x - 8, y - 6, 16, 4, '#2a3a78');
  const pulse = 0.6 + Math.sin(t * 2.4) * 0.15;
  const g = ctx.createRadialGradient(x, y - 18, 0, x, y - 18, 30);
  g.addColorStop(0, `rgba(34,211,238,${pulse})`);
  g.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.fillStyle = g; ctx.fillRect(x - 32, y - 50, 64, 64);
  ctx.fillStyle = '#a5f3fc';
  ctx.beginPath(); ctx.arc(x, y - 18, 5, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 1, y - 19, 2, 0, 7); ctx.fill();
  for (let i = 0; i < 4; i++) {
    const a = t * 1.6 + i * Math.PI / 2;
    const ox = Math.cos(a) * 12, oy = Math.sin(a) * 5;
    rect(Math.round(x + ox) - 1, Math.round(y - 18 + oy) - 1, 2, 2, i % 2 ? '#f472b6' : '#22d3ee');
  }
}

function drawBuilding(z) {
  const { x, y, w, h, color } = z;
  const near = nearZone === z;
  const seen = visited.has(z.id);
  const flick = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(t * 3 + z.cx);

  rect(x + 3, y + h - 3, w, 7, 'rgba(0,0,0,.4)');                   // shadow
  rect(x, y + 14, w, h - 14, '#131b3d');                              // wall
  rect(x, y + 14, w, 2, '#1d2a5c');
  for (let i = 0; i < w; i += 10) rect(x + i, y + 16, 1, h - 16, 'rgba(0,0,0,.18)'); // plank lines
  rect(x - 5, y, w + 10, 16, shade(color, -0.55));                    // roof
  rect(x - 5, y, w + 10, 3, color);
  rect(x - 3, y + 16, w + 6, 2, 'rgba(0,0,0,.35)');
  for (let i = 0; i < w + 10; i += 8) rect(x - 5 + i, y + 6, 4, 2, 'rgba(255,255,255,.07)');

  // windows
  [x + 12, x + w - 28].forEach(wx => {
    rect(wx - 1, y + 25, 18, 14, '#05081a');
    rect(wx, y + 26, 16, 12, color);
    ctx.globalAlpha = flick; rect(wx + 1, y + 27, 14, 10, shade(color, 0.45)); ctx.globalAlpha = 1;
    rect(wx + 7, y + 26, 2, 12, '#05081a');
    rect(wx, y + 31, 16, 1, '#05081a');
  });

  // door
  const dx = z.cx - 9, dy = y + h - 22;
  rect(dx - 2, dy - 2, 22, 24, near ? '#ffffff' : shade(color, -0.2));
  rect(dx, dy, 18, 22, '#04061a');
  const dg = ctx.createLinearGradient(0, dy, 0, dy + 22);
  dg.addColorStop(0, `rgba(255,255,255,${near ? 0.8 : 0.25})`);
  dg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = dg; ctx.fillRect(dx + 2, dy + 2, 14, 20);
  rect(dx + 13, dy + 11, 2, 2, '#fde68a');

  // sign
  rect(z.cx - 31, y + 4, 62, 10, '#04061a');
  rect(z.cx - 31, y + 4, 62, 1, color);
  ctx.fillStyle = '#fff';
  ctx.font = '5px "Press Start 2P", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(z.name, z.cx, y + 9.5);

  // floating icon
  const bob = reduceMotion ? 0 : Math.sin(t * 2 + z.cx) * 2;
  ctx.font = '13px sans-serif';
  ctx.fillText(z.icon, z.cx, y - 8 + bob);

  if (seen) { // discovered check
    rect(x + w - 11, y + 18, 9, 9, '#064e3b');
    rect(x + w - 10, y + 19, 7, 7, '#34d399');
    ctx.fillStyle = '#04121a'; ctx.font = '7px sans-serif'; ctx.fillText('✓', x + w - 6.5, y + 23);
  }

  if (near) { // prompt arrow
    const ay = z.doorY + 5 + (reduceMotion ? 0 : Math.sin(t * 8) * 1.5);
    ctx.fillStyle = '#fff'; ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(isTouch ? 'TAP ▼' : 'E ▼', z.cx, ay + 18);
  }
}

function drawPlayer() {
  const x = Math.round(player.x), y = Math.round(player.y);
  rect(x - 5, y - 1, 10, 3, 'rgba(0,0,0,.4)');
  const s = player.moving ? Math.floor(player.step) % 2 : 0;
  rect(x - 3, y - 4, 2, 4 - (s ? 1 : 0), '#1e1b4b');
  rect(x + 1, y - 4, 2, 4 - (s ? 0 : 1), '#1e1b4b');
  rect(x - 4, y - 10 + (s && player.moving ? 1 : 0), 8, 7, '#6d28d9');       // hoodie
  rect(x - 4, y - 8 + (s && player.moving ? 1 : 0), 8, 1, '#22d3ee');
  rect(x - 5, y - 9, 1, 4, '#5b21b6'); rect(x + 4, y - 9, 1, 4, '#5b21b6');   // arms
  rect(x - (player.face > 0 ? 6 : -4), y - 9, 2, 5, '#0f172a');               // backpack
  rect(x - 3, y - 15, 6, 6, '#f1c9a5');                                        // head
  rect(x - 4, y - 17, 8, 3, '#1b1b2f'); rect(x - 4, y - 16, 1, 4, '#1b1b2f');  // hair
  const ex = player.face > 0 ? 1 : -2;
  rect(x + ex, y - 13, 1, 2, '#0f172a'); rect(x + ex + 2 - (player.face > 0 ? 0 : 1), y - 13, 1, 2, '#0f172a');
}

function drawDrone() {
  const bob = reduceMotion ? 0 : Math.sin(t * 5) * 1.5;
  const x = Math.round(drone.x), y = Math.round(drone.y + bob);
  rect(x - 4, Math.round(player.y) - 1, 8, 2, 'rgba(0,0,0,.18)');
  rect(x - 5, y - 4, 10, 6, '#cbd5ff');
  rect(x - 4, y - 5, 8, 1, '#e0e7ff');
  rect(x - 3, y - 3, 6, 3, '#0f172a');
  rect(x + (player.face > 0 ? 0 : -2), y - 2, 2, 2, t % 1.6 < 0.12 ? '#0f172a' : '#22d3ee');
  const spin = Math.floor(t * 30) % 2;
  rect(x - 8, y - 7, spin ? 6 : 4, 1, 'rgba(255,255,255,.7)');
  rect(x + (spin ? 2 : 4), y - 7, spin ? 6 : 4, 1, 'rgba(255,255,255,.7)');
}

// fireflies
const flies = Array.from({ length: 36 }, (_, i) => ({
  x: Math.random() * WORLD.w, y: Math.random() * WORLD.h,
  vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
  ph: Math.random() * 6, c: i % 2 ? '244,114,182' : '34,211,238',
}));
function drawFlies(dt) {
  if (reduceMotion) return;
  flies.forEach(f => {
    f.x += f.vx * dt; f.y += f.vy * dt;
    if (f.x < 0) f.x = WORLD.w; if (f.x > WORLD.w) f.x = 0;
    if (f.y < 0) f.y = WORLD.h; if (f.y > WORLD.h) f.y = 0;
    const a = 0.25 + 0.55 * (Math.sin(t * 2 + f.ph) + 1) / 2;
    ctx.fillStyle = `rgba(${f.c},${a})`;
    ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2);
  });
}

function drawConfetti(dt) {
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.life -= dt; c.vy += 90 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
    if (c.life <= 0) { confetti.splice(i, 1); continue; }
    rect(Math.round(c.x), Math.round(c.y), 2, 2, c.c);
  }
}
function burst(x, y) {
  const cols = ['#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#8b5cf6'];
  for (let i = 0; i < 60; i++) {
    const a = Math.random() * Math.PI * 2, s = 30 + Math.random() * 80;
    confetti.push({ x, y: y - 14, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 50, life: 1.2 + Math.random() * 0.8, c: cols[i % cols.length] });
  }
}

function render(dt) {
  const dpr = cam.dpr, z = cam.zoom;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#04060f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  const vw = innerWidth / z, vh = innerHeight / z;
  cam.x = vw >= WORLD.w ? (WORLD.w - vw) / 2 : clamp(player.x - vw / 2, 0, WORLD.w - vw);
  cam.y = vh >= WORLD.h ? (WORLD.h - vh) / 2 : clamp(player.y - vh / 2 - 8, -34, WORLD.h - vh + 10);
  ctx.setTransform(dpr * z, 0, 0, dpr * z, -Math.round(cam.x * z) * dpr, -Math.round(cam.y * z) * dpr);

  drawGround();
  drawPaths();
  drawFlies(dt);

  const items = [];
  ZONES.forEach(zn => items.push({ y: zn.y + zn.h, f: () => drawBuilding(zn) }));
  TREES.forEach(([x, y]) => items.push({ y, f: () => drawTree(x, y) }));
  LAMPS.forEach(([x, y]) => items.push({ y, f: () => drawLamp(x, y) }));
  for (let x = 20; x < WORLD.w; x += 28) {
    items.push({ y: 14, f: () => drawTree(x, 14) });
    items.push({ y: WORLD.h - 4, f: () => drawTree(x + 10, WORLD.h - 4) });
  }
  for (let y = 44; y < WORLD.h - 10; y += 30) {
    items.push({ y, f: () => drawTree(6, y) });
    items.push({ y, f: () => drawTree(WORLD.w - 6, y) });
  }
  items.push({ y: NODE.y + 4, f: drawNode });
  items.push({ y: player.y, f: drawPlayer });
  items.push({ y: player.y + 0.1, f: drawDrone });
  items.sort((a, b) => a.y - b.y).forEach(i => i.f());

  ctx.globalCompositeOperation = 'lighter';
  LAMPS.forEach(([x, y]) => drawLampGlow(x, y));
  ctx.globalCompositeOperation = 'source-over';
  drawConfetti(dt);
}

/* ------------------------------------------------------------------ *
 *  UPDATE
 * ------------------------------------------------------------------ */
function blocked(px, py) {
  const box = { x: px - 4, y: py - 3, w: 8, h: 4 };
  if (box.x < BOUNDS.x0 || box.x + box.w > BOUNDS.x1 || box.y < BOUNDS.y0 || box.y + box.h > BOUNDS.y1) return true;
  return solids.some(s => overlap(box, s));
}
function tryMove(dx, dy) {
  if (!dx && !dy) return;
  if (!blocked(player.x + dx, player.y + dy)) { player.x += dx; player.y += dy; }
}

function update(dt) {
  let dx = 0, dy = 0;
  if (keys.has('l')) dx -= 1;
  if (keys.has('r')) dx += 1;
  if (keys.has('u')) dy -= 1;
  if (keys.has('d')) dy += 1;

  if (dx || dy) { target = null; autoZone = null; }
  else if (target) {
    const vx = target.x - player.x, vy = target.y - player.y, d = Math.hypot(vx, vy);
    if (d < 2) { target = null; if (autoZone) { const zn = autoZone; autoZone = null; openZone(zn); } }
    else { dx = vx / d; dy = vy / d; }
  }

  const len = Math.hypot(dx, dy) || 1;
  const step = 78 * dt;
  const ox = player.x, oy = player.y;
  tryMove((dx / len) * step, 0);
  tryMove(0, (dy / len) * step);

  const moved = Math.hypot(player.x - ox, player.y - oy);
  player.moving = moved > 0.01;
  if (player.moving) { player.step += dt * 9; if (Math.abs(dx) > 0.1) player.face = dx > 0 ? 1 : -1; }
  if (target && moved < step * 0.2) { stuck += dt; if (stuck > 0.3) { target = null; autoZone = null; stuck = 0; } } else stuck = 0;

  // companion
  const tx = player.x - 12 * player.face, ty = player.y - 26;
  drone.x += (tx - drone.x) * Math.min(1, 4 * dt);
  drone.y += (ty - drone.y) * Math.min(1, 4 * dt);

  // proximity
  const prev = nearZone;
  nearZone = ZONES.find(zn => inside(player.x, player.y, zn.trigger)) || null;
  if (nearZone && nearZone !== prev) sfx.near();
  if (nearZone !== prev) updateHint();
  if (nearZone && autoZone === nearZone) { const zn = autoZone; autoZone = null; target = null; openZone(zn); }
}

/* ------------------------------------------------------------------ *
 *  UI
 * ------------------------------------------------------------------ */
const hud = $('#hud'), hint = $('#hint'), act = $('#act'), toastEl = $('#toast');
const panel = $('#panel'), panelBody = $('#panel-body'), mapEl = $('#map');
let toastTimer;

function toast(title, msg) {
  toastEl.innerHTML = `<span class="px">${title}</span>${msg}`;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

function updateHUD() {
  const n = visited.size;
  $('#lvl').textContent = `LV ${n + 1} · ${TITLES[n]}`;
  $('#xpcount').textContent = `${n}/${ZONES.length}`;
  $('#xpfill').style.width = `${(n / ZONES.length) * 100}%`;
}

function updateHint() {
  if (nearZone) {
    document.documentElement.style.setProperty('--accent', nearZone.color);
    hint.innerHTML = isTouch ? `<b>${nearZone.name}</b> · tap Enter` : `Press <kbd>E</kbd> to enter <b>${nearZone.name}</b>`;
    act.textContent = `Enter ${nearZone.icon}`;
    act.hidden = !isTouch;
  } else {
    hint.innerHTML = isTouch ? 'Tap the ground to walk · tap a building to visit it'
      : '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or arrows to move · <kbd>E</kbd> to enter · <kbd>M</kbd> map';
    act.hidden = true;
  }
}

function openPanel(title, icon, html, color, note) {
  document.documentElement.style.setProperty('--accent', color || '#22d3ee');
  $('#panel-title').textContent = title.toUpperCase();
  $('#panel-icon').textContent = icon;
  panelBody.innerHTML = html;
  panelBody.scrollTop = 0;
  $('#panel-note').textContent = note || '';
  panel.hidden = false;
  paused = true;
  act.hidden = true;
  $('#panel-close').focus();
}

function openZone(zn) {
  const first = !visited.has(zn.id);
  visited.add(zn.id);
  saveVisited();
  updateHUD();
  sfx.open();
  openPanel(zn.title, zn.icon, zn.html, zn.color, `${visited.size}/${ZONES.length} zones discovered`);
  if (first) {
    pendingToast = visited.size === ZONES.length
      ? ['ACHIEVEMENT UNLOCKED', 'Full Explorer · you discovered every zone. Thanks for visiting!']
      : ['ZONE DISCOVERED', `${zn.name} · +1 level`];
  }
}
let pendingToast = null;

function closePanel() {
  if (panel.hidden) return;
  panel.hidden = true;
  paused = false;
  sfx.close();
  canvas.focus();
  updateHint();
  if (pendingToast) {
    const [a, b] = pendingToast; pendingToast = null;
    setTimeout(() => {
      toast(a, b);
      sfx.discover();
      if (visited.size === ZONES.length) burst(player.x, player.y);
    }, 250);
  }
}

function openResume() {
  const html = ZONES.map(zn => `<h4>${zn.icon} ${zn.title.toUpperCase()}</h4>${zn.html}`).join('<hr class="sec-sep">');
  openPanel('Résumé view', '📄', html, '#22d3ee', 'Plain version of everything in the world');
}

function openMap() {
  if (!started) return;
  const list = $('#map-list');
  list.innerHTML = '';
  ZONES.forEach(zn => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span>${zn.icon}</span><span>${zn.name}</span><span class="check">${visited.has(zn.id) ? '✔' : ''}</span>`;
    b.onclick = () => { closeMap(); player.x = zn.stand.x; player.y = zn.stand.y; target = null; nearZone = null; openZone(zn); };
    li.appendChild(b); list.appendChild(li);
  });
  mapEl.hidden = false;
  paused = true;
  list.querySelector('button').focus();
}
function closeMap() { mapEl.hidden = true; if (panel.hidden) { paused = false; canvas.focus(); } }

function startGame() {
  if (started) return;
  started = true;
  $('#intro').classList.add('hide');
  setTimeout(() => { $('#intro').hidden = true; }, 500);
  hud.hidden = false; hint.hidden = false;
  paused = false;
  sfx.start();
  updateHUD(); updateHint();
  canvas.focus();
}

/* ------------------------------------------------------------------ *
 *  INPUT
 * ------------------------------------------------------------------ */
const KEYMAP = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ArrowUp: 'u', w: 'u', W: 'u', ArrowDown: 'd', s: 'd', S: 'd' };

addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (!started) { if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) startGame(); return; }
  if (e.key === 'Escape') { if (!mapEl.hidden) closeMap(); else closePanel(); return; }
  if (!panel.hidden || !mapEl.hidden) return;
  if (KEYMAP[e.key]) { keys.add(KEYMAP[e.key]); e.preventDefault(); return; }
  if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') && nearZone && !(e.target instanceof HTMLButtonElement && e.key !== 'e')) {
    e.preventDefault(); openZone(nearZone);
  } else if (e.key === 'm' || e.key === 'M') openMap();
});
addEventListener('keyup', e => { if (KEYMAP[e.key]) keys.delete(KEYMAP[e.key]); });
addEventListener('blur', () => keys.clear());

canvas.addEventListener('pointerdown', e => {
  if (!started || paused) return;
  const wx = cam.x + e.clientX / cam.zoom, wy = cam.y + e.clientY / cam.zoom;
  const hit = ZONES.find(zn => wx >= zn.x - 5 && wx <= zn.x + zn.w + 5 && wy >= zn.y - 16 && wy <= zn.y + zn.h + 4);
  if (hit) {
    autoZone = hit; target = { x: hit.stand.x, y: hit.stand.y };
    if (nearZone === hit) { autoZone = null; target = null; openZone(hit); }
  } else {
    autoZone = null; target = { x: clamp(wx, BOUNDS.x0, BOUNDS.x1), y: clamp(wy, BOUNDS.y0, BOUNDS.y1) };
  }
  stuck = 0;
});

act.addEventListener('click', () => { if (nearZone && !paused) openZone(nearZone); });
$('#btn-start').addEventListener('click', startGame);
$('#btn-skip').addEventListener('click', () => { startGame(); openResume(); });
$('#btn-map').addEventListener('click', openMap);
$('#btn-resume').addEventListener('click', () => { if (panel.hidden) openResume(); });
$('#btn-sound').addEventListener('click', e => {
  muted = !muted;
  e.currentTarget.textContent = muted ? '🔇' : '🔊';
  e.currentTarget.setAttribute('aria-pressed', String(!muted));
  if (!muted) sfx.near();
});
$('#panel-close').addEventListener('click', closePanel);
$('#panel-back').addEventListener('click', closePanel);
panel.addEventListener('pointerdown', e => { if (e.target === panel) closePanel(); });
$('#map-close').addEventListener('click', closeMap);
mapEl.addEventListener('pointerdown', e => { if (e.target === mapEl) closeMap(); });

addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { last = performance.now(); });

/* ------------------------------------------------------------------ *
 *  LOOP
 * ------------------------------------------------------------------ */
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now; t += dt;
  if (started && !paused) update(dt);
  render(dt);
  requestAnimationFrame(frame);
}

resize();
if (document.fonts && document.fonts.load) document.fonts.load('8px "Press Start 2P"').catch(() => {});
requestAnimationFrame(now => { last = now; frame(now); });
const hashId = location.hash.slice(1);
if (hashId === 'play') startGame();
else if (ZONES.some(zn => zn.id === hashId)) { startGame(); openZone(ZONES.find(zn => zn.id === hashId)); }
else if (hashId === 'resume') { startGame(); openResume(); }
})();
