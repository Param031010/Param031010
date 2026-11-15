// Shared helpers for generating the profile SVGs. Node 20+, no dependencies.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export const T = {
  bg: '#090b10', s1: '#0f131b', s2: '#151a25', line: 'rgba(255,255,255,.09)',
  tx: '#e9edf5', mu: '#9aa5ba', ac: '#5fe6d0', vi: '#b8a2ff',
  lang: { TypeScript: '#3178c6', Python: '#3572a5', JavaScript: '#f1e05a', Java: '#ff9a3c', HTML: '#e34c26' }
};

const FONTS = {
  'display-800': ['PF Display', 800], 'display-700': ['PF Display', 700],
  'body-400': ['PF Body', 400], 'body-600': ['PF Body', 600], 'mono-500': ['PF Mono', 500]
};
export const FF = {
  display: "'PF Display','Segoe UI',system-ui,sans-serif",
  body: "'PF Body','Segoe UI',system-ui,sans-serif",
  mono: "'PF Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
};

export function fontCss(names) {
  return names.map((n) => {
    const [fam, w] = FONTS[n];
    const b64 = readFileSync(join(here, 'fonts', n + '.woff2')).toString('base64');
    return `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
  }).join('');
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const textW = (s, size, k = 0.55) => Math.ceil(s.length * size * k);

/** Wrap content in a self-contained SVG with its own dark panel. */
export function svg({ w, h, title, desc, fonts, css = '', defs = '', body, radius = 22 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<defs><style>${fontCss(fonts)}
.d{font-family:${FF.display}}.b{font-family:${FF.body}}.m{font-family:${FF.mono}}
.pn{transform-box:fill-box;transform-origin:center}
${css}</style>${defs}</defs>
<rect width="${w}" height="${h}" rx="${radius}" fill="${T.bg}"/>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${radius - .5}" fill="none" stroke="#fff" stroke-opacity=".09"/>
${body}
</svg>
`;
}

export const motion = (css) => `@media (prefers-reduced-motion:no-preference){${css}}`;

export function shortSha(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 7);
}

/** Dot-grid texture, fades downward. */
export function dotGrid(w, h, id = 'dg') {
  return `<pattern id="${id}p" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#fff" fill-opacity=".07"/></pattern>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="${id}m"><rect width="${w}" height="${h}" fill="url(#${id}g)"/></mask>`;
}
export const dotGridUse = (w, h, id = 'dg') => `<rect width="${w}" height="${h}" fill="url(#${id}p)" mask="url(#${id}m)"/>`;

/** Hero: title, typing line, stat tiles. `n` = live numbers. */
export function heroSvg(n) {
  const W = 838, H = 328, UP = 22;
  const phrases = ['AI agents', 'data pipelines', 'things that ship'];
  const cw = 17 * 0.6, X0 = 120, Y = 198, SLOT = 100 / 3, DUR = 18;
  const typing = phrases.map((p, i) => {
    const len = p.length, full = Math.round(len * cw * 10) / 10, s = i * SLOT;
    const f = (x) => x.toFixed(2);
    return {
      css: `.ty${i}{animation:ty${i} ${DUR}s steps(${len},end) infinite}.tg${i}{animation:tg${i} ${DUR}s linear infinite}
@keyframes ty${i}{${f(s)}%{width:0}${f(s + 11)}%{width:${full}px}${f(s + 27)}%{width:${full}px}${f(s + 33)}%{width:0}100%{width:0}}
@keyframes tg${i}{0%,${f(Math.max(0, s - 0.01))}%{opacity:${i === 0 ? 1 : 0}}${f(s)}%{opacity:1}${f(s + 33)}%{opacity:1}${f(s + 33.01)}%{opacity:0}100%{opacity:0}}`,
      svg: `<g class="tg${i}" opacity="${i === 0 ? 1 : 0}"><clipPath id="c${i}"><rect class="ty${i}" x="${X0}" y="${Y - 20}" width="${i === 0 ? full : 0}" height="28"/></clipPath>
<text class="m" x="${X0}" y="${Y}" font-size="17" fill="${T.ac}" clip-path="url(#c${i})">${esc(p)}</text></g>`
    };
  });
  const nodes = [[560, 70, 7], [660, 44, 6], [770, 86, 7], [610, 150, 6], [720, 170, 6], [530, 184, 5], [690, 112, 12]];
  const edges = [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 3], [0, 1], [1, 2], [3, 4]];
  const tiles = [
    [String(n.patents ?? 2), 'Patents filed'], [n.cgpa ?? '9.28', 'CGPA'],
    [String(n.projects), 'Projects on GitHub'], [String(n.contributions), 'Contributions / yr']
  ];
  const tw = (W - 64 - 3 * 14) / 4;
  const tileSvg = tiles.map(([v, l], i) => {
    const x = 32 + i * (tw + 14);
    return `<g transform="translate(${x} 232)"><rect width="${tw}" height="88" rx="16" fill="${T.s1}" stroke="#fff" stroke-opacity=".09"/>
<text class="d" x="20" y="50" font-size="34" font-weight="800" fill="${T.tx}">${esc(v)}</text>
<text class="m" x="20" y="72" font-size="10" letter-spacing="1.3" fill="${T.mu}">${esc(l.toUpperCase())}</text></g>`;
  }).join('');
  const lines = edges.map(([a, b], i) => `<line class="mr" style="animation-delay:-${i * 0.4}s" x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}"/>`).join('');
  const circles = nodes.map(([x, y, r], i) => `<circle class="pn pl" style="animation-delay:-${(i * 0.7).toFixed(1)}s" cx="${x}" cy="${y}" r="${r}" fill="${i === 6 ? T.ac : T.vi}"/>`).join('');
  const meta = `${n.repos ?? ''}${n.repos != null ? ' repositories' : ''}${n.followers != null ? ' · ' + n.followers + (n.followers === 1 ? ' follower' : ' followers') : ''}`.trim();
  const css = `.mr{stroke:${T.ac};stroke-opacity:.4;stroke-width:1.4;stroke-dasharray:4 6}
${motion(`.mr{animation:mr 2.4s linear infinite}@keyframes mr{to{stroke-dashoffset:-40}}.pl{animation:pl 3.2s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.28)}}
${typing.map((t) => t.css).join('\n')}`)}`;
  return svg({
    w: W, h: H, fonts: ['display-800', 'mono-500', 'body-400'], css, defs: dotGrid(W, 200),
    title: 'Param Raval, AI/ML Engineer',
    desc: `Hero panel. Stats: ${tiles.map(([v, l]) => v + ' ' + l).join(', ')}.${meta ? ' ' + meta + '.' : ''}`,
    body: `<g transform="translate(0 -${UP})">${dotGridUse(W, 200)}
<text class="d" x="32" y="106" font-size="46" font-weight="800" fill="${T.tx}" letter-spacing="-1">Param Raval,</text>
<text class="d" x="32" y="156" font-size="46" font-weight="800" fill="${T.tx}" letter-spacing="-1">AI/ML Engineer</text>
<text class="b" x="32" y="${Y}" font-size="17" fill="${T.mu}">Building</text>
${typing.map((t) => t.svg).join('\n')}
${lines}${circles}
${meta ? `<text class="m" x="${W - 32}" y="212" font-size="10.5" letter-spacing="1" text-anchor="end" fill="${T.mu}">${esc(meta.toUpperCase())}</text>` : ''}
${tileSvg}</g>`
  });
}

