"use client";

import React from "react";
import { X } from "lucide-react";

interface Goal {
  id: string;
  initials: string;
  title: string;
  dueDate: string;
  category: string;
  status: string;
}

const SAMPLE_GOALS: Goal[] = [
  {
    id: "1",
    initials: "YY",
    title: "Pre-populated  BO S.M.A.R.T Goal 1",
    dueDate: "MM/DD/YYYY",
    category: "Sales",
    status: "Not Started",
  },
];

interface GoalHistoryProps {
  onClose: () => void;
  lastSaved?: string;
}

export default function GoalHistory({ onClose, lastSaved = "Today, 9:04 AM" }: GoalHistoryProps) {
  return (
    <div className="flex flex-col h-full bg-white border-l border-border w-[320px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-bricolage font-bold text-base text-foreground">Goal History</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-header */}
      <div className="px-5 py-4 border-b border-border text-center">
        <p className="text-sm font-semibold text-foreground">View previously created goals</p>
        <p className="text-xs text-muted-foreground mt-0.5">Last Saved : {lastSaved}</p>
      </div>

      {/* Goals list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {SAMPLE_GOALS.map((goal) => (
          <div key={goal.id} className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-muted-foreground">{goal.initials}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">{goal.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Due Date: {goal.dueDate}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <span className="px-3 py-0.5 rounded border border-border text-xs text-muted-foreground text-center">
                {goal.category}
              </span>
              <span className="px-3 py-0.5 rounded border border-border text-xs text-muted-foreground text-center">
                {goal.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
