"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Holds only the active-tab state. Both panels are rendered on the server and
 * passed in as children, so nothing about the lesson content ships as client
 * JavaScript.
 *
 * Notes is presentational (AGENTS section 7): there is no notes store yet.
 */
export function LessonTabs({
  content,
  notes,
}: {
  content: ReactNode;
  notes: ReactNode;
}) {
  const [active, setActive] = useState<"content" | "notes">("content");
  const id = useId();

  const tabs = [
    { key: "content" as const, label: "Lesson Content" },
    { key: "notes" as const, label: "Notes" },
  ];

  return (
    <div>
      <div role="tablist" className="flex gap-8 border-b border-neutral-200">
        {tabs.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${id}-${tab.key}-tab`}
              aria-selected={selected}
              aria-controls={`${id}-${tab.key}-panel`}
              onClick={() => setActive(tab.key)}
              className={cn(
                "-mb-px cursor-pointer border-b-2 pb-3 text-base font-medium transition-colors",
                selected
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-neutral-500 hover:text-neutral-900",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-content-panel`}
        aria-labelledby={`${id}-content-tab`}
        hidden={active !== "content"}
        className="pt-8"
      >
        {content}
      </div>

      <div
        role="tabpanel"
        id={`${id}-notes-panel`}
        aria-labelledby={`${id}-notes-tab`}
        hidden={active !== "notes"}
        className="pt-8"
      >
        {notes}
      </div>
    </div>
  );
}
