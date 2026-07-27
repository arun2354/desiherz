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

// Shared between the "/" (English) and "/de" (German) routes — every
// section reads its own copy via useLocale() (see src/lib/use-locale.ts),
// so the exact same tree renders correctly for either route.
export function HomePage() {
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
