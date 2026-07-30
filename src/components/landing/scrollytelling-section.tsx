import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/use-locale";

type DeviceKind = "desktop" | "mobile";

const stepTimings = [
  { n: "01", enter: 0.03, leave: 0.19, final: false },
  { n: "02", enter: 0.21, leave: 0.44, final: false },
  { n: "03", enter: 0.46, leave: 0.6, final: false },
  { n: "04", enter: 0.62, leave: 0.77, final: false },
  { n: "05", enter: 0.79, leave: 0.88, final: false },
  { n: "06", enter: 0.9, leave: 1.02, final: true },
] as const;

const stepCopy = {
  en: [
    {
      title: "Discovery",
      line: "It starts with one quiet click.",
      tag: "100% PRIVATE · NO PUBLIC PROFILES",
    },
    {
      title: "The circle",
      line: "Private, vetted, never browsed.",
      tag: "VETTED BY HAND · NEVER BROWSED",
    },
    {
      title: "The match",
      line: "Heritage and heart, made whole.",
      tag: "HERITAGE & VALUES CONSIDERED",
    },
    { title: "The proposal", line: "You decide, freely.", tag: "YOUR DECISION, ALWAYS" },
    {
      title: "Hand in hand",
      line: "From strangers to promised, quietly.",
      tag: "AT YOUR OWN, QUIET PACE",
    },
    {
      title: "The altar",
      line: "One ring. One introduction. One yes.",
      tag: "ONE INTRODUCTION, DONE RIGHT",
    },
  ],
  de: [
    {
      title: "Entdeckung",
      line: "Es beginnt mit einem stillen Klick.",
      tag: "100% PRIVAT · KEINE ÖFFENTLICHEN PROFILE",
    },
    {
      title: "Der Kreis",
      line: "Privat, geprüft, niemals durchstöbert.",
      tag: "VON HAND GEPRÜFT · NIEMALS DURCHSTÖBERT",
    },
    {
      title: "Die Verbindung",
      line: "Herkunft und Herz, im Einklang.",
      tag: "HERKUNFT & WERTE BERÜCKSICHTIGT",
    },
    {
      title: "Der Antrag",
      line: "Sie entscheiden, frei.",
      tag: "IHRE ENTSCHEIDUNG, IMMER",
    },
    {
      title: "Hand in Hand",
      line: "Von Fremden zu Verbundenen, ganz in Ruhe.",
      tag: "IN IHREM EIGENEN TEMPO",
    },
    {
      title: "Der Altar",
      line: "Ein Ring. Eine Vorstellung. Ein Ja.",
      tag: "EINE VORSTELLUNG, DIE PASST",
    },
  ],
} as const;

const CLOSING_TAG_ICONS = [
  "M6.5 11.5h11a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 21v-8a1.5 1.5 0 011.5-1.5z M8.5 11.5V8a3.5 3.5 0 017 0v3.5",
  "M12 3l7 3v5c0 4.6-3 7.9-7 10-4-2.1-7-5.4-7-10V6l7-3z M9 12.2l2 2 4-4.2",
  "M12 20.5s-7-4.4-9.3-8.8C1.2 8 2.4 5 5.6 4.3 8 3.8 10 5 12 7.4 14 5 16 3.8 18.4 4.3 21.6 5 22.8 8 21.3 11.2 19 15.6 12 20.5 12 20.5z",
  "M8.5 8a2.6 2.6 0 100-5.2A2.6 2.6 0 008.5 8z M15.5 8a2.6 2.6 0 100-5.2A2.6 2.6 0 0015.5 8z M3.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5 M10.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5",
] as const;

const closingTagLabels = {
  en: ["Private by design", "Human reviewed", "Intent focused", "Meaningful introductions"],
  de: [
    "Privat von Grund auf",
    "Von Menschen geprüft",
    "Auf Ernsthaftigkeit fokussiert",
    "Bedeutungsvolle Vorstellungen",
  ],
} as const;

const finalCta = {
  en: "Begin privately",
  de: "Privat beginnen",
} as const;

const smoothstep = (value: number) => value * value * (3 - 2 * value);

