import { useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BrandMark } from "@/components/landing/brand-mark";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/*
  Five-stage pinned scrollytelling piece: one ~500vh section, pinned via
  ScrollTrigger, with a single scrubbed GSAP timeline driving every element.
  Because scrub ties timeline.time() directly to scroll progress, scrolling
  up reverses everything for free — there is no separate "reverse" logic
  anywhere below, only forward-authored tweens.
*/

const GOLD = "#d9a760";
const ROSE = "#eca8d6";
const IVORY = "#f5e9dc";

const SCENES = [
  {
    n: "01",
    lead: "Start",
    accent: "privately.",
    copy: ["Tell us who you are.", "Nothing becomes public."],
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
  },
  {
    n: "02",
    lead: "We",
    accent: "review",
    copy: ["We personally review every application with care.", "Values, family & intent matter."],
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
  },
  {
    n: "03",
    lead: "We",
    accent: "curate.",
    copy: ["We look through the private circle and choose", "introductions worth making."],
    tag: "NO SWIPING · NO PUBLIC BROWSING",
  },
  {
    n: "04",
    lead: "We",
    accent: "introduce.",
    copy: ["When it feels right, we make a private introduction", "between two people who are open to it."],
    tag: "MUTUAL INTEREST · PRIVACY ALWAYS",
  },
  {
    n: "05",
    lead: "Then we",
    accent: "step away.",
    copy: ["The rest is between you two.", "We stay in the background, where we belong."],
    tag: "100% PRIVATE · NO PUBLIC PROFILES",
  },
] as const;

const FIELDS = [
  { label: "About you", icon: "person" },
  { label: "Values", icon: "heart" },
  { label: "Family", icon: "family" },
  { label: "What you're looking for", icon: "search" },
] as const;

const REVIEW_ROWS = [
  { label: "Values", icon: "heart" },
  { label: "Family", icon: "family" },
  { label: "Intent", icon: "shield" },
] as const;

const SILHOUETTES = [
  { x: 8, y: 8, highlight: false },
  { x: 30, y: 0, highlight: true },
  { x: 55, y: 3, highlight: false },
  { x: 82, y: 12, highlight: false },
  { x: 92, y: 44, highlight: true },
  { x: 84, y: 80, highlight: false },
  { x: 58, y: 92, highlight: false },
  { x: 30, y: 90, highlight: true },
  { x: 4, y: 76, highlight: false },
  { x: 0, y: 42, highlight: false },
] as const;

const FINAL_TAGS = [
  { label: "Private by design", icon: "lock" },
  { label: "Human reviewed", icon: "shield" },
  { label: "Intent focused", icon: "heart" },
  { label: "Meaningful introductions", icon: "family" },
] as const;

type IconName = "person" | "heart" | "family" | "search" | "shield" | "lock";

function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "person":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.4 5 5.6 4.3 8 3.8 10 5 12 7.4 14 5 16 3.8 18.4 4.3 21.6 5 22.8 8 21.3 11.2 19 15.6 12 20 12 20z" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <circle cx="8.5" cy="8" r="2.6" />
          <circle cx="15.5" cy="8" r="2.6" />
          <path d="M3.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5M10.5 19c0-2.9 2.3-5 5-5s5 2.1 5 5" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M19.5 19.5l-4-4" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <path d="M12 3l7 3v5c0 4.6-3 7.9-7 10-4-2.1-7-5.4-7-10V6l7-3z" />
          <path d="M9 12.2l2 2 4-4.2" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} {...common}>
          <rect x="5" y="11" width="14" height="9" rx="1.5" />
          <path d="M8 11V7.5a4 4 0 018 0V11" />
        </svg>
      );
  }
}

