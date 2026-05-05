"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVoiceId, type Personality } from "@/lib/voices";

type VoiceState = "idle" | "listening" | "thinking" | "speaking";

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
  const [state, setState] = useState<VoiceState>("idle");
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

  const speak = useCallback(
    async (text: string): Promise<void> => {
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
    },
    [tone, voiceGender]
  );

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
        } catch {
          resolve("");
        }
      };
      recorder.start(200);
      // Auto-stop after 8 seconds of silence detection via timer
      setTimeout(() => {
        if (recorder.state !== "inactive") recorder.stop();
      }, 8000);
    });
  }, [stopMic]);

  const chat = useCallback(
    async (userText: string): Promise<string> => {
      setState("thinking");
      setTranscript(userText);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          language,
          tone,
          history: [...history].slice(-10),
        }),
      });
      const data = await res.json();
      return data.reply || "";
    },
    [language, tone, history]
  );

  // Main conversation loop
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
        setState("listening");
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

  const stateLabel = {
    idle: "Starting…",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
  }[state];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Close */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Orb */}
      <div className="relative flex items-center justify-center mb-8">
        <div
          className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
            state === "listening" && "bg-primary/20 ring-4 ring-primary/40 animate-pulse",
            state === "thinking" && "bg-yellow-500/20 ring-4 ring-yellow-500/40 animate-pulse",
            state === "speaking" && "bg-green-500/20 ring-4 ring-green-500/40 animate-pulse",
            state === "idle" && "bg-white/10"
          )}
        >
          <Mic
            className={cn(
              "w-10 h-10 transition-colors",
              state === "listening" ? "text-primary" : "text-white/60"
            )}
          />
        </div>
      </div>

      {/* State label */}
      <p className="text-white/80 text-sm font-medium mb-3">{stateLabel}</p>

      {/* Transcript / response */}
      {transcript && (
        <p className="text-white/60 text-sm max-w-xs text-center px-4 mb-2">
          {state === "thinking" || state === "speaking" ? `"${transcript}"` : ""}
        </p>
      )}
      {state === "speaking" && assistantText && (
        <p className="text-white text-sm max-w-xs text-center px-4">{assistantText}</p>
      )}

      <p className="text-white/30 text-xs mt-6">Tap × to exit voice mode</p>
    </div>
  );
}
