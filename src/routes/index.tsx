import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/landing/navigation";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { HeroSection } from "@/components/landing/hero-section";
import { StatementSection } from "@/components/landing/statement-section";
import { ScrollytellingSection } from "@/components/landing/scrollytelling-section";
import { PledgesSection } from "@/components/landing/pledges-section";
import { VoicesSection } from "@/components/landing/voices-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

const SITE = {
  name: "DesiHerz",
  url: "https://desiherz.de/",
  title: "DesiHerz — Private Matrimony & Matchmaking in Germany",
  description:
    "DesiHerz is a private matrimony house for discerning South Asian families in Germany — hand-vetted introductions in Frankfurt, Munich and Berlin. No public profiles, no browsing, no apps. Just one carefully considered introduction at a time.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { name: "keywords", content: "private matrimony Germany, matrimony service Germany, private matchmaking Germany, discreet matchmaking, Heiratsvermittlung Deutschland, Partnervermittlung diskret, South Asian matrimony Germany, matrimony Frankfurt, matrimony Munich, matrimony Berlin" },
      { property: "og:title", content: SITE.title },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE.url },
      { property: "og:image", content: "https://desiherz.de/images/hero-poster.jpg" },
      { name: "twitter:title", content: SITE.title },
      { name: "twitter:description", content: SITE.description },
      { name: "twitter:image", content: "https://desiherz.de/images/hero-poster.jpg" },
    ],
    links: [{ rel: "canonical", href: SITE.url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: SITE.name,
          description: SITE.description,
          url: SITE.url,
          email: "hello@desiherz.de",
          telephone: "+498000060452",
          priceRange: "€39",
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
