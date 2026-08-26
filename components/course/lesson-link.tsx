"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { ReactNode } from "react";

interface LessonLinkProps {
  href: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonLabel: string;
  children: ReactNode;
  className?: string;
}

/**
 * A client-side link wrapper for individual lessons that captures a PostHog
 * event when the user selects a lesson to watch.
 */
export function LessonLink({
  href,
  lessonSlug,
  lessonTitle,
  lessonLabel,
  children,
  className,
}: LessonLinkProps) {
  function handleClick() {
    posthog.capture("lesson_selected", {
      lesson_slug: lessonSlug,
      lesson_title: lessonTitle,
      lesson_label: lessonLabel,
    });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
