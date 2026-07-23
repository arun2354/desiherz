import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, animate } from "framer-motion";
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
  circle-wipe reveal from the standalone hero into a frame sequence drawn
  to canvas. Real <video> currentTime-scrubbing was tried first, but
  every seek decodes from the nearest keyframe -- on real hardware that
  reads as softness/lag during fast scroll. Canvas drawImage has no
  decode latency, so scrubbing is exactly as smooth as the scroll input
  and every frame is exactly as sharp as its source JPEG.
*/
const FRAME_COUNT = 100;
const FRAME_PATH = (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

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
    label: "01 / Discovery",
    heading: "It starts with one quiet click.",
    body: ["No swiping, no scrolling through strangers. Just a private introduction, waiting to begin."],
    enter: 3,
    leave: 13,
    animation: "slide-left",
  },
  {
    key: "circle",
    align: "right",
    label: "02 / The Vetted Circle",
    heading: "Kept behind a lock only we hold.",
    body: ["Every profile lives inside a private, vetted circle — reviewed by us, never browsed by anyone else."],
    enter: 17,
    leave: 27,
    animation: "slide-right",
  },
  {
    key: "match",
    align: "left",
    label: "03 / The Match",
    heading: "Heritage and heart, made whole.",
    body: ["One half carries where you come from. The other, where you're going. We introduce you only when both fit."],
    enter: 32,
    leave: 42,
    animation: "clip-reveal",
  },
  {
    key: "proposal",
    align: "right",
    label: "04 / The Proposal",
    heading: "The spark isn't manufactured. It's just introduced.",
    body: ["What happens after that first hello is entirely yours. We only make sure it's worth showing up for."],
    enter: 47,
    leave: 57,
    animation: "rotate-in",
  },
  {
    key: "handinhand",
    align: "left",
    label: "05 / Hand in Hand",
    heading: "From strangers to promised, quietly.",
    body: ["No performance, no audience. Just two people who said yes at their own pace."],
    enter: 62,
    leave: 72,
    animation: "scale-up",
  },
];

const PROCESS_PREVIEW = [
  { n: "01", label: "Discovery", teaser: "You find us." },
  { n: "02", label: "Vetted circle", teaser: "We keep it private." },
  { n: "03", label: "The match", teaser: "We look for fit." },
  { n: "04", label: "The proposal", teaser: "You decide, freely." },
  { n: "05", label: "Hand in hand", teaser: "It becomes real." },
  { n: "06", label: "The altar", teaser: "You arrive together." },
];

const STATS = [
  { value: 0, suffix: "", label: "Public profiles. Ever." },
  { value: 100, suffix: "%", label: "Reviewed before contact." },
  { value: 3, suffix: "", label: "Names considered, never a list." },
  { value: 1, suffix: "", label: "Introduction arranged at a time." },
];

const VALUES = [
  { n: "01", label: "Privacy", body: "No public profile, ever. Your search exists only between you and the house." },
  { n: "02", label: "Curation", body: "Every introduction is reviewed by a person, not a matching algorithm optimizing for engagement." },
  { n: "03", label: "Commitment", body: "We stay with you from the first hello to the family conversation, not just the first message." },
];

const FAQS = [
  {
    q: "What is DesiHerz?",
    a: "A private, invitation-led matrimony house. We build a discreet profile, search our own vetted circle, and arrange introductions by hand.",
  },
  {
    q: "Is my profile ever made public?",
    a: "No. Nothing about you is browsable, searchable, or visible to anyone outside the house. Only the principal matchmaker reviews your profile.",
  },
  {
    q: "How many introductions do I get at once?",
    a: "Two or three names, considered carefully — never a list to scroll through.",
  },
  {
    q: "Can a parent search on my behalf?",
    a: "Yes. Many families begin the enquiry together, and we're glad to work directly with parents throughout the process.",
  },
  {
    q: "What happens after an introduction?",
    a: "What happens next is entirely yours. We step back once the introduction is made and are only ever a message away if you need us.",
  },
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

/**
 * Sections inside #scroll-container are position:fixed, layered on top of
 * each other and shown/hidden purely by scroll percentage -- a native
 * href="#id" anchor jump can't scroll to them (fixed elements don't have a
 * meaningful document position for the browser to target). This computes
 * the real scrollY for a given journey percentage instead.
 */
function scrollToJourney(percent: number) {
  const container = document.getElementById("scroll-container");
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const containerTop = window.scrollY + rect.top;
  const containerHeight = container.offsetHeight;
  const viewportH = window.innerHeight;
  const target = containerTop + (percent / 100) * (containerHeight - viewportH);
  window.scrollTo({ top: target, behavior: "smooth" });
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesiHerz — Private Matrimony for the Discerning" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "DesiHerz — Private Matrimony" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#0d1115" },
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
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap",
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
    <div className="dh-root relative selection:bg-[#b8272f] selection:text-[#edeef0]">
      {mounted && <Cursor />}
      {mounted && <CoordReadout />}
      <Loader />
      <SiteHeader />
      <HeroStandalone />
      <ProcessPreview />
      <div className="canvas-wrap">
        <canvas id="dh-canvas" aria-hidden="true" />
      </div>
      <ScrollJourney />
      <JourneyController />
      <div className="after-journey">
        <ValuesBand />
        <Stats />
        <Proof />
        <Voices />
        <FAQSection />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

function CoordReadout() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="coord-readout" aria-hidden="true">
      <div>X: {String(pos.x).padStart(4, "0")}</div>
      <div>Y: {String(pos.y).padStart(4, "0")}</div>
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
          <li><a href="#discovery" onClick={(e) => { e.preventDefault(); scrollToJourney(5); }}>Process</a></li>
          <li><a href="#pledges">Pledges</a></li>
          <li><a href="#story" onClick={(e) => { e.preventDefault(); scrollToJourney(80); }}>Story</a></li>
          <li><a className="nav-cta" href="#contact">Private enquiry</a></li>
        </ul>
      </nav>
    </header>
  );
}

