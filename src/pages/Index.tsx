import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useGamification } from "@/hooks/useGamification";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useEffect } from "react";

const Index = () => {
  const { addXP } = useGamification();

  // Konami Code Easter Egg
  useKonamiCode(() => {
    addXP(10, "konami-code");
  });

  // Small scroll xp reward
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        addXP(2, "scroll-trust");
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [addXP]);

  return (
    <div className="min-h-screen bg-background shingle-pattern">
      <div className="min-h-screen bg-background/95">
        <Navbar />
        <HeroSection />
        <ServicesGrid />
        <TrustSection />
        <Footer />
        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default Index;
