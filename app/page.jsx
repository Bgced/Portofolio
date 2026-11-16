import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Journey from "@/components/sections/Journey";
import Insight from "@/components/sections/Insight";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/Marquee";
import { ArcadeSection } from "@/components/PortfolioArcade";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Marquee />
      <Insight />
      <ArcadeSection />
      <Contact />
    </>
  );
}
