// Generates the static (non-numeric) profile SVGs into assets/. Run: node scripts/build-static.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { svg, motion, T, esc, textW, bumpReadmeVersions } from './svg-lib.mjs';

mkdirSync('assets', { recursive: true });
const out = (name, s) => { writeFileSync('assets/' + name, s); console.log(name, Math.round(s.length / 1024) + ' KB'); };
const tag = (x, y, label, color) => {
  const w = textW(label, 11, 0.6) + (color ? 34 : 24);
  return { w, svg: `<g transform="translate(${x} ${y})"><rect width="${w}" height="26" rx="13" fill="none" stroke="#fff" stroke-opacity=".14"/>${color ? `<circle cx="14" cy="13" r="4" fill="${color}"/>` : ''}<text class="m" x="${color ? 26 : 12}" y="17" font-size="11" fill="${T.mu}">${esc(label)}</text></g>` };
};
const lines = (arr, x, y, size, fill, lh, cls = 'b') => arr.map((l, i) => `<text class="${cls}" x="${x}" y="${y + i * lh}" font-size="${size}" fill="${fill}">${esc(l)}</text>`).join('');

/* ---------- about.svg ---------- */
{
  const W = 838, H = 232, g = 16, cw = (W - 2 * g) / 3;
  const icon1 = `<g transform="translate(22 22)"><rect x="2" y="6" width="30" height="38" rx="5" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"/><rect x="12" y="2" width="30" height="38" rx="5" fill="${T.s1}" stroke="${T.ac}" stroke-width="2"/><path class="ln" d="M20 14h14M20 22h14M20 30h8" stroke="${T.ac}" stroke-width="2" stroke-linecap="round" fill="none"/></g>`;
  const icon2 = `<g transform="translate(22 22)"><circle cx="24" cy="24" r="19" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2" stroke-dasharray="3 6"/><circle class="pn pl" cx="24" cy="24" r="7" fill="${T.ac}"/><g class="sp"><circle cx="24" cy="5" r="4.5" fill="${T.vi}"/></g></g>`;
  const icon3 = `<g transform="translate(22 22)"><g stroke="${T.ac}" stroke-opacity=".6" stroke-width="1.8" fill="none"><path d="M6 12L24 24M6 36L24 24M42 12L24 24M42 36L24 24" stroke-linecap="round"/></g><circle class="pn pl" cx="24" cy="24" r="8" fill="${T.ac}"/><circle class="pn pl" style="animation-delay:-.7s" cx="6" cy="12" r="4.5" fill="${T.vi}"/><circle class="pn pl" style="animation-delay:-1.4s" cx="6" cy="36" r="4.5" fill="${T.vi}"/><circle class="pn pl" style="animation-delay:-2.1s" cx="42" cy="12" r="4.5" fill="${T.vi}"/><circle class="pn pl" style="animation-delay:-2.8s" cx="42" cy="36" r="4.5" fill="${T.vi}"/></g>`;
  const tags = ['MedSys AI', 'GitShow', 'Wayfarer'];
  let tx = 0, ty = 0, tagSvg = '';
  tags.forEach((t) => { const k = tag(0, 0, t); if (tx + k.w > cw - 44) { tx = 0; ty += 34; } tagSvg += tag(tx, ty, t).svg; tx += k.w + 8; });
  const card = (i, inner, icon) => `<g transform="translate(${i * (cw + g)} 0)"><rect x=".5" y=".5" width="${cw - 1}" height="${H - 1}" rx="20" fill="${T.s1}" stroke="#fff" stroke-opacity=".09"/>${icon}${inner}</g>`;
  const body = card(0, `<text class="d" x="22" y="106" font-size="21" font-weight="700" fill="${T.tx}">Two patents filed</text>
<text class="m" x="22" y="140" font-size="11" fill="${T.ac}">01</text>${lines(['AI-powered autonomous height', 'detection system'], 48, 141, 13.5, T.mu, 18)}
<text class="m" x="22" y="190" font-size="11" fill="${T.vi}">02</text>${lines(['Multilingual transliteration system'], 48, 191, 13.5, T.mu, 18)}`, icon1)
    + card(1, `<text class="d" x="22" y="106" font-size="21" font-weight="700" fill="${T.tx}">Agent-based projects</text><g transform="translate(22 128)">${tagSvg}</g>`, icon2)
    + card(2, `<text class="d" x="22" y="106" font-size="21" font-weight="700" fill="${T.tx}">Generative AI focus</text>${lines(['RAG, LoRA fine-tuning and', 'LLM-powered agents.'], 22, 140, 13.5, T.mu, 19)}`, icon3);
  out('about.svg', svg({
    w: W, h: H, fonts: ['display-700', 'body-400', 'mono-500'],
    css: motion(`.ln{stroke-dasharray:60;animation:ln 4s ease-in-out infinite}@keyframes ln{0%{stroke-dashoffset:60}45%,100%{stroke-dashoffset:0}}
.pl{animation:pl 3s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.22)}}
.sp{transform-origin:24px 24px;animation:sp 8s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
.mr{animation:mr 2s linear infinite}@keyframes mr{to{stroke-dashoffset:-45}}`),
    title: 'About', desc: 'Two patents filed (AI-powered autonomous height detection system; multilingual transliteration system). Agent-based projects: MedSys AI, GitShow, Wayfarer. Generative AI focus: RAG, LoRA fine-tuning and LLM-powered agents.', body
  }));
}

