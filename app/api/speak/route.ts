import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { text, voice_id } = body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const targetVoiceId = voice_id || "EXAVITQu4vr4xnSDxMaL";

  try {
    const elevenRes = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${targetVoiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenRes.ok) {
      const detail = await elevenRes.text();
      console.error("ElevenLabs error:", elevenRes.status, detail);
      return NextResponse.json(
        { error: "ElevenLabs request failed", detail },
        { status: elevenRes.status }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("speak handler error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
