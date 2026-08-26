"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

/**
 * Identifies the signed-in Clerk user with PostHog.
 * Mount this once inside the root layout so every page gets user correlation.
 */
export function PostHogIdentify() {
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      posthog.identify(user.id, {
        // PII belongs on the person — never in capture() event properties.
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        username: user.username,
      });
    } else {
      // Reset the distinct ID when the user is signed out.
      posthog.reset();
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