/** Rewrites ?v=<sha> on every assets/*.svg reference in README.md (GitHub's image proxy caches hard). */
export function bumpReadmeVersions(readmePath = 'README.md', assetsDir = 'assets') {
  let md = readFileSync(readmePath, 'utf8');
  md = md.replace(/assets\/([\w-]+\.svg)(\?v=[0-9a-f]+)?/g, (_, name) => {
    const v = shortSha(readFileSync(join(assetsDir, name)));
    return `assets/${name}?v=${v}`;
  });
  writeFileSync(readmePath, md);
}

/* ---------- live sections ---------- */
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = (iso) => { const d = new Date(iso); return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`; };
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

/** Current / longest streak and best day from [{date,count}] (oldest first). */
export function streaks(days) {
  let longest = 0, run = 0, best = { count: 0, date: null };
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run);
    if (d.count > best.count) best = d;
  }
  let i = days.length - 1, current = 0;
  if (i >= 0 && days[i].count === 0) i--; // today not counted yet doesn't break the streak
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { current, longest, best };
}

/** Contribution heatmap: last ~53 weeks, streak tiles, sweeping scan line. */
export function contribSvg(days, total, now = new Date()) {
  const W = 838, H = 300, P = 14, C = 11, X0 = 62, Y0 = 84;
  const last = days.slice(-371);
  const pad = new Date(last[0].date + 'T00:00:00Z').getUTCDay();
  const cells = [...Array(pad).fill(null), ...last];
  const weeks = Math.ceil(cells.length / 7);
  const op = [0, .28, .5, .75, 1];
  let rects = '', months = '', prevM = -1;
  cells.forEach((d, k) => {
    const wx = Math.floor(k / 7), dy = k % 7;
    if (!d) return;
    const x = X0 + wx * P, y = Y0 + dy * P;
    const m = new Date(d.date + 'T00:00:00Z').getUTCMonth();
    if (dy === 0 || k === pad) { if (m !== prevM && wx < weeks - 2) { months += `<text class="m" x="${x}" y="${Y0 - 10}" font-size="10" fill="${T.mu}">${MON[m]}</text>`; } prevM = m; }
    const lv = d.level ?? (d.count === 0 ? 0 : d.count < 3 ? 1 : d.count < 6 ? 2 : d.count < 10 ? 3 : 4);
    const isLast = k === cells.length - 1;
    rects += lv === 0
      ? `<rect x="${x}" y="${y}" width="${C}" height="${C}" rx="3" fill="${T.s2}"/>`
      : `<rect${isLast ? ' class="pn pl"' : ''} x="${x}" y="${y}" width="${C}" height="${C}" rx="3" fill="${T.ac}" fill-opacity="${op[lv]}"><title>${d.count} on ${d.date}</title></rect>`;
  });
  const dl = [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']].map(([r, l]) => `<text class="m" x="32" y="${Y0 + r * P + 9}" font-size="10" fill="${T.mu}">${l}</text>`).join('');
  const s = streaks(last);
  const tiles = [
    [String(total), 'Contributions'], [`${s.current}d`, 'Current streak'],
    [`${s.longest}d`, 'Longest streak'], [s.best.date ? String(s.best.count) : '0', s.best.date ? `Best day · ${fmtDay(s.best.date)}` : 'Best day']
  ];
  const tw = (W - 64 - 3 * 14) / 4;
  const tileSvg = tiles.map(([v, l], i) => `<g transform="translate(${32 + i * (tw + 14)} 204)"><rect width="${tw}" height="72" rx="14" fill="${T.s1}" stroke="#fff" stroke-opacity=".09"/>
<text class="d" x="18" y="38" font-size="26" font-weight="800" fill="${T.tx}">${esc(v)}</text>
<text class="m" x="18" y="58" font-size="9.5" letter-spacing="1.2" fill="${T.mu}">${esc(l.toUpperCase())}</text></g>`).join('');
  const legend = op.map((o, i) => `<rect x="${W - 32 - (5 - i) * 15}" y="34" width="${C}" height="${C}" rx="3" fill="${i ? T.ac : T.s2}" ${i ? `fill-opacity="${o}"` : ''}/>`).join('');
  const gw = weeks * P;
  return svg({
    w: W, h: H, fonts: ['display-700', 'display-800', 'mono-500'],
    css: motion(`.pl{animation:pl 2.4s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.35)}}
