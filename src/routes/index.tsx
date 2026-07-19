import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { FrameCanvas } from "@/components/FrameCanvas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SITE = {
  name: "DesiHerz",
  description:
    "DesiHerz is an invitation-only matrimony house for discerning people and families who value privacy, character and human curation in Germany and beyond.",
};

/*
  The center-stage sequence below is a "video-to-website" build: a short
  rings turntable video gets extracted into a still-frame sequence with
  ffmpeg (see scripts/extract-frames.sh), and scroll picks the matching
  frame instead of playing the video back in real time. Until frames exist
  at /public/frames/, FrameCanvas falls back to a plain ring placeholder.
*/
const STORY_FRAME_COUNT = 128;
const STORY_FRAME_PATH = "/frames/frame_";

const FILMS = {
  founder: "/videos/founder.mp4",
  spokesperson: "/videos/spokesperson.mp4",
  promo: "/videos/promo.mp4",
};

type StoryChapter = {
  key: string;
  step: string;
  eyebrow: string;
  title: string;
  body: string;
  enter: number;
  leave: number;
};

/*
  The story is told in two movements:
  1. CHAPTERS — four pure-typography scenes (no imagery yet; nothing to
     show for these stages). Big type, one at a time, like the client's
     oryzo.ai reference.
  2. ALTAR — the one asset we actually have (the rings turntable video)
     is held back as the payoff at the very end, not spent up front.
*/
const CHAPTERS: StoryChapter[] = [
  {
    key: "profile",
    step: "01",
    eyebrow: "The profile",
    title: "Every story starts with one honest conversation.",
    body: "We build your private profile. It is never made public.",
    enter: 0.04,
    leave: 0.27,
  },
  {
    key: "database",
    step: "02",
    eyebrow: "The database",
    title: "Kept quietly. Searched carefully.",
    body: "Reviewed by us — never browsed by anyone else.",
    enter: 0.27,
    leave: 0.5,
  },
  {
    key: "match",
    step: "03",
    eyebrow: "The match",
    title: "We look until the signal is unmistakable.",
    body: "Two or three names, considered. Never a list.",
    enter: 0.5,
    leave: 0.73,
  },
  {
    key: "process",
    step: "04",
    eyebrow: "The process",
    title: "We walk beside you until you're certain.",
    body: "Every step guided, from the first hello to the family conversation.",
    enter: 0.73,
    leave: 0.96,
  },
];

const ALTAR = {
  step: "05",
  eyebrow: "The altar",
  title: "One ring. One introduction. One yes.",
  body: "The outcome should feel calm, not manufactured.",
};

const STATS = [
  { value: "00", label: "Public profiles. Ever." },
  { value: "100%", label: "Reviewed before contact." },
  { value: "2–3", label: "Names considered, never a list." },
  { value: "1", label: "Introduction arranged at a time." },
];

