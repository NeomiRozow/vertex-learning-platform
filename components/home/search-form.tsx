"use client";

import posthog from "posthog-js";
import { SearchInput } from "@/components/ui/input";

/**
 * Client-side search form.
 * Captures the search query before navigating so the event is not lost.
 */
export function SearchForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const query = (form.elements.namedItem("q") as HTMLInputElement)?.value?.trim();
    if (query) {
      posthog.capture("search_submitted", {
        query_length: query.length,
      });
    }
  }

  return (
    <form
      role="search"
      action="/search"
      onSubmit={handleSubmit}
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
  );
}
