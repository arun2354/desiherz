import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollVideo } from "@/components/ScrollVideo";
import coupleHero from "@/assets/couple-hero.jpg";
import coupleHands from "@/assets/couple-hands.jpg";
import coupleStory1 from "@/assets/couple-story-1.jpg";
import coupleStory2 from "@/assets/couple-story-2.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SITE = {
  name: "DesiHerz",
  description:
    "DesiHerz is an invitation-only matrimony house for discerning people and families who value privacy, character and human curation in Germany and beyond.",
};

/*
  Drop finished clips into /public/videos/ using these exact filenames and
  they take over automatically — nothing else needs to change. Until a file
  exists at a path, that slot renders a still frame (or a quiet cinema-slate
  mark) instead of a broken player.
*/
const FILMS = {
  hero: "/videos/hero.mp4",
  listen: "/videos/listen.mp4",
  verify: "/videos/verify.mp4",
  curate: "/videos/curate.mp4",
  introduce: "/videos/introduce.mp4",
  align: "/videos/align.mp4",
  commit: "/videos/commit.mp4",
};

const MEDIA = {
  hero: { src: coupleHero, alt: "A couple walking together, the opening image for DesiHerz." },
  hands: { src: coupleHands, alt: "Close-up of hands held gently together." },
  storyOne: { src: coupleStory1, alt: "A quiet couple portrait." },
  storyTwo: { src: coupleStory2, alt: "A couple portrait representing a considered introduction." },
};

