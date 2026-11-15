// Live, animated profile panels: glitch hero, contribution skyline, tmux-style activity terminal.
// Node 20+, no dependencies. All motion sits inside prefers-reduced-motion: no-preference.
import { svg, motion, T, esc, shortSha, dotGrid, dotGridUse } from './svg-lib.mjs';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = (iso) => { const d = new Date(iso); return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`; };
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const f1 = (x) => Math.round(x * 10) / 10;
const stamp = (now) => `${fmtDay(now.toISOString()).toUpperCase()} · ${String(now.getUTCHours()).padStart(2, '0')}:00 UTC`;

// Deterministic PRNG so regenerated SVGs only change when the data does.
function rng(seed = 7) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const shade = (h, k) => '#' + hex(h).map((v) => Math.round(v * k).toString(16).padStart(2, '0')).join('');

/* ---------------- streaks ---------------- */
export function streaks(days) {
  let longest = 0, run = 0, best = { count: 0, date: null };
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); if (d.count > best.count) best = d; }
  let i = days.length - 1, current = 0;
  if (i >= 0 && days[i].count === 0) i--; // today not counted yet doesn't break the streak
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { current, longest, best };
}

/* ---------------- odometer numbers ---------------- */
function odometer(value, x, y, size, delay, id) {
  const L = Math.round(size * 1.18), slot = size * 0.62;
  let cx = x, out = '', col = 0;
  for (const ch of String(value)) {
    if (/\d/.test(ch)) {
      const d = +ch, target = 10 + d, cid = `${id}c${col}`;
      const digits = Array.from({ length: 20 }, (_, k) => `<text x="${f1(cx + slot / 2)}" y="${y + k * L}" text-anchor="middle">${k % 10}</text>`).join('');
      out += `<clipPath id="${cid}"><rect x="${f1(cx - 2)}" y="${y - size}" width="${f1(slot + 4)}" height="${Math.round(size * 1.25)}"/></clipPath>
<g clip-path="url(#${cid})"><g class="od" style="transform:translateY(-${target * L}px);animation-delay:${(delay + col * 0.12).toFixed(2)}s">${digits}</g></g>`;
      cx += slot; col++;
    } else {
      out += `<text x="${f1(cx + size * 0.14)}" y="${y}" text-anchor="middle">${esc(ch)}</text>`; cx += size * 0.28;
    }
  }
  return out;
}

/* ---------------- hero ---------------- */
export function heroSvg(n) {
  const W = 838, H = 360;
  const r = rng(11);
  // neural net
  const layers = [[548, [62, 122, 182]], [632, [40, 92, 144, 196]], [716, [62, 122, 182]], [798, [122]]];
  const nodes = layers.map(([x, ys]) => ys.map((y) => [x, y]));
  let edges = '';
  for (let l = 0; l < nodes.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1])
    edges += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
  let pulses = '';
  for (let k = 0; k < 9; k++) {
    const path = nodes.map((ls) => ls[Math.floor(r() * ls.length)]);
    const d = 'M' + path.map((p) => p.join(' ')).join('L');
    const dur = (2.2 + r() * 1.2).toFixed(2), begin = (k * 0.55).toFixed(2);
    const c = k % 3 === 2 ? T.vi : T.ac;
    pulses += `<circle r="3.2" fill="${c}" filter="url(#glow)" opacity="0"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${d}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
  }
  const nodeSvg = nodes.flat().map(([x, y], i, arr) => {
    const out = i === arr.length - 1;
    return `<circle class="pn pl" style="animation-delay:-${(i * 0.37).toFixed(2)}s" cx="${x}" cy="${y}" r="${out ? 11 : 6}" fill="${out ? T.ac : T.s2}" stroke="${out ? T.ac : T.vi}" stroke-width="2"/>`;
  }).join('');

  // typing phrases
  const phrases = ['AI agents', 'RAG pipelines', 'things that ship'];
  const cw = 17 * 0.6, X0 = 112, Y = 194, SLOT = 100 / 3, DUR = 18;
  const typing = phrases.map((p, i) => {
    const len = p.length, full = f1(len * cw), s = i * SLOT, f = (x) => x.toFixed(2);
    return {
      css: `.ty${i}{animation:ty${i} ${DUR}s steps(${len},end) infinite}.tg${i}{animation:tg${i} ${DUR}s linear infinite}
@keyframes ty${i}{${f(s)}%{width:0}${f(s + 11)}%{width:${full}px}${f(s + 27)}%{width:${full}px}${f(s + 33)}%{width:0}100%{width:0}}
@keyframes tg${i}{0%,${f(Math.max(0, s - 0.01))}%{opacity:${i === 0 ? 1 : 0}}${f(s)}%{opacity:1}${f(s + 33)}%{opacity:1}${f(s + 33.01)}%{opacity:0}100%{opacity:0}}`,
      svg: `<g class="tg${i}" opacity="${i === 0 ? 1 : 0}"><clipPath id="c${i}"><rect class="ty${i}" x="${X0}" y="${Y - 20}" width="${full}" height="28"/></clipPath>
<text class="m" x="${X0}" y="${Y}" font-size="17" fill="${T.ac}" clip-path="url(#c${i})">${esc(p)}</text></g>`
    };
  });

  // stat tiles with odometers
  const tiles = [[String(n.patents ?? 2), 'Patents filed'], [String(n.cgpa ?? '9.28'), 'CGPA'], [String(n.projects), 'Projects on GitHub'], [String(n.contributions), 'Contributions / yr']];
  const tw = (W - 64 - 3 * 14) / 4;
  const tileSvg = tiles.map(([v, l], i) => `<g transform="translate(${f1(32 + i * (tw + 14))} 250)"><rect width="${f1(tw)}" height="86" rx="16" fill="${T.s1}" fill-opacity=".85" stroke="#fff" stroke-opacity=".09"/>
<g class="d" font-size="34" font-weight="800" fill="${T.tx}" style="font-variant-numeric:tabular-nums">${odometer(v, 20, 48, 34, 0.2 + i * 0.18, 'o' + i)}</g>
<text class="m" x="20" y="70" font-size="10" letter-spacing="1.3" fill="${T.mu}">${esc(l.toUpperCase())}</text></g>`).join('');

  const name = (cls, extra = '') => `<g class="${cls}"${extra}><text class="d" x="32" y="100" font-size="48" font-weight="800" letter-spacing="-1">Param Raval,</text><text class="d" x="32" y="152" font-size="48" font-weight="800" letter-spacing="-1">AI/ML Engineer</text></g>`;
  const meta = `${n.repos != null ? n.repos + ' repositories' : ''}${n.followers != null ? ' · ' + n.followers + (n.followers === 1 ? ' follower' : ' followers') : ''}`.trim();
  const gl = (sel, frames) => `${sel}{animation:${sel.slice(1)} 6s steps(1) infinite}@keyframes ${sel.slice(1)}{0%,86%,100%{transform:none;clip-path:inset(0);opacity:${sel === '.gm' ? 1 : 0}}${frames}}`;
  const css = `.ed line{stroke:#fff;stroke-opacity:.07;stroke-width:1}
.gv,.ga{transform-box:fill-box}
${motion(`.pl{animation:pl 3s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.25)}}
.od{animation:od 1.9s cubic-bezier(.15,.85,.25,1) both}@keyframes od{from{transform:translateY(0)}}
.au1{animation:au1 16s ease-in-out infinite alternate}@keyframes au1{to{transform:translate(120px,40px)}}
.au2{animation:au2 19s ease-in-out infinite alternate}@keyframes au2{to{transform:translate(-140px,-30px)}}
.sb{animation:sb 7s linear infinite}@keyframes sb{from{transform:translateY(-60px)}to{transform:translateY(${H + 60}px)}}
${gl('.gv', '87%{opacity:.85;transform:translate(-5px,1px);clip-path:inset(8% 0 58% 0)}89%{transform:translate(4px,-1px);clip-path:inset(62% 0 6% 0)}91%{transform:translate(-3px,0);clip-path:inset(30% 0 42% 0)}93%{opacity:0}')}
${gl('.ga', '87%{opacity:.85;transform:translate(5px,-1px);clip-path:inset(54% 0 12% 0)}89%{transform:translate(-4px,1px);clip-path:inset(4% 0 70% 0)}91%{transform:translate(3px,0);clip-path:inset(44% 0 30% 0)}93%{opacity:0}')}
${gl('.gm', '87%{transform:translate(2px,0)}89%{transform:translate(-2px,0)}91%{transform:none}')}
${typing.map((t) => t.css).join('\n')}`)}`;
  return svg({
    w: W, h: H, fonts: ['display-800', 'mono-500', 'body-400'], css,
    defs: `${dotGrid(W, 240)}
<radialGradient id="a1"><stop offset="0" stop-color="${T.ac}" stop-opacity=".22"/><stop offset="1" stop-color="${T.ac}" stop-opacity="0"/></radialGradient>
<radialGradient id="a2"><stop offset="0" stop-color="${T.vi}" stop-opacity=".2"/><stop offset="1" stop-color="${T.vi}" stop-opacity="0"/></radialGradient>
<linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.ac}" stop-opacity="0"/><stop offset=".5" stop-color="${T.ac}" stop-opacity=".07"/><stop offset="1" stop-color="${T.ac}" stop-opacity="0"/></linearGradient>
<filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<clipPath id="pnl"><rect width="${W}" height="${H}" rx="22"/></clipPath>`,
    title: 'Param Raval, AI/ML Engineer',
    desc: `Animated hero. Stats: ${tiles.map(([v, l]) => v + ' ' + l).join(', ')}.${meta ? ' ' + meta + '.' : ''}`,
    body: `<g clip-path="url(#pnl)">
<circle class="au1" cx="640" cy="80" r="260" fill="url(#a1)"/><circle class="au2" cx="260" cy="300" r="240" fill="url(#a2)"/>
${dotGridUse(W, 240)}
<rect class="sb" x="0" y="0" width="${W}" height="60" fill="url(#sbg)"/></g>
${name('gv', ` fill="${T.vi}" opacity="0"`)}${name('ga', ` fill="${T.ac}" opacity="0"`)}${name('gm', ` fill="${T.tx}"`)}
<text class="b" x="32" y="${Y}" font-size="17" fill="${T.mu}">Building</text>
${typing.map((t) => t.svg).join('\n')}
<g class="ed">${edges}</g>${pulses}${nodeSvg}
${meta ? `<text class="m" x="${W - 32}" y="228" font-size="10.5" letter-spacing="1" text-anchor="end" fill="${T.mu}">${esc(meta.toUpperCase())}</text>` : ''}
${tileSvg}`
  });
}

