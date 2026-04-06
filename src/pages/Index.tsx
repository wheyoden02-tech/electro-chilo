import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
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
