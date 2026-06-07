import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as gsapWithCSS } from "../_libs/gsap.mjs";
import { u as useGSAP } from "../_libs/gsap__react.mjs";
import { L as Lenis } from "../_libs/lenis.mjs";
function Cursor() {
  const dot = reactExports.useRef(null);
  const ring = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let rx = 0, ry = 0, x = 0, y = 0;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.left = x + "px";
        dot.current.style.top = y + "px";
      }
    };
    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.left = rx + "px";
        ring.current.style.top = ry + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: dot, className: "cursor-dot", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: ring, className: "cursor-ring", "aria-hidden": true })
  ] });
}
const links = [
  { href: "#about", label: "About" },
  { href: "#pledges", label: "Pledges" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Stories" },
  { href: "#contact", label: "Apply" }
];
function Nav() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.25rem 3.5rem",
        transition: "background 0.5s ease, border-color 0.5s ease",
        background: scrolled ? "rgba(9,5,10,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,160,74,0.1)" : "1px solid transparent"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "#top",
            style: {
              fontFamily: "var(--font-display), 'Playfair Display', serif",
              fontSize: "1.5rem",
              color: "var(--cream, #f5ede0)",
              letterSpacing: "-0.01em",
              textDecoration: "none"
            },
            children: [
              "Desi",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--gold, #c9a04a)" }, children: "♥" }),
              "Herz"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ul",
          {
            style: {
              display: "none",
              gap: "2.75rem",
              listStyle: "none",
              margin: 0,
              padding: 0
            },
            className: "md:flex",
            children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: l.href,
                style: {
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(245,237,224,0.52)",
                  textDecoration: "none",
                  transition: "color 0.3s"
                },
                onMouseEnter: (e) => e.currentTarget.style.color = "var(--gold, #c9a04a)",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(245,237,224,0.52)",
                children: l.label
              }
            ) }, l.href))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#contact",
            style: {
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.6rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "var(--gold, #c9a04a)",
              border: "1px solid rgba(201,160,74,0.45)",
              background: "rgba(61,12,24,0.45)",
              padding: "0.65rem 1.4rem",
              textDecoration: "none",
              transition: "background 0.3s, border-color 0.3s, color 0.3s"
            },
            onMouseEnter: (e) => {
              const el = e.currentTarget;
              el.style.background = "var(--maroon, #3d0c18)";
              el.style.borderColor = "var(--gold, #c9a04a)";
              el.style.color = "var(--gold-soft, #e8c278)";
            },
            onMouseLeave: (e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(61,12,24,0.45)";
              el.style.borderColor = "rgba(201,160,74,0.45)";
              el.style.color = "var(--gold, #c9a04a)";
            },
            children: "Private Invite"
          }
        )
      ]
    }
  );
}
function SmoothScroll() {
  reactExports.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4
    });
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
const coupleHero = "data:image/jpeg;base64,";
const coupleStory1 = "data:image/jpeg;base64,";
const coupleStory2 = "data:image/jpeg;base64,";
const coupleHands = "data:image/jpeg;base64,";
function Index() {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => setMounted(true), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grain", children: [
    mounted && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmoothScroll, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Cursor, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(About, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Pledges, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Process, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Testimonials, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Contact, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Hero() {
  const containerRef = reactExports.useRef(null);
  const stickyRef = reactExports.useRef(null);
  const heartSvgRef = reactExports.useRef(null);
  const textRef = reactExports.useRef(null);
  const overlayRef = reactExports.useRef(null);
  useGSAP(() => {
    if (!containerRef.current || !stickyRef.current || !heartSvgRef.current) return;
    const heart = heartSvgRef.current.querySelector("#heart-path");
    const clipHeart = heartSvgRef.current.querySelector("#clip-heart-path");
    if (!heart || !clipHeart) return;
    const tl = gsapWithCSS.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        pin: stickyRef.current,
        anticipatePin: 1
      }
    });
    tl.to(textRef.current, {
      opacity: 0,
      y: -30,
      ease: "power2.in",
      duration: 0.25
    }, 0);
    tl.to(heartSvgRef.current, {
      scale: 18,
      ease: "power1.inOut",
      duration: 0.75,
      transformOrigin: "center center"
    }, 0.1);
    tl.to(overlayRef.current, {
      opacity: 1,
      ease: "power2.inOut",
      duration: 0.5
    }, 0.4);
  }, {
    scope: containerRef
  });
  useGSAP(() => {
    gsapWithCSS.from(textRef.current, {
      opacity: 0,
      y: 40,
      duration: 1.4,
      ease: "power3.out",
      delay: 0.3
    });
    gsapWithCSS.from(heartSvgRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 1.8,
      ease: "elastic.out(1, 0.6)",
      delay: 0.6,
      transformOrigin: "center center"
    });
  }, {
    scope: containerRef
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref: containerRef, id: "top", className: "relative", style: {
    height: "320vh"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: stickyRef, className: "sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center", style: {
    background: "var(--background)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: overlayRef, className: "absolute inset-0 opacity-0", style: {
      zIndex: 1
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: coupleHero, alt: "A couple united through DesiHerz", className: "w-full h-full object-cover", style: {
        filter: "brightness(0.55) sepia(0.2)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "radial-gradient(ellipse at center, rgba(9,5,10,0.1) 0%, rgba(9,5,10,0.7) 100%)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { ref: heartSvgRef, className: "absolute", style: {
      zIndex: 2,
      width: "min(340px, 55vw)",
      height: "auto"
    }, viewBox: "0 0 200 190", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "heartClipDef", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { id: "clip-heart-path", d: "M100 170 C100 170 15 110 15 55 C15 28 35 10 60 10 C75 10 88 18 100 30 C112 18 125 10 140 10 C165 10 185 28 185 55 C185 110 100 170 100 170 Z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("image", { href: coupleHands, x: "0", y: "0", width: "200", height: "190", preserveAspectRatio: "xMidYMid slice", clipPath: "url(#heartClipDef)", style: {
        filter: "brightness(0.7) sepia(0.15)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { id: "heart-path", d: "M100 170 C100 170 15 110 15 55 C15 28 35 10 60 10 C75 10 88 18 100 30 C112 18 125 10 140 10 C165 10 185 28 185 55 C185 110 100 170 100 170 Z", stroke: "#c9a04a", strokeWidth: "1.5", fill: "none", opacity: "0.9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M100 165 C100 165 20 108 20 57 C20 32 38 14 62 14 C77 14 89 22 100 33 C111 22 123 14 138 14 C162 14 180 32 180 57 C180 108 100 165 100 165 Z", stroke: "#c9a04a", strokeWidth: "0.5", fill: "none", opacity: "0.35" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: textRef, className: "absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-24", style: {
      zIndex: 3,
      pointerEvents: "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mb-5 text-center tracking-[0.38em]", children: "Est. MMXXV · By Invitation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-center font-normal", style: {
        fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
        color: "var(--cream)",
        maxWidth: "720px"
      }, children: [
        "Two hearts.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: {
          color: "var(--gold-soft)",
          fontStyle: "italic"
        }, children: "One quiet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "introduction."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 hairline w-16 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center font-sans", style: {
        fontSize: "0.8rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(245,237,224,0.5)"
      }, children: "Scroll to reveal" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
      zIndex: 10,
      background: "radial-gradient(ellipse at center, transparent 30%, rgba(9,5,10,0.65) 100%)"
    } })
  ] }) });
}
function About() {
  const ref = reactExports.useRef(null);
  useGSAP(() => {
    gsapWithCSS.from(".about-left", {
      x: -60,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
    gsapWithCSS.from(".about-right", {
      x: 60,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.15,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
  }, {
    scope: ref
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref, id: "about", className: "section-pad", style: {
    background: "var(--background)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "about-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mb-8", children: "— About" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-normal", style: {
        fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
        lineHeight: 1.05
      }, children: [
        "Not an app.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Not a database.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: {
          color: "var(--gold-soft)"
        }, children: "A trusted house." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline mt-10 w-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 font-sans leading-relaxed", style: {
        color: "rgba(245,237,224,0.62)",
        fontSize: "1.05rem",
        maxWidth: "480px"
      }, children: "DesiHerz is not a platform. It is a house — a quiet room where families with intention find one another. We carry no advertisements, no swipe logic, and no algorithms." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-sans leading-relaxed", style: {
        color: "rgba(245,237,224,0.62)",
        fontSize: "1.05rem",
        maxWidth: "480px"
      }, children: "Each season, we accept a small number of families. What follows is a conversation — careful, human, and unhurried." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#contact", className: "inline-block mt-12", style: {
        fontSize: "0.62rem",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "var(--gold)",
        borderBottom: "1px solid rgba(201,160,74,0.4)",
        paddingBottom: "4px",
        transition: "color 0.3s, border-color 0.3s"
      }, onMouseEnter: (e) => {
        e.currentTarget.style.color = "var(--gold-soft)";
        e.currentTarget.style.borderBottomColor = "var(--gold-soft)";
      }, onMouseLeave: (e) => {
        e.currentTarget.style.color = "var(--gold)";
        e.currentTarget.style.borderBottomColor = "rgba(201,160,74,0.4)";
      }, children: "Begin a conversation" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "about-right relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", style: {
        aspectRatio: "4/5",
        border: "1px solid rgba(201,160,74,0.14)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: coupleStory1, alt: "A couple introduced by DesiHerz", className: "w-full h-full object-cover", style: {
          filter: "brightness(0.75) sepia(0.1)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
          background: "linear-gradient(to top, rgba(9,5,10,0.7) 0%, transparent 50%)"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute", style: {
        bottom: "-1.5rem",
        right: "-1.5rem",
        width: "45%",
        aspectRatio: "3/4",
        border: "1px solid rgba(201,160,74,0.2)",
        overflow: "hidden"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: coupleHands, alt: "Couple's hands", className: "w-full h-full object-cover", style: {
        filter: "brightness(0.65) sepia(0.15)"
      } }) })
    ] })
  ] }) });
}
const PLEDGES = [{
  n: "01",
  title: "Absolute Privacy",
  body: "No profile is ever published. No name is shared without explicit consent. What you tell us stays within these walls."
}, {
  n: "02",
  title: "Verified Members",
  body: "Every family we work with has been personally vetted. We do not accept introductions sight unseen."
}, {
  n: "03",
  title: "Human Curation",
  body: "No automated suggestions. Every introduction is considered by a human curator who knows both families."
}, {
  n: "04",
  title: "Family-Aware",
  body: "We understand that a marriage is not between two people alone. We hold space for the full picture."
}];
function Pledges() {
  const ref = reactExports.useRef(null);
  useGSAP(() => {
    gsapWithCSS.from(".pledge-card", {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  }, {
    scope: ref
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref, id: "pledges", className: "section-pad", style: {
    background: "linear-gradient(160deg, #110408 0%, var(--background) 100%)",
    borderTop: "1px solid rgba(201,160,74,0.1)",
    borderBottom: "1px solid rgba(201,160,74,0.1)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16 md:mb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mb-6", children: "— Our Pledges" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-normal", style: {
        fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
        maxWidth: "600px"
      }, children: [
        "Four pledges —",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: {
          color: "var(--gold-soft)"
        }, children: "sealed," }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "not advertised."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-px", style: {
      background: "rgba(201,160,74,0.08)"
    }, children: PLEDGES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pledge-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display", style: {
          fontSize: "2.5rem",
          color: "var(--gold)",
          fontWeight: 400,
          lineHeight: 1
        }, children: p.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline", style: {
          width: "2rem",
          marginTop: "1.2rem"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-normal mb-4", style: {
        fontSize: "1.6rem",
        color: "var(--cream)",
        lineHeight: 1.15
      }, children: p.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-sans leading-relaxed", style: {
        color: "rgba(245,237,224,0.58)",
        fontSize: "0.95rem"
      }, children: p.body })
    ] }, p.n)) })
  ] }) });
}
const STEPS = [{
  roman: "I",
  title: "The First Letter",
  body: "You write to us — briefly, honestly. No forms. No questionnaires. A few lines about who you are and what you seek."
}, {
  roman: "II",
  title: "The Conversation",
  body: "We meet — in person where possible, by call when not. We listen carefully to what you say, and to what you leave unsaid."
}, {
  roman: "III",
  title: "The Introduction",
  body: "A single, considered introduction. Not a shortlist. One family we believe understands yours."
}, {
  roman: "IV",
  title: "The Meeting",
  body: "Both families meet at their own pace. We remain available — as a quiet presence, never as an intermediary who crowds the room."
}, {
  roman: "V",
  title: "The Alliance",
  body: "If both families wish to proceed, we walk alongside through the rituals that follow — for as long as you need us."
}];
function Process() {
  const ref = reactExports.useRef(null);
  const lineRef = reactExports.useRef(null);
  useGSAP(() => {
    gsapWithCSS.from(lineRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.8,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 65%",
        toggleActions: "play none none none"
      }
    });
    gsapWithCSS.from(".process-step", {
      opacity: 0,
      x: (i) => i % 2 === 0 ? -50 : 50,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.18,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 65%",
        toggleActions: "play none none none"
      }
    });
  }, {
    scope: ref
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref, id: "process", className: "section-pad", style: {
    background: "var(--background)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16 md:mb-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mb-6", children: "— The Process" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-normal", style: {
        fontSize: "clamp(2.2rem, 4vw, 3.8rem)"
      }, children: [
        "Five unhurried",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: {
          color: "var(--gold-soft)"
        }, children: "steps." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: {
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block absolute", style: {
        left: "50%",
        top: 0,
        bottom: 0,
        transform: "translateX(-50%)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: lineRef, style: {
        width: "1px",
        height: "100%",
        background: "linear-gradient(180deg, transparent 0%, var(--gold) 8%, var(--gold) 92%, transparent 100%)"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-12 md:space-y-0", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `process-step relative md:grid md:grid-cols-2 md:gap-16 items-center ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`, style: {
        paddingTop: "2.5rem",
        paddingBottom: "2.5rem"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          direction: "ltr"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block absolute", style: {
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "11px",
            height: "11px",
            borderRadius: "50%",
            background: "var(--gold)",
            boxShadow: "0 0 12px rgba(201,160,74,0.6)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "step-numeral mb-3", children: s.roman }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-normal mb-4", style: {
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            color: "var(--cream)"
          }, children: s.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-sans leading-relaxed", style: {
            color: "rgba(245,237,224,0.58)",
            fontSize: "0.95rem",
            maxWidth: "360px"
          }, children: s.body })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block" })
      ] }, s.roman)) })
    ] })
  ] }) });
}
const TESTIMONIALS = [{
  quote: "We had given up on the apps and the aunties both. DesiHerz felt like neither — it felt like a friend who happened to know the right people.",
  name: "A. & R.",
  detail: "Married 2025 · Mumbai / London"
}, {
  quote: "What surprised us was the slowness. Nothing was rushed. They understood that the right introduction needed to wait for the right moment.",
  name: "The Khanna Family",
  detail: "Delhi · 2024"
}, {
  quote: "Three seasons passed before they made our introduction. When it came, it was the only introduction we needed.",
  name: "S. & P.",
  detail: "Karachi · Lahore · 2025"
}];
function Testimonials() {
  const ref = reactExports.useRef(null);
  useGSAP(() => {
    gsapWithCSS.from(".quote-card", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.16,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  }, {
    scope: ref
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref, id: "testimonials", className: "section-pad", style: {
    background: "linear-gradient(160deg, var(--background) 0%, #110408 100%)",
    borderTop: "1px solid rgba(201,160,74,0.1)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16 md:mb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mb-6", children: "— Testimonials" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-normal", style: {
        fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
        maxWidth: "640px"
      }, children: [
        "Spoken softly,",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: {
          color: "var(--gold-soft)"
        }, children: "with permission." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-px", style: {
      background: "rgba(201,160,74,0.08)"
    }, children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quote-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "font-display font-normal", style: {
        fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)",
        lineHeight: 1.55,
        color: "var(--cream)",
        marginTop: "1.75rem"
      }, children: [
        '"',
        t.quote,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6", style: {
        borderTop: "1px solid rgba(201,160,74,0.15)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display", style: {
          color: "var(--gold-soft)",
          fontSize: "1.1rem"
        }, children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-sans", style: {
          fontSize: "0.58rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(245,237,224,0.42)"
        }, children: t.detail })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 grid grid-cols-2 gap-px", style: {
      background: "rgba(201,160,74,0.08)"
    }, children: [coupleStory2, coupleHero].map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", style: {
      aspectRatio: "16/7"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "Couple united by DesiHerz", className: "w-full h-full object-cover", style: {
        filter: "brightness(0.55) sepia(0.15)",
        transition: "transform 0.8s ease"
      }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.04)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "linear-gradient(to top, rgba(9,5,10,0.5) 0%, transparent 60%)"
      } })
    ] }, i)) })
  ] }) });
}
function Contact() {
  const ref = reactExports.useRef(null);
  useGSAP(() => {
    gsapWithCSS.from(".contact-inner > *", {
      y: 35,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 72%",
        toggleActions: "play none none none"
      }
    });
  }, {
    scope: ref
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref, id: "contact", className: "section-pad", style: {
    background: "var(--background)",
    borderTop: "1px solid rgba(201,160,74,0.1)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto text-center contact-inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mb-8", children: "— Apply" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-normal", style: {
      fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
      lineHeight: 1
    }, children: [
      "Send a single line.",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: {
        color: "var(--gold-soft)"
      }, children: "We'll write back." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 font-sans leading-relaxed mx-auto", style: {
      color: "rgba(245,237,224,0.58)",
      fontSize: "1rem",
      maxWidth: "460px"
    }, children: "We accept a limited circle each season. Tell us who you are — we read every note personally and respond within a fortnight." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-14 text-left", style: {
      maxWidth: "560px",
      margin: "3.5rem auto 0"
    }, onSubmit: (e) => e.preventDefault(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", children: [{
        label: "Full Name",
        type: "text",
        name: "name",
        placeholder: "Your name"
      }, {
        label: "Family Email",
        type: "email",
        name: "email",
        placeholder: "email@family.com"
      }, {
        label: "City",
        type: "text",
        name: "city",
        placeholder: "Where you are"
      }, {
        label: "Year of Birth",
        type: "text",
        name: "yob",
        placeholder: "YYYY"
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-sans mb-2", style: {
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(245,237,224,0.45)"
        }, children: f.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: f.type, name: f.name, placeholder: f.placeholder, className: "form-input" })
      ] }, f.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-sans mb-2", style: {
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(245,237,224,0.45)"
        }, children: "A few lines about you" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, placeholder: "Tell us a little about yourself and what you seek...", className: "form-input resize-none", style: {
          lineHeight: 1.7
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full font-sans", style: {
        padding: "1.1rem",
        fontSize: "0.62rem",
        letterSpacing: "0.38em",
        textTransform: "uppercase",
        color: "var(--gold)",
        border: "1px solid rgba(201,160,74,0.5)",
        background: "rgba(61,12,24,0.55)",
        cursor: "pointer",
        transition: "background 0.3s, border-color 0.3s, color 0.3s"
      }, onMouseEnter: (e) => {
        const el = e.currentTarget;
        el.style.background = "var(--maroon)";
        el.style.borderColor = "var(--gold)";
        el.style.color = "var(--gold-soft)";
      }, onMouseLeave: (e) => {
        const el = e.currentTarget;
        el.style.background = "rgba(61,12,24,0.55)";
        el.style.borderColor = "rgba(201,160,74,0.5)";
        el.style.color = "var(--gold)";
      }, children: "Submit Quietly" })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative", style: {
    borderTop: "1px solid rgba(201,160,74,0.1)",
    background: "#09050a",
    padding: "3rem 1.5rem"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6", style: {
    paddingLeft: "clamp(0px, 2rem, 2rem)",
    paddingRight: "clamp(0px, 2rem, 2rem)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display", style: {
        fontSize: "1.4rem",
        color: "var(--cream)",
        letterSpacing: "-0.01em"
      }, children: [
        "Desi",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "var(--gold)"
        }, children: "♥" }),
        "Herz"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-sans", style: {
        fontSize: "0.58rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(245,237,224,0.38)"
      }, children: "© MMXXV · A Private House" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-8", children: [{
      label: "Discretion",
      href: "#"
    }, {
      label: "Terms",
      href: "#"
    }, {
      label: "office@desiherz.com",
      href: "mailto:office@desiherz.com"
    }].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: "font-sans", style: {
      fontSize: "0.58rem",
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: "rgba(245,237,224,0.38)",
      transition: "color 0.3s"
    }, onMouseEnter: (e) => e.currentTarget.style.color = "var(--gold)", onMouseLeave: (e) => e.currentTarget.style.color = "rgba(245,237,224,0.38)", children: l.label }, l.label)) })
  ] }) });
}
export {
  Index as component
};