/* ---------------- contribution skyline ---------------- */
export function skylineSvg(days, total, now = new Date()) {
  const W = 838, H = 420;
  const last = days.slice(-371);
  const pad = new Date(last[0].date + 'T00:00:00Z').getUTCDay();
  const cells = [...Array(pad).fill(null), ...last];
  const C = [12.2, -3.0], R = [7.6, 4.6], P0 = [62, 318], F = 0.8;
  const max = Math.max(1, ...last.map((d) => d.count));
  const LT = [0, 0.38, 0.58, 0.8, 1];
  const items = [];
  cells.forEach((d, k) => {
    if (!d) return;
    const w = Math.floor(k / 7), dy = k % 7;
    const lv = d.level ?? (d.count === 0 ? 0 : d.count < 3 ? 1 : d.count < 6 ? 2 : d.count < 10 ? 3 : 4);
    items.push({ w, dy, d, lv, last: k === cells.length - 1, depth: dy * R[1] + w * C[1] });
  });
  items.sort((a, b) => a.depth - b.depth || a.w - b.w);
  const pt = (x, y) => `${f1(x)},${f1(y)}`;
  let city = '', beacon = '';
  for (const it of items) {
    const px = P0[0] + it.w * C[0] + it.dy * R[0], py = P0[1] + it.w * C[1] + it.dy * R[1];
    const A = [px, py], B = [px + F * C[0], py + F * C[1]], Cc = [px + F * (C[0] + R[0]), py + F * (C[1] + R[1])], D = [px + F * R[0], py + F * R[1]];
    const h = it.d.count === 0 ? 0 : 5 + 58 * Math.sqrt(it.d.count / max);
    const up = (p) => [p[0], p[1] - h];
    const top = it.lv === 0 ? T.s2 : mix(T.s2, T.ac, LT[it.lv]);
    const poly = (ps, fill) => `<polygon points="${ps.map((p) => pt(...p)).join(' ')}" fill="${fill}"/>`;
    if (h === 0) { city += poly([A, B, Cc, D], top); continue; }
    const g = poly([up(A), up(D), D, A], shade(top, 0.5)) + poly([up(D), up(Cc), Cc, D], shade(top, 0.72)) + poly([up(A), up(B), up(Cc), up(D)], top);
    city += `<g class="bx" style="animation-delay:${(0.3 + it.w * 0.028).toFixed(2)}s"><title>${it.d.count} contribution${it.d.count === 1 ? '' : 's'} on ${it.d.date}</title>${g}</g>`;
    if (it.last) beacon = beam(Cc[0] - F * (C[0] + R[0]) / 2, Cc[1] - F * (C[1] + R[1]) / 2 - h);
  }
  if (!beacon) { const it = items.find((x) => x.last); if (it) { const px = P0[0] + it.w * C[0] + it.dy * R[0] + F * (C[0] + R[0]) / 2, py = P0[1] + it.w * C[1] + it.dy * R[1] + F * (C[1] + R[1]) / 2; beacon = beam(px, py); } }
  function beam(x, y) {
    return `<rect class="bm" x="${f1(x - 2)}" y="${f1(y - 110)}" width="4" height="110" fill="url(#bmg)"/>
<ellipse class="pn rg" cx="${f1(x)}" cy="${f1(y)}" rx="9" ry="4.5" fill="none" stroke="${T.ac}" stroke-width="1.5"/>
<circle cx="${f1(x)}" cy="${f1(y)}" r="2.6" fill="#fff"/>`;
  }
  // month labels along the front edge
  let months = '', prevM = -1;
  const ang = (Math.atan2(C[1], C[0]) * 180) / Math.PI;
  cells.forEach((d, k) => {
    if (!d || k % 7 !== 0) return;
    const m = new Date(d.date + 'T00:00:00Z').getUTCMonth(), w = k / 7;
    if (m === prevM) return; prevM = m;
    if (w > Math.ceil(cells.length / 7) - 3) return;
    const x = P0[0] + w * C[0] + 7 * R[0] + 4, y = P0[1] + w * C[1] + 7 * R[1] + 12;
    months += `<text class="m" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})" font-size="9.5" letter-spacing=".8" fill="${T.mu}">${MON[m].toUpperCase()}</text>`;
  });
  const s = streaks(last);
  const stat = (x, v, l) => `<g transform="translate(${x} 330)"><text class="d" font-size="24" font-weight="800" fill="${T.tx}">${esc(v)}</text><text class="m" y="18" font-size="9.5" letter-spacing="1.2" fill="${T.mu}">${esc(l)}</text></g>`;
  return svg({
    w: W, h: H, fonts: ['display-800', 'display-700', 'mono-500'],
    css: `.bx{transform-box:fill-box;transform-origin:50% 100%}` + motion(`.bx{animation:rise .9s cubic-bezier(.2,1.4,.4,1) both}@keyframes rise{from{transform:scaleY(0)}}
.bm{animation:bm 2.2s ease-in-out infinite}@keyframes bm{50%{opacity:.35}}
.rg{animation:rg 2.2s ease-out infinite}@keyframes rg{from{transform:scale(.6);opacity:1}to{transform:scale(2.6);opacity:0}}`),
    defs: `<linearGradient id="bmg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${T.ac}" stop-opacity=".9"/><stop offset="1" stop-color="${T.ac}" stop-opacity="0"/></linearGradient>
<radialGradient id="fl" cx=".55" cy=".6" r=".6"><stop offset="0" stop-color="${T.ac}" stop-opacity=".08"/><stop offset="1" stop-color="${T.ac}" stop-opacity="0"/></radialGradient>`,
    title: 'Contribution skyline',
    desc: `3D skyline of the last year of contributions, one building per day. ${total} contributions; current streak ${s.current} days; longest streak ${s.longest} days${s.best.date ? `; best day ${s.best.count} on ${s.best.date}` : ''}.`,
    body: `<rect width="${W}" height="${H}" rx="22" fill="url(#fl)"/>
<text class="m" x="32" y="48" font-size="10.5" letter-spacing="1.6" fill="${T.ac}">CONTRIBUTION SKYLINE · LAST 12 MONTHS</text>
<text class="d" x="30" y="122" font-size="72" font-weight="800" letter-spacing="-2" fill="${T.tx}">${esc(String(total))}</text>
<text class="m" x="32" y="146" font-size="10" letter-spacing="1.3" fill="${T.mu}">CONTRIBUTIONS IN THE LAST YEAR</text>
${stat(478, `${s.current}d`, 'CURRENT STREAK')}${stat(596, `${s.longest}d`, 'LONGEST')}${stat(696, s.best.date ? String(s.best.count) : '0', s.best.date ? 'BEST · ' + fmtDay(s.best.date).toUpperCase() : 'BEST DAY')}
${city}${beacon}${months}
<text class="m" x="${W - 32}" y="${H - 22}" font-size="9" letter-spacing="1" text-anchor="end" fill="${T.mu}" opacity=".75">TALLER = MORE COMMITS · UPDATED ${esc(stamp(now))}</text>`
  });
}

