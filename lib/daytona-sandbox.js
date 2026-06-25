/**
 * Daytona sandbox helpers for isolated repo operations.
 */

const { Daytona } = require("@daytona/sdk");

function isDaytonaEnabled() {
  if (process.env.DAYTONA_DISABLE === "1" || process.env.DAYTONA_DISABLE === "true") {
    return false;
  }
  return Boolean(process.env.DAYTONA_API_KEY);
}

function buildAuthenticatedCloneUrl(repoUrl) {
  const token = process.env.GITHUB_TOKEN;
  if (!token || !repoUrl.includes("github.com")) {
    return repoUrl;
  }
  return repoUrl.replace("https://github.com/", `https://x-access-token:${token}@github.com/`);
}

async function createRepoSandbox(repoUrl) {
  const daytona = new Daytona();
  const sandbox = await daytona.create({ language: "typescript" });
  const workDir = (await sandbox.getWorkDir?.()) || "/home/daytona";
  const repoDir = `${workDir}/repo`;

  await sandbox.git.clone(buildAuthenticatedCloneUrl(repoUrl), repoDir);

  return {
    sandbox,
    repoDir,
    async cleanup() {
      try {
        await sandbox.delete();
      } catch (err) {
        console.error("Daytona sandbox cleanup failed:", err.message);
      }
    },
  };
}

async function runInSandbox(repoUrl, fn, { timeoutSec = 120 } = {}) {
  if (!isDaytonaEnabled()) {
    return null;
  }

  const ctx = await createRepoSandbox(repoUrl);
  try {
    return await fn(ctx.sandbox, ctx.repoDir, timeoutSec);
  } finally {
    await ctx.cleanup();
  }
}

module.exports = {
  isDaytonaEnabled,
  buildAuthenticatedCloneUrl,
  createRepoSandbox,
  runInSandbox,
};
