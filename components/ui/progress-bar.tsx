import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Completion from 0 to 100. */
  value: number;
  /** Renders the "35% complete" label to the right of the track. */
  showLabel?: boolean;
};

export function ProgressBar({
  value,
  showLabel = true,
  className,
  ...props
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% complete`}
        className="h-2 flex-1 overflow-hidden rounded-full bg-primary-100"
      >
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? (
        <span className="shrink-0 text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">{pct}%</span>{" "}
          complete
        </span>
      ) : null}
    </div>
  );
}
