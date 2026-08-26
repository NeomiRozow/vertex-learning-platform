import type { Metadata } from "next";
import { CategoryFilter } from "@/components/course/category-filter";
import { CourseGrid } from "@/components/course/course-grid";
import { SiteHeader } from "@/components/home/site-header";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  CATEGORIES_QUERY,
  COURSES_CATALOG_QUERY,
} from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "All Courses — Vertex",
  description: "Every course on Vertex.",
};

export default async function CoursesPage(props: PageProps<"/courses">) {
  const { category } = await props.searchParams;
  const active = typeof category === "string" && category ? category : null;

  // Both typed by the query TypeMap in sanity.types.ts.
  const [allCourses, categories] = await Promise.all([
    sanityFetch({ query: COURSES_CATALOG_QUERY, tags: ["course"] }),
    sanityFetch({ query: CATEGORIES_QUERY, tags: ["category"] }),
  ]);

  // Filtered in the page, not in GROQ: the catalog is small enough that a
  // second projection is not worth it. See prompts/courses-category-filter.md.
  const courses = active
    ? allCourses.filter((course) => course.category?.slug === active)
    : allCourses;

  const activeTitle =
    categories.find((entry) => entry.slug === active)?.title ?? active;

  return (
    <div className="hatch flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col border-neutral-200 bg-canvas lg:border-x">
        <SiteHeader />

        <main className="flex flex-1 flex-col px-6 pt-14 pb-20 sm:px-12 xl:px-20">
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            All Courses
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
            {active ? <> in {activeTitle}</> : null}
          </p>

          <CategoryFilter
            categories={categories}
            active={active}
            className="mt-6"
          />

          {courses.length ? (
            <CourseGrid courses={courses} className="mt-8" />
          ) : (
            <p className="mt-8 text-base text-neutral-500">
              {active
                ? `No courses in ${activeTitle} yet.`
                : "No courses published yet."}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