function HeroStandalone() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Belt-and-braces for the loop attribute: force a restart on 'ended', and
    // resume playback if a browser auto-pauses the tab and doesn't resume it.
    const restart = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    const resumeIfPaused = () => {
      if (video.paused && document.visibilityState === "visible") video.play().catch(() => {});
    };
    video.addEventListener("ended", restart);
    document.addEventListener("visibilitychange", resumeIfPaused);
    return () => {
      video.removeEventListener("ended", restart);
      document.removeEventListener("visibilitychange", resumeIfPaused);
    };
  }, []);

  return (
    <section className="hero-standalone">
      <video ref={videoRef} className="hero-bg-video" autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true">
        <source src="/videos/main-loop.mp4" type="video/mp4" />
      </video>
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="corner-bracket tl" aria-hidden="true" />
      <div className="corner-bracket tr" aria-hidden="true" />
      <div className="corner-bracket bl" aria-hidden="true" />
      <div className="corner-bracket br" aria-hidden="true" />
      <div className="hero-inner">
        <span className="section-label">DesiHerz · Private matrimony unit</span>
        <h1 className="hero-heading">
          <span>The right introduction,</span>
          <span><em>reconsidered.</em></span>
        </h1>
        <p className="hero-tagline">A private, human-led house. Scroll down to see exactly how an introduction happens.</p>
        <div className="hero-actions">
          <a className="cta-button" href="#discovery" onClick={(e) => { e.preventDefault(); scrollToJourney(5); }}>Watch the process</a>
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

function ProcessPreview() {
  return (
    <section className="process-preview">
      <motion.div
        className="section-heading-simple"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="section-label">Before you scroll</span>
        <h2>Here&rsquo;s exactly how it works.</h2>
        <p className="process-preview-sub">Six steps, no guesswork. Scroll to watch each one unfold.</p>
      </motion.div>
      <motion.div
        className="process-preview-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {PROCESS_PREVIEW.map((s) => (
          <motion.div key={s.n} className="process-preview-step" variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
            <span className="process-preview-n">{s.n}</span>
            <strong>{s.label}</strong>
            <span>{s.teaser}</span>
          </motion.div>
        ))}
      </motion.div>
      <div className="process-preview-cue">Scroll to begin ↓</div>
    </section>
  );
}

