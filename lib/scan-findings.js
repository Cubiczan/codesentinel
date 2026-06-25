/**
 * Convert Daytona scan output into analyzer findings.
 */

function findingsFromScan(scan, type) {
  if (!scan?.cloned) return null;

  switch (type) {
    case "dead_code":
      return scan.orphanFiles.slice(0, 12).map((filePath, idx) => ({
        type: "orphan_module",
        severity: idx < 3 ? "warning" : "info",
        file: filePath,
        line: 1,
        name: filePath.split("/").pop(),
        reason: `No inbound imports detected in Daytona sandbox scan of ${scan.stats.totalFiles} files.`,
        suggestion: "Confirm entry points and remove if truly unused.",
        source: "daytona_scan",
      }));
    case "circular_deps":
      return scan.cycles.map((cycle, idx) => ({
        type: "import_cycle",
        severity: idx === 0 ? "critical" : "warning",
        cycle: cycle,
        files: cycle,
        reason: `Circular import chain detected via sandbox clone (${cycle.length} modules).`,
        suggestion: "Break the cycle with a shared module or dependency inversion.",
        source: "daytona_scan",
      }));
    case "coupling":
      return Object.entries(scan.graph || {})
        .filter(([, deps]) => deps.length >= 8)
        .slice(0, 8)
        .map(([file, deps]) => ({
          type: "high_fan_out",
          severity: deps.length >= 12 ? "critical" : "warning",
          file,
          fanOut: deps.length,
          dependencies: deps.slice(0, 8),
          reason: `Module imports ${deps.length} external symbols (heuristic from sandbox scan).`,
          suggestion: "Split responsibilities or introduce facades.",
          source: "daytona_scan",
        }));
    case "drift":
      return scan.files
        .filter((f) => f.path.includes("/api/") && f.imports.some((i) => i.includes("../models")))
        .slice(0, 6)
        .map((f) => ({
          type: "layer_leak",
          severity: "warning",
          file: f.path,
          reason: "API layer file imports model-layer modules (heuristic).",
          suggestion: "Route through a service layer to preserve boundaries.",
          source: "daytona_scan",
        }));
    default:
      return [];
  }
}

function scanStats(scan) {
  if (!scan?.cloned) return {};
  return {
    totalFiles: scan.stats.totalFiles,
    scannedFiles: scan.stats.totalFiles,
    totalLoc: scan.stats.totalLoc,
    languages: scan.stats.languages,
    sandbox: "daytona",
  };
}

module.exports = { findingsFromScan, scanStats };
