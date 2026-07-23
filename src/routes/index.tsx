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
  description:
    "DesiHerz is an invitation-only matrimony house for discerning people and families who value privacy, character and human curation in Germany and beyond.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesiHerz — Private Matrimony for the Discerning" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "DesiHerz — Private Matrimony" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#faf4e9" },
      {
        name: "keywords",
        content:
          "private matrimony, luxury matchmaking, curated introductions, invitation only matchmaking, Frankfurt matrimony, Germany",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          description: SITE.description,
          url: "/",
          areaServed: "Germany",
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
