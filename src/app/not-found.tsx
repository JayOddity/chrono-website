import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <h1 className="font-heading text-6xl text-accent-gold mb-4">404</h1>
        <div className="diamond-divider mb-6">
          <span className="diamond" />
        </div>
        <h2 className="font-heading text-2xl text-text-primary mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-accent-gold text-void-black font-heading font-semibold rounded-lg hover:bg-accent-gold-light transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