const TESTIMONIALS = [
  {
    quote: "The process felt private without feeling cold. We were introduced with context, care and no pressure to perform.",
    who: "M. & A.",
    city: "Frankfurt",
  },
  {
    quote: "They understood that our families mattered, but they never let the family conversation overpower our own choice.",
    who: "N. & R.",
    city: "Munich",
  },
  {
    quote: "It was the opposite of an app. No noise, no public profile, just one introduction that made sense.",
    who: "S. & K.",
    city: "Berlin",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesiHerz — Private Matrimony for the Discerning" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "DesiHerz — Private Matrimony" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#100904" },
      {
        name: "keywords",
        content:
          "private matrimony, luxury matchmaking, curated introductions, invitation only matchmaking, Frankfurt matrimony, Germany",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          description: SITE.description,
          url: "/",
          areaServed: "Germany",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  if (!entered) {
    return <Gate onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="dh-root relative min-h-screen selection:bg-[#c8964f] selection:text-[#100904]">
      {mounted && (
        <>
          <SmoothScroll />
          <Cursor />
        </>
      )}
      <TopNav />
      <main>
        <Hero />
        <StoryChapters />
        <Altar />
        <Marquee />
        <Stats />
        <Proof />
        <Voices />
        <Contact />
      </main>
      <Footer />
      <PersistentCta />
    </div>
  );
}

/** The invitation landing: a deliberate load, then a single door to open. No scroll. */
function Gate({ onEnter }: { onEnter: () => void }) {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPct(100);
      setReady(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const DURATION = 2200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 560);
  };

  return (
    <div className={`gate${leaving ? " is-leaving" : ""}`}>
      <div className="gate-bg" aria-hidden="true">
        <img src="/frames/frame_0110.jpg" alt="" />
      </div>

      <div className="gate-top">
        <p className="gate-mark">
          Desi<em>♥</em>Herz
        </p>
        <p className="gate-tag">Est. Frankfurt</p>
      </div>

      <div className="gate-main">
        <h1 className="gate-headline">
          Your <em>life partner</em> is waiting.
        </h1>
        {ready ? (
          <button className="gate-enter" onClick={handleEnter}>
            Enter <span>→</span>
          </button>
        ) : (
          <div className="gate-loading" aria-hidden="true">
            <span className="gate-pct">{pct}%</span>
            <div className="gate-bar">
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TopNav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      ref.current.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={ref} className="dh-nav">
      <a href="#top" className="dh-logo" aria-label="DesiHerz home">
        <span>Desi</span>
        <em className="dh-logo-heart">♥</em>
        <span>Herz</span>
      </a>
      <nav className="dh-nav-links" aria-label="Primary navigation">
        <a href="#process">Process</a>
        <a href="#pledges">Pledges</a>
        <a href="#story">Story</a>
        <a href="#contact">Contact</a>
      </nav>
      <a href="#contact" className="dh-nav-cta">Private enquiry</a>
    </header>
  );
}

function HeroBackgroundVideo() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(FILMS.promo, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (!ready) return null;
  return (
    <div className="hero-bg-video" aria-hidden="true">
      <video src={FILMS.promo} autoPlay muted loop playsInline preload="auto" />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.fromTo(
        ".hero-cream > *",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.3 }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="top" className="hero-cream">
      <HeroBackgroundVideo />
      <p className="dh-kicker hero-eyebrow">Private matrimony / Germany and beyond</p>
      <h1>
        The right introduction, <em>reconsidered.</em>
      </h1>
      <p className="hero-sub">A private, human-led house. Not an app.</p>
      <div className="hero-actions">
        <a href="#process" className="dh-button primary">Watch the process</a>
        <a href="#contact" className="dh-button secondary">Request consultation</a>
      </div>
      <div className="hero-scroll-hint">Scroll</div>
    </section>
  );
}

/** Movement 1: four pure-typography chapters. No imagery — nothing to show yet for these stages. */
function StoryChapters() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scenes = gsap.utils.toArray<HTMLElement>(".chapter-scene");
      if (!scenes.length) return;

      gsap.set(scenes, { autoAlpha: 0, y: 26 });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0 });

      if (reduce) {
        gsap.set(scenes, { autoAlpha: 1, y: 0, position: "relative" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.6,
        },
      });

      scenes.forEach((scene, i) => {
        if (i === 0) return;
        tl.to(scenes[i - 1], { autoAlpha: 0, y: -30, duration: 0.6 }, ">+=0.2")
          .fromTo(scene, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "<");
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="process" className="chapters-section">
      {CHAPTERS.map((c) => (
        <article key={c.key} className="chapter-scene">
          <span className="chapter-numeral" aria-hidden="true">{c.step}</span>
          <div className="chapter-copy">
            <p className="dh-kicker">
              {c.step} — {c.eyebrow}
            </p>
            <h2>{c.title}</h2>
            <p className="chapter-body">{c.body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

/** Movement 2: the payoff. The one real asset we have, held back until the end. */
function Altar() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".altar-copy", { opacity: 0, y: 22 });

      if (reduce) {
        progress.current = 1;
        gsap.set(".altar-copy", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      });

      tl.to(".altar-copy", { opacity: 1, y: 0, duration: 0.2 }, 0.72);
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="altar" className="frame-section">
      <FrameCanvas frameCount={STORY_FRAME_COUNT} framePath={STORY_FRAME_PATH} progress={progress} />
      <div className="frame-story-copy">
        <div className="story-pos-center-bottom altar-copy">
          <p className="story-eyebrow">
            {ALTAR.step} — {ALTAR.eyebrow}
          </p>
          <h3>{ALTAR.title}</h3>
          <p>{ALTAR.body}</p>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !trackRef.current) return;
    gsap.to(trackRef.current, { xPercent: -50, ease: "none", duration: 26, repeat: -1 });
  });

  const words = ["Desi♥Herz", "Private", "Verified", "Curated", "By invitation"];
  return (
    <section className="marquee-section" aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {[0, 1].map((rep) => (
          <span key={rep}>
            {words.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".stat-tile", {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 74%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="pledges" className="stats-section on-dark">
      <div className="stats-heading">
        <p className="dh-kicker">Four rules that protect the story</p>
        <h2>Not marketing claims. The operating rules of the house.</h2>
      </div>
      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stat-tile">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Proof() {
  const ref = useRef<HTMLElement>(null);
  const quotes = useMemo(() => TESTIMONIALS, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".quote-card", {
        opacity: 0,
        y: 22,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 74%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="story" className="proof-section">
      <div className="section-heading-simple">
        <p className="dh-kicker">Proof, softly</p>
        <h2>People remember how the introduction felt.</h2>
      </div>
      <div className="proof-grid">
        {quotes.map((q) => (
          <article key={q.who} className="quote-card">
            <p>&ldquo;{q.quote}&rdquo;</p>
            <footer>{q.who} / {q.city}</footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function VideoFeature({
  title,
  role,
  film,
  alt,
}: {
  title: string;
  role: string;
  film: string;
  alt: string;
}) {
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
    <figure className="feature-video">
      <div className="feature-video-frame">
        {ready ? (
          <video src={film} controls preload="metadata" playsInline aria-label={alt} />
        ) : (
          <div className="media-slate" aria-hidden="true">
            <div className="media-slate-mark">
              <span />
            </div>
          </div>
        )}
      </div>
      <figcaption>
        <strong>{title}</strong>
        <span>{role}</span>
      </figcaption>
    </figure>
  );
}

function Voices() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".feature-video", {
        opacity: 0,
        y: 22,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 74%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="voices" className="voices-section">
      <div className="section-heading-simple">
        <p className="dh-kicker">In their own words</p>
        <h2>Hear it directly.</h2>
      </div>

      <div className="voices-grid">
        <VideoFeature
          title="The founder"
          role="Why DesiHerz exists"
          film={FILMS.founder}
          alt="The founder of DesiHerz speaking about the house."
        />
        <VideoFeature
          title="In conversation"
          role="A closer look at the house"
          film={FILMS.spokesperson}
          alt="A spokesperson speaking about DesiHerz."
        />
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".contact-panel > *", {
        opacity: 0,
        y: 20,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="contact" className="contact-section">
      <div className="contact-panel">
        <p className="dh-kicker">Begin privately</p>
        <h2>
          Send a single line. <em>We&rsquo;ll write back.</em>
        </h2>
        <p>No public profile. Seen only by the principal matchmaker.</p>
        <form onSubmit={(e) => e.preventDefault()} className="contact-form">
          <label>
            <span>Your name</span>
            <input type="text" placeholder="As your family calls you" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="discreet@you.com" />
          </label>
          <label className="full">
            <span>A note</span>
            <input type="text" placeholder="One or two sentences is enough." />
          </label>
          <button type="submit">Request consultation <span>→</span></button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="dh-footer">
      <div>
        <strong>Desi♥Herz</strong>
        <p>Private matrimony for discerning people and families. By introduction only.</p>
      </div>
      <div>
        <span>Frankfurt am Main</span>
        <span>By appointment only</span>
        <span>hello@desiherz.com</span>
      </div>
    </footer>
  );
}

function PersistentCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contact");
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const overContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setVisible(pastHero && !overContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`persistent-cta${visible ? " is-visible" : ""}`}>
      <a href="#contact">Private enquiry</a>
    </div>
  );
}
