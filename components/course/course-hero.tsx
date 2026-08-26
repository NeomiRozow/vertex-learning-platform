import Image from "next/image";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { formatCount, formatDuration, formatLevel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  FileIcon,
  SignalIcon,
  UsersIcon,
} from "@/components/ui/icons";
import type { ReactNode } from "react";
import { CourseHeroActions } from "@/components/course/course-hero-actions";

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-neutral-500">
      {icon}
      {children}
    </span>
  );
}

export function CourseHero({
  course,
  firstLessonSlug,
}: {
  course: Course;
  /** Where both CTAs point. Null when the course has no lessons yet. */
  firstLessonSlug: string | null;
}) {
  const cover = course.coverImage?.asset?.url ? course.coverImage : null;
  const level = formatLevel(course.level);
  const duration = formatDuration(course.totalDuration);
  const students = formatCount(course.studentCount);

  return (
    <section className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      {cover ? (
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-neutral-900 sm:w-[280px]">
          <Image
            src={urlFor(cover).width(560).height(560).fit("crop").url()}
            alt={cover.alt ?? course.title ?? ""}
            fill
            sizes="(min-width: 640px) 280px, 100vw"
            placeholder={cover.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={cover.asset?.metadata?.lqip ?? undefined}
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        {course.popular ? <Badge tone="popular">Popular</Badge> : null}

        <h1 className="mt-5 font-display text-4xl leading-[1.15] font-bold text-neutral-900 sm:text-5xl">
          {course.title}
        </h1>

        {course.summary ? (
          <p className="mt-5 max-w-[480px] text-base leading-8 text-neutral-700 sm:text-[17px]">
            {course.summary}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          {level ? (
            <Meta icon={<SignalIcon size={18} />}>{level}</Meta>
          ) : null}
          {duration ? (
            <Meta icon={<ClockIcon size={18} />}>{duration}</Meta>
          ) : null}
          {course.moduleCount ? (
            <Meta icon={<FileIcon size={18} />}>
              {course.moduleCount} modules
            </Meta>
          ) : null}
          {students ? (
            <Meta icon={<UsersIcon size={18} />}>{students} students</Meta>
          ) : null}
        </div>

        <CourseHeroActions
          courseSlug={course.slug ?? null}
          courseTitle={course.title ?? ""}
          firstLessonSlug={firstLessonSlug}
        />
      </div>
    </section>
  );
}
