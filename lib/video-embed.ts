/**
 * Turns a stored `lesson.videoUrl` into an embed the lesson page can play
 * in place. Playback stays on this site (AGENTS section 7), so every provider
 * is rendered as its own iframe with its own controls — no custom player.
 *
 * The embed src is built from a parsed and validated id, never by
 * concatenating the raw stored URL, so a malformed URL can never become the
 * iframe src.
 */

export type VideoProvider = "youtube" | "vimeo" | "bunny";

export type VideoEmbed = {
  provider: VideoProvider;
  /** The provider's own id. For Bunny, `libraryId/videoId`. */
  id: string;
  /** Ready-to-use iframe src, already carrying the start second. */
  src: string;
  title: string;
};

const ID = /^[\w-]+$/;

function parse(url: string): { provider: VideoProvider; id: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const segments = parsed.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    const id = segments[0];
    return id && ID.test(id) ? { provider: "youtube", id } : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    // /watch?v=ID, /embed/ID, /shorts/ID, /live/ID
    const id =
      parsed.searchParams.get("v") ??
      (["embed", "shorts", "live", "v"].includes(segments[0] ?? "")
        ? segments[1]
        : undefined);
    return id && ID.test(id) ? { provider: "youtube", id } : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/ID, player.vimeo.com/video/ID
    const id = segments[0] === "video" ? segments[1] : segments[0];
    return id && /^\d+$/.test(id) ? { provider: "vimeo", id } : null;
  }

  if (host.endsWith("mediadelivery.net") || host.endsWith("b-cdn.net")) {
    // iframe.mediadelivery.net/embed/LIBRARY/VIDEO, or /play/LIBRARY/VIDEO
    const rest = ["embed", "play"].includes(segments[0] ?? "")
      ? segments.slice(1)
      : segments;
    const [library, video] = rest;
    return library && video && ID.test(library) && ID.test(video)
      ? { provider: "bunny", id: `${library}/${video}` }
      : null;
  }

  return null;
}

/**
 * `null` when the URL is missing or from a provider we cannot play. Callers
 * fall back to the poster rather than throwing.
 */
export function videoEmbed(
  url: string | null | undefined,
  {
    startSeconds = 0,
    autoplay = false,
  }: { startSeconds?: number; autoplay?: boolean } = {},
): VideoEmbed | null {
  if (!url) return null;
  const source = parse(url);
  if (!source) return null;

  const start = Number.isFinite(startSeconds)
    ? Math.max(0, Math.floor(startSeconds))
    : 0;

  if (source.provider === "youtube") {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    if (start) params.set("start", String(start));
    if (autoplay) params.set("autoplay", "1");
    return {
      provider: "youtube",
      id: source.id,
      src: `https://www.youtube-nocookie.com/embed/${source.id}?${params}`,
      title: "YouTube video player",
    };
  }

  if (source.provider === "vimeo") {
    const params = new URLSearchParams({ playsinline: "1" });
    if (autoplay) params.set("autoplay", "1");
    // Vimeo takes the start offset in the fragment, not the query.
    const fragment = start ? `#t=${start}s` : "";
    return {
      provider: "vimeo",
      id: source.id,
      src: `https://player.vimeo.com/video/${source.id}?${params}${fragment}`,
      title: "Vimeo video player",
    };
  }

  const params = new URLSearchParams();
  if (start) params.set("t", String(start));
  if (autoplay) params.set("autoplay", "true");
  const query = params.toString();
  return {
    provider: "bunny",
    id: source.id,
    src: `https://iframe.mediadelivery.net/embed/${source.id}${query ? `?${query}` : ""}`,
    title: "Video player",
  };
}

/** `125` → `2:05`, `3725` → `1:02:05`. */
export function formatTimestamp(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
