/**
 * Repo fetcher — clones/parses repos from GitHub/GitLab.
 * For the hackathon demo, this is a stub that returns metadata.
 */

const { Octokit } = require("octokit");

async function fetchRepo(url, provider) {
  if (!url) return null;

  if (provider === "github" || url.includes("github.com")) {
    return fetchGitHubRepo(url);
  }

  // GitLab and others — return metadata for now
  return { url, provider, name: extractRepoName(url) };
}

async function fetchGitHubRepo(url) {
  const [owner, repo] = extractGitHubParts(url);
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      url,
      provider: "github",
      name: data.full_name,
      language: data.language,
      size: data.size,
      defaultBranch: data.default_branch,
      stars: data.stargazers_count,
    };
  } catch (err) {
    console.error(`Failed to fetch GitHub repo ${owner}/${repo}:`, err.message);
    return { url, provider: "github", name: `${owner}/${repo}`, fallback: true };
  }
}

function extractGitHubParts(url) {
  const match = url.match(/github\.com\/([\w.-]+)\/([\w.-]+)/);
  if (!match) return ["unknown", "unknown"];
  return [match[1], match[2].replace(/\.git$/, "")];
}

function extractRepoName(url) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts.slice(-2).join("/");
}

module.exports = { fetchRepo };