import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    heading: ["Some souls are destined to meet.", "We help them find each other."],
    paragraph:
      "Scroll to watch how one introduction unfolds — from the first quiet click to the altar.",
  },
  de: {
    heading: ["Manche Seelen sind füreinander bestimmt.", "Wir helfen ihnen, einander zu finden."],
    paragraph:
      "Scrollen Sie, um zu sehen, wie eine Vorstellung sich entfaltet — vom ersten stillen Klick bis zum Altar.",
  },
} as const;

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
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="matrimony-light-bridge relative overflow-hidden pt-44 pb-28 lg:pt-56 lg:pb-40"
    >
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
    </section>
  );
}
