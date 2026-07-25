import { useEffect, useRef } from "react";

/*
  Scrollytelling: a 600vh container with a sticky full-viewport canvas.
  Scroll progress scrubs a 100-frame JPEG sequence drawn to canvas
  (no decode latency, unlike seeking a real <video>), while a caption
  band fades through six progress windows. Frames are extracted from
  the client's own footage (public/videos/journey.mp4 / journey-mobile
  .mp4) — desktop and mobile get their own frame set (/frames vs
  /frames-mobile) since the mobile source is a separate portrait crop,
  not just a resize.

  The enter/leave windows below are mapped to what the footage actually
  shows at each frame (verified frame-by-frame), not evenly guessed:
    frames  1–19  laptop, glowing double-heart, a hand reaching to it
    frames 20–44  a floating network of vetted profiles (locks + people)
    frames 45–60  a heart split circuit/leaf held by two hands,
                  dissolving into a bright burst of light
    frames 61–77  a ring placed on a finger, hands parting in light
    frames 78–88  joined hands holding a sustained spark of light
    frames 89–100 a couple, backlit, arriving at a candlelit altar

  Captions sit in a fixed, solid lower-third band rather than a
  translucent floating card — legibility over unpredictable footage
  matters more than a glassy look, so the band background is a
  near-opaque dark fill, not a frosted see-through one.

  Smoothness: a mouse wheel moves ~100px per notch, so mapping frames
  directly to scrollY jumps 2-3 frames per notch and looks steppy.
  Instead a continuous rAF loop eases displayed progress toward the
  scroll target (critically-damped lerp), so every notch plays the
  in-between frames. Frames preload through a small concurrent pool
  rather than one-by-one.
*/
const FRAME_COUNT = 100;
const framePath = (i: number, mobile: boolean) =>
  `${mobile ? "/frames-mobile" : "/frames"}/frame_${String(i + 1).padStart(4, "0")}.jpg`;

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

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // <source media> selection is unreliable for this kind of runtime pick —
    // decide once, in JS, same as the hero background loop does.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    let currentFrame = -1;
    let eased = 0;
    let rafId = 0;
    let cancelled = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const drawFrame = (index: number) => {
      const img = frames[index];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.fillStyle = "#140c08";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          frames[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = framePath(i, isMobile);
      });

    // concurrent preload pool: keeps 8 requests in flight, in order
    const preloadAll = async () => {
      const CONCURRENCY = 8;
      let next = 0;
      const worker = async () => {
        while (next < FRAME_COUNT && !cancelled) {
          const i = next++;
          await loadFrame(i);
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    };

    const targetProgress = () => {
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      return Math.min(1, Math.max(0, -rect.top / total));
    };

    const applyProgress = (p: number) => {
      const index = Math.min(Math.floor(p * FRAME_COUNT), FRAME_COUNT - 1);
      if (index !== currentFrame) {
        currentFrame = index;
        drawFrame(index);
      }

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

    const loop = () => {
      const rect = container.getBoundingClientRect();
      const nearViewport = rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5;
      if (nearViewport) {
        const target = targetProgress();
        eased += (target - eased) * 0.12;
        if (Math.abs(target - eased) < 0.0004) eased = target;
        applyProgress(eased);
      }
      rafId = requestAnimationFrame(loop);
    };

    sizeCanvas();
    const onResize = () => {
      sizeCanvas();
      if (currentFrame >= 0) drawFrame(currentFrame);
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      // no scrubbing: show the final frame and all captions statically
      loadFrame(FRAME_COUNT - 1).then(() => {
        if (cancelled) return;
        currentFrame = FRAME_COUNT - 1;
        drawFrame(currentFrame);
      });
      captionRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
    } else {
      loadFrame(0).then(() => {
        if (cancelled) return;
        eased = targetProgress();
        currentFrame = -1;
        applyProgress(eased);
        preloadAll();
      });
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="journey" aria-label="The journey, step by step">
      <div ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

          {/* just enough scrim at the very bottom for the band to sit on;
              the footage stays otherwise untouched/undimmed */}
          <div
            className="absolute inset-x-0 bottom-0 h-[45vh] pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(15,9,6,0.5) 55%, rgba(15,9,6,0.85) 100%)" }}
          />

          {/* top progress bar: a thin gold line that fills across the
              full 600vh scroll, so "how far through" is always visible */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#e9cfae]/10">
            <span
              ref={barFillRef}
              className="block h-full bg-[#d9a760]"
              style={{ width: "0%" }}
            />
          </div>
          <div className="absolute top-4 right-5 lg:right-8">
            <span ref={counterRef} className="font-mono text-[10px] tracking-[0.18em] text-[#f5e9dc]/70 whitespace-nowrap">
              01 / 06 — Discovery
            </span>
          </div>

          {/* caption band: solid, high-contrast, fixed at the bottom —
              legible over any frame, not a translucent floating card */}
          {steps.map((step, i) => (
            <div
              key={step.n}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="absolute inset-x-0 bottom-0 transition-none"
              style={{ opacity: 0 }}
            >
              <div className="mx-auto max-w-5xl px-6 pb-10 lg:px-16 lg:pb-14">
                <div
                  className="rounded-2xl px-6 py-6 lg:px-10 lg:py-8"
                  style={{
                    background: "rgba(15,9,6,0.92)",
                    borderTop: "2px solid #d9a760",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-10">
                    <div className="flex shrink-0 items-baseline gap-3 lg:w-24 lg:flex-col lg:items-start lg:gap-1">
                      <span className="font-display text-5xl leading-none text-[#d9a760] lg:text-6xl">{step.n}</span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">/ 06</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 font-display text-3xl leading-tight text-white lg:text-4xl">{step.title}</h3>
                      <p className="mb-3 text-base text-[#f5e9dc] lg:text-lg">{step.line}</p>
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-[#d9a760]">
                        <span>✦</span>
                        {step.tag}
                      </span>
                    </div>
                    {!step.final && (
                      <a
                        href="#contact"
                        className="hidden shrink-0 items-center justify-center self-end rounded-full bg-[#f5e9dc] px-6 h-11 text-sm font-medium text-[#140c08] transition-colors hover:bg-white lg:inline-flex"
                      >
                        Private enquiry
                      </a>
                    )}
                  </div>

                  {step.final && (
                    <>
                      <div className="mt-6">
                        <a
                          href="#contact"
                          className="inline-flex h-12 items-center justify-center rounded-full bg-[#f5e9dc] px-8 text-sm font-medium text-[#140c08] transition-colors hover:bg-white"
                        >
                          Begin privately
                        </a>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
                        {CLOSING_TAGS.map((t) => (
                          <div key={t.label} className="flex flex-col items-center gap-2 text-center">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4 text-[#d9a760] lg:h-5 lg:w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.4}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d={t.d} />
                            </svg>
                            <span className="max-w-[100px] text-[10px] leading-tight text-white/60">{t.label}</span>
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
