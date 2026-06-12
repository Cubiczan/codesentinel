# CodeSentinel — Demo Video Script

**Target length:** ~3 minutes
**Track:** New Slack Agent

---

## Scene 1: Problem Statement (0:00 - 0:30)

**[Screen: Code editor showing a large, messy codebase with lots of files]**

NARRATOR: "Every engineering team knows the problem. Codebases grow, features ship, deadlines loom — and somewhere along the way, dead code accumulates, circular dependencies creep in, coupling gets out of hand, and the architecture slowly drifts away from the original design."

**[Screen: Split view — left side shows a complex dependency graph with red nodes, right side shows a frustrated developer]**

NARRATOR: "These issues are invisible in day-to-day work. But they slow down every sprint, make onboarding painful, and turn every refactoring into a minefield. The tools to detect these problems exist — but they live in CI dashboards that nobody checks, or require specialized knowledge to run and interpret."

---

## Scene 2: Introducing CodeSentinel (0:30 - 1:00)

**[Screen: Slack interface opens, showing the CodeSentinel assistant in the sidebar]**

NARRATOR: "CodeSentinel brings codebase health analysis directly into Slack — where your team already works. It's an AI agent that detects dead code, circular dependencies, coupling issues, and architectural drift, and presents the results with rich, actionable visualizations."

**[Screen: Show the CodeSentinel icon and name in the Slack app directory]**

NARRATOR: "Built on the Slack Agent Builder platform, CodeSentinel uses Slack's AI capabilities for intelligent intent understanding, integrates via the Model Context Protocol to expose analysis tools to any MCP-compatible client, and delivers results through beautiful Block Kit interfaces."

---

## Scene 3: Live Demo — Dead Code Scan (1:00 - 1:30)

**[Screen: Slack DM with CodeSentinel]**

NARRATOR: "Let's see it in action. I open CodeSentinel from the Slack sidebar, and I'm presented with suggested analysis prompts. I'll start with 'Scan for dead code'."

**[Screen: User clicks the suggested prompt]**

NARRATOR: "CodeSentinel immediately begins analyzing. It uses its built-in analyzers to scan the codebase for functions, classes, and modules that are defined but never referenced."

**[Screen: Rich Block Kit response appears with severity-coded findings]**

NARRATOR: "The results appear right in the thread. Each finding is color-coded by severity — critical issues in red, warnings in yellow, informational items in blue. Each includes the exact file path, line number, a clear explanation of why the code is dead, and a specific suggestion for how to fix it."

---

## Scene 4: Live Demo — Full Health Scan (1:30 - 2:00)

**[Screen: User types 'Run full health scan' in the thread]**

NARRATOR: "Now let's run a full health scan. This runs all four analysis types — dead code, circular dependencies, coupling, and architectural drift — and produces an overall health score."

**[Screen: Health score appears: 67/100 with category breakdown]**

NARRATOR: "The health score gives an instant snapshot — 67 out of 100, which means 'Needs Attention.' Below, I can see the breakdown: 6 dead code findings, 4 circular dependency cycles, 2 modules with excessive coupling, and 5 architectural drift violations."

**[Screen: Scroll through detailed findings for each category]**

NARRATOR: "Each category expands with detailed findings. For circular dependencies, it shows the exact import cycle. For coupling, it lists every dependency of a high-fan-out module. For architectural drift, it shows which files are violating layer boundaries."

---

## Scene 5: MCP Integration (2:00 - 2:30)

**[Screen: Claude Desktop showing MCP server configuration]**

NARRATOR: "CodeSentinel doesn't just live in Slack. Through its MCP server, any MCP-compatible client — Claude Desktop, Cursor, or other AI coding tools — can invoke CodeSentinel's analysis tools. This means the same deep analysis is available whether you're in Slack, your IDE, or an AI assistant."

**[Screen: Cursor IDE using CodeSentinel MCP tool]**

NARRATOR: "In Cursor, I can ask the AI to run a dead code analysis as part of my coding workflow, and it uses CodeSentinel's MCP tools to get real, structured data."

---

## Scene 6: Impact & Closing (2:30 - 3:00)

**[Screen: Before/after comparison — messy codebase vs. clean one]**

NARRATOR: "CodeSentinel turns invisible code health problems into visible, actionable insights. It saves teams hours of manual analysis, catches issues before they become costly, and makes codebase health a continuous conversation — not a quarterly chore."

**[Screen: CodeSentinel logo, Slack logo, MCP logo]**

NARRATOR: "Built with Slack's Agent Builder, powered by the Model Context Protocol, and designed for the way teams actually work. CodeSentinel — because healthy codebases ship faster."

**[Screen: End card with project name, hackathon name, and team info]**

---

## Production Notes

- **Screen recording:** Use OBS to capture Slack sandbox interactions
- **Slack sandbox URL:** cubiczan.enterprise.slack.com
- **Show:** Real Block Kit rendering, suggested prompts, thread interaction
- **Voiceover:** Record with clear, energetic narration
- **Background music:** Light, upbeat tech music (low volume)
- **Resolution:** 1080p minimum