import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppContactWidget from "@/components/contact/WhatsAppContactWidget";
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import UseCasesSection from "@/components/sections/UseCasesSection";
import ProblemSection from "@/components/sections/ProblemSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AppPreviewSection from "@/components/sections/AppPreviewSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import SecuritySection from "@/components/sections/SecuritySection";
import PlatformsSection from "@/components/sections/PlatformsSection";
import ROICalculatorSection from "@/components/sections/ROICalculatorSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import PricingSection from "@/components/sections/PricingSection";
import PaymentMethodsSection from "@/components/sections/PaymentMethodsSection";
import FAQSection from "@/components/sections/FAQSection";
import SupportSection from "@/components/sections/SupportSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <StatsBar />
      <UseCasesSection />
      <ProblemSection />
      <BeforeAfterSection />
      <FeaturesSection />
      <AppPreviewSection />
      <HowItWorksSection />
      <SecuritySection />
      <PlatformsSection />
      <ROICalculatorSection />
      <ComparisonSection />
      <PricingSection />
      <PaymentMethodsSection />
      <FAQSection />
      <SupportSection />
      <CTASection />
      <Footer />
      <WhatsAppContactWidget />
    </main>
  );
}
