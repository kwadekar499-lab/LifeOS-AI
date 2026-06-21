import { Logo } from "@/components/landing/Logo";
import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { HeroSection } from "@/components/landing/HeroSection";
import { Footer } from "@/components/layout/Footer";

function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0A0F] text-white">
      <AnimatedBackground />

      <header className="relative z-10 px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center">
          <Logo />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <HeroSection />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
