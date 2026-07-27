import { useEffect, useRef } from "react";

/*
  Scrollytelling: a 600vh container with a sticky full-viewport canvas.
  Scroll progress scrubs the full 348-frame sequence (24fps × 14.5s,
  manually extracted — not re-derived here) drawn to canvas, while a
  caption band fades through six progress windows.

  Frame source: public/scrollytelling/hero/{desktop,mobile}/frame_NNNNN.webp
  (re-encoded from the original extracted JPEGs — same 348 frames, same
  content, same moments, just ~50% smaller per file with no visible
  quality loss, since that raw payload was the hard floor on how fast
  this could ever load on a cold connection).
  Desktop is the 16:9 cut, mobile a separate 9:16 crop — only the
  active device's set is ever fetched, and a manifest.json in each
  folder (written once from the real file count, not hardcoded) tells
  the client how many frames exist. A matchMedia listener can switch
  the active set at runtime (e.g. rotating a phone across the 768px
  breakpoint) without a full remount.

  Frames decode via createImageBitmap when available (cheaper to draw,
  decoded off the main thread) with a plain <img> fallback. The first
  frame loads and paints before anything else; the rest load in the
  background, always prioritised by distance from wherever the user is
  currently scrolled, so a frame that's already loaded is always what's
  on screen (no blank canvas) even if the exact target frame hasn't
  arrived yet.

  A decoded frame is a full-resolution raw bitmap (~8MB each for these
  sources), so caching all 348 forever can hold up to ~2.7GB — that's
  what made scrubbing "everywhere sluggish", not just slow to start.
  Two fixes, neither touching the frame files themselves (the source
  WebPs stay exactly as provided, full 1920x1080/1080x1920 quality):

  1. Frames decode at the resolution they'll actually be shown at, not
  their full source resolution. drawFrame below does a "cover" fit —
  scale = max(canvasW/frameW, canvasH/frameH) — so anything decoded
  above that scale is thrown away at draw time and only ever cost
  memory and CPU. decodeFrame computes that same scale up front and
  passes resizeWidth/resizeHeight to createImageBitmap when it's <1,
  so the decoded bitmap is never bigger than what will hit the screen.
  On a retina display the source is already smaller than the canvas
  (scale clamps to 1, no resize — same as before). On a typical 1x
  phone or laptop this alone cuts decoded size 50-80%. The frame that's
  fetched over the network is always the full untouched file either
  way — only the in-memory decode target changes.

  2. The resident cache is capped (CACHE_CAP) and evicted LRU — by
  when a frame was last actually on screen or about to be, not by its
  distance from the current index. A distance-based window was tried
  twice before and reverted both times: it evicts anything past N
  frames from the *current* position regardless of how recently it was
  shown, so a fast up-down-up-down swing that had just rendered a frame
  46 frames back finds it already evicted and stutters refetching it.
  LRU doesn't have that failure mode — a frame shown a moment ago has a
  fresh timestamp and survives, no matter how far the current index has
  since moved, so reversals near wherever the user actually is stay
  smooth. Eviction only reaches frames that genuinely haven't been
  needed in a while. See evictLRU()/touch() below.

  The background loader (preloadAll) also only fetches a window around
  the current target (PRELOAD_RANGE either side) instead of blasting
  the full 90MB sequence the instant the section comes near view —
  that upfront network+decode burst was its own source of jank,
  independent of the cache size question above.

  The whole cache is still released once the user has scrolled well
  past the section (see the nearViewport handling in loop()), reloading
  fresh if they scroll back.

  The enter/leave windows below are mapped to what the footage actually
  shows at each point in the timeline (0–1, resolution-independent —
  verified frame-by-frame, not evenly guessed):
    0.00–0.19  laptop, glowing double-heart, a hand reaching to it
    0.21–0.44  a floating network of vetted profiles (locks + people)
    0.46–0.60  a heart split circuit/leaf held by two hands,
               dissolving into a bright burst of light
    0.62–0.77  a ring placed on a finger, hands parting in light
    0.79–0.88  joined hands holding a sustained spark of light
    0.90–1.00  a couple, backlit, arriving at a candlelit altar

  Captions sit in a small translucent (frosted, blurred) card, fixed at
  the bottom, scaling from a compact mobile size up to a fuller band on
  larger screens.

  Smoothness: this used to run its own lerp (progress eased toward the
  scroll target every frame) on the theory that a raw wheel notch
  (~100px) would otherwise jump 2-3 frames and look steppy. But Lenis
  (smooth-scroll.tsx) is active globally and already animates
  window.scrollY continuously toward the accumulated wheel/touch
  target every frame — so scrollY arriving here is already smoothed
  once. Adding a second lerp on top of an already-eased input doesn't
  smooth anything further; it just compounds lag, which is what made
  this section feel laggy/disconnected from the scroll input rather
  than "steppy". Read scrollY straight through instead — one smoothing
  pass (Lenis's), not two.
*/

