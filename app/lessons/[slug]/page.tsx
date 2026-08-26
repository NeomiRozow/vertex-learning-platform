import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonContent } from "@/components/lesson/lesson-content";
import { LessonNav, type AdjacentLesson } from "@/components/lesson/lesson-nav";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";
import { LessonTabs } from "@/components/lesson/lesson-tabs";
import { LessonViewTracker } from "@/components/lesson/lesson-view-tracker";
import { SiteHeader } from "@/components/home/site-header";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkIcon,
  ChevronDownIcon,
  ClockIcon,
  SignalIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/ui/navigation";
import { formatCount, formatDuration, formatLevel } from "@/lib/format";
import { LESSON_BY_SLUG_QUERY, LESSON_SLUGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import type { ReactNode } from "react";

async function getLesson(slug: string) {
  return sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
    tags: [`lesson:${slug}`],
  });
}

export async function generateStaticParams() {
  // Fresh read: a stale slug list would bake missing pages into the build.
  const slugs = await sanityFetch({ query: LESSON_SLUGS_QUERY, useCdn: false });

  return slugs
    .filter((entry): entry is { slug: string } => Boolean(entry.slug))
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/lessons/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const lesson = await getLesson(slug);

  if (!lesson?.title) return {};

  return {
    title: `${lesson.title} — Vertex`,
    description: lesson.summary ?? undefined,
  };
}

type Lesson = NonNullable<Awaited<ReturnType<typeof getLesson>>>;
type Course = NonNullable<Lesson["course"]>;

/**
 * Every label the page shows — `Lesson 5.1`, `Module 5 of 12`, previous and
 * next — is derived from position in the course's module and lesson arrays.
 * Nothing is stored on the lesson.
 */
function locate(course: Course | null, lessonId: string) {
  const modules = course?.modules ?? [];

  for (const [moduleIndex, courseModule] of modules.entries()) {
    const lessons = courseModule.lessons ?? [];
    const lessonIndex = lessons.findIndex((entry) => entry._id === lessonId);
    if (lessonIndex === -1) continue;

    const flat = modules.flatMap((entry) => entry.lessons ?? []);
    const flatIndex = flat.findIndex((entry) => entry._id === lessonId);

    return {
      moduleIndex,
      moduleTitle: courseModule.title ?? null,
      label: `Lesson ${moduleIndex + 1}.${lessonIndex + 1}`,
      previous: (flat[flatIndex - 1] ?? null) as AdjacentLesson,
      next: (flat[flatIndex + 1] ?? null) as AdjacentLesson,
    };
  }

  return null;
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-neutral-500">
      {icon}
      {children}
    </span>
  );
}

/** Notes have no store yet (AGENTS section 7); this tab is a label only. */
function NotesPanel() {
  return (
    <div className="rounded-md border border-dashed border-neutral-200 px-6 py-10 text-center">
      <p className="text-sm font-medium text-neutral-900">
        Your notes will live here
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        Note taking is not available yet.
      </p>
    </div>
  );
}

export default async function LessonPage(props: PageProps<"/lessons/[slug]">) {
  const { slug } = await props.params;
  const lesson = await getLesson(slug);

  if (!lesson?.title) notFound();

  const course = lesson.course;
  const position = locate(course, lesson._id);

  const duration = formatDuration(lesson.duration);
  const level = formatLevel(course?.level);
  const students = formatCount(lesson.studentCount);

  const poster = lesson.thumbnail?.asset?.url ? lesson.thumbnail : null;

  return (
    <div className="hatch flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col border-neutral-200 bg-canvas lg:border-x">
        <SiteHeader />

        <LessonViewTracker
          lessonSlug={lesson.slug ?? slug}
          lessonTitle={lesson.title}
          courseSlug={course?.slug ?? null}
          courseTitle={course?.title ?? null}
        />

        <div className="flex flex-1 flex-col lg:flex-row">
          {course && position ? (
            <>
              {/* Below lg the tree becomes a disclosure above the content. */}
              <details className="group border-b border-neutral-200 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-sm font-medium text-neutral-900 [&::-webkit-details-marker]:hidden">
                  Course content
                  <ChevronDownIcon
                    size={18}
                    className="text-neutral-500 transition-transform group-open:rotate-180"
                  />
                </summary>
                <LessonSidebar
                  course={course}
                  currentModuleIndex={position.moduleIndex}
                  currentLessonId={lesson._id}
                />
              </details>

              <aside className="hidden shrink-0 border-r border-neutral-200 lg:block lg:w-[320px] xl:w-[400px]">
                <LessonSidebar
                  course={course}
                  currentModuleIndex={position.moduleIndex}
                  currentLessonId={lesson._id}
                />
              </aside>
            </>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 px-6 pt-6 pb-12 sm:px-8 xl:px-12">
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "/courses" },
                  ...(course?.title
                    ? [
                        {
                          label: course.title,
                          href: course.slug
                            ? `/courses/${course.slug}`
                            : undefined,
                        },
                      ]
                    : []),
                  ...(position?.moduleTitle
                    ? [{ label: position.moduleTitle }]
                    : []),
                  { label: lesson.title },
                ]}
              />

              <div className="mt-7 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  {position ? <Badge tone="video">{position.label}</Badge> : null}
                  <h1 className="mt-5 font-display text-4xl leading-[1.15] font-bold text-neutral-900 sm:text-5xl">
                    {lesson.title}
                  </h1>
                </div>
                <button
                  type="button"
                  aria-label="Bookmark this lesson"
                  className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-surface text-neutral-900 transition-colors hover:border-neutral-300 hover:text-primary-500"
                >
                  <BookmarkIcon size={20} />
                </button>
              </div>

              {lesson.summary ? (
                <p className="mt-5 max-w-[640px] text-base leading-8 text-neutral-700 sm:text-[17px]">
                  {lesson.summary}
                </p>
              ) : null}

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                {duration ? (
                  <Meta icon={<ClockIcon size={18} />}>{duration}</Meta>
                ) : null}
                {level ? (
                  <Meta icon={<SignalIcon size={18} />}>{level}</Meta>
                ) : null}
                {students ? (
                  <Meta icon={<UsersIcon size={18} />}>{students} students</Meta>
                ) : null}
              </div>

              <div className="mt-8">
                {/* `useSearchParams` needs a Suspense boundary to prerender. */}
                <Suspense
                  fallback={
                    <div className="aspect-video w-full rounded-lg bg-neutral-900" />
                  }
                >
                  <LessonPlayer
                    videoUrl={lesson.videoUrl}
                    posterUrl={
                      poster
                        ? urlFor(poster).width(1280).height(720).fit("crop").url()
                        : null
                    }
                    posterBlur={poster?.asset?.metadata?.lqip ?? null}
                    posterAlt={poster?.alt ?? lesson.title}
                    lessonSlug={lesson.slug ?? slug}
                    lessonTitle={lesson.title}
                    courseSlug={course?.slug ?? null}
                    courseTitle={course?.title ?? null}
                  />
                </Suspense>
              </div>

              <div className="mt-10">
                <LessonTabs
                  content={<LessonContent lesson={lesson} />}
                  notes={<NotesPanel />}
                />
              </div>
            </main>
          </div>
        </div>

        {position ? (
          <LessonNav previous={position.previous} next={position.next} />
        ) : null}
      </div>
    </div>
  );
}
