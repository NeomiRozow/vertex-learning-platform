"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/** Captures the lesson view once per mounted lesson. Renders nothing. */
export function LessonViewTracker({
  lessonSlug,
  lessonTitle,
  courseSlug,
  courseTitle,
}: {
  lessonSlug: string;
  lessonTitle: string;
  courseSlug: string | null;
  courseTitle: string | null;
}) {
  useEffect(() => {
    posthog.capture("lesson_viewed", {
      lesson_slug: lessonSlug,
      lesson_title: lessonTitle,
      course_slug: courseSlug,
      course_title: courseTitle,
    });
  }, [lessonSlug, lessonTitle, courseSlug, courseTitle]);

  return null;
}
