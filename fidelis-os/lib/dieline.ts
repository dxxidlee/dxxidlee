// Parametric reverse tuck end box, laid out flat. All units are millimetres.
//
//              [top tuck]
//              [top closure]
//   [dust]          |           [dust]
// [glue][left][front][right][back]
//   [dust]   |                  [dust]
//        [bottom closure]
//        [bottom tuck]
//
// The top closure hinges from the back, the bottom closure from the front.
// Pure geometry: no React, so it can also feed a server-side SVG later.
import type { Packaging } from "./types";

export type Rect = { x: number; y: number; w: number; h: number };

export type PanelName = keyof Packaging["panels"];

export type Dieline = {
  width: number;
  height: number;
  margin: number;
  /** Solid lines: cut through. SVG path data. */
  cuts: string[];
  /** Dashed lines: fold. SVG path data. */
  folds: string[];
  /** Printable faces, keyed by the panel copy they carry. */
  faces: Record<PanelName, Rect & { rotate?: boolean }>;
  /** Where the caption block starts. */
  captionY: number;
  dims: {
    W: number;
    H: number;
    D: number;
    glue: number;
    tuck: number;
    dust: number;
    /** Size of the cut piece, without margins or caption. */
    flatW: number;
    flatH: number;
  };
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const r2 = (n: number) => Math.round(n * 100) / 100;

const line = (x1: number, y1: number, x2: number, y2: number) =>
  `M${r2(x1)} ${r2(y1)}L${r2(x2)} ${r2(y2)}`;

const poly = (points: [number, number][]) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${r2(x)} ${r2(y)}`).join("");

/** A tuck flap of width `w` hinged on y = `hinge`, extending `t` in direction `dir` (-1 up, 1 down). */
function tuckFlap(x: number, w: number, hinge: number, t: number, dir: -1 | 1) {
  const r = Math.min(t * 0.8, w / 4);
  const far = hinge + dir * t;
  const bend = far - dir * r;
  return (
    `M${r2(x)} ${r2(hinge)}L${r2(x)} ${r2(bend)}` +
    `Q${r2(x)} ${r2(far)} ${r2(x + r)} ${r2(far)}` +
    `L${r2(x + w - r)} ${r2(far)}` +
    `Q${r2(x + w)} ${r2(far)} ${r2(x + w)} ${r2(bend)}` +
    `L${r2(x + w)} ${r2(hinge)}`
  );
}

/** A chamfered dust flap on the edge [a, b] at y = `hinge`. */
function dustFlap(a: number, b: number, hinge: number, h: number, dir: -1 | 1) {
  const c = Math.min((b - a) * 0.3, h * 0.5);
  const far = hinge + dir * h;
  return poly([
    [a, hinge],
    [a, far - dir * c],
    [a + c, far],
    [b - c, far],
    [b, far - dir * c],
    [b, hinge],
  ]);
}

export function buildDieline({ width: W, height: H, depth: D }: Packaging): Dieline {
  const margin = 10;
  const glue = clamp(Math.min(W, D) * 0.4, 8, 15);
  const tuck = clamp(D * 0.6, 8, 18);
  const dust = Math.min(W * 0.45, Math.max(D * 0.8, 8));
  const extent = Math.max(D + tuck, dust); // height of the top and bottom regions
  const captionHeight = 16;

  // Columns
  const x0 = margin;
  const xL = x0 + glue; // left side
  const xF = xL + D; // front
  const xR = xF + W; // right side
  const xB = xR + D; // back
  const xE = xB + W; // far edge

  // Rows
  const y0 = margin + extent; // body top
  const y1 = y0 + H; // body bottom

  const cuts = [
    // Glue flap, tapered top and bottom
    poly([
      [xL, y0],
      [x0, y0 + glue * 0.6],
      [x0, y1 - glue * 0.6],
      [xL, y1],
    ]),
    // Free body edges
    line(xF, y0, xR, y0), // front top
    line(xB, y1, xE, y1), // back bottom
    line(xE, y0, xE, y1), // back far edge
    // Top closure sides and tuck
    line(xB, y0, xB, y0 - D),
    line(xE, y0, xE, y0 - D),
    tuckFlap(xB, W, y0 - D, tuck, -1),
    // Bottom closure sides and tuck
    line(xF, y1, xF, y1 + D),
    line(xR, y1, xR, y1 + D),
    tuckFlap(xF, W, y1 + D, tuck, 1),
    // Dust flaps on both side panels, top and bottom
    dustFlap(xL, xF, y0, dust, -1),
    dustFlap(xR, xB, y0, dust, -1),
    dustFlap(xL, xF, y1, dust, 1),
    dustFlap(xR, xB, y1, dust, 1),
  ];

  const folds = [
    // Body
    line(xL, y0, xL, y1),
    line(xF, y0, xF, y1),
    line(xR, y0, xR, y1),
    line(xB, y0, xB, y1),
    // Dust flap hinges
    line(xL, y0, xF, y0),
    line(xR, y0, xB, y0),
    line(xL, y1, xF, y1),
    line(xR, y1, xB, y1),
    // Closure hinges
    line(xB, y0, xE, y0),
    line(xF, y1, xR, y1),
    // Tuck hinges
    line(xB, y0 - D, xE, y0 - D),
    line(xF, y1 + D, xR, y1 + D),
  ];

  return {
    width: r2(xE + margin),
    height: r2(y1 + extent + margin + captionHeight),
    margin,
    cuts,
    folds,
    faces: {
      front: { x: xF, y: y0, w: W, h: H },
      back: { x: xB, y: y0, w: W, h: H },
      left: { x: xL, y: y0, w: D, h: H },
      right: { x: xR, y: y0, w: D, h: H },
      // Read from the front once folded, so the top face is set upside down.
      top: { x: xB, y: y0 - D, w: W, h: D, rotate: true },
      bottom: { x: xF, y: y1, w: W, h: D },
    },
    captionY: y1 + extent + margin,
    dims: {
      W,
      H,
      D,
      glue: r2(glue),
      tuck: r2(tuck),
      dust: r2(dust),
      flatW: r2(xE - x0),
      flatH: r2(H + extent * 2),
    },
  };
}

/** Greedy word wrap using an average glyph width. Good enough for panel copy. */
export function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const maxChars = Math.max(4, Math.floor(maxWidth / (fontSize * 0.52)));
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let current = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      if (!current) current = word;
      else if (current.length + 1 + word.length <= maxChars) current += ` ${word}`;
      else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }
  return lines;
}
