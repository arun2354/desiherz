import { type ReactNode } from "react";
import { motion } from "framer-motion";

const pledgeIcons: Record<string, ReactNode> = {
  lock: (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
      <rect x="16" y="28" width="32" height="26" rx="3" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <path d="M22 28v-7a10 10 0 0120 0v7" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <circle cx="32" cy="40" r="3.5" stroke="url(#pledge-grad)" strokeWidth="1.4" />
    </svg>
  ),
  rings: (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
      <circle cx="25" cy="34" r="14" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <circle cx="39" cy="34" r="14" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <path d="M32 12l3 5h-6l3-5z" stroke="url(#pledge-grad)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  hands: (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
      <path d="M14 32l12 12M50 32L38 44M26 44l6 6 6-6" stroke="url(#pledge-grad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="28" r="4.5" stroke="url(#pledge-grad)" strokeWidth="1.6" />
      <circle cx="50" cy="28" r="4.5" stroke="url(#pledge-grad)" strokeWidth="1.6" />
    </svg>
  ),
};

const pledges = [
  {
    n: "01",
    icon: "lock",
    title: "Privacy",
    line: "No public profile, ever.",
    offset: "md:mt-0",
  },
  {
    n: "02",
    icon: "rings",
    title: "Curation",
    line: "Every introduction made by a person, not an algorithm.",
    offset: "md:mt-16",
  },
  {
    n: "03",
    icon: "hands",
    title: "Commitment",
    line: "With you from first hello to the family conversation.",
    offset: "md:mt-32",
  },
];

export function PledgesSection() {
  return (
    <section id="pledges" className="relative py-28 lg:py-40 overflow-hidden">
      {/* shared gradient for the pledge icons */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="pledge-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#eca8d6" />
            <stop offset="0.55" stopColor="#d9a760" />
            <stop offset="1" stopColor="#eca8d6" />
          </linearGradient>
        </defs>
      </svg>

      {/* oversized background numeral, purely decorative */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[-2%] font-display text-[26vw] leading-none text-foreground/[0.03] select-none"
      >
        03
      </span>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-20 lg:mb-28"
        >
          <span className="inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-12 h-px bg-gold/40" />
            Our pledges
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display tracking-tight leading-[0.95]">
            Quietly <span className="font-accent text-gold">curated.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
          {pledges.map((pledge, index) => (
            <motion.div
              key={pledge.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
              className={`group relative border-t border-foreground/15 pt-8 ${pledge.offset}`}
            >
              <span className="absolute -top-3 right-0 font-display text-sm text-gold/70 tracking-widest">
                {pledge.n}
              </span>

              <div className="mb-8 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                {pledgeIcons[pledge.icon]}
              </div>

              <h3 className="relative inline-block text-2xl lg:text-3xl font-display mb-3">
                {pledge.title}
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-gradient-to-r from-gold to-rose transition-all duration-500 ease-out group-hover:w-full" />
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{pledge.line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
