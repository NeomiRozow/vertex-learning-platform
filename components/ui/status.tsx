import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import {
  CheckCircleIcon,
  LockIcon,
  PlayCircleFilledIcon,
  SpinnerRingIcon,
} from "./icons";

export type Status = "in-progress" | "completed" | "now-playing" | "locked";

const config = {
  "in-progress": {
    label: "In Progress",
    tone: "text-primary-500",
    Icon: SpinnerRingIcon,
  },
  completed: {
    label: "Completed",
    tone: "text-success-500",
    Icon: CheckCircleIcon,
  },
  "now-playing": {
    label: "Now Playing",
    tone: "text-primary-500",
    Icon: PlayCircleFilledIcon,
  },
  locked: { label: "Locked", tone: "text-neutral-900", Icon: LockIcon },
} as const satisfies Record<
  Status,
  { label: string; tone: string; Icon: typeof LockIcon }
>;

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  status: Status;
  /** Overrides the default label for this status. */
  label?: string;
};

export function StatusIndicator({
  status,
  label,
  className,
  ...props
}: StatusIndicatorProps) {
  const { label: defaultLabel, tone, Icon } = config[status];
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-sm", className)}
      {...props}
    >
      <Icon size={20} className={cn("shrink-0", tone)} />
      <span className="text-neutral-900">{label ?? defaultLabel}</span>
    </span>
  );
}
