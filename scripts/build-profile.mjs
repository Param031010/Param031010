// Regenerates the live profile SVGs (hero, contributions, activity) and refreshes ?v= cache-busters in README.md.
// Node 20+, no dependencies. Env: GITHUB_TOKEN (or GH_PAT for private contributions). Optional: PROFILE_USER, MOCK=1.
import { writeFileSync } from 'node:fs';
import { heroSvg, contribSvg, activitySvg, describeEvents, T, bumpReadmeVersions } from './svg-lib.mjs';

const user = process.env.PROFILE_USER || 'Param031010';
const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
const H = { 'User-Agent': 'profile-build', Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
const getJson = async (url) => { const r = await fetch(url, { headers: H }); if (!r.ok) throw new Error(`${url} -> ${r.status}`); return r.json(); };

async function viaGraphQL() {
  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query($login:String!){user(login:$login){followers{totalCount} repositories(privacy:PUBLIC,ownerAffiliations:OWNER){totalCount}
        own:repositories(first:100,privacy:PUBLIC,ownerAffiliations:OWNER,isFork:false){totalCount nodes{languages(first:10){edges{size node{name color}}}}}
        contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`,
      variables: { login: user }
    })
  });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors || r.status));
  const u = j.data.user;
  const LV = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const days = u.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount, level: LV[d.contributionLevel] ?? 0 }));
  const langs = {};
  for (const n of u.own.nodes) for (const e of n.languages.edges) (langs[e.node.name] ??= { name: e.node.name, color: e.node.color, value: 0 }).value += e.size;
  return { days, langs: Object.values(langs), contributions: u.contributionsCollection.contributionCalendar.totalContributions, followers: u.followers.totalCount, repos: u.repositories.totalCount, projects: u.own.totalCount };
}

// Token-less fallback so the script also runs locally: public REST + community contributions API.
async function viaPublic() {
  const u = await getJson(`https://api.github.com/users/${user}`);
  const c = await (await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)).json();
  const total = c.total?.lastYear ?? c.contributions.reduce((a, d) => a + d.count, 0);
  const list = (await getJson(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`)).filter((r) => !r.fork);
  const langs = {};
  for (const r of list) if (r.language) (langs[r.language] ??= { name: r.language, color: T.lang[r.language], value: 0 }).value += Math.max(r.size, 1);
  return { days: c.contributions, langs: Object.values(langs), contributions: total, followers: u.followers, repos: u.public_repos, projects: list.length };
}

function mock() {
  const days = []; const now = Date.now();
  for (let i = 370; i >= 0; i--) { const d = new Date(now - i * 864e5); const c = Math.random() < 0.55 ? 0 : Math.floor(Math.random() ** 2 * 14); days.push({ date: d.toISOString().slice(0, 10), count: c }); }
  const langs = [['TypeScript', 52e4], ['Python', 41e4], ['JavaScript', 12e4], ['HTML', 6e4], ['CSS', 3e4], ['Java', 2e4], ['Jupyter Notebook', 1e4]].map(([name, value]) => ({ name, value, color: T.lang[name] }));
  const t = (h) => new Date(now - h * 36e5).toISOString();
  const events = [
    { type: 'PushEvent', repo: { name: `${user}/MedSysAI_01` }, payload: { size: 3 }, created_at: t(2) },
    { type: 'PushEvent', repo: { name: `${user}/MedSysAI_01` }, payload: { size: 2 }, created_at: t(3) },
    { type: 'PullRequestEvent', repo: { name: 'Priyanshu-Madhup/Wayferer' }, payload: { action: 'opened', number: 14, pull_request: {} }, created_at: t(26) },
    { type: 'CreateEvent', repo: { name: `${user}/Dispatch.AI` }, payload: { ref_type: 'repository' }, created_at: t(50) },
    { type: 'PushEvent', repo: { name: `${user}/GitShow` }, payload: { size: 5 }, created_at: t(76) },
    { type: 'WatchEvent', repo: { name: 'langchain-ai/langgraph' }, payload: {}, created_at: t(100) },
    { type: 'PushEvent', repo: { name: `${user}/${user}` }, payload: { size: 1 }, created_at: t(130) }
  ];
  return { days, langs, events, contributions: days.reduce((a, d) => a + d.count, 0), followers: 1, repos: 24, projects: 21 };
}

const nums = process.env.MOCK ? mock()
  : token ? await viaGraphQL().catch((e) => { console.warn(e.message, '- falling back to public APIs'); return viaPublic(); }) : await viaPublic();
const events = nums.events ?? await getJson(`https://api.github.com/users/${user}/events/public?per_page=60`).catch((e) => { console.warn(e.message); return null; });

const { days, langs, events: _e, ...stats } = nums;
console.log({ ...stats, days: days.length, langs: langs.length, events: events?.length });
writeFileSync('assets/hero.svg', heroSvg({ ...stats, patents: 2, cgpa: '9.28' }));
if (days.length) writeFileSync('assets/contributions.svg', contribSvg(days, stats.contributions));
if (events) writeFileSync('assets/activity.svg', activitySvg(describeEvents(events, user), langs));
else console.warn('events unavailable - keeping previous activity.svg');
bumpReadmeVersions();
