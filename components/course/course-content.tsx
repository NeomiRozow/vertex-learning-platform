import Link from "next/link";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { cn } from "@/lib/cn";
import { formatDuration, sumDuration } from "@/lib/format";
import { ChevronDownIcon, PlayCircleIcon } from "@/components/ui/icons";

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;
type CourseModule = NonNullable<Course["modules"]>[number];

/** Modules always visible; the rest sit behind the show-all disclosure. */
const VISIBLE_MODULES = 6;

/**
 * One module row. A native disclosure, so the whole page stays a server
 * component: no state, no client bundle.
 */
function ModuleRow({
  module,
  index,
  isLast,
  className,
}: {
  module: CourseModule;
  /** Zero-based position; the displayed number is derived from it. */
  index: number;
  isLast: boolean;
  className?: string;
}) {
  const number = index + 1;
  const duration = formatDuration(sumDuration(module.lessons));
  const lessons = module.lessons ?? [];

  return (
    <details className={cn("group", className)}>
      <summary className="flex cursor-pointer list-none items-start gap-5 px-6 py-5 hover:bg-neutral-50 [&::-webkit-details-marker]:hidden">
        <span className="relative flex shrink-0 flex-col items-center self-stretch">
          <span className="flex size-7 items-center justify-center rounded-full border border-neutral-300 text-xs font-medium text-neutral-900">
            {number}
          </span>
          {isLast ? null : (
            // Connects this module's marker to the next one.
            <span
              aria-hidden="true"
              className="absolute top-7 bottom-[-20px] w-px bg-neutral-200"
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-neutral-900">
            {module.title}
          </span>
          {module.summary ? (
            <span className="mt-1 block text-[13px] text-neutral-500">
              {module.summary}
            </span>
          ) : null}
        </span>

        <span className="flex shrink-0 items-center gap-4 pt-0.5">
          {duration ? (
            <span className="text-[13px] whitespace-nowrap text-neutral-500">
              {duration}
            </span>
          ) : null}
          <ChevronDownIcon
            size={20}
            className="text-neutral-500 transition-transform group-open:rotate-180"
          />
        </span>
      </summary>

      {lessons.length ? (
        <ul className="border-t border-neutral-200 bg-neutral-50/60 px-6 py-2 pl-[68px]">
          {lessons.map((lesson, lessonIndex) => {
            const label = `Lesson ${number}.${lessonIndex + 1}`;
            const lessonDuration = formatDuration(lesson.duration);
            const row = (
              <>
                <PlayCircleIcon
                  size={18}
                  className="shrink-0 text-neutral-500 group-hover/lesson:text-primary-500"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-neutral-900">
                  <span className="text-neutral-500">{label}</span>{" "}
                  {lesson.title}
                </span>
                {lessonDuration ? (
                  <span className="shrink-0 text-[13px] text-neutral-500">
                    {lessonDuration}
                  </span>
                ) : null}
              </>
            );

            return (
              <li key={lesson._id}>
                {lesson.slug ? (
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="group/lesson flex items-center gap-3 rounded-xs py-2.5"
                  >
                    {row}
                  </Link>
                ) : (
                  <span className="group/lesson flex items-center gap-3 py-2.5">
                    {row}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </details>
  );
}

export function CourseContent({ course }: { course: Course }) {
  const modules = course.modules ?? [];
  if (!modules.length) return null;

  const duration = formatDuration(course.totalDuration);
  const visible = modules.slice(0, VISIBLE_MODULES);
  const hidden = modules.slice(VISIBLE_MODULES);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-neutral-900 sm:text-[28px]">
          Course Content
        </h2>
        <p className="text-[13px] text-neutral-500">
          {modules.length} modules
          {duration ? <> &nbsp;·&nbsp; {duration}</> : null}
        </p>
      </div>

      {/*
        The show-all disclosure sits first so the hidden rows can react to it as
        following siblings (`peer-open`), while `order` puts its pill last in
        the card. Keeps the reveal in CSS rather than in a client component.
      */}
      <div className="mt-6 flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-surface shadow-sm">
        {hidden.length ? (
          <details className="group peer contents">
            <summary className="order-last flex cursor-pointer list-none items-center justify-center gap-2 border-t border-neutral-200 px-6 py-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">
                Show all {modules.length} modules
              </span>
              <span className="hidden group-open:inline">Show fewer modules</span>
              <ChevronDownIcon
                size={18}
                className="text-neutral-500 transition-transform group-open:rotate-180"
              />
            </summary>
          </details>
        ) : null}

        {visible.map((module, index) => (
          <ModuleRow
            key={module._key}
            module={module}
            index={index}
            isLast={index === modules.length - 1}
            className={index === 0 ? undefined : "border-t border-neutral-200"}
          />
        ))}

        {hidden.map((module, index) => (
          <ModuleRow
            key={module._key}
            module={module}
            index={index + VISIBLE_MODULES}
            isLast={index === hidden.length - 1}
            className="hidden border-t border-neutral-200 peer-open:block"
          />
        ))}
      </div>
    </section>
  );
}
