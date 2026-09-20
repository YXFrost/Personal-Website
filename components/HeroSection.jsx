import Link from "next/link";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils.mjs";
export default function HeroSection() {
  const current = Object.entries(site.currently || {}).filter(
    ([key, value]) => key !== "updated" && value,
  );
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">A personal notebook / {site.name}</p>
          <h1>
            I learn by
            <br />
            <em>building.</em>
          </h1>
          <p className="hero-subtitle">Studying, writing & making things.</p>
          <p className="hero-description">{site.description}</p>
          <div className="actions">
            <Link className="button" href="/writing">
              Explore the writing <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/projects">
              See what I’m building <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <aside className="currently" aria-labelledby="currently-title">
          <div className="section-kicker">
            <span className="status-dot" aria-hidden="true" />
            <h2 id="currently-title">Currently</h2>
          </div>
          <dl>
            {current.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {site.currently?.updated && (
            <p className="updated">
              Updated{" "}
              <time dateTime={site.currently.updated}>
                {formatDate(site.currently.updated)}
              </time>
            </p>
          )}
        </aside>
      </div>
      <div className="container hero-foot">
        <span>Curiosity, with a paper trail.</span>
        <span aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
