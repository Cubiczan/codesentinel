/**
 * Resolve MCP repo_path into repo metadata (+ optional Daytona scan).
 */

const { fetchRepo } = require("./repo-fetcher");

async function resolveRepo(repoPath) {
  if (!repoPath) return null;
  if (repoPath.startsWith("http://") || repoPath.startsWith("https://")) {
    const provider = repoPath.includes("github.com") ? "github" : "gitlab";
    return fetchRepo(repoPath, provider);
  }
  return { url: repoPath, provider: "local", name: repoPath };
}

module.exports = { resolveRepo };
