// Regenerates assets/hero.svg with live numbers and refreshes ?v= cache-busters in README.md.
// Node 20+, no dependencies. Env: GITHUB_TOKEN (or GH_PAT for private contributions). Optional: PROFILE_USER.
import { writeFileSync } from 'node:fs';
import { heroSvg, gameSvg, bumpReadmeVersions } from './svg-lib.mjs';

const user = process.env.PROFILE_USER || 'Param031010';
const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;

async function viaGraphQL() {
  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-build' },
    body: JSON.stringify({
      query: `query($login:String!){user(login:$login){followers{totalCount} repositories(privacy:PUBLIC,ownerAffiliations:OWNER){totalCount} own:repositories(privacy:PUBLIC,ownerAffiliations:OWNER,isFork:false){totalCount}
        contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`,
      variables: { login: user }
    })
  });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors || r.status));
  const u = j.data.user;
  const LV = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const days = u.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount, level: LV[d.contributionLevel] ?? 0 }));
  return { days, contributions: u.contributionsCollection.contributionCalendar.totalContributions, followers: u.followers.totalCount, repos: u.repositories.totalCount, projects: u.own.totalCount };
}

// Token-less fallback so the script also runs locally: public REST + community contributions API.
async function viaPublic() {
  const u = await (await fetch(`https://api.github.com/users/${user}`, { headers: { 'User-Agent': 'profile-build' } })).json();
  const c = await (await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)).json();
  const total = c.total?.lastYear ?? c.contributions.reduce((a, d) => a + d.count, 0);
  const list = await (await fetch(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`, { headers: { 'User-Agent': 'profile-build' } })).json();
  return { days: c.contributions, contributions: total, followers: u.followers, repos: u.public_repos, projects: list.filter((r) => !r.fork).length };
}

const nums = token ? await viaGraphQL().catch((e) => { console.warn(e.message, '- falling back to public APIs'); return viaPublic(); }) : await viaPublic();
console.log({ ...nums, days: nums.days.length });
const { days, ...stats } = nums;
writeFileSync('assets/hero.svg', heroSvg({ ...stats, patents: 2, cgpa: '9.28' }));
writeFileSync('assets/activity-game.svg', gameSvg(days, stats.contributions));
bumpReadmeVersions();
