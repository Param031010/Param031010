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
