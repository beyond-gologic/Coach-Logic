"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVoiceId, type Personality } from "@/lib/voices";

type VoiceState = "listening" | "thinking" | "speaking";

interface VoiceModeProps {
  onClose: () => void;
  tone: Personality;
  voiceGender: "female" | "male";
  language: string;
  history: { role: string; content: string }[];
  onMessageExchange: (userText: string, assistantText: string) => void;
}

export default function VoiceMode({
  onClose,
  tone,
  voiceGender,
  language,
  history,
  onMessageExchange,
}: VoiceModeProps) {
  const [state, setState] = useState<VoiceState>("listening");
  const [transcript, setTranscript] = useState("");
  const [assistantText, setAssistantText] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef(true);

  const stopMic = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const handleClose = useCallback(() => {
    activeRef.current = false;
    stopMic();
    audioRef.current?.pause();
    onClose();
  }, [stopMic, onClose]);

  const speak = useCallback(async (text: string): Promise<void> => {
    setState("speaking");
    setAssistantText(text);
    const voiceId = getVoiceId(tone, voiceGender);
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_id: voiceId }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    await new Promise<void>((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
      audio.play().catch(() => resolve());
    });
  }, [tone, voiceGender]);

  const listen = useCallback(async (): Promise<string> => {
    setState("listening");
    setTranscript("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStreamRef.current = stream;
    const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    const chunks: Blob[] = [];

    return new Promise((resolve) => {
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = async () => {
        stopMic();
        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size < 1000) { resolve(""); return; }
        const fd = new FormData();
        fd.append("file", blob, mimeType === "audio/webm" ? "audio.webm" : "audio.mp4");
        fd.append("model_id", "scribe_v1");
        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: fd });
          const data = await res.json();
          resolve(data.transcript || "");
        } catch { resolve(""); }
      };
      recorder.start(200);
      setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, 8000);
    });
  }, [stopMic]);

  const chat = useCallback(async (userText: string): Promise<string> => {
    setState("thinking");
    setTranscript(userText);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, language, tone, history: [...history].slice(-10) }),
    });
    const data = await res.json();
    return data.reply || "";
  }, [language, tone, history]);

  useEffect(() => {
    activeRef.current = true;
    const loop = async () => {
      while (activeRef.current) {
        const userText = await listen();
        if (!activeRef.current) break;
        if (!userText.trim()) continue;
        const reply = await chat(userText);
        if (!activeRef.current) break;
        await speak(reply);
        if (!activeRef.current) break;
        onMessageExchange(userText, reply);
      }
    };
    loop();
    return () => {
      activeRef.current = false;
      stopMic();
      audioRef.current?.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateLabel = { listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" }[state];

  return (
    <div className="flex flex-col h-full bg-background relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Voice Chat</span>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Bubble area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        {/* Animated orb */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow rings */}
          <div className={cn(
            "absolute rounded-full transition-all duration-700",
            state === "listening" && "w-52 h-52 bg-primary/10 animate-ping",
            state === "thinking"  && "w-52 h-52 bg-yellow-500/10 animate-ping",
            state === "speaking"  && "w-52 h-52 bg-violet-500/10 animate-ping",
          )} />
          <div className={cn(
            "absolute rounded-full transition-all duration-500",
            state === "listening" && "w-44 h-44 bg-primary/15",
            state === "thinking"  && "w-44 h-44 bg-yellow-500/15",
            state === "speaking"  && "w-44 h-44 bg-violet-500/15",
          )} />

          {/* Core bubble */}
          <div className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
            state === "listening" && "bg-gradient-to-br from-primary/80 to-primary shadow-primary/40",
            state === "thinking"  && "bg-gradient-to-br from-yellow-400/80 to-yellow-600 shadow-yellow-500/40",
            state === "speaking"  && "bg-gradient-to-br from-violet-400/80 to-violet-600 shadow-violet-500/40",
          )}>
            {/* Sound wave bars */}
            <div className="flex items-center gap-[3px]">
              {[0,1,2,3,4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-[3px] rounded-full bg-white/90 transition-all",
                    state === "listening" && "animate-bounce",
                    state === "thinking"  && "opacity-40",
                    state === "speaking"  && "animate-bounce",
                  )}
                  style={{
                    height: state === "thinking" ? "8px" : `${10 + (i % 3) * 8}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: state === "speaking" ? "0.5s" : "0.8s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* State label */}
        <p className={cn(
          "text-sm font-medium transition-colors",
          state === "listening" && "text-primary",
          state === "thinking"  && "text-yellow-400",
          state === "speaking"  && "text-violet-400",
        )}>
          {stateLabel}
        </p>

        {/* Transcript / response text */}
        <div className="min-h-[60px] text-center px-2">
          {state === "thinking" && transcript && (
            <p className="text-muted-foreground text-sm italic">"{transcript}"</p>
          )}
          {state === "speaking" && assistantText && (
            <p className="text-foreground text-sm leading-relaxed">{assistantText}</p>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-muted-foreground/40 text-xs text-center pb-6">Speak naturally · tap × to exit</p>
    </div>
  );
}
