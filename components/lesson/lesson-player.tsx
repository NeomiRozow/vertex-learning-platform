"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { PlayCircleFilledIcon } from "@/components/ui/icons";
import { formatTimestamp, videoEmbed } from "@/lib/video-embed";

export type LessonPlayerProps = {
  videoUrl: string | null;
  posterUrl: string | null;
  posterBlur?: string | null;
  posterAlt: string;
  lessonSlug: string;
  lessonTitle: string;
  courseSlug: string | null;
  courseTitle: string | null;
};

/**
 * Poster first, provider embed on click.
 *
 * Playback stays on this site through the provider's own player, so no custom
 * controls are built. Holding the iframe back until the play click keeps the
 * provider's script off the page until the learner asks for it, and gives a
 * real play signal without pulling in the provider's JS API.
 *
 * The start second comes from `?t=` and is read here rather than on the server:
 * reading `searchParams` in the page would force dynamic rendering.
 */
export function LessonPlayer({
  videoUrl,
  posterUrl,
  posterBlur,
  posterAlt,
  lessonSlug,
  lessonTitle,
  courseSlug,
  courseTitle,
}: LessonPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const searchParams = useSearchParams();

  const startSeconds = Math.max(0, Number(searchParams.get("t") ?? 0) || 0);
  const embed = videoEmbed(videoUrl, { startSeconds, autoplay: true });

  function handlePlay() {
    posthog.capture("lesson_video_played", {
      lesson_slug: lessonSlug,
      lesson_title: lessonTitle,
      course_slug: courseSlug,
      course_title: courseTitle,
      start_seconds: startSeconds,
      provider: embed?.provider ?? null,
    });
    setPlaying(true);
  }

  const frame =
    "relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900";

  if (playing && embed) {
    return (
      <div className={frame}>
        <iframe
          src={embed.src}
          title={embed.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  const poster = posterUrl ? (
    <Image
      src={posterUrl}
      alt={posterAlt}
      fill
      sizes="(min-width: 1280px) 900px, (min-width: 768px) 70vw, 100vw"
      placeholder={posterBlur ? "blur" : undefined}
      blurDataURL={posterBlur ?? undefined}
      className="object-cover"
      priority
    />
  ) : null;

  // No playable provider: the poster stands alone rather than a dead button.
  if (!embed) {
    return (
      <div className={frame}>
        {poster}
        <span className="absolute inset-x-0 bottom-0 bg-neutral-900/70 px-5 py-3 text-sm text-white">
          This video is not available for playback here.
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Play ${lessonTitle}${startSeconds ? ` from ${formatTimestamp(startSeconds)}` : ""}`}
      className={`${frame} group block cursor-pointer`}
    >
      {poster}
      <span className="absolute inset-0 bg-neutral-900/25 transition-colors group-hover:bg-neutral-900/35" />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
        <PlayCircleFilledIcon
          size={72}
          className="drop-shadow-lg transition-transform group-hover:scale-105"
        />
        {startSeconds ? (
          <span className="text-sm font-medium">
            Watch from {formatTimestamp(startSeconds)}
          </span>
        ) : null}
      </span>
    </button>
  );
}
