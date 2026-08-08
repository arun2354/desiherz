import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/use-locale";

const films = [
  { src: "/videos/founder.mp4", key: "founder" },
  { src: "/videos/spokesperson.mp4", key: "conversation" },
] as const;

const copy = {
  en: {
    eyebrow: "In their own words",
    heading: "Two voices. One clear intention.",
    intro: "Meet the people behind DesiHerz — openly, personally, and without the noise of an app.",
    labels: {
      founder: ["The founder", "Why DesiHerz exists"],
      conversation: ["In conversation", "A closer look at the service"],
    },
  },
  de: {
    eyebrow: "In ihren eigenen Worten",
    heading: "Zwei Stimmen. Eine klare Haltung.",
    intro: "Lernen Sie die Menschen hinter DesiHerz kennen — offen, persönlich und ohne den Lärm einer App.",
    labels: {
      founder: ["Der Gründer", "Warum es DesiHerz gibt"],
      conversation: ["Im Gespräch", "Ein näherer Blick auf das Angebot"],
    },
  },
} as const;

function FilmCard({ film, duplicate = false }: { film: (typeof films)[number]; duplicate?: boolean }) {
  const locale = useLocale();
  const [title, description] = copy[locale].labels[film.key];

  return (
    <article
      className="video-rail-card relative w-[82vw] shrink-0 overflow-hidden rounded-[2rem] border border-gold/25 bg-[#140c08] sm:w-[64vw] lg:w-[46vw]"
      aria-hidden={duplicate || undefined}
    >
      <video
        src={film.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={duplicate ? -1 : undefined}
        className="aspect-video h-auto w-full object-cover"
      />
      <div className="flex items-end justify-between gap-6 border-t border-gold/20 bg-[#140c08] px-6 py-5 text-[#f5e9dc] sm:px-8 sm:py-6">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl">{title}</h3>
          <p className="mt-1 text-sm text-[#d7c6b7]">{description}</p>
        </div>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
      </div>
    </article>
  );
}

export function VideoRailSection() {
  const locale = useLocale();
  const t = copy[locale];
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const playAll = () => {
      railRef.current?.querySelectorAll("video").forEach((video) => video.play().catch(() => {}));
    };
    playAll();
    document.addEventListener("visibilitychange", playAll);
    return () => document.removeEventListener("visibilitychange", playAll);
  }, []);

  return (
    <section id="voices" className="overflow-hidden bg-[#140c08] py-24 text-[#f5e9dc] lg:py-32">
      <div className="mx-auto mb-14 max-w-[1400px] px-6 lg:px-12">
        <span className="mb-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
          <span className="h-px w-10 bg-gold/70" />
          {t.eyebrow}
        </span>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <h2 className="max-w-4xl font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {t.heading}
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-[#d7c6b7] lg:justify-self-end">{t.intro}</p>
        </div>
      </div>

      <div className="video-rail" aria-label={t.eyebrow}>
        <div ref={railRef} className="video-rail-track flex w-max gap-5">
          {films.map((film) => <FilmCard key={film.key} film={film} />)}
          {films.map((film) => <FilmCard key={`duplicate-${film.key}`} film={film} duplicate />)}
        </div>
      </div>
    </section>
  );
}
