import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ProgressBar } from "@/components/ui/progress-bar";

/**
 * The sticky course footer.
 *
 * Learner progress is its own deliverable and has no store yet, so `value`
 * stays 0 and the CTA reads "Start Learning". Nothing here is invented: when
 * progress lands, it passes a real value and the label flips back to
 * "Continue Learning".
 */
export function CourseProgressBar({
  value = 0,
  firstLessonSlug,
}: {
  value?: number;
  firstLessonSlug: string | null;
}) {
  const started = value > 0;

  return (
    <div className="pointer-events-none sticky bottom-0 z-10 pb-4">
      <div className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4 rounded-lg border border-neutral-200 bg-surface p-5 shadow-lg">
        <div className="shrink-0">
          <p className="text-xs text-neutral-500">Your Progress</p>
          <p className="mt-1 text-[15px] text-neutral-500">
            <span className="font-semibold text-neutral-900">
              {Math.round(value)}%
            </span>{" "}
            complete
          </p>
        </div>

        <ProgressBar
          value={value}
          showLabel={false}
          className="hidden min-w-[180px] flex-1 sm:flex"
        />

        {firstLessonSlug ? (
          <Link
            href={`/lessons/${firstLessonSlug}`}
            className={buttonClasses({ size: "xl", className: "ml-auto" })}
          >
            {started ? "Continue Learning" : "Start Learning"}
            <ArrowRightIcon size={20} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
