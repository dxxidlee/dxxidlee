// Single-line PROTOCOL renderer, cut down from the construction sheet: one fixed look, no animation.
import DATA from './protocol-glyphs.json';

const MET = { cap: 750, x: 500, base: 0, desc: -250, over: 16 };
const S = {
  paper: '#000000', fillC: '#ffffff', outlineC: '#ffffff', ink: '#808080', guideC: '#a7a7a1', selC: '#333333',
  size: 100, tracking: -20, nodeSize: 5.5, lineW: 0.55, guideW: 0.45, grain: 30,
};
const W = 1000;

function prep(g) {
  const out = { w: g.w, contours: [], ons: [], offs: [] };
  for (const [closed, flat] of g.c) {
    let ns = [];
    for (let i = 0; i < flat.length; i += 3) ns.push({ x: flat[i], y: flat[i + 1], t: flat[i + 2] });
    if (!ns.length) continue;
    if (closed) {
      let k = -1;
      for (let i = ns.length - 1; i >= 0; i--) if (ns[i].t !== 0) { k = i; break; }
      if (k < 0) continue;
      ns = ns.slice(k + 1).concat(ns.slice(0, k + 1));
    }
    const start = closed ? ns[ns.length - 1] : ns[0];
    const body = closed ? ns : ns.slice(1);
    out.ons.push(start);
    const segs = [];
    let prev = start, pend = [];
    for (const n of body) {
      if (n.t === 0) { pend.push(n); continue; }
      if (!(closed && n === start)) out.ons.push(n);
      if (pend.length >= 2) {
        const c1 = pend[0], c2 = pend[pend.length - 1];
        segs.push({ p1: n, c1, c2 });
        out.offs.push({ x: c1.x, y: c1.y, a: prev }, { x: c2.x, y: c2.y, a: n });
      } else if (pend.length === 1) {
        const q = pend[0];
        segs.push({ p1: n,
          c1: { x: prev.x + 2 / 3 * (q.x - prev.x), y: prev.y + 2 / 3 * (q.y - prev.y) },
          c2: { x: n.x + 2 / 3 * (q.x - n.x), y: n.y + 2 / 3 * (q.y - n.y) } });
        out.offs.push({ x: q.x, y: q.y, a: prev });
      } else segs.push({ p1: n });
      pend = []; prev = n;
    }
    out.contours.push({ start, segs, closed: !!closed });
  }
  return out;
}

const byChar = new Map();
for (const g of Object.values(DATA)) if (g.u != null) byChar.set(String.fromCodePoint(g.u), prep(g));

