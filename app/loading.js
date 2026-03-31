// app/loading.js
// ─────────────────────────────────────────────────────────────────
// Root loading UI - shown during page transitions
// ─────────────────────────────────────────────────────────────────

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Animated loader */}
        <div 
          className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-border border-t-amber animate-spin"
          aria-label="Loading"
          role="status"
        />
        
        {/* Loading text */}
        <p className="font-mono text-sm text-text-muted">
          Loading<span className="cursor-blink">_</span>
        </p>
      </div>
    </div>
  );
}