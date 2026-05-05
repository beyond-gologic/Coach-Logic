"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  MessageSquare,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_TABS = [
  { label: "Command Center", href: "/command-center" },
  { label: "Insights", href: "/insights" },
  { label: "Goal Center", href: "/goal-center" },
  { label: "Tech Tools", href: "/tech-tools" },
  { label: "Calendar", href: "/calendar" },
  { label: "Meeting Records", href: "/meeting-records" },
];

export default function GlobalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-shrink-0 bg-white border-b border-border">
      {/* Top row */}
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link href="/" title="Back to Coach Logic" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bricolage font-bold text-lg text-foreground tracking-tight">
            GoTackle
          </span>
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none">
              3
            </span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab row */}
      <div className="flex items-end px-6 gap-0">
        {NAV_TABS.map((tab) => {
          const active = pathname === tab.href || (tab.href === "/goal-center" && pathname === "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
