import { useEffect, useState, useRef } from "react";

function VideoFeature({ title, role, film, alt }: { title: string; role: string; film: string; alt: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(film, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [film]);

  return (
    <figure className="group">
      <div className="relative border border-foreground/10 bg-black overflow-hidden aspect-video transition-colors duration-500 group-hover:border-foreground/30">
        {ready ? (
          <video
            src={film}
            controls
            preload="metadata"
            playsInline
            aria-label={alt}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="w-14 h-14 rounded-full border border-foreground/20 flex items-center justify-center">
              <span className="ml-1 block w-0 h-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-foreground/40" />
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <strong className="font-display text-xl">{title}</strong>
        <span className="text-sm text-muted-foreground font-mono">{role}</span>
      </figcaption>
    </figure>
  );
}

export function VoicesSection() {
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
    <section id="voices" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            In their own words
          </span>
          <h2 className="text-6xl md:text-7xl lg:text-[110px] font-display tracking-tight leading-[0.9]">
            Hear it
            <br />
            <span className="text-muted-foreground">directly.</span>
          </h2>
        </div>

        <div
          className={`grid md:grid-cols-2 gap-8 lg:gap-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <VideoFeature
            title="The founder"
            role="Why DesiHerz exists"
            film="/videos/founder.mp4"
            alt="The founder of DesiHerz speaking about the house."
          />
          <VideoFeature
            title="In conversation"
            role="A closer look at the house"
            film="/videos/spokesperson.mp4"
            alt="A spokesperson speaking about DesiHerz."
          />
        </div>
      </div>
    </section>
  );
}
