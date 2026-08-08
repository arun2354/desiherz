import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/landing/brand-mark";
import { useLocale } from "@/lib/use-locale";

const copy = {
  en: {
    tagline: "Private, by design.",
    brandLine: "Private matrimony for discerning people and families. By introduction only.",
    explore: "Explore",
    contact: "Contact",
    legal: "Legal",
    byAppointment: "By appointment only",
    copied: "Copied to clipboard",
    rights: "© 2026 DesiHerz. All rights reserved.",
    bottomTagline: "Private matrimony, by design",
    navLinks: [
      { name: "Voices", href: "#voices" },
      { name: "Stories", href: "#testimonials" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  de: {
    tagline: "Privat, von Grund auf.",
    brandLine: "Private Eheanbahnung für anspruchsvolle Menschen und Familien. Nur auf Vorstellung.",
    explore: "Entdecken",
    contact: "Kontakt",
    legal: "Rechtliches",
    byAppointment: "Nur nach Vereinbarung",
    copied: "In die Zwischenablage kopiert",
    rights: "© 2026 DesiHerz. Alle Rechte vorbehalten.",
    bottomTagline: "Private Eheanbahnung, ganz bewusst",
    navLinks: [
      { name: "Stimmen", href: "#voices" },
      { name: "Erfahrungen", href: "#testimonials" },
      { name: "FAQ", href: "#faq" },
    ],
  },
} as const;

// mailto:/tel: links open an OS app-chooser dialog when no default
// mail/phone app is configured, and picking a plain browser from that
// list does nothing — there's no way to detect or fix that from here.
// Copying the value instead always works, so that's the primary click
// action; the real mailto:/tel: href stays for right-click/middle-click.
function CopyableContact({ value, href, display, copiedLabel }: { value: string; href: string; display: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="transition-colors hover:text-ink-foreground"
    >
      {copied ? copiedLabel : display}
    </a>
  );
}

export function FooterSection() {
  const locale = useLocale();
  const t = copy[locale];

  return (
    <footer className="bg-grain bg-ink-gradient relative overflow-hidden text-ink-foreground">
      {/* top hairline, gold at the centre fading to nothing at the edges */}
      <div className="h-px w-full bg-gold/35" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Brand moment, replacing the old photo banner */}
        <div className="flex flex-col items-center gap-6 py-20 text-center lg:py-28">
          <BrandMark size={40} />
          <a href="#" className="font-display text-3xl lg:text-4xl">
            Desi<span className="text-gold-light">♥</span>Herz
          </a>
          <p className="font-accent text-xl text-gold-light/80">{t.tagline}</p>
        </div>

        {/* Main footer */}
        <div className="border-t border-ink-border pt-16 pb-16 lg:pb-20">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-5 lg:gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-ink-muted-foreground">{t.brandLine}</p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-gold-light/70 uppercase">{t.explore}</h3>
              <ul className="space-y-4">
                {t.navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-ink-muted-foreground transition-colors hover:text-ink-foreground">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-gold-light/70 uppercase">{t.contact}</h3>
              <ul className="space-y-4 text-sm text-ink-muted-foreground">
                <li>{t.byAppointment}</li>
                <li>
                  <CopyableContact
                    href="mailto:hello@desiherz.de"
                    value="hello@desiherz.de"
                    display="hello@desiherz.de"
                    copiedLabel={t.copied}
                  />
                </li>
                <li>
                  <CopyableContact href="tel:+498000060452" value="+49 800 0060452" display="0800 0060452" copiedLabel={t.copied} />
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-gold-light/70 uppercase">{t.legal}</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/impressum" className="text-sm text-ink-muted-foreground transition-colors hover:text-ink-foreground">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-sm text-ink-muted-foreground transition-colors hover:text-ink-foreground">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink-border py-8 md:flex-row">
          <p className="text-sm text-ink-muted-foreground/70">{t.rights}</p>

          <div className="flex items-center gap-4 text-sm text-ink-muted-foreground/70">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              {t.bottomTagline}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
