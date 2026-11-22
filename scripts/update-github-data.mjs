// Fetches public repos and their languages from the GitHub API and saves them
// to data/github.json. The site reads that file, so visitors never call the
// GitHub API themselves (it allows only 60 requests per hour without a token).
//
// Run locally:  GITHUB_TOKEN=$(gh auth token) node scripts/update-github-data.mjs
// In CI the workflow passes its own GITHUB_TOKEN.

import { mkdir, writeFile } from 'node:fs/promises';

const USERNAME = 'Shahlan-Mourad';
const MAX_PROJECTS = 12;

// Repos that should not be shown on the site
const IGNORED_REPOS = new Set([
  'Shahlan-Mourad.github.io',
  'Shahlan-Mourad',
  'UserRegistrationService',
  'Menu',
  'Receipt',
  'LibrarySystem'
]);

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-data-script',
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` })
};

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${url}`);
  }
  return response.json();
}

const repos = (await getJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`))
  .filter((repo) => !repo.fork && !repo.private && !IGNORED_REPOS.has(repo.name));

const languageLists = await Promise.all(repos.map((repo) => getJson(repo.languages_url)));

const languages = {};
for (const list of languageLists) {
  for (const [language, bytes] of Object.entries(list)) {
    languages[language] = (languages[language] ?? 0) + bytes;
  }
}

const data = {
  generatedAt: new Date().toISOString(),
  languages,
  projects: repos.slice(0, MAX_PROJECTS).map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    url: repo.html_url
  }))
};

await mkdir('data', { recursive: true });
await writeFile('data/github.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved ${data.projects.length} projects and ${Object.keys(languages).length} languages to data/github.json`);
