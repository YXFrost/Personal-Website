/* eslint-disable @next/next/no-css-tags -- Deliberately load self-hosted math styles only for entries with math; avoids a global font/CSS payload. */
import { PortableText } from "@portabletext/react";
import ResponsiveImage from "./ResponsiveImage";
import CodeBlock from "./CodeBlock";
import { headingId, safeUrl, textOf } from "@/lib/utils.mjs";
export function getHeadings(body = []) {
  return body
    .filter((b) => b._type === "block" && ["h2", "h3"].includes(b.style))
    .map((b) => ({ id: headingId(b), title: textOf(b), level: b.style }));
}
export default async function ArticleRenderer({ body = [] }) {
  const hasMath = body.some(
    (b) =>
      b._type === "math" || b.children?.some((c) => c._type === "inlineMath"),
  );
  const katex = hasMath ? (await import("katex")).default : null;
  const math = ({ value, isInline }) => {
    if (!katex || !value.latex) return null;
    const html = katex.renderToString(value.latex, {
      displayMode: !isInline,
      throwOnError: false,
      trust: false,
      strict: "warn",
      output: "htmlAndMathml",
    });
    return isInline ? (
      <span dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <div
        className="math-block"
        tabIndex={0}
        role="region"
        aria-label="Mathematical expression"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };
  const heading = (Tag) =>
    function Heading({ value, children }) {
      return (
        <Tag id={headingId(value)}>
          <a href={`#${headingId(value)}`} className="heading-anchor">
            {children}
            <span aria-hidden="true"> #</span>
          </a>
        </Tag>
      );
    };
  const components = {
    block: {
      h1: heading("h2"),
      h2: heading("h2"),
      h3: heading("h3"),
      h4: heading("h4"),
      h5: heading("h5"),
      h6: heading("h6"),
    },
    marks: {
      underline: ({ children }) => <span style={{ textDecoration: "underline" }}>{children}</span>,
      link: ({ value, children }) => {
        const href = safeUrl(value.href, { mail: true, relative: true });
        return href ? <a href={href}>{children}</a> : <>{children}</>;
      },
    },
    types: {
      image: ({ value }) => (
        <figure>
          <ResponsiveImage image={value} zoomable />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ),
      code: ({ value }) => <CodeBlock value={value} />,
      table: ({ value }) => (
        <div
          className="table-scroll"
          role="region"
          aria-label={value.caption || "Data table"}
          tabIndex={0}
        >
          <table>
            {value.caption && <caption>{value.caption}</caption>}
            {value.rows?.length > 0 && (
              <>
                <thead>
                  <tr>
                    {value.rows[0].cells.map((cell, i) => (
                      <th key={i} scope="col">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {value.rows.slice(1).map((row, i) => (
                    <tr key={row._key || i}>
                      {row.cells.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      ),
      math,
      inlineMath: math,
    },
    unknownType: () => (
      <p className="content-note">This content block is not supported yet.</p>
    ),
  };
  return (
    <>
      {hasMath && <link rel="stylesheet" href="/math/katex.min.css" />}
      <div className="prose">
        <PortableText value={body} components={components} />
      </div>
    </>
  );
}
