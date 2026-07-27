import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/landing/navigation";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { HeroSection } from "@/components/landing/hero-section";
import { StatementSection } from "@/components/landing/statement-section";
import { ScrollytellingSection } from "@/components/landing/scrollytelling-section";
import { PledgesSection } from "@/components/landing/pledges-section";
import { VoicesSection } from "@/components/landing/voices-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection, faqs } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

const SITE = {
  name: "DesiHerz",
  url: "https://desiherz.de/",
  title: "DesiHerz — Private Matrimony & Matchmaking in Germany",
  // kept under ~155 chars so Google doesn't truncate it in the SERP snippet
  // (the previous version ran to 241 chars and was cut off mid-sentence)
  description:
    "Private matrimony for South Asian families in Germany — hand-vetted introductions in Frankfurt, Munich & Berlin. No public profiles, no browsing.",
  image: "https://desiherz.de/images/hero-poster.jpg",
  imageWidth: "1920",
  imageHeight: "1012",
  imageAlt: "A quiet evening by an iron pedestrian bridge on the River Main in Frankfurt — the DesiHerz hero scene.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { property: "og:title", content: SITE.title },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE.url },
      { property: "og:image", content: SITE.image },
      { property: "og:image:width", content: SITE.imageWidth },
      { property: "og:image:height", content: SITE.imageHeight },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: SITE.imageAlt },
      { name: "twitter:title", content: SITE.title },
      { name: "twitter:description", content: SITE.description },
      { name: "twitter:image", content: SITE.image },
      { name: "twitter:image:alt", content: SITE.imageAlt },
    ],
    links: [{ rel: "canonical", href: SITE.url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE.url}#business`,
          name: SITE.name,
          description: SITE.description,
          url: SITE.url,
          image: SITE.image,
          email: "hello@desiherz.de",
          telephone: "+498000060452",
          // a specific flat fee isn't what schema.org's priceRange field is
          // for (it's meant to be a relative indicator like "€€", not a
          // literal price) — makesOffer is the correct place for the
          // actual €39 consultation fee
          makesOffer: {
            "@type": "Offer",
            name: "First private consultation & screening",
            price: "39",
            priceCurrency: "EUR",
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ludwig Str. 17",
            postalCode: "65479",
            addressLocality: "Raunheim",
            addressCountry: "DE",
          },
          areaServed: ["Germany", "Frankfurt", "Munich", "Berlin"],
        }),
      },
      {
        type: "application/ld+json",
        // mirrors the FAQ accordion's own data (src/components/landing/faq-section.tsx)
        // so this can never drift out of sync with what's actually on the
        // page. Also covers a real crawlability gap: the accordion only
        // mounts the *open* answer's <p> into the DOM (AnimatePresence
        // unmounts the rest), so without this, 5 of the 6 answers are
        // invisible to anything that doesn't click through the UI —
        // Google explicitly supports marking up accordion-hidden content
        // this way.
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
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
  }),
  component: Index,
});

function Index() {
  return (
    // overflow-x-clip, NOT -hidden: hidden turns <main> into a scroll
    // container, which silently breaks position:sticky (the scrollytelling
    // canvas) against the window. clip clips without doing that.
    <main className="relative min-h-screen overflow-x-clip">
      <SmoothScroll />
      <Navigation />
      <HeroSection />
      <StatementSection />
      <ScrollytellingSection />
      <PledgesSection />
      <VoicesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
