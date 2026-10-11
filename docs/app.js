(() => {
  'use strict';
  const USER = 'Param031010';
  const API = 'https://api.github.com';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const COLOR = {
    Python: '#3572a5', TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#ff9a3c', C: '#8a94a6', HTML: '#e34c26', CSS: '#7c5cff',
    LangChain: '#5fe6d0', TensorFlow: '#ff9a3c', HuggingFace: '#ffd21e', FastAPI: '#2fbf9b', Pandas: '#8c7bff',
    'Scikit-Learn': '#f89939', MongoDB: '#6cc24a', Pinecone: '#5b8cff', Vercel: '#e9edf5'
  };
  const RING1 = ['Python', 'LangChain', 'TensorFlow', 'HuggingFace'];
  const RING2 = ['Java', 'FastAPI', 'Pandas', 'Scikit-Learn', 'MongoDB', 'Pinecone', 'JavaScript', 'Vercel'];
  const GROUPS = [
    ['Programming languages', ['C', 'Java', 'Python']],
    ['Generative AI & LLMs', ['Prompt Engineering', 'RAG', 'Fine-tuning LLMs (LoRA based)', 'Working with LLMs']],
    ['Frameworks', ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'LangChain', 'FastAPI', 'Scikit-Learn', 'TensorFlow', 'Transformers', 'HuggingFace']],
    ['Databases', ['MongoDB', 'MySQL', 'FAISS', 'Pinecone']],
    ['Web technologies', ['HTML', 'CSS', 'JavaScript']],
    ['Tools & deployment', ['Git & GitHub', 'REST APIs', 'Vercel']],
    ['Operating systems', ['Windows']]
  ];

  /* cached fetch (10 min) */
  async function getJSON(url) {
    const key = 'pf:' + url;
    try {
      const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (hit && Date.now() - hit.t < 6e5) return hit.d;
    } catch (e) { /* ignore */ }
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(r.status + ' ' + url);
    const d = await r.json();
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* ignore */ }
    return d;
  }
  function failBox(el, what, retry) {
    el.innerHTML = '<div class="note mono">Could not load ' + esc(what) + ' from GitHub (rate limit or offline). <button type="button">Retry</button></div>';
    $('button', el).addEventListener('click', retry);
  }

  /* typewriter */
  (() => {
    const words = ['AI agents', 'data pipelines', 'things that ship'];
    const out = $('#typed');
    let wi = 0, ci = 0, del = false, hold = 0;
    setInterval(() => {
      const w = words[wi];
      if (hold > 0) { hold--; return; }
      if (!del) { ci++; if (ci >= w.length) { del = true; hold = 16; } }
      else { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; hold = 4; } }
      out.textContent = w.slice(0, Math.max(ci, 0));
    }, 85);
  })();

  /* pointer glow */
  (() => {
    const pf = $('.pf');
    let raf = 0, p = null;
    pf.addEventListener('pointermove', (e) => {
      p = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = pf.getBoundingClientRect();
        pf.style.setProperty('--mx', (p.clientX - r.left) + 'px');
        pf.style.setProperty('--my', (p.clientY - r.top) + 'px');
      });
    });
  })();

  /* count-up */
  function countUp(el, to, dec, pad) {
    const t0 = performance.now();
    const fmt = (v) => dec ? v.toFixed(dec) : (pad ? String(Math.round(v)).padStart(pad, '0') : String(Math.round(v)));
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1600);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  document.querySelectorAll('.sv[data-to]').forEach((el) => countUp(el, +el.dataset.to, +el.dataset.dec || 0, +el.dataset.pad || 0));

  /* project filter */
  (() => {
    const pills = document.querySelectorAll('#pills .pill');
    const cards = document.querySelectorAll('#projects .pcard');
    pills.forEach((b) => b.addEventListener('click', () => {
      pills.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.f;
      cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.lang === f); });
    }));
  })();

  /* stack */
  (() => {
    const chip = (n, a) => '<div class="on-" style="--a:' + a + 'deg"><div class="nin" style="--a:' + a + 'deg"><span class="npill"><i class="ld" style="background:' + (COLOR[n] || '#9aa5ba') + '"></i>' + esc(n) + '</span></div></div>';
    $('#ring1').innerHTML = RING1.map((n, i) => chip(n, 20 + (360 / RING1.length) * i)).join('');
    $('#ring2').innerHTML = RING2.map((n, i) => chip(n, (360 / RING2.length) * i)).join('');
    $('#groups').innerHTML = GROUPS.map(([t, items]) =>
      '<div class="grp"><div class="mono gl">' + esc(t) + '</div><div class="wrapx">' +
      items.map((n) => '<span class="tag mono">' + (COLOR[n] ? '<i class="ld" style="background:' + COLOR[n] + '"></i>' : '') + esc(n) + '</span>').join('') +
      '</div></div>').join('');
  })();

  /* copy email */
  $('#copy').addEventListener('click', () => {
    try { navigator.clipboard.writeText('paramraval2005@gmail.com'); } catch (e) { /* ignore */ }
    const c = $('#copied'); c.textContent = 'Copied';
    setTimeout(() => { c.textContent = ''; }, 1800);
  });

  /* profile counts */
  async function loadUser() {
    try {
      const u = await getJSON(API + '/users/' + USER);
      $('#followers').textContent = u.followers;
      $('#following').textContent = u.following;
    } catch (e) { /* keep placeholders */ }
  }

  /* repos */
  async function loadRepos() {
    const el = $('#repos');
    try {
      const list = await getJSON(API + '/users/' + USER + '/repos?per_page=100&sort=pushed');
      const top = list.filter((r) => !r.fork && r.name !== USER).sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 6);
      const rows = top.length ? top : list.slice(0, 6);
      if (!rows.length) { el.innerHTML = '<div class="note mono">No public repositories yet.</div>'; return; }
      el.innerHTML = rows.map((r) =>
        '<a class="card lift repo" href="' + esc(r.html_url) + '"><div class="t"><span class="disp n">' + esc(r.name) + '</span><span class="pub mono">' + (r.fork ? 'Fork' : 'Public') + '</span></div>' +
        '<div class="d">' + esc(r.description || '') + '</div>' +
        '<div class="m mono">' + (r.language ? '<span><i class="ld" style="background:' + (COLOR[r.language] || '#9aa5ba') + '"></i>' + esc(r.language) + '</span>' : '') +
        (r.stargazers_count ? '<span>★ ' + r.stargazers_count + '</span>' : '') + '</div></a>').join('');
    } catch (e) { failBox(el, 'repositories', loadRepos); }
  }

  /* heatmap */
  async function loadHeat() {
    const heat = $('#heat'), months = $('#hm-months'), cap = $('#cap');
    try {
      const d = await getJSON('https://github-contributions-api.jogruber.de/v4/' + USER + '?y=last');
      const days = d.contributions;
      const total = (d.total && (d.total.lastYear ?? Object.values(d.total).reduce((a, b) => a + b, 0))) ?? days.reduce((a, c) => a + c.count, 0);
      $('#hm-title').textContent = total + ' contributions in the last year';
      countUp($('#stat-contrib'), total, 0, 0);
      const pad = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
      const cells = [];
      for (let i = 0; i < pad; i++) cells.push({ x: true, w: 0 });
      days.forEach((c, i) => cells.push({ c, w: Math.floor((pad + i) / 7) }));
      const lvl = [0, 1, 2, 3, 3];
      heat.innerHTML = cells.map((k, i) => k.x
        ? '<div class="c x" style="--w:0"></div>'
        : '<div class="c' + (k.c.level ? ' l' + lvl[k.c.level] : '') + '" style="--w:' + k.w + '" data-i="' + i + '"></div>').join('');
      const weeks = Math.ceil(cells.length / 7);
      let prev = -1, html = '';
      for (let w = 0; w < weeks; w++) {
        const k = cells[w * 7 + (w === 0 ? pad : 0)];
        if (!k || !k.c) continue;
        const dt = new Date(k.c.date + 'T00:00:00Z'), m = dt.getUTCMonth();
        if (m !== prev) {
          prev = m;
          html += '<span class="mono ml" style="grid-column:' + (w + 1) + ' / span ' + Math.min(3, 54 - (w + 1)) + '">' + dt.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) + '</span>';
        }
      }
      months.innerHTML = html;
      const show = (e) => {
        const t = e.target.closest('.c[data-i]');
        if (!t) return;
        const c = cells[+t.dataset.i].c;
        const label = new Date(c.date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
        cap.textContent = label + ' · ' + (c.count ? c.count + (c.count === 1 ? ' contribution' : ' contributions') : 'No contributions');
      };
      heat.addEventListener('mouseover', show);
      heat.addEventListener('click', show);
      heat.addEventListener('mouseleave', () => { cap.textContent = 'Hover a day to explore.'; });
    } catch (e) {
      cap.textContent = 'Could not load the contribution calendar.';
      $('#stat-contrib').textContent = '—';
    }
  }

  /* activity */
  async function loadActivity() {
    const el = $('#activity');
    try {
      const ev = await getJSON(API + '/users/' + USER + '/events/public?per_page=100');
      const byMonth = new Map();
      for (const e of ev) {
        const dt = new Date(e.created_at);
        const key = dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!byMonth.has(key)) byMonth.set(key, { push: new Map(), created: [] });
        const m = byMonth.get(key);
        if (e.type === 'PushEvent') m.push.set(e.repo.name, (m.push.get(e.repo.name) || 0) + 1);
        else if (e.type === 'CreateEvent' && e.payload.ref_type === 'repository') m.created.push({ repo: e.repo.name, d: dt });
      }
      const out = [];
      byMonth.forEach((m, month) => {
        const items = [];
        m.push.forEach((n, repo) => items.push({ t: 'Pushed ' + n + (n === 1 ? ' time' : ' times') + ' to ' + repo, s: repo, link: true }));
        m.created.forEach((c) => items.push({ t: 'Created repository ' + c.repo, s: c.repo + ' · ' + c.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), link: false }));
        if (!items.length) return;
        out.push('<div class="mono mo">' + esc(month) + '</div>' + items.map((it, i) =>
          '<div class="tl' + (i === items.length - 1 ? ' last' : '') + '"><i></i><div class="a">' + esc(it.t) + '</div>' +
          (it.link ? '<a class="mono s" href="https://github.com/' + esc(it.s) + '">' + esc(it.s) + '</a>' : '<div class="mono s mu">' + esc(it.s) + '</div>') + '</div>').join(''));
      });
      el.innerHTML = out.length ? out.join('') : '<div class="note mono">No recent public activity.</div>';
    } catch (e) { failBox(el, 'activity', loadActivity); }
  }

  loadUser(); loadRepos(); loadHeat(); loadActivity();
})();
