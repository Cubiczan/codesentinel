require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Import listeners
const { handleAssistantThreadStarted } = require("./listeners/assistant/assistant_thread_started");
const { handleAssistantMessage } = require("./listeners/assistant/message");
const { handleAppMention } = require("./listeners/events/app_mention");

// Register listeners
handleAssistantThreadStarted(app);
handleAssistantMessage(app);
handleAppMention(app);

// Health check
app.event("app_home_opened", async ({ event, client, logger }) => {
  logger.info(`App home opened by ${event.user}`);
});

(async () => {
  await app.start();
  console.log("⚡ CodeSentinel is running!");
})();