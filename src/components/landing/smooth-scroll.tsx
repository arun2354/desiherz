import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global inertial scrolling. Wheel/touch input is eased by Lenis, which the
 * scrollytelling's own lerp then rides on top of. Anchor clicks are routed
 * through lenis.scrollTo so in-page navigation glides instead of jumping
 * (CSS scroll-behavior is disabled while Lenis is active via .lenis-on).
 *
 * Lenis and ScrollTrigger (used by the pinned scrollytelling section) must
 * share one clock — otherwise Lenis's virtual scroll position and
 * ScrollTrigger's pin/scrub math update on two independent rAF loops and
 * drift out of sync frame to frame. Per GSAP's documented Lenis
 * integration: drive Lenis from gsap.ticker instead of its own rAF, and
 * have ScrollTrigger recompute on every Lenis scroll tick.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchFirst =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches;
    if (reducedMotion || touchFirst) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    document.documentElement.classList.add("lenis-on");

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href === "#") {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis-on");
    };
  }, []);

  return null;
}
