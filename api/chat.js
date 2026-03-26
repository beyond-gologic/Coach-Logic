// Vercel serverless function — generates AI replies via Groq
// Accepts POST { message, language, tone, history }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  const { message, language = "English", tone = "Professional", history = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  const systemPrompt = `You are Coach Logic, an AI business coaching assistant.
Your role is to help users with personalized support and actionable insights to reach their goals.
Always reply in ${language}.
Your tone is ${tone}: ${toneDescriptions[tone] || "clear and helpful"}.
Keep replies concise — 1-3 sentences unless the user asks for more detail.
Do not mention that you are an AI or a language model.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10), // cap context to last 10 exchanges
    { role: "user", content: message.trim() },
  ];

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      console.error("Groq error:", groqRes.status, detail);
      return res.status(groqRes.status).json({ error: `Groq ${groqRes.status}: ${detail}` });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("chat handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}

const toneDescriptions = {
  Professional: "articulate, composed, and business-focused",
  Casual:       "relaxed, conversational, and approachable",
  Friendly:     "warm, encouraging, and personable",
  Formal:       "precise, structured, and respectful",
  Direct:       "concise, confident, and to the point",
  Encouraging:  "upbeat, motivating, and positive",
  Empathetic:   "understanding, compassionate, and supportive",
  Creative:     "imaginative, engaging, and out-of-the-box",
  Humorous:     "light, witty, and fun without losing helpfulness",
  Concise:      "brief and clear — every word earns its place",
};
