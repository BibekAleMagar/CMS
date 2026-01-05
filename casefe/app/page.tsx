import Hero from "@/src/components/Index/HeroSection";
import FeaturesSection from "@/src/components/userlayout/FeatureSection";
import Footer from "@/src/components/userlayout/Footer";
import Header from "@/src/components/userlayout/Header";
import { HowItWorksSection } from "@/src/components/userlayout/HowItWorks";
import StatsSection from "@/src/components/userlayout/stats";

export default function Home() {
  return (
   <>
    <div className="bg-white">
      <Hero />
    <Header />
    <FeaturesSection />
    <StatsSection />
    <HowItWorksSection />
    <Footer />
    </div>
   </>
  );
}