/* ---------- project cards ---------- */
const PW = 420, PH = 300;
function projectCard(file, { title, desc, tags, art, css = '' }) {
  let x = 24, tg = '';
  tags.forEach(([l, c]) => { const k = tag(x, 0, l, c); tg += k.svg; x += k.w + 8; });
  out(file, svg({
    w: PW, h: PH, fonts: ['display-700', 'body-400', 'mono-500'], radius: 20,
    css: css + motion(`.pl{animation:pl 2.8s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.25)}}
.mr{animation:mr 2s linear infinite}@keyframes mr{to{stroke-dashoffset:-48}}`),
    title: title + ' project card', desc: desc.join(' '),
    body: `<clipPath id="ac"><path d="M0 130V20Q0 0 20 0H${PW - 20}Q${PW} 0 ${PW} 20V130Z"/></clipPath>
<g clip-path="url(#ac)"><rect width="${PW}" height="130" fill="${T.s2}"/>${art}</g>
<line x1="0" y1="130.5" x2="${PW}" y2="130.5" stroke="#fff" stroke-opacity=".09"/>
<text class="d" x="24" y="172" font-size="24" font-weight="700" fill="${T.tx}">${esc(title)}</text>
<path d="M${PW - 46} 160l12-12M${PW - 44} 148h12v12" fill="none" stroke="${T.mu}" stroke-width="1.8" stroke-linecap="round"/>
${lines(desc, 24, 200, 13.5, T.mu, 19)}
<g transform="translate(0 ${PH - 48})">${tg}</g>`
  }));
}
const dashStroke = `stroke="${T.ac}" stroke-width="2" stroke-dasharray="5 7" fill="none"`;

