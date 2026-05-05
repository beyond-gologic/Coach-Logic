"use client";

import React, { useState } from "react";
import { Copy, ThumbsUp, ThumbsDown, Check, Volume2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VoicePlayer from "./VoicePlayer";
import { cn } from "@/lib/utils";
import { PERSONALITIES, getVoiceId, type Personality } from "@/lib/voices";

interface Message {
  id: string;
  role: "assistant" | "user";
  text?: string;
  audioUrl?: string;
  seed: number;
  voiceId?: string;
}

interface MessageBubbleProps {
  message: Message;
  tone: string;
  voiceGender: "female" | "male";
  onToneChange: (tone: Personality) => void;
  onToggleGender: () => void;
  voiceModeActive?: boolean;
}

export default function MessageBubble({
  message,
  tone,
  voiceGender,
  onToneChange,
  onToggleGender,
  voiceModeActive = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<"like" | "dislike" | null>(null);

  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    if (!message.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const getTtsSrc = () => async () => {
    if (!message.text) throw new Error("No text");
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text, voice_id: getVoiceId(tone as Personality, voiceGender) }),
    });
    if (!res.ok) throw new Error("TTS failed");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  if (!isAssistant) {
    // User message
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          {message.text && (
            <div className="bg-primary rounded-2xl rounded-br-sm px-4 py-3 text-sm text-primary-foreground leading-relaxed">
              {message.text}
            </div>
          )}
          {message.audioUrl && (
            <div className="bg-primary rounded-2xl rounded-br-sm px-4 py-3">
              <VoicePlayer src={message.audioUrl} seed={message.seed} variant="user" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-3 items-start">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mt-1">
        <span className="text-primary text-xs font-bricolage font-bold">CL</span>
      </div>

      <div className="flex-1 min-w-0 max-w-[80%]">
        {/* Bubble */}
        <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed">{message.text}</p>

          {/* Voice player */}
          {!voiceModeActive && <VoicePlayer getSrc={getTtsSrc()} seed={message.seed} variant="assistant" />}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-1.5 mt-2 ml-1">
          {/* Speaker */}
          <button className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors" aria-label="Play">
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Personality pill / dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-transparent text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {tone}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Coaching tone</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {PERSONALITIES.map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => onToneChange(p)}
                  className={cn(p === tone && "text-primary font-medium")}
                >
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Gender pill */}
          <button
            onClick={onToggleGender}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-transparent text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
          >
            <span>{voiceGender === "female" ? "♀" : "♂"}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Like */}
          <button
            onClick={() => setLiked(liked === "like" ? null : "like")}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-colors",
              liked === "like"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label="Like"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          {/* Dislike */}
          <button
            onClick={() => setLiked(liked === "dislike" ? null : "dislike")}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-colors",
              liked === "dislike"
                ? "text-red-400 bg-red-400/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label="Dislike"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
