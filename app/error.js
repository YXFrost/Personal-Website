// app/error.js
// ─────────────────────────────────────────────────────────────────
// Error boundary for the app - catches and displays errors gracefully
// This is a Client Component (uses 'use client' directive)
// ─────────────────────────────────────────────────────────────────

'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div 
          className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-border flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="font-mono text-3xl text-text-secondary">!</span>
        </div>

        {/* Error Message */}
        <h1 className="font-display text-2xl md:text-3xl text-text-primary mb-4">
          Something went wrong
        </h1>
        
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          We encountered an unexpected error. This has been logged and we'll look into it.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-card border border-border rounded-sm text-left">
            <p className="font-mono text-xs text-amber break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-amber text-void font-mono text-sm rounded-sm hover:bg-amber-glow transition-colors duration-200"
          >
            Try again
          </button>
          
          <a
            href="/"
            className="px-6 py-3 border border-border text-text-primary font-mono text-sm rounded-sm hover:border-amber hover:text-amber transition-colors duration-200"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}