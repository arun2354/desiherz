import { Link } from "@tanstack/react-router";

const exploreLinks = [
  { name: "Journey", href: "#journey" },
  { name: "Pledges", href: "#pledges" },
  { name: "Voices", href: "#voices" },
  { name: "FAQ", href: "#faq" },
];

export function FooterSection() {
  return (
    <footer className="relative bg-[#2a1a10]">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
        <img
          src="/images/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2a1a10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1a10]/40 via-transparent to-[#2a1a10]/40" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-white">
                  Desi<span className="text-rose">♥</span>Herz
                </span>
              </a>

              <p className="text-white/50 leading-relaxed mb-8 max-w-xs text-sm">
                Private matrimony for discerning people and families. By introduction only.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-sm font-medium text-white mb-6">Explore</h3>
              <ul className="space-y-4">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-medium text-white mb-6">Contact</h3>
              <ul className="space-y-4 text-sm text-white/40">
                <li>Frankfurt am Main</li>
                <li>By appointment only</li>
                <li>
                  <a href="mailto:hello@desiherz.com" className="hover:text-white transition-colors">
                    hello@desiherz.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-medium text-white mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/impressum" className="text-sm text-white/40 hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-sm text-white/40 hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">&copy; 2026 DesiHerz. All rights reserved.</p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              Private matrimony, by invitation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
