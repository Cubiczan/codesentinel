const { setSuggestedPrompts } = require("./lib/slack-helpers");

async function handleAssistantThreadStarted(app) {
  app.event("assistant_thread_started", async ({ event, client, logger }) => {
    logger.info(`Assistant thread started in channel ${event.channel_id} by ${event.user}`);

    try {
      await setSuggestedPrompts(client, {
        channel_id: event.channel_id,
        thread_ts: event.assistant_thread.thread_ts,
        title: "CodeSentinel — Codebase Health Agent",
        prompts: [
          {
            title: "🔍 Scan for dead code",
            prompt: "Analyze the current codebase for dead code — functions, classes, and modules that are defined but never referenced anywhere. Include file paths and line numbers.",
          },
          {
            title: "🔁 Find circular dependencies",
            prompt: "Detect circular dependencies between modules. Show the dependency cycles and identify which files are involved in each cycle.",
          },
          {
            title: "📊 Check coupling metrics",
            prompt: "Run a coupling analysis on the codebase. Show which modules have the highest fan-out and identify tightly coupled clusters that could cause maintenance issues.",
          },
          {
            title: "🏗️ Architectural drift report",
            prompt: "Check for architectural drift. Are there violations of the intended layer boundaries? For example, UI components importing directly from the data layer, or utilities importing from business logic.",
          },
          {
            title: "🩺 Full health scan",
            prompt: "Run a complete codebase health scan covering dead code, circular dependencies, coupling metrics, and architectural drift. Provide an overall health score and prioritized action items.",
          },
        ],
      });
    } catch (error) {
      logger.error("Error setting suggested prompts:", error);
    }
  });
}

module.exports = { handleAssistantThreadStarted };