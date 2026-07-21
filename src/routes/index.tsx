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
  Ported 1:1 from the client's reference (hamzafarooq/claude-code-starter,
  royal-pop-website): a single 900vh scroll container, every section
  position:fixed with opacity driven by raw scroll progress, one frame
  sequence bound to the same progress (accelerated so it finishes by the
  midpoint), and a circle-wipe reveal from the standalone hero into the
  canvas. See js/app.js in that repo for the original.
*/
const FRAME_COUNT = 128;
const FRAME_PATH = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
const FRAME_SPEED = 2.0;
const IMAGE_SCALE = 0.85;

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
    key: "profile",
    align: "left",
    label: "01 / Profile",
    heading: "Every story starts with one honest conversation.",
    body: ["We build your private profile. It is never made public."],
    enter: 8,
    leave: 20,
    animation: "slide-left",
  },
  {
    key: "database",
    align: "right",
    label: "02 / Database",
    heading: "Kept quietly. Searched carefully.",
    body: ["Reviewed by us — never browsed by anyone else."],
    enter: 22,
    leave: 34,
    animation: "slide-right",
  },
  {
    key: "match",
    align: "left",
    label: "03 / Match",
    heading: "We look until the signal is unmistakable.",
    body: ["Two or three names, considered. Never a list."],
    enter: 36,
    leave: 48,
    animation: "clip-reveal",
  },
  {
    key: "process",
    align: "right",
    label: "04 / Process",
    heading: "We walk beside you until you're certain.",
    body: ["Every step guided, from the first hello to the family conversation."],
    enter: 68,
    leave: 78,
    animation: "rotate-in",
  },
  {
    key: "altar",
    align: "left",
    label: "05 / Altar",
    heading: "One ring. One introduction. One yes.",
    body: ["The outcome should feel calm, not manufactured."],
    enter: 80,
    leave: 88,
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
        <canvas id="dh-canvas" />
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
          <li><a href="#profile">Process</a></li>
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
          <a className="cta-button" href="#profile">Watch the process</a>
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
  const [profile, database, match] = SECTIONS.filter((s) => ["profile", "database", "match"].includes(s.key));
  const [process, altar] = SECTIONS.filter((s) => ["process", "altar"].includes(s.key));

  return (
    <div id="scroll-container">
      <ContentSection spec={profile} id="profile" />
      <ContentSection spec={database} />
      <ContentSection spec={match} id="match" />

      <section
        className="scroll-section section-stats"
        data-enter="52"
        data-leave="66"
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

      <ContentSection spec={process} />
      <ContentSection spec={altar} id="story" />

      <section
        className="scroll-section section-cta"
        data-enter="90"
        data-leave="97"
        data-animation="fade-up"
        id="scroll-contact"
      >
        <div className="section-inner cta-inner">
          <span className="section-label">Begin privately</span>
          <h2 className="section-heading">Send a single line.</h2>
          <p className="section-body">No public profile. Seen only by the principal matchmaker.</p>
          <a className="cta-button" href="#contact">Request consultation →</a>
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

/** Ports js/app.js verbatim: frame preload/draw, circle-wipe, section windows, marquee, counters. */
function JourneyController() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollContainer = document.getElementById("scroll-container");
    const canvas = document.getElementById("dh-canvas") as HTMLCanvasElement | null;
    const canvasWrap = document.querySelector<HTMLElement>(".canvas-wrap");
    const heroSection = document.querySelector<HTMLElement>(".hero-standalone");
    const overlay = document.getElementById("dark-overlay");
    if (!scrollContainer || !canvas || !canvasWrap || !heroSection || !overlay) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    let bgColor = "#f5f3f0";
    let currentFrame = -1;

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
    }

    function sampleBgColor(img: HTMLImageElement) {
      try {
        const c = document.createElement("canvas");
        c.width = 16;
        c.height = 16;
        const cx = c.getContext("2d")!;
        cx.drawImage(img, 0, 0, 16, 16);
        const d = cx.getImageData(0, 0, 16, 16).data;
        let r = 0, g = 0, b = 0, n = 0;
        const sample = (x: number, y: number) => {
          const idx = (y * 16 + x) * 4;
          r += d[idx];
          g += d[idx + 1];
          b += d[idx + 2];
          n++;
        };
        for (let x = 0; x < 16; x++) {
          sample(x, 0);
          sample(x, 15);
        }
        for (let y = 1; y < 15; y++) {
          sample(0, y);
          sample(15, y);
        }
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        return `rgb(${r}, ${g}, ${b})`;
      } catch {
        return "#f5f3f0";
      }
    }

    function drawFrame(index: number) {
      const img = frames[index];
      if (!img) return;
      const cw = canvas!.width, ch = canvas!.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
      const dw = iw * scale, dh = ih * scale;
      const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
      ctx!.fillStyle = bgColor;
      ctx!.fillRect(0, 0, cw, ch);
      ctx!.drawImage(img, dx, dy, dw, dh);
      if (index % 20 === 0) {
        bgColor = sampleBgColor(img);
      }
    }

    function preloadFrames() {
      let loaded = 0;
      const loadOne = (i: number) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            frames[i] = img;
            loaded++;
            const pct = Math.round((loaded / FRAME_COUNT) * 100);
            window.dispatchEvent(new CustomEvent("dh:loadprogress", { detail: pct }));
            if (i === 0) bgColor = sampleBgColor(img);
            resolve();
          };
          img.onerror = () => {
            loaded++;
            resolve();
          };
          img.src = FRAME_PATH(i);
        });

      const firstBatch: Promise<void>[] = [];
      for (let i = 0; i < Math.min(10, FRAME_COUNT); i++) firstBatch.push(loadOne(i));

      return Promise.all(firstBatch).then(() => {
        const rest: Promise<void>[] = [];
        for (let i = 10; i < FRAME_COUNT; i++) rest.push(loadOne(i));
        return Promise.all(rest);
      });
    }

    function initFrameBinding() {
      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
          const index = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
          if (index !== currentFrame) {
            currentFrame = index;
            requestAnimationFrame(() => drawFrame(currentFrame));
          }
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

    let cancelled = false;

    sizeCanvas();
    const onResize = () => {
      sizeCanvas();
      drawFrame(currentFrame >= 0 ? currentFrame : 0);
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      window.dispatchEvent(new CustomEvent("dh:loaddone"));
      document.querySelectorAll<HTMLElement>(".scroll-section").forEach((s) => {
        s.style.position = "relative";
        s.style.opacity = "1";
      });
      heroSection.style.opacity = "1";
      canvasWrap.style.clipPath = "circle(90% at 50% 50%)";
    } else {
      preloadFrames().then(() => {
        if (cancelled) return;
        window.dispatchEvent(new CustomEvent("dh:loaddone"));
        drawFrame(0);
        initFrameBinding();
        initHeroTransition();
        initMarquees();
        initDarkOverlayForStats();
        initSections();
        initCounters();
        ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tickerFn);
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
