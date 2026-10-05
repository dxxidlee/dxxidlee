// Shared helpers for the square unit grid and the lists derived from the project data.
import { visible, index } from '../data/projects.js';

export const pad = (n) => String(n).padStart(3, '0');
// 'Role, Place' -> ['Role', 'Place'] for a two-sided bar.
export const pair = (s) => { const k = s.indexOf(', '); return k < 0 ? [s, ''] : [s.slice(0, k), s.slice(k + 2)]; };

// Grid area on the 24-column square-unit grid: column, column span, row, row span.
// Every cell starts and ends on a unit line, so neighbouring edges always meet exactly.
export const A = (c, cs, r, rs) => `${r} / ${c} / span ${rs} / span ${cs}`;
const T = (c, r) => A(c, 3, r, 2);

// Project module layouts, cycled by project number. `tester` is the live type band, used only
// by projects with a tester block; it sits on the first free row under the module.
export const layouts = [
  { cover: A(1, 13, 1, 8), info: A(14, 6, 1, 8), port: A(20, 5, 3, 6), thumbs: [T(5, 9), T(8, 9), T(11, 9)], tester: A(1, 24, 11, 6) },
  { port: A(1, 5, 1, 6), info: A(6, 6, 3, 8), cover: A(12, 13, 3, 8), thumbs: [T(12, 11), T(15, 11), T(18, 11)], tester: A(1, 24, 13, 6) },
  { info: A(1, 6, 4, 8), cover: A(7, 18, 1, 11), thumbs: [T(16, 12), T(19, 12), T(22, 12)], port: A(7, 4, 12, 5), tester: A(1, 24, 17, 6) },
  { info: A(1, 6, 1, 8), port: A(7, 5, 1, 6), cover: A(12, 13, 1, 8), thumbs: [T(12, 9), T(15, 9), T(18, 9)], tester: A(1, 24, 11, 6) },
];

export const thumbs = (p) => p.blocks
  .flatMap((b) => (b.type === 'pair' ? [b.a, b.b] : b.media ? [b.media] : []))
  .slice(0, 3);
export const tester = (p) => p.blocks.find((b) => b.type === 'tester');
export const spec = (p) => [['Year', p.year], ['Role', p.role], ['Deliverables', p.tags], ['Tools', p.tools]];

const lastYear = (y) => Math.max(0, ...(String(y).match(/\d{4}/g) || []).map(Number));
export const rows = [
  ...visible.map((p) => ({ title: p.title, type: p.tags, year: p.year, role: p.role, href: `/work/${p.slug}`, label: 'Case study' })),
  ...index.map((r) => ({ title: r.title, type: r.type, year: r.year, role: '', href: r.href, label: r.href ? 'Visit' : '' })),
].sort((a, b) => lastYear(b.year) - lastYear(a.year));
