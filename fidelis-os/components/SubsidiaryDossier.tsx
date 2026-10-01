import { formatCount, formatDate, formatLabel as label, formatPrice } from "@/lib/format";
import type { Subsidiary } from "@/lib/types";

const PANELS = ["front", "back", "left", "right", "top", "bottom"] as const;

type Row = [string, React.ReactNode, string?];

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="bars">
      <h2 className="bar">
        <span>{title}</span>
      </h2>
      <dl className="kv">
        {rows.map(([k, v, cls]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd className={cls}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const list = (items: string[]) => (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

/**
 * A subsidiary's record as key and value rows.
 * `internal` adds what only Fidelis sees: the Trust Manual, packaging copy, and origin.
 */
export function SubsidiaryDossier({
  subsidiary: s,
  internal = false,
}: {
  subsidiary: Subsidiary;
  internal?: boolean;
}) {
  const { packaging: p } = s;

  return (
    <div className="bars">
      <Section
        title="Product"
        rows={[
          ["Product", s.product_name],
          ["Category", label(s.category)],
          ["Format", s.format],
          ["Price", formatPrice(s.price_cents)],
          ["Believers", formatCount(s.believers)],
          ...(internal ? ([["Status", label(s.status)]] as Row[]) : []),
        ]}
      />
      <Section
        title="Composition"
        rows={[
          ["Active ingredients", list(s.active_ingredients)],
          ["Side effects", list(s.side_effects)],
        ]}
      />
      {internal ? (
        <>
          <Section
            title="Trust Manual entry"
            rows={[
              ["Devices", list(s.trust_devices.map(label))],
              ["Method", s.manual_entry],
            ]}
          />
          <Section
            title="Packaging"
            rows={[
              ["Box", `Tuck end, ${p.width} × ${p.height} × ${p.depth} mm`],
              ...PANELS.map((panel): Row => [label(panel), p.panels[panel], "pre"]),
            ]}
          />
          <Section
            title="Origin"
            rows={[
              ["Desire", s.desire],
              ["Founded", formatDate(s.created_at)],
              ["Listed", s.listed_at ? formatDate(s.listed_at) : "Not listed"],
              ["Parent", "A Fidelis company"],
            ]}
          />
        </>
      ) : (
        <Section
          title="Company"
          rows={[
            ["Founded", formatDate(s.created_at)],
            ["Parent", "A Fidelis company"],
          ]}
        />
      )}
    </div>
  );
}
