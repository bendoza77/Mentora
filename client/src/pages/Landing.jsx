import { Suspense, lazy } from 'react';
import Hero from '../components/landing/Hero';
import usePageTitle from '../hooks/usePageTitle';

// Below-fold sections are lazy loaded — Hero renders immediately,
// the rest arrive in a separate chunk after the main content is painted.
const Problem             = lazy(() => import('../components/landing/Problem'));
const HowItWorks          = lazy(() => import('../components/landing/HowItWorks'));
const StudentsScrollBanner = lazy(() => import('../components/landing/StudentsScrollBanner'));
const WhyMentora          = lazy(() => import('../components/landing/WhyMentora'));
const AIDemo              = lazy(() => import('../components/landing/AIDemo'));
const Pricing             = lazy(() => import('../components/landing/Pricing'));
const CTA                 = lazy(() => import('../components/landing/CTA'));
const Footer              = lazy(() => import('../components/layout/Footer'));

// Lightweight placeholder — keeps layout stable while sections load
function SectionSkeleton() {
  return <div className="w-full py-24 bg-dark-bg" aria-hidden="true" />;
}

export default function Landing() {
  usePageTitle();
  return (
    <main>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <Problem />
        <HowItWorks />
        <StudentsScrollBanner />
        <WhyMentora />
        <AIDemo />
        <Pricing />
        <CTA />
        <Footer />
      </Suspense>
    </main>
  );
}
