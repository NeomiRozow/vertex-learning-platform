import type { ReactElement, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  /** Rendered size in px on a 24x24 grid. */
  size?: number;
};

function Outline({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

function Solid({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---------- Outline style ---------- */

export function BellIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M18 9a6 6 0 1 0-12 0c0 4-1.5 5.5-2 6h16c-.5-.5-2-2-2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Outline>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Outline>
  );
}

export function PlayCircleIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 8.5 16 12l-5.5 3.5v-7Z" />
    </Outline>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
    </Outline>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
    </Outline>
  );
}

export function BarChartIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M5 20v-5M12 20V9M19 20V4" />
    </Outline>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Outline>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </Outline>
  );
}

/** Two-person glyph, used for student counts. */
export function UsersIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 19a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 5.3a3.5 3.5 0 0 1 0 6.4" />
      <path d="M18 14.2A5.5 5.5 0 0 1 21 19" />
    </Outline>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m9 5 7 7-7 7" />
    </Outline>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m15 5-7 7 7 7" />
    </Outline>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m5 9 7 7 7-7" />
    </Outline>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M14 4h6v6" />
      <path d="m20 4-8 8" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Outline>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </Outline>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
    </Outline>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M4 7a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z" />
    </Outline>
  );
}

export function SpinnerRingIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </Outline>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </Outline>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m12 4 2.4 5.1 5.6.8-4 4 .9 5.6-4.9-2.7-4.9 2.7.9-5.6-4-4 5.6-.8L12 4Z" />
    </Outline>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Outline>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Outline>
  );
}

export function SignalIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M5 20v-3M10 20v-7M15 20v-11M20 20V5" />
    </Outline>
  );
}

/* ---------- Filled style ---------- */

export function BellFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M12 2a6 6 0 0 0-6 6c0 4-1.5 5.5-2.2 6.4A1 1 0 0 0 4.6 16h14.8a1 1 0 0 0 .8-1.6C19.5 13.5 18 12 18 8a6 6 0 0 0-6-6Z" />
      <path d="M9.6 18a2.5 2.5 0 0 0 4.8 0H9.6Z" />
    </Solid>
  );
}

export function SearchFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path
        fillRule="evenodd"
        d="M11 4a7 7 0 1 0 4.2 12.6l3.1 3.1a1 1 0 0 0 1.4-1.4l-3.1-3.1A7 7 0 0 0 11 4Zm-5 7a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
        clipRule="evenodd"
      />
    </Solid>
  );
}

export function PlayCircleFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path
        fillRule="evenodd"
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1.5 5.2a.6.6 0 0 1 .9-.5l4.4 2.8a.6.6 0 0 1 0 1l-4.4 2.8a.6.6 0 0 1-.9-.5V8.2Z"
        clipRule="evenodd"
      />
    </Solid>
  );
}

export function FileFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8h-4a1 1 0 0 1-1-1V3H7Zm8 .4V6h2.6L15 3.4ZM9 12h6v1.6H9V12Zm0 3.4h4V17H9v-1.6Z" />
    </Solid>
  );
}

export function BookmarkFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M6 5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15.2a.8.8 0 0 1-1.25.66L12 17.1l-4.75 3.76A.8.8 0 0 1 6 20.2V5Z" />
    </Solid>
  );
}

export function BarChartFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <rect x="4" y="14" width="3.5" height="6" rx="1" />
      <rect x="10.25" y="9" width="3.5" height="11" rx="1" />
      <rect x="16.5" y="4" width="3.5" height="16" rx="1" />
    </Solid>
  );
}

export function ClockFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path
        fillRule="evenodd"
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 4a1 1 0 1 0-2 0v5c0 .35.18.68.47.86l3 1.85a1 1 0 1 0 1.06-1.7L13 11.44V7Z"
        clipRule="evenodd"
      />
    </Solid>
  );
}

export function UserFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 13.5c-4.14 0-7.5 2.9-7.5 6a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5c0-3.1-3.36-6-7.5-6Z" />
    </Solid>
  );
}

export function ChevronRightFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path d="M9.3 4.3a1 1 0 0 0 0 1.4l6.3 6.3-6.3 6.3a1 1 0 1 0 1.4 1.4l7-7a1 1 0 0 0 0-1.4l-7-7a1 1 0 0 0-1.4 0Z" />
    </Solid>
  );
}

