import NavigationLink from "./NavigationLink";
import { entryPath } from "@/lib/utils.mjs";
export default function HoursChart({ months }) {
  if (!months.length) return null;
  const max = Math.max(...months.map((m) => m.hours || 0)) || 1;
  const latest = months.findLast((m) => m.hours !== null)?.key;
  return (
    <figure className="hours-chart-figure" data-reveal="">
      <figcaption>Hours studied per month</figcaption>
      <ol className="hours-chart" aria-hidden="true">
        {months.map((m, i) => (
          <li
            key={m.key}
            className={m.key === latest ? "is-latest" : undefined}
            style={{ "--h": (m.hours || 0) / max, "--i": i }}
          >
            <span className="hours-bar">
              {m.hours !== null && <span className="hours-fill" />}
            </span>
            <span className="hours-month">{m.initial}</span>
          </li>
        ))}
      </ol>
      <ul className="hours-list" aria-label="Monthly study hours">
        {months.filter((month) => month.entries.length).map((month) => (
          <li key={month.key}>
            <NavigationLink
              href={month.entries.length === 1 ? entryPath(month.entries[0]) : `/progress?month=${month.key}#progress-results`}
              prefetch={false}
            >
              <span>{month.label}</span>
              <span>{month.hours.toLocaleString("en-GB")} {month.hours === 1 ? "hour" : "hours"} <span aria-hidden="true">→</span></span>
            </NavigationLink>
          </li>
        ))}
      </ul>
    </figure>
  );
}
