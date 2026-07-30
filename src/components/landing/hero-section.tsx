import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    eyebrow: "Private matrimony, made for each other",
    headlineStart: "The right introduction,",
    words: ["reconsidered.", "rediscovered.", "made real.", "well matched."],
    watchJourney: "Watch the journey",
    stats: [
      { value: "0", label: "public profiles" },
      { value: "1", label: "introduction" },
      { value: "1", label: "personal matchmaker" },
    ],
  },
  de: {
    eyebrow: "Private Eheanbahnung, füreinander gemacht",
    headlineStart: "Die richtige Vorstellung,",
    words: ["neu gedacht.", "neu entdeckt.", "wahr geworden.", "gut gewählt."],
    watchJourney: "Die Reise ansehen",
    stats: [
      { value: "0", label: "öffentliche Profile" },
      { value: "1", label: "persönliche Vorstellung" },
      { value: "1", label: "persönlicher Matchmaker" },
    ],
  },
} as const;

function BlurWord({ word, trigger }: { word: string; trigger: number }) {
  return (
    <span key={`${word}-${trigger}`} className="hero-word-reveal inline-block">
      {word}
    </span>
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
        <linearGradient
          id="orn-grad"
          x1="0"
          y1="0"
          x2="400"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b76e79" />
          <stop offset="0.5" stopColor="#dfc48d" />
          <stop offset="1" stopColor="#b76e79" />
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

export function HeroSection() {
  const locale = useLocale();
  const t = copy[locale];
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % t.words.length);
    }, 2500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    // <source media> selection is unreliable on mobile browsers — pick in JS
    // so the 1:1 mobile file is guaranteed to load on phones.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.poster = isMobile ? "/images/hero-poster-mobile.jpg" : "/images/hero-poster.jpg";
    video.src = isMobile ? "/videos/main-loop-mobile-lite.mp4" : "/videos/main-loop-lite.mp4";
    video.load();
    let isOnScreen = true;

    const playWhenUseful = () => {
      if (isOnScreen && document.visibilityState === "visible") {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    playWhenUseful();
    const restart = () => {
      video.currentTime = 0;
      playWhenUseful();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
        playWhenUseful();
      },
      { threshold: 0.05 },
    );

    observer.observe(section);
    video.addEventListener("ended", restart);
    document.addEventListener("visibilitychange", playWhenUseful);
    return () => {
      observer.disconnect();
      video.removeEventListener("ended", restart);
      document.removeEventListener("visibilitychange", playWhenUseful);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-grain relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-[#2a0c14]"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-poster.jpg"
          disablePictureInPicture
          aria-hidden="true"
          className="pointer-events-none h-full w-full object-cover object-center"
        />
        {/* warm scrims — espresso, never grey; kept light so the footage stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a0c14]/75 via-[#451521]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a0c14]/15 via-transparent to-[#321018]/70" />
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
              className="inline-flex items-center gap-3 text-[13px] lg:text-sm font-mono uppercase tracking-[0.25em] text-[#f8eddf]"
              style={{ textShadow: "0 1px 14px rgba(10,5,2,0.65)" }}
            >
              <BrandMark size={24} />
              {t.eyebrow}
            </span>
          </div>

          <div className="mb-12">
            <h1
              className={`text-left text-[clamp(2.2rem,6vw,6.5rem)] font-display font-light leading-[1.02] tracking-tight text-[#f8eddf] transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block whitespace-nowrap">{t.headlineStart}</span>
              <span className="block italic">
                <span className="relative inline-block">
                  <BlurWord word={t.words[wordIndex % t.words.length]} trigger={wordIndex} />
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
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#f8eddf] text-[#321018] text-sm font-medium hover:bg-white transition-colors"
            >
              {t.watchJourney}
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
          {t.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 ${i > 0 ? "border-l border-[#dfc48d]/20 pl-10 lg:pl-20" : ""}`}
            >
              <span className="text-3xl lg:text-4xl font-display text-[#dfc48d]">{stat.value}</span>
              <span className="text-xs text-[#f8eddf]/70 leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
