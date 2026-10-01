import Link from "next/link";
import { formatBelievers, formatPrice } from "@/lib/format";
import type { Subsidiary } from "@/lib/types";

export function SubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  return (
    <article className="subsidiary-card">
      <Link href={`/store/${subsidiary.slug}`}>
        <p className="label">
          {subsidiary.category}
          {subsidiary.is_flagship ? " / Flagship" : null}
        </p>
        <h2>{subsidiary.company_name}</h2>
        <p>{subsidiary.product_name}</p>
        <p className="muted">{subsidiary.tagline}</p>
        <p className="subsidiary-card__meta">
          <span>{formatPrice(subsidiary.price_cents)}</span>
          <span>{formatBelievers(subsidiary.believers)}</span>
        </p>
      </Link>
    </article>
  );
}
