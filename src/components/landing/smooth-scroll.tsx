import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global inertial scrolling. Wheel/touch input is eased by Lenis, which the
 * scrollytelling's own lerp then rides on top of. Anchor clicks are routed
 * through lenis.scrollTo so in-page navigation glides instead of jumping
 * (CSS scroll-behavior is disabled while Lenis is active via .lenis-on).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    document.documentElement.classList.add("lenis-on");

    let rafId = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

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
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.documentElement.classList.remove("lenis-on");
    };
  }, []);

  return null;
}
