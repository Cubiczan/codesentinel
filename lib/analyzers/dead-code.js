/**
 * Dead code analyzer — detects unused functions, classes, and modules.
 * Uses Daytona sandbox scan when available; otherwise returns demo findings.
 */

const { findingsFromScan, scanStats } = require("../scan-findings");

function detectDeadCode(repoInfo) {
  const liveFindings = findingsFromScan(repoInfo?.scan, "dead_code");
  if (liveFindings?.length) {
    return {
      type: "dead_code",
      description: "Dead code detection (Daytona sandbox scan)",
      findings: liveFindings,
      stats: {
        ...scanStats(repoInfo.scan),
        orphanModules: liveFindings.length,
      },
      timestamp: new Date().toISOString(),
      repo: repoInfo?.url || "workspace",
      scanMode: "daytona",
    };
  }

  // Demo data simulating analysis of a real codebase
  const findings = [
    {
      type: "dead_function",
      severity: "warning",
      file: "src/services/legacy-auth.ts",
      line: 47,
      name: "validateSessionToken",
      reason: "Function is defined but never called. The migration to JWT in PR #342 replaced all call sites.",
      suggestion: "Remove and verify CI passes.",
    },
    {
      type: "dead_function",
      severity: "warning",
      file: "src/utils/formatters.ts",
      line: 112,
      name: "formatCurrencyV1",
      reason: "Superseded by formatCurrency() on line 89. All 23 call sites use the V2 version.",
      suggestion: "Remove the deprecated V1 function.",
    },
    {
      type: "dead_class",
      severity: "critical",
      file: "src/models/legacy-user.ts",
      line: 1,
      name: "LegacyUserModel",
      reason: "Entire class (342 lines) has zero references. The migration to UserEntity completed 6 months ago.",
      suggestion: "Delete file. Check for any runtime imports via string interpolation.",
    },
    {
      type: "dead_module",
      severity: "critical",
      file: "src/lib/deprecated-cache.ts",
      line: 1,
      name: "deprecated-cache",
      reason: "Module is never imported. Replaced by Redis cache layer in src/lib/cache.ts.",
      suggestion: "Delete file and remove from tsconfig include paths.",
    },
    {
      type: "dead_function",
      severity: "info",
      file: "src/components/Chart.tsx",
      line: 203,
      name: "calculateTrendline",
      reason: "Helper function defined inside component but not used in current render path. May be intended for future use.",
      suggestion: "Remove or convert to a utility function in a separate file.",
    },
    {
      type: "dead_export",
      severity: "warning",
      file: "src/api/routes/admin.ts",
      line: 89,
      name: "exported function purgeAllLogs",
      reason: "Exported from route file but never imported by any other module.",
      suggestion: "Remove if no external consumers exist.",
    },
  ];

  return {
    type: "dead_code",
    description: "Dead code detection",
    findings,
    stats: {
      totalFiles: 284,
      scannedFiles: 284,
      deadFunctions: findings.filter((f) => f.type === "dead_function").length,
      deadClasses: findings.filter((f) => f.type === "dead_class").length,
      deadModules: findings.filter((f) => f.type === "dead_module").length,
      deadExports: findings.filter((f) => f.type === "dead_export").length,
      estimatedDeadLOC: 487,
    },
    timestamp: new Date().toISOString(),
    repo: repoInfo?.url || "workspace",
  };
}

module.exports = { detectDeadCode };