export function LockFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path
        fillRule="evenodd"
        d="M7.5 9.5V7.5a4.5 4.5 0 1 1 9 0v2H17a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7.5a2 2 0 0 1 2-2h.5Zm2 0h5V7.5a2.5 2.5 0 0 0-5 0v2Z"
        clipRule="evenodd"
      />
    </Solid>
  );
}

export function CheckCircleFilledIcon(props: IconProps) {
  return (
    <Solid {...props}>
      <path
        fillRule="evenodd"
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm4.2 6.6a1 1 0 0 0-1.55-1.27l-3.9 4.76-1.53-1.53a1 1 0 0 0-1.42 1.42l2.3 2.3a1 1 0 0 0 1.48-.08l4.62-5.6Z"
        clipRule="evenodd"
      />
    </Solid>
  );
}

/** The Vertex "V" mark. */
export function VertexMark({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d="M2 3h20L12 21 2 3Z" fill="currentColor" />
      <path d="M8.2 7.3 12 14l3.8-6.7H8.2Z" fill="var(--color-surface)" />
    </svg>
  );
}

/* ---------- Principle glyphs ---------- */

export function EyeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Outline>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </Outline>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </Outline>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="4.5" r="1.5" />
      <path d="M4.5 8.5h15" />
      <path d="M12 8.5V15" />
      <path d="m12 15-3.5 5.5M12 15l3.5 5.5" />
    </Outline>
  );
}

/* ---------- Learning-outcome icons ----------
   One per `learningOutcome.icon` key in the Sanity schema. */

export function LayersIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </Outline>
  );
}

export function DatabaseIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </Outline>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 12 4-4" />
      <path d="M12 12h.01" />
    </Outline>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M7 18h10a4 4 0 0 0 .6-8 6 6 0 0 0-11.4 1.6A3.5 3.5 0 0 0 7 18Z" />
    </Outline>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </Outline>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
    </Outline>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7.5 9.5 3 2.5-3 2.5" />
      <path d="M13 15h4" />
    </Outline>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M14 4c3.5 1 6 3.5 6 7.5 0 3-1.6 5.6-4 7.5l-4-2-4-2c0-4.4 2.6-8.6 6-11Z" />
      <circle cx="13.5" cy="10.5" r="1.6" />
      <path d="M8 16c-1.6.7-2.4 2.3-2.5 4.5 2.2-.1 3.8-.9 4.5-2.5" />
    </Outline>
  );
}

export function PuzzleIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M10 4a2 2 0 0 1 4 0v1h4a1 1 0 0 1 1 1v4h-1a2 2 0 0 0 0 4h1v4a1 1 0 0 1-1 1h-4v-1a2 2 0 0 0-4 0v1H6a1 1 0 0 1-1-1v-4h1a2 2 0 0 0 0-4H5V6a1 1 0 0 1 1-1h4V4Z" />
    </Outline>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="m10 3 1.8 4.7L16.5 9.5l-4.7 1.8L10 16l-1.8-4.7L3.5 9.5l4.7-1.8L10 3Z" />
      <path d="m18 14 .9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4Z" />
    </Outline>
  );
}

export function WorkflowIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="3" y="3" width="7" height="6" rx="1.5" />
      <rect x="14" y="15" width="7" height="6" rx="1.5" />
      <path d="M6.5 9v6a3 3 0 0 0 3 3H14" />
    </Outline>
  );
}

/** Maps a `learningOutcome.icon` key to its component. */
export const learningOutcomeIcons = {
  layers: LayersIcon,
  database: DatabaseIcon,
  gauge: GaugeIcon,
  cloud: CloudIcon,
  code: CodeIcon,
  shield: ShieldIcon,
  terminal: TerminalIcon,
  rocket: RocketIcon,
  puzzle: PuzzleIcon,
  sparkles: SparklesIcon,
  workflow: WorkflowIcon,
} satisfies Record<string, (props: IconProps) => ReactElement>;

/** Falls back to the star when the key is missing or unknown. */
export function learningOutcomeIcon(key: string | null | undefined) {
  if (key && key in learningOutcomeIcons) {
    return learningOutcomeIcons[key as keyof typeof learningOutcomeIcons];
  }
  return StarIcon;
}
