import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import coupleHero from "@/assets/couple-hero.jpg";
import coupleStory1 from "@/assets/couple-story-1.jpg";
import coupleStory2 from "@/assets/couple-story-2.jpg";
import coupleHands from "@/assets/couple-hands.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
      { name: "theme-color", content: "#09050a" },
      {
        name: "keywords",
        content:
          "private matrimony, luxury matchmaking, Indian matrimony, invitation only matchmaking, bespoke marriage bureau",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Inter:wght@300;400;500&display=swap",
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
    <div className="relative grain">
      {mounted && (
        <>
          <SmoothScroll />
          <Cursor />
        </>
      )}
      <Nav />
      <Hero />
      <About />
      <Pledges />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO — pinned GSAP heart-expand scroll scene
───────────────────────────────────────────── */
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heartSvgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !stickyRef.current || !heartSvgRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0–40%): heart outline pulses and text fades
      tl.to(
        textRef.current,
        { opacity: 0, y: -30, ease: "power2.in", duration: 0.25 },
        0,
      );

      // Phase 2 (25–100%): heart scales up massively
      tl.to(
        heartSvgRef.current,
        {
          scale: 18,
          ease: "power1.inOut",
          duration: 0.75,
          transformOrigin: "center center",
        },
        0.1,
      );

      // Phase 3 (50–100%): overlay image fades in as heart fills screen
      tl.to(
        overlayRef.current,
        { opacity: 1, ease: "power2.inOut", duration: 0.5 },
        0.4,
      );
    },
    { scope: containerRef },
  );

  // Entrance animation
  useGSAP(
    () => {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(heartSvgRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1.8,
        ease: "elastic.out(1, 0.6)",
        delay: 0.6,
        transformOrigin: "center center",
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} id="top" className="relative" style={{ height: "320vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        {/* Full-screen couple image revealed by heart */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0"
          style={{ zIndex: 1 }}
        >
          <img
            src={coupleHero}
            alt="A couple united through DesiHerz"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.55) sepia(0.2)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(9,5,10,0.1) 0%, rgba(9,5,10,0.7) 100%)",
            }}
          />
        </div>

        {/* Heart SVG */}
        <svg
          ref={heartSvgRef}
          className="absolute"
          style={{ zIndex: 2, width: "min(340px, 55vw)", height: "auto" }}
          viewBox="0 0 200 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="heartClipDef">
              <path
                id="clip-heart-path"
                d="M100 170 C100 170 15 110 15 55 C15 28 35 10 60 10 C75 10 88 18 100 30 C112 18 125 10 140 10 C165 10 185 28 185 55 C185 110 100 170 100 170 Z"
              />
            </clipPath>
          </defs>

          {/* Image inside heart */}
          <image
            href={coupleHands}
            x="0"
            y="0"
            width="200"
            height="190"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#heartClipDef)"
            style={{ filter: "brightness(0.7) sepia(0.15)" }}
          />

          {/* Gold border */}
          <path
            id="heart-path"
            d="M100 170 C100 170 15 110 15 55 C15 28 35 10 60 10 C75 10 88 18 100 30 C112 18 125 10 140 10 C165 10 185 28 185 55 C185 110 100 170 100 170 Z"
            stroke="#c9a04a"
            strokeWidth="1.5"
            fill="none"
            opacity="0.9"
          />

          {/* Inner gold glow stroke */}
          <path
            d="M100 165 C100 165 20 108 20 57 C20 32 38 14 62 14 C77 14 89 22 100 33 C111 22 123 14 138 14 C162 14 180 32 180 57 C180 108 100 165 100 165 Z"
            stroke="#c9a04a"
            strokeWidth="0.5"
            fill="none"
            opacity="0.35"
          />
        </svg>

        {/* Hero text */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-24"
          style={{ zIndex: 3, pointerEvents: "none" }}
        >
          <p className="eyebrow mb-5 text-center tracking-[0.38em]">Est. MMXXV · By Invitation</p>
          <h1
            className="font-display text-center font-normal"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "var(--cream)",
              maxWidth: "720px",
            }}
          >
            Two hearts.{" "}
            <em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>One quiet</em>
            <br />
            introduction.
          </h1>
          <div className="mt-8 hairline w-16 mx-auto" />
          <p
            className="mt-6 text-center font-sans"
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(245,237,224,0.5)",
            }}
          >
            Scroll to reveal
          </p>
        </div>

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 10,
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(9,5,10,0.65) 100%)",
          }}
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-left", {
        x: -60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none none" },
      });
      gsap.from(".about-right", {
        x: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none none" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="about" className="section-pad" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left */}
        <div className="about-left">
          <p className="eyebrow mb-8">— About</p>
          <h2
            className="font-display font-normal"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
          >
            Not an app.
            <br />
            Not a database.
            <br />
            <em style={{ color: "var(--gold-soft)" }}>A trusted house.</em>
          </h2>
          <div className="hairline mt-10 w-20" />
          <p className="mt-10 font-sans leading-relaxed" style={{ color: "rgba(245,237,224,0.62)", fontSize: "1.05rem", maxWidth: "480px" }}>
            DesiHerz is not a platform. It is a house — a quiet room where families with intention
            find one another. We carry no advertisements, no swipe logic, and no algorithms.
          </p>
          <p className="mt-6 font-sans leading-relaxed" style={{ color: "rgba(245,237,224,0.62)", fontSize: "1.05rem", maxWidth: "480px" }}>
            Each season, we accept a small number of families. What follows is a conversation —
            careful, human, and unhurried.
          </p>
          <a
            href="#contact"
            className="inline-block mt-12"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--gold)",
              borderBottom: "1px solid rgba(201,160,74,0.4)",
              paddingBottom: "4px",
              transition: "color 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--gold-soft)";
              (e.currentTarget as HTMLElement).style.borderBottomColor = "var(--gold-soft)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--gold)";
              (e.currentTarget as HTMLElement).style.borderBottomColor = "rgba(201,160,74,0.4)";
            }}
          >
            Begin a conversation
          </a>
        </div>

        {/* Right — image */}
        <div className="about-right relative">
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/5", border: "1px solid rgba(201,160,74,0.14)" }}
          >
            <img
              src={coupleStory1}
              alt="A couple introduced by DesiHerz"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.75) sepia(0.1)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,5,10,0.7) 0%, transparent 50%)",
              }}
            />
          </div>
          <div
            className="absolute"
            style={{
              bottom: "-1.5rem",
              right: "-1.5rem",
              width: "45%",
              aspectRatio: "3/4",
              border: "1px solid rgba(201,160,74,0.2)",
              overflow: "hidden",
            }}
          >
            <img
              src={coupleHands}
              alt="Couple's hands"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.65) sepia(0.15)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PLEDGES