// Straight quotes are not in the font, so typed ones become curly; anything else missing is dropped.
export function clean(text) {
  return Array.from(text.replace(/(^|[\s([{])'/g, '$1\u2018').replace(/'/g, '\u2019')
    .replace(/(^|[\s([{])"/g, '$1\u201C').replace(/"/g, '\u201D'))
    .filter((ch) => byChar.has(ch)).join('');
}

let grainTile = null;
function grain() {
  if (grainTile) return grainTile;
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), id = x.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) {
    let v = 255 - Math.random() * 38; if (Math.random() < 0.004) v -= 60;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
  }
  x.putImageData(id, 0, 0); grainTile = c; return c;
}

// Draws `text` across the whole canvas with characters a..b selected. Returns the caret
// geometry for index b as fractions of the canvas box.
export function draw(cv, text, a = text.length, b = a) {
  const x = cv.getContext('2d'), k = cv.width / W, H = W * cv.height / cv.width;
  const chars = Array.from(text), items = [], stops = [];
  let pen = 0;
  for (const ch of chars) {
    stops.push(pen);
    const g = byChar.get(ch);
    if (!g) continue;
    items.push({ g, pen });
    pen += g.w + S.tracking;
  }
  const adv = items.length ? pen - S.tracking : 0;
  stops.push(adv);

  const vMax = MET.cap + MET.over, vMin = MET.desc, m = 0.84;
  const s = Math.min(adv ? W * m / adv : Infinity, H * m / (vMax - vMin)) * S.size / 100;
  const uc = adv / 2, vc = (vMax + vMin) / 2;
  const T = (u, v) => [W / 2 + (u - uc) * s, H / 2 - (v - vc) * s];

  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  x.fillStyle = S.paper; x.fillRect(0, 0, cv.width, cv.height);
  x.setTransform(k, 0, 0, k, 0, 0);
  x.lineCap = 'butt'; x.lineJoin = 'round';

  const line = (x1, y1, x2, y2, c, w, a) => {
    x.globalAlpha = a; x.strokeStyle = c; x.lineWidth = w;
    x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
  };

  const vMaxY = T(0, vMax)[1], vMinY = T(0, vMin)[1];
  const stop = (i) => T(stops[Math.min(i, chars.length)], 0)[0];
  if (a !== b) {
    x.fillStyle = S.selC;
    x.fillRect(stop(Math.min(a, b)), vMaxY, stop(Math.max(a, b)) - stop(Math.min(a, b)), vMinY - vMaxY);
  }

  if (items.length) {
    for (const [v, o] of [[MET.cap, 0], [MET.x, 0], [MET.base, 0], [MET.desc, 0], [MET.cap + MET.over, 1], [MET.x + MET.over, 1], [MET.base - MET.over, 1]]) {
      const y = T(0, v)[1];
      line(0, y, W, y, S.guideC, S.guideW * (o ? 0.8 : 1), o ? 0.7 : 1);
    }
    const seen = new Set();
    for (const it of items) for (const u of [it.pen, it.pen + it.g.w]) {
      const key = Math.round(u * 10); if (seen.has(key)) continue; seen.add(key);
      const px = T(u, 0)[0];
      line(px, 0, px, H, S.guideC, S.guideW, 1);
    }
  }

  const path = (it) => {
    x.beginPath();
    for (const c of it.g.contours) {
      x.moveTo(...T(c.start.x + it.pen, c.start.y));
      for (const sg of c.segs) {
        const p = T(sg.p1.x + it.pen, sg.p1.y);
        if (sg.c1) x.bezierCurveTo(...T(sg.c1.x + it.pen, sg.c1.y), ...T(sg.c2.x + it.pen, sg.c2.y), ...p);
        else x.lineTo(...p);
      }
      if (c.closed) x.closePath();
    }
  };
  x.globalAlpha = 1; x.fillStyle = S.fillC;
  for (const it of items) { path(it); x.fill('nonzero'); }
  x.strokeStyle = S.outlineC; x.lineWidth = S.lineW * 0.8;
  for (const it of items) { path(it); x.stroke(); }

  const ns = S.nodeSize;
  for (const it of items) for (const o of it.g.offs) {
    const [ax, ay] = T(o.a.x + it.pen, o.a.y), [ox, oy] = T(o.x + it.pen, o.y);
    line(ax, ay, ox, oy, S.ink, S.lineW, 0.85);
    x.globalAlpha = 1; x.fillStyle = S.ink;
    x.beginPath(); x.arc(ox, oy, ns * 0.36, 0, Math.PI * 2); x.fill();
  }
  x.globalAlpha = 1; x.fillStyle = S.ink;
  for (const it of items) for (const n of it.g.ons) {
    const [px, py] = T(n.x + it.pen, n.y);
    x.fillRect(px - ns / 2, py - ns / 2, ns, ns);
  }

  x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalAlpha = S.grain / 100 * 0.55; x.globalCompositeOperation = 'multiply';
  const sc = Math.max(1, k * 0.9);
  x.scale(sc, sc); x.fillStyle = x.createPattern(grain(), 'repeat');
  x.fillRect(0, 0, cv.width / sc, cv.height / sc);
  x.restore();

  return { x: stop(b) / W, top: vMaxY / H, bottom: vMinY / H };
}