const BASE_PATH = "/scrollytelling/hero";
type DeviceKind = "desktop" | "mobile";
type Frame = ImageBitmap | HTMLImageElement;

// fixed dimensions of the provided source frames — used to compute how
// much a frame can be decoded down to without ever going below what
// the "cover" fit in drawFrame will actually display.
const SOURCE_DIMS: Record<DeviceKind, { w: number; h: number }> = {
  desktop: { w: 1920, h: 1080 },
  mobile: { w: 1080, h: 1920 },
};

// resident decoded-frame cap (LRU-evicted, see touch()/evictLRU below)
// and how far either side of the current target the background loader
// keeps fetched. Both bound memory/network without ever touching the
// source files.
const CACHE_CAP = 120;
const PRELOAD_RANGE = 60;

const frameWidth = (f: Frame) => ("naturalWidth" in f ? f.naturalWidth || f.width : f.width);
const frameHeight = (f: Frame) => ("naturalHeight" in f ? f.naturalHeight || f.height : f.height);

const steps = [
  {
    n: "01",
    title: "Discovery",
    line: "It starts with one quiet click.",
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
    enter: 0.03,
    leave: 0.19,
    final: false,
  },
  {
    n: "02",
    title: "The circle",
    line: "Private, vetted, never browsed.",
    tag: "VETTED BY HAND · NEVER BROWSED",
    enter: 0.21,
    leave: 0.44,
    final: false,
  },
  {
    n: "03",
    title: "The match",
    line: "Heritage and heart, made whole.",
    tag: "HERITAGE & VALUES CONSIDERED",
    enter: 0.46,
    leave: 0.6,
    final: false,
  },
  {
    n: "04",
    title: "The proposal",
    line: "You decide, freely.",
    tag: "YOUR DECISION, ALWAYS",
    enter: 0.62,
    leave: 0.77,
    final: false,
  },
  {
    n: "05",
    title: "Hand in hand",
    line: "From strangers to promised, quietly.",
    tag: "AT YOUR OWN, QUIET PACE",
    enter: 0.79,
    leave: 0.88,
    final: false,
  },
  {
    n: "06",
    title: "The altar",
    line: "One ring. One introduction. One yes.",
    tag: "ONE INTRODUCTION, DONE RIGHT",
    enter: 0.9,
    leave: 1.02,
    final: true,
  },
] as const;

