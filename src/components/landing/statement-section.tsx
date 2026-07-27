import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    heading: ["Some marriages are arranged.", "The right ones are curated."],
    paragraph: "Scroll to watch how one introduction unfolds — from the first quiet click to the altar.",
    marqueeItems: [
      "Private",
      "Curated by hand",
      "By appointment",
      "Frankfurt am Main",
      "No profiles, no swiping",
      "Two families, one table",
    ],
  },
  de: {
    heading: ["Manche Ehen werden arrangiert.", "Die richtigen werden kuratiert."],
    paragraph: "Scrollen Sie, um zu sehen, wie eine Vorstellung sich entfaltet — vom ersten stillen Klick bis zum Altar.",
    marqueeItems: [
      "Privat",
      "Von Hand kuratiert",
      "Nur nach Vereinbarung",
      "Frankfurt am Main",
      "Keine Profile, kein Wischen",
      "Zwei Familien, ein Tisch",
    ],
  },
} as const;

function MarqueeRow({ items }: { items: readonly string[] }) {
  const row = (
    <>
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-10 mr-10">
          <span className="font-mono text-xs lg:text-sm uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
            {item}
          </span>
          <span className="text-gold" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </>
  );
  return (
    <div className="marquee-track" aria-hidden="true">
      {row}
      {row}
    </div>
  );
}

export function StatementSection() {
  const locale = useLocale();
  const t = copy[locale];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <div
          className={`flex justify-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <BrandMark size={44} />
        </div>

        <h2
          className={`font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.06] tracking-tight transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {t.heading[0]}
          <br />
          <span className="font-accent text-foil">{t.heading[1]}</span>
        </h2>

        <p
          className={`mt-8 text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto transition-all duration-1000 delay-150 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {t.paragraph}
        </p>

        <div
          className={`mt-6 flex justify-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <svg width="14" height="26" viewBox="0 0 14 26" fill="none">
            <path
              d="M7 1v22m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="text-gold"
            />
          </svg>
        </div>
      </div>

      {/* slow marquee strip */}
      <div
        className={`mt-20 lg:mt-28 border-y border-gold/20 py-5 overflow-hidden transition-opacity duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <MarqueeRow items={t.marqueeItems} />
      </div>
    </section>
  );
}
