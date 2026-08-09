import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    heading: ["Every soul is destined to meet its match.", "We simply help them find each other."],
    paragraph: "Meet the people behind DesiHerz and discover how a thoughtful introduction begins.",
  },
  de: {
    heading: ["Jede Seele ist dazu bestimmt, ihrem Gegenstück zu begegnen.", "Wir helfen beiden, einander zu finden."],
    paragraph: "Lernen Sie die Menschen hinter DesiHerz kennen und erfahren Sie, wie eine sorgsame Vorstellung beginnt.",
  },
} as const;

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
    </section>
  );
}
