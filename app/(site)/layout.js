import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import RevealObserver from "@/components/RevealObserver";
import { site, siteUrl, preview, isPublicSite } from "@/lib/site";
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — A personal notebook`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots:
    isPublicSite ? { index: true, follow: true } : { index: false, follow: false },
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
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
