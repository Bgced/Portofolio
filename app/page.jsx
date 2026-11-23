import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import About from "@/components/sections/About";
import Playground from "@/components/sections/Playground";
import CircuitLab from "@/components/circuit-lab/CircuitLab";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Playground />
      <CircuitLab />
      <Projects />
      <Stack />
      <Contact />
    </>
  );
}
