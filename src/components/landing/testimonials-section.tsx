import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    quote: "Private without feeling cold. We were introduced with care, and no pressure to perform.",
    who: "M. & A.",
    city: "Frankfurt",
  },
  {
    quote: "They understood our families mattered, but never let that overpower our own choice.",
    who: "N. & R.",
    city: "Munich",
  },
  {
    quote: "The opposite of an app. No noise, just one introduction that made sense.",
    who: "S. & K.",
    city: "Berlin",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);

  const active = testimonials[activeIndex];

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 bg-foreground text-background overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-20">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-background/40 mb-4">
              <span className="w-12 h-px bg-background/20" />
              Proof, softly
            </span>
            <h2
              className={`text-4xl lg:text-5xl font-display transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              People remember how
              <span className="text-background/40"> the introduction felt.</span>
            </h2>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="p-4 border border-background/20 hover:bg-background/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="p-4 border border-background/20 hover:bg-background/10 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Quote */}
          <div className="lg:col-span-7 relative">
            <span className="absolute -left-4 -top-8 text-[200px] font-display text-background/5 leading-none select-none">
              &ldquo;
            </span>

            <div className="relative">
              <blockquote
                key={activeIndex}
                className="text-3xl lg:text-4xl xl:text-5xl font-display leading-[1.2] tracking-tight animate-fadeSlideIn"
              >
                {active.quote}
              </blockquote>

              <div className="mt-12 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-background/10 flex items-center justify-center">
                  <span className="font-display text-xl">{active.who.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-lg font-medium">{active.who}</p>
                  <p className="text-background/60">Introduced through DesiHerz</p>
                </div>
              </div>
            </div>
          </div>

          {/* City card side */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6">
            <div
              key={`metric-${activeIndex}`}
              className="p-10 border border-background/20 bg-background/5 animate-fadeSlideIn"
            >
              <span className="text-6xl lg:text-7xl font-display block mb-4">{active.who}</span>
              <span className="text-lg text-background/60">{active.city}</span>
            </div>

            {/* Progress indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`Show testimonial ${idx + 1}`}
                  className="flex-1 h-1 bg-background/20 overflow-hidden"
                >
                  <div
                    className={`h-full bg-background transition-all duration-300 ${
                      idx === activeIndex ? "w-full" : idx < activeIndex ? "w-full opacity-50" : "w-0"
                    }`}
                    style={idx === activeIndex ? { animation: "progress 8s linear forwards" } : {}}
                  />
                </button>
              ))}
            </div>

            {/* City chips */}
            <div className="mt-4 pt-6 border-t border-background/10">
              <span className="text-xs font-mono text-background/30 uppercase tracking-widest block mb-4">
                Cities
              </span>
              <div className="flex flex-wrap gap-3">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.city}
                    onClick={() => goTo(idx)}
                    className={`px-4 py-2 text-sm border transition-all ${
                      idx === activeIndex
                        ? "border-background/40 text-background"
                        : "border-background/10 text-background/40 hover:border-background/30"
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