projectCard('project-medsys.svg', {
  title: 'MedSys AI', desc: ['Health app with document-grounded chat,', 'symptom knowledge graphs and', 'nearby-care search.'],
  tags: [['TypeScript', T.lang.TypeScript]],
  art: `<g stroke="${T.ac}" stroke-opacity=".45" stroke-width="1.5" fill="none"><line x1="210" y1="65" x2="90" y2="30"/><line x1="210" y1="65" x2="110" y2="105"/><line x1="210" y1="65" x2="330" y2="28"/><line x1="210" y1="65" x2="320" y2="102"/><line x1="90" y1="30" x2="110" y2="105"/><line x1="330" y1="28" x2="320" y2="102"/></g>
<circle class="pn pl" cx="210" cy="65" r="15" fill="${T.ac}"/>
${[[90, 30, 0.5], [110, 105, 1], [330, 28, 1.5], [320, 102, 2]].map(([x, y, d]) => `<circle class="pn pl" style="animation-delay:-${d}s" cx="${x}" cy="${y}" r="8" fill="${T.vi}"/>`).join('')}`
});
projectCard('project-gitshow.svg', {
  title: 'GitShow', desc: ['Chat assistant for exploring and acting on', 'GitHub repos, with confirm-before-write.'],
  tags: [['Python', T.lang.Python], ['React']],
  css: motion(`.bk{animation:bk 1.4s steps(1) infinite}@keyframes bk{50%{opacity:.15}}`),
  art: `<path d="M40 82H380" stroke="#fff" stroke-opacity=".16" stroke-width="2" fill="none"/>
<path class="mr" d="M110 82C130 82 130 38 160 38H260C285 38 285 82 305 82" ${dashStroke}/>
<circle cx="60" cy="82" r="7" fill="${T.s1}" stroke="#fff" stroke-opacity=".3" stroke-width="2"/><circle cx="110" cy="82" r="7" fill="${T.s1}" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
<circle class="pn pl" style="animation-delay:-.5s" cx="160" cy="38" r="7" fill="${T.ac}"/><circle class="pn pl" style="animation-delay:-1s" cx="260" cy="38" r="7" fill="${T.ac}"/><circle class="pn pl" style="animation-delay:-1.5s" cx="330" cy="82" r="8" fill="${T.vi}"/>
<rect x="150" y="100" width="120" height="22" rx="11" fill="${T.s1}" stroke="${T.ac}" stroke-width="1.5"/><path d="M168 111h50" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/><circle class="bk" cx="246" cy="111" r="4" fill="${T.ac}"/>`
});
const route = 'M40 98C100 98 90 36 170 58S290 112 380 34';
projectCard('project-wayfarer.svg', {
  title: 'Wayfarer', desc: ['Gemini-powered AI travel planner that', 'researches trips and builds the itinerary,', 'budget and map.'],
  tags: [['AI agent'], ['Gemini']],
  art: `<path class="mr" d="${route}" ${dashStroke}/>
<circle cx="40" cy="98" r="7" fill="${T.s1}" stroke="${T.ac}" stroke-width="2"/><circle cx="380" cy="34" r="7" fill="${T.s1}" stroke="${T.vi}" stroke-width="2"/><circle cx="170" cy="58" r="5" fill="${T.s1}" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
<circle r="6" fill="${T.ac}"><animateMotion dur="4s" repeatCount="indefinite" path="${route}"/></circle>`
});
const road = 'M40 100H120V48H230V100H310V40H380';
projectCard('project-dispatch.svg', {
  title: 'Dispatch.AI', desc: ['AI-assisted dispatch application.'],
  tags: [['TypeScript', T.lang.TypeScript]],
  art: `<path class="mr" d="${road}" ${dashStroke}/>
${[[40, 100, T.ac], [120, 48, '#fff'], [230, 100, '#fff'], [310, 40, '#fff'], [380, 40, T.vi]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${T.s1}" stroke="${c}" stroke-opacity="${c === '#fff' ? .3 : 1}" stroke-width="2"/>`).join('')}
<circle r="6" fill="${T.ac}"><animateMotion dur="5s" repeatCount="indefinite" path="${road}"/></circle>`
});

/* ---------- stack ---------- */
const RING1 = ['Python', 'LangChain', 'TensorFlow', 'HuggingFace'];
const RING2 = ['Java', 'FastAPI', 'Pandas', 'Scikit-Learn', 'MongoDB', 'Pinecone', 'JavaScript', 'Vercel'];
const DOT = { Python: '#3572a5', JavaScript: '#f1e05a', Java: '#ff9a3c', LangChain: '#5fe6d0', TensorFlow: '#ff9a3c', HuggingFace: '#ffd21e', FastAPI: '#2fbf9b', Pandas: '#8c7bff', 'Scikit-Learn': '#f89939', MongoDB: '#6cc24a', Pinecone: '#5b8cff', Vercel: '#e9edf5' };
{
  const S = 420, C = S / 2;
  const chip = (n, x, y) => {
    const w = textW(n, 12, 0.56) + 30;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="up"><rect x="${-w / 2}" y="-12" width="${w}" height="24" rx="12" fill="${T.s2}" stroke="#fff" stroke-opacity=".1"/><circle cx="${-w / 2 + 13}" cy="0" r="4" fill="${DOT[n]}"/><text class="b" x="${-w / 2 + 23}" y="4.5" font-size="12" font-weight="600" fill="${T.tx}">${esc(n)}</text></g></g>`;
  };
  const ring = (names, r, off, cls, upCls) => `<g class="${cls}"><circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-dasharray="3 6"/>${names.map((n, i) => { const a = ((off + 360 / names.length * i) * Math.PI) / 180; return chip(n, C + r * Math.cos(a), C + r * Math.sin(a)).replace('class="up"', `class="${upCls}"`); }).join('')}</g>`;
  out('stack-orbit.svg', svg({
    w: S, h: S, fonts: ['body-600', 'mono-500'], radius: 20,
    css: motion(`.r1{transform-origin:${C}px ${C}px;animation:cw 50s linear infinite}.r2{transform-origin:${C}px ${C}px;animation:cw 80s linear infinite reverse}
.u1{transform-origin:0 0;animation:ccw 50s linear infinite}.u2{transform-origin:0 0;animation:ccw 80s linear infinite reverse}
@keyframes cw{to{transform:rotate(360deg)}}@keyframes ccw{to{transform:rotate(-360deg)}}
.core{animation:pl 4s ease-in-out infinite}@keyframes pl{50%{transform:scale(1.12)}}`),
    title: 'Stack orbit', desc: `Two rotating rings of technologies: ${RING1.join(', ')} (inner); ${RING2.join(', ')} (outer).`,
    body: `${ring(RING2, 150, 0, 'r2', 'u2')}${ring(RING1, 78, 20, 'r1', 'u1')}
<g class="pn core"><circle cx="${C}" cy="${C}" r="34" fill="${T.s2}" stroke="${T.ac}" stroke-opacity=".5"/><text class="m" x="${C}" y="${C + 3.5}" font-size="10" letter-spacing="1.6" text-anchor="middle" fill="${T.ac}">STACK</text></g>`
  }));
}
{
  const W = 418, pad = 18;
  const GROUPS = [
    ['Programming languages', ['C', 'Java', 'Python']],
    ['Generative AI & LLMs', ['Prompt Engineering', 'Retrieval-Augmented Generation (RAG)', 'Fine-tuning LLMs (LoRA based)', 'Working with LLMs']],
    ['Frameworks', ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'LangChain', 'FastAPI', 'Scikit-Learn', 'TensorFlow', 'Transformers', 'HuggingFace']],
    ['Databases', ['MongoDB', 'MySQL', 'FAISS', 'Pinecone']],
    ['Web technologies', ['HTML', 'CSS', 'JavaScript']],
    ['Tools & deployment', ['Git & GitHub', 'REST APIs', 'Vercel']],
    ['Operating systems', ['Windows']]
  ];
  let y = 8, body = '';
  GROUPS.forEach(([name, items], gi) => {
    let x = pad, row = 0, tg = '';
    items.forEach((it) => {
      const w = textW(it, 11.5, 0.56) + (DOT[it] ? 32 : 22);
      if (x + w > W - pad && x > pad) { x = pad; row++; }
      const cy = row * 30;
      tg += `<g transform="translate(${x} ${cy})"><rect width="${w}" height="24" rx="12" fill="none" stroke="#fff" stroke-opacity=".14"/>${DOT[it] ? `<circle cx="13" cy="12" r="4" fill="${DOT[it]}"/>` : ''}<text class="b" x="${DOT[it] ? 24 : 11}" y="16" font-size="11.5" fill="${T.mu}">${esc(it)}</text></g>`;
      x += w + 7;
    });
    const h = 40 + (row + 1) * 30 + 12;
    body += `<g transform="translate(0 ${y})">${gi ? `<line x1="${pad}" x2="${W - pad}" y1="0" y2="0" stroke="#fff" stroke-opacity=".09"/>` : ''}<text class="m" x="${pad}" y="28" font-size="10" letter-spacing="1.5" fill="${T.mu}">${esc(name.toUpperCase())}</text><g transform="translate(0 40)">${tg}</g></g>`;
    y += h;
  });
  const H = y + 8;
  out('stack-groups.svg', svg({
    w: W, h: H, fonts: ['body-400', 'mono-500'], radius: 20, body: `<g>${body}</g>`,
    title: 'Stack', desc: GROUPS.map(([n, i]) => `${n}: ${i.join(', ')}`).join('. ') + '.'
  }));
}

