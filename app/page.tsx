import Link from "next/link";
import { ChartDecoration } from "@/components/home/chart-decoration";
import { CourseGrid } from "@/components/course/course-grid";
import { SiteHeader } from "@/components/home/site-header";
import { buttonClasses } from "@/components/ui/button";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";
import { SearchInput } from "@/components/ui/input";
import { sanityFetch } from "@/sanity/lib/fetch";
import { COURSES_CATALOG_QUERY } from "@/sanity/lib/queries";

/** Cards shown on the home page; the full list lives on the catalog. */
const HOME_COURSE_COUNT = 3;

export default async function Home() {
  // Typed by the query TypeMap in sanity.types.ts. Ordered popular first.
  const courses = (
    await sanityFetch({ query: COURSES_CATALOG_QUERY, tags: ["course"] })
  ).slice(0, HOME_COURSE_COUNT);

  return (
    <div className="hatch flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col border-neutral-200 bg-canvas lg:border-x">
        <SiteHeader />

        <main className="flex flex-1 flex-col">
          <section className="flex flex-col items-center px-6 pt-14 pb-16 text-center sm:px-12 xl:px-20 sm:pt-16 sm:pb-18">
            <p className="inline-flex items-center rounded-md border border-neutral-200 bg-surface px-5 py-3 text-xs font-bold tracking-[0.14em] text-primary-500 uppercase">
              Intelligent Learning
            </p>

            <h1 className="mt-10 font-display text-4xl leading-[1.15] font-bold text-balance text-neutral-900 sm:text-5xl md:text-[64px] md:leading-[1.18]">
              Search your learning{" "}
              <span className="md:block">in plain English.</span>
            </h1>

            <p className="mt-8 max-w-[430px] text-base leading-8 text-neutral-700 sm:text-lg">
              Vertex understands what you want to learn and finds the exact
              lessons across all your courses.
            </p>

            <Link
              href="/courses"
              className={buttonClasses({ size: "xl", className: "mt-10" })}
            >
              Explore Courses
              <ArrowRightIcon size={20} />
            </Link>

            <form
              role="search"
              action="/search"
              className="mt-12 w-full max-w-[745px]"
            >
              <label htmlFor="home-search" className="sr-only">
                Search your learning
              </label>
              <SearchInput
                id="home-search"
                name="q"
                size="lg"
                placeholder="Ask anything about your learning..."
              />
            </form>
          </section>

          <section className="border-t border-neutral-200 px-6 pt-14 pb-16 sm:px-12 xl:px-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-3xl font-bold text-neutral-900">
                All Courses
              </h2>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xs text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
              >
                View all courses
                <ArrowRightIcon size={18} />
              </Link>
            </div>

            <CourseGrid courses={courses} className="mt-8" />

            <div className="mt-16 flex items-center gap-6">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="inline-flex items-center gap-4 text-sm text-neutral-700">
                <StarIcon size={22} className="text-primary-500" />
                New courses and lessons added every week.
              </span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
          </section>

          <ChartDecoration />
        </main>
      </div>
    </div>
  );
}
