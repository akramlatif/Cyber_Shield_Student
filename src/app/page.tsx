import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import ProblemSolution from '@/components/sections/ProblemSolution';
import HowItWorks from '@/components/sections/HowItWorks';
import Showcase from '@/components/sections/Showcase';
import Stats from '@/components/sections/Stats';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import UseCases from '@/components/sections/UseCases';
import Team from '@/components/sections/Team';
import CTA from '@/components/sections/CTA';
import FAQ from '@/components/sections/FAQ';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <ProblemSolution />
      <HowItWorks />
      <Showcase />
      <Stats />
      <Testimonials />
      <Pricing />
      <UseCases />
      <Team />
      <CTA />
      <FAQ />
    </main>
  );
}