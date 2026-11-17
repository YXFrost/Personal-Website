import SectionArt from "@/components/SectionArt";

// Every value below is fixed so server and client render identical markup.
const planets = [
  { ring: 1, size: 5, period: 13, phase: 0.1, cos: 0.7, sin: -0.71 },
  { ring: 2, size: 8, period: 21, phase: 0.55, cos: -0.94, sin: 0.34 },
  { ring: 4, size: 6, period: 34, phase: 0.3, cos: 0.26, sin: 0.97 },
  { ring: 6, size: 10, period: 52, phase: 0.8, cos: -0.5, sin: -0.87, moon: true },
];
const inkRows = [
  { row: 1, width: 74, word: 26 },
  { row: 2, width: 81, word: 19 },
  { row: 3, width: 69, word: 31 },
  { row: 4, width: 38, word: 22 },
  { row: 6, width: 79, word: 23 },
  { row: 7, width: 72, word: 34 },
  { row: 8, width: 80, word: 18 },
  { row: 9, width: 52, word: 27 },
  { row: 11, width: 76, word: 21 },
  { row: 12, width: 61, word: 29 },
];
const currents = [
  { axis: "x", offset: 0, dir: 1, duration: 3.4, delay: 0.4 },
  { axis: "x", offset: -1, dir: -1, duration: 4.6, delay: 1.5 },
  { axis: "x", offset: 1, dir: -1, duration: 3.9, delay: 2.6 },
  { axis: "x", offset: 2, dir: 1, duration: 5.3, delay: 0.9 },
  { axis: "x", offset: -2, dir: -1, duration: 5.9, delay: 3.4 },
  { axis: "y", offset: 0, dir: -1, duration: 3.7, delay: 1.1 },
  { axis: "y", offset: -2, dir: 1, duration: 4.4, delay: 2.1 },
  { axis: "y", offset: 1, dir: 1, duration: 5.1, delay: 0.2 },
  { axis: "y", offset: -4, dir: -1, duration: 6.2, delay: 3.0 },
];
const nodes = [
  { col: 0, row: 0, duration: 2.6, delay: 0.3 },
  { col: -2, row: -1, duration: 3.5, delay: 1.2 },
  { col: 1, row: 1, duration: 3.1, delay: 2.0 },
  { col: -1, row: 2, duration: 4.2, delay: 0.8 },
  { col: 3, row: -1, duration: 3.8, delay: 2.7 },
  { col: -4, row: 1, duration: 4.9, delay: 1.7 },
];

function AboutArt() {
  return (
    <div className="section-art-detail">
      <div className="about-rings">
        {planets.map(({ ring, size, period, phase, cos, sin, moon }) => (
          <span
            key={ring}
            className="orbit"
            style={{
              "--rx": `${33.5 + 38 * ring}px`,
              "--size": `${size}px`,
              "--period": `${period}s`,
              "--phase": `${-phase * period}s`,
              "--cos": cos,
              "--sin": sin,
            }}
          >
            <span className="orbit-y">
              <span className={moon ? "planet has-moon" : "planet"} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function WritingArt() {
  return (
    <div className="section-art-detail">
      <div className="writing-ink">
        <div className="ink-page">
          {inkRows.map(({ row, width, word }, index) => (
            <span
              key={row}
              style={{ "--row": row, "--width": `${width}%`, "--word": `${word}px`, "--i": index }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsArt() {
  return (
    <div className="section-art-detail">
      <div className="draft">
        <span className="draft-edge draft-top" />
        <span className="draft-edge draft-right" />
        <span className="draft-edge draft-bottom" />
        <span className="draft-edge draft-left" />
        <span className="draft-head" />
      </div>
      <span className="draft-scan" />
    </div>
  );
}

function ProgressField() {
  return (
    <>
      <span className="field-glow" />
      <span className="field-wave" />
      {currents.map(({ axis, offset, dir, duration, delay }, index) => (
        <span
          key={index}
          className={`field-current field-current-${axis}`}
          style={{ "--offset": offset, "--dir": dir, "--duration": `${duration}s`, "--delay": `${delay}s` }}
        />
      ))}
      {nodes.map(({ col, row, duration, delay }, index) => (
        <span
          key={index}
          className="field-node"
          style={{ "--col": col, "--row": row, "--duration": `${duration}s`, "--delay": `${delay}s` }}
        />
      ))}
    </>
  );
}

const details = { about: AboutArt, writing: WritingArt, projects: ProjectsArt };

export default function SectionPage({ section, title, description, eyebrow, actions, children }) {
  const Detail = details[section];
  // The last word and the full stop never wrap apart.
  const words = title.split(" ");
  const last = words.pop();
  const lead = words.join(" ");
  return (
    <div className={`section-page ${section}-page`}>
      <div className="section-masthead">
        <SectionArt>
          <div className="section-art-grid">
            {section === "progress" && <ProgressField />}
          </div>
          {Detail ? <Detail /> : <div className="section-art-detail" />}
        </SectionArt>
        <div className="container">
          <header className="page-heading">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>
              <span className="title-line">
                {lead && `${lead} `}
                <span className="title-end">
                  {last}
                  <span className="title-dot">.</span>
                </span>
              </span>
            </h1>
            <p className="section-description">{description}</p>
            {actions}
          </header>
        </div>
      </div>
      <div className="container archive section-content">
        {children}
      </div>
    </div>
  );
}
