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
const STORY_FRAME_COUNT = 180;
const STORY_FRAME_PATH = "/frames/frame_";

const FILMS = {
  founder: "/videos/founder.mp4",
  spokesperson: "/videos/spokesperson.mp4",
};

type StoryBeat = {
  key: string;
  position: "left-top" | "right-top" | "left-bottom" | "right-bottom" | "center-bottom";
  eyebrow: string;
  title: string;
  body: string;
  enter: number;
  leave: number;
  variant: "fade-up" | "slide-left" | "slide-right" | "scale-up" | "rotate-in";
};

const STORY: StoryBeat[] = [
  {
    key: "listen",
    position: "left-top",
    eyebrow: "01 — The first conversation",
    title: "We begin with what no app can hear.",
    body: "A private conversation, not a form.",
    enter: 0.06,
    leave: 0.24,
    variant: "fade-up",
  },
  {
    key: "verify",
    position: "right-top",
    eyebrow: "02 — Quiet verification",
    title: "Trust is designed before anyone is introduced.",
    body: "Reviewed discreetly. Never browsed.",
    enter: 0.26,
    leave: 0.42,
    variant: "slide-left",
  },
  {
    key: "curate",
    position: "left-bottom",
    eyebrow: "03 — Human curation",
    title: "We reduce noise until only the right signal remains.",
    body: "Two or three names. Never a catalogue.",
    enter: 0.44,
    leave: 0.6,
    variant: "slide-right",
  },
  {
    key: "introduce",
    position: "right-bottom",
    eyebrow: "04 — The introduction",
    title: "A meeting is arranged like a scene, not a notification.",
    body: "Location, pace and privacy, handled before the first hello.",
    enter: 0.62,
    leave: 0.78,
    variant: "scale-up",
  },
  {
    key: "commit",
    position: "center-bottom",
    eyebrow: "05 — Commitment",
    title: "The outcome should feel calm, not manufactured.",
    body: "One ring. One introduction.",
    enter: 0.8,
    leave: 0.97,
    variant: "rotate-in",
  },
];

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
      { name: "theme-color", content: "#f5f3f0" },
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
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,900;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap",
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <div className="dh-root relative min-h-screen selection:bg-[#1a1a1a] selection:text-[#f5f3f0]">
      <Loader />
      {mounted && (
        <>
          <SmoothScroll />
          <Cursor />
        </>
      )}
      <TopNav />
      <main>
        <Hero />
        <FrameStory />
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

function Loader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 550);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`site-loader${hidden ? " is-hidden" : ""}`} aria-hidden="true">
      <span className="site-loader-mark">Desi♥Herz</span>
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

function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.fromTo(
        ".hero-cream > *",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.6 }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="top" className="hero-cream">
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

function FrameStory() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const beats = STORY.map((b) => `.beat-${b.key}`);

      gsap.set(beats, { opacity: 0 });

      if (reduce) {
        progress.current = 0.5;
        gsap.set(beats, { opacity: 1 });
        return;
      }

      const variantFrom: Record<StoryBeat["variant"], gsap.TweenVars> = {
        "fade-up": { y: 22 },
        "slide-left": { x: 46 },
        "slide-right": { x: -46 },
        "scale-up": { scale: 0.92 },
        "rotate-in": { y: 18, rotate: -2 },
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=380%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      });

      STORY.forEach((beat) => {
        const from = variantFrom[beat.variant];
        const dur = Math.max(0.04, (beat.leave - beat.enter) * 0.28);
        tl.fromTo(`.beat-${beat.key}`, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: dur }, beat.enter)
          .to(`.beat-${beat.key}`, { opacity: 0, duration: dur * 0.8 }, beat.leave - dur * 0.8);
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="process" className="frame-section">
      <FrameCanvas frameCount={STORY_FRAME_COUNT} framePath={STORY_FRAME_PATH} progress={progress} />
      <div className="frame-story-copy">
        {STORY.map((beat) => (
          <div key={beat.key} className={`story-pos-${beat.position} beat-${beat.key}`}>
            <p className="story-eyebrow">{beat.eyebrow}</p>
            <h3>{beat.title}</h3>
            <p>{beat.body}</p>
          </div>
        ))}
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
