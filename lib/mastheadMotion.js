const turn = 2 * Math.PI;

export const linkagePivots = [
  { x: 150, y: 218 },
  { x: 382, y: 218 },
];
export const crankRadius = 52;
export const rockerRadius = 145;
const couplerLength = 186;

export function linkageAt(phase) {
  const [left, right] = linkagePivots;
  const angle = phase * turn;
  const crank = {
    x: left.x + crankRadius * Math.cos(angle),
    y: left.y + crankRadius * Math.sin(angle),
  };

  // The rocker pin is the upper intersection of two circles centred on the crank pin and right pivot.
  const dx = right.x - crank.x;
  const dy = right.y - crank.y;
  const distance = Math.hypot(dx, dy);
  const along = (couplerLength ** 2 - rockerRadius ** 2 + distance ** 2) / (2 * distance);
  const across = Math.sqrt(couplerLength ** 2 - along ** 2);
  const rocker = {
    x: crank.x + (along * dx + across * dy) / distance,
    y: crank.y + (along * dy - across * dx) / distance,
  };
  const pen = {
    x: crank.x + 0.66 * (rocker.x - crank.x) + 0.41 * (rocker.y - crank.y),
    y: crank.y + 0.66 * (rocker.y - crank.y) - 0.41 * (rocker.x - crank.x),
  };
  return { crank, rocker, pen };
}

export const point = ({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`;

const traceSamples = 160;
const penPoints = Array.from({ length: traceSamples + 1 }, (_, index) => linkageAt(index / traceSamples).pen);
let traceDistance = 0;
const traceDistances = penPoints.map(({ x, y }, index) => {
  if (index > 0) traceDistance += Math.hypot(x - penPoints[index - 1].x, y - penPoints[index - 1].y);
  return traceDistance;
});
export const penTrace = `M${penPoints.map(point).join("L")}`;

export function traceFraction(phase) {
  const sample = phase * traceSamples;
  const index = Math.floor(sample);
  const distance = traceDistances[index];
  const next = traceDistances[index + 1] ?? distance;
  return (distance + (next - distance) * (sample - index)) / traceDistance;
}

export const wavePlot = { left: 54, right: 506, center: 164 };
// Dense enough that a pulse peak (sigma 23) spans about a dozen points and reads as a curve.
const waveSamples = Array.from({ length: 161 }, (_, index) =>
  wavePlot.left + (wavePlot.right - wavePlot.left) * index / 160,
);
// Pulses fade in and out over the last 56 units of the plot instead of being cut off at its edge.
const edgeFade = (x) => {
  const t = Math.min(1, (x - wavePlot.left) / 56, (wavePlot.right - x) / 56);
  return t <= 0 ? 0 : t * t * (3 - 2 * t);
};
const wrap = (value) => (value % 1 + 1) % 1;
const pulse = (x, center) => 43 * Math.exp(-0.5 * ((x - center) / 23) ** 2);

function wavePaths(phase, components) {
  const { left, right, center } = wavePlot;
  const from = left - 88;
  const to = right + 88;
  const incoming = from + (to - from) * wrap(phase);
  const returning = left + right - incoming;
  const sum = [];
  const first = [];
  const second = [];
  for (const x of waveSamples) {
    const fade = edgeFade(x);
    const a = pulse(x, incoming) * fade;
    const b = pulse(x, returning) * fade;
    sum.push(point({ x, y: center - a - b }));
    if (components) {
      first.push(point({ x, y: center - a }));
      second.push(point({ x, y: center - b }));
    }
  }
  return {
    sum: `M${sum.join("L")}`,
    first: components ? `M${first.join("L")}` : "",
    second: components ? `M${second.join("L")}` : "",
  };
}

export function waveExperimentAt(phase) {
  return {
    ...wavePaths(phase, true),
    trail: wavePaths(phase - 0.04, false).sum,
    trailFar: wavePaths(phase - 0.09, false).sum,
  };
}

export const orbitCenter = { x: 301, y: 161 };
export const orbits = [
  { rx: 59, ry: 27, size: 4, period: 13, phase: 0.12 },
  { rx: 108, ry: 49, size: 5, period: 21, phase: 0.22 },
  { rx: 158, ry: 73, size: 4.5, period: 34, phase: 0.32 },
  { rx: 218, ry: 101, size: 6, period: 52, phase: 0.53 },
];
export const orbitPairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

export function orbitPositions(seconds) {
  return orbits.map(({ rx, ry, period, phase }) => {
    const angle = turn * (seconds / period + phase);
    return {
      x: orbitCenter.x + rx * Math.cos(angle),
      y: orbitCenter.y + ry * Math.sin(angle),
    };
  });
}

// A short arc behind a planet, `length` turns long, for a fading comet trail.
export function orbitTrail(index, seconds, length) {
  const { rx, ry, period, phase } = orbits[index];
  const end = turn * (seconds / period + phase);
  const steps = 14;
  const points = [];
  for (let step = 0; step <= steps; step++) {
    const angle = end - turn * length * (1 - step / steps);
    points.push(point({ x: orbitCenter.x + rx * Math.cos(angle), y: orbitCenter.y + ry * Math.sin(angle) }));
  }
  return `M${points.join("L")}`;
}

export function connectionOpacity(a, b) {
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  return Math.max(0, 1 - distance / 135) ** 2;
}
