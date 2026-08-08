import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    heading: ["Some marriages are arranged.", "The right ones are curated."],
    paragraph: "Meet the people behind DesiHerz and discover how a thoughtful introduction begins.",
    marqueeItems: ["Private", "Curated by hand", "By appointment", "No profiles, no swiping", "Two families, one table"],
  },
  de: {
    heading: ["Manche Ehen werden arrangiert.", "Die richtigen werden kuratiert."],
    paragraph: "Lernen Sie die Menschen hinter DesiHerz kennen und erfahren Sie, wie eine sorgsame Vorstellung beginnt.",
    marqueeItems: ["Privat", "Von Hand kuratiert", "Nur nach Vereinbarung", "Keine Profile, kein Wischen", "Zwei Familien, ein Tisch"],
  },
} as const;

function MarqueeRow({ items }: { items: readonly string[] }) {
  const row = items.map((item) => (
    <span key={item} className="mr-10 inline-flex items-center gap-10">
      <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground lg:text-sm">{item}</span>
      <span className="text-gold" aria-hidden="true">✦</span>
    </span>
  ));

  return <div className="marquee-track" aria-hidden="true">{row}{row}</div>;
}

export function StatementSection() {
  const locale = useLocale();
  const t = copy[locale];
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.25 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12">
        <div className={`mb-10 flex justify-center transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <BrandMark size={44} />
        </div>
        <h2 className={`font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.06] tracking-tight transition-all duration-1000 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {t.heading[0]}<br />
          <span className="font-accent text-gold">{t.heading[1]}</span>
        </h2>
        <p className={`mx-auto mt-8 max-w-xl text-lg text-muted-foreground transition-opacity delay-150 duration-1000 lg:text-xl ${visible ? "opacity-100" : "opacity-0"}`}>{t.paragraph}</p>
      </div>
      <div className={`mt-20 overflow-hidden border-y border-gold/20 py-5 transition-opacity delay-300 duration-1000 lg:mt-28 ${visible ? "opacity-100" : "opacity-0"}`}>
        <MarqueeRow items={t.marqueeItems} />
      </div>
    </section>
  );
}
