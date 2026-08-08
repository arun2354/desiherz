import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { StatementSection } from "@/components/landing/statement-section";
import { VideoProcessSection } from "@/components/landing/video-process-section";
import { VideoRailSection } from "@/components/landing/video-rail-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

// Shared between the "/" (English) and "/de" (German) routes — every
// section reads its own copy via useLocale() (see src/lib/use-locale.ts),
// so the exact same tree renders correctly for either route.
export function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navigation />
      <HeroSection />
      <StatementSection />
      <VideoProcessSection />
      <VideoRailSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
