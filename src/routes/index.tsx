import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Section, Reveal, MaskReveal, Marquee } from "@/components/Reveal";
import coupleHero from "@/assets/couple-hero.jpg";
import coupleStory1 from "@/assets/couple-story-1.jpg";
import coupleStory2 from "@/assets/couple-story-2.jpg";
import coupleHands from "@/assets/couple-hands.jpg";

const Scene3D = lazy(() =>
  import("@/components/Scene3D").then((m) => ({ default: m.Scene3D }))
);


const SITE = {
  name: "DesiHerz",
  description:
    "DesiHerz is an invitation-only matrimony house pairing rooted families with character, taste and intention.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesiHerz — Private Matrimony for the Discerning" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "DesiHerz — Private Matrimony" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DesiHerz — Private Matrimony" },
      { name: "twitter:description", content: SITE.description },
      { name: "theme-color", content: "#09050a" },
      {
        name: "keywords",
        content:
          "private matrimony, luxury matchmaking, Indian matrimony, invitation only matchmaking, bespoke marriage bureau",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DesiHerz",
          description: SITE.description,
          url: "/",
          areaServed: "Worldwide",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative grain vignette">
      {mounted && (
        <>
          <SmoothScroll />
          <Suspense fallback={null}>
            <Scene3D />
            <Cursor />
          </Suspense>
        </>
      )}

      <Nav />

      <Hero />
      <Manifesto />
      <Philosophy />
      <PinnedProcess />
      <Stories />
      <Numbers />
      <Join />
      <Footer />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const y = useTransform(scrollY, [0, 600], [0, -80]);
  const imgY = useTransform(scrollY, [0, 800], [0, 140]);

  return (
    <section
      id="top"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-14 pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-10 items-center">
        <motion.div style={{ opacity, y }} className="md:col-span-7">
          <Reveal>
            <p className="eyebrow mb-10">Est. MMXXV · By Invitation</p>
          </Reveal>
          <h1 className="font-display text-[clamp(3rem,7.5vw,6rem)] leading-[1.02] font-light text-cream">
            <MaskReveal text="A quieter way" delay={0.1} />
            <br />
            <span className="italic text-gold-soft font-light">
              <MaskReveal text="to find forever." delay={0.4} />
            </span>
          </h1>
          <Reveal delay={0.9}>
            <p className="mt-10 text-base md:text-lg text-cream/65 max-w-lg leading-[1.7] font-light">
              A private matrimony house for discerning families — a considered,
              human alternative to the noise of the modern marriage market. We
              accept a small circle each season.
            </p>
          </Reveal>
          <Reveal delay={1.1}>
            <div className="mt-12 flex flex-wrap gap-4 items-center">
              <a
                href="#join"
                className="text-[0.7rem] tracking-[0.3em] uppercase bg-gold text-background px-9 py-4 hover:bg-gold-soft transition-colors font-medium"
              >
                Request an Invitation
              </a>
              <a
                href="#philosophy"
                className="text-[0.7rem] tracking-[0.3em] uppercase text-cream/75 hover:text-gold transition-colors border-b border-gold/30 pb-1"
              >
                Our Philosophy
              </a>
            </div>
          </Reveal>
        </motion.div>

        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="md:col-span-5 relative aspect-[3/4] overflow-hidden"
        >
          <img
            src={coupleHero}
            alt="An elegant couple introduced by DesiHerz"
            className="w-full h-full object-cover grayscale-[15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-[0.55rem] tracking-[0.3em] uppercase text-cream/70">
            <span>Pl. XIV</span>
            <span>Mumbai · 2025</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="eyebrow text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-px h-14 bg-gradient-to-b from-gold to-transparent origin-top"
        />
      </motion.div>
    </section>
  );

}

/* ---------------- MANIFESTO MARQUEE ---------------- */
function Manifesto() {
  return (
    <section className="relative z-10 py-32 overflow-hidden">
      <Marquee speed={50}>
        {["Lineage", "Character", "Discretion", "Intention", "Taste", "Patience"].map((w) => (
          <span key={w} className="font-display italic text-[10vw] leading-none text-gold-soft/15">
            {w} ·
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* ---------------- PHILOSOPHY (sticky) ---------------- */
function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yLeft = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yRight = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <Section id="philosophy">
      <div ref={ref} className="grid md:grid-cols-12 gap-12 md:gap-20 max-w-7xl mx-auto w-full items-center">
        <motion.div style={{ y: yLeft }} className="md:col-span-5">
          <Reveal>
            <p className="eyebrow mb-8">— Philosophy</p>
          </Reveal>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.08] font-light text-cream">
            <MaskReveal text="Marriage is an" />
            <br />
            <span className="italic text-gold-soft">
              <MaskReveal text="architecture," delay={0.2} />
            </span>
            <br />
            <MaskReveal text="not an algorithm." delay={0.4} />
          </h2>
          <Reveal delay={0.5}>
            <div className="hairline mt-10 w-24" />
          </Reveal>
          <Reveal delay={0.6}>
            <p className="mt-10 text-base md:text-[17px] leading-[1.75] text-cream/70 font-light max-w-md">
              We do not sort people into swipe stacks. We read the room. Each
              introduction at DesiHerz is the result of long conversation — with
              you, your parents, and the quiet network of families we keep.
            </p>
          </Reveal>
          <Reveal delay={0.75}>
            <p className="mt-6 text-base md:text-[17px] leading-[1.75] text-cream/70 font-light max-w-md">
              Lineage, learning, faith, and humour matter to us as much as
              ambition. We hold space for the specific — for the wedding you
              actually want, the in-laws you can grow with, the life you can
              stay in.
            </p>
          </Reveal>
        </motion.div>
        <motion.div style={{ y: yRight }} className="md:col-span-6 md:col-start-7">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={coupleHands}
                alt="Two hands gently intertwined, henna and antique gold"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/15" />
            </div>
            <div className="mt-4 flex justify-between text-[0.55rem] tracking-[0.3em] uppercase text-muted-foreground">
              <span>Plate II</span>
              <span>A Quiet Promise</span>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </Section>
  );
}


/* ---------------- HORIZONTAL PINNED PROCESS ---------------- */
function PinnedProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  const steps = [
    {
      n: "01",
      t: "The Conversation",
      d: "We meet — at length, in person where possible. We listen to what you don't say, and to what your family does. No forms, no checklists.",
    },
    {
      n: "02",
      t: "The Circle",
      d: "A handful of considered introductions, drawn from families who already know ours. No browsing. No public profile. No noise.",
    },
    {
      n: "03",
      t: "The Alliance",
      d: "We walk alongside both families through meeting, courtship, and the rituals that follow — quietly, attentively, and only as long as you need us.",
    },
  ];

  return (
    <section id="process" ref={ref} className="relative z-10 h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 md:px-14 mb-12">
          <Reveal>
            <p className="eyebrow mb-6">— The Process</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-6xl font-light max-w-3xl">
              <MaskReveal text="Three movements," />
              <br />
              <span className="italic text-gold-soft">
                <MaskReveal text="one understanding." delay={0.2} />
              </span>
            </h2>
          </Reveal>
        </div>
        <motion.div style={{ x }} className="flex gap-8 px-6 md:px-14">
          {steps.map((s) => (
            <article
              key={s.n}
              className="shrink-0 w-[85vw] md:w-[60vw] bg-background/55 backdrop-blur-md border border-gold/12 p-10 md:p-14"
            >
              <div className="flex items-start justify-between mb-16">
                <span className="font-display text-3xl text-gold">{s.n}</span>
                <span className="text-[0.55rem] tracking-[0.28em] uppercase text-muted-foreground">
                  Phase
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-5xl mb-8 text-cream font-light">{s.t}</h3>
              <p className="text-base leading-relaxed text-cream/70 max-w-xl">{s.d}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- STORIES ---------------- */
function Stories() {
  const stories = [
    {
      img: coupleStory1,
      q: "We had given up on the apps and the aunties both. DesiHerz felt like neither — it felt like a friend who happened to know the right people.",
      a: "A. & R.",
      sub: "Married 2025 · Mumbai / London",
    },
    {
      img: coupleStory2,
      q: "What surprised us was the slowness. Nothing was rushed. They understood that the right introduction needed to wait for the right moment.",
      a: "The Khanna Family",
      sub: "Delhi · 2024",
    },
  ];
  return (
    <Section id="stories">
      <div className="max-w-7xl mx-auto w-full">
        <Reveal>
          <p className="eyebrow mb-6">— Quietly Spoken</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.1] max-w-2xl text-cream">
            Stories that begin{" "}
            <span className="italic text-gold-soft">in confidence.</span>
          </h2>
        </Reveal>
        <div className="space-y-28 mt-24">
          {stories.map((s, i) => (
            <Reveal key={i}>
              <figure
                className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center ${
                  i % 2 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="md:col-span-6 relative aspect-[4/5] overflow-hidden">
                  <img
                    src={s.img}
                    alt={`Couple introduced by DesiHerz — ${s.a}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold/15" />
                </div>
                <div className="md:col-span-6">
                  <blockquote className="font-display italic text-2xl md:text-[2.1rem] leading-[1.35] font-light text-cream">
                    “{s.q}”
                  </blockquote>
                  <figcaption className="mt-8 border-t border-gold/15 pt-6">
                    <div className="text-gold-soft font-display text-xl">
                      {s.a}
                    </div>
                    <div className="mt-2 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">
                      {s.sub}
                    </div>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}


/* ---------------- NUMBERS ---------------- */
function Numbers() {
  const stats: [string, string][] = [
    ["38", "Families this season"],
    ["1:6", "Curator to client"],
    ["94%", "Second meeting rate"],
    ["XIV", "Years quietly working"],
  ];
  return (
    <section className="relative z-10 py-32 px-6 md:px-14 border-y border-gold/10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delay={i * 0.1}>
            <div>
              <div className="font-display text-5xl md:text-7xl text-gold-soft font-light">{n}</div>
              <div className="mt-4 text-[0.6rem] tracking-[0.28em] uppercase text-muted-foreground">
                {l}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- JOIN ---------------- */
function Join() {
  return (
    <Section id="join">
      <div className="max-w-4xl mx-auto w-full text-center">
        <Reveal>
          <p className="eyebrow mb-8">— Apply</p>
        </Reveal>
        <h2 className="font-display text-5xl md:text-8xl font-light leading-[0.95]">
          <MaskReveal text="Request an" />
          <br />
          <span className="italic text-gold-soft">
            <MaskReveal text="invitation." delay={0.2} />
          </span>
        </h2>
        <Reveal delay={0.4}>
          <p className="mt-10 text-cream/70 max-w-xl mx-auto leading-relaxed">
            We accept a limited number of families each season. Tell us a little about yourself — we
            read every note personally and reply within a fortnight.
          </p>
        </Reveal>

        <Reveal delay={0.55}>
          <form
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-gold/15 text-left max-w-2xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            {[
              { l: "Full Name", t: "text", n: "name" },
              { l: "Family Email", t: "email", n: "email" },
              { l: "City", t: "text", n: "city" },
              { l: "Year of Birth", t: "text", n: "yob" },
            ].map((f) => (
              <label key={f.n} className="bg-background/70 backdrop-blur-sm p-6 block">
                <span className="block text-[0.55rem] tracking-[0.28em] uppercase text-muted-foreground mb-3">
                  {f.l}
                </span>
                <input
                  type={f.t}
                  name={f.n}
                  className="w-full bg-transparent border-b border-gold/20 focus:border-gold outline-none text-cream py-1 font-display text-lg"
                />
              </label>
            ))}
            <label className="bg-background/70 backdrop-blur-sm p-6 block md:col-span-2">
              <span className="block text-[0.55rem] tracking-[0.28em] uppercase text-muted-foreground mb-3">
                A few lines about you
              </span>
              <textarea
                rows={4}
                className="w-full bg-transparent border-b border-gold/20 focus:border-gold outline-none text-cream py-1 resize-none"
              />
            </label>
            <button
              type="submit"
              className="md:col-span-2 bg-gold text-background py-5 text-[0.65rem] tracking-[0.32em] uppercase hover:bg-gold-soft transition-colors"
            >
              Submit Quietly
            </button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold/10 bg-background/85 backdrop-blur-md px-6 md:px-14 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <div className="font-display text-xl">
            Desi<span className="italic text-gold">Herz</span>
          </div>
          <p className="text-[0.6rem] tracking-[0.28em] uppercase text-muted-foreground mt-2">
            © MMXXV · A Private House
          </p>
        </div>
        <div className="flex gap-8 text-[0.6rem] tracking-[0.28em] uppercase text-muted-foreground">
          <a href="#" className="hover:text-gold transition-colors">Discretion</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
          <a href="mailto:office@desiherz.com" className="hover:text-gold transition-colors">
            office@desiherz.com
          </a>
        </div>
      </div>
    </footer>
  );
}
