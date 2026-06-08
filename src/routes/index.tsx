import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import coupleHero from "@/assets/couple-hero.jpg";
import coupleStory1 from "@/assets/couple-story-1.jpg";
import coupleStory2 from "@/assets/couple-story-2.jpg";
import coupleHands from "@/assets/couple-hands.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SITE = {
  name: "DesiHerz",
  description:
    "DesiHerz is an invitation-only matrimony house for discerning people and families who value privacy, character and human curation in Germany and beyond.",
};

/*
  Optional production / generated films.
  Keep these empty until you have real video files. When ready, place videos in /public/desiherz-films/
  and use paths like "/desiherz-films/01-consultation.mp4".
*/
const FILMS = {
  hero: "",
  listen: "",
  verify: "",
  curate: "",
  introduce: "",
  align: "",
  commit: "",
};

const GOLD = "#f0c66b";
const BLACK = "#2a0718";
const PANEL = "#3a1027";
const MAROON = "#9f2454";
const CREAM = "#fff2e8";
const PURPLE = "#7c3fb8";
const BURGUNDY = "#d13b73";

const remote = (id: string, w = 2600, q = 78) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&fm=jpg&q=${q}&w=${w}`;

const MEDIA = {
  hero: {
    src: remote("photo-1532712938310-34cb3982ef74", 3000),
    fallback: coupleHero,
    alt: "A couple walking through open landscape, used as a cinematic opening image for private matrimony.",
  },
  hands: {
    src: remote("photo-1520854221256-17451cc331bf", 2600),
    fallback: coupleHands,
    alt: "Close-up of wedding hands held gently together.",
  },
  consultation: {
    src: coupleStory1,
    fallback: coupleStory1,
    alt: "A quiet couple portrait representing the first private conversation.",
  },
  verification: {
    src: remote("photo-1583939003579-730e3918a45a", 2600),
    fallback: coupleStory2,
    alt: "A wedding couple scene used to represent careful verification and trust.",
  },
  curation: {
    src: remote("photo-1511795409834-ef04bbd61622", 2600),
    fallback: coupleStory1,
    alt: "An elegant table setting with flowers and glassware, representing deliberate curation.",
  },
  introduction: {
    src: remote("photo-1529636798458-92182e662485", 2600),
    fallback: coupleStory2,
    alt: "A wedding arch detail representing a prepared first introduction.",
  },
  alignment: {
    src: remote("photo-1523438885200-e635ba2c371e", 2200),
    fallback: coupleHero,
    alt: "A quiet ceremonial gazebo arranged for a family-aware commitment.",
  },
  commitment: {
    src: remote("photo-1469371670807-013ccf25f16a", 2800),
    fallback: coupleHands,
    alt: "A flower-lined wedding aisle representing commitment.",
  },
  hall: {
    src: remote("photo-1510076857177-7470076d4098", 2800),
    fallback: coupleStory2,
    alt: "A warmly lit wedding hall with a dress hanging in the center.",
  },
};

const PROCESS = [
  {
    key: "listen",
    step: "01",
    eyebrow: "The first conversation",
    title: "We begin with what no app can hear.",
    body:
      "A private call or meeting where we understand temperament, family rhythm, values, pace and what a dignified introduction should feel like.",
    cta: "Private intake",
    image: MEDIA.consultation,
    film: FILMS.listen,
    visual: "listen" as const,
  },
  {
    key: "verify",
    step: "02",
    eyebrow: "Quiet verification",
    title: "Trust is designed before anyone is introduced.",
    body:
      "Identity, intent and essential background are reviewed discreetly. No public profiles. No browsing. No exposure.",
    cta: "Reviewed privately",
    image: MEDIA.verification,
    film: FILMS.verify,
    visual: "verify" as const,
  },
  {
    key: "curate",
    step: "03",
    eyebrow: "Human curation",
    title: "We reduce noise until only the right signal remains.",
    body:
      "Compatibility is considered through context: character, priorities, culture, family expectations, geography and the life each person is building.",
    cta: "Two or three names",
    image: MEDIA.curation,
    film: FILMS.curate,
    visual: "curate" as const,
  },
  {
    key: "introduce",
    step: "04",
    eyebrow: "The introduction",
    title: "A meeting is arranged like a scene, not a notification.",
    body:
      "When both sides feel ready, we arrange the introduction with care: location, pace, boundaries and privacy all handled before the first hello.",
    cta: "Introduced with care",
    image: MEDIA.introduction,
    film: FILMS.introduce,
    visual: "introduce" as const,
  },
  {
    key: "align",
    step: "05",
    eyebrow: "The wider circle",
    title: "Families may be involved without taking over the story.",
    body:
      "Where appropriate, we help align expectations with tact. Tradition is respected, but choice remains personal.",
    cta: "Family-aware",
    image: MEDIA.alignment,
    film: FILMS.align,
    visual: "align" as const,
  },
  {
    key: "commit",
    step: "06",
    eyebrow: "Commitment",
    title: "The outcome should feel calm, not manufactured.",
    body:
      "If it becomes something lasting, we remain nearby — discreetly, practically and without turning your life into content.",
    cta: "A life, not a lead",
    image: MEDIA.commitment,
    film: FILMS.commit,
    visual: "commit" as const,
  },
];

const PLEDGES = [
  {
    title: "Private by design",
    body: "No public profiles, no searchable catalogue, no casual browsing. Every introduction is controlled and intentional.",
  },
  {
    title: "Verified before contact",
    body: "Members are reviewed before any introduction. Privacy, identity and intent are treated as part of the service, not an afterthought.",
  },
  {
    title: "Curated by humans",
    body: "We do not overwhelm you with options. We prepare a small number of considered introductions, often one at a time.",
  },
  {
    title: "Family-aware, not family-controlled",
    body: "We understand values, tradition and context while keeping personal choice and dignity at the center.",
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
      { name: "theme-color", content: "#13060d" },
      {
        name: "keywords",
        content:
          "private matrimony, luxury matchmaking, curated introductions, invitation only matchmaking, Frankfurt matrimony, Germany",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,650;0,700;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&display=swap",
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
    <div className="dh-root relative min-h-screen selection:bg-[#f0c66b] selection:text-[#2a0718]">
      <GlobalDesignCSS />
      {mounted && (
        <>
          <SmoothScroll />
          <Cursor />
        </>
      )}
      <TopNav />
      <main>
        <Hero />
        <Belief />
        <ProcessFilm />
        <Pledges />
        <Proof />
        <Contact />
      </main>
      <Footer />
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
        <span className="dh-logo-heart">♥</span>
        <span>Herz</span>
      </a>
      <nav className="dh-nav-links" aria-label="Primary navigation">
        <a href="#story">Story</a>
        <a href="#about">About</a>
        <a href="#process">Process</a>
        <a href="#pledges">Pledges</a>
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
        ".hero-media img, .hero-media video",
        { scale: 1.08, yPercent: 0 },
        {
          scale: 1,
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        }
      );

      gsap.fromTo(
        ".hero-copy > *",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15, ease: "power3.out", stagger: 0.1, delay: 0.1 }
      );

      gsap.to(".hero-orbit", {
        rotate: 360,
        duration: 28,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".hero-thread", {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: "power2.out",
        delay: 0.35,
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="top" className="hero-section">
      <div className="structural-grid" aria-hidden="true" />
      <div className="hero-media" aria-hidden="true">
        {FILMS.hero ? (
          <video src={FILMS.hero} autoPlay muted loop playsInline />
        ) : (
          <ImageWithFallback image={MEDIA.hero} className="hero-img" />
        )}
        <div className="hero-vignette" />
      </div>

      <svg className="hero-linework" viewBox="0 0 1200 760" fill="none" aria-hidden="true">
        <path
          className="hero-thread"
          d="M154 470 C 320 250, 520 250, 640 386 S 950 520, 1070 265"
          stroke="rgba(201,160,74,.48)"
          strokeWidth="1"
          strokeDasharray="1400"
          strokeDashoffset="1400"
        />
        <circle className="hero-orbit" cx="332" cy="380" r="168" stroke="rgba(201,160,74,.16)" strokeWidth="1" />
        <circle className="hero-orbit" cx="332" cy="380" r="228" stroke="rgba(201,160,74,.08)" strokeWidth="1" />
      </svg>

      <div className="hero-copy">
        <p className="dh-kicker">Private matrimony / Germany and beyond</p>
        <h1>
          The right introduction should feel <em>inevitable.</em>
        </h1>
        <p className="hero-body">
          A private, human-led matrimony house for discerning individuals and families — built around discretion,
          character and thoughtful timing.
        </p>
        <div className="hero-actions">
          <a href="#process" className="dh-button primary">Watch the process</a>
          <a href="#contact" className="dh-button secondary">Request consultation</a>
        </div>
      </div>

      <div className="hero-trust-panel" aria-label="Key service qualities">
        <div><span>01</span><strong>Private</strong><small>No public profile</small></div>
        <div><span>02</span><strong>Verified</strong><small>Reviewed before contact</small></div>
        <div><span>03</span><strong>Curated</strong><small>Few introductions</small></div>
      </div>

      <div className="hero-scroll">Scroll</div>
    </section>
  );
}

function Belief() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".belief-card, .belief-text > *", {
        opacity: 0,
        y: 34,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="about" className="belief-section">
      <div className="structural-grid" aria-hidden="true" />
      <div className="belief-title">
        <p className="dh-kicker">Not a platform</p>
        <h2>
          A private house for modern commitment.
        </h2>
      </div>
      <div className="belief-text">
        <p>
          The most important introductions are rarely found by volume. They are found by context: the way someone
          speaks about family, handles pressure, protects privacy and imagines the home they are quietly building.
        </p>
        <p>
          DesiHerz is built for people who want the dignity of a human process without the exposure of an app. We listen
          first, verify carefully, curate slowly and introduce only when the match feels worth your attention.
        </p>
      </div>
      <div className="belief-card">
        <div className="belief-card-media">
          <ImageWithFallback image={MEDIA.hands} />
        </div>
        <div className="belief-card-copy">
          <span>House standard</span>
          <strong>No profile is ever public.</strong>
          <p>Nothing is published, browsed or distributed. Your story moves only through a private, controlled path.</p>
        </div>
      </div>
    </section>
  );
}

function ProcessFilm() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const scenes = gsap.utils.toArray<HTMLElement>(".film-scene");
      if (!scenes.length) return;

      gsap.set(scenes, { autoAlpha: 0, y: 24, scale: 0.985 });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(".motion-piece", { transformOrigin: "center center" });

      if (reduce || mobile) {
        gsap.set(scenes, { autoAlpha: 1, y: 0, scale: 1, position: "relative" });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: `+=${PROCESS.length * 92}%`,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(PROCESS.length - 1, Math.round(self.progress * (PROCESS.length - 1)));
            setActive(next);
          },
        },
      });

      scenes.forEach((scene, i) => {
        const media = scene.querySelector(".film-media-inner");
        const pieces = scene.querySelectorAll(".motion-piece");
        const copy = scene.querySelectorAll(".scene-copy > *");
        if (i === 0) {
          tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 0.9 }, 0);
          tl.fromTo(pieces, { opacity: 0, y: 24, rotate: -3 }, { opacity: 1, y: 0, rotate: 0, duration: 0.75, stagger: 0.04 }, 0.1);
          return;
        }
        tl.to(scenes[i - 1], { autoAlpha: 0, y: -32, scale: 0.975, duration: 0.55 }, ">+=0.08");
        tl.fromTo(scene, { autoAlpha: 0, y: 36, scale: 1.025 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.75 }, "<");
        tl.fromTo(media, { scale: 1.08, filter: "brightness(1.04) saturate(1.12)" }, { scale: 1, filter: "brightness(1)", duration: 0.8 }, "<");
        tl.fromTo(copy, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.03 }, "<0.12");
        tl.fromTo(pieces, { opacity: 0, y: 30, rotate: -4 }, { opacity: 1, y: 0, rotate: 0, duration: 0.75, stagger: 0.04 }, "<0.16");
      });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <section ref={ref} id="process" className="film-section">
      <div className="structural-grid" aria-hidden="true" />
      <aside className="film-rail" aria-label="Process steps">
        {PROCESS.map((item, i) => (
          <button
            key={item.key}
            className={i === active ? "active" : ""}
            aria-current={i === active ? "step" : undefined}
            onClick={() => {
              const y = ref.current ? ref.current.offsetTop + i * window.innerHeight * 0.92 : 0;
              window.scrollTo({ top: y, behavior: "smooth" });
            }}
          >
            <span>{item.step}</span>
            <strong>{item.eyebrow}</strong>
          </button>
        ))}
      </aside>

      <div className="film-stage">
        <div className="film-stage-header">
          <p className="dh-kicker">A controlled scroll story</p>
          <h2>Six scenes. One private path.</h2>
        </div>

        <div className="film-scenes">
          {PROCESS.map((scene) => (
            <article key={scene.key} className={`film-scene scene-${scene.key}`}>
              <div className="film-media">
                <div className="film-media-inner">
                  {scene.film ? (
                    <video src={scene.film} autoPlay muted loop playsInline />
                  ) : (
                    <ImageWithFallback image={scene.image} />
                  )}
                  <div className="film-media-shade" />
                </div>
                <KineticVisual type={scene.visual} step={scene.step} />
              </div>

              <div className="scene-copy">
                <p className="scene-eyebrow">{scene.step} — {scene.eyebrow}</p>
                <h3>{scene.title}</h3>
                <p>{scene.body}</p>
                <span className="scene-tag">{scene.cta}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="film-progress" aria-hidden="true">
          {PROCESS.map((item, i) => (
            <span key={item.key} className={i <= active ? "filled" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}

type KineticType = "listen" | "verify" | "curate" | "introduce" | "align" | "commit";

function KineticVisual({ type, step }: { type: KineticType; step: string }) {
  if (type === "listen") {
    return (
      <div className="kinetic kinetic-listen" aria-hidden="true">
        <span className="motion-piece pulse p1" />
        <span className="motion-piece pulse p2" />
        <div className="motion-piece audio-card">
          <b>{step}</b>
          <span>listening</span>
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  if (type === "verify") {
    return (
      <div className="kinetic kinetic-verify" aria-hidden="true">
        <div className="motion-piece lock-ring">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" stroke="rgba(201,160,74,.45)" />
            <path d="M28 37h24v20H28z" stroke="rgba(201,160,74,.8)" />
            <path d="M33 37v-8c0-5 3-10 7-10s7 5 7 10v8" stroke="rgba(201,160,74,.8)" />
          </svg>
        </div>
        <div className="motion-piece redacted-card c1"><span /><span /><span /></div>
        <div className="motion-piece redacted-card c2"><span /><span /><span /></div>
      </div>
    );
  }

  if (type === "curate") {
    return (
      <div className="kinetic kinetic-curate" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`motion-piece profile-card pc${i}`}>
            <span />
            <b>{i === 0 ? "Values" : i === 1 ? "Pace" : "Family"}</b>
            <i />
            <i />
          </div>
        ))}
        <svg className="motion-piece match-wire" viewBox="0 0 360 200" fill="none">
          <path d="M40 138 C 122 28, 236 32, 318 92" stroke="rgba(201,160,74,.7)" strokeWidth="1" />
          <circle cx="40" cy="138" r="5" fill={GOLD} />
          <circle cx="318" cy="92" r="5" fill={GOLD} />
        </svg>
      </div>
    );
  }

  if (type === "introduce") {
    return (
      <div className="kinetic kinetic-introduce" aria-hidden="true">
        <div className="motion-piece intro-person left"><span />A</div>
        <svg className="motion-piece intro-line" viewBox="0 0 420 150" fill="none">
          <path d="M82 76 C 160 20, 255 126, 338 70" stroke="rgba(201,160,74,.75)" strokeWidth="1.5" />
          <circle cx="210" cy="76" r="8" fill={GOLD} />
        </svg>
        <div className="motion-piece intro-person right"><span />B</div>
        <div className="motion-piece invitation-slip">introduction accepted</div>
      </div>
    );
  }

  if (type === "align") {
    return (
      <div className="kinetic kinetic-align" aria-hidden="true">
        {["values", "family", "city", "pace"].map((label, i) => (
          <div key={label} className={`motion-piece align-node n${i}`}>
            <span>{label}</span>
          </div>
        ))}
        <svg className="motion-piece align-orbit" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="110" stroke="rgba(201,160,74,.25)" />
          <circle cx="160" cy="160" r="58" stroke="rgba(201,160,74,.5)" />
          <path d="M60 160H260M160 60v200" stroke="rgba(201,160,74,.15)" />
        </svg>
      </div>
    );
  }

  return (
    <div className="kinetic kinetic-commit" aria-hidden="true">
      <svg className="motion-piece rings" viewBox="0 0 280 180" fill="none">
        <circle cx="116" cy="92" r="48" stroke="rgba(201,160,74,.8)" strokeWidth="2" />
        <circle cx="164" cy="92" r="48" stroke="rgba(201,160,74,.55)" strokeWidth="2" />
      </svg>
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className={`motion-piece petal petal-${i}`} />
      ))}
      <div className="motion-piece final-seal">quietly arranged</div>
    </div>
  );
}

function Pledges() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".pledge-panel", {
        opacity: 0,
        y: 28,
        rotateX: -8,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(
        ".pledge-media-strip img",
        { xPercent: 0 },
        { xPercent: -12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="pledges" className="pledges-section">
      <div className="structural-grid" aria-hidden="true" />
      <div className="section-heading compact">
        <p className="dh-kicker">Why us</p>
        <h2>Four rules that protect the story.</h2>
        <p>
          These are not marketing claims. They are the operating rules of the house: privacy, verification, human
          judgement and respect for the people around the decision.
        </p>
      </div>

      <div className="pledge-content">
        <div className="pledge-grid">
          {PLEDGES.map((item, i) => (
            <article key={item.title} className="pledge-panel">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="pledge-media-strip" aria-hidden="true">
          <ImageWithFallback image={MEDIA.hall} />
          <ImageWithFallback image={MEDIA.hands} />
          <ImageWithFallback image={MEDIA.commitment} />
        </div>
      </div>
    </section>
  );
}

function Proof() {
  const ref = useRef<HTMLElement>(null);
  const quotes = useMemo(
    () => [
      {
        quote:
          "The process felt private without feeling cold. We were introduced with context, care and no pressure to perform.",
        who: "M. & A.",
        city: "Frankfurt",
      },
      {
        quote:
          "They understood that our families mattered, but they never let the family conversation overpower our own choice.",
        who: "N. & R.",
        city: "Munich",
      },
      {
        quote:
          "It was the opposite of an app. No noise, no public profile, just one introduction that made sense.",
        who: "S. & K.",
        city: "Berlin",
      },
    ],
    []
  );

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      if (reduce || mobile) return;

      gsap.to(".quote-track", {
        xPercent: -38,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="story" className="proof-section">
      <div className="structural-grid" aria-hidden="true" />
      <div className="proof-copy">
        <p className="dh-kicker">Proof, softly</p>
        <h2>People remember how the introduction felt.</h2>
      </div>
      <div className="quote-track">
        {quotes.map((q) => (
          <article key={q.who} className="quote-card">
            <span>“</span>
            <p>{q.quote}</p>
            <footer>{q.who} / {q.city}</footer>
          </article>
        ))}
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
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="contact" className="contact-section">
      <div className="structural-grid" aria-hidden="true" />
      <div className="contact-panel">
        <p className="dh-kicker">Begin privately</p>
        <h2>
          Send a single line. <em>We’ll write back.</em>
        </h2>
        <p>
          No public profile is created. Your details are seen only by the principal matchmaker and are never shared as
          browseable data.
        </p>
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

function ImageWithFallback({ image, className = "" }: { image: { src: string; fallback: string; alt: string }; className?: string }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      className={className}
      loading="eager"
      decoding="async"
      onError={(event) => {
        if (event.currentTarget.src !== image.fallback) event.currentTarget.src = image.fallback;
      }}
    />
  );
}

function GlobalDesignCSS() {
  return (
    <style>{`
      :root {
        --black: ${BLACK};
        --panel: ${PANEL};
        --gold: ${GOLD};
        --maroon: ${MAROON};
        --cream: ${CREAM};
        --line: rgba(201,160,74,.16);
        --line-soft: rgba(245,237,224,.06);
      }

      html { scroll-behavior: smooth; background: #2a0718; }
      body { background: #2a0718; }
      .dh-root {
        min-height: 100vh;
        background:
          radial-gradient(circle at 12% 14%, rgba(209,59,115,.46), transparent 34rem),
          radial-gradient(circle at 84% 18%, rgba(124,63,184,.34), transparent 36rem),
          radial-gradient(circle at 45% 88%, rgba(159,36,84,.38), transparent 44rem),
          linear-gradient(135deg, #2a0718 0%, #47112d 42%, #22103a 100%);
        color: var(--cream);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        overflow-x: clip;
      }
      .dh-root * { box-sizing: border-box; }
      .dh-root::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background:
          radial-gradient(circle at 20% 20%, rgba(209,59,115,.18), transparent 32rem),
          radial-gradient(circle at 85% 35%, rgba(124,63,184,.16), transparent 34rem),
          linear-gradient(120deg, rgba(159,36,84,.12), rgba(124,63,184,.08));
        mix-blend-mode: screen;
      }
      .dh-root a { color: inherit; text-decoration: none; }
      .structural-grid {
        pointer-events: none;
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(to right, rgba(245,237,224,.045) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(245,237,224,.035) 1px, transparent 1px);
        background-size: 25vw 100%, 100% 25vh;
        mask-image: linear-gradient(to bottom, rgba(0,0,0,.85), rgba(0,0,0,.32));
        z-index: 1;
      }
      .dh-kicker {
        margin: 0;
        font: 700 clamp(.66rem, .75vw, .82rem)/1.4 Inter, sans-serif;
        letter-spacing: .36em;
        text-transform: uppercase;
        color: var(--gold);
      }
      .dh-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 3.3rem;
        padding: 0 1.45rem;
        border: 1px solid rgba(201,160,74,.46);
        font: 800 .68rem/1 Inter, sans-serif;
        letter-spacing: .24em;
        text-transform: uppercase;
        transition: transform .35s cubic-bezier(.2,.8,.2,1), background .35s ease, color .35s ease, border-color .35s ease;
      }
      .dh-button:hover { transform: translateY(-2px); border-color: rgba(201,160,74,.86); }
      .dh-button.primary { background: var(--gold); color: #120b15; border-color: var(--gold); }
      .dh-button.secondary { background: rgba(159,36,84,.18); color: var(--gold); backdrop-filter: blur(14px); }

      .dh-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 76px;
        z-index: 80;
        display: grid;
        grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
        align-items: center;
        padding: 0 2rem;
        color: var(--gold);
        border-bottom: 1px solid rgba(201,160,74,.13);
        background: rgba(42,7,24,.62);
        backdrop-filter: blur(18px);
        transition: background .35s ease, height .35s ease, border-color .35s ease;
      }
      .dh-nav.is-scrolled { height: 66px; background: rgba(42,7,24,.78); border-bottom-color: rgba(201,160,74,.22); }
      .dh-logo {
        justify-self: start;
        display: inline-flex;
        align-items: center;
        gap: .45rem;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(1.6rem, 2.1vw, 2.2rem);
        letter-spacing: .025em;
        white-space: nowrap;
      }
      .dh-logo-heart {
        width: 1.32rem;
        height: 1.32rem;
        border: 1px solid rgba(201,160,74,.4);
        border-radius: 999px;
        display: inline-grid;
        place-items: center;
        font-size: .68rem;
        line-height: 1;
      }
      .dh-nav-links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: clamp(1.4rem, 3.4vw, 3.4rem);
      }
      .dh-nav-links a,
      .dh-nav-cta {
        font: 800 .72rem/1 Inter, sans-serif;
        letter-spacing: .32em;
        text-transform: uppercase;
        color: var(--gold);
      }
      .dh-nav-links a { opacity: .86; transition: opacity .25s ease; }
      .dh-nav-links a:hover { opacity: 1; }
      .dh-nav-cta {
        justify-self: end;
        border: 1px solid rgba(201,160,74,.32);
        padding: 1.05rem 1.5rem;
        transition: border-color .25s ease, background .25s ease;
      }
      .dh-nav-cta:hover { border-color: rgba(201,160,74,.76); background: rgba(201,160,74,.08); }

      .hero-section {
        position: relative;
        min-height: 100svh;
        padding: 9rem 4.8vw 4.2rem;
        display: grid;
        align-items: end;
        isolation: isolate;
        overflow: hidden;
      }
      .hero-media {
        position: absolute;
        inset: 76px 0 0 0;
        z-index: 0;
        overflow: hidden;
        background: #210614;
      }
      .hero-media img,
      .hero-media video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 42%;
        filter: saturate(1.22) contrast(1.08) brightness(1.08);
      }
      .hero-vignette {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(42,7,24,.40) 0%, rgba(122,29,61,.24) 34%, rgba(159,36,84,.18) 68%, rgba(42,7,24,.35) 100%),
          linear-gradient(0deg, rgba(42,7,24,.34) 0%, rgba(0,0,0,0) 42%, rgba(42,7,24,.36) 100%);
      }
      .hero-linework {
        position: absolute;
        z-index: 2;
        inset: 76px 0 auto 0;
        width: 100%;
        height: calc(100svh - 76px);
        opacity: .9;
        pointer-events: none;
      }
      .hero-copy {
        position: relative;
        z-index: 3;
        max-width: min(880px, 64vw);
        padding-bottom: clamp(1rem, 3vh, 3rem);
      }
      .hero-copy h1 {
        margin: 1rem 0 1.05rem;
        max-width: 13ch;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(3.4rem, 7.2vw, 7.2rem);
        line-height: .93;
        letter-spacing: -.065em;
        font-weight: 500;
        color: var(--cream);
      }
      .hero-copy h1 em { color: var(--gold); font-style: italic; font-weight: 500; }
      .hero-body {
        max-width: 680px;
        margin: 0;
        color: rgba(245,237,224,.76);
        font-size: clamp(1rem, 1.22vw, 1.25rem);
        line-height: 1.7;
        letter-spacing: .015em;
      }
      .hero-actions { display: flex; flex-wrap: wrap; gap: .9rem; margin-top: 2rem; }
      .hero-trust-panel {
        position: absolute;
        z-index: 3;
        right: 3.2vw;
        bottom: 3.1rem;
        width: min(40vw, 650px);
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        background: rgba(58,16,39,.45);
        border: 1px solid rgba(201,160,74,.18);
        backdrop-filter: blur(18px);
      }
      .hero-trust-panel > div { padding: 1.25rem 1.2rem; border-left: 1px solid rgba(201,160,74,.14); }
      .hero-trust-panel > div:first-child { border-left: 0; }
      .hero-trust-panel span { display: block; color: var(--gold); font-size: .68rem; letter-spacing: .26em; font-weight: 800; }
      .hero-trust-panel strong { display: block; margin: .55rem 0 .35rem; font-family: "Playfair Display", Georgia, serif; font-size: 1.35rem; font-weight: 500; }
      .hero-trust-panel small { display: block; color: rgba(245,237,224,.58); font-size: .74rem; line-height: 1.45; }
      .hero-scroll { position: absolute; right: 3.4vw; bottom: 9rem; z-index: 3; color: var(--gold); font-size: .62rem; letter-spacing: .33em; text-transform: uppercase; font-weight: 800; writing-mode: vertical-rl; }

      .belief-section {
        position: relative;
        display: grid;
        grid-template-columns: 0.9fr 1fr;
        gap: clamp(2rem, 5vw, 6rem);
        padding: clamp(6rem, 11vw, 11rem) 4.8vw;
        overflow: hidden;
        background: linear-gradient(180deg, #2a0718 0%, #3a1027 100%);
      }
      .belief-title,
      .belief-text,
      .belief-card { position: relative; z-index: 3; }
      .belief-title h2 {
        margin: 1rem 0 0;
        max-width: 10ch;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(3.1rem, 6vw, 6.3rem);
        letter-spacing: -.055em;
        line-height: .98;
        font-weight: 500;
      }
      .belief-text {
        max-width: 680px;
        align-self: center;
        color: rgba(245,237,224,.7);
        font-size: clamp(1rem, 1.15vw, 1.22rem);
        line-height: 1.85;
      }
      .belief-text p + p { margin-top: 1.5rem; }
      .belief-card {
        grid-column: 2;
        display: grid;
        grid-template-columns: 42% 1fr;
        min-height: 300px;
        border: 1px solid rgba(201,160,74,.18);
        background: rgba(58,16,39,.62);
        backdrop-filter: blur(18px);
        overflow: hidden;
      }
      .belief-card-media { min-height: 300px; overflow: hidden; }
      .belief-card-media img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.18) contrast(1.04) brightness(1.08); }
      .belief-card-copy { padding: clamp(1.5rem, 4vw, 3rem); display: flex; flex-direction: column; justify-content: center; }
      .belief-card-copy span { color: var(--gold); font-size: .64rem; letter-spacing: .3em; text-transform: uppercase; font-weight: 800; }
      .belief-card-copy strong { display: block; margin: .9rem 0 1rem; font-family: "Playfair Display", Georgia, serif; font-size: clamp(1.9rem, 3vw, 3rem); line-height: 1.02; font-weight: 500; }
      .belief-card-copy p { margin: 0; color: rgba(245,237,224,.64); line-height: 1.7; }

      .film-section {
        position: relative;
        min-height: 100svh;
        overflow: hidden;
        background:
          radial-gradient(circle at 84% 18%, rgba(240,198,107,.16), transparent 28rem),
          radial-gradient(circle at 18% 70%, rgba(209,59,115,.28), transparent 32rem),
          #2a0718;
      }
      .film-rail {
        position: absolute;
        z-index: 14;
        left: 3.3vw;
        top: 50%;
        transform: translateY(-50%);
        width: 220px;
        display: flex;
        flex-direction: column;
        border-left: 1px solid rgba(201,160,74,.28);
      }
      .film-rail button {
        position: relative;
        appearance: none;
        background: transparent;
        color: rgba(245,237,224,.42);
        border: 0;
        border-bottom: 1px solid rgba(245,237,224,.06);
        text-align: left;
        padding: 1rem 0 1rem 1.55rem;
        cursor: pointer;
        transition: color .3s ease, transform .3s ease;
      }
      .film-rail button::before {
        content: "";
        position: absolute;
        left: -4px;
        top: 1.18rem;
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: rgba(201,160,74,.25);
        transition: transform .3s ease, background .3s ease, box-shadow .3s ease;
      }
      .film-rail button.active { color: var(--cream); transform: translateX(3px); }
      .film-rail button.active::before { background: var(--gold); transform: scale(1.35); box-shadow: 0 0 28px rgba(201,160,74,.45); }
      .film-rail span { display: block; color: var(--gold); font-size: .65rem; letter-spacing: .26em; font-weight: 800; }
      .film-rail strong { display: block; margin-top: .42rem; font-size: .68rem; letter-spacing: .28em; text-transform: uppercase; line-height: 1.55; }

      .film-stage {
        position: relative;
        z-index: 3;
        height: 100svh;
        min-height: 760px;
        padding: 6.2rem 4.8vw 3.2rem calc(3.3vw + 260px);
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 1.2rem;
      }
      .film-stage-header {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 2rem;
      }
      .film-stage-header h2 {
        margin: 0;
        max-width: 650px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(2.6rem, 4.4vw, 5rem);
        line-height: .98;
        letter-spacing: -.055em;
        font-weight: 500;
        text-align: right;
      }
      .film-scenes {
        position: relative;
        min-height: 0;
        border: 1px solid rgba(201,160,74,.16);
        background: rgba(58,16,39,.48);
        box-shadow: 0 60px 140px rgba(0,0,0,.32);
        overflow: hidden;
      }
      .film-scene {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: minmax(0, 1.12fr) minmax(360px, .88fr);
        gap: clamp(1.4rem, 3vw, 3.2rem);
        align-items: center;
        padding: clamp(1.4rem, 3vw, 3rem);
      }
      .film-media {
        position: relative;
        height: 100%;
        min-height: 500px;
        overflow: hidden;
        border: 1px solid rgba(201,160,74,.14);
        background: #210614;
      }
      .film-media-inner { position: absolute; inset: 0; overflow: hidden; }
      .film-media img,
      .film-media video { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.18) contrast(1.06) brightness(1.08); }
      .film-media-shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(42,7,24,.35), rgba(0,0,0,0) 45%, rgba(42,7,24,.24)); }
      .scene-copy { position: relative; z-index: 4; max-width: 560px; padding-right: .5rem; }
      .scene-eyebrow { margin: 0 0 1rem; color: var(--gold); font-size: .68rem; letter-spacing: .32em; text-transform: uppercase; font-weight: 800; }
      .scene-copy h3 {
        margin: 0 0 1rem;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(2.45rem, 4.2vw, 4.8rem);
        line-height: .98;
        letter-spacing: -.052em;
        font-weight: 500;
      }
      .scene-copy > p:not(.scene-eyebrow) { margin: 0; color: rgba(245,237,224,.7); font-size: clamp(.98rem, 1.05vw, 1.13rem); line-height: 1.75; }
      .scene-tag { display: inline-flex; margin-top: 1.6rem; padding: .72rem .9rem; border: 1px solid rgba(201,160,74,.24); color: var(--gold); font-size: .64rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 800; }
      .film-progress { display: grid; grid-template-columns: repeat(6, 1fr); gap: .6rem; }
      .film-progress span { height: 2px; background: rgba(245,237,224,.08); overflow: hidden; }
      .film-progress span::after { content: ""; display: block; height: 100%; transform: scaleX(0); transform-origin: left; background: var(--gold); transition: transform .32s ease; }
      .film-progress span.filled::after { transform: scaleX(1); }

      .kinetic { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
      .kinetic-listen .pulse { position: absolute; left: 12%; bottom: 12%; width: 180px; height: 180px; border-radius: 50%; border: 1px solid rgba(201,160,74,.26); animation: dhPulse 3.5s ease-out infinite; }
      .kinetic-listen .p2 { animation-delay: .9s; width: 280px; height: 280px; opacity: .7; }
      .audio-card { position: absolute; left: 8%; bottom: 10%; width: 230px; padding: 1rem; background: rgba(58,16,39,.58); border: 1px solid rgba(201,160,74,.22); backdrop-filter: blur(16px); }
      .audio-card b { color: var(--gold); letter-spacing: .22em; font-size: .7rem; }
      .audio-card span { display: block; margin: .45rem 0 .9rem; color: rgba(245,237,224,.76); text-transform: uppercase; letter-spacing: .22em; font-size: .62rem; }
      .audio-card i { display: block; height: 2px; margin: .36rem 0; background: linear-gradient(90deg, var(--gold), transparent); }
      .kinetic-verify .lock-ring { position: absolute; right: 10%; top: 12%; width: 110px; height: 110px; }
      .redacted-card { position: absolute; right: 8%; bottom: 14%; width: 260px; height: 120px; padding: 1rem; background: rgba(58,16,39,.58); border: 1px solid rgba(201,160,74,.22); backdrop-filter: blur(14px); }
      .redacted-card.c2 { right: 18%; bottom: 22%; transform: rotate(-4deg); opacity: .78; }
      .redacted-card span { display: block; height: 10px; margin-bottom: 13px; background: rgba(245,237,224,.16); }
      .redacted-card span:nth-child(2) { width: 72%; }
      .redacted-card span:nth-child(3) { width: 48%; background: rgba(201,160,74,.28); }
      .profile-card { position: absolute; top: 18%; width: 180px; min-height: 220px; padding: 1.1rem; background: rgba(58,16,39,.62); border: 1px solid rgba(201,160,74,.22); backdrop-filter: blur(14px); box-shadow: 0 32px 70px rgba(0,0,0,.32); }
      .profile-card span { display: block; width: 52px; height: 52px; border-radius: 999px; border: 1px solid rgba(201,160,74,.34); margin-bottom: 1.1rem; }
      .profile-card b { color: var(--gold); font-family: "Playfair Display", Georgia, serif; font-size: 1.45rem; font-weight: 500; }
      .profile-card i { display: block; height: 2px; margin-top: .9rem; background: rgba(245,237,224,.14); }
      .pc0 { left: 10%; transform: rotate(-8deg); }
      .pc1 { left: 25%; top: 24%; transform: rotate(4deg); }
      .pc2 { left: 40%; transform: rotate(-1deg); }
      .match-wire { position: absolute; right: 6%; bottom: 12%; width: 360px; max-width: 45%; }
      .intro-person { position: absolute; top: 26%; width: 140px; height: 174px; background: rgba(58,16,39,.62); border: 1px solid rgba(201,160,74,.24); backdrop-filter: blur(14px); display: grid; place-items: center; color: var(--gold); font-family: "Playfair Display", Georgia, serif; font-size: 2.3rem; }
      .intro-person span { position: absolute; top: 26px; width: 52px; height: 52px; border: 1px solid rgba(201,160,74,.35); border-radius: 999px; }
      .intro-person.left { left: 13%; }
      .intro-person.right { right: 13%; }
      .intro-line { position: absolute; left: 50%; top: 33%; transform: translateX(-50%); width: min(430px, 54%); }
      .invitation-slip { position: absolute; left: 50%; bottom: 15%; transform: translateX(-50%); padding: .8rem 1rem; background: rgba(42,7,24,.52); border: 1px solid rgba(201,160,74,.24); color: var(--gold); font-size: .64rem; letter-spacing: .24em; text-transform: uppercase; font-weight: 800; }
      .align-orbit { position: absolute; left: 50%; top: 50%; width: min(380px, 62%); transform: translate(-50%, -50%); }
      .align-node { position: absolute; width: 110px; height: 110px; border-radius: 999px; border: 1px solid rgba(201,160,74,.28); background: rgba(122,29,61,.24); backdrop-filter: blur(14px); display: grid; place-items: center; color: var(--gold); font-size: .61rem; text-transform: uppercase; letter-spacing: .2em; }
      .align-node.n0 { left: 12%; top: 18%; }
      .align-node.n1 { right: 12%; top: 18%; }
      .align-node.n2 { left: 18%; bottom: 14%; }
      .align-node.n3 { right: 18%; bottom: 14%; }
      .rings { position: absolute; left: 50%; top: 42%; width: 310px; transform: translate(-50%, -50%); filter: drop-shadow(0 0 34px rgba(201,160,74,.25)); }
      .final-seal { position: absolute; left: 50%; bottom: 13%; transform: translateX(-50%); padding: .88rem 1.1rem; background: rgba(58,16,39,.55); border: 1px solid rgba(201,160,74,.24); color: var(--gold); font-size: .64rem; letter-spacing: .24em; text-transform: uppercase; font-weight: 800; }
      .petal { position: absolute; top: -20px; width: 7px; height: 12px; border-radius: 999px 999px 999px 0; background: rgba(245,237,224,.72); animation: dhPetal 7s linear infinite; opacity: .7; }
      ${Array.from({ length: 18 }).map((_, i) => `.petal-${i}{left:${8 + ((i * 11) % 84)}%;animation-delay:${(i * .37).toFixed(2)}s;animation-duration:${(5.5 + (i % 6) * .5).toFixed(2)}s;}`).join("\n")}

      .pledges-section {
        position: relative;
        padding: clamp(5.2rem, 9vw, 9rem) 4.8vw;
        overflow: hidden;
        background: linear-gradient(180deg, #2a0718, #3a1027 72%, #2a0718);
      }
      .section-heading { position: relative; z-index: 3; max-width: 1120px; display: grid; grid-template-columns: .85fr 1fr; align-items: end; gap: clamp(1.5rem, 5vw, 6rem); margin-bottom: clamp(2rem, 4vw, 4rem); }
      .section-heading h2 { margin: .8rem 0 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(2.8rem, 5.1vw, 5.8rem); line-height: 1; letter-spacing: -.055em; font-weight: 500; }
      .section-heading p:not(.dh-kicker) { color: rgba(245,237,224,.68); line-height: 1.75; font-size: clamp(.98rem, 1.1vw, 1.13rem); }
      .pledge-content { position: relative; z-index: 3; display: grid; grid-template-columns: minmax(0, .95fr) minmax(360px, .8fr); gap: 1.2rem; align-items: stretch; }
      .pledge-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: rgba(201,160,74,.18); border: 1px solid rgba(201,160,74,.18); }
      .pledge-panel { min-height: 240px; padding: clamp(1.3rem, 3vw, 2.6rem); background: rgba(58,16,39,.82); }
      .pledge-panel span { color: var(--gold); font-size: .68rem; letter-spacing: .28em; font-weight: 800; }
      .pledge-panel h3 { margin: 1.2rem 0 .75rem; font-family: "Playfair Display", Georgia, serif; font-size: clamp(1.75rem, 2.5vw, 2.65rem); line-height: 1.05; font-weight: 500; }
      .pledge-panel p { margin: 0; color: rgba(245,237,224,.64); line-height: 1.72; }
      .pledge-media-strip { position: relative; min-height: 482px; overflow: hidden; border: 1px solid rgba(201,160,74,.18); background: #210614; }
      .pledge-media-strip img { position: absolute; width: 62%; height: 62%; object-fit: cover; filter: saturate(1.15) contrast(1.04) brightness(1.06); border: 1px solid rgba(201,160,74,.15); }
      .pledge-media-strip img:nth-child(1) { left: 6%; top: 7%; width: 70%; height: 58%; }
      .pledge-media-strip img:nth-child(2) { right: 5%; bottom: 8%; width: 54%; height: 46%; }
      .pledge-media-strip img:nth-child(3) { left: 9%; bottom: 6%; width: 38%; height: 36%; }

      .proof-section {
        position: relative;
        min-height: 100svh;
        padding: clamp(5rem, 8vw, 8rem) 4.8vw;
        overflow: hidden;
        background: #2a0718;
      }
      .proof-copy { position: relative; z-index: 3; max-width: 840px; }
      .proof-copy h2 { margin: .9rem 0 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(2.9rem, 5vw, 5.8rem); line-height: .98; letter-spacing: -.055em; font-weight: 500; }
      .quote-track { position: relative; z-index: 3; display: flex; gap: 1.2rem; width: max-content; margin-top: clamp(3rem, 7vw, 7rem); padding-bottom: 2rem; }
      .quote-card { width: min(560px, 82vw); min-height: 340px; padding: clamp(1.5rem, 3vw, 3rem); border: 1px solid rgba(201,160,74,.18); background: rgba(58,16,39,.66); display: flex; flex-direction: column; justify-content: space-between; }
      .quote-card span { color: var(--gold); font-family: "Playfair Display", Georgia, serif; font-size: 4rem; line-height: .55; }
      .quote-card p { margin: 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(1.5rem, 2.3vw, 2.4rem); line-height: 1.22; font-style: italic; }
      .quote-card footer { color: var(--gold); font-size: .67rem; letter-spacing: .25em; text-transform: uppercase; font-weight: 800; }

      .contact-section { position: relative; padding: clamp(5.5rem, 10vw, 10rem) 4.8vw; background: radial-gradient(circle at 72% 40%, rgba(209,59,115,.32), transparent 38rem), #2a0718; }
      .contact-panel { position: relative; z-index: 3; max-width: 980px; margin: 0 auto; padding: clamp(2rem, 5vw, 5rem); border: 1px solid rgba(201,160,74,.22); background: rgba(58,16,39,.62); box-shadow: 0 40px 110px rgba(0,0,0,.34); }
      .contact-panel h2 { margin: 1rem 0 1.1rem; font-family: "Playfair Display", Georgia, serif; font-size: clamp(2.9rem, 5.6vw, 6.5rem); line-height: .96; letter-spacing: -.06em; font-weight: 500; }
      .contact-panel h2 em { color: var(--gold); font-style: italic; }
      .contact-panel > p { margin: 0; max-width: 620px; color: rgba(245,237,224,.66); line-height: 1.75; }
      .contact-form { margin-top: 3rem; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem; }
      .contact-form label { display: block; }
      .contact-form label.full { grid-column: 1 / -1; }
      .contact-form span { display: block; margin-bottom: .8rem; color: var(--gold); font-size: .64rem; letter-spacing: .26em; text-transform: uppercase; font-weight: 800; }
      .contact-form input { width: 100%; height: 3.6rem; background: transparent; border: 0; border-bottom: 1px solid rgba(201,160,74,.28); color: var(--cream); outline: 0; font-size: 1rem; transition: border-color .25s ease, box-shadow .25s ease; }
      .contact-form input:focus { border-bottom-color: var(--gold); box-shadow: 0 10px 32px rgba(201,160,74,.08); }
      .contact-form button { grid-column: 1 / -1; justify-self: end; margin-top: 1rem; min-height: 3.5rem; padding: 0 1.55rem; border: 1px solid var(--gold); background: var(--gold); color: #120b15; font-weight: 900; font-size: .68rem; letter-spacing: .22em; text-transform: uppercase; }
      .contact-form button span { display: inline; color: inherit; margin-left: .75rem; letter-spacing: 0; }

      .dh-footer { display: grid; grid-template-columns: 1fr auto; gap: 2rem; padding: 3rem 4.8vw; border-top: 1px solid rgba(201,160,74,.14); background: #210614; color: rgba(245,237,224,.62); }
      .dh-footer strong { display: block; color: var(--gold); font-family: "Playfair Display", Georgia, serif; font-size: 1.9rem; font-weight: 500; margin-bottom: .6rem; }
      .dh-footer p { margin: 0; max-width: 420px; line-height: 1.6; }
      .dh-footer div:last-child { display: grid; gap: .5rem; text-align: right; font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; }

      @keyframes dhPulse { 0% { transform: scale(.62); opacity: .9; } 80%,100% { transform: scale(1.22); opacity: 0; } }
      @keyframes dhPetal { 0% { transform: translate3d(0,-20px,0) rotate(0deg); opacity: 0; } 10% { opacity: .7; } 100% { transform: translate3d(60px,720px,0) rotate(230deg); opacity: 0; } }

      @media (max-width: 1100px) {
        .dh-nav { grid-template-columns: auto 1fr auto; }
        .dh-nav-links { display: none; }
        .film-rail { display: none; }
        .film-stage { padding-left: 4.8vw; }
        .hero-trust-panel { width: min(640px, 88vw); left: 4.8vw; right: auto; }
        .belief-section, .section-heading, .pledge-content { grid-template-columns: 1fr; }
        .belief-card { grid-column: auto; }
      }
      @media (max-width: 767px) {
        .dh-nav { height: 64px; padding: 0 1rem; }
        .dh-logo { font-size: 1.5rem; }
        .dh-nav-cta { display: none; }
        .hero-section { padding: 7.5rem 1.1rem 2rem; align-items: end; }
        .hero-media { inset-top: 64px; }
        .hero-copy { max-width: 100%; }
        .hero-copy h1 { font-size: clamp(3.1rem, 17vw, 5.6rem); }
        .hero-trust-panel { position: relative; left: auto; right: auto; bottom: auto; width: 100%; margin-top: 2rem; grid-template-columns: 1fr; }
        .hero-scroll { display: none; }
        .belief-section, .pledges-section, .proof-section, .contact-section { padding-left: 1.1rem; padding-right: 1.1rem; }
        .belief-card { grid-template-columns: 1fr; }
        .film-stage { height: auto; min-height: auto; padding: 5rem 1.1rem 2rem; }
        .film-stage-header { display: block; }
        .film-stage-header h2 { text-align: left; margin-top: .9rem; }
        .film-scenes { border: 0; background: transparent; display: grid; gap: 1.2rem; }
        .film-scene { position: relative !important; inset: auto; grid-template-columns: 1fr; padding: 0; gap: 1rem; opacity: 1 !important; visibility: visible !important; transform: none !important; }
        .film-media { min-height: 430px; }
        .scene-copy { padding: 1.2rem 0 2.2rem; }
        .pledge-grid { grid-template-columns: 1fr; }
        .pledge-media-strip { min-height: 430px; }
        .contact-form { grid-template-columns: 1fr; }
        .dh-footer { grid-template-columns: 1fr; }
        .dh-footer div:last-child { text-align: left; }
      }
    `}</style>
  );
}