/* ---------------- activity terminal ---------------- */
export function describeEvents(events, user) {
  const short = (n) => (n.toLowerCase().startsWith(user.toLowerCase() + '/') ? n.slice(user.length + 1) : n);
  const pushText = (n, r) => (n > 0 ? `pushed ${n} commit${n === 1 ? '' : 's'} → ${r}` : `pushed → ${r}`);
  const out = [];
  for (const e of events) {
    const r = short(e.repo?.name || ''), p = e.payload || {}, date = e.created_at, id = shortSha(String(e.id ?? date + r));
    let kind, text;
    switch (e.type) {
      case 'PushEvent': {
        const n = p.size ?? p.commits?.length ?? 0, prev = out[out.length - 1];
        if (prev && prev.kind === 'push' && prev.repo === r && fmtDay(prev.date) === fmtDay(date)) { prev.n += n; prev.text = pushText(prev.n, r); continue; }
        out.push({ kind: 'push', repo: r, n, date, id, text: pushText(n, r) }); continue;
      }
      case 'CreateEvent': kind = 'new'; text = p.ref_type === 'repository' ? `created repo ✦ ${r}` : `created ${p.ref_type} ${p.ref} in ${r}`; break;
      case 'PullRequestEvent': kind = 'pr'; text = `${p.pull_request?.merged ? 'merged' : (p.action || 'opened')} PR #${p.number} in ${r}`; break;
      case 'IssuesEvent': kind = 'issue'; text = `${p.action} issue #${p.issue?.number} in ${r}`; break;
      case 'ReleaseEvent': kind = 'new'; text = `released ${p.release?.tag_name || ''} of ${r}`; break;
      case 'PublicEvent': kind = 'new'; text = `open-sourced ✦ ${r}`; break;
      case 'ForkEvent': kind = 'star'; text = `forked ${r}`; break;
      case 'WatchEvent': kind = 'star'; text = `starred ★ ${r}`; break;
      default: continue;
    }
    out.push({ kind, text, date, id });
  }
  return out;
}

