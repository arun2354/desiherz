import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/landing/brand-mark";

const exploreLinks = [
  { name: "Journey", href: "#journey" },
  { name: "Pledges", href: "#pledges" },
  { name: "Voices", href: "#voices" },
  { name: "FAQ", href: "#faq" },
];

export function FooterSection() {
  return (
    <footer className="bg-grain bg-ink-gradient relative overflow-hidden text-ink-foreground">
      {/* top hairline, gold at the centre fading to nothing at the edges */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Brand moment, replacing the old photo banner */}
        <div className="flex flex-col items-center gap-6 py-20 text-center lg:py-28">
          <BrandMark size={40} />
          <a href="#" className="font-display text-3xl lg:text-4xl">
            Desi<span className="text-rose">♥</span>Herz
          </a>
          <p className="font-accent text-xl text-gold-light/80">Private, by design.</p>
        </div>

        {/* Main footer */}
        <div className="border-t border-ink-border pt-16 pb-16 lg:pb-20">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-5 lg:gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-ink-muted-foreground">
                Private matrimony for discerning people and families. By introduction only.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-gold-light/70 uppercase">Explore</h3>
              <ul className="space-y-4">
                {exploreLinks.map((link) => (
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
              <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-gold-light/70 uppercase">Contact</h3>
              <ul className="space-y-4 text-sm text-ink-muted-foreground">
                <li>Frankfurt am Main</li>
                <li>By appointment only</li>
                <li>
                  <a href="mailto:hello@desiherz.com" className="transition-colors hover:text-ink-foreground">
                    hello@desiherz.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.2em] text-gold-light/70 uppercase">Legal</h3>
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
          <p className="text-sm text-ink-muted-foreground/70">&copy; 2026 DesiHerz. All rights reserved.</p>

          <div className="flex items-center gap-4 text-sm text-ink-muted-foreground/70">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              Private matrimony, by design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
