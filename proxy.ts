import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Establishes the Clerk auth context on every request. Nothing is gated yet:
 * browsing is public, and only routes a feature marks protected get a
 * `createRouteMatcher` + `auth.protect()` guard here later.
 */
export const proxy = clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next internals and static files unless they carry search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
