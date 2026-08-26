/**
 * Display formatting for values stored raw in Sanity.
 * Durations are stored in seconds and counts as integers; both are formatted
 * here so every page shows them the same way.
 */

/** `65_040` → `18h 4m`, `2_700` → `45m`. */
export function formatDuration(seconds: number | null | undefined) {
  if (!seconds || seconds < 0) return null;
  const total = Math.round(seconds / 60);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes}m`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

/** `2_140` → `2.1k`, `980` → `980`. */
export function formatCount(count: number | null | undefined) {
  if (count === null || count === undefined || count < 0) return null;
  if (count < 1000) return `${count}`;
  const thousands = count / 1000;
  const rounded = thousands < 10 ? Math.round(thousands * 10) / 10 : Math.round(thousands);
  return `${rounded}k`;
}

/** `"intermediate"` → `"Intermediate"`. */
export function formatLevel(level: string | null | undefined) {
  if (!level) return null;
  return level.charAt(0).toUpperCase() + level.slice(1);
}

/** Sums the durations of a module's lessons. */
export function sumDuration(
  lessons: ReadonlyArray<{ duration: number | null }> | null | undefined,
) {
  if (!lessons?.length) return null;
  const total = lessons.reduce((sum, lesson) => sum + (lesson.duration ?? 0), 0);
  return total || null;
}
