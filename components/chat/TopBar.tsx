"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  messageCount: number;
  voiceGender: "female" | "male";
  onToggleGender: () => void;
}

const MAX_MESSAGES = 20;

export default function TopBar({ messageCount, voiceGender, onToggleGender }: TopBarProps) {
  const progress = Math.min(100, (messageCount / MAX_MESSAGES) * 100);

  return (
    <header className="flex-shrink-0 flex items-center gap-4 px-5 py-3 border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <span className="text-primary text-sm font-bricolage font-bold">CL</span>
        </div>
        <div className="min-w-0">
          <p className="font-bricolage font-bold text-base text-foreground leading-tight tracking-tight">
            Coach Logic
          </p>
          <p className="text-xs text-muted-foreground leading-tight">AI Business Coach</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Progress */}
      <div className="hidden sm:flex flex-col items-end gap-1 min-w-[120px]">
        <span className="text-xs text-muted-foreground">
          Session progress
        </span>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Voice gender toggle */}
      <button
        onClick={onToggleGender}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
          "border-border hover:border-primary/50 hover:bg-muted"
        )}
        aria-label="Toggle voice gender"
      >
        <span className={cn(voiceGender === "female" ? "text-primary" : "text-muted-foreground")}>
          ♀
        </span>
        <span className="text-border">|</span>
        <span className={cn(voiceGender === "male" ? "text-primary" : "text-muted-foreground")}>
          ♂
        </span>
      </button>
    </header>
  );
}
