import Image from "next/image";
import Link from "next/link";
import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { LessonLink } from "@/components/course/lesson-link";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PlayCircleFilledIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { formatDuration, sumDuration } from "@/lib/format";
import { urlFor } from "@/sanity/lib/image";

type Lesson = NonNullable<LESSON_BY_SLUG_QUERY_RESULT>;
type Course = NonNullable<Lesson["course"]>;
type CourseModule = NonNullable<Course["modules"]>[number];

export type LessonSidebarProps = {
  course: Course;
  /** Zero-based index of the module the current lesson sits in. */
  currentModuleIndex: number;
  currentLessonId: string;
  /**
   * Course completion, 0–100. There is no progress store yet, so this stays 0
   * and no lesson is marked complete. See AGENTS section 7.
   */
  progress?: number;
};

function ModuleRow({
  module: courseModule,
  index,
  isLast,
  isCurrent,
  currentLessonId,
}: {
  module: CourseModule;
  index: number;
  isLast: boolean;
  isCurrent: boolean;
  currentLessonId: string;
}) {
  const number = index + 1;
  const lessons = courseModule.lessons ?? [];
  const duration = formatDuration(sumDuration(lessons));

  return (
    <details
      open={isCurrent}
      className={cn("group", isCurrent && "bg-neutral-50/70")}
    >
      <summary className="flex cursor-pointer list-none items-start gap-4 px-6 py-4 hover:bg-neutral-50 [&::-webkit-details-marker]:hidden">
        <span className="relative flex shrink-0 flex-col items-center self-stretch">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-medium",
              isCurrent
                ? "bg-primary-500 text-white"
                : "border border-neutral-300 text-neutral-900",
            )}
          >
            {number}
          </span>
          {isLast ? null : (
            <span
              aria-hidden="true"
              className="absolute top-7 bottom-[-16px] w-px bg-neutral-200"
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-neutral-900">
            {courseModule.title}
          </span>
          {duration ? (
            <span className="mt-1 block text-xs text-neutral-500">
              {duration}
            </span>
          ) : null}
        </span>

        <ChevronDownIcon
          size={18}
          className="mt-1 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
        />
      </summary>

      {lessons.length ? (
        <ul className="flex flex-col pb-2 pl-[52px]">
          {lessons.map((lesson, lessonIndex) => {
            const active = lesson._id === currentLessonId;
            const label = `Lesson ${number}.${lessonIndex + 1}`;
            const lessonDuration = formatDuration(lesson.duration);

            const body = (
              <>
                <span className="relative flex shrink-0 flex-col items-center self-stretch pt-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      active
                        ? "bg-primary-500"
                        : "border border-neutral-300 bg-transparent",
                    )}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[13px] leading-5",
                      active
                        ? "font-semibold text-neutral-900"
                        : "text-neutral-700",
                    )}
                  >
                    {lesson.title}
                  </span>
                  {active ? (
                    <span className="mt-0.5 block text-xs text-primary-500">
                      Now playing
                    </span>
                  ) : lessonDuration ? (
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {lessonDuration}
                    </span>
                  ) : null}
                </span>
                {active ? (
                  <PlayCircleFilledIcon
                    size={22}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />
                ) : null}
              </>
            );

            const rowClass =
              "flex items-start gap-3 rounded-xs py-2.5 pr-6 hover:bg-neutral-100/70";

            return (
              <li key={lesson._id}>
                {lesson.slug && !active ? (
                  <LessonLink
                    href={`/lessons/${lesson.slug}`}
                    lessonSlug={lesson.slug}
                    lessonTitle={lesson.title ?? ""}
                    lessonLabel={label}
                    className={rowClass}
                  >
                    {body}
                  </LessonLink>
                ) : (
                  <span
                    aria-current={active ? "true" : undefined}
                    className={cn(rowClass, "hover:bg-transparent")}
                  >
                    {body}
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

export function LessonSidebar({
  course,
  currentModuleIndex,
  currentLessonId,
  progress = 0,
}: LessonSidebarProps) {
  const modules = course.modules ?? [];
  const cover = course.coverImage?.asset?.url ? course.coverImage : null;
  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="flex flex-col">
      <div className="px-6 py-6">
        {course.slug ? (
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 rounded-xs text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            <ArrowLeftIcon size={18} />
            Back to course
          </Link>
        ) : null}

        <div className="mt-6 flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-neutral-900">
            {cover ? (
              <Image
                src={urlFor(cover).width(112).height(112).fit("crop").url()}
                alt={cover.alt ?? course.title ?? ""}
                fill
                sizes="56px"
                placeholder={cover.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={cover.asset?.metadata?.lqip ?? undefined}
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-lg font-semibold text-white">
                {course.title?.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] leading-5 font-semibold text-neutral-900">
              {course.slug ? (
                <Link
                  href={`/courses/${course.slug}`}
                  className="hover:text-primary-500"
                >
                  {course.title}
                </Link>
              ) : (
                course.title
              )}
            </p>
            <p className="mt-1.5 text-xs text-neutral-500">{pct}% complete</p>
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${pct}% complete`}
              className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-primary-100"
            >
              <div
                className="h-full rounded-full bg-primary-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {modules.length ? (
        <>
          <p className="border-y border-neutral-200 px-6 py-3 text-[13px] text-neutral-700">
            Module {currentModuleIndex + 1} of {modules.length}
          </p>
          <ul className="flex flex-col">
            {modules.map((courseModule, index) => (
              <li
                key={courseModule._key}
                className={index === 0 ? undefined : "border-t border-neutral-200"}
              >
                <ModuleRow
                  module={courseModule}
                  index={index}
                  isLast={index === modules.length - 1}
                  isCurrent={index === currentModuleIndex}
                  currentLessonId={currentLessonId}
                />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
