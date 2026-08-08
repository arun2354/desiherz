import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/use-locale";

const people = ["M. & A.", "N. & R.", "S. & K."] as const;
const images = [
  {
    src: "/images/testimonial-couple-1.jpg",
    faceCovers: [
      { emoji: "😊", left: "39%", top: "27%" },
      { emoji: "🥰", left: "66%", top: "39%" },
    ],
  },
  { src: "/images/testimonial-couple-2.jpg", faceCovers: [] },
  { src: "/images/testimonial-couple-3.jpg", faceCovers: [] },
] as const;

const copy = {
  en: {
    eyebrow: "What stays with people",
    heading: "A considered introduction feels different.",
    introduced: "Introduced through DesiHerz",
    previous: "Previous testimonial",
    next: "Next testimonial",
    imageAlt: "Two people holding hands, one wearing an engagement ring.",
    testimonials: [
      { quote: "Private without feeling cold. We were introduced with care, and never felt pressure to perform.", city: "Frankfurt" },
      { quote: "They understood that our families mattered, without ever letting that overpower our own choice.", city: "Munich" },
      { quote: "The opposite of an app: no noise, just one introduction that made sense.", city: "Berlin" },
    ],
  },
  de: {
    eyebrow: "Was Menschen in Erinnerung bleibt",
    heading: "Eine sorgsame Vorstellung fühlt sich anders an.",
    introduced: "Vorgestellt durch DesiHerz",
    previous: "Vorheriger Erfahrungsbericht",
    next: "Nächster Erfahrungsbericht",
    imageAlt: "Zwei Menschen halten sich an den Händen; eine Person trägt einen Verlobungsring.",
    testimonials: [
      { quote: "Privat, ohne kühl zu wirken. Wir wurden mit Sorgfalt vorgestellt und fühlten uns nie unter Druck gesetzt.", city: "Frankfurt" },
      { quote: "Sie verstanden, dass unsere Familien wichtig waren, ohne unsere eigene Entscheidung zu überlagern.", city: "München" },
      { quote: "Das Gegenteil einer App: kein Lärm, nur eine Vorstellung, die wirklich Sinn ergab.", city: "Berlin" },
    ],
  },
} as const;

export function TestimonialsSection() {
  const locale = useLocale();
  const t = copy[locale];
  const testimonials = people.map((who, index) => ({ who, image: images[index], ...t.testimonials[index] }));
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % testimonials.length), 9000);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const previous = () => setActiveIndex((index) => (index - 1 + testimonials.length) % testimonials.length);
  const next = () => setActiveIndex((index) => (index + 1) % testimonials.length);

  return (
    <section id="testimonials" className="overflow-hidden bg-background py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20 lg:px-12">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[470px]">
          <div className="absolute inset-0 rounded-[48%_52%_46%_54%/42%_46%_54%_58%] border border-gold/35 bg-card" />
          <img
            key={active.image.src}
            src={active.image.src}
            alt={t.imageAlt}
            loading="lazy"
            className="absolute inset-[4%] h-[92%] w-[92%] rounded-[52%_48%_54%_46%/46%_54%_46%_54%] object-cover object-center shadow-[0_28px_80px_rgba(73,48,26,0.18)]"
          />
          {active.image.faceCovers.map((cover) => (
            <span
              key={`${cover.left}-${cover.top}`}
              aria-hidden="true"
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 text-5xl drop-shadow-lg sm:text-6xl"
              style={{ left: cover.left, top: cover.top }}
            >
              {cover.emoji}
            </span>
          ))}
          <span className="absolute bottom-[8%] right-[1%] flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-background font-display text-3xl text-gold shadow-lg sm:h-24 sm:w-24">
            “
          </span>
        </div>

        <div>
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-10 bg-gold/60" />
            {t.eyebrow}
          </span>
          <h2 className="max-w-3xl font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            {t.heading}
          </h2>

          <blockquote key={activeIndex} className="animate-fadeSlideIn mt-12 max-w-3xl font-display text-3xl leading-[1.25] text-foreground sm:text-4xl">
            “{active.quote}”
          </blockquote>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-foreground/15 pt-6">
            <div>
              <p className="font-display text-2xl">{active.who}</p>
              <p className="mt-1 text-sm text-muted-foreground">{active.city} · {t.introduced}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={previous} aria-label={t.previous} className="rounded-full border border-foreground/20 p-3 text-foreground transition-colors hover:border-gold hover:text-gold">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button onClick={next} aria-label={t.next} className="rounded-full border border-foreground/20 p-3 text-foreground transition-colors hover:border-gold hover:text-gold">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-2" aria-hidden="true">
            {testimonials.map((item, index) => (
              <span key={item.who} className={`h-1 flex-1 rounded-full ${index === activeIndex ? "bg-gold" : "bg-foreground/15"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
