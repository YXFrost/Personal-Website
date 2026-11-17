import {
  connectionOpacity,
  crankRadius,
  linkageAt,
  linkagePivots,
  orbitCenter,
  orbitPairs,
  orbitPositions,
  orbits,
  orbitTrail,
  penTrace,
  point,
  rockerRadius,
  waveExperimentAt,
  wavePlot,
} from "@/lib/mastheadMotion";

const annotations = [
  { word: "Motive", x: 211, end: 292, y: 107 },
  { word: "Guilt", x: 243, end: 323, y: 159 },
  { word: "Redemption", x: 193, end: 289, y: 223 },
];

function WritingArtwork() {
  return (
    <svg viewBox="0 0 560 320" className="masthead-art">
      <defs>
        <linearGradient id="manuscript-paper" x2="1" y2="1">
          <stop stopColor="#352719" />
          <stop offset="1" stopColor="#211a13" />
        </linearGradient>
        <pattern id="manuscript-rules" width="8" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 17.5h8" className="masthead-guide" opacity=".45" />
        </pattern>
      </defs>
      <g transform="rotate(-10 290 160)" className="masthead-manuscript">
        <rect x="159" y="33" width="295" height="242" rx="2" className="masthead-sheet-back" />
        <rect x="139" y="45" width="302" height="246" rx="2" className="masthead-sheet-front" />
        <rect x="151" y="52" width="279" height="230" fill="url(#manuscript-rules)" />
        <path d="M345 57v222 M169 79h155" className="masthead-guide" />
        <path
          className="masthead-manuscript-ink"
          pathLength="1"
          d="M169 70h67m7 0h41m7 0h24
             M169 97h29m7 0h44m7 0h38m7 0h16
             M169 111h34m7 0h39m7 0h38m7 0h23
             M169 125h41m7 0h57m7 0h36
             M169 151h48m7 0h40m7 0h44
             M169 163h31m7 0h29m7 0h40m7 0h34
             M169 177h55m7 0h28m7 0h33
             M169 199h48m7 0h29m7 0h37m7 0h17
             M169 214h23m7 0h55m7 0h32m7 0h17
             M169 227h22m7 0h38m7 0h43m7 0h23
             M169 243h58m7 0h44m7 0h32
             M169 259h33m7 0h66"
        />
        {annotations.map(({ word, x, end, y }, index) => (
          <g key={word} className="masthead-note" data-first-note={index === 0 ? "" : undefined} style={{ "--note-delay": `${index * 4 - 1}s` }}>
            <path className="masthead-underline" pathLength="1" d={`M${x} ${y + 9}Q${(x + end) / 2} ${y + 12} ${end} ${y + 8}`} />
            <path className="masthead-annotation-leader" pathLength="1" d={`M${end} ${y + 8}H${end + 9}L348 ${y - 2}H356`} />
            <g className="masthead-annotation-word">
              <circle cx="356" cy={y - 2} r="2" />
              <text x="363" y={y + 2}>{word}</text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

function ProjectArtwork() {
  const [left, right] = linkagePivots;
  const { crank, rocker, pen } = linkageAt(0.13);
  return (
    <svg viewBox="0 0 560 320" className="masthead-art" data-motion-scene="linkage">
      <defs>
        <radialGradient id="linkage-halo">
          <stop stopColor="#ffd28c" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd28c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="linkage-plate" x2="1" y2="1">
          <stop stopColor="#2b3021" />
          <stop offset="1" stopColor="#161a13" />
        </linearGradient>
        <pattern id="linkage-grid" width="23" height="23" patternUnits="userSpaceOnUse">
          <path d="M23 0H0V23" className="masthead-guide" opacity=".45" />
        </pattern>
      </defs>
      <g transform="rotate(-5 280 160)" className="masthead-machine">
        <rect x="78" y="32" width="414" height="252" rx="4" className="masthead-plate" />
        <rect x="87" y="41" width="396" height="234" fill="url(#linkage-grid)" />
        <path d="M100 60v-8h9m352 0h9v8m0 191v10h-9m-352 0h-9v-10" className="masthead-guide" />
        <path d="M113 218h318M150 155v113M382 85v183M150 255h232m-238 6 12-12m220 12 12-12" className="masthead-construction" />
        <circle cx={left.x} cy={left.y} r={crankRadius} className="masthead-construction" />
        <path d={`M${right.x - rockerRadius} ${right.y}A${rockerRadius} ${rockerRadius} 0 0 1 457 94`} className="masthead-construction" />
        <path d={penTrace} className="masthead-old-trace" data-old-trace opacity="0" />
        <path d={penTrace} className="masthead-pen-glow" pathLength="1" strokeDasharray="1 1" data-pen-trace />
        <path d={penTrace} className="masthead-pen-trace" pathLength="1" strokeDasharray="1 1" data-pen-trace />
        <path d={`M${point(left)}L${point(crank)}`} className="masthead-crank" data-crank />
        <path d={`M${point(right)}L${point(rocker)}`} className="masthead-rocker" data-rocker />
        <path d={`M${point(crank)}L${point(rocker)}L${point(pen)}Z`} className="masthead-coupler" data-coupler />
        {linkagePivots.map(({ x, y }) => <circle key={x} cx={x} cy={y} r="7" className="masthead-pivot" />)}
        <circle cx={crank.x} cy={crank.y} r="5" className="masthead-pin" data-linkage-pin />
        <circle cx={rocker.x} cy={rocker.y} r="5" className="masthead-pin" data-linkage-pin />
        <circle r="15" fill="url(#linkage-halo)" transform={`translate(${point(pen)})`} data-pen-halo />
        <circle cx={pen.x} cy={pen.y} r="4" className="masthead-pen" data-linkage-pin />
      </g>
    </svg>
  );
}

function ProgressArtwork() {
  const wave = waveExperimentAt(0.43);
  const { left, right, center } = wavePlot;
  return (
    <svg viewBox="0 0 560 320" className="masthead-art masthead-waves" data-motion-scene="waves">
      <defs>
        <radialGradient id="experiment-glow">
          <stop stopColor="#80d8b6" stopOpacity=".19" />
          <stop offset="1" stopColor="#80d8b6" stopOpacity="0" />
        </radialGradient>
        <pattern id="experiment-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" className="masthead-guide" opacity=".6" />
          <circle cx="12" cy="12" r="1" fill="#72b9a0" opacity=".19" />
        </pattern>
      </defs>
      <ellipse cx="283" cy="151" rx="270" ry="147" fill="url(#experiment-glow)" />
      <rect x={left} y="50" width={right - left} height="200" fill="url(#experiment-grid)" />
      <path d={`M${left} ${center}H${right}M280 50v200`} className="masthead-construction" />
      <path d="M54 63V50h13m426 0h13v13m0 174v13h-13m-426 0H54v-13" className="masthead-guide" />
      <path className="masthead-wave-trail masthead-wave-trail-far" d={wave.trailFar} data-wave="trailFar" />
      <path className="masthead-wave-trail" d={wave.trail} data-wave="trail" />
      <path className="masthead-wave-part-a" d={wave.first} data-wave="first" />
      <path className="masthead-wave-part-b" d={wave.second} data-wave="second" />
      <path className="masthead-wave-glow" d={wave.sum} data-wave="sum" />
      <path className="masthead-wave-sum" d={wave.sum} data-wave="sum" />
    </svg>
  );
}

// Layered trails: each shorter one is brighter, so the tail fades smoothly behind the planet.
const trailLengths = [0.11, 0.065, 0.03];

function AboutArtwork() {
  const positions = orbitPositions(0);
  const { x, y } = orbitCenter;
  return (
    <svg viewBox="0 0 560 320" className="masthead-art" data-motion-scene="orbits">
      <defs>
        <radialGradient id="orbit-light">
          <stop stopColor="#edb074" stopOpacity=".23" />
          <stop offset="1" stopColor="#edb074" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbit-glow">
          <stop stopColor="#f0b36d" stopOpacity=".5" />
          <stop offset="1" stopColor="#f0b36d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbit-planet" cx="34%" cy="31%" r="75%">
          <stop stopColor="#fff0ca" />
          <stop offset=".52" stopColor="#e8ae74" />
          <stop offset="1" stopColor="#95602e" />
        </radialGradient>
      </defs>
      <g transform={`rotate(-15 ${x} ${y})`}>
        <ellipse cx={x} cy={y} rx="242" ry="125" fill="url(#orbit-light)" />
        {orbits.map(({ rx, ry }) => <ellipse key={rx} cx={x} cy={y} rx={rx} ry={ry} className="masthead-orbit-ring" />)}
        <ellipse cx={x} cy={y} rx="190" ry="87" className="masthead-construction" />
        <ellipse cx={x} cy={y} rx="83" ry="38" className="masthead-construction" />
        <path d={`M${x - 235} ${y}h470M${x} ${y - 112}v224`} className="masthead-construction" />
        {orbitPairs.map(([first, second]) => {
          const a = positions[first];
          const b = positions[second];
          return (
            <line
              key={`${first}-${second}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              opacity={connectionOpacity(a, b)}
              className="masthead-orbit-link"
              data-orbit-link
            />
          );
        })}
        {orbits.map(({ rx }, index) => trailLengths.map((length) => (
          <path
            key={`${rx}-${length}`}
            d={orbitTrail(index, 0, length)}
            className="masthead-orbit-trail"
            data-orbit-trail={index}
            data-length={length}
          />
        )))}
        <circle cx={x} cy={y} r="22" fill="url(#orbit-glow)" className="masthead-orbit-corona" />
        <circle cx={x} cy={y} r="5" className="masthead-orbit-star" />
        {orbits.map(({ size, rx }, index) => (
          <g key={rx} transform={`translate(${point(positions[index])})`} data-orbit-body>
            <circle r={size * 3} fill="url(#orbit-glow)" />
            <circle r={size} className="masthead-orbit-planet" />
            {index === orbits.length - 1 && (
              <g transform="rotate(28)" data-orbit-moon>
                <circle cx="13" r="2.15" className="masthead-orbit-moon" />
              </g>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

const artworks = {
  writing: WritingArtwork,
  projects: ProjectArtwork,
  progress: ProgressArtwork,
  about: AboutArtwork,
};

export default function MastheadArtwork({ section }) {
  const Artwork = artworks[section];
  return Artwork ? <Artwork /> : null;
}
