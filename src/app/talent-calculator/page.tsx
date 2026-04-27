import { Suspense } from 'react';
import type { Metadata } from 'next';
import TalentCalculator from './TalentCalculator';

export const metadata: Metadata = {
  title: 'Talent Calculator - Chrono Odyssey | Chronotector',
  description:
    'Plan your Chrono Odyssey build with our interactive talent calculator. Explore weapon mastery trees and class mastery skills for all 6 classes.',
};

export default function TalentCalculatorPage() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-4xl sm:text-5xl text-accent-gold mb-2">
        Talent Calculator
      </h1>
      <p className="text-text-muted text-lg mb-8 max-w-3xl">
        Plan your build by allocating points across weapon mastery trees and
        class mastery skills. Data sourced from the June 2025 closed beta.
      </p>
      <Suspense fallback={<div className="text-text-muted text-sm">Loading calculator…</div>}>
        <TalentCalculator />
      </Suspense>
    </main>
  );
}
