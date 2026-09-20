import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site, siteUrl, preview, hasPublicOrigin } from "@/lib/site";
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — A personal notebook`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  robots:
    preview || !hasPublicOrigin
      ? { index: false, follow: false }
      : { index: true, follow: true },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#11110f",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar />
        {preview && (
          <aside className="preview-banner" aria-label="Layout preview">
            Layout preview — sample entries are fictional and excluded from
            feeds and indexing.
          </aside>
        )}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