function ScrollJourney() {
  const [discovery, circle, match, proposal, handinhand] = SECTIONS;

  return (
    <div id="scroll-container">
      <ContentSection spec={discovery} id="discovery" />
      <ContentSection spec={circle} />
      <ContentSection spec={match} id="match" />
      <ContentSection spec={proposal} />
      <ContentSection spec={handinhand} />

      <section
        className="scroll-section section-cta"
        data-enter="78"
        data-leave="86"
        data-animation="fade-up"
        data-persist="true"
        id="story"
      >
        <div className="section-inner cta-inner">
          <span className="section-label">06 / The Altar</span>
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

/** Scroll choreography: frame-sequence scrub, circle-wipe, section windows, counters. */
function JourneyController() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollContainer = document.getElementById("scroll-container");
    const canvas = document.getElementById("dh-canvas") as HTMLCanvasElement | null;
    const canvasWrap = document.querySelector<HTMLElement>(".canvas-wrap");
    const heroSection = document.querySelector<HTMLElement>(".hero-standalone");
    if (!scrollContainer || !canvas || !canvasWrap || !heroSection) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    let bgColor = "#1a1410";
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
        return "#1a1410";
      }
    }

    function drawFrame(index: number) {
      const img = frames[index];
      if (!img) return;
      const cw = canvas!.width, ch = canvas!.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
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
      for (let i = 0; i < Math.min(12, FRAME_COUNT); i++) firstBatch.push(loadOne(i));

      return Promise.all(firstBatch).then(() => {
        const rest: Promise<void>[] = [];
        for (let i = 12; i < FRAME_COUNT; i++) rest.push(loadOne(i));
        return Promise.all(rest);
      });
    }

    function buildTimeline(section: HTMLElement) {
      const children = section.querySelectorAll(
        ".section-label, .section-heading, .section-body, .section-note, .cta-button"
      );
      const tl = gsap.timeline({ paused: true });
      switch (section.dataset.animation) {
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
      return tl;
    }

    /**
     * One ScrollTrigger drives everything (frame index, hero fade/wipe, every
     * section's opacity + timeline). GSAP's own performance guidance flags
     * redundant same-range triggers -- this build had eight of them, each
     * recomputing scroll progress independently every frame.
     */
    function initMasterScroll() {
      const sections = Array.from(document.querySelectorAll<HTMLElement>(".scroll-section")).map((section) => ({
        section,
        persist: section.dataset.persist === "true",
        enter: parseFloat(section.dataset.enter || "0") / 100,
        leave: parseFloat(section.dataset.leave || "100") / 100,
        tl: buildTimeline(section),
        played: false,
      }));

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          const index = Math.min(Math.floor(p * FRAME_COUNT), FRAME_COUNT - 1);
          if (index !== currentFrame) {
            currentFrame = index;
            requestAnimationFrame(() => drawFrame(currentFrame));
          }

          heroSection!.style.opacity = String(Math.max(0, 1 - p * 15));
          heroSection!.style.pointerEvents = p > 0.05 ? "none" : "auto";
          const wipeProgress = Math.min(1, Math.max(0, (p - 0.01) / 0.06));
          canvasWrap!.style.clipPath = `circle(${wipeProgress * 90}% at 50% 50%)`;

          const fade = 0.03;
          for (const m of sections) {
            let opacity = 0;
            if (p >= m.enter - fade && p <= m.enter) opacity = (p - (m.enter - fade)) / fade;
            else if (p > m.enter && p < m.leave) opacity = 1;
            else if (m.persist && p >= m.leave) opacity = 1;
            else if (p >= m.leave && p <= m.leave + fade) opacity = 1 - (p - m.leave) / fade;
            m.section.style.opacity = String(opacity);
            m.section.classList.toggle("is-active", opacity > 0.5);

            const animateInPoint = m.enter + 0.02;
            if (p >= animateInPoint && !m.played) {
              m.tl.play();
              m.played = true;
            }
            if (!m.persist && p < m.enter - fade && m.played) {
              m.tl.reverse();
              m.played = false;
            }
          }
        },
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
      const img = new Image();
      img.onload = () => {
        frames[FRAME_COUNT - 1] = img;
        drawFrame(FRAME_COUNT - 1);
      };
      img.src = FRAME_PATH(FRAME_COUNT - 1);
    } else {
      preloadFrames().then(() => {
        if (cancelled) return;
        window.dispatchEvent(new CustomEvent("dh:loaddone"));
        drawFrame(0);
        initMasterScroll();
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

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [display, setDisplay] = useState(0);
  return (
    <motion.div
      className="stat"
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.6 }}
      onViewportEnter={() => {
        animate(0, value, {
          duration: 1.6,
          ease: "easeOut",
          onUpdate: (v) => setDisplay(Math.round(v)),
        });
      }}
    >
      <span>
        <span className="stat-number">{display}</span>
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

function ValuesBand() {
  return (
    <section id="pledges" className="values-band">
      <motion.div
        className="section-heading-simple"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="section-label">Guiding principles</span>
        <h2>Our pledges.</h2>
      </motion.div>
      <motion.div
        className="values-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {VALUES.map((v) => (
          <motion.div key={v.n} className="value-card" variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
            <span className="value-n">{v.n}</span>
            <strong>{v.label}</strong>
            <p>{v.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="faq-section">
      <motion.div
        className="section-heading-simple"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="section-label">Frequently asked</span>
        <h2>A few things people ask.</h2>
      </motion.div>
      <div className="faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.q}
              className={`faq-item${isOpen ? " is-open" : ""}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="faq-item-head">
                <div>
                  <span className="faq-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="faq-question">{item.q}</h3>
                </div>
                <span className="faq-toggle" aria-hidden="true">+</span>
              </div>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats-band">
      <motion.div
        className="stats-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {STATS.map((s) => (
          <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </motion.div>
    </section>
  );
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; note?: string }>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Please tell us your name.";
    if (!email.trim()) nextErrors.email = "Please add an email so we can write back.";
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = "That email doesn't look right.";
    if (!note.trim()) nextErrors.note = "A line or two helps us understand you.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSent(false);
      return;
    }

    const subject = encodeURIComponent(`Private enquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${note.trim()}\n\n— ${name.trim()} (${email.trim()})`);
    window.location.href = `mailto:hello@desiherz.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

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
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <label>
            <span>Your name</span>
            <input
              type="text"
              placeholder="As your family calls you"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="discreet@you.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
          </label>
          <label className="full">
            <span>A note</span>
            <input
              type="text"
              placeholder="One or two sentences is enough."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-invalid={!!errors.note}
              aria-describedby={errors.note ? "note-error" : undefined}
            />
            {errors.note && <span className="field-error" id="note-error">{errors.note}</span>}
          </label>
          <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Request consultation <span>→</span>
          </motion.button>
          {sent && (
            <p className="form-success" role="status">
              Opening your email client to send this to hello@desiherz.com&hellip;
            </p>
          )}
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
