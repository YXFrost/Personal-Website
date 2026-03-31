// app/not-found.js
// ─────────────────────────────────────────────────────────────────
// 404 Not Found page - shown when a route doesn't exist
// Improved with better navigation and helpful links
// ─────────────────────────────────────────────────────────────────

import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Code */}
        <div 
          className="font-mono text-6xl md:text-7xl text-amber mb-4 text-glow"
          aria-label="Error 404"
        >
          404
        </div>

        {/* Error Message */}
        <h1 className="font-display text-2xl md:text-3xl text-text-primary mb-4">
          Page Not Found
        </h1>
        
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-amber text-void font-mono text-sm rounded-sm hover:bg-amber-glow transition-colors duration-200"
          >
            Go home
          </Link>
          
          <Link
            href="/#projects"
            className="px-6 py-3 border border-border text-text-primary font-mono text-sm rounded-sm hover:border-amber hover:text-amber transition-colors duration-200"
          >
            View projects
          </Link>
        </div>

        {/* Decorative Grid */}
        <div 
          className="h-32 bg-grid opacity-50"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}