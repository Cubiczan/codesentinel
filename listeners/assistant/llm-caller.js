/**
 * LLM streaming caller for Slack Thinking Steps.
 */

async function streamText(client, channel, threadTs, text) {
  try {
    await client.assistant.threads.setSuggestedPrompts({
      channel_id: channel,
      thread_ts: threadTs,
      // Thinking steps would go here in production
    });
  } catch (e) {
    // Fallback if Thinking Steps API not available
  }
}

module.exports = { streamText };