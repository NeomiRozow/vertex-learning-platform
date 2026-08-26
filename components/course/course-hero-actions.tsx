"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { buttonClasses } from "@/components/ui/button";
import { ArrowRightIcon, BookmarkIcon } from "@/components/ui/icons";

interface CourseHeroActionsProps {
  courseSlug: string | null;
  courseTitle: string;
  firstLessonSlug: string | null;
}

/**
 * Client-side action buttons for the course hero.
 * Separated so the parent CourseHero can remain a server component.
 */
export function CourseHeroActions({
  courseSlug,
  courseTitle,
  firstLessonSlug,
}: CourseHeroActionsProps) {
  function handleStartLearning() {
    posthog.capture("course_started", {
      course_slug: courseSlug,
      course_title: courseTitle,
    });
  }

  function handleBookmark() {
    posthog.capture("course_bookmarked", {
      course_slug: courseSlug,
      course_title: courseTitle,
    });
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      {firstLessonSlug ? (
        <Link
          href={`/lessons/${firstLessonSlug}`}
          className={buttonClasses({ size: "xl" })}
          onClick={handleStartLearning}
        >
          Start Learning
          <ArrowRightIcon size={20} />
        </Link>
      ) : null}
      {/* Presentational, per AGENTS section 7: a label, not a saved state. */}
      <button
        type="button"
        className={buttonClasses({
          variant: "tertiary",
          size: "xl",
          className: "gap-3",
        })}
        onClick={handleBookmark}
      >
        <BookmarkIcon size={20} />
        Bookmark
      </button>
    </div>
  );
}
