import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";

const words = ["reconsidered.", "rediscovered.", "made real.", "well matched."];

function BlurWord({ word, trigger }: { word: string; trigger: number }) {
  const letters = word.split("");
  const STAGGER = 45;
  const DURATION = 500;
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 200;

  const [letterStates, setLetterStates] = useState<{ opacity: number; blur: number }[]>(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );
  const [showGradient, setShowGradient] = useState(true);
  const framesRef = useRef<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];

    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));
    setShowGradient(true);

    letters.forEach((_, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setLetterStates((prev) => {
            const next = [...prev];
            next[i] = { opacity: eased, blur: 20 * (1 - eased) };
            return next;
          });
          if (progress < 1) framesRef.current.push(requestAnimationFrame(tick));
        };
        framesRef.current.push(requestAnimationFrame(tick));
      }, i * STAGGER);
      timersRef.current.push(t);
    });

    const gt = setTimeout(() => setShowGradient(false), GRADIENT_HOLD);
    timersRef.current.push(gt);

    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // warm rose → gold sweep, settling to champagne
  const gradientColors = ["#f3d6c3", "#eca8d6", "#d9a760", "#f0c987", "#f3d6c3"];
  const hex2rgb = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  return (
    <>
      {letters.map((char, i) => {
        const colorIndex = (i / Math.max(letters.length - 1, 1)) * (gradientColors.length - 1);
        const lower = Math.floor(colorIndex);
        const upper = Math.min(lower + 1, gradientColors.length - 1);
        const t = colorIndex - lower;
        const [r1, g1, b1] = hex2rgb(gradientColors[lower]);
        const [r2, g2, b2] = hex2rgb(gradientColors[upper]);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: letterStates[i]?.opacity ?? 0,
              filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
              color: showGradient ? `rgb(${r},${g},${b})` : "#f5e9dc",
              transition: "color 0.4s ease",
            }}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </>
  );
}

/** Quiet line-art ornament — concentric circles around interlocked rings. */
function HeroOrnament() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] lg:w-[600px] lg:h-[600px] opacity-[0.14] pointer-events-none hidden md:block"
    >
      <defs>
        <linearGradient id="orn-grad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#eca8d6" />
          <stop offset="0.5" stopColor="#d9a760" />
          <stop offset="1" stopColor="#eca8d6" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="118" stroke="url(#orn-grad)" strokeWidth="0.8" />
      <circle cx="200" cy="200" r="160" stroke="url(#orn-grad)" strokeWidth="0.7" />
      <circle cx="200" cy="200" r="196" stroke="url(#orn-grad)" strokeWidth="0.5" />
      {/* interlocked rings at the centre */}
      <circle cx="178" cy="200" r="42" stroke="url(#orn-grad)" strokeWidth="1.6" />
      <circle cx="222" cy="200" r="42" stroke="url(#orn-grad)" strokeWidth="1.6" />
    </svg>
  );
}

const stats = [
  { value: "0", label: "public profiles, ever" },
  { value: "2–3", label: "introductions at a time" },
  { value: "1", label: "matchmaker who sees your profile" },
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // <source media> selection is unreliable on mobile browsers — pick in JS
    // so the 1:1 mobile file is guaranteed to load on phones.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? "/videos/main-loop-mobile.mp4" : "/videos/main-loop.mp4";
    video.load();
    video.play().catch(() => {});
    const restart = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    const resumeIfPaused = () => {
      if (video.paused && document.visibilityState === "visible") video.play().catch(() => {});
    };
    video.addEventListener("ended", restart);
    document.addEventListener("visibilitychange", resumeIfPaused);
    return () => {
      video.removeEventListener("ended", restart);
      document.removeEventListener("visibilitychange", resumeIfPaused);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-[#140c08]">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          disablePictureInPicture
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* warm scrims — espresso, never grey; kept light so the footage stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#140c08]/70 via-[#140c08]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#140c08]/15 via-transparent to-[#140c08]/60" />
        {/* rose-gold glow behind the headline */}
        <div
          className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[70%] h-[80%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(236,168,214,0.10) 0%, rgba(217,167,96,0.06) 45%, transparent 70%)",
          }}
        />
      </div>

      <HeroOrnament />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div className="lg:max-w-[70%]">
          <div
            className={`mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="inline-flex items-center gap-3 text-[13px] lg:text-sm font-mono uppercase tracking-[0.25em] text-[#f5e9dc]"
              style={{ textShadow: "0 1px 14px rgba(10,5,2,0.65)" }}
            >
              <BrandMark size={24} />
              Private matrimony, made for each other
            </span>
          </div>

          <div className="mb-12">
            <h1
              className={`text-left text-[clamp(2.2rem,6vw,6.5rem)] font-display font-light leading-[1.02] tracking-tight text-[#f5e9dc] transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block whitespace-nowrap">The right introduction,</span>
              <span className="block italic">
                <span className="relative inline-block">
                  <BlurWord word={words[wordIndex]} trigger={wordIndex} />
                </span>
              </span>
            </h1>
          </div>

          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#journey"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#f5e9dc] text-[#140c08] text-sm font-medium hover:bg-white transition-colors"
            >
              Watch the journey
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-[#e9cfae]/40 text-[#f5e9dc] text-sm hover:border-[#e9cfae] transition-colors"
            >
              Private enquiry
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className={`absolute bottom-10 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-start gap-10 lg:gap-20">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <span className="text-3xl lg:text-4xl font-display text-[#d9a760]">{stat.value}</span>
              <span className="text-xs text-[#e9cfae]/70 leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
