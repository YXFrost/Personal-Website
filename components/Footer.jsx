// components/Footer.jsx
// ─────────────────────────────────────────────────────────────────
// Minimal footer with social links and copyright.
// ─────────────────────────────────────────────────────────────────

const socialLinks = [
  
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 lg:px-20 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left — copyright */}
        <p className="font-mono text-xs text-text-muted">
          © {new Date().getFullYear()} Nael. All rights reserved.
        </p>

        {/* Right — social links */}
        <ul className="flex items-center gap-6" role="list">
          {socialLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-text-secondary hover:text-amber transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
