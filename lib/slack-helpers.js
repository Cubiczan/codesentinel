/**
 * Slack API helpers.
 */

async function setSuggestedPrompts(client, { channel_id, thread_ts, title, prompts }) {
  try {
    await client.assistant.threads.setSuggestedPrompts({
      channel_id,
      thread_ts,
      title: title || "What would you like to analyze?",
      prompts: prompts.map((p) => ({
        title: p.title,
        user_message: p.prompt,
      })),
    });
  } catch (error) {
    console.error("Error setting suggested prompts:", error.message);
    // Fallback: send the prompts as a regular message
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${title || "CodeSentinel — Quick Actions"}*`,
        },
      },
      {
        type: "actions",
        block_id: "quick_actions",
        elements: prompts.map((p, i) => ({
          type: "button",
          text: { type: "plain_text", text: p.title },
          action_id: `analysis_${i}`,
          value: p.prompt,
        })),
      },
    ];

    await client.chat.postMessage({
      channel: channel_id,
      thread_ts,
      text: title || "Quick actions",
      blocks,
    });
  }
}

module.exports = { setSuggestedPrompts };