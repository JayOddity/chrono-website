import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Release Date - Chrono Info',
  description: 'Release Date - Chrono Info',
};

export default function ReleaseDatePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <h1 className="font-heading text-4xl text-accent-gold mb-4">Release Date</h1>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      <section className="py-8 space-y-6">
        <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
          <h2 className="font-heading text-2xl text-accent-gold mb-3">Q1 2027</h2>
          <p className="text-text-secondary leading-relaxed">
            Chrono Odyssey is currently scheduled for Q1 2027 according to Kakao Games&apos; quarterly report. The game was previously targeting Q4 2026 but was postponed to allow more time to implement feedback from the June 2025 closed beta.
          </p>
        </div>

        <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
          <h2 className="font-heading text-2xl text-accent-gold mb-3">Platforms</h2>
          <p className="text-text-secondary leading-relaxed">
            PC (Steam and Epic Games), PlayStation 5, Xbox Series X.
          </p>
        </div>

        <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
          <h2 className="font-heading text-2xl text-accent-gold mb-3">Closed Beta</h2>
          <p className="text-text-secondary leading-relaxed">
            The first closed beta ran June 20&ndash;22, 2025 on Steam. It drew over 65,000 players at peak with mixed reception. Kakao Games stated that the CBT &ldquo;really helped us to understand and recognize the high level of interest and positive anticipation that&apos;s building up in the Western market&rdquo; and decided to &ldquo;further dial up the game&apos;s level of completeness&rdquo; even with additional development time required.
          </p>
        </div>

        <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
          <h2 className="font-heading text-2xl text-accent-gold mb-3">Post-Beta Development</h2>
          <p className="text-text-secondary leading-relaxed">
            Since the beta, the developers have published four sets of Developer&apos;s Notes detailing improvements to hit feedback, animations, control feel, enemy behaviour, and graphical quality. Multiple focus group tests have taken place in the home market. A second closed beta is expected before launch.
          </p>
        </div>

        <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
          <h2 className="font-heading text-2xl text-accent-gold mb-3">Timeline</h2>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="text-accent-gold font-heading text-sm shrink-0 w-28 text-right mt-0.5">Jun 2025</span>
              <span>First closed beta on Steam (65K peak players)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-gold font-heading text-sm shrink-0 w-28 text-right mt-0.5">Q2 2025</span>
              <span>Kakao earnings call moves target from Q4 2025 to Q4 2026</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-gold font-heading text-sm shrink-0 w-28 text-right mt-0.5">Feb 2026</span>
              <span>Kakao quarterly report delays launch again to Q1 2027</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-gold font-heading text-sm shrink-0 w-28 text-right mt-0.5">Q1 2027</span>
              <span>Current target launch (PC, PS5, Xbox Series X)</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