.sc{animation:sc 7s cubic-bezier(.6,0,.4,1) infinite}@keyframes sc{0%{transform:translateX(0);opacity:0}8%{opacity:1}85%{opacity:1}100%{transform:translateX(${gw}px);opacity:0}}`),
    defs: `<linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="${T.ac}" stop-opacity="0"/><stop offset="1" stop-color="${T.ac}" stop-opacity=".22"/></linearGradient><clipPath id="gc"><rect x="${X0}" y="${Y0}" width="${gw}" height="${7 * P}"/></clipPath>`,
    title: 'Contribution activity',
    desc: `${total} contributions in the last year. Current streak ${s.current} days, longest streak ${s.longest} days${s.best.date ? `, best day ${s.best.count} on ${s.best.date}` : ''}.`,
    body: `<text class="d" x="32" y="46" font-size="20" font-weight="700" fill="${T.tx}">Contribution activity</text>
<text class="m" x="${W - 32 - 5 * 15 - 10}" y="44" font-size="10" text-anchor="end" fill="${T.mu}">LESS</text>${legend}
${months}${dl}${rects}
<g clip-path="url(#gc)"><rect class="sc" x="${X0 - 40}" y="${Y0}" width="40" height="${7 * P}" fill="url(#sg)" opacity="0"/></g>
${tileSvg}
<text class="m" x="${W - 32}" y="${H - 8}" font-size="9" letter-spacing="1" text-anchor="end" fill="${T.mu}" opacity=".7">UPDATED ${esc(fmtDay(now.toISOString()).toUpperCase())} · ${String(now.getUTCHours()).padStart(2, '0')}:00 UTC</text>`
  });
}

/** Turn GitHub public events into short lines: [{kind, text, date}]. */
export function describeEvents(events, user) {
  const short = (n) => (n.toLowerCase().startsWith(user.toLowerCase() + '/') ? n.slice(user.length + 1) : n);
  const out = [];
  for (const e of events) {
    const r = short(e.repo?.name || ''), p = e.payload || {}, date = e.created_at;
    let kind, text;
    switch (e.type) {
      case 'PushEvent': {
        const n = p.size ?? p.commits?.length ?? 0;
        const prev = out[out.length - 1];
        if (prev && prev.kind === 'push' && prev.repo === r && fmtDay(prev.date) === fmtDay(date)) { prev.n += n; prev.text = pushText(prev.n, r); continue; }
        out.push({ kind: 'push', repo: r, n, date, text: pushText(n, r) }); continue;
      }
      case 'CreateEvent': kind = 'new'; text = p.ref_type === 'repository' ? `Created repository ${r}` : `Created ${p.ref_type} ${p.ref} in ${r}`; break;
      case 'PullRequestEvent': kind = 'pr'; text = `${p.pull_request?.merged ? 'Merged' : cap(p.action)} PR #${p.number} in ${r}`; break;
      case 'IssuesEvent': kind = 'issue'; text = `${cap(p.action)} issue #${p.issue?.number} in ${r}`; break;
      case 'ReleaseEvent': kind = 'new'; text = `Released ${p.release?.tag_name || ''} of ${r}`; break;
      case 'PublicEvent': kind = 'new'; text = `Open-sourced ${r}`; break;
      case 'ForkEvent': kind = 'star'; text = `Forked ${r}`; break;
      case 'WatchEvent': kind = 'star'; text = `Starred ${r}`; break;
      default: continue;
    }
    out.push({ kind, text, date });
  }
  return out;
}
const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
const pushText = (n, r) => (n > 0 ? `Pushed ${n} commit${n === 1 ? '' : 's'} to ${r}` : `Pushed to ${r}`);

