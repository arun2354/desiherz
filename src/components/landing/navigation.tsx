import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    navLinks: [
      { name: "Journey", href: "#journey" },
      { name: "Pledges", href: "#pledges" },
      { name: "Voices", href: "#voices" },
      { name: "FAQ", href: "#faq" },
    ],
    enquiry: "Private enquiry",
    toggleMenu: "Toggle menu",
  },
  de: {
    navLinks: [
      { name: "Reise", href: "#journey" },
      { name: "Versprechen", href: "#pledges" },
      { name: "Stimmen", href: "#voices" },
      { name: "FAQ", href: "#faq" },
    ],
    enquiry: "Private Anfrage",
    toggleMenu: "Menü öffnen",
  },
} as const;

// same two-letter labels regardless of which language is active — this is
// the control that switches the language, not a translated string
const LANGUAGES = [
  { code: "en", label: "EN", to: "/" },
  { code: "de", label: "DE", to: "/de" },
] as const;

// Plain <a> tags, not the router's client-side <Link>, are deliberate here:
// large parts of this page (the scrollytelling frame pipeline, the hero's
// video source swap, several IntersectionObservers) are imperative
// mount-once effects that assume they only ever run once per page load.
// A client-side route transition between "/" and "/de" isn't guaranteed to
// unmount and remount that tree, which risks stale English content
// surviving a switch to German. A full navigation sidesteps that
// entirely and also means the server sends fully-formed, correct
// per-locale meta/hreflang/schema on the very first response.
function LanguageSwitcher({ locale, compact }: { locale: "en" | "de"; compact: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 font-mono text-xs tracking-wide ${compact ? "text-foreground/70" : "text-white/70"}`}
    >
      {LANGUAGES.map((lang, i) => (
        <span key={lang.code} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true">/</span>}
          <a
            href={lang.to}
            className={`transition-colors ${
              locale === lang.code
                ? compact
                  ? "text-foreground"
                  : "text-white"
                : "hover:text-gold-light"
            }`}
            aria-current={locale === lang.code ? "true" : undefined}
          >
            {lang.label}
          </a>
        </span>
      ))}
    </div>
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const t = copy[locale];

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mobile-nav-surface mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          <Wordmark compact={isScrolled} />

          <div className="hidden md:flex items-center gap-12">
            {t.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 relative group ${
                  isScrolled
                    ? "text-foreground hover:text-gold"
                    : "text-white hover:text-gold-light"
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-gold to-rose transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher locale={locale} compact={isScrolled} />
            <a
              href="#contact"
              className={`rounded-full inline-flex items-center justify-center font-medium ring-1 ring-transparent transition-all duration-500 hover:ring-gold/60 ${
                isScrolled
                  ? "bg-foreground hover:bg-foreground/90 text-background px-4 h-8 text-xs"
                  : "bg-white hover:bg-white/90 text-black px-6 h-10 text-sm"
              }`}
            >
              {t.enquiry}
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-500 ${
              isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"
            }`}
            aria-label={t.toggleMenu}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — full screen overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {t.navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div
            className={`flex items-center justify-between gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <LanguageSwitcher locale={locale} compact />
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base inline-flex items-center justify-center font-medium"
            >
              {t.enquiry}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Wordmark({ compact }: { compact: boolean }) {
  return (
    <a href="#" className="flex items-center gap-2.5 group">
      <BrandMark size={compact ? 24 : 30} />
      <span
        className={`font-display tracking-tight transition-all duration-500 ${
          compact ? "text-xl text-foreground" : "text-2xl text-white"
        }`}
      >
        Desi<span className={compact ? "text-rose" : "text-[#b76e79]"}>♥</span>Herz
      </span>
    </a>
  );
}
