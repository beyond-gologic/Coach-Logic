"use client";

import React, { useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import VoicePlayer from "./VoicePlayer";
import { cn } from "@/lib/utils";

interface AudioPreviewProps {
  objectUrl: string;
  seed: number;
  onDiscard: () => void;
  onSend: () => void;
  isSending: boolean;
}

export default function AudioPreview({
  objectUrl,
  seed,
  onDiscard,
  onSend,
  isSending,
}: AudioPreviewProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1e] border border-border rounded-xl">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1">Voice message preview</p>
        <VoicePlayer src={objectUrl} seed={seed} variant="user" />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onDiscard}
          disabled={isSending}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label="Discard recording"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={onSend}
          disabled={isSending}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          aria-label="Send voice message"
        >
          {isSending ? (
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