export function terminalSvg(items, langs, now = new Date()) {
  const W = 838, H = 330, TB = 38, SB = 26, SPLIT = 540;
  const rows = items.slice(0, 7);
  const KC = { push: T.ac, new: T.vi, pr: T.ac, issue: T.vi, star: '#e3c565' };
  const cmd1 = 'git log --all-repos --author=Param031010';
  const cmdW = f1(cmd1.length * 7.2);
  const log = rows.length ? rows.map((it, i) => {
    const y = TB + 66 + i * 24;
    return `<g class="ln" style="animation-delay:${(1.5 + i * 0.28).toFixed(2)}s">
<text class="m" x="24" y="${y}" font-size="12"><tspan fill="${KC[it.kind] || T.mu}">●</tspan><tspan dx="8" fill="${T.vi}">${esc(it.id)}</tspan><tspan dx="10" fill="${T.mu}">${esc(fmtDay(it.date).toUpperCase().padEnd(6, ' '))}</tspan><tspan dx="10" fill="${T.tx}">${esc(clip(it.text, 45))}</tspan></text></g>`;
  }).join('') : `<text class="m ln" x="24" y="${TB + 66}" font-size="12" fill="${T.mu}">no public activity in the last 90 days</text>`;
  const top = langs.filter((l) => l.value > 0).sort((a, b) => b.value - a.value);
  const head = top.slice(0, 5), rest = top.slice(5).reduce((a, l) => a + l.value, 0);
  if (rest > 0) head.push({ name: 'Other', color: '#6b7486', value: rest });
  const sum = head.reduce((a, l) => a + l.value, 0) || 1;
  const N = 18, BW = 10.5, BG = 2;
  const bars = head.slice(0, 6).map((l, i) => {
    const y = TB + 66 + i * 34, pct = (l.value / sum) * 100, on = Math.max(1, Math.round((pct / 100) * N));
    const blocks = Array.from({ length: N }, (_, k) => `<rect${k < on ? ` class="bk" style="animation-delay:${(1.8 + i * 0.15 + k * 0.04).toFixed(2)}s"` : ''} x="${f1(SPLIT + 24 + k * (BW + BG))}" y="${y + 6}" width="${BW}" height="10" rx="2" fill="${k < on ? (l.color || T.mu) : T.s2}"/>`).join('');
    return `<text class="m" x="${SPLIT + 24}" y="${y}" font-size="11" fill="${T.tx}">${esc(clip(l.name, 18))}</text><text class="m" x="${W - 24}" y="${y}" font-size="11" text-anchor="end" fill="${T.mu}">${pct < 1 ? '<1' : pct.toFixed(1)}%</text>${blocks}`;
  }).join('');
  const prompt = (x, y, cmd, cls, w) => `<text class="m" x="${x}" y="${y}" font-size="12"><tspan fill="${T.ac}">➜</tspan><tspan dx="8" fill="${T.vi}">~</tspan></text>
<clipPath id="${cls}c"><rect class="${cls}" x="${x + 34}" y="${y - 12}" width="${w}" height="16"/></clipPath><text class="m" x="${x + 34}" y="${y}" font-size="12" fill="${T.tx}" clip-path="url(#${cls}c)">${esc(cmd)}</text>`;
  const cmd2 = 'gh lang --stats';
  const lastY = TB + 66 + Math.max(rows.length, 1) * 24;
  return svg({
    w: W, h: H, fonts: ['mono-500'],
    css: motion(`.t1{animation:t1 1.2s steps(${cmd1.length},end) .2s both}@keyframes t1{from{width:0}}
.t2{animation:t2 .8s steps(${cmd2.length},end) .6s both}@keyframes t2{from{width:0}}
.ln{animation:ln .01s linear both}@keyframes ln{from{opacity:0}}
.bk{animation:bk .25s ease-out both}@keyframes bk{from{opacity:0}}
.cu{animation:cu 1.1s steps(1) infinite}@keyframes cu{50%{opacity:0}}
.lv{animation:lv 1.6s ease-in-out infinite}@keyframes lv{50%{opacity:.25}}`),
    title: 'Live activity terminal',
    desc: `Recent public GitHub activity: ${rows.map((r) => r.text + ' (' + fmtDay(r.date) + ')').join('; ') || 'none'}. Languages: ${head.map((l) => l.name + ' ' + Math.round((l.value / sum) * 100) + '%').join(', ')}.`,
    body: `<path d="M0 ${TB}V22Q0 0 22 0H${W - 22}Q${W} 0 ${W} 22V${TB}Z" fill="${T.s1}"/>
<line x1="0" y1="${TB}.5" x2="${W}" y2="${TB}.5" stroke="#fff" stroke-opacity=".09"/>
<circle cx="22" cy="19" r="5.5" fill="${T.vi}"/><circle cx="40" cy="19" r="5.5" fill="${T.ac}"/><circle cx="58" cy="19" r="5.5" fill="${T.mu}" fill-opacity=".5"/>
<text class="m" x="${W / 2}" y="23" font-size="11" text-anchor="middle" fill="${T.mu}">param@github: ~/live — tmux</text>
${prompt(24, TB + 32, cmd1, 't1', cmdW)}
${log}
<rect class="cu" x="24" y="${lastY - 4}" width="8" height="14" fill="${T.ac}"/>
<line x1="${SPLIT}" y1="${TB + 12}" x2="${SPLIT}" y2="${H - SB - 12}" stroke="#fff" stroke-opacity=".12" stroke-dasharray="3 4"/>
${prompt(SPLIT + 24, TB + 32, cmd2, 't2', f1(cmd2.length * 7.2))}
${bars}
<path d="M0 ${H - SB}H${W}V${H - 22}Q${W} ${H} ${W - 22} ${H}H22Q0 ${H} 0 ${H - 22}Z" fill="${T.ac}"/>
<text class="m" x="16" y="${H - 9}" font-size="10.5" fill="${T.bg}">[live] 1:log* 2:langs</text>
<circle class="lv" cx="${W - 200}" cy="${H - 13}" r="3.5" fill="${T.bg}"/>
<text class="m" x="${W - 16}" y="${H - 9}" font-size="10.5" text-anchor="end" fill="${T.bg}">updated ${esc(stamp(now).toLowerCase())}</text>`
  });
}
