/**
 * Brand tiles for the catalog cards. Hand-drawn inline SVG so the home page
 * carries no image assets and no icon dependency.
 */

export function NextjsMark() {
  return (
    <span className="flex size-full items-center justify-center rounded-md bg-neutral-900 font-display text-3xl font-bold text-white">
      N
    </span>
  );
}

export function TypeScriptMark() {
  return (
    <span className="flex size-full items-center justify-center rounded-md bg-[#3178c6] text-xl font-bold tracking-tight text-white">
      TS
    </span>
  );
}

export function DockerMark() {
  return (
    <span className="flex size-full items-center justify-center rounded-md bg-transparent">
      <svg
        width="64"
        height="48"
        viewBox="0 0 56 42"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <g fill="#2496ed">
          <rect x="16" y="16" width="6" height="6" rx="0.5" />
          <rect x="23" y="16" width="6" height="6" rx="0.5" />
          <rect x="30" y="16" width="6" height="6" rx="0.5" />
          <rect x="23" y="9" width="6" height="6" rx="0.5" />
          <rect x="30" y="9" width="6" height="6" rx="0.5" />
          <rect x="30" y="2" width="6" height="6" rx="0.5" />
          <rect x="37" y="16" width="6" height="6" rx="0.5" />
          <rect x="9" y="16" width="6" height="6" rx="0.5" />
        </g>
        <path
          d="M54.6 20.4c-1.7-1.1-5.2-1.5-7.6-1a10.4 10.4 0 0 0-4.5-5.6l-.9-.6-.6 1a10.7 10.7 0 0 0-1.2 6.8H2.4c-.6 0-1 .4-1.1 1a20 20 0 0 0 1.9 11.2C5.6 37.6 10.4 40 17 40c14.4 0 25-6.5 30-18.3 1.9.1 6.1.1 8.2-4l.5-1-1.1-.7Z"
          fill="#2496ed"
        />
      </svg>
    </span>
  );
}
