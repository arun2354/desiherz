import { useEffect, useState } from "react";

export type MediaSlot = {
  video?: string;
  poster?: string;
  alt: string;
};

/**
 * Ambient looping clip for a scene. Falls back to a still poster, and to an
 * abstract cinema-slate mark if neither loads — so a missing file never
 * renders as a broken player on the live site.
 *
 * The clip is only mounted once a HEAD request confirms it exists: a plain
 * `onError` on the <video> can't be trusted here because a same-origin 404
 * for a video source resolves almost instantly, often before React finishes
 * attaching event handlers post-hydration.
 */
export function ScrollVideo({ slot, className = "" }: { slot: MediaSlot; className?: string }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    if (!slot.video) return;
    let cancelled = false;
    fetch(slot.video, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setVideoReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slot.video]);

  if (slot.video && videoReady && !videoFailed) {
    return (
      <video
        className={className}
        src={slot.video}
        poster={slot.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={slot.alt}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  if (slot.poster && !posterFailed) {
    return (
      <img
        className={className}
        src={slot.poster}
        alt={slot.alt}
        loading="lazy"
        decoding="async"
        onError={() => setPosterFailed(true)}
      />
    );
  }

  return (
    <div className="media-slate" aria-hidden="true">
      <div className="media-slate-mark">
        <span />
      </div>
    </div>
  );
}
