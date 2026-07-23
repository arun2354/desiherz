import { useEffect, useRef, useState, type ReactNode } from "react";

const pledgeIcons: Record<string, ReactNode> = {
  lock: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <rect x="16" y="28" width="32" height="26" rx="3" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <path d="M22 28v-7a10 10 0 0120 0v7" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <circle cx="32" cy="40" r="3.5" stroke="url(#pledge-grad)" strokeWidth="1.4" />
    </svg>
  ),
  rings: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <circle cx="25" cy="34" r="14" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <circle cx="39" cy="34" r="14" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <path d="M32 12l3 5h-6l3-5z" stroke="url(#pledge-grad)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  hands: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <path d="M14 32l12 12M50 32L38 44M26 44l6 6 6-6" stroke="url(#pledge-grad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="28" r="4.5" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <circle cx="50" cy="28" r="4.5" stroke="url(#pledge-grad)" strokeWidth="1.6" />
    </svg>
  ),
};

const pledges = [
  { icon: "lock", title: "Privacy", line: "No public profile, ever." },
  { icon: "rings", title: "Curation", line: "Every introduction made by a person, not an algorithm." },
  { icon: "hands", title: "Commitment", line: "With you from first hello to the family conversation." },
];

export function PledgesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pledges" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* shared gradient for the pledge icons */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="pledge-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#eca8d6" />
            <stop offset="0.55" stopColor="#d9a760" />
            <stop offset="1" stopColor="#eca8d6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-24">
          <span
            className={`inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-6 justify-center transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="w-12 h-px bg-foreground/20" />
            Our pledges
            <span className="w-12 h-px bg-foreground/20" />
          </span>
          <h2
            className={`text-5xl md:text-6xl lg:text-8xl font-display tracking-tight leading-[0.95] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Quietly <span className="italic text-gold">curated.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {pledges.map((pledge, index) => (
            <div
              key={pledge.title}
              className={`group relative border border-foreground/10 bg-foreground/[0.02] p-10 lg:p-12 text-center transition-all duration-700 hover:border-gold/40 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="flex justify-center mb-8 transition-transform duration-500 group-hover:scale-110">
                {pledgeIcons[pledge.icon]}
              </div>
              <h3 className="text-2xl lg:text-3xl font-display mb-3">{pledge.title}</h3>
              <p className="text-muted-foreground">{pledge.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
