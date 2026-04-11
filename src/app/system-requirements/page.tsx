import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Requirements - Chrono Info',
  description: 'System Requirements - Chrono Info',
};

interface SpecRow {
  label: string;
  minimum: string;
  recommended: string;
}

const specs: SpecRow[] = [
  { label: 'OS', minimum: 'Windows 10', recommended: 'Windows 10' },
  { label: 'Processor', minimum: 'Intel Core i5-3570K / AMD FX-8310', recommended: 'Intel Core i7-4790 / AMD Ryzen 3 3200G' },
  { label: 'RAM', minimum: '12 GB', recommended: '16 GB' },
  { label: 'Graphics', minimum: 'NVIDIA GTX 1060 / AMD RX 580', recommended: 'NVIDIA RTX 3060 / AMD RX 6800 XT' },
  { label: 'DirectX', minimum: 'Version 11', recommended: 'Version 11' },
  { label: 'Storage', minimum: '50 GB', recommended: '50 GB' },
];

export default function SystemRequirementsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <h1 className="font-heading text-4xl text-accent-gold mb-4">System Requirements</h1>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      {/* Desktop table */}
      <section className="py-8 hidden sm:block">
        <div className="bg-card-bg border border-border-subtle rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left p-4 font-heading text-accent-gold text-sm">Component</th>
                <th className="text-left p-4 font-heading text-accent-gold text-sm">Minimum</th>
                <th className="text-left p-4 font-heading text-accent-gold text-sm">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((row) => (
                <tr key={row.label} className="border-b border-border-subtle last:border-0">
                  <td className="p-4 text-text-primary font-medium">{row.label}</td>
                  <td className="p-4 text-text-secondary">{row.minimum}</td>
                  <td className="p-4 text-text-secondary">{row.recommended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile cards */}
      <section className="py-8 sm:hidden space-y-6">
        <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
          <h2 className="font-heading text-lg text-accent-gold mb-4">Minimum</h2>
          <dl className="space-y-3">
            {specs.map((row) => (
              <div key={row.label}>
                <dt className="text-xs text-text-muted uppercase tracking-wider">{row.label}</dt>
                <dd className="text-text-secondary">{row.minimum}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
          <h2 className="font-heading text-lg text-accent-gold mb-4">Recommended</h2>
          <dl className="space-y-3">
            {specs.map((row) => (
              <div key={row.label}>
                <dt className="text-xs text-text-muted uppercase tracking-wider">{row.label}</dt>
                <dd className="text-text-secondary">{row.recommended}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
