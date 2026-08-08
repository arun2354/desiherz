import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/use-locale";

const processFilms = [1, 2, 3, 4, 5] as const;

const copy = {
  en: {
    eyebrow: "How it works",
    heading: "From first contact to a shared future.",
    intro: "Five private, personally guided steps. Each film shows the next part of the DesiHerz process.",
    steps: [
      ["Get in touch", "Send us a private enquiry. Your details are never published and are seen only by the matchmaker."],
      ["A one-to-one session", "We meet privately to understand you in depth — your personality, values, family and hopes for the future."],
      ["A considered search", "We carefully review dozens of profiles in our secure, private database. There is no public browsing or swiping."],
      ["The right introduction", "We select the strongest possible candidate and arrange a private one-to-one date so you can get to know each other."],
      ["Your future together", "If the connection grows, we step back. The relationship belongs to you — and perhaps the next step is tying the knot."],
    ],
  },
  de: {
    eyebrow: "So funktioniert es",
    heading: "Vom ersten Kontakt bis zur gemeinsamen Zukunft.",
    intro: "Fünf private, persönlich begleitete Schritte. Jeder Film zeigt den nächsten Teil des DesiHerz-Ablaufs.",
    steps: [
      ["Kontakt aufnehmen", "Senden Sie uns eine private Anfrage. Ihre Angaben werden nie veröffentlicht und nur von der Vermittlung gesehen."],
      ["Persönliches Einzelgespräch", "Wir lernen Sie ausführlich kennen — Ihre Persönlichkeit, Werte, Familie und Wünsche für die Zukunft."],
      ["Sorgfältige Suche", "Wir prüfen zahlreiche Profile in unserer geschützten, privaten Datenbank. Es gibt kein öffentliches Stöbern oder Swipen."],
      ["Die passende Vorstellung", "Wir wählen die bestmögliche Person aus und organisieren ein privates Treffen, damit Sie einander kennenlernen können."],
      ["Ihre gemeinsame Zukunft", "Wenn die Verbindung wächst, ziehen wir uns zurück. Die Beziehung gehört Ihnen — und vielleicht folgt bald die Hochzeit."],
    ],
  },
} as const;

function ProcessFilm({ number }: { number: (typeof processFilms)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={`/videos/process-${number}.mp4`}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      className="h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}

export function VideoProcessSection() {
  const locale = useLocale();
  const t = copy[locale];

  return (
    <section id="journey" className="bg-[#140c08] py-24 text-[#f5e9dc] lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 grid gap-6 lg:mb-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="mb-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
              <span className="h-px w-10 bg-gold/70" />{t.eyebrow}
            </span>
            <h2 className="max-w-4xl font-display text-5xl leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">{t.heading}</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-[#d7c6b7] lg:justify-self-end">{t.intro}</p>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {processFilms.map((number, index) => {
            const [title, description] = t.steps[index];
            return (
              <article key={number} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div className={`relative aspect-video overflow-hidden rounded-[2rem] border border-gold/25 bg-black lg:col-span-7 ${index % 2 ? "lg:order-2" : ""}`}>
                  <ProcessFilm number={number} />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
                </div>
                <div className={`lg:col-span-5 ${index % 2 ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}>
                  <span className="font-mono text-xs tracking-[0.22em] text-gold-light">{String(number).padStart(2, "0")} / 05</span>
                  <h3 className="mt-5 font-display text-4xl sm:text-5xl">{title}</h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-[#d7c6b7] sm:text-lg">{description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