/** Recent activity feed + language breakdown. langs: [{name, color, value}] */
export function activitySvg(items, langs, now = new Date()) {
  const W = 838, H = 300, LW = 486, RX = 32 + LW + 24, RW = W - RX - 32;
  const KC = { push: T.ac, new: T.vi, pr: T.ac, issue: T.vi, star: T.mu };
  const rows = items.slice(0, 6);
  const list = rows.length ? rows.map((it, i) => {
    const y = 92 + i * 32;
    return `<g class="rw" style="animation-delay:${(i * 0.12).toFixed(2)}s">
<circle cx="${32 + 30}" cy="${y - 4}" r="5" fill="${KC[it.kind] || T.mu}"${i === 0 ? ' class="pn pl"' : ''}/>
${i < rows.length - 1 ? `<line x1="62" y1="${y + 4}" x2="62" y2="${y + 20}" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/>` : ''}
<text class="b" x="82" y="${y}" font-size="13.5" fill="${T.tx}">${esc(clip(it.text, 46))}</text>
<text class="m" x="${32 + LW - 20}" y="${y}" font-size="10" letter-spacing="1" text-anchor="end" fill="${T.mu}">${esc(fmtDay(it.date).toUpperCase())}</text></g>`;
  }).join('') : `<text class="b" x="52" y="96" font-size="13.5" fill="${T.mu}">No public activity in the last 90 days.</text>`;
  const top = langs.filter((l) => l.value > 0).sort((a, b) => b.value - a.value);
  const head = top.slice(0, 5), rest = top.slice(5).reduce((a, l) => a + l.value, 0);
  if (rest > 0) head.push({ name: 'Other', color: '#5b6474', value: rest });
  const sum = head.reduce((a, l) => a + l.value, 0) || 1;
  let bx = 0;
  const bar = head.map((l) => { const w = (l.value / sum) * (RW - 40); const r = `<rect x="${bx.toFixed(1)}" y="0" width="${Math.max(w - 2, 1).toFixed(1)}" height="10" rx="3" fill="${l.color || T.mu}"/>`; bx += w; return r; }).join('');
  const legend = head.map((l, i) => {
    const y = 116 + i * 22, pct = (l.value / sum) * 100;
    return `<circle cx="${RX + 26}" cy="${y - 4}" r="4.5" fill="${l.color || T.mu}"/><text class="b" x="${RX + 40}" y="${y}" font-size="13" fill="${T.tx}">${esc(l.name)}</text>
<text class="m" x="${RX + RW - 20}" y="${y}" font-size="11" text-anchor="end" fill="${T.mu}">${pct < 1 ? '<1' : pct.toFixed(pct < 10 ? 1 : 0)}%</text>`;
  }).join('');
  const panel = (x, w) => `<rect x="${x}" y="20" width="${w}" height="${H - 40}" rx="18" fill="${T.s1}" stroke="#fff" stroke-opacity=".09"/>`;
  return svg({
    w: W, h: H, fonts: ['display-700', 'body-400', 'mono-500'],
    css: `.bw{transform-box:fill-box;transform-origin:left center}` + motion(`.pl{animation:pl 2.4s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.4)}}
.rw{animation:rw .6s ease-out both}@keyframes rw{from{opacity:0;transform:translateX(-6px)}}
.bw{animation:bw 1.2s cubic-bezier(.2,.8,.2,1) both}@keyframes bw{from{transform:scaleX(0)}}`),
    title: 'Recent activity and languages',
    desc: `Recent public activity: ${rows.map((r) => r.text + ' (' + fmtDay(r.date) + ')').join('; ') || 'none'}. Languages: ${head.map((l) => l.name + ' ' + Math.round((l.value / sum) * 100) + '%').join(', ')}.`,
    body: `${panel(20, LW + 12)}${panel(RX - 12, RW + 24)}
<text class="d" x="52" y="58" font-size="18" font-weight="700" fill="${T.tx}">Recent activity</text>
<text class="m" x="${32 + LW - 20}" y="57" font-size="9.5" letter-spacing="1.2" text-anchor="end" fill="${T.ac}">● LIVE</text>
${list}
<text class="d" x="${RX + 20}" y="58" font-size="18" font-weight="700" fill="${T.tx}">Languages</text>
<g transform="translate(${RX + 20} 78)"><g class="bw">${bar}</g></g>
${legend}
<text class="m" x="${RX + 20}" y="${H - 34}" font-size="9" letter-spacing="1" fill="${T.mu}" opacity=".8">ACROSS OWN PUBLIC REPOS</text>`
  });
}
