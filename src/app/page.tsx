import Navbar from "../components/Navbar";
import DiscoverSection from "./sections/DiscoverSection";
import FeatureSection from "./sections/FeatureSection";
import Footer from "./sections/Footer";
import HeroSection from "./sections/HeroSection";
import HowToSection from "./sections/HowToSection";
import PricingSection from "./sections/PricingSection";
import TestimonialSection from "./sections/TestimonialSection";

export default function Home() {
  return (
    <>
      <header className="h-screen w-screen">
         <Navbar />
        <HeroSection /> 
      </header>
      <main>
        <PricingSection />
        <HowToSection />
        <TestimonialSection />
        <FeatureSection />
        <DiscoverSection />
      </main> 
      <footer>
        <Footer />
      </footer>
    </>
  );
}