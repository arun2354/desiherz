import { useEffect, useState, useRef } from "react";

const faqs = [
  {
    q: "What is DesiHerz?",
    a: "An invitation-led matrimony house — we search our vetted circle and introduce by hand.",
  },
  {
    q: "Is my profile ever made public?",
    a: "Never. Only the principal matchmaker ever sees it.",
  },
  {
    q: "How many introductions do I get at once?",
    a: "Two or three names, considered carefully — never a list.",
  },
  {
    q: "Can a parent search on my behalf?",
    a: "Yes — many families begin the enquiry together.",
  },
  {
    q: "What does it cost to begin?",
    a: "A first private consultation and screening is €39.",
  },
  {
    q: "What happens after an introduction?",
    a: "Entirely yours. We step back and stay only a message away.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  return (
    <section id="faq" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Header */}
          <div className="lg:col-span-5">
            <span
              className={`inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="w-12 h-px bg-foreground/30" />
              Frequently asked
            </span>
            <h2
              className={`text-5xl md:text-6xl lg:text-7xl font-display tracking-tight leading-[0.95] transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              A few things
              <br />
              <span className="text-muted-foreground">people ask.</span>
            </h2>
          </div>

          {/* Items */}
          <div className="lg:col-span-7">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full text-left border-b border-foreground/10 py-6 transition-all duration-500 group ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg lg:text-xl font-medium group-hover:text-rose transition-colors duration-300">
                        {item.q}
                      </h3>
                    </div>
                    <span
                      className={`font-mono text-xl text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </div>
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: isOpen ? "160px" : "0px" }}
                  >
                    <p className="pt-4 pl-10 text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
