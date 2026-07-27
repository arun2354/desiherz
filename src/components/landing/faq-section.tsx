import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/use-locale";

// keyed by locale; also imported by src/routes/index.tsx and
// src/routes/de/index.tsx to build the FAQPage JSON-LD, so this stays the
// single source of truth for both what's shown and what's marked up
export const faqs = {
  en: [
    { q: "What is DesiHerz?", a: "A private matrimony house — we search our vetted circle and introduce by hand." },
    { q: "Is my profile ever made public?", a: "Never. Only the principal matchmaker ever sees it." },
    { q: "How many introductions do I get at once?", a: "Two or three names, considered carefully — never a list." },
    { q: "Can a parent search on my behalf?", a: "Yes — many families begin the enquiry together." },
    { q: "What does it cost to begin?", a: "A first private consultation and screening is €39." },
    { q: "What happens after an introduction?", a: "Entirely yours. We step back and stay only a message away." },
  ],
  de: [
    { q: "Was ist DesiHerz?", a: "Ein privates Ehevermittlungshaus — wir suchen in unserem geprüften Kreis und stellen von Hand vor." },
    { q: "Wird mein Profil jemals öffentlich?", a: "Niemals. Nur die leitende Vermittlerin sieht es." },
    { q: "Wie viele Vorstellungen bekomme ich auf einmal?", a: "Zwei oder drei Namen, sorgfältig ausgewählt — niemals eine Liste." },
    { q: "Kann ein Elternteil in meinem Namen suchen?", a: "Ja — viele Familien beginnen die Anfrage gemeinsam." },
    { q: "Was kostet der Anfang?", a: "Ein erstes privates Beratungsgespräch mit Prüfung kostet 39 €." },
    { q: "Was passiert nach einer Vorstellung?", a: "Ganz Ihre Sache. Wir treten zurück und sind nur eine Nachricht entfernt." },
  ],
} as const;

const copy = {
  en: { eyebrow: "Frequently asked", heading: ["A few things", "people ask."] },
  de: { eyebrow: "Häufig gefragt", heading: ["Ein paar Dinge,", "die man uns fragt."] },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function FaqSection() {
  const locale = useLocale();
  const t = copy[locale];
  const items = faqs[locale];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden py-28 lg:py-40">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-[-4%] -translate-y-1/2 font-display text-[22vw] leading-none text-foreground/[0.025] select-none"
      >
        ?
      </span>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-5"
          >
            <span className="mb-6 inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="h-px w-12 bg-gold/40" />
              {t.eyebrow}
            </span>
            <h2 className="text-5xl leading-[0.95] tracking-tight md:text-6xl lg:text-7xl font-display">
              {t.heading[0]}
              <br />
              <span className="font-accent text-muted-foreground">{t.heading[1]}</span>
            </h2>
          </motion.div>

          {/* Items */}
          <div className="lg:col-span-7">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                  className="border-b border-foreground/10"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className={`font-mono text-xs transition-colors duration-300 ${isOpen ? "text-gold" : "text-muted-foreground"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-medium transition-colors duration-300 group-hover:text-rose lg:text-xl">
                        {item.q}
                      </h3>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="font-mono text-xl text-gold"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-md pt-1 pb-6 pl-10 leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
