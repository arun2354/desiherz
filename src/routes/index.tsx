import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { Cursor } from "@/components/Cursor";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

gsap.registerPlugin(ScrollTrigger);

const SITE = {
  name: "DesiHerz",
  description:
    "DesiHerz is an invitation-only matrimony house for discerning people and families who value privacy, character and human curation in Germany and beyond.",
};

const FILMS = {
  founder: "/videos/founder.mp4",
  spokesperson: "/videos/spokesperson.mp4",
};

/*
  Scroll choreography: a single 900vh scroll container, every section
  position:fixed with opacity driven by raw scroll progress, and a
  circle-wipe reveal from the standalone hero into a real scroll-scrubbed
  video (currentTime lerped toward progress * duration each frame,
  instead of a hand-drawn frame sequence).
*/
const HERO_SCRUB_SRC = "/videos/hero-scrub.mp4";
const VIDEO_SPEED = 1.12; // finishes just before the closing CTA, then holds the last frame

type SectionSpec = {
  key: string;
  align: "left" | "right" | null;
  label: string;
  heading: string;
  body: string[];
  enter: number;
  leave: number;
  animation: "fade-up" | "slide-left" | "slide-right" | "scale-up" | "rotate-in" | "stagger-up" | "clip-reveal";
  persist?: boolean;
};

const SECTIONS: SectionSpec[] = [
  {
    key: "discovery",
    align: "left",
    label: "02 / Discovery",
    heading: "It starts with one quiet click.",
    body: ["No swiping, no scrolling through strangers. Just a private introduction, waiting to begin."],
    enter: 4,
    leave: 14,
    animation: "slide-left",
  },
  {
    key: "circle",
    align: "right",
    label: "03 / The Vetted Circle",
    heading: "Kept behind a lock only we hold.",
    body: ["Every profile lives inside a private, vetted circle — reviewed by us, never browsed by anyone else."],
    enter: 17,
    leave: 28,
    animation: "slide-right",
  },
  {
    key: "match",
    align: "left",
    label: "04 / The Match",
    heading: "Heritage and heart, made whole.",
    body: ["One half carries where you come from. The other, where you're going. We introduce you only when both fit."],
    enter: 31,
    leave: 43,
    animation: "clip-reveal",
  },
  {
    key: "proposal",
    align: "right",
    label: "05 / The Proposal",
    heading: "The spark isn't manufactured. It's just introduced.",
    body: ["What happens after that first hello is entirely yours. We only make sure it's worth showing up for."],
    enter: 63,
    leave: 74,
    animation: "rotate-in",
  },
  {
    key: "handinhand",
    align: "left",
    label: "06 / Hand in Hand",
    heading: "From strangers to promised, quietly.",
    body: ["No performance, no audience. Just two people who said yes at their own pace."],
    enter: 77,
    leave: 87,
    animation: "scale-up",
  },
];

const STATS = [
  { value: 0, suffix: "", label: "Public profiles. Ever." },
  { value: 100, suffix: "%", label: "Reviewed before contact." },
  { value: 3, suffix: "", label: "Names considered, never a list." },
  { value: 1, suffix: "", label: "Introduction arranged at a time." },
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
      { name: "theme-color", content: "#1a1410" },
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
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,700;9..144,900&family=Manrope:wght@300;400;500;600;700&display=swap",
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

  return (
    <div className="dh-root relative selection:bg-[#8a2035] selection:text-[#f5ece1]">
      {mounted && <Cursor />}
      <Loader />
      <SiteHeader />
      <HeroStandalone />
      <div className="canvas-wrap">
        <video
          id="dh-scrub-video"
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src={HERO_SCRUB_SRC} type="video/mp4" />
        </video>
      </div>
      <div id="dark-overlay" />
      <Marquee />
      <ScrollJourney />
      <JourneyController />
      <div className="after-journey">
        <Proof />
        <Voices />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

function Loader() {
  const [pct, setPct] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onProgress = (e: Event) => setPct((e as CustomEvent<number>).detail);
    const onDone = () => setHidden(true);
    window.addEventListener("dh:loadprogress", onProgress as EventListener);
    window.addEventListener("dh:loaddone", onDone);
    return () => {
      window.removeEventListener("dh:loadprogress", onProgress as EventListener);
      window.removeEventListener("dh:loaddone", onDone);
    };
  }, []);
  return (
    <div id="loader" className={hidden ? "hidden" : ""}>
      <div className="loader-brand">
        Desi<em>♥</em>Herz
      </div>
      <div id="loader-bar">
        <span id="loader-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div id="loader-percent">{pct}%</div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <nav>
        <div className="logo">
          Desi<span style={{ opacity: 0.7 }}>♥</span>Herz
        </div>
        <ul>
          <li><a href="#discovery">Process</a></li>
          <li><a href="#pledges">Pledges</a></li>
          <li><a href="#story">Story</a></li>
          <li><a className="nav-cta" href="#contact">Private enquiry</a></li>
        </ul>
      </nav>
    </header>
  );
}

