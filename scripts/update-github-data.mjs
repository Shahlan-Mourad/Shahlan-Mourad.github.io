// Fetches public repos from the GitHub API and saves them to data/github.json.
// The site reads that file for the "More on GitHub" list, so visitors never
// call the GitHub API themselves (it allows only 60 requests per hour without a token).
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

const url = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
const response = await fetch(url, { headers });
if (!response.ok) {
  throw new Error(`GitHub API error ${response.status} for ${url}`);
}

const repos = (await response.json())
  .filter((repo) => !repo.fork && !repo.private && !IGNORED_REPOS.has(repo.name));

const data = {
  generatedAt: new Date().toISOString(),
  projects: repos.slice(0, MAX_PROJECTS).map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    url: repo.html_url
  }))
};

await mkdir('data', { recursive: true });
await writeFile('data/github.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved ${data.projects.length} projects to data/github.json`);
