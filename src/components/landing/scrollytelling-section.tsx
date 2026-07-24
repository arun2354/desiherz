import { useEffect, useRef } from "react";

/*
  Scrollytelling: a 600vh container with a sticky full-viewport canvas.
  Scroll progress scrubs a 100-frame JPEG sequence drawn to canvas
  (no decode latency, unlike seeking a real <video>), while six short
  captions fade through their own progress windows.

  Smoothness: a mouse wheel moves ~100px per notch, so mapping frames
  directly to scrollY jumps 2-3 frames per notch and looks steppy.
  Instead a continuous rAF loop eases displayed progress toward the
  scroll target (critically-damped lerp), so every notch plays the
  in-between frames. Frames preload through a small concurrent pool
  rather than one-by-one.
*/
const FRAME_COUNT = 100;
const framePath = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

const steps = [
  {
    n: "01",
    title: "Discovery",
    line: "It starts with one quiet click.",
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
    enter: 0.03,
    leave: 0.16,
    side: "left",
  },
  {
    n: "02",
    title: "The circle",
    line: "Private, vetted, never browsed.",
    tag: "VETTED BY HAND · NEVER BROWSED",
    enter: 0.2,
    leave: 0.33,
    side: "right",
  },
  {
    n: "03",
    title: "The match",
    line: "Heritage and heart, made whole.",
    tag: "HERITAGE & VALUES CONSIDERED",
    enter: 0.37,
    leave: 0.5,
    side: "left",
  },
  {
    n: "04",
    title: "The proposal",
    line: "You decide, freely.",
    tag: "YOUR DECISION, ALWAYS",
    enter: 0.54,
    leave: 0.67,
    side: "right",
  },
  {
    n: "05",
    title: "Hand in hand",
    line: "From strangers to promised, quietly.",
    tag: "AT YOUR OWN, QUIET PACE",
    enter: 0.71,
    leave: 0.84,
    side: "left",
  },
  {
    n: "06",
    title: "The altar",
    line: "One ring. One introduction. One yes.",
    tag: "ONE INTRODUCTION, DONE RIGHT",
    enter: 0.88,
    leave: 1.01,
    side: "center",
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

export function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        img.src = framePath(i);
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

      const fade = 0.03;
      steps.forEach((step, i) => {
        const el = captionRefs.current[i];
        const dot = dotRefs.current[i];
        if (!el) return;
        let opacity = 0;
        if (p >= step.enter - fade && p <= step.enter) opacity = (p - (step.enter - fade)) / fade;
        else if (p > step.enter && p < step.leave) opacity = 1;
        else if (p >= step.leave && p <= step.leave + fade) opacity = 1 - (p - step.leave) / fade;
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 24}px)`;
        el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        if (dot) {
          const active = p >= step.enter - fade && p < step.leave + fade;
          dot.style.background = active ? "#d9a760" : "rgba(245,233,220,0.2)";
          dot.style.transform = active ? "scale(1.6)" : "scale(1)";
        }
      });
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

          {/* Apple-style translucent overlay: directional scrim for edge
              legibility + a soft ambient gold/rose wash, matching the rest
              of the site's ambient-gradient language */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,12,8,0.55) 0%, rgba(20,12,8,0.12) 32%, rgba(20,12,8,0.12) 68%, rgba(20,12,8,0.6) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(45% 40% at 15% 20%, rgba(194,103,157,0.16), transparent 70%), radial-gradient(40% 35% at 85% 15%, rgba(217,167,96,0.18), transparent 70%), radial-gradient(55% 45% at 50% 100%, rgba(217,167,96,0.12), transparent 72%)",
            }}
          />

          {/* captions, each floating on a frosted glass card over the footage */}
          {steps.map((step, i) => (
            <div
              key={step.n}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className={`absolute top-1/2 -translate-y-1/2 max-w-md px-6 lg:px-0 transition-none ${
                step.side === "left"
                  ? "left-6 lg:left-24 text-left"
                  : step.side === "right"
                    ? "right-6 lg:right-24 text-right"
                    : "left-1/2 -translate-x-1/2 text-center"
              }`}
              style={{ opacity: 0 }}
            >
              <div className="glass-panel rounded-2xl px-7 py-8 lg:px-9 lg:py-10">
                <span className="font-mono text-sm uppercase tracking-[0.25em] text-[#d9a760] block mb-4">
                  {step.n}
                </span>
                <h3 className="font-display text-4xl lg:text-6xl text-[#f5e9dc] leading-[1.05] mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-[#e9cfae]/85 mb-5">{step.line}</p>
                <span
                  className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#e9cfae]/55 ${
                    step.side === "center" ? "justify-center" : ""
                  }`}
                >
                  <span className="text-[#d9a760]">✦</span>
                  {step.tag}
                </span>

                {step.side === "center" && (
                  <>
                    <div className="mt-8">
                      <a
                        href="#contact"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#f5e9dc] text-[#140c08] text-sm font-medium hover:bg-white transition-colors"
                      >
                        Begin privately
                      </a>
                    </div>
                    <div className="mt-8 grid grid-cols-4 gap-4 pt-6 border-t border-[#e9cfae]/15">
                      {CLOSING_TAGS.map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-2">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 lg:w-5 lg:h-5 text-[#d9a760]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d={t.d} />
                          </svg>
                          <span className="text-[9px] lg:text-[10px] leading-tight text-[#e9cfae]/60 max-w-[68px]">
                            {t.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* step dots */}
          <div className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e9cfae]/15 to-transparent"
            />
            {steps.map((step, i) => (
              <span
                key={step.n}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: "rgba(245,233,220,0.2)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
