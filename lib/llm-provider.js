/**
 * LLM provider abstraction — supports OpenAI, Anthropic, Deepseek, and Google.
 */

async function callLLM(prompt, systemPrompt) {
  const provider = process.env.LLM_PROVIDER || "deepseek";

  switch (provider) {
    case "deepseek":
      return callDeepseek(prompt, systemPrompt);
    case "openai":
      return callOpenAI(prompt, systemPrompt);
    case "anthropic":
      return callAnthropic(prompt, systemPrompt);
    default:
      return callDeepseek(prompt, systemPrompt);
  }
}

async function callDeepseek(prompt, systemPrompt) {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages,
    max_tokens: 500,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "";
}

async function callOpenAI(prompt, systemPrompt) {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 500,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "";
}

async function callAnthropic(prompt, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt || undefined,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

module.exports = { callLLM };