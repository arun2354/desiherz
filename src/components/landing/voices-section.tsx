import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/use-locale";

const filmTimings = [
  {
    scene: "I.",
    desktopFilm: "/videos/founder-lite.mp4",
    mobileFilm: "/videos/founder-mobile.mp4",
    poster: "/images/founder-poster.jpg",
  },
  {
    scene: "II.",
    desktopFilm: "/videos/spokesperson-lite.mp4",
    mobileFilm: "/videos/spokesperson-mobile.mp4",
    poster: "/images/spokesperson-poster.jpg",
  },
] as const;

const copy = {
  en: {
    eyebrow: "In their own words",
    heading: ["Hear it", "directly."],
    sceneLabel: "Scene",
    play: "Play",
    features: [
      {
        title: "The founder",
        role: "Why DesiHerz exists",
        alt: "The founder of DesiHerz speaking about the house.",
      },
      {
        title: "In conversation",
        role: "A closer look at the house",
        alt: "A spokesperson speaking about DesiHerz.",
      },
    ],
  },
  de: {
    eyebrow: "In ihren eigenen Worten",
    heading: ["Hören Sie es", "direkt."],
    sceneLabel: "Szene",
    play: "Abspielen",
    features: [
      {
        title: "Der Gründer",
        role: "Warum es DesiHerz gibt",
        alt: "Der Gründer von DesiHerz spricht über das Haus.",
      },
      {
        title: "Im Gespräch",
        role: "Ein näherer Blick auf das Haus",
        alt: "Eine Sprecherin spricht über DesiHerz.",
      },
    ],
  },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function VideoPlayer({
  film,
  poster,
  alt,
  playLabel,
}: {
  film: string;
  poster: string;
  alt: string;
  playLabel: string;
}) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative overflow-hidden border border-ink-border bg-black aspect-video transition-colors duration-500">
      <video
        key={film}
        src={film}
        poster={poster}
        controls={playing}
        preload="metadata"
        playsInline
        aria-label={alt}
        onLoadedMetadata={() => setReady(true)}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink-border border-t-gold" />
        </div>
      )}
      {!playing && (
        <button
          type="button"
          onClick={(e) => {
            const video = e.currentTarget.parentElement?.querySelector("video");
            video?.play().catch(() => {});
          }}
          aria-label={`${playLabel}: ${alt}`}
          className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 hover:bg-black/10 ${
            ready ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-black/40 backdrop-blur-sm transition-transform duration-500 hover:scale-110 hover:border-gold">
            <span className="ml-1 block h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-gold" />
          </span>
        </button>
      )}
    </div>
  );
}

export function VoicesSection() {
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = copy[locale];
  const FEATURES = filmTimings.map((f, i) => ({ ...f, ...t.features[i] }));
  const feature = FEATURES[active];

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // this section is well below the fold — don't check/load its video
  // until the user is actually approaching it, so it doesn't compete
  // with the hero's critical assets on initial page load
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="voices"
      ref={sectionRef}
      className="bg-grain bg-ink-gradient relative overflow-hidden py-28 text-ink-foreground lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 lg:mb-16"
        >
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-ink-muted-foreground">
            <span className="h-px w-8 bg-gold/40" />
            {t.eyebrow}
          </span>
          <h2 className="text-6xl leading-[0.9] tracking-tight md:text-7xl lg:text-[110px] font-display">
            {t.heading[0]}
            <br />
            <span className="font-accent text-ink-muted-foreground">{t.heading[1]}</span>
          </h2>
        </motion.div>

        {/* one video at a time — a toggle, never a side-by-side grid */}
        <div className="mb-8 flex justify-center gap-2 lg:justify-start">
          {FEATURES.map((f, i) => (
            <button
              key={f.title}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                active === i
                  ? "border-gold bg-gold/10 text-ink-foreground"
                  : "border-ink-border text-ink-muted-foreground hover:border-gold/40"
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${isMobile ? "mobile" : "desktop"}-${feature.desktopFilm}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mb-4 flex items-baseline gap-3 font-mono text-xs tracking-[0.2em] text-ink-muted-foreground uppercase">
              <span className="font-accent text-lg text-gold not-italic">{feature.scene}</span>
              {t.sceneLabel}
            </div>

            {near ? (
              <VideoPlayer
                film={isMobile ? feature.mobileFilm : feature.desktopFilm}
                poster={feature.poster}
                alt={feature.alt}
                playLabel={t.play}
              />
            ) : (
              <div
                className="relative overflow-hidden border border-ink-border bg-black aspect-video"
                aria-hidden="true"
              />
            )}

            <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-ink-border pt-4">
              <strong className="font-display text-xl text-ink-foreground">{feature.title}</strong>
              <span className="font-mono text-sm text-ink-muted-foreground">{feature.role}</span>
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
