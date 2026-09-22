import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Mission from "@/components/Mission";
import Pillars from "@/components/Pillars";
import Formations from "@/components/Formations";
import Metiers from "@/components/Metiers";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Mission />
        <Pillars />
        <Formations />
        <Metiers />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
