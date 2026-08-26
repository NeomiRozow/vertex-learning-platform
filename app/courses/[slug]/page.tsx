import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseContent } from "@/components/course/course-content";
import { CourseHero } from "@/components/course/course-hero";
import { CourseProgressBar } from "@/components/course/course-progress-bar";
import { LearningOutcomes } from "@/components/course/learning-outcomes";
import { SiteHeader } from "@/components/home/site-header";
import { Breadcrumbs } from "@/components/ui/navigation";
import {
  COURSE_BY_SLUG_QUERY,
  COURSE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";

async function getCourse(slug: string) {
  // Typed by the query TypeMap in sanity.types.ts.
  return sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`course:${slug}`],
  });
}

export async function generateStaticParams() {
  // Fresh read: a stale slug list would bake missing pages into the build.
  const slugs = await sanityFetch({
    query: COURSE_SLUGS_QUERY,
    useCdn: false,
  });

  return slugs
    .filter((entry): entry is { slug: string } => Boolean(entry.slug))
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/courses/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = await getCourse(slug);

  if (!course?.title) return {};

  return {
    title: `${course.title} — Vertex`,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params;
  const course = await getCourse(slug);

  if (!course?.title) notFound();

  // Derived from module and lesson order, never stored.
  const firstLessonSlug =
    course.modules?.flatMap((module) => module.lessons ?? [])[0]?.slug ?? null;

  return (
    <div className="hatch flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col border-neutral-200 bg-canvas lg:border-x">
        <SiteHeader />

        <main className="flex flex-1 flex-col px-6 pt-6 pb-10 sm:px-12 xl:px-20">
          <Breadcrumbs
            items={[
              { label: "All Courses", href: "/courses" },
              { label: course.title },
            ]}
          />

          <div className="mt-8 flex flex-col gap-14">
            <CourseHero course={course} firstLessonSlug={firstLessonSlug} />
            <LearningOutcomes outcomes={course.learningOutcomes} />
            <CourseContent course={course} />
          </div>

          <CourseProgressBar firstLessonSlug={firstLessonSlug} />
        </main>
      </div>
    </div>
  );
}
