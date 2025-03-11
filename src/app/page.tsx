import Navbar from "../components/Navbar";
import HeroSection from "./sections/HeroSection";
import PricingSection from "./sections/PricingSection";

export default function Home() {
  return (
    <>
      <header className="h-screen w-screen">
        <Navbar />
        <HeroSection />
      </header>
      <main>
          <PricingSection />
      </main>
    </>
  );
}