/* ---------- connect pills ---------- */
for (const [file, label, value, color] of [
  ['connect-linkedin.svg', 'LinkedIn', 'paramraval', T.ac],
  ['connect-leetcode.svg', 'LeetCode', 'Param_03', T.vi],
  ['connect-email.svg', 'Email', 'paramraval2005@gmail.com', T.ac]
]) {
  const lw = textW(label, 12.5, 0.6), vw = textW(value, 11.5, 0.6);
  const W = Math.ceil(34 + lw + 12 + vw + 20 + 14), H = 44;
  out(file, svg({
    w: W, h: H, radius: 22, fonts: ['mono-500'], title: `${label}: ${value}`, desc: `${label} link, ${value}`,
    css: motion(`.dt{animation:dt 2.6s ease-out infinite}@keyframes dt{0%{r:3;opacity:.9}100%{r:9;opacity:0}}`),
    body: `<circle cx="20" cy="22" r="3" fill="${color}"/><circle class="dt" cx="20" cy="22" r="3" fill="none" stroke="${color}" opacity="0"/>
<text class="m" x="34" y="26.5" font-size="12.5" fill="${T.tx}">${esc(label)}</text>
<rect x="${34 + lw + 12}" y="11" width="${vw + 20}" height="22" rx="7" fill="${T.s2}"/><text class="m" x="${34 + lw + 22}" y="26" font-size="11.5" fill="${T.mu}">${esc(value)}</text>`
  }));
}

bumpReadmeVersions();
