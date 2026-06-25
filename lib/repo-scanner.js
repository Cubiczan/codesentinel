/**
 * Clone a GitHub repo in a Daytona sandbox and build a lightweight import graph.
 */

const { runInSandbox, isDaytonaEnabled } = require("./daytona-sandbox");

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py"];
const IGNORED_DIRS = new Set(["node_modules", "dist", "build", ".git", "coverage", "__pycache__", ".next"]);

function parseImports(content, ext) {
  const imports = new Set();
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext)) {
    const patterns = [
      /import\s+[^'"]*['"]([^'"]+)['"]/g,
      /require\(\s*['"]([^'"]+)['"]\s*\)/g,
      /from\s+['"]([^'"]+)['"]/g,
    ];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.add(match[1]);
      }
    }
  } else if (ext === ".py") {
    const patterns = [/^\s*import\s+([\w.]+)/gm, /^\s*from\s+([\w.]+)\s+import/gm];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.add(match[1]);
      }
    }
  }
  return [...imports];
}

function normalizePath(repoDir, filePath) {
  return filePath.replace(`${repoDir}/`, "").replace(/^\.\//, "");
}

function detectCycles(graph) {
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();

  function dfs(node, stack) {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      if (idx >= 0) {
        cycles.push(stack.slice(idx).concat(node));
      }
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    stack.push(node);
    for (const next of graph[node] || []) {
      dfs(next, stack);
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of Object.keys(graph)) {
    dfs(node, []);
  }
  return cycles.slice(0, 10);
}

async function scanRepository(repoUrl) {
  if (!repoUrl || !isDaytonaEnabled()) {
    return null;
  }

  return runInSandbox(repoUrl, async (sandbox, repoDir, timeoutSec) => {
    const listCmd =
      "find . -type f \\( " +
      SOURCE_EXTENSIONS.map((ext) => `-name '*${ext}'`).join(" -o ") +
      " \\) ! -path '*/node_modules/*' ! -path '*/dist/*' ! -path '*/.git/*' | head -250";

    const listing = await sandbox.process.executeCommand(listCmd, repoDir, undefined, timeoutSec);
    const paths = (listing.result || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((p) => !IGNORED_DIRS.has(p.split("/")[1] || ""));

    const files = [];
    const graph = {};
    const incoming = {};

    for (const relPath of paths) {
      const fullPath = relPath.startsWith("./") ? `${repoDir}/${relPath.slice(2)}` : `${repoDir}/${relPath}`;
      const normalized = normalizePath(repoDir, fullPath);
      const ext = normalized.slice(normalized.lastIndexOf("."));
      const cat = await sandbox.process.executeCommand(`head -c 120000 '${fullPath}'`, repoDir, undefined, 30);
      const content = cat.result || "";
      const imports = parseImports(content, ext);
      files.push({ path: normalized, ext, imports, loc: content.split("\n").length });
      graph[normalized] = imports.filter((i) => !i.startsWith(".") && !i.startsWith("@"));
      incoming[normalized] = 0;
    }

    for (const [from, targets] of Object.entries(graph)) {
      for (const target of targets) {
        for (const candidate of files) {
          if (candidate.path.includes(target.replace(/\./g, "/")) || candidate.path.endsWith(`${target}.ts`)) {
            incoming[candidate.path] = (incoming[candidate.path] || 0) + 1;
          }
        }
      }
    }

    const orphanFiles = files
      .filter((f) => (incoming[f.path] || 0) === 0 && !f.path.includes("index."))
      .map((f) => f.path);

    const languages = files.reduce((acc, f) => {
      const lang = f.ext.replace(".", "");
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    return {
      cloned: true,
      provider: "daytona",
      repoDir,
      files,
      graph,
      orphanFiles,
      cycles: detectCycles(graph),
      stats: {
        totalFiles: files.length,
        languages,
        totalLoc: files.reduce((sum, f) => sum + f.loc, 0),
      },
    };
  });
}

module.exports = { scanRepository, parseImports, detectCycles, isDaytonaEnabled };