function HeroStandalone() {
  return (
    <section className="hero-standalone">
      <div className="hero-inner">
        <span className="section-label">2026 · Private matrimony, Germany and beyond</span>
        <h1 className="hero-heading">
          <span>The right introduction,</span> <span><em>reconsidered.</em></span>
        </h1>
        <p className="hero-tagline">A private, human-led house. Not an app.</p>
        <div className="hero-actions">
          <a className="cta-button" href="#discovery">Watch the process</a>
          <a className="cta-button secondary" href="#contact">Request consultation</a>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll</span>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
          <path d="M7 1v20m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee-wrap" data-scroll-speed="-25" data-enter="38" data-leave="62">
      <div className="marquee-text">Desi♥Herz · Desi♥Herz · Desi♥Herz · Desi♥Herz · Desi♥Herz ·</div>
    </div>
  );
}

function ScrollJourney() {
  const [discovery, circle, match, proposal, handinhand] = SECTIONS;

  return (
    <div id="scroll-container">
      <ContentSection spec={discovery} id="discovery" />
      <ContentSection spec={circle} />
      <ContentSection spec={match} id="match" />

      <section
        className="scroll-section section-stats"
        data-enter="47"
        data-leave="60"
        data-animation="stagger-up"
        id="pledges"
      >
        <div className="stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <span>
                <span className="stat-number" data-value={s.value} data-decimals="0">0</span>
                {s.suffix && <span className="stat-suffix">{s.suffix}</span>}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <ContentSection spec={proposal} />
      <ContentSection spec={handinhand} />

      <section
        className="scroll-section section-cta"
        data-enter="90"
        data-leave="97"
        data-animation="fade-up"
        data-persist="true"
        id="story"
      >
        <div className="section-inner cta-inner">
          <span className="section-label">07 / The Altar</span>
          <h2 className="section-heading">One ring. One introduction. One yes.</h2>
          <p className="section-body">The outcome should feel calm, not manufactured.</p>
          <a className="cta-button" href="#contact">Begin privately →</a>
        </div>
      </section>
    </div>
  );
}

