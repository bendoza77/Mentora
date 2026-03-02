import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import HowItWorks from '../components/landing/HowItWorks';
import StudentsScrollBanner from '../components/landing/StudentsScrollBanner';
import WhyMentora from '../components/landing/WhyMentora';
import AIDemo from '../components/landing/AIDemo';
import Pricing from '../components/landing/Pricing';
import CTA from '../components/landing/CTA';
import Footer from '../components/layout/Footer';
import usePageTitle from '../hooks/usePageTitle';

export default function Landing() {
  usePageTitle();
  return (
    <main>
      <Hero />
      <Problem />
      <HowItWorks />
      <StudentsScrollBanner />
      <WhyMentora />
      <AIDemo />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
