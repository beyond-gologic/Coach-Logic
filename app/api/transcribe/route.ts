import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
  }

  try {
    const rawBody = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "";

    const elevenRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": contentType,
      },
      body: rawBody,
    });

    if (!elevenRes.ok) {
      const detail = await elevenRes.text();
      console.error("ElevenLabs STT error:", elevenRes.status, detail);
      return NextResponse.json(
        { error: `ElevenLabs ${elevenRes.status}: ${detail}` },
        { status: elevenRes.status }
      );
    }

    const data = await elevenRes.json();
    console.log("ElevenLabs STT response:", JSON.stringify(data));
    return NextResponse.json({ transcript: data.text || "" });
  } catch (err) {
    console.error("transcribe handler error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