const PROCESS = [
  {
    key: "listen",
    step: "01",
    eyebrow: "The first conversation",
    title: "We begin with what no app can hear.",
    body: "A private call or meeting where we understand temperament, family rhythm, values, pace and what a dignified introduction should feel like.",
    cta: "Private intake",
    film: FILMS.listen,
    alt: "A private consultation conversation.",
  },
  {
    key: "verify",
    step: "02",
    eyebrow: "Quiet verification",
    title: "Trust is designed before anyone is introduced.",
    body: "Identity, intent and essential background are reviewed discreetly. No public profiles. No browsing. No exposure.",
    cta: "Reviewed privately",
    film: FILMS.verify,
    alt: "A discreet verification process.",
  },
  {
    key: "curate",
    step: "03",
    eyebrow: "Human curation",
    title: "We reduce noise until only the right signal remains.",
    body: "Compatibility is considered through context: character, priorities, culture, family expectations, geography and the life each person is building.",
    cta: "Two or three names",
    film: FILMS.curate,
    alt: "A curator reviewing a small set of considered introductions.",
  },
  {
    key: "introduce",
    step: "04",
    eyebrow: "The introduction",
    title: "A meeting is arranged like a scene, not a notification.",
    body: "When both sides feel ready, we arrange the introduction with care: location, pace, boundaries and privacy all handled before the first hello.",
    cta: "Introduced with care",
    film: FILMS.introduce,
    alt: "Two people meeting for a considered first introduction.",
  },
  {
    key: "align",
    step: "05",
    eyebrow: "The wider circle",
    title: "Families may be involved without taking over the story.",
    body: "Where appropriate, we help align expectations with tact. Tradition is respected, but choice remains personal.",
    cta: "Family-aware",
    film: FILMS.align,
    alt: "A family conversation handled with tact.",
  },
  {
    key: "commit",
    step: "06",
    eyebrow: "Commitment",
    title: "The outcome should feel calm, not manufactured.",
    body: "If it becomes something lasting, we remain nearby — discreetly, practically and without turning your life into content.",
    cta: "A life, not a lead",
    film: FILMS.commit,
    alt: "A calm, quietly arranged commitment.",
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
      { name: "theme-color", content: "#0a0908" },
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
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@300;400;500;600;700;800&display=swap",
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
    <div className="dh-root grain relative min-h-screen selection:bg-[#c8a35d] selection:text-[#14100c]">
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
        <em className="dh-logo-heart">♥</em>
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const hasVideo = videoReady && !videoFailed;

  useEffect(() => {
    let cancelled = false;
    fetch(FILMS.hero, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setVideoReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        ".hero-copy > *",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15, ease: "power3.out", stagger: 0.1, delay: 0.1 }
      );

      if (reduce) return;

      gsap.fromTo(
        ".hero-media img, .hero-media video",
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        }
      );

      const video = videoRef.current;
      if (video && hasVideo) {
        const bindScrub = () => {
          if (!video.duration) return;
          gsap.to(video, {
            currentTime: video.duration,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.4 },
          });
        };
        if (video.readyState >= 1) bindScrub();
        else video.addEventListener("loadedmetadata", bindScrub, { once: true });
      }
    },
    { scope: ref, dependencies: [hasVideo] }
  );

  return (
    <section ref={ref} id="top" className="hero-section">
      <div className="hero-media" aria-hidden="true">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={FILMS.hero}
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <img src={MEDIA.hero.src} alt={MEDIA.hero.alt} loading="eager" decoding="async" />
        )}
        <div className="hero-vignette" />
      </div>

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
        y: 32,
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
      <div className="belief-title">
        <p className="dh-kicker">Not a platform</p>
        <h2>A private house for modern commitment.</h2>
      </div>
      <div className="belief-text">
        <p>
          The most important introductions are rarely found by volume. They are found by context: the way someone
          speaks about family, handles pressure, protects privacy and imagines the home they are quietly building.
        </p>
        <p>
          DesiHerz is built for people who want the dignity of a human process without the exposure of an app. We
          listen first, verify carefully, curate slowly and introduce only when the match feels worth your attention.
        </p>
      </div>
      <div className="belief-card">
        <div className="belief-card-media">
          <img src={MEDIA.hands.src} alt={MEDIA.hands.alt} loading="lazy" decoding="async" />
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

      if (reduce) {
        gsap.set(scenes, { autoAlpha: 1, y: 0, scale: 1, position: "relative" });
        return;
      }

      if (mobile) {
        gsap.set(scenes, { autoAlpha: 1, y: 0, scale: 1, position: "relative" });
        scenes.forEach((scene, i) => {
          const media = scene.querySelector(".film-media-inner");
          const copy = scene.querySelectorAll(".scene-copy > *");

          gsap.fromTo(
            scene,
            { opacity: 0.7, y: 44, scale: 0.975 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 82%",
                end: "center 45%",
                scrub: 0.55,
                onEnter: () => setActive(i),
                onEnterBack: () => setActive(i),
              },
            }
          );

          if (media) {
            gsap.fromTo(
              media,
              { scale: 1.1, filter: "brightness(.88) saturate(.95)" },
              {
                scale: 1,
                filter: "brightness(1.05) saturate(1.05)",
                ease: "none",
                scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: true },
              }
            );
          }

          gsap.fromTo(
            copy,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: 0.04,
              scrollTrigger: { trigger: scene, start: "top 72%", end: "top 42%", scrub: 0.45 },
            }
          );
        });
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
        const copy = scene.querySelectorAll(".scene-copy > *");
        if (i === 0) {
          tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 0.9 }, 0);
          return;
        }
        tl.to(scenes[i - 1], { autoAlpha: 0, y: -32, scale: 0.975, duration: 0.55 }, ">+=0.08");
        tl.fromTo(scene, { autoAlpha: 0, y: 36, scale: 1.025 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.75 }, "<");
        tl.fromTo(media, { scale: 1.08, filter: "brightness(.7)" }, { scale: 1, filter: "brightness(1)", duration: 0.8 }, "<");
        tl.fromTo(copy, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.03 }, "<0.12");
      });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <section ref={ref} id="process" className="film-section">
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
                  <ScrollVideo slot={{ video: scene.film, alt: scene.alt }} />
                  <div className="film-media-shade" />
                </div>
                <div className="film-frame" aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
                <span className="film-scene-mark" aria-hidden="true">{scene.step}</span>
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

function Pledges() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(".pledge-panel", {
        opacity: 0,
        y: 26,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(
        ".pledge-media-strip img",
        { xPercent: 0 },
        { xPercent: -10, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="pledges" className="pledges-section">
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
          <img src={MEDIA.storyOne.src} alt={MEDIA.storyOne.alt} loading="lazy" decoding="async" />
          <img src={MEDIA.storyTwo.src} alt={MEDIA.storyTwo.alt} loading="lazy" decoding="async" />
        </div>
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
      <div className="proof-copy">
        <p className="dh-kicker">Proof, softly</p>
        <h2>People remember how the introduction felt.</h2>
      </div>
      <div className="quote-track">
        {quotes.map((q) => (
          <article key={q.who} className="quote-card">
            <span>&ldquo;</span>
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
        y: 22,
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
      <div className="contact-panel">
        <p className="dh-kicker">Begin privately</p>
        <h2>
          Send a single line. <em>We&rsquo;ll write back.</em>
        </h2>
        <p>
          No public profile is created. Your details are seen only by the principal matchmaker and are never shared
          as browseable data.
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
