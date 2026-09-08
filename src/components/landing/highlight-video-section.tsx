import { useRef, useState } from "react";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    eyebrow: "A closer look",
    heading: "A glimpse of DesiHerz.",
    description: "A private introduction begins with care, clarity and the people who matter most.",
    play: "Play highlight film",
  },
  de: {
    eyebrow: "Ein näherer Einblick",
    heading: "Ein Blick auf DesiHerz.",
    description: "Eine private Vorstellung beginnt mit Sorgfalt, Klarheit und den Menschen, die Ihnen am wichtigsten sind.",
    play: "Highlight-Film abspielen",
  },
} as const;

export function HighlightVideoSection() {
  const locale = useLocale();
  const t = copy[locale];
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="bg-[#140c08] py-20 text-[#f5e9dc] lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-9 flex max-w-3xl flex-col gap-4 lg:mb-12">
          <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
            <span className="h-px w-10 bg-gold/70" />
            {t.eyebrow}
          </span>
          <h2 className="font-display text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">{t.heading}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#d7c6b7] sm:text-lg">{t.description}</p>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-gold/30 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:rounded-[2rem]">
          <video
            ref={videoRef}
            controls={started}
            playsInline
            preload="none"
            poster="/images/desiherz-highlight-poster.jpg"
            className="aspect-video w-full bg-black object-contain"
            aria-label={t.heading}
          />

          {!started && (
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                video.src = "/videos/desiherz-highlight.mp4";
                video.load();
                setStarted(true);
                void video.play().catch(() => undefined);
              }}
              aria-label={t.play}
              className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(217,167,96,0.16),rgba(20,12,8,0.88)_72%)] transition-colors hover:bg-[radial-gradient(circle_at_center,rgba(217,167,96,0.24),rgba(20,12,8,0.82)_72%)]"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/70 bg-[#140c08]/80 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-110">
                <span className="ml-1 h-0 w-0 border-y-[11px] border-y-transparent border-l-[17px] border-l-gold" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
