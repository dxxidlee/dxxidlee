import { buildDieline, wrapText, type PanelName, type Rect } from "@/lib/dieline";
import type { Subsidiary } from "@/lib/types";

// SVG attributes cannot read CSS variables once exported to PDF, so the two
// colors are repeated here. Keep them in step with --ink and --mute in tokens.css.
const INK = "#000000";
const MUTE = "#767676";
const FONT = "Inter Tight, Helvetica, Arial, sans-serif";
const STROKE = 0.35;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const r2 = (n: number) => Math.round(n * 100) / 100;

function Face({
  id,
  name,
  face,
  text,
}: {
  id: string;
  name: PanelName;
  face: Rect & { rotate?: boolean };
  text: string;
}) {
  const pad = clamp(Math.min(face.w, face.h) * 0.08, 2, 6);
  const size = clamp(Math.min(face.w, face.h) / 12, 1.8, 4.2);
  const innerW = face.w - pad * 2;

  // The first line of the front panel is the company name, set larger.
  const [first = "", ...rest] = text.split("\n");
  const lead =
    name === "front"
      ? Math.min(size * 2, innerW / Math.max(first.length * 0.62, 1))
      : size;
  const lines = [
    ...wrapText(first, innerW, lead).map((value) => ({ value, size: lead })),
    ...wrapText(rest.join("\n"), innerW, size).map((value) => ({ value, size })),
  ].filter((l) => l.value);

  let y = face.y + pad;
  const placed = lines.map((l) => {
    y += l.size * 1.2;
    return { ...l, y };
  });

  const cx = face.x + face.w / 2;
  const cy = face.y + face.h / 2;
  const clipId = `${id}-clip-${name}`;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x={face.x} y={face.y} width={face.w} height={face.h} />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${clipId})`}
        transform={face.rotate ? `rotate(180 ${r2(cx)} ${r2(cy)})` : undefined}
      >
        {placed.map((l, i) => (
          <text key={i} x={r2(face.x + pad)} y={r2(l.y)} fontSize={r2(l.size)} fill={INK}>
            {l.value}
          </text>
        ))}
      </g>
    </>
  );
}

/** Flat dieline for a subsidiary's tuck-end box, drawn at true size in millimetres. */
export function Dieline({ subsidiary, id }: { subsidiary: Subsidiary; id: string }) {
  const { packaging } = subsidiary;
  const d = buildDieline(packaging);
  const { W, H, D, flatW, flatH } = d.dims;
  const x = d.margin;
  const y = d.captionY;

  return (
    <svg
      id={id}
      className="dieline"
      xmlns="http://www.w3.org/2000/svg"
      width={`${d.width}mm`}
      height={`${d.height}mm`}
      viewBox={`0 0 ${d.width} ${d.height}`}
      fontFamily={FONT}
      role="img"
      aria-label={`Dieline for ${subsidiary.company_name}, ${W} by ${H} by ${D} millimetres`}
    >
      <rect x={0} y={0} width={d.width} height={d.height} fill="#FFFFFF" />

      {(Object.keys(d.faces) as PanelName[]).map((name) => (
        <Face key={name} id={id} name={name} face={d.faces[name]} text={packaging.panels[name]} />
      ))}

      <g fill="none" stroke={MUTE} strokeWidth={STROKE} strokeDasharray="2 1.5">
        {d.folds.map((path, i) => (
          <path key={i} d={path} />
        ))}
      </g>
      <g fill="none" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round">
        {d.cuts.map((path, i) => (
          <path key={i} d={path} />
        ))}
      </g>

      <g fontSize={3}>
        <text x={x} y={y + 3} fill={INK}>
          {`${subsidiary.company_name}, ${subsidiary.product_name}`}
        </text>
        <text x={x} y={y + 7.5} fill={MUTE}>
          {`Reverse tuck end. ${W} × ${H} × ${D} mm (W × H × D). Flat ${flatW} × ${flatH} mm.`}
        </text>
        <line x1={x} y1={y + 11} x2={x + 8} y2={y + 11} stroke={INK} strokeWidth={STROKE} />
        <text x={x + 10} y={y + 12} fill={MUTE}>
          Cut
        </text>
        <line
          x1={x + 20}
          y1={y + 11}
          x2={x + 28}
          y2={y + 11}
          stroke={MUTE}
          strokeWidth={STROKE}
          strokeDasharray="2 1.5"
        />
        <text x={x + 30} y={y + 12} fill={MUTE}>
          Fold
        </text>
      </g>
    </svg>
  );
}
