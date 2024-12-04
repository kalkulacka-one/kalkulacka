"use client";
import { QuestionWrapper } from "@repo/design-system/ui";
import { BottomBar } from "@repo/design-system/ui";

export default function Page() {
  return (
    <div className="grid h-96 content-between">
      <QuestionWrapper />
      <BottomBar />
    </div>
  );
}

// TODO
// 1. Buttons on mobile wihout texts WIDTH!
// 2. Statuses proper styling (bg) check with live
// 3. Bottom bar positioning
