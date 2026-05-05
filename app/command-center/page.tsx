"use client";

import React, { useState } from "react";
import { MoreHorizontal, Plus, Pencil, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatShell from "@/components/chat/ChatShell";

export default function CommandCenterPage() {
  const [playsTab, setPlaysTab] = useState<"todo" | "inprogress" | "blocked">("todo");
  const [meetingsOnly, setMeetingsOnly] = useState(false);
  const [shareStats, setShareStats] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="bg-white min-h-full">
      <div className="max-w-5xl mx-auto px-8 py-6 space-y-5 pb-28">

        {/* Coach Logic banner */}
        <div className="border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <span className="text-primary font-bricolage font-bold text-base">CL</span>
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">Coach Logic</p>
            <p className="text-xs text-muted-foreground mb-1.5">Your Business AI Coach</p>
            <p className="text-sm text-foreground leading-relaxed">
              Hey, Your Command Center is empty because we haven&apos;t finished your setup. Let&apos;s knock out those last onboarding steps so I can start tracking your wins.
            </p>
          </div>
          <button className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap">
            Let&apos;s Go
          </button>
        </div>

        {/* Welcome header */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <h1 className="font-bricolage font-bold text-2xl text-foreground">Welcome back, Tyler!</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Here is what has happened recently</p>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-muted-foreground hover:bg-gray-50 transition-colors mt-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Touchdowns banner */}
        <div
          className="relative rounded-2xl overflow-hidden p-10"
          style={{ background: "linear-gradient(135deg, #5b3cf5 0%, #6d4ef7 50%, #7c5cfa 100%)" }}
        >
          <div>
            <h2 className="font-bricolage font-bold text-4xl text-white leading-tight">
              Touchdowns<br />Completed
            </h2>
            <p className="text-white/70 mt-2 text-base">Let&apos;s build your first Touchdown</p>
          </div>

          {/* Floating card with 0 */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            {/* Shadow card behind */}
            <div
              className="absolute w-32 h-32 rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.15)",
                transform: "rotate(8deg) translate(6px, 6px)",
              }}
            />
            {/* Main card */}
            <div
              className="relative w-32 h-32 rounded-3xl flex items-center justify-center"
              style={{ background: "rgba(60, 30, 180, 0.7)" }}
            >
              <span className="font-bricolage font-bold text-7xl text-white leading-none select-none">0</span>
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Plays card */}
          <div className="border border-[#E5E7EB] rounded-xl bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-base text-foreground">Plays</span>
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
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
                      "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted-foreground border-[#E5E7EB] hover:border-primary/30"
                    )}
                  >
                    {labels[tab]}
                    <span className={cn(
                      "text-xs",
                      active ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {" "}0
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="18" y="12" width="36" height="48" rx="4" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
                <line x1="24" y1="24" x2="46" y2="24" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <line x1="24" y1="32" x2="46" y2="32" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <line x1="24" y1="40" x2="38" y2="40" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="52" cy="52" r="10" stroke="#D1D5DB" strokeWidth="2" fill="white"/>
                <line x1="52" y1="48" x2="52" y2="56" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <line x1="48" y1="52" x2="56" y2="52" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-muted-foreground">No Plays yet</p>
            </div>
          </div>

          {/* Upcoming Appointments card */}
          <div className="border border-[#E5E7EB] rounded-xl bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-base text-foreground">Upcoming Appointments</span>
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
                Create Event <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMeetingsOnly(!meetingsOnly)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
                  meetingsOnly ? "bg-primary" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  meetingsOnly ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
              <span className="text-xs text-muted-foreground">GoTackle Meetings Only</span>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="20" width="44" height="38" rx="4" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
                <line x1="14" y1="30" x2="58" y2="30" stroke="#D1D5DB" strokeWidth="2"/>
                <line x1="26" y1="14" x2="26" y2="26" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <line x1="46" y1="14" x2="46" y2="26" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <rect x="22" y="36" width="10" height="8" rx="1" stroke="#D1D5DB" strokeWidth="1.5" fill="none"/>
                <rect x="40" y="36" width="10" height="8" rx="1" stroke="#D1D5DB" strokeWidth="1.5" fill="none"/>
                <circle cx="54" cy="54" r="10" stroke="#D1D5DB" strokeWidth="2" fill="white"/>
                <line x1="51" y1="54" x2="57" y2="54" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <line x1="54" y1="51" x2="54" y2="57" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-muted-foreground">No Upcoming Appointments</p>
            </div>
          </div>
        </div>

        {/* Your Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bricolage font-bold text-xl text-foreground">Your Stats</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Share with consultant</span>
                <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShareStats(!shareStats)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
                    shareStats ? "bg-primary" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                    shareStats ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </button>
              </div>
              <button className="flex items-center gap-1.5 border border-[#E5E7EB] hover:border-primary/40 text-xs font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Edit Stats
              </button>
            </div>
          </div>

          {/* 2x2 stat grid */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className="border border-dashed border-[#D1D5DB] rounded-xl h-36 flex items-center justify-center text-sm text-[#9CA3AF] hover:border-primary/40 hover:text-muted-foreground transition-colors bg-white"
              >
                Add Stat
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay + chat panel */}
      {chatOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setChatOpen(false)}
          />

          {/* Floating panel */}
          <div
            className="absolute flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-border"
            style={{ width: "90vw", height: "90vh", right: "5vw", bottom: "5vh" }}
          >
            <button
              onClick={() => setChatOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <ChatShell
              hideTopBar
              storageKey="coach-logic-widget"
              headerTitle="How can I help you today?"
              initialTexts={["Hey! I'm Coach Logic, your AI business coach. Is there anything I can help you with today?"]}
            />
          </div>
        </div>
      )}

      {/* Floating chat widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setChatOpen(true)}
          className="hover:scale-105 transition-transform drop-shadow-xl"
          aria-label="Open chat"
        >
          <svg width="64" height="64" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="8.5" width="92" height="92" rx="22.75" fill="url(#paint0_cc)"/>
            <rect x="0.5" y="8.5" width="92" height="92" rx="22.75" stroke="#9482FF"/>
            <g filter="url(#f0_cc)">
              <circle cx="21.2485" cy="46.686" r="9.62354" fill="#C9C2F1"/>
            </g>
            <g filter="url(#f1_cc)">
              <path d="M23.25 64.2861C23.25 83.4874 72.5373 95 72.5373 51.5938M72.5373 51.5938L62.6798 57.4518M72.5373 51.5938L81.375 57.4518" stroke="#ECECEC" strokeWidth="5.70284" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <filter id="f0_cc" x="7.625" y="37.0625" width="27.25" height="27.248" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_cc"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_cc" result="shape"/>
              </filter>
              <filter id="f1_cc" x="16.3984" y="48.7422" width="71.8281" height="43.5293" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect2_dropShadow_cc"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_cc" result="shape"/>
              </filter>
              <linearGradient id="paint0_cc" x1="28" y1="32" x2="93" y2="121" gradientUnits="userSpaceOnUse">
                <stop stopColor="#705AF8"/>
                <stop offset="0.948547" stopColor="#423592"/>
              </linearGradient>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
}
