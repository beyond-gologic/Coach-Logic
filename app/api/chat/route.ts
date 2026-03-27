import { NextRequest, NextResponse } from "next/server";

const toneDescriptions: Record<string, string> = {
  Professional: "articulate, composed, and business-focused",
  Casual: "relaxed, conversational, and approachable",
  Friendly: "warm, encouraging, and personable",
  Formal: "precise, structured, and respectful",
  Direct: "concise, confident, and to the point",
  Encouraging: "upbeat, motivating, and positive",
  Empathetic: "understanding, compassionate, and supportive",
  Creative: "imaginative, engaging, and out-of-the-box",
  Humorous: "light, witty, and fun without losing helpfulness",
  Concise: "brief and clear — every word earns its place",
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { message, language = "English", tone = "Professional", history = [] } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const systemPrompt = `You are Coach Logic, an AI business coach conducting a structured onboarding conversation.
Your goal is to learn about the user's business and goals through natural, flowing conversation — one or two questions at a time — then provide personalized, actionable coaching insights.

Guidelines:
- Always reply in ${language}.
- Your tone is ${tone}: ${toneDescriptions[tone] || "clear and helpful"}.
- Read the full conversation history carefully before responding — your reply must directly follow from what was just said.
- Ask follow-up questions that build on the user's previous answers. Never ask something they already answered.
- If the user shares information (business name, goals, challenges), acknowledge it specifically before moving on.
- Keep replies to 2-4 sentences. Be conversational, not clinical.
- Do not introduce yourself again after the first message.
- Do not say you are an AI or a language model.
- If the user goes off-topic, gently guide them back to the coaching conversation.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history as { role: string; content: string }[]).slice(-10),
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
        max_tokens: 450,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      console.error("Groq error:", groqRes.status, detail);
      return NextResponse.json({ error: `Groq ${groqRes.status}: ${detail}` }, { status: groqRes.status });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("chat handler error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
