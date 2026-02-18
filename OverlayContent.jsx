import { motion, useTransform } from 'framer-motion';
import HeroSection from './components/sections/HeroSection';
import ProblemsSection from './components/sections/ProblemsSection';
import FeaturesSection from './components/sections/FeaturesSection';
import HowItWorksSection from './components/sections/HowItWorksSection';
import StatsSection from './components/sections/StatsSection';
import CTASection from './components/sections/CTASection';

const OverlayContent = ({ scrollProgress }) => {
  // --- Section Visibility Logic (0 to 1) ---

  // Hero: Fades out early to clear the view for the globe
  const opHero = useTransform(scrollProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const yHero = useTransform(scrollProgress, [0, 0.15], [0, -50]);

  // Problems: Subtle entrance and exit
  const opProblems = useTransform(scrollProgress, [0.18, 0.25, 0.32, 0.38], [0, 1, 1, 0]);
  const yProblems = useTransform(scrollProgress, [0.18, 0.25], [20, 0]);

  // Features: Slides in slightly from the side for dynamic feel
  const opFeatures = useTransform(scrollProgress, [0.4, 0.48, 0.55, 0.62], [0, 1, 1, 0]);
  const xFeatures = useTransform(scrollProgress, [0.4, 0.48], [30, 0]);

  // How It Works: Centered and clean
  const opHowItWorks = useTransform(scrollProgress, [0.65, 0.72, 0.78, 0.82], [0, 1, 1, 0]);

  // Stats: Pops in with scale
  const opStats = useTransform(scrollProgress, [0.82, 0.88, 0.92, 0.95], [0, 1, 1, 0]);
  const scaleStats = useTransform(scrollProgress, [0.82, 0.88], [0.95, 1]);

  // CTA: The final destination
  const opCta = useTransform(scrollProgress, [0.94, 0.98], [0, 1]);
  const yCta = useTransform(scrollProgress, [0.94, 0.98], [20, 0]);

  return (
    <div className="relative w-full z-[60] pointer-events-none">
      {/* Each section is wrapped in a full-height container 
          to pace the scrolling correctly.
      */}
      
      <section className="h-screen flex items-center justify-center">
        <HeroSection opacity={opHero} y={yHero} />
      </section>

      <section className="h-screen flex items-center justify-center px-6">
        <ProblemsSection opacity={opProblems} y={yProblems} />
      </section>

      <section className="h-screen flex items-center justify-end px-12 md:px-24">
        <FeaturesSection opacity={opFeatures} x={xFeatures} />
      </section>

      <section className="h-screen flex items-center justify-center px-6">
        <HowItWorksSection opacity={opHowItWorks} />
      </section>

      <section className="h-screen flex items-center justify-center px-6">
        <StatsSection opacity={opStats} scale={scaleStats} />
      </section>

      <section className="h-screen flex items-center justify-center px-6">
        <CTASection opacity={opCta} y={yCta} />
      </section>
    </div>
  );
};

export default OverlayContent;