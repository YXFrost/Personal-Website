import Link from "next/link";
import { site } from "@/lib/site";
import { safeUrl } from "@/lib/utils.mjs";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link href="/" className="wordmark" aria-label="YN — homepage">
            YN<span>.</span>
          </Link>
          <p>A notebook, always in progress.</p>
        </div>
        <div className="footer-right">
          <nav aria-label="Footer">
            <ul>
              {safeUrl(site.github) && (
                <li>
                  <a href={site.github}>GitHub ↗</a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`}>Contact ↗</a>
                </li>
              )}
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <a href="/feed.xml">RSS ↗</a>
              </li>
            </ul>
          </nav>
          <small>
            © {new Date().getFullYear()} {site.name}
          </small>
        </div>
      </div>
    </footer>
  );
}
