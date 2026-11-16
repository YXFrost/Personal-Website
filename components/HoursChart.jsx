import Link from "next/link";
import { entryPath } from "@/lib/utils.mjs";
// Server-rendered bar strip: one slot per month, each logged month links to its entry.
export default function HoursChart({ months }) {
  if (!months.length) return null;
  const max = Math.max(...months.map((m) => m.hours || 0)) || 1;
  const latest = months.findLast((m) => m.hours !== null)?.key;
  return (
    <figure className="hours-chart-figure" data-reveal="">
      <figcaption>Hours studied per month</figcaption>
      <ol className="hours-chart">
        {months.map((m, i) => (
          <li
            key={m.key}
            className={m.key === latest ? "is-latest" : undefined}
            style={{ "--h": (m.hours || 0) / max, "--i": i }}
          >
            {m.entry ? (
              <Link
                className="hours-bar"
                href={entryPath(m.entry)}
                title={`${m.label}: ${m.hours} hours`}
              >
                <span className="hours-fill" />
                <span className="sr-only">{`${m.label}: ${m.hours} hours`}</span>
              </Link>
            ) : (
              <span className="hours-bar is-empty">
                <span className="sr-only">{`${m.label}: no log`}</span>
              </span>
            )}
            <span className="hours-month" aria-hidden="true">
              {m.initial}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
