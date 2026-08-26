"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { CATEGORIES_QUERY_RESULT } from "@/sanity.types";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/button";

/**
 * Category pills for the catalog.
 *
 * The selection lives in the URL (`?category=<slug>`), so filtered views are
 * shareable and back-button correct. Marked client-side for PostHog capture.
 */
export function CategoryFilter({
  categories,
  active,
  className,
}: {
  categories: CATEGORIES_QUERY_RESULT;
  /** Slug of the active category, or null for "All". */
  active: string | null;
  className?: string;
}) {
  if (!categories.length) return null;

  const options = [
    { key: "all", label: "All", slug: null as string | null },
    ...categories
      .filter((category) => category.slug)
      .map((category) => ({
        key: category._id,
        label: category.title ?? category.slug!,
        slug: category.slug,
      })),
  ];

  return (
    <nav aria-label="Filter by category" className={className}>
      <ul className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = option.slug === active;
          return (
            <li key={option.key}>
              <Link
                href={option.slug ? `/courses?category=${option.slug}` : "/courses"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  buttonClasses({
                    variant: isActive ? "primary" : "tertiary",
                    size: "md",
                  }),
                  "rounded-full",
                )}
                onClick={() => {
                  if (!isActive) {
                    posthog.capture("category_filter_applied", {
                      category_slug: option.slug ?? "all",
                      category_label: option.label,
                    });
                  }
                }}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
