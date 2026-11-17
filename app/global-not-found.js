import "./(site)/globals.css";
import NotFound from "./(site)/not-found";

export const metadata = { title: "Page not found | YN", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main-content"><NotFound /></main>
      </body>
    </html>
  );
}
