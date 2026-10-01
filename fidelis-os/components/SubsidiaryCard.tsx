import Link from "next/link";
import { formatCount, formatLabel, formatPrice } from "@/lib/format";
import { pad } from "@/lib/pad";
import type { Subsidiary } from "@/lib/types";

/** One subsidiary in the Store grid, laid out like a portfolio module's info column. */
export function SubsidiaryCard({ subsidiary, n }: { subsidiary: Subsidiary; n: number }) {
  const href = `/store/${subsidiary.slug}`;
  return (
    <article className="card">
      <Link className="bar" href={href}>
        <span>
          <span className="no">{pad(n)}</span>
          {subsidiary.company_name}
        </span>
        <span>{formatPrice(subsidiary.price_cents)}</span>
      </Link>
      <p className="line">{subsidiary.tagline}</p>
      <dl className="kv">
        <div>
          <dt>Product</dt>
          <dd>{subsidiary.product_name}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{formatLabel(subsidiary.category)}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{subsidiary.format}</dd>
        </div>
        <div>
          <dt>Believers</dt>
          <dd>{formatCount(subsidiary.believers)}</dd>
        </div>
      </dl>
      <Link className="bar go" href={href}>
        <span>View product</span>
        <span>+</span>
      </Link>
    </article>
  );
}
