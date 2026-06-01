import { useEffect, useState } from "react";

const links = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#process", label: "Process" },
  { href: "#stories", label: "Stories" },
  { href: "#join", label: "Apply" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-14 py-5 transition-colors duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-gold/10" : ""
      }`}
    >
      <a href="#top" className="font-display text-xl tracking-wide text-cream">
        Desi<span className="italic text-gold">Herz</span>
      </a>
      <ul className="hidden md:flex gap-10">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-[0.6rem] tracking-[0.28em] uppercase text-muted-foreground hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#join"
        className="text-[0.6rem] tracking-[0.28em] uppercase border border-gold/50 text-gold px-5 py-2.5 hover:bg-gold hover:text-background transition-colors"
      >
        Private Invite
      </a>
    </nav>
  );
}
