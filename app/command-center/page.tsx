"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Info,
  ClipboardList,
  CalendarOff,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommandCenterPage() {
  const [playsTab, setPlaysTab] = useState<"todo" | "inprogress" | "blocked">("todo");
  const [meetingsOnly, setMeetingsOnly] = useState(false);
  const [shareStats, setShareStats] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6 pb-24">

      {/* Coach Logic banner */}
      <div className="border border-border rounded-xl p-4 flex items-start gap-4 bg-white">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary font-bricolage font-bold text-sm">CL</span>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-tight">Coach Logic</p>
          <p className="text-xs text-muted-foreground mb-2">Your Business AI Coach</p>
          <p className="text-sm text-foreground leading-relaxed">
            Hey, Your Command Center is empty because we haven&apos;t finished your setup. Let&apos;s knock out those last onboarding steps so I can start tracking your wins.
          </p>
        </div>
        <button className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
          Let&apos;s Go
        </button>
      </div>

      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bricolage font-bold text-2xl text-foreground">Welcome back, Tyler!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here is what has happened recently</p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Touchdowns banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#5b3cf5] via-[#6d4ef7] to-[#7c5cfa] p-8 text-white">
        <div className="max-w-[55%]">
          <h2 className="font-bricolage font-bold text-3xl leading-tight">Touchdowns<br />Completed</h2>
          <p className="text-white/80 mt-2 text-base">Let&apos;s build your first Touchdown</p>
        </div>
        {/* Large zero */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Card shadow shape */}
            <div className="w-28 h-28 rounded-3xl bg-white/10 absolute -bottom-3 -right-3 rotate-6" />
            <div className="w-28 h-28 rounded-3xl bg-[#4a2ee0] flex items-center justify-center relative">
              <span className="font-bricolage font-bold text-6xl text-white leading-none">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Plays card */}
        <div className="border border-border rounded-xl bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">Plays</span>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              Add a Play <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            {(["todo", "inprogress", "blocked"] as const).map((tab) => {
              const labels = { todo: "To Do", inprogress: "In Progress", blocked: "Blocked" };
              const active = playsTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setPlaysTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
                  )}
                >
                  {labels[tab]} <span className={active ? "text-primary-foreground/80" : "text-muted-foreground"}>0</span>
                </button>
              );
            })}
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground/50">
            <ClipboardList className="w-14 h-14 stroke-[1]" />
            <p className="text-sm text-muted-foreground">No Plays yet</p>
          </div>
        </div>

        {/* Upcoming Appointments card */}
        <div className="border border-border rounded-xl bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">Upcoming Appointments</span>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              Create Event <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMeetingsOnly(!meetingsOnly)}
              className={cn(
                "relative w-9 h-5 rounded-full transition-colors flex-shrink-0",
                meetingsOnly ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                meetingsOnly ? "translate-x-4" : "translate-x-0.5"
              )} />
            </button>
            <span className="text-xs text-muted-foreground">GoTackle Meetings Only</span>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <CalendarOff className="w-14 h-14 stroke-[1] text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No Upcoming Appointments</p>
          </div>
        </div>
      </div>

      {/* Your Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bricolage font-bold text-lg text-foreground">Your Stats</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Share with consultant</span>
              <button className="text-muted-foreground/60 hover:text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShareStats(!shareStats)}
                className={cn(
                  "relative w-9 h-5 rounded-full transition-colors flex-shrink-0",
                  shareStats ? "bg-primary" : "bg-muted"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  shareStats ? "translate-x-4" : "translate-x-0.5"
                )} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 border border-border hover:border-primary/50 text-xs font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Pencil className="w-3.5 h-3.5" /> Edit Stats
            </button>
          </div>
        </div>

        {/* 2x2 stat grid */}
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              className="border border-dashed border-border rounded-xl h-32 flex items-center justify-center text-sm text-muted-foreground/50 hover:border-primary/40 hover:text-muted-foreground transition-colors bg-white"
            >
              Add Stat
            </button>
          ))}
        </div>
      </div>

      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-105">
          <Smile className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