export function ScrollytellingSection() {
  const rootRef = useRef<HTMLElement>(null);

  const cardFrameRef = useRef<HTMLDivElement>(null);
  const cardEyebrowARef = useRef<HTMLSpanElement>(null);
  const cardEyebrowBRef = useRef<HTMLSpanElement>(null);
  const fieldsGroupRef = useRef<HTMLDivElement>(null);
  const lockGroupRef = useRef<HTMLDivElement>(null);
  const reviewGroupRef = useRef<HTMLDivElement>(null);
  const sealGroupRef = useRef<HTMLDivElement>(null);
  const silhouettesGroupRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const leftCheckRef = useRef<SVGSVGElement>(null);
  const rightCheckRef = useRef<SVGSVGElement>(null);
  const introLineRef = useRef<HTMLDivElement>(null);
  const heartPathRef = useRef<SVGPathElement>(null);
  const finalStatementRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const texts = gsap.utils.toArray<HTMLElement>(".st-text");
      const rules = gsap.utils.toArray<HTMLElement>(".st-rule-fill");
      const tags = gsap.utils.toArray<HTMLElement>(".st-tag");
      const fields = gsap.utils.toArray<HTMLElement>(".st-field");
      const reviewRows = gsap.utils.toArray<HTMLElement>(".st-review-row");
      const checks = gsap.utils.toArray<SVGElement>(".st-check");
      const silhouettes = gsap.utils.toArray<HTMLElement>(".st-silhouette");
      const badges = gsap.utils.toArray<HTMLElement>(".st-badge");
      const lines = gsap.utils.toArray<SVGLineElement>(".st-line");
      const finalTags = gsap.utils.toArray<HTMLElement>(".st-final-tag");

      if (reduce) {
        // static end state: no pin, no scrub — just show where the story lands
        gsap.set(texts, { opacity: (i) => (i === texts.length - 1 ? 1 : 0), y: 0 });
        gsap.set(tags, { opacity: (i) => (i === tags.length - 1 ? 1 : 0) });
        gsap.set(rules, { scaleX: 1 });
        gsap.set([cardFrameRef.current, silhouettesGroupRef.current, leftCardRef.current, rightCardRef.current, introLineRef.current], {
          opacity: 0,
        });
        gsap.set(heartPathRef.current, { opacity: 1 });
        gsap.set(finalStatementRef.current, { opacity: 1, y: 0 });
        gsap.set(finalTags, { opacity: 1, y: 0 });
        return;
      }

      // ---- initial state ----
      gsap.set(texts, { opacity: (i) => (i === 0 ? 1 : 0), y: (i) => (i === 0 ? 0 : 10) });
      gsap.set(tags, { opacity: (i) => (i === 0 ? 1 : 0) });
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(cardEyebrowBRef.current, { opacity: 0 });
      gsap.set(fields, { opacity: 0, y: 10 });
      gsap.set(lockGroupRef.current, { opacity: 0, y: 8 });
      gsap.set(reviewGroupRef.current, { opacity: 0 });
      gsap.set(reviewRows, { opacity: 0, x: -8 });
      gsap.set(checks, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
      gsap.set(sealGroupRef.current, { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" });
      gsap.set(silhouettesGroupRef.current, { opacity: 0 });
      gsap.set(silhouettes, { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" });
      gsap.set(badges, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
      gsap.set(lines, { opacity: 0 });
      gsap.set([leftCardRef.current, rightCardRef.current], { opacity: 0 });
      gsap.set(leftCardRef.current, { x: -180 });
      gsap.set(rightCardRef.current, { x: 180 });
      gsap.set([leftCheckRef.current, rightCheckRef.current], { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
      gsap.set(introLineRef.current, { opacity: 0, scaleX: 0, transformOrigin: "center" });
      gsap.set(heartPathRef.current, { opacity: 0 });
      gsap.set(finalStatementRef.current, { opacity: 0, y: 10 });
      gsap.set(finalTags, { opacity: 0, y: 10 });

      const UNIT = 1;
      const at = (scene: number, local: number) => scene * UNIT + local;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + window.innerHeight * 5,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ---- shared text / tag / rule crossfades at every scene boundary ----
      SCENES.forEach((_, i) => {
        if (i > 0) {
          tl.to(texts[i - 1], { opacity: 0, y: -10, duration: 0.12 }, at(i, -0.12));
          tl.to(tags[i - 1], { opacity: 0, duration: 0.1 }, at(i, -0.12));
        }
        tl.to(texts[i], { opacity: 1, y: 0, duration: 0.12 }, at(i, 0));
        tl.to(tags[i], { opacity: 1, duration: 0.1 }, at(i, 0.02));
        tl.fromTo(rules[i], { scaleX: 0 }, { scaleX: 1, ease: "none", duration: UNIT }, at(i, 0));
      });

      // ---- SCENE 1: Start privately — fields reveal, then lock ----
      fields.forEach((f, i) => {
        tl.to(f, { opacity: 1, y: 0, duration: 0.12 }, at(0, 0.12 + i * 0.12));
      });
      tl.to(lockGroupRef.current, { opacity: 1, y: 0, duration: 0.15 }, at(0, 0.68));
      tl.to([fieldsGroupRef.current, lockGroupRef.current], { opacity: 0, duration: 0.12 }, at(1, -0.14));
      tl.to(cardEyebrowARef.current, { opacity: 0, duration: 0.1 }, at(1, -0.14));

      // ---- SCENE 2: We review — rows check off, then a seal ----
      tl.to(cardEyebrowBRef.current, { opacity: 1, duration: 0.1 }, at(1, 0));
      tl.to(reviewGroupRef.current, { opacity: 1, duration: 0.1 }, at(1, 0));
      reviewRows.forEach((r, i) => {
        tl.to(r, { opacity: 1, x: 0, duration: 0.12 }, at(1, 0.12 + i * 0.14));
        tl.to(checks[i], { opacity: 1, scale: 1, duration: 0.12 }, at(1, 0.2 + i * 0.14));
      });
      tl.to(sealGroupRef.current, { opacity: 1, scale: 1, duration: 0.15 }, at(1, 0.66));
      tl.to([reviewGroupRef.current, sealGroupRef.current, cardEyebrowBRef.current], { opacity: 0, duration: 0.12 }, at(2, -0.16));
      tl.to(cardFrameRef.current, { scale: 0.42, duration: 0.3, ease: "power2.inOut" }, at(2, -0.18));

      // ---- SCENE 3: We curate — pull back, constellation, 3 highlighted ----
      tl.to(silhouettesGroupRef.current, { opacity: 1, duration: 0.15 }, at(2, 0));
      silhouettes.forEach((s, i) => {
        tl.to(s, { opacity: 1, scale: 1, duration: 0.15 }, at(2, 0.06 + i * 0.03));
      });
      lines.forEach((l, i) => {
        tl.to(l, { opacity: 1, duration: 0.2 }, at(2, 0.45 + i * 0.08));
      });
      badges.forEach((b, i) => {
        tl.to(b, { opacity: 1, scale: 1, duration: 0.12 }, at(2, 0.55 + i * 0.08));
      });
      tl.to([silhouettesGroupRef.current, cardFrameRef.current], { opacity: 0, duration: 0.15 }, at(3, -0.15));

      // ---- SCENE 4: We introduce — two profiles converge ----
      tl.to([leftCardRef.current, rightCardRef.current], { opacity: 1, duration: 0.12 }, at(3, 0));
      tl.to(leftCardRef.current, { x: -95, duration: 0.35, ease: "power2.inOut" }, at(3, 0.06));
      tl.to(rightCardRef.current, { x: 95, duration: 0.35, ease: "power2.inOut" }, at(3, 0.06));
      tl.to(introLineRef.current, { opacity: 1, scaleX: 1, duration: 0.3, ease: "power2.inOut" }, at(3, 0.18));
      tl.to([leftCheckRef.current, rightCheckRef.current], { opacity: 1, scale: 1, duration: 0.15 }, at(3, 0.58));
      tl.to(
        [leftCardRef.current, rightCardRef.current, leftCheckRef.current, rightCheckRef.current],
        { opacity: 0, duration: 0.15 },
        at(4, -0.15),
      );

      // ---- SCENE 5: Then we step away — line becomes the heart, statement lands ----
      tl.to(introLineRef.current, { opacity: 0, duration: 0.15 }, at(4, 0.02));
      tl.to(heartPathRef.current, { opacity: 1, duration: 0.25 }, at(4, 0.12));
      tl.to(finalStatementRef.current, { opacity: 1, y: 0, duration: 0.2 }, at(4, 0.38));
      finalTags.forEach((t, i) => {
        tl.to(t, { opacity: 1, y: 0, duration: 0.15 }, at(4, 0.55 + i * 0.06));
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="journey" ref={rootRef} className="relative h-screen overflow-hidden bg-[#140c08]" style={{ color: IVORY }}>
      {/* shared gradient for the connecting line / heart stroke */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="st-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={GOLD} />
            <stop offset="1" stopColor={ROSE} />
          </linearGradient>
        </defs>
      </svg>

      {/* brand lockup, top-left, present throughout */}
      <div className="absolute top-8 left-6 z-20 flex items-center gap-2.5 lg:top-10 lg:left-16">
        <BrandMark size={26} />
        <span className="font-display text-xl" style={{ color: IVORY }}>
          Desi<span style={{ color: ROSE }}>♥</span>Herz
        </span>
      </div>

      <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-20 pb-10 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:pt-0 lg:pb-0">
        {/* LEFT: text panel — one stacked block per scene, crossfading */}
        <div className="relative h-[220px] lg:h-[300px]">
          {SCENES.map((scene, i) => (
            <div key={scene.n} className="st-text absolute inset-0 flex flex-col justify-center">
              <span className="font-display text-6xl lg:text-8xl" style={{ color: GOLD }}>
                {scene.n}
              </span>
              <div className="relative my-5 h-px w-full max-w-[220px]" style={{ background: "rgba(245,233,220,0.15)" }}>
                <div className="st-rule-fill absolute inset-y-0 left-0 w-full" style={{ background: GOLD }} />
              </div>
              <h2 className="font-display text-4xl leading-[1.05] lg:text-6xl">
                {scene.lead} <span className="text-foil">{scene.accent}</span>
              </h2>
              <div className="mt-4 space-y-1">
                {scene.copy.map((line) => (
                  <p key={line} className="text-base lg:text-lg" style={{ color: "rgba(245,233,220,0.75)" }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* tag row, pinned near the bottom of the text column */}
          <div className="absolute -bottom-2 left-0 lg:bottom-4">
            {SCENES.map((scene) => (
              <div
                key={scene.n}
                className="st-tag absolute inline-flex items-center gap-3 font-mono text-xs tracking-[0.15em] whitespace-nowrap"
                style={{ color: "rgba(245,233,220,0.55)" }}
              >
                <span style={{ color: GOLD }}>✦</span>
                {scene.tag}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: visual stage */}
        <div className="relative mx-auto h-[380px] w-full max-w-[320px] lg:h-[520px] lg:max-w-[440px]">
          {/* ambient glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(45% 45% at 50% 50%, rgba(217,167,96,0.10), transparent 70%)" }}
          />

          {/* persistent card frame: scenes 1–3 */}
          <div
            ref={cardFrameRef}
            className="absolute inset-0 m-auto flex h-[300px] w-[250px] flex-col rounded-2xl border p-5 lg:h-[360px] lg:w-[300px] lg:p-6"
            style={{ borderColor: "rgba(217,167,96,0.35)", background: "rgba(217,167,96,0.03)" }}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <BrandMark size={18} />
              <span className="font-display text-sm">
                Desi<span style={{ color: ROSE }}>♥</span>Herz
              </span>
            </div>
            <div className="relative mb-5 flex h-4 items-center justify-center">
              <span ref={cardEyebrowARef} className="absolute font-mono text-[10px] tracking-[0.22em]" style={{ color: GOLD }}>
                PRIVATE PROFILE
              </span>
              <span ref={cardEyebrowBRef} className="absolute font-mono text-[10px] tracking-[0.22em]" style={{ color: GOLD }}>
                PERSONALLY REVIEWED
              </span>
            </div>
            <div className="mb-6 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />

            <div ref={fieldsGroupRef} className="flex flex-1 flex-col gap-4">
              {FIELDS.map((f) => (
                <div key={f.label} className="st-field flex items-center gap-3">
                  <Icon name={f.icon} className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                  <div className="flex-1">
                    <div className="mb-1 text-xs" style={{ color: "rgba(245,233,220,0.8)" }}>
                      {f.label}
                    </div>
                    <div className="h-px w-full" style={{ background: "rgba(245,233,220,0.15)" }} />
                  </div>
                </div>
              ))}
            </div>

            <div ref={reviewGroupRef} className="absolute inset-x-5 top-[76px] flex flex-col gap-5 lg:inset-x-6 lg:top-[92px]">
              {REVIEW_ROWS.map((r) => (
                <div key={r.label} className="st-review-row flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name={r.icon} className="h-4 w-4" style={{ color: GOLD }} />
                    <span className="text-sm">{r.label}</span>
                  </div>
                  <svg className="st-check h-5 w-5" viewBox="0 0 24 24" fill="none" stroke={ROSE} strokeWidth={1.8}>
                    <circle cx="12" cy="12" r="9" opacity="0.5" />
                    <path d="M8 12.3l2.6 2.6L16.5 9" />
                  </svg>
                </div>
              ))}
            </div>

            <div ref={lockGroupRef} className="mt-4 flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: GOLD }}>
                <Icon name="lock" className="h-4 w-4" style={{ color: GOLD }} />
              </div>
              <span className="font-mono text-[9px] tracking-[0.18em]" style={{ color: "rgba(245,233,220,0.6)" }}>
                ONLY OUR MATCHMAKERS SEE THIS
              </span>
            </div>

            <div
              ref={sealGroupRef}
              className="absolute -right-4 -bottom-4 flex h-14 w-14 items-center justify-center rounded-full border-2"
              style={{ borderColor: ROSE, background: "#140c08" }}
            >
              <Icon name="shield" className="h-5 w-5" style={{ color: GOLD }} />
            </div>
          </div>

          {/* constellation: scene 3 */}
          <div ref={silhouettesGroupRef} className="pointer-events-none absolute inset-0">
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {SILHOUETTES.filter((s) => s.highlight).map((s, i) => (
                <line
                  key={i}
                  className="st-line"
                  x1="50"
                  y1="50"
                  x2={s.x + 4}
                  y2={s.y + 5}
                  stroke={GOLD}
                  strokeWidth={0.3}
                  strokeDasharray="1.4 1.2"
                />
              ))}
            </svg>
            {SILHOUETTES.map((s, i) => (
              <div
                key={i}
                className="st-silhouette absolute flex h-9 w-7 items-center justify-center rounded-md border"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  borderColor: s.highlight ? ROSE : "rgba(217,167,96,0.25)",
                }}
              >
                <Icon name="person" className="h-3.5 w-3.5" style={{ color: s.highlight ? GOLD : "rgba(245,233,220,0.3)" }} />
                {s.highlight && (
                  <span className="st-badge absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full" style={{ background: ROSE }} />
                )}
              </div>
            ))}
          </div>

          {/* two converging profiles: scene 4 */}
          <div
            ref={leftCardRef}
            className="absolute top-1/2 left-1/2 flex h-32 w-24 -translate-y-1/2 flex-col items-center justify-center gap-3 rounded-xl border"
            style={{ borderColor: GOLD, background: "rgba(217,167,96,0.04)" }}
          >
            <Icon name="person" className="h-6 w-6" style={{ color: GOLD }} />
            <svg ref={leftCheckRef} className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke={ROSE} strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" opacity="0.5" />
              <path d="M8 12.3l2.6 2.6L16.5 9" />
            </svg>
          </div>
          <div
            ref={rightCardRef}
            className="absolute top-1/2 left-1/2 flex h-32 w-24 -translate-y-1/2 flex-col items-center justify-center gap-3 rounded-xl border"
            style={{ borderColor: ROSE, background: "rgba(236,168,214,0.04)" }}
          >
            <Icon name="person" className="h-6 w-6" style={{ color: ROSE }} />
            <svg ref={rightCheckRef} className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke={ROSE} strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" opacity="0.5" />
              <path d="M8 12.3l2.6 2.6L16.5 9" />
            </svg>
          </div>
          <div
            ref={introLineRef}
            className="absolute top-1/2 left-1/2 z-[-1] h-px w-[92px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "linear-gradient(90deg, " + GOLD + ", " + ROSE + ")" }}
          />

          {/* heart + final statement: scene 5 */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 90" className="h-14 w-14 lg:h-16 lg:w-16">
              <path
                ref={heartPathRef}
                d="M50 82 C20 60 4 40 4 22 C4 8 16 0 28 0 C38 0 46 6 50 16 C54 6 62 0 72 0 C84 0 96 8 96 22 C96 40 80 60 50 82Z"
                fill="none"
                stroke="url(#st-gradient)"
                strokeWidth={2.4}
              />
            </svg>
            <div ref={finalStatementRef} className="mt-6 text-center">
              <p className="font-display text-lg lg:text-xl" style={{ color: GOLD }}>
                Real connections. Real people.
              </p>
              <p className="font-display text-lg lg:text-xl">
                <em className="not-italic" style={{ color: ROSE }}>
                  That&rsquo;s
                </em>{" "}
                Desi<span style={{ color: ROSE }}>♥</span>Herz.
              </p>
            </div>
            <div className="mt-6 flex gap-5 lg:gap-6">
              {FINAL_TAGS.map((t) => (
                <div key={t.label} className="st-final-tag flex flex-col items-center gap-2">
                  <Icon name={t.icon} className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: GOLD }} />
                  <span className="max-w-[64px] text-center text-[9px] leading-tight lg:max-w-[72px] lg:text-[10px]" style={{ color: "rgba(245,233,220,0.6)" }}>
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