const CLOSING_TAGS = [
  {
    label: "Private by design",
    d: "M6.5 11.5h11a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 21v-8a1.5 1.5 0 011.5-1.5z M8.5 11.5V8a3.5 3.5 0 017 0v3.5",
  },
  {
    label: "Human reviewed",
    d: "M12 3l7 3v5c0 4.6-3 7.9-7 10-4-2.1-7-5.4-7-10V6l7-3z M9 12.2l2 2 4-4.2",
  },
  {
    label: "Intent focused",
    d: "M12 20.5s-7-4.4-9.3-8.8C1.2 8 2.4 5 5.6 4.3 8 3.8 10 5 12 7.4 14 5 16 3.8 18.4 4.3 21.6 5 22.8 8 21.3 11.2 19 15.6 12 20.5 12 20.5z",
  },
  {
    label: "Meaningful introductions",
    d: "M8.5 8a2.6 2.6 0 100-5.2A2.6 2.6 0 008.5 8z M15.5 8a2.6 2.6 0 100-5.2A2.6 2.6 0 0015.5 8z M3.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5 M10.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5",
  },
] as const;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barFillRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const entryFadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsBitmap = typeof createImageBitmap === "function";

    let cancelled = false;
    let device: DeviceKind = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    let generation = 0; // bumped on device switch; invalidates in-flight loads from the old set
    let frameCount = 0;
    let cache: (Frame | undefined)[] = [];
    let residentCount = 0;
    let tick = 0;
    let lastAccess: number[] = []; // per-index tick of last time it was shown/queued — drives LRU eviction
    const inFlight = new Set<number>();
    let lastDrawnIndex = -1;
    let currentTargetIndex = 0;
    let lastAppliedP = -1; // guards the caption/bar/counter writes below against redundant re-application when scroll hasn't moved
    let rafId = 0;
    let released = false; // whole cache freed after leaving the section

    const touch = (i: number) => {
      lastAccess[i] = ++tick;
    };

    // evict the least-recently-shown resident frames until back at cap.
    // O(frameCount) per call, but only runs when a new frame pushes the
    // cache over the cap — not on every animation frame.
    const evictLRU = () => {
      while (residentCount > CACHE_CAP) {
        let oldestIdx = -1;
        let oldestTick = Infinity;
        for (let i = 0; i < cache.length; i++) {
          if (cache[i] && (lastAccess[i] ?? -1) < oldestTick) {
            oldestTick = lastAccess[i] ?? -1;
            oldestIdx = i;
          }
        }
        if (oldestIdx === -1) break;
        const frame = cache[oldestIdx];
        if (frame && "close" in frame) frame.close();
        cache[oldestIdx] = undefined;
        residentCount--;
      }
    };

    const framePath = (dev: DeviceKind, i: number) => `${BASE_PATH}/${dev}/frame_${String(i + 1).padStart(5, "0")}.webp`;

    const decodeFrame = async (dev: DeviceKind, i: number): Promise<Frame | undefined> => {
      const src = framePath(dev, i);
      if (supportsBitmap) {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          // never decode above what drawFrame's cover-fit will actually
          // display: same scale formula as drawFrame, so this is a
          // strict no-op (native decode) whenever the canvas is bigger
          // than the source (retina displays), and only ever trims
          // pixels that would've been thrown away at draw time anyway.
          const source = SOURCE_DIMS[dev];
          const cw = canvas.width || source.w;
          const ch = canvas.height || source.h;
          const scale = Math.min(1, Math.max(cw / source.w, ch / source.h));
          if (scale < 1) {
            const resizeWidth = Math.max(1, Math.round(source.w * scale));
            const resizeHeight = Math.max(1, Math.round(source.h * scale));
            try {
              return await createImageBitmap(blob, { resizeWidth, resizeHeight, resizeQuality: "high" });
            } catch {
              // some browsers may reject the resize dict; fall back to a native decode
              return await createImageBitmap(blob);
            }
          }
          return await createImageBitmap(blob);
        } catch {
          // fall through to the <img> path below
        }
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(undefined);
        img.src = src;
      });
    };

    // a frame whose fetch/decode fails (transient network error, a
    // genuinely missing file, anything) must not be retried forever —
    // without this, preloadAll's "missing" scan would re-queue it every
    // single pass since it's neither cached nor in flight, hammering the
    // network and burning CPU in an infinite loop for as long as the
    // section is mounted. Give up on a frame after a few attempts.
    const MAX_FRAME_RETRIES = 3;
    const failCount = new Map<number, number>();

    const ensureFrame = (dev: DeviceKind, i: number, gen: number): Promise<void> => {
      if (cache[i] || inFlight.has(i)) {
        if (cache[i]) touch(i);
        return Promise.resolve();
      }
      if ((failCount.get(i) ?? 0) >= MAX_FRAME_RETRIES) return Promise.resolve();
      inFlight.add(i);
      return decodeFrame(dev, i).then((frame) => {
        inFlight.delete(i);
        if (cancelled || gen !== generation) return; // stale: device changed mid-flight
        if (frame) {
          cache[i] = frame;
          residentCount++;
          touch(i);
          failCount.delete(i);
          evictLRU();
        } else {
          failCount.set(i, (failCount.get(i) ?? 0) + 1);
        }
      });
    };

    // background loader: keeps a PRELOAD_RANGE-wide band around the
    // current scroll target fetched, re-centring continuously as the
    // target moves. Bounded rather than the whole 348-frame sequence —
    // fetching all ~90MB the instant the section comes near view was
    // its own source of jank, on top of the memory question the LRU
    // cap above already handles. Missing frames within the band are
    // always fetched nearest-first, so reversals resolve as fast as
    // possible.
    const preloadAll = async (dev: DeviceKind, gen: number, total: number) => {
      const CONCURRENCY = 8;
      while (!cancelled && gen === generation) {
        const lo = Math.max(0, currentTargetIndex - PRELOAD_RANGE);
        const hi = Math.min(total - 1, currentTargetIndex + PRELOAD_RANGE);
        const missing: number[] = [];
        for (let i = lo; i <= hi; i++) {
          if (!cache[i] && !inFlight.has(i) && (failCount.get(i) ?? 0) < MAX_FRAME_RETRIES) missing.push(i);
        }
        if (missing.length === 0) {
          await new Promise((r) => setTimeout(r, 120));
          continue;
        }
        missing.sort((a, b) => Math.abs(a - currentTargetIndex) - Math.abs(b - currentTargetIndex));
        await Promise.all(missing.slice(0, CONCURRENCY).map((i) => ensureFrame(dev, i, gen)));
      }
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };

    const drawFrame = (index: number) => {
      const frame = cache[index];
      if (!frame) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = frameWidth(frame);
      const ih = frameHeight(frame);
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.fillStyle = "oklch(0.16 0.025 45)"; // --ink-background, exact site token
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawnIndex = index;
      touch(index);
    };

    // getBoundingClientRect()/offsetTop force the browser to run layout
    // if anything on the page has pending style changes — calling that
    // every animation frame during a fast scroll, while framer-motion is
    // simultaneously writing styles for whileInView reveals elsewhere on
    // the page, is textbook layout thrashing and was the real source of
    // the jank. Cache the container's position/height once (recomputed
    // only on resize, not every frame) and drive the per-frame math off
    // window.scrollY instead, which never forces layout.
    let containerTop = 0;
    let containerHeight = 0;
    const measureContainer = () => {
      const rect = container.getBoundingClientRect();
      containerTop = rect.top + window.scrollY;
      containerHeight = rect.height;
    };
    measureContainer();

    const targetProgress = () => {
      const top = containerTop - window.scrollY;
      const total = containerHeight - window.innerHeight;
      return Math.min(1, Math.max(0, -top / total));
    };

    const applyProgress = (p: number, gen: number) => {
      const index = Math.min(Math.round(p * (frameCount - 1)), frameCount - 1);
      currentTargetIndex = index;
      if (cache[index]) {
        if (index !== lastDrawnIndex) {
          drawFrame(index);
        }
      } else {
        // keep showing whatever's already on screen; just make sure this
        // frame jumps the preload queue for next time
        ensureFrame(device, index, gen);
      }

      // everything below is a pure function of p — if scroll hasn't
      // actually moved since the last tick (the common case whenever
      // the loop is spinning but the user isn't actively scrolling),
      // skip re-writing identical values into the DOM every frame.
      if (p === lastAppliedP) return;
      lastAppliedP = p;

      // this section sits between two of the site's cream-background
      // sections (Statement above, Pledges below); a hard cut straight
      // into full-screen dark footage read as a pasted-in clip rather
      // than part of the page. Fading from the site's own cream token
      // right at the very start, and dissolving into it right at the
      // very end, makes the boundary feel intentional instead of a cut
      // — without touching the footage itself, just the site's own UI.
      if (entryFadeRef.current) entryFadeRef.current.style.opacity = String(1 - smoothstep(Math.min(p / 0.06, 1)));

      const fade = 0.045;
      let activeIdx = 0;
      steps.forEach((step, i) => {
        const el = captionRefs.current[i];
        let opacity = 0;
        if (p >= step.enter - fade && p <= step.enter) opacity = smoothstep((p - (step.enter - fade)) / fade);
        else if (p > step.enter && p < step.leave) opacity = 1;
        else if (p >= step.leave && p <= step.leave + fade) opacity = 1 - smoothstep((p - step.leave) / fade);
        if (el) {
          el.style.opacity = String(opacity);
          el.style.transform = `translateY(${(1 - opacity) * 14}px)`;
          el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        }
        if (p >= step.enter - fade && p < step.leave + fade) activeIdx = i;
      });

      if (barFillRef.current) barFillRef.current.style.width = `${p * 100}%`;
      if (counterRef.current) counterRef.current.textContent = `${steps[activeIdx].n} / 06 — ${steps[activeIdx].title}`;
    };

    const loop = (gen: number) => {
      const top = containerTop - window.scrollY;
      const bottom = top + containerHeight;
      const nearViewport = top < window.innerHeight * 1.5 && bottom > -window.innerHeight * 0.5;
      if (nearViewport) {
        if (released) {
          // scrolled back in after being released — reload from scratch;
          // start() bumps the generation and schedules its own loop
          released = false;
          start(device);
          return;
        }
        applyProgress(targetProgress(), gen);
      } else if (!released && frameCount > 0) {
        // the user has moved well past this section — free every
        // resident frame (already capped at CACHE_CAP, but zero is
        // better than that for the rest of the page visit). Scrolling
        // back triggers a fresh load above.
        released = true;
        for (const frame of cache) {
          if (frame && "close" in frame) frame.close();
        }
        cache = [];
        residentCount = 0;
        lastAccess = [];
        inFlight.clear();
        failCount.clear();
        lastDrawnIndex = -1;
      }
      if (gen === generation) rafId = requestAnimationFrame(() => loop(gen));
    };

    const onResize = () => {
      sizeCanvas();
      measureContainer();
      if (lastDrawnIndex >= 0) drawFrame(lastDrawnIndex);
    };
    sizeCanvas();
    window.addEventListener("resize", onResize);

    // starts (or restarts, on a device switch) the whole pipeline for
    // whichever set is currently active
    const start = async (dev: DeviceKind) => {
      const gen = ++generation;
      cache = [];
      residentCount = 0;
      lastAccess = [];
      inFlight.clear();
      failCount.clear();
      lastDrawnIndex = -1;
      lastAppliedP = -1;
      frameCount = 0;

      const manifestPromise = fetch(`${BASE_PATH}/${dev}/manifest.json`)
        .then((res) => res.json())
        .catch(() => null);
      // frame 0's index doesn't depend on the manifest, so kick off its
      // fetch immediately instead of waiting on the manifest round-trip
      // first — that extra sequential RTT was delaying first paint,
      // especially noticeable on higher-latency mobile connections.
      const frame0Promise = ensureFrame(dev, 0, gen);

      let count = 1;
      const data = await manifestPromise;
      if (data && typeof data.count === "number" && data.count > 0) count = data.count;
      if (cancelled || gen !== generation) return;
      frameCount = count;

      if (reduce) {
        const lastIdx = frameCount - 1;
        await ensureFrame(dev, lastIdx, gen);
        if (cancelled || gen !== generation) return;
        if (cache[lastIdx]) drawFrame(lastIdx);
        captionRefs.current.forEach((el) => {
          if (el) el.style.opacity = "1";
        });
        return;
      }

      await frame0Promise;
      if (cancelled || gen !== generation) return;
      if (cache[0]) drawFrame(0);

      preloadAll(dev, gen, frameCount);

      applyProgress(targetProgress(), gen);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => loop(gen));
    };

    // this section sits well below the fold — fetching its frames
    // immediately on mount would compete with the hero's video/fonts for
    // bandwidth on the initial page load. Instead wait until the user is
    // actually approaching it before the pipeline starts.
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || cancelled) return;
        if (entries.some((e) => e.isIntersecting)) {
          started = true;
          io.disconnect();
          start(device);
        }
      },
      { rootMargin: "0px 0px 40% 0px" }
    );
    io.observe(container);

    // rotating a phone (or resizing past the breakpoint) switches the
    // active frame set safely: invalidate the old generation, drop its
    // cache, and restart the pipeline for the new device kind. If the
    // pipeline hasn't started yet, just record the new device — the
    // eventual intersection-triggered start() will pick it up.
    const deviceQuery = window.matchMedia("(max-width: 767px)");
    const onDeviceChange = () => {
      const next: DeviceKind = deviceQuery.matches ? "mobile" : "desktop";
      if (next === device) return;
      device = next;
      if (!started) return;
      cancelAnimationFrame(rafId);
      start(device);
    };
    deviceQuery.addEventListener("change", onDeviceChange);

    return () => {
      cancelled = true;
      generation++;
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      deviceQuery.removeEventListener("change", onDeviceChange);
      for (const frame of cache) {
        if (frame && "close" in frame) frame.close();
      }
    };
  }, []);

  return (
    <section id="journey" aria-label="The journey, step by step">
      <div ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

          {/* entry: a brief cream fade at the very start, echoing the
              cream Statement section just above, so the section feels
              like it emerges from the page rather than cutting into it.
              (No equivalent exit fade: the final caption stays on
              screen right through the end — that's the conversion
              moment — and washing the background toward cream while its
              dark card is still up would clash rather than help.) */}
          <div
            ref={entryFadeRef}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, oklch(0.975 0.012 85) 0%, transparent 55%)", opacity: 1 }}
          />

          {/* just enough scrim at the very bottom for the band to sit on;
              the footage stays otherwise untouched/undimmed. Uses the
              same ink-background token as the rest of the site's dark
              sections (Voices/Testimonials/CTA) so this reads as part
              of that family rather than its own isolated color. */}
          <div
            className="absolute inset-x-0 bottom-0 h-[45vh] pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 0%, oklch(0.16 0.025 45 / 0.5) 55%, oklch(0.16 0.025 45 / 0.85) 100%)" }}
          />

          {/* top progress bar: a thin gold line that fills across the
              full 600vh scroll, so "how far through" is always visible */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gold/15">
            <span
              ref={barFillRef}
              className="block h-full bg-gold-light"
              style={{ width: "0%" }}
            />
          </div>
          <div className="absolute top-4 right-5 lg:right-8">
            <span ref={counterRef} className="font-mono text-[10px] tracking-[0.18em] text-ink-foreground/70 whitespace-nowrap">
              01 / 06 — Discovery
            </span>
          </div>

          {/* caption card: small and translucent (frosted glass, like a
              macOS/iOS control-centre widget) on mobile, growing into a
              fuller band on larger screens. Legibility comes from the
              blur + tint combination, not from an opaque fill. */}
          {steps.map((step, i) => (
            <div
              key={step.n}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="absolute inset-x-0 bottom-0 transition-none"
              style={{ opacity: 0 }}
            >
              <div className="mx-auto max-w-5xl px-4 pb-5 sm:px-6 sm:pb-8 lg:px-16 lg:pb-14">
                <div
                  className="rounded-xl px-4 py-3.5 sm:rounded-2xl sm:px-6 sm:py-5 lg:px-10 lg:py-8"
                  style={{
                    background: "oklch(0.16 0.025 45 / 0.55)",
                    backdropFilter: "blur(24px) saturate(140%)",
                    WebkitBackdropFilter: "blur(24px) saturate(140%)",
                    border: "1px solid rgba(184,134,62,0.28)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="flex flex-col gap-2.5 sm:gap-4 lg:flex-row lg:items-end lg:gap-10">
                    <div className="flex shrink-0 items-baseline gap-2 sm:gap-3 lg:w-24 lg:flex-col lg:items-start lg:gap-1">
                      <span className="font-display text-2xl leading-none text-gold-light sm:text-4xl lg:text-6xl">
                        {step.n}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.2em] text-ink-foreground/40 sm:text-[10px]">/ 06</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 font-display text-lg leading-tight text-ink-foreground sm:mb-2 sm:text-2xl lg:text-4xl">
                        {step.title}
                      </h3>
                      <p className="mb-1.5 text-xs text-ink-foreground sm:mb-3 sm:text-base lg:text-lg">{step.line}</p>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-gold-light sm:gap-2 sm:text-[10px] sm:tracking-[0.15em]">
                        <span>✦</span>
                        {step.tag}
                      </span>
                    </div>
                    {!step.final && (
                      <a
                        href="#contact"
                        className="hidden shrink-0 items-center justify-center self-end rounded-full bg-ink-foreground px-6 h-11 text-sm font-medium text-ink-background transition-colors hover:bg-white lg:inline-flex"
                      >
                        Private enquiry
                      </a>
                    )}
                  </div>

                  {step.final && (
                    <>
                      <div className="mt-3 sm:mt-6">
                        <a
                          href="#contact"
                          className="inline-flex h-9 items-center justify-center rounded-full bg-ink-foreground px-5 text-xs font-medium text-ink-background transition-colors hover:bg-white sm:h-12 sm:px-8 sm:text-sm"
                        >
                          Begin privately
                        </a>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-border pt-3 sm:mt-6 sm:gap-4 sm:pt-6 sm:grid-cols-4">
                        {CLOSING_TAGS.map((t) => (
                          <div key={t.label} className="flex flex-col items-center gap-1 text-center sm:gap-2">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3 w-3 text-gold-light sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.4}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d={t.d} />
                            </svg>
                            <span className="max-w-[100px] text-[8px] leading-tight text-ink-foreground/60 sm:text-[10px]">{t.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