───────────────────────────────────────────── */
const PLEDGES = [
  {
    n: "01",
    title: "Absolute Privacy",
    body: "No profile is ever published. No name is shared without explicit consent. What you tell us stays within these walls.",
  },
  {
    n: "02",
    title: "Verified Members",
    body: "Every family we work with has been personally vetted. We do not accept introductions sight unseen.",
  },
  {
    n: "03",
    title: "Human Curation",
    body: "No automated suggestions. Every introduction is considered by a human curator who knows both families.",
  },
  {
    n: "04",
    title: "Family-Aware",
    body: "We understand that a marriage is not between two people alone. We hold space for the full picture.",
  },
];

function Pledges() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".pledge-card", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="pledges"
      className="section-pad"
      style={{
        background: "linear-gradient(160deg, #110408 0%, var(--background) 100%)",
        borderTop: "1px solid rgba(201,160,74,0.1)",
        borderBottom: "1px solid rgba(201,160,74,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20">
          <p className="eyebrow mb-6">— Our Pledges</p>
          <h2
            className="font-display font-normal"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", maxWidth: "600px" }}
          >
            Four pledges —{" "}
            <em style={{ color: "var(--gold-soft)" }}>sealed,</em>
            <br />
            not advertised.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(201,160,74,0.08)" }}>
          {PLEDGES.map((p) => (
            <div key={p.n} className="pledge-card">
              <div className="flex items-start justify-between mb-8">
                <span
                  className="font-display"
                  style={{ fontSize: "2.5rem", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}
                >
                  {p.n}
                </span>
                <div className="hairline" style={{ width: "2rem", marginTop: "1.2rem" }} />
              </div>
              <h3
                className="font-display font-normal mb-4"
                style={{ fontSize: "1.6rem", color: "var(--cream)", lineHeight: 1.15 }}
              >
                {p.title}
              </h3>
              <p
                className="font-sans leading-relaxed"
                style={{ color: "rgba(245,237,224,0.58)", fontSize: "0.95rem" }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROCESS — vertical timeline
───────────────────────────────────────────── */
const STEPS = [
  {
    roman: "I",
    title: "The First Letter",
    body: "You write to us — briefly, honestly. No forms. No questionnaires. A few lines about who you are and what you seek.",
  },
  {
    roman: "II",
    title: "The Conversation",
    body: "We meet — in person where possible, by call when not. We listen carefully to what you say, and to what you leave unsaid.",
  },
  {
    roman: "III",
    title: "The Introduction",
    body: "A single, considered introduction. Not a shortlist. One family we believe understands yours.",
  },
  {
    roman: "IV",
    title: "The Meeting",
    body: "Both families meet at their own pace. We remain available — as a quiet presence, never as an intermediary who crowds the room.",
  },
  {
    roman: "V",
    title: "The Alliance",
    body: "If both families wish to proceed, we walk alongside through the rituals that follow — for as long as you need us.",
  },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Draw the timeline line
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      // Stagger each step
      gsap.from(".process-step", {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -50 : 50),
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="process" className="section-pad" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 md:mb-20 text-center">
          <p className="eyebrow mb-6">— The Process</p>
          <h2
            className="font-display font-normal"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)" }}
          >
            Five unhurried{" "}
            <em style={{ color: "var(--gold-soft)" }}>steps.</em>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
          {/* Central gold line */}
          <div className="hidden md:block absolute" style={{ left: "50%", top: 0, bottom: 0, transform: "translateX(-50%)" }}>
            <div
              ref={lineRef}
              style={{
                width: "1px",
                height: "100%",
                background: "linear-gradient(180deg, transparent 0%, var(--gold) 8%, var(--gold) 92%, transparent 100%)",
              }}
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {STEPS.map((s, i) => (
              <div
                key={s.roman}
                className={`process-step relative md:grid md:grid-cols-2 md:gap-16 items-center ${
                  i % 2 === 0 ? "" : "md:[direction:rtl]"
                }`}
                style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}
              >
                <div style={{ direction: "ltr" }}>
                  {/* Dot on timeline */}
                  <div
                    className="hidden md:block absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "11px",
                      height: "11px",
                      borderRadius: "50%",
                      background: "var(--gold)",
                      boxShadow: "0 0 12px rgba(201,160,74,0.6)",
                    }}
                  />
                  <p className="step-numeral mb-3">{s.roman}</p>
                  <h3
                    className="font-display font-normal mb-4"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--cream)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="font-sans leading-relaxed"
                    style={{ color: "rgba(245,237,224,0.58)", fontSize: "0.95rem", maxWidth: "360px" }}
                  >
                    {s.body}
                  </p>
                </div>
                {/* Spacer column for alternate alignment */}
                <div className="hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:
      "We had given up on the apps and the aunties both. DesiHerz felt like neither — it felt like a friend who happened to know the right people.",
    name: "A. & R.",
    detail: "Married 2025 · Mumbai / London",
  },
  {
    quote:
      "What surprised us was the slowness. Nothing was rushed. They understood that the right introduction needed to wait for the right moment.",
    name: "The Khanna Family",
    detail: "Delhi · 2024",
  },
  {
    quote:
      "Three seasons passed before they made our introduction. When it came, it was the only introduction we needed.",
    name: "S. & P.",
    detail: "Karachi · Lahore · 2025",
  },
];

function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".quote-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.16,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="testimonials"
      className="section-pad"
      style={{
        background: "linear-gradient(160deg, var(--background) 0%, #110408 100%)",
        borderTop: "1px solid rgba(201,160,74,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20">
          <p className="eyebrow mb-6">— Testimonials</p>
          <h2
            className="font-display font-normal"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", maxWidth: "640px" }}
          >
            Spoken softly,{" "}
            <em style={{ color: "var(--gold-soft)" }}>with permission.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(201,160,74,0.08)" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="quote-card">
              <blockquote
                className="font-display font-normal"
                style={{
                  fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)",
                  lineHeight: 1.55,
                  color: "var(--cream)",
                  marginTop: "1.75rem",
                }}
              >
                "{t.quote}"
              </blockquote>
              <div
                className="mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(201,160,74,0.15)" }}
              >
                <p
                  className="font-display"
                  style={{ color: "var(--gold-soft)", fontSize: "1.1rem" }}
                >
                  {t.name}
                </p>
                <p
                  className="mt-1 font-sans"
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,224,0.42)",
                  }}
                >
                  {t.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Couple photo strip */}
        <div className="mt-16 grid grid-cols-2 gap-px" style={{ background: "rgba(201,160,74,0.08)" }}>
          {[coupleStory2, coupleHero].map((src, i) => (
            <div key={i} className="relative overflow-hidden" style={{ aspectRatio: "16/7" }}>
              <img
                src={src}
                alt="Couple united by DesiHerz"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.55) sepia(0.15)", transition: "transform 0.8s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(9,5,10,0.5) 0%, transparent 60%)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-inner > *", {
        y: 35,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="contact"
      className="section-pad"
      style={{
        background: "var(--background)",
        borderTop: "1px solid rgba(201,160,74,0.1)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center contact-inner">
        <p className="eyebrow mb-8">— Apply</p>
        <h2
          className="font-display font-normal"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", lineHeight: 1.0 }}
        >
          Send a single line.
          <br />
          <em style={{ color: "var(--gold-soft)" }}>We'll write back.</em>
        </h2>
        <p
          className="mt-8 font-sans leading-relaxed mx-auto"
          style={{ color: "rgba(245,237,224,0.58)", fontSize: "1rem", maxWidth: "460px" }}
        >
          We accept a limited circle each season. Tell us who you are — we read every note
          personally and respond within a fortnight.
        </p>

        <form
          className="mt-14 text-left"
          style={{ maxWidth: "560px", margin: "3.5rem auto 0" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {[
              { label: "Full Name", type: "text", name: "name", placeholder: "Your name" },
              { label: "Family Email", type: "email", name: "email", placeholder: "email@family.com" },
              { label: "City", type: "text", name: "city", placeholder: "Where you are" },
              { label: "Year of Birth", type: "text", name: "yob", placeholder: "YYYY" },
            ].map((f) => (
              <div key={f.name}>
                <label
                  className="block font-sans mb-2"
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,224,0.45)",
                  }}
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  placeholder={f.placeholder}
                  className="form-input"
                />
              </div>
            ))}
          </div>

          <div className="mb-10">
            <label
              className="block font-sans mb-2"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(245,237,224,0.45)",
              }}
            >
              A few lines about you
            </label>
            <textarea
              rows={4}
              placeholder="Tell us a little about yourself and what you seek..."
              className="form-input resize-none"
              style={{ lineHeight: 1.7 }}
            />
          </div>

          <button
            type="submit"
            className="w-full font-sans"
            style={{
              padding: "1.1rem",
              fontSize: "0.62rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "var(--gold)",
              border: "1px solid rgba(201,160,74,0.5)",
              background: "rgba(61,12,24,0.55)",
              cursor: "pointer",
              transition: "background 0.3s, border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "var(--maroon)";
              el.style.borderColor = "var(--gold)";
              el.style.color = "var(--gold-soft)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(61,12,24,0.55)";
              el.style.borderColor = "rgba(201,160,74,0.5)";
              el.style.color = "var(--gold)";
            }}
          >
            Submit Quietly
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="relative"
      style={{
        borderTop: "1px solid rgba(201,160,74,0.1)",
        background: "#09050a",
        padding: "3rem 1.5rem",
      }}
    >
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        style={{ paddingLeft: "clamp(0px, 2rem, 2rem)", paddingRight: "clamp(0px, 2rem, 2rem)" }}
      >
        <div>
          <div className="font-display" style={{ fontSize: "1.4rem", color: "var(--cream)", letterSpacing: "-0.01em" }}>
            Desi
            <span style={{ color: "var(--gold)" }}>♥</span>
            Herz
          </div>
          <p
            className="mt-2 font-sans"
            style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(245,237,224,0.38)" }}
          >
            © MMXXV · A Private House
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          {[
            { label: "Discretion", href: "#" },
            { label: "Terms", href: "#" },
            { label: "office@desiherz.com", href: "mailto:office@desiherz.com" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-sans"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(245,237,224,0.38)",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--gold)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(245,237,224,0.38)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
