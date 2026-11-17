import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Playground from "@/components/sections/Playground";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";

export default function Page() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Projects />
      <Playground />
      <Stack />
      <Contact />
    </>
  );
}
