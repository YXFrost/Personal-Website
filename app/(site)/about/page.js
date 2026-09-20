import Link from "next/link";
import { site } from "@/lib/site";
import { safeUrl } from "@/lib/utils.mjs";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("About", site.description, "/about");
export default function AboutPage() {
  return (
    <div className="container archive about-page">
      <header className="page-heading">
        <p className="eyebrow">04 / Behind the notebook</p>
        <h1>
          Always a student<span>.</span>
        </h1>
        <p>
          Interested in how things work.
          <br />
          And in the questions that don’t have easy answers.
        </p>
      </header>
      <div className="about-columns">
        <div className="prose">
          {site.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <h2>What you’ll find here</h2>
          <p>
            <Link href="/writing">Writing</Link> is where I synthesize ideas.{" "}
            <Link href="/projects">Projects</Link> is where I document things I
            build. <Link href="/progress">Progress</Link> keeps the record of
            learning along the way.
          </p>
        </div>
        <aside className="about-note">
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
    </div>
  );
}
