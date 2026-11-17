import MastheadArtwork from "@/components/MastheadArtwork";
import PointerGlow from "@/components/PointerGlow";
import SectionArt from "@/components/SectionArt";

export default function SectionPage({ section, title, description, eyebrow, actions, children }) {
  // The last word and the full stop never wrap apart.
  const words = title.split(" ");
  const last = words.pop();
  const lead = words.join(" ");
  return (
    <div className={`section-page ${section}-page`}>
      <div className="section-masthead">
        <SectionArt>
          <div className="section-art-grid" />
          <div className="section-art-detail">
            <MastheadArtwork section={section} />
          </div>
        </SectionArt>
        <PointerGlow />
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
