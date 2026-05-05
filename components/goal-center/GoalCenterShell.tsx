"use client";

import React, { useState } from "react";
import { Star, FileText, MoreHorizontal } from "lucide-react";
import ChatShell from "@/components/chat/ChatShell";
import GoalHistory from "./GoalHistory";

export default function GoalCenterShell() {
  const [showHistory, setShowHistory] = useState(true);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Chat pane */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Chat sub-header: Coach Logic identity bar */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-b border-border bg-white">
          {/* Avatar with online dot */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-sm font-bricolage font-bold">CL</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <span className="font-semibold text-sm text-foreground">Coach Logic</span>

          <div className="flex-1" />

          <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <Star className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Chat shell fills remaining space */}
        <div className="flex-1 overflow-hidden">
          <ChatShell
            hideTopBar
            storageKey="coach-logic-goal-center"
            headerTitle="Let's Get Started Tackling Your Goals!"
            initialTexts={[
              `Please provide just **one goal** and try to make sure that it is S.M.A.R.T. (Specific, Measurable, Achievable, Relevant, and Time-bound).\n\n*Here are a few examples of S.M.A.R.T. goals:*\n- Gain new customers generating an average of $5,000/month in recurring revenue over next 3 months\n- Get approved by the National Supplier Development Council (NSBDC) as a certified Minority Business Enterprise (MBE) within the next 6 months\n\n**You will have a chance to create more goals later, if you want to.**`,
              "What specific goal did you have in mind?",
            ]}
          />
        </div>
      </div>

      {/* Goal history sidebar */}
      {showHistory && (
        <GoalHistory onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
