import { Suspense, lazy } from 'react';
import Hero from '../components/landing/Hero';
import useSEO from '../hooks/useSEO';

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
  useSEO({
    title: 'AI-Powered Exam Prep for Georgian Students',
    description: 'Mentora AI helps Georgian students ace national exams with AI-powered math tutoring, step-by-step solutions, personalized practice, and realistic exam simulations.',
    path: '/',
  });
  return (
    <main>
      <Hero />
      {/* Each section gets its own Suspense — all chunks fetch in parallel */}
      <Suspense fallback={<SectionSkeleton />}><Problem /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><HowItWorks /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><StudentsScrollBanner /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><WhyMentora /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><AIDemo /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Pricing /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><CTA /></Suspense>
      <Suspense fallback={null}><Footer /></Suspense>
    </main>
  );
}
