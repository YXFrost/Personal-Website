import NavigationLink from "./NavigationLink";
import { site } from "@/lib/site";
import { entryPath, formatDate } from "@/lib/utils.mjs";
import HeroGlow from "./HeroGlow";

const sections = [
  ["projects", "Projects"],
  ["writing", "Writing"],
  ["study-logs", "Study logs"],
];

export default function HeroSection({ lead }) {
  const current = Object.entries(site.currently || {}).filter(
    ([key, value]) => key !== "updated" && value,
  );
  return (
    <section className="hero" id="home">
      <div className="hero-backdrop" aria-hidden="true">
        <div className="hero-grid-paper" />
        <div className="hero-contours" />
      </div>
      <HeroGlow />
      <div className="container hero-grid">
        <div>
          <h1>
            <span className="hero-line"><span>I learn by</span></span>{" "}
            <span className="hero-line hero-line-accent"><span>building.</span></span>
          </h1>
          <p className="hero-description">{site.description}</p>
          <div className="actions">
            <NavigationLink className="button" href={lead ? entryPath(lead) : "/about"} prefetch aria-describedby={lead ? "hero-entry" : undefined}>
              {lead?._type === "writing" ? "Read the latest essay" : lead ? "Read the latest entry" : "About the notebook"}
              <span aria-hidden="true">→</span>
            </NavigationLink>
            {lead && <p className="hero-entry" id="hero-entry">{lead.title}</p>}
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
      <nav className="container home-index" aria-label="On this page">
        <ul>
          {sections.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>
                {label}
                <span aria-hidden="true">↓</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
