import Image from "next/image";
import type { COURSES_CATALOG_QUERY_RESULT } from "@/sanity.types";
import { cn } from "@/lib/cn";
import { formatDuration, formatLevel } from "@/lib/format";
import { urlFor } from "@/sanity/lib/image";
import { CourseCard } from "@/components/ui/card";

type Courses = COURSES_CATALOG_QUERY_RESULT;

/**
 * The stacked course cards, shared by the home page and the catalog so the
 * cover tile and the display formatting live in one place.
 */
export function CourseGrid({
  courses,
  className,
}: {
  courses: Courses;
  className?: string;
}) {
  if (!courses.length) return null;

  return (
    <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {courses.map((course) => {
        const cover = course.coverImage?.asset?.url ? course.coverImage : null;
        return (
          <li key={course._id} className="flex">
            <CourseCard
              variant="stacked"
              className="w-full"
              href={course.slug ? `/courses/${course.slug}` : undefined}
              title={course.title ?? ""}
              description={course.summary ?? ""}
              level={formatLevel(course.level) ?? ""}
              duration={formatDuration(course.totalDuration) ?? ""}
              moduleCount={course.moduleCount ?? 0}
              icon={
                cover ? (
                  <Image
                    src={urlFor(cover).width(128).height(128).fit("crop").url()}
                    alt={cover.alt ?? course.title ?? ""}
                    width={64}
                    height={64}
                    placeholder={
                      cover.asset?.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={cover.asset?.metadata?.lqip ?? undefined}
                    className="size-full object-cover"
                  />
                ) : undefined
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
