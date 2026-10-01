import { formatBelievers, formatDate, formatPrice } from "@/lib/format";
import type { Subsidiary } from "@/lib/types";

const PANELS = ["front", "back", "left", "right", "top", "bottom"] as const;

const deviceLabel = (device: string) => device.replace("_", " ");

/** The complete record of a subsidiary, as the Foundry produced it. */
export function SubsidiaryDossier({ subsidiary }: { subsidiary: Subsidiary }) {
  const { packaging } = subsidiary;

  return (
    <article className="dossier">
      <header className="dossier__header stack">
        <p className="label">
          {subsidiary.category}
          {subsidiary.is_flagship ? " / Flagship" : null}
        </p>
        <h1>{subsidiary.company_name}</h1>
        <p>{subsidiary.product_name}</p>
        <p>{subsidiary.tagline}</p>
        <p className="muted">{subsidiary.claim}</p>
      </header>

      <section className="dossier__section">
        <h2 className="label">Commercial</h2>
        <dl className="facts">
          <dt>Price</dt>
          <dd>{formatPrice(subsidiary.price_cents)}</dd>
          <dt>Format</dt>
          <dd>{subsidiary.format}</dd>
          <dt>Believers</dt>
          <dd>{formatBelievers(subsidiary.believers)}</dd>
          <dt>Status</dt>
          <dd>{subsidiary.status}</dd>
        </dl>
      </section>

      <section className="dossier__section">
        <h2 className="label">Composition</h2>
        <dl className="facts">
          <dt>Active ingredients</dt>
          <dd>
            <ul>
              {subsidiary.active_ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
          <dt>Side effects</dt>
          <dd>
            <ul>
              {subsidiary.side_effects.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </section>

      <section className="dossier__section">
        <h2 className="label">Trust Manual entry</h2>
        <dl className="facts">
          <dt>Trust devices</dt>
          <dd>
            <ul>
              {subsidiary.trust_devices.map((device) => (
                <li key={device}>{deviceLabel(device)}</li>
              ))}
            </ul>
          </dd>
          <dt>Method</dt>
          <dd className="dossier__manual">{subsidiary.manual_entry}</dd>
        </dl>
      </section>

      <section className="dossier__section">
        <h2 className="label">Packaging</h2>
        <dl className="facts">
          <dt>Box</dt>
          <dd>
            Tuck-end, {packaging.width} × {packaging.height} × {packaging.depth} mm (W × H × D)
          </dd>
          {PANELS.map((panel) => (
            <div key={panel} className="facts__row">
              <dt>{panel}</dt>
              <dd className="dossier__panel">{packaging.panels[panel]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="dossier__section">
        <h2 className="label">Origin</h2>
        <dl className="facts">
          <dt>Desire</dt>
          <dd>{subsidiary.desire}</dd>
          <dt>Founded</dt>
          <dd>
            <time dateTime={subsidiary.created_at}>{formatDate(subsidiary.created_at)}</time>
          </dd>
          <dt>Parent</dt>
          <dd>A Fidelis company.</dd>
        </dl>
      </section>
    </article>
  );
}
