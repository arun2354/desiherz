import { useLocale } from "@/lib/use-locale";

const films = [
  { src: "/videos/founder-full.mp4", key: "founder" },
  { src: "/videos/member-full.mp4", key: "conversation" },
] as const;

const copy = {
  en: {
    eyebrow: "In their own words",
    heading: "Hear it directly.",
    intro: "Two perspectives from the people behind DesiHerz — personal, direct and unfiltered.",
    labels: {
      founder: ["The founder", "Why DesiHerz exists"],
      conversation: ["In conversation", "A closer look at the service"],
    },
  },
  de: {
    eyebrow: "In ihren eigenen Worten",
    heading: "Hören Sie es direkt.",
    intro: "Zwei Perspektiven von den Menschen hinter DesiHerz – persönlich, direkt und ungefiltert.",
    labels: {
      founder: ["Der Gründer", "Warum es DesiHerz gibt"],
      conversation: ["Im Gespräch", "Ein näherer Blick auf das Angebot"],
    },
  },
} as const;

function FilmCard({ film }: { film: (typeof films)[number] }) {
  const locale = useLocale();
  const [title, description] = copy[locale].labels[film.key];

  return (
    <article
      className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-[#140c08]"
    >
      <video
        playsInline
        preload="metadata"
        controls
        className="aspect-video h-auto w-full bg-black object-contain"
      >
        <source src={film.src} />
      </video>
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

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12" aria-label={t.eyebrow}>
        <div className="grid gap-6 lg:grid-cols-2">
          {films.map((film) => <FilmCard key={film.key} film={film} />)}
        </div>
      </div>
    </section>
  );
}
