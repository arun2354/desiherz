import { faqs } from "@/components/landing/faq-section";
import type { Locale } from "@/lib/use-locale";

// Both language variants describe the same real-world business, so they
// share one @id — that's what tells search engines "same entity,
// different language" instead of two unrelated businesses.
const SITE = {
  name: "DesiHerz",
  image: "https://desiherz.de/images/hero-poster.jpg",
  imageWidth: "1920",
  imageHeight: "1012",
} as const;

const perLocale = {
  en: {
    url: "https://desiherz.de/",
    title: "DesiHerz — Private Matrimony & Matchmaking in Germany",
    description:
      "Private matrimony for South Asian families in Germany — hand-vetted introductions in Frankfurt, Munich & Berlin. No public profiles, no browsing.",
    imageAlt: "A quiet evening by an iron pedestrian bridge on the River Main in Frankfurt — the DesiHerz hero scene.",
    ogLocale: "en_DE",
    inLanguage: "en-DE",
    offerName: "First private consultation & screening",
  },
  de: {
    url: "https://desiherz.de/de",
    title: "DesiHerz — Private Eheanbahnung & Partnervermittlung in Deutschland",
    description:
      "Private Eheanbahnung für südasiatische Familien in Deutschland — von Hand geprüfte Vorstellungen in Frankfurt, München & Berlin. Keine öffentlichen Profile.",
    imageAlt: "Ein ruhiger Abend an einer Fußgängerbrücke am Main in Frankfurt — die Startseiten-Szene von DesiHerz.",
    ogLocale: "de_DE",
    inLanguage: "de-DE",
    offerName: "Erstes privates Beratungsgespräch & Prüfung",
  },
} as const;

export function buildHomeHead(locale: Locale) {
  const t = perLocale[locale];

  return {
    meta: [
      { title: t.title },
      { name: "description", content: t.description },
      { property: "og:title", content: t.title },
      { property: "og:description", content: t.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: t.url },
      { property: "og:locale", content: t.ogLocale },
      { property: "og:image", content: SITE.image },
      { property: "og:image:width", content: SITE.imageWidth },
      { property: "og:image:height", content: SITE.imageHeight },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: t.imageAlt },
      { name: "twitter:title", content: t.title },
      { name: "twitter:description", content: t.description },
      { name: "twitter:image", content: SITE.image },
      { name: "twitter:image:alt", content: t.imageAlt },
    ],
    links: [
      { rel: "canonical", href: t.url },
      // each language variant must list itself too, not just the
      // counterpart — that's the part of the hreflang spec that's easy to
      // get wrong and makes the whole cluster invalid if skipped
      { rel: "alternate", hrefLang: "en", href: perLocale.en.url },
      { rel: "alternate", hrefLang: "de", href: perLocale.de.url },
      { rel: "alternate", hrefLang: "x-default", href: perLocale.en.url },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${perLocale.en.url}#business`,
          name: SITE.name,
          description: t.description,
          url: t.url,
          image: SITE.image,
          email: "hello@desiherz.de",
          telephone: "+498000060452",
          inLanguage: t.inLanguage,
          // a specific flat fee isn't what schema.org's priceRange field
          // is for (it's meant to be a relative indicator like "€€", not
          // a literal price) — makesOffer is the correct place for the
          // actual €39 consultation fee
          makesOffer: {
            "@type": "Offer",
            name: t.offerName,
            price: "39",
            priceCurrency: "EUR",
          },
          areaServed: ["Germany", "Frankfurt", "Munich", "Berlin"],
        }),
      },
      {
        type: "application/ld+json",
        // mirrors faq-section.tsx's own `faqs` data so this can never
        // drift out of sync with what's actually on the page. Also
        // covers a real crawlability gap: the accordion only mounts the
        // *open* answer's <p> into the DOM (AnimatePresence unmounts the
        // rest), so without this, 5 of 6 answers are invisible to
        // anything that doesn't click through the UI — Google explicitly
        // supports marking up accordion-hidden content this way.
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs[locale].map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }),
      },
    ],
  };
}
