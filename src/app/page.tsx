import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
          <HeroSection />
      </main>
    </>
  );
}