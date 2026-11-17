import { site } from "@/lib/site";
import { safeUrl } from "@/lib/utils.mjs";
import { pageMetadata } from "@/lib/metadata";
import NavigationLink from "@/components/NavigationLink";
import SectionPage from "@/components/SectionPage";

const notebookLinks = [
  { href: "/writing", title: "Writing", description: "Essays that bring ideas together." },
  { href: "/projects", title: "Projects", description: "What I build and what I learn along the way." },
  { href: "/progress", title: "Progress", description: "Monthly study logs and reflections." },
];

export const metadata = pageMetadata("About", site.description, "/about");
export default function AboutPage() {
  return (
    <SectionPage
      section="about"
      eyebrow="Behind the notebook"
      title="Always a student"
      description={(
        <>
          Interested in how things work.
          <br />
          And in the questions that don’t have easy answers.
        </>
      )}
    >
      <div className="about-columns">
        <div className="prose">
          {site.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside className="about-note" data-reveal="">
          <p className="eyebrow">A working principle</p>
          <blockquote>
            Understand it.
            <br />
            Try it.
            <br />
            Write it down.
            <br />
            <em>Keep going.</em>
          </blockquote>
          {(site.email || safeUrl(site.github)) && (
            <div className="contact-links">
              <h2>Get in touch</h2>
              {site.email && <a href={`mailto:${site.email}`}>Email ↗</a>}
              {safeUrl(site.github) && <a href={site.github}>GitHub ↗</a>}
            </div>
          )}
        </aside>
      </div>
      <section className="about-routes" aria-labelledby="notebook-contents">
        <h2 id="notebook-contents">What you’ll find here</h2>
        <ul>
          {notebookLinks.map(({ href, title, description }) => (
            <li key={href} data-reveal="">
              <NavigationLink className="about-route-link" href={href} prefetchOnIntent>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="route-arrow" aria-hidden="true">→</span>
              </NavigationLink>
            </li>
          ))}
        </ul>
      </section>
    </SectionPage>
  );
}
