import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    eyebrow: "How it works",
    heading: "One thoughtful step at a time.",
    intro: "A private process, guided by a person from the first conversation to a meaningful introduction.",
    steps: [
      ["Discovery", "We begin with a private conversation about you, your values and what truly matters."],
      ["The circle", "Your profile stays private while we search a carefully vetted circle."],
      ["The match", "We consider character, heritage, family and the life you want to build."],
      ["The introduction", "When there is genuine potential, we introduce one considered match."],
      ["Your pace", "You decide freely, with no pressure and no public performance."],
      ["What follows", "If it feels right, we remain beside you through the family conversation."],
    ],
  },
  de: {
    eyebrow: "So funktioniert es",
    heading: "Ein sorgsamer Schritt nach dem anderen.",
    intro: "Ein privater, persönlich begleiteter Weg – vom ersten Gespräch bis zu einer bedeutungsvollen Vorstellung.",
    steps: [
      ["Kennenlernen", "Wir beginnen mit einem privaten Gespräch über Sie, Ihre Werte und das, was wirklich zählt."],
      ["Der Kreis", "Ihr Profil bleibt privat, während wir in einem sorgfältig geprüften Kreis suchen."],
      ["Die Verbindung", "Wir berücksichtigen Persönlichkeit, Herkunft, Familie und Ihre gemeinsame Zukunft."],
      ["Die Vorstellung", "Wenn echtes Potenzial besteht, stellen wir Ihnen eine passende Person vor."],
      ["Ihr Tempo", "Sie entscheiden frei – ohne Druck und ohne öffentliche Selbstdarstellung."],
      ["Der weitere Weg", "Wenn es sich richtig anfühlt, begleiten wir Sie auch beim Familiengespräch."],
    ],
  },
} as const;

function ProcessFilm({ index }: { index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let segmentStart = 0;
    let segmentEnd = Number.POSITIVE_INFINITY;
    const setSegment = () => {
      const length = video.duration / 6;
      segmentStart = index * length;
      segmentEnd = segmentStart + length;
      video.currentTime = segmentStart;
    };
    const keepInsideSegment = () => {
      if (video.currentTime >= segmentEnd || video.currentTime < segmentStart) {
        video.currentTime = segmentStart;
        void video.play().catch(() => undefined);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "120px 0px", threshold: 0.15 },
    );

    video.addEventListener("loadedmetadata", setSegment);
    video.addEventListener("timeupdate", keepInsideSegment);
    observer.observe(video);
    if (video.readyState >= 1) setSegment();

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", setSegment);
      video.removeEventListener("timeupdate", keepInsideSegment);
    };
  }, [index]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      className="h-full w-full object-cover"
      aria-hidden="true"
    >
      <source media="(max-width: 767px)" src="/videos/journey-mobile.mp4" />
      <source src="/videos/journey-desktop.mp4" />
    </video>
  );
}

export function VideoProcessSection() {
  const locale = useLocale();
  const t = copy[locale];

  return (
    <section id="journey" className="bg-[#140c08] py-24 text-[#f5e9dc] lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:mb-24">
          <div>
            <span className="mb-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
              <span className="h-px w-10 bg-gold/70" />{t.eyebrow}
            </span>
            <h2 className="max-w-4xl font-display text-5xl leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">{t.heading}</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-[#d7c6b7] lg:justify-self-end">{t.intro}</p>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {t.steps.map(([title, description], index) => (
            <article key={title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <div className={`relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-gold/25 bg-black lg:col-span-7 ${index % 2 ? "lg:order-2" : ""}`}>
                <ProcessFilm index={index} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
              </div>
              <div className={`lg:col-span-5 ${index % 2 ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}>
                <span className="font-mono text-xs tracking-[0.22em] text-gold-light">{String(index + 1).padStart(2, "0")} / 06</span>
                <h3 className="mt-5 font-display text-4xl sm:text-5xl">{title}</h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-[#d7c6b7] sm:text-lg">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
