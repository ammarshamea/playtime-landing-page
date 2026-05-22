import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import UseCasesSection from "@/components/sections/UseCasesSection";
import ProblemSection from "@/components/sections/ProblemSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AppPreviewSection from "@/components/sections/AppPreviewSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ReportsSection from "@/components/sections/ReportsSection";
import SecuritySection from "@/components/sections/SecuritySection";
import PlatformsSection from "@/components/sections/PlatformsSection";
import ROICalculatorSection from "@/components/sections/ROICalculatorSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import PricingSection from "@/components/sections/PricingSection";
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
      <ReportsSection />
      <SecuritySection />
      <PlatformsSection />
      <ROICalculatorSection />
      <ComparisonSection />
      <PricingSection />
      <FAQSection />
      <SupportSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
