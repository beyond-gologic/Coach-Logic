"use client";

import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { type Personality } from "@/lib/voices";

interface Message {
  id: string;
  role: "assistant" | "user";
  text?: string;
  audioUrl?: string;
  seed: number;
}

interface MessageThreadProps {
  messages: Message[];
  tone: string;
  voiceGender: "female" | "male";
  onToneChange: (tone: Personality) => void;
  onToggleGender: () => void;
  status?: string;
}

export default function MessageThread({
  messages,
  tone,
  voiceGender,
  onToneChange,
  onToggleGender,
  status,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          tone={tone}
          voiceGender={voiceGender}
          onToneChange={onToneChange}
          onToggleGender={onToggleGender}
        />
      ))}

      {/* Typing indicator */}
      {status && (
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-primary text-xs font-bricolage font-bold">CL</span>
          </div>
          <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">{status}</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
