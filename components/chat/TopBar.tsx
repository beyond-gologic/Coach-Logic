"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

interface TopBarProps {
  messageCount: number;
  onNewChat: () => void;
}

const MAX_MESSAGES = 20;

export default function TopBar({ messageCount, onNewChat }: TopBarProps) {
  const progress = Math.min(100, (messageCount / MAX_MESSAGES) * 100);

  return (
    <header className="flex-shrink-0 flex items-center gap-4 px-5 py-3 border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <span className="text-primary text-sm font-bold">CL</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base text-foreground leading-tight tracking-tight">
            Coach Logic
          </p>
          <p className="text-xs text-muted-foreground leading-tight">AI Business Coach</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Progress */}
      <div className="hidden sm:flex flex-col items-end gap-1 min-w-[120px]">
        <span className="text-xs text-muted-foreground">Session progress</span>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* New chat */}
      <button
        onClick={onNewChat}
        className="text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 px-3 py-1.5 rounded-full transition-colors"
      >
        New chat
      </button>

      {/* Goal Center shortcut */}
      <Link
        href="/goal-center"
        className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/40 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-colors"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        Goal Center
      </Link>
    </header>
  );
}
