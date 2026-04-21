import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { AgentBento } from "@/components/landing/agent-bento";
import { ProcessTimeline } from "@/components/landing/process-timeline";
import { TemplatesShowcase } from "@/components/landing/templates-showcase";
import { StatsEditorial } from "@/components/landing/stats-editorial";
import { TestimonialsMasonry } from "@/components/landing/testimonials-masonry";
import { PricingEditorial } from "@/components/landing/pricing-editorial";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { CtaFinal } from "@/components/landing/cta-final";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <TrustMarquee />
        <AgentBento />
        <ProcessTimeline />
        <TemplatesShowcase />
        <StatsEditorial />
        <TestimonialsMasonry />
        <PricingEditorial />
        <FaqAccordion />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
