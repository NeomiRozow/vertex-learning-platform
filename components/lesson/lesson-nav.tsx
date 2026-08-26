import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { formatDuration } from "@/lib/format";

export type AdjacentLesson = {
  title: string | null;
  slug: string | null;
  duration: number | null;
} | null;

/**
 * Previous and next are the neighbouring lessons in the course's flattened
 * order, derived from module and lesson position. At the first or last lesson
 * the corresponding side renders inert.
 */
export function LessonNav({
  previous,
  next,
}: {
  previous: AdjacentLesson;
  next: AdjacentLesson;
}) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="sticky bottom-0 z-10 flex flex-wrap items-center gap-4 border-t border-neutral-200 bg-surface px-6 py-5 sm:px-8 xl:px-12"
    >
      <div className="flex min-w-0 items-center gap-4">
        {previous?.slug ? (
          <Link
            href={`/lessons/${previous.slug}`}
            className={buttonClasses({ variant: "tertiary", size: "lg" })}
          >
            <ArrowLeftIcon size={18} />
            Previous Lesson
          </Link>
        ) : (
          // Disabled: its own colours, so nothing competes with the variant's.
          <span
            aria-disabled="true"
            className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-neutral-200 bg-surface px-4 text-base font-medium whitespace-nowrap text-neutral-300"
          >
            <ArrowLeftIcon size={18} />
            Previous Lesson
          </span>
        )}
        {previous ? (
          <span className="hidden min-w-0 lg:block">
            <span className="block truncate text-sm text-neutral-900">
              {previous.title}
            </span>
            {formatDuration(previous.duration) ? (
              <span className="block text-[13px] text-neutral-500">
                {formatDuration(previous.duration)}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-4">
        {next ? (
          <span className="hidden min-w-0 text-right lg:block">
            <span className="block truncate text-sm text-neutral-900">
              {next.title}
            </span>
            {formatDuration(next.duration) ? (
              <span className="block text-[13px] text-neutral-500">
                {formatDuration(next.duration)}
              </span>
            ) : null}
          </span>
        ) : null}
        {next?.slug ? (
          <Link
            href={`/lessons/${next.slug}`}
            className={buttonClasses({ size: "xl" })}
          >
            Next Lesson
            <ArrowRightIcon size={20} />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-14 cursor-not-allowed items-center justify-center gap-3 rounded-md bg-primary-200 px-8 text-base font-medium whitespace-nowrap text-primary-400"
          >
            Next Lesson
            <ArrowRightIcon size={20} />
          </span>
        )}
      </div>
    </nav>
  );
}