export function ScrollytellingSection() {
  const locale = useLocale();
  const steps = stepTimings.map((timing, index) => ({
    ...timing,
    ...stepCopy[locale][index],
  }));
  const closingTags = CLOSING_TAG_ICONS.map((d, index) => ({
    d,
    label: closingTagLabels[locale][index],
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barFillRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const entryFadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deviceQuery = window.matchMedia("(max-width: 767px)");
    let device: DeviceKind = deviceQuery.matches ? "mobile" : "desktop";
    let duration = 0;
    let containerTop = 0;
    let containerHeight = 0;
    let rafId = 0;
    let lastProgress = -1;
    let desiredTime = 0;
    let mediaStarted = false;

    const sourceFor = (kind: DeviceKind) =>
      kind === "mobile" ? "/videos/journey-mobile.mp4" : "/videos/journey-desktop.mp4";

    const measure = () => {
      const rect = container.getBoundingClientRect();
      containerTop = rect.top + window.scrollY;
      containerHeight = rect.height;
    };

    const progress = () => {
      const total = Math.max(1, containerHeight - window.innerHeight);
      return Math.min(1, Math.max(0, (window.scrollY - containerTop) / total));
    };

    const updateCaptions = (value: number) => {
      const fade = 0.045;
      let activeIndex = 0;

      steps.forEach((step, index) => {
        const element = captionRefs.current[index];
        let opacity = 0;
        if (value >= step.enter - fade && value <= step.enter) {
          opacity = smoothstep((value - (step.enter - fade)) / fade);
        } else if (value > step.enter && value < step.leave) {
          opacity = 1;
        } else if (value >= step.leave && value <= step.leave + fade) {
          opacity = 1 - smoothstep((value - step.leave) / fade);
        }
        if (element) {
          element.style.opacity = String(opacity);
          element.style.transform = `translateY(${(1 - opacity) * 14}px)`;
          element.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        }
        if (value >= step.enter - fade && value < step.leave + fade) activeIndex = index;
      });

      if (entryFadeRef.current) {
        entryFadeRef.current.style.opacity = String(1 - smoothstep(Math.min(value / 0.06, 1)));
      }
      if (barFillRef.current) barFillRef.current.style.width = `${value * 100}%`;
      if (counterRef.current) {
        counterRef.current.textContent = `${steps[activeIndex].n} / 06 — ${steps[activeIndex].title}`;
      }
    };

    const render = () => {
      rafId = 0;
      const value = reducedMotion ? 1 : progress();
      if (Math.abs(value - lastProgress) < 0.0005) return;
      lastProgress = value;
      updateCaptions(value);

      if (duration > 0) {
        desiredTime = Math.min(duration - 0.04, value * duration);
        if (!video.seeking && Math.abs(video.currentTime - desiredTime) > 0.035) {
          video.currentTime = desiredTime;
        }
      }
    };

    const requestRender = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const loadMedia = () => {
      if (mediaStarted) return;
      mediaStarted = true;
      video.src = sourceFor(device);
      video.load();
    };

    const onMetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      desiredTime = progress() * duration;
      video.currentTime = Math.min(Math.max(0, duration - 0.04), desiredTime);

      // Prime iOS/Safari's decoder. The video remains scroll-controlled.
      void video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = desiredTime;
        })
        .catch(() => {
          video.currentTime = desiredTime;
        });
      requestRender();
    };

    const onDeviceChange = () => {
      const next: DeviceKind = deviceQuery.matches ? "mobile" : "desktop";
      if (next === device) return;
      device = next;
      duration = 0;
      lastProgress = -1;
      if (mediaStarted) {
        video.src = sourceFor(device);
        video.load();
      }
    };

    const onSeeked = () => {
      if (duration > 0 && Math.abs(video.currentTime - desiredTime) > 0.05) {
        video.currentTime = desiredTime;
      }
    };

    const onResize = () => {
      measure();
      requestRender();
    };

    measure();
    updateCaptions(reducedMotion ? 1 : progress());

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMedia();
          requestRender();
        }
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(container);
    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", onResize);
    deviceQuery.addEventListener("change", onDeviceChange);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", onResize);
      deviceQuery.removeEventListener("change", onDeviceChange);
    };
    // Language switching navigates and remounts the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="journey" aria-label="The journey, step by step">
      <div ref={containerRef} className="relative h-[480vh] sm:h-[520vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-ink-background">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/scrollytelling/hero/mobile/frame_00001.webp"
            />
            <img
              src="/scrollytelling/hero/desktop/frame_00001.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            ref={entryFadeRef}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #f7f0e5 0%, rgba(247,240,229,0.88) 18%, rgba(90,31,43,0.2) 58%, transparent 100%)",
              opacity: 1,
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(90,31,43,0.5) 52%, rgba(50,16,24,0.92) 100%)",
            }}
          />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gold/15">
            <span ref={barFillRef} className="block h-full bg-gold-light" style={{ width: "0%" }} />
          </div>
          <div className="absolute top-4 right-5 lg:right-8">
            <span
              ref={counterRef}
              className="whitespace-nowrap font-mono text-[10px] tracking-[0.18em] text-ink-foreground/70"
            >
              {steps[0].n} / 06 — {steps[0].title}
            </span>
          </div>

          {steps.map((step, index) => (
            <div
              key={step.n}
              ref={(element) => {
                captionRefs.current[index] = element;
              }}
              className="absolute inset-x-0 bottom-0 transition-none"
              style={{ opacity: 0 }}
            >
              <div className="mx-auto max-w-5xl px-4 pb-5 sm:px-6 sm:pb-8 lg:px-16 lg:pb-14">
                <div
                  className="scrolly-caption rounded-xl px-4 py-3.5 sm:rounded-2xl sm:px-6 sm:py-5 lg:px-10 lg:py-8"
                  style={{
                    background: "rgba(74, 21, 35, 0.72)",
                    backdropFilter: "blur(18px) saturate(125%)",
                    WebkitBackdropFilter: "blur(18px) saturate(125%)",
                    border: "1px solid rgba(194,155,92,0.34)",
                    boxShadow: "0 16px 40px rgba(42,12,20,0.42)",
                  }}
                >
                  <div className="flex flex-col gap-2.5 sm:gap-4 lg:flex-row lg:items-end lg:gap-10">
                    <div className="flex shrink-0 items-baseline gap-2 sm:gap-3 lg:w-24 lg:flex-col lg:items-start lg:gap-1">
                      <span className="font-display text-2xl leading-none text-gold-light sm:text-4xl lg:text-6xl">
                        {step.n}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.2em] text-ink-foreground/40 sm:text-[10px]">
                        / 06
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 font-display text-lg leading-tight text-ink-foreground sm:mb-2 sm:text-2xl lg:text-4xl">
                        {step.title}
                      </h3>
                      <p className="mb-1.5 text-xs text-ink-foreground sm:mb-3 sm:text-base lg:text-lg">
                        {step.line}
                      </p>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-gold-light sm:gap-2 sm:text-[10px] sm:tracking-[0.15em]">
                        <span>✦</span>
                        {step.tag}
                      </span>
                    </div>
                  </div>

                  {step.final && (
                    <>
                      <div className="mt-3 sm:mt-6">
                        <a
                          href="#contact"
                          className="inline-flex h-9 items-center justify-center rounded-full bg-ink-foreground px-5 text-xs font-medium text-ink-background transition-colors hover:bg-white sm:h-12 sm:px-8 sm:text-sm"
                        >
                          {finalCta[locale]}
                        </a>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-border pt-3 sm:mt-6 sm:grid-cols-4 sm:gap-4 sm:pt-6">
                        {closingTags.map((tag) => (
                          <div
                            key={tag.label}
                            className="flex flex-col items-center gap-1 text-center sm:gap-2"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3 w-3 text-gold-light sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.4}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d={tag.d} />
                            </svg>
                            <span className="max-w-[100px] text-[8px] leading-tight text-ink-foreground/60 sm:text-[10px]">
                              {tag.label}
                            </span>
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