function ContentSection({ spec, id }: { spec: SectionSpec; id?: string }) {
  return (
    <section
      id={id}
      className={`scroll-section section-content align-${spec.align}`}
      data-enter={spec.enter}
      data-leave={spec.leave}
      data-animation={spec.animation}
    >
      <div className="section-inner">
        <span className="section-label">{spec.label}</span>
        <h2 className="section-heading">{spec.heading}</h2>
        {spec.body.map((p, i) => (
          <p className="section-body" key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

/** Scroll choreography: video scrub, circle-wipe, section windows, marquee, counters. */
function JourneyController() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollContainer = document.getElementById("scroll-container");
    const video = document.getElementById("dh-scrub-video") as HTMLVideoElement | null;
    const canvasWrap = document.querySelector<HTMLElement>(".canvas-wrap");
    const heroSection = document.querySelector<HTMLElement>(".hero-standalone");
    const overlay = document.getElementById("dark-overlay");
    if (!scrollContainer || !video || !canvasWrap || !heroSection || !overlay) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    let targetProgress = 0;
    let videoReady = false;

    const scrubFn = () => {
      if (!videoReady || !video.duration) return;
      const target = Math.min(targetProgress * VIDEO_SPEED, 1) * video.duration;
      const current = video.currentTime;
      const next = current + (target - current) * 0.12;
      if (Math.abs(next - current) > 0.004) video.currentTime = next;
    };
    gsap.ticker.add(scrubFn);

    function initVideoScrub() {
      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });
    }

    function initHeroTransition() {
      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          heroSection!.style.opacity = String(Math.max(0, 1 - p * 15));
          heroSection!.style.pointerEvents = p > 0.05 ? "none" : "auto";
          const wipeProgress = Math.min(1, Math.max(0, (p - 0.01) / 0.06));
          const radius = wipeProgress * 90;
          canvasWrap!.style.clipPath = `circle(${radius}% at 50% 50%)`;
        },
      });
    }

    function initMarquees() {
      document.querySelectorAll<HTMLElement>(".marquee-wrap").forEach((el) => {
        const speed = parseFloat(el.dataset.scrollSpeed || "-25");
        const enter = parseFloat(el.dataset.enter || "0") / 100;
        const leave = parseFloat(el.dataset.leave || "100") / 100;
        const text = el.querySelector<HTMLElement>(".marquee-text");
        if (!text) return;

        gsap.to(text, {
          xPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: scrollContainer, start: "top top", end: "bottom bottom", scrub: true },
        });

        ScrollTrigger.create({
          trigger: scrollContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            const fade = 0.04;
            let opacity = 0;
            if (p >= enter - fade && p <= enter) opacity = (p - (enter - fade)) / fade;
            else if (p > enter && p < leave) opacity = 1;
            else if (p >= leave && p <= leave + fade) opacity = 1 - (p - leave) / fade;
            el.style.opacity = String(opacity);
          },
        });
      });
    }

    function initDarkOverlayForStats() {
      const stats = document.querySelector<HTMLElement>(".section-stats");
      if (!stats) return;
      const enter = parseFloat(stats.dataset.enter || "0") / 100;
      const leave = parseFloat(stats.dataset.leave || "100") / 100;
      const fadeRange = 0.04;

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          let opacity = 0;
          if (p >= enter - fadeRange && p <= enter) opacity = 0.9 * ((p - (enter - fadeRange)) / fadeRange);
          else if (p > enter && p < leave) opacity = 0.9;
          else if (p >= leave && p <= leave + fadeRange) opacity = 0.9 * (1 - (p - leave) / fadeRange);
          overlay!.style.opacity = String(opacity);
        },
      });
    }

    function setupSectionAnimation(section: HTMLElement) {
      const type = section.dataset.animation;
      const persist = section.dataset.persist === "true";
      const enter = parseFloat(section.dataset.enter || "0") / 100;
      const leave = parseFloat(section.dataset.leave || "100") / 100;
      const children = section.querySelectorAll(
        ".section-label, .section-heading, .section-body, .section-note, .cta-button, .stat"
      );

      const tl = gsap.timeline({ paused: true });
      switch (type) {
        case "fade-up":
          tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
          break;
        case "slide-left":
          tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
          break;
        case "slide-right":
          tl.from(children, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
          break;
        case "scale-up":
          tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" });
          break;
        case "rotate-in":
          tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" });
          break;
        case "stagger-up":
          tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
          break;
        case "clip-reveal":
          tl.from(children, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut" });
          break;
        default:
          tl.from(children, { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
      }

      const animateInPoint = enter + 0.02;
      let played = false;

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const fade = 0.03;
          let opacity = 0;
          if (p >= enter - fade && p <= enter) opacity = (p - (enter - fade)) / fade;
          else if (p > enter && p < leave) opacity = 1;
          else if (persist && p >= leave) opacity = 1;
          else if (p >= leave && p <= leave + fade) opacity = 1 - (p - leave) / fade;
          section.style.opacity = String(opacity);
          section.classList.toggle("is-active", opacity > 0.5);

          if (p >= animateInPoint && !played) {
            tl.play();
            played = true;
          }
          if (!persist && p < enter - fade && played) {
            tl.reverse();
            played = false;
          }
        },
      });
    }

    function initSections() {
      document.querySelectorAll<HTMLElement>(".scroll-section").forEach(setupSectionAnimation);
    }

    function initCounters() {
      document.querySelectorAll<HTMLElement>(".stat-number").forEach((el) => {
        const target = parseFloat(el.dataset.value || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const section = el.closest<HTMLElement>(".scroll-section");
        if (!section) return;
        const enter = parseFloat(section.dataset.enter || "0") / 100;
        let played = false;

        ScrollTrigger.create({
          trigger: scrollContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            if (self.progress >= enter + 0.01 && !played) {
              played = true;
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power1.out",
                onUpdate: () => {
                  el.textContent = decimals === 0 ? Math.round(obj.val).toString() : obj.val.toFixed(decimals);
                },
              });
            }
          },
        });
      });
    }

    if (reduce) {
      video.autoplay = true;
      video.loop = true;
      video.play().catch(() => {});
      window.dispatchEvent(new CustomEvent("dh:loaddone"));
      document.querySelectorAll<HTMLElement>(".scroll-section").forEach((s) => {
        s.style.position = "relative";
        s.style.opacity = "1";
      });
      heroSection.style.opacity = "1";
      canvasWrap.style.clipPath = "circle(90% at 50% 50%)";
    } else {
      const onProgress = () => {
        if (!video.duration || !video.buffered.length) return;
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
        window.dispatchEvent(new CustomEvent("dh:loadprogress", { detail: pct }));
      };
      const onReady = () => {
        videoReady = true;
        window.dispatchEvent(new CustomEvent("dh:loadprogress", { detail: 100 }));
        window.dispatchEvent(new CustomEvent("dh:loaddone"));
        initVideoScrub();
        initHeroTransition();
        initMarquees();
        initDarkOverlayForStats();
        initSections();
        initCounters();
        ScrollTrigger.refresh();
      };
      video.addEventListener("progress", onProgress);
      if (video.readyState >= 1) {
        onReady();
      } else {
        video.addEventListener("loadedmetadata", onReady, { once: true });
      }

      return () => {
        video.removeEventListener("progress", onProgress);
        video.removeEventListener("loadedmetadata", onReady);
        gsap.ticker.remove(tickerFn);
        gsap.ticker.remove(scrubFn);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    return () => {
      gsap.ticker.remove(tickerFn);
      gsap.ticker.remove(scrubFn);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}

function Proof() {
  const quotes = useMemo(() => TESTIMONIALS, []);
  return (
    <section className="proof-section">
      <motion.div
        className="section-heading-simple"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="section-label">Proof, softly</span>
        <h2>People remember how the introduction felt.</h2>
      </motion.div>
      <motion.div
        className="proof-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {quotes.map((q) => (
          <motion.article
            key={q.who}
            className="quote-card"
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            whileHover={{ y: -6 }}
          >
            <p>&ldquo;{q.quote}&rdquo;</p>
            <footer>{q.who} / {q.city}</footer>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

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
    <motion.figure
      className="feature-video"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div className="feature-video-frame" whileHover={{ scale: 1.015 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        {ready ? (
          <video src={film} controls preload="metadata" playsInline aria-label={alt} />
        ) : (
          <div className="media-slate" aria-hidden="true">
            <div className="media-slate-mark"><span /></div>
          </div>
        )}
      </motion.div>
      <figcaption>
        <strong>{title}</strong>
        <span>{role}</span>
      </figcaption>
    </motion.figure>
  );
}

function Voices() {
  return (
    <section className="voices-section">
      <motion.div
        className="section-heading-simple"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="section-label">In their own words</span>
        <h2>Hear it directly.</h2>
      </motion.div>
      <div className="voices-grid">
        <VideoFeature title="The founder" role="Why DesiHerz exists" film={FILMS.founder} alt="The founder of DesiHerz speaking about the house." />
        <VideoFeature title="In conversation" role="A closer look at the house" film={FILMS.spokesperson} alt="A spokesperson speaking about DesiHerz." />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <motion.div
        className="contact-panel"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <span className="section-label">Begin privately</span>
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
          <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Request consultation <span>→</span>
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <motion.footer
      className="dh-footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div>
        <strong>Desi♥Herz</strong>
        <p>Private matrimony for discerning people and families. By introduction only.</p>
      </div>
      <div>
        <span>Frankfurt am Main</span>
        <span>By appointment only</span>
        <span>hello@desiherz.com</span>
      </div>
    </motion.footer>
  );
}
