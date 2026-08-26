/** Bar heights as a percentage of the strip, read off the reference. */
const bars = [
  62, 34, 78, 46, 92, 40, 70, 30, 84, 52, 66, 38, 74, 0, 0, 58, 44, 88, 36, 68,
  30, 80, 48, 94, 42, 72,
];

/**
 * Decorative bar-chart band that bleeds off the bottom of the home page.
 */
export function ChartDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex h-40 items-end gap-1 overflow-hidden px-6 sm:h-56 sm:px-12 xl:px-20"
    >
      {bars.map((height, i) => (
        <div
          key={i}
          style={{ height: `${height}%` }}
          className="flex-1 rounded-t-xs bg-gradient-to-b from-primary-400 to-primary-400/0"
        />
      ))}
    </div>
  );
}
