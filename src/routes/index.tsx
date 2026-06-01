import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { Section, Reveal, ParallaxText } from "@/components/Reveal";

const Scene3D = lazy(() =>
  import("@/components/Scene3D").then((m) => ({ default: m.Scene3D }))
);

const SITE = {
  name: "DesiHerz",
  tagline: "Private Matrimony for the Discerning",
  description:
    "DesiHerz is an invitation-only matrimony house pairing rooted families with character, taste and intention.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesiHerz — Private Matrimony for the Discerning" },
      {
        name: "description",
        content:
          "DesiHerz is an invitation-only matrimony house. A quiet, considered alliance for families who value lineage, character and intention.",
      },
      { property: "og:title", content: "DesiHerz — Private Matrimony" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DesiHerz — Private Matrimony" },
      { name: "twitter:description", content: SITE.description },
      { name: "theme-color", content: "#09050a" },
      { name: "keywords", content: "private matrimony, luxury matchmaking, Indian matrimony, invitation only, bespoke matchmaking" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,700;1,400&family=Tenor+Sans&family=Jost:wght@200;300;400;500&display=swap",
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
        <Suspense fallback={null}>
          <Scene3D />
          <Cursor />
        </Suspense>
      )}

      <Nav />

      <Hero />
      <Philosophy />
      <Process />
      <Stories />
      <Join />
      <Footer />
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const y = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <section id="top" className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
      <motion.div style={{ opacity, y }} className="max-w-3xl">
        <Reveal>
          <p className="eyebrow mb-8">Est. MMXXV · Invitation Only</p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-light text-cream">
            A quieter way
            <br />
            <span className="italic text-gold-soft">to find forever.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-10 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            DesiHerz is a private matrimony house — a considered, human alternative to the noise of the
            modern marriage market. We work with a small circle of families each season.
          </p>
        </Reveal>
        <Reveal delay={0.6}>
          <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#join"
              className="text-[0.65rem] tracking-[0.32em] uppercase bg-gold text-background px-10 py-4 hover:bg-gold-soft transition-colors"
            >
              Request an Invitation
            </a>
            <a
              href="#philosophy"
              className="text-[0.65rem] tracking-[0.32em] uppercase text-cream/70 hover:text-gold transition-colors"
            >
              Our Philosophy →
            </a>
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="eyebrow text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}

function Philosophy() {
  return (
    <Section id="philosophy" className="bg-gradient-to-b from-transparent via-background/40 to-transparent">
      <div className="grid md:grid-cols-12 gap-12 max-w-7xl mx-auto w-full">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow mb-6">— Our Philosophy</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.05] font-light">
              Marriage is an <span className="italic text-gold-soft">architecture</span>, not an algorithm.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-8 self-end">
          <Reveal delay={0.25}>
            <p className="text-base md:text-lg leading-relaxed text-cream/75">
              We do not sort people into swipe stacks. We read the room. Each introduction at DesiHerz is the
              result of long conversation — with you, your parents, and the quiet network of families we keep.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-base md:text-lg leading-relaxed text-cream/75">
              Lineage, learning, faith, and humour matter to us as much as ambition. We hold space for the
              specific — for the wedding you actually want, the in-laws you can grow with, the life you can stay in.
            </p>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gold/15">
              {[
                ["38", "Families this season"],
                ["1:6", "Curator to client"],
                ["94%", "Second meeting rate"],
              ].map(([n, l]) => (
                <div key={l as string}>
                  <div className="font-display text-3xl md:text-4xl text-gold-soft">{n}</div>
                  <div className="mt-2 text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Process() {
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
    <Section id="process">
      <div className="max-w-6xl mx-auto w-full">
        <Reveal>
          <p className="eyebrow mb-6">— The Process</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-5xl md:text-7xl font-light max-w-3xl">
            Three movements,
            <br />
            <span className="italic text-gold-soft">one understanding.</span>
          </h2>
        </Reveal>

        <div className="mt-24 grid md:grid-cols-3 gap-px bg-gold/10">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={0.15 * i}>
              <div className="bg-background/60 backdrop-blur-sm p-10 md:p-12 h-full border-t border-gold/10">
                <div className="flex items-start justify-between mb-12">
                  <span className="font-display text-2xl text-gold">{s.n}</span>
                  <span className="text-[0.55rem] tracking-[0.28em] uppercase text-muted-foreground">
                    Phase
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl mb-6 text-cream">{s.t}</h3>
                <p className="text-sm leading-relaxed text-cream/65">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Stories() {
  const quotes = [
    {
      q: "We had given up on the apps and the aunties both. DesiHerz felt like neither — it felt like a friend who happened to know the right people.",
      a: "A. & R.",
      sub: "Married 2025 · Mumbai / London",
    },
    {
      q: "What surprised us was the slowness. Nothing was rushed. They understood that the right introduction needed to wait for the right moment.",
      a: "The Khanna Family",
      sub: "Delhi",
    },
  ];
  return (
    <Section id="stories">
      <div className="max-w-5xl mx-auto w-full">
        <Reveal>
          <ParallaxText range={40}>
            <p className="eyebrow mb-6">— Quietly Spoken</p>
          </ParallaxText>
        </Reveal>
        <div className="space-y-32 mt-16">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={0.1}>
              <figure className={`max-w-3xl ${i % 2 ? "ml-auto text-right" : ""}`}>
                <blockquote className="font-display italic text-3xl md:text-5xl leading-[1.2] font-light text-cream">
                  &ldquo;{q.q}&rdquo;
                </blockquote>
                <figcaption className="mt-10">
                  <div className="text-gold-soft font-display text-lg">{q.a}</div>
                  <div className="mt-1 text-[0.6rem] tracking-[0.28em] uppercase text-muted-foreground">
                    {q.sub}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Join() {
  return (
    <Section id="join">
      <div className="max-w-4xl mx-auto w-full text-center">
        <Reveal>
          <p className="eyebrow mb-8">— Apply</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-5xl md:text-8xl font-light leading-[0.95]">
            Request an
            <br />
            <span className="italic text-gold-soft">invitation.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 text-cream/70 max-w-xl mx-auto leading-relaxed">
            We accept a limited number of families each season. Tell us a little about yourself — we read every
            note personally and reply within a fortnight.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
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

function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold/10 bg-background/80 backdrop-blur-md px-6 md:px-14 py-12">
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
          <a href="mailto:office@desiherz.com" className="hover:text-gold transition-colors">office@desiherz.com</a>
        </div>
      </div>
    </footer>
  );
}
