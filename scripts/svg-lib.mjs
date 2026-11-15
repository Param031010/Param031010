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

/** Rewrites ?v=<sha> on every assets/*.svg reference in README.md (GitHub's image proxy caches hard). */
export function bumpReadmeVersions(readmePath = 'README.md', assetsDir = 'assets') {
  let md = readFileSync(readmePath, 'utf8');
  md = md.replace(/assets\/([\w-]+\.svg)(\?v=[0-9a-f]+)?/g, (_, name) => {
    const v = shortSha(readFileSync(join(assetsDir, name)));
    return `assets/${name}?v=${v}`;
  });
  writeFileSync(readmePath, md);
}

