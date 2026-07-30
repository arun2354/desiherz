import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/use-locale";

const testimonialTimings = [
  { who: "M. & A.", photo: "/images/testimonial-phone-1.jpg" },
  { who: "N. & R.", photo: "/images/testimonial-phone-2.jpg" },
  { who: "S. & K.", photo: "/images/testimonial-phone-3.jpg" },
  { who: "A. & J.", photo: "/images/testimonial-phone-4.jpg" },
  { who: "R. & P.", photo: "/images/testimonial-phone-5.jpg" },
] as const;

const copy = {
  en: {
    eyebrow: "Proof, softly",
    heading: ["People remember how", " the introduction felt."],
    introducedThrough: "Introduced through DesiHerz",
    cities: "Cities",
    prev: "Previous testimonial",
    next: "Next testimonial",
    showTestimonial: (n: number) => `Show testimonial ${n}`,
    testimonials: [
      {
        quote:
          "Private without feeling cold. We were introduced with care, and no pressure to perform.",
        city: "Frankfurt",
      },
      {
        quote:
          "They understood our families mattered, but never let that overpower our own choice.",
        city: "Munich",
      },
      {
        quote: "The opposite of an app. No noise, just one introduction that made sense.",
        city: "Berlin",
      },
      {
        quote:
          "There was no performance and no pressure. It felt like being introduced by someone who genuinely knew us.",
        city: "Cologne",
      },
      {
        quote:
          "We lived in different cities, but our values already felt close. DesiHerz made the first conversation easy.",
        city: "Hamburg",
      },
    ],
  },
  de: {
    eyebrow: "Leise Beweise",
    heading: ["Menschen erinnern sich, wie", " sich die Vorstellung angefühlt hat."],
    introducedThrough: "Vorgestellt durch DesiHerz",
    cities: "Städte",
    prev: "Vorheriger Erfahrungsbericht",
    next: "Nächster Erfahrungsbericht",
    showTestimonial: (n: number) => `Erfahrungsbericht ${n} anzeigen`,
    testimonials: [
      {
        quote:
          "Privat, ohne kühl zu wirken. Wir wurden mit Sorgfalt vorgestellt, ganz ohne Erwartungsdruck.",
        city: "Frankfurt",
      },
      {
        quote:
          "Sie verstanden, dass unsere Familien wichtig waren, ließen das aber nie unsere eigene Entscheidung überlagern.",
        city: "München",
      },
      {
        quote: "Das Gegenteil einer App. Kein Lärm, nur eine Vorstellung, die Sinn ergab.",
        city: "Berlin",
      },
      {
        quote:
          "Kein Schauspiel und kein Druck. Es fühlte sich an, als hätte uns jemand vorgestellt, der uns wirklich kennt.",
        city: "Köln",
      },
      {
        quote:
          "Wir lebten in verschiedenen Städten, doch unsere Werte waren sich bereits nah. DesiHerz machte das erste Gespräch leicht.",
        city: "Hamburg",
      },
    ],
  },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function TestimonialsSection() {
  const locale = useLocale();
  const t = copy[locale];
  const testimonials = testimonialTimings.map((timing, i) => ({ ...timing, ...t.testimonials[i] }));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);

  const active = testimonials[activeIndex];

  return (
    <section className="bg-grain bg-ink-gradient relative overflow-hidden py-32 text-ink-foreground lg:py-40">
      {/* hairline seam so this doesn't visually fuse with the dark Voices section above it */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-20 flex items-end justify-between gap-8"
        >
          <div>
            <span className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-ink-muted-foreground">
              <span className="h-px w-12 bg-gold/40" />
              {t.eyebrow}
            </span>
            <h2 className="text-4xl font-display lg:text-5xl">
              {t.heading[0]}
              <span className="font-accent text-ink-muted-foreground">{t.heading[1]}</span>
            </h2>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={goPrev}
              aria-label={t.prev}
              className="border border-ink-border p-4 transition-colors hover:border-gold/60 hover:bg-ink-foreground/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              aria-label={t.next}
              className="border border-ink-border p-4 transition-colors hover:border-gold/60 hover:bg-ink-foreground/5"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Split layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Quote */}
          <div className="relative lg:col-span-7">
            <span className="text-foil absolute -top-8 -left-4 font-display text-[200px] leading-none select-none opacity-30">
              &ldquo;
            </span>

            <div className="relative min-h-[220px]">
              <motion.blockquote
                key={activeIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="font-display text-3xl leading-[1.2] tracking-tight lg:text-4xl xl:text-5xl"
              >
                {active.quote}
              </motion.blockquote>

              <motion.div
                key={`attr-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-12 flex items-center gap-6"
              >
                <div className="glass-panel flex h-14 w-14 items-center justify-center rounded-full">
                  <span className="font-display text-xl">{active.who.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-lg font-medium">{active.who}</p>
                  <p className="text-ink-muted-foreground">{t.introducedThrough}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* City card side */}
          <div className="flex flex-col justify-center gap-6 lg:col-span-5">
            <motion.div
              key={`photo-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative aspect-[4/5] overflow-hidden border border-ink-border bg-black"
            >
              <img
                src={active.photo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              key={`metric-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass-panel p-10"
            >
              <span className="mb-4 block font-display text-6xl lg:text-7xl">{active.who}</span>
              <span className="text-lg text-ink-muted-foreground">{active.city}</span>
            </motion.div>

            {/* Progress indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={t.showTestimonial(idx + 1)}
                  className="h-1 flex-1 overflow-hidden bg-ink-border"
                >
                  <div
                    className={`h-full bg-gold transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-full"
                        : idx < activeIndex
                          ? "w-full opacity-40"
                          : "w-0"
                    }`}
                    style={idx === activeIndex ? { animation: "progress 8s linear forwards" } : {}}
                  />
                </button>
              ))}
            </div>

            {/* City chips */}
            <div className="mt-4 border-t border-ink-border pt-6">
              <span className="mb-4 block font-mono text-xs tracking-widest text-ink-muted-foreground/70 uppercase">
                {t.cities}
              </span>
              <div className="flex flex-wrap gap-3">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.city}
                    onClick={() => goTo(idx)}
                    className={`border px-4 py-2 text-sm transition-all ${
                      idx === activeIndex
                        ? "border-gold/60 text-ink-foreground"
                        : "border-ink-border text-ink-muted-foreground hover:border-gold/30"
                    }`}
                  >
                    {t.city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
