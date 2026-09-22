import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Pillars from "@/components/Pillars";
import Features from "@/components/Features";
import Spaces from "@/components/Spaces";
import Pricing from "@/components/Pricing";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Pillars />
        <Features />
        <Spaces />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
