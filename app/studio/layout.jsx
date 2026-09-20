export const metadata = { title: "Content Studio", robots: { index: false, follow: false } };
export const viewport = { width: "device-width", initialScale: 1 };
export default function StudioLayout({ children }) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}
