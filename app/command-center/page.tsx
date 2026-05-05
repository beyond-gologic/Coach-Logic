"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Empty state illustration for Plays
function PlaysEmptyIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground/30">
      {/* Clipboard body */}
      <rect x="24" y="20" width="48" height="60" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Clipboard clip */}
      <path d="M36 20V16a4 4 0 014-4h16a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Lines on clipboard */}
      <line x1="32" y1="36" x2="56" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="46" x2="64" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="56" x2="52" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Magnifying glass */}
      <circle cx="62" cy="64" r="10" stroke="currentColor" strokeWidth="2" fill="white"/>
      <line x1="69" y1="71" x2="76" y2="78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Question mark in magnifying glass */}
      <path d="M59 61c0-2 1.5-3 3-3s3 1 3 3c0 1.5-1.5 2-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="62" cy="69" r="1" fill="currentColor"/>
    </svg>
  );
}

// Empty state illustration for Calendar
function CalendarEmptyIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground/30">
      {/* Calendar body */}
      <rect x="20" y="24" width="56" height="52" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Calendar top bar */}
      <path d="M20 36h56" stroke="currentColor" strokeWidth="2"/>
      {/* Calendar hooks */}
      <line x1="32" y1="16" x2="32" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="64" y1="16" x2="64" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Calendar grid dots */}
      <circle cx="32" cy="48" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="48" cy="48" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="64" cy="48" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="62" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="48" cy="62" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="64" cy="62" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      {/* Clock overlay */}
      <circle cx="68" cy="68" r="12" stroke="currentColor" strokeWidth="2" fill="white"/>
      <line x1="68" y1="62" x2="68" y2="68" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="68" y1="68" x2="74" y2="68" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Coach Logic robot avatar
function CoachLogicAvatar() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 border border-violet-200 flex items-center justify-center overflow-hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-violet-600">
          {/* Robot head */}
          <rect x="5" y="8" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          {/* Antenna */}
          <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
          {/* Eyes */}
          <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
          {/* Mouth */}
          <path d="M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function CommandCenterPage() {
  const [playsTab, setPlaysTab] = useState<"todo" | "inprogress" | "blocked">("todo");
  const [meetingsOnly, setMeetingsOnly] = useState(false);
  const [shareStats, setShareStats] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6 pb-24">

      {/* Coach Logic banner */}
      <div className="border border-border rounded-xl p-4 flex items-start gap-4 bg-white shadow-sm">
        <CoachLogicAvatar />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-tight">Coach Logic</p>
          <p className="text-xs text-muted-foreground mb-1">Your Business AI Coach</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
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
          <h1 className="font-bricolage font-bold text-xl text-foreground">Welcome back, Tyler!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here is what has happened recently</p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Touchdowns banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#7c7cf7] to-[#a5a5fc] p-8 text-white min-h-[160px]">
        {/* Decorative wave pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute right-0 top-0 h-full w-2/3" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
            <path d="M200 0C100 50 150 150 0 200H400V0H200Z" fill="url(#wave-gradient)" fillOpacity="0.4"/>
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c4b5fd"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-[55%]">
          <h2 className="font-bricolage font-bold text-3xl leading-tight">Touchdowns<br />Completed</h2>
          <p className="text-white/80 mt-2 text-base">Let&apos;s build your first Touchdown</p>
        </div>
        
        {/* Large zero with 3D effect */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* Shadow/depth layer */}
            <div className="absolute -bottom-2 -right-2 w-24 h-28 rounded-2xl bg-indigo-800/40 rotate-3" />
            {/* Main card */}
            <div className="w-24 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg relative">
              <span className="font-bricolage font-bold text-6xl text-white/90 leading-none drop-shadow-md">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Plays card */}
        <div className="border border-border rounded-xl bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-base text-foreground">Plays</span>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
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
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
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
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <PlaysEmptyIllustration />
            <p className="text-sm text-muted-foreground">No Plays yet</p>
          </div>
        </div>

        {/* Upcoming Appointments card */}
        <div className="border border-border rounded-xl bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-base text-foreground">Upcoming Appointments</span>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
              Create Event <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMeetingsOnly(!meetingsOnly)}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
                meetingsOnly ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                meetingsOnly ? "translate-x-5" : "translate-x-0.5"
              )} />
            </button>
            <span className="text-sm text-muted-foreground">GoTackle Meetings Only</span>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <CalendarEmptyIllustration />
            <p className="text-sm text-muted-foreground">No Upcoming Appointments</p>
          </div>
        </div>
      </div>

      {/* Your Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bricolage font-bold text-lg text-foreground">Your Stats</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Share with consultant</span>
              <button className="text-muted-foreground/60 hover:text-muted-foreground">
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShareStats(!shareStats)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
                  shareStats ? "bg-primary" : "bg-muted"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  shareStats ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 border border-border hover:border-primary/50 text-sm font-medium px-3.5 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors bg-white">
              <Pencil className="w-4 h-4" /> Edit Stats
            </button>
          </div>
        </div>

        {/* 2x2 stat grid */}
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              className="border border-dashed border-border rounded-xl h-28 flex items-center justify-center text-base text-muted-foreground/50 hover:border-primary/40 hover:text-muted-foreground transition-colors bg-white"
            >
              Add Stat
            </button>
          ))}
        </div>
      </div>

      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-[101px] h-[101px] flex items-center justify-center hover:scale-105 transition-transform">
          <svg width="101" height="101" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="8.5" width="92" height="92" rx="22.75" fill="url(#paint0_linear_25498_167101)"/>
            <rect x="0.5" y="8.5" width="92" height="92" rx="22.75" stroke="#9482FF"/>
            <g filter="url(#filter0_d_25498_167101)">
              <circle cx="21.2485" cy="46.686" r="9.62354" fill="#C9C2F1"/>
            </g>
            <g filter="url(#filter1_d_25498_167101)">
              <path d="M23.25 64.2861C23.25 83.4874 72.5373 95 72.5373 51.5938M72.5373 51.5938L62.6798 57.4518M72.5373 51.5938L81.375 57.4518" stroke="#ECECEC" strokeWidth="5.70284" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <filter id="filter0_d_25498_167101" x="7.625" y="37.0625" width="27.25" height="27.248" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25498_167101"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25498_167101" result="shape"/>
              </filter>
              <filter id="filter1_d_25498_167101" x="16.3984" y="48.7422" width="71.8281" height="43.5293" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25498_167101"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25498_167101" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_25498_167101" x1="28" y1="32" x2="93" y2="121" gradientUnits="userSpaceOnUse">
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
