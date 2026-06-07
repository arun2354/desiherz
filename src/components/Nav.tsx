import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#pledges", label: "Pledges" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Stories" },
  { href: "#contact", label: "Apply" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
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
        borderBottom: scrolled ? "1px solid rgba(201,160,74,0.1)" : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <a
        href="#top"
        style={{
          fontFamily: "var(--font-display), 'Playfair Display', serif",
          fontSize: "1.5rem",
          color: "var(--cream, #f5ede0)",
          letterSpacing: "-0.01em",
          textDecoration: "none",
        }}
      >
        Desi
        <span style={{ color: "var(--gold, #c9a04a)" }}>♥</span>
        Herz
      </a>

      {/* Nav links */}
      <ul
        style={{
          display: "none",
          gap: "2.75rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
        className="md:flex"
      >
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.62rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(245,237,224,0.52)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--gold, #c9a04a)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(245,237,224,0.52)")
              }
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        style={{
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          fontSize: "0.6rem",
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "var(--gold, #c9a04a)",
          border: "1px solid rgba(201,160,74,0.45)",
          background: "rgba(61,12,24,0.45)",
          padding: "0.65rem 1.4rem",
          textDecoration: "none",
          transition: "background 0.3s, border-color 0.3s, color 0.3s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "var(--maroon, #3d0c18)";
          el.style.borderColor = "var(--gold, #c9a04a)";
          el.style.color = "var(--gold-soft, #e8c278)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(61,12,24,0.45)";
          el.style.borderColor = "rgba(201,160,74,0.45)";
          el.style.color = "var(--gold, #c9a04a)";
        }}
      >
        Private Invite
      </a>
    </nav>
  );
}
