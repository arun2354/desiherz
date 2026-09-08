import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    eyebrow: "A closer look",
    heading: "A glimpse of DesiHerz.",
    description: "A private introduction begins with care, clarity and the people who matter most.",
  },
  de: {
    eyebrow: "Ein näherer Einblick",
    heading: "Ein Blick auf DesiHerz.",
    description: "Eine private Vorstellung beginnt mit Sorgfalt, Klarheit und den Menschen, die Ihnen am wichtigsten sind.",
  },
} as const;

export function HighlightVideoSection() {
  const locale = useLocale();
  const t = copy[locale];

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
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/-lapulvb8zk?si=y1wi8jcP1ToEm0Kl"
            title={t.heading}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
