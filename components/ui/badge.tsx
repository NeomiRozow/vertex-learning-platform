import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "video" | "lesson" | "popular";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  video: "bg-primary-100 text-primary-500",
  lesson: "bg-lesson-100 text-lesson-700",
  popular: "bg-primary-100 text-primary-500",
};

export function Badge({
  tone = "video",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs px-2 py-1 text-xs font-bold tracking-wider uppercase",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
