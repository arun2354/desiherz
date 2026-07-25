import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES = [
  {
    scene: "I.",
    title: "The founder",
    role: "Why DesiHerz exists",
    film: "/videos/founder.mp4",
    alt: "The founder of DesiHerz speaking about the house.",
  },
  {
    scene: "II.",
    title: "In conversation",
    role: "A closer look at the house",
    film: "/videos/spokesperson.mp4",
    alt: "A spokesperson speaking about DesiHerz.",
  },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function VideoPlayer({ film, alt }: { film: string; alt: string }) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setPlaying(false);
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
    <div className="relative overflow-hidden border border-ink-border bg-black aspect-video transition-colors duration-500">
      {ready ? (
        <>
          <video
            key={film}
            src={film}
            controls={playing}
            preload="metadata"
            playsInline
            aria-label={alt}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {!playing && (
            <button
              type="button"
              onClick={(e) => {
                const video = e.currentTarget.parentElement?.querySelector("video");
                video?.play();
              }}
              aria-label={`Play: ${alt}`}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-500 hover:bg-black/10"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-black/40 backdrop-blur-sm transition-transform duration-500 hover:scale-110 hover:border-gold">
                <span className="ml-1 block h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-gold" />
              </span>
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink-border">
            <span className="ml-1 block h-0 w-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-ink-muted-foreground" />
          </span>
        </div>
      )}
    </div>
  );
}

export function VoicesSection() {
  const [active, setActive] = useState(0);
  const feature = FEATURES[active];

  return (
    <section id="voices" className="bg-grain bg-ink-gradient relative overflow-hidden py-28 text-ink-foreground lg:py-40">
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 lg:mb-16"
        >
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-ink-muted-foreground">
            <span className="h-px w-8 bg-gold/40" />
            In their own words
          </span>
          <h2 className="text-6xl leading-[0.9] tracking-tight md:text-7xl lg:text-[110px] font-display">
            Hear it
            <br />
            <span className="font-accent text-ink-muted-foreground">directly.</span>
          </h2>
        </motion.div>

        {/* one video at a time — a toggle, never a side-by-side grid */}
        <div className="mb-8 flex justify-center gap-2 lg:justify-start">
          {FEATURES.map((f, i) => (
            <button
              key={f.title}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                active === i
                  ? "border-gold bg-gold/10 text-ink-foreground"
                  : "border-ink-border text-ink-muted-foreground hover:border-gold/40"
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={feature.film}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mb-4 flex items-baseline gap-3 font-mono text-xs tracking-[0.2em] text-ink-muted-foreground uppercase">
              <span className="font-accent text-lg text-gold not-italic">{feature.scene}</span>
              Scene
            </div>

            <VideoPlayer film={feature.film} alt={feature.alt} />

            <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-ink-border pt-4">
              <strong className="font-display text-xl text-ink-foreground">{feature.title}</strong>
              <span className="font-mono text-sm text-ink-muted-foreground">{feature.role}</span>
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
