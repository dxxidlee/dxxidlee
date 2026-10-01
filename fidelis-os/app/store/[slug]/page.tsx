import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BelieveButton } from "@/components/BelieveButton";
import { formatDate, formatPrice } from "@/lib/format";
import { getStoreSubsidiaryBySlug } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subsidiary = getStoreSubsidiaryBySlug((await params).slug);
  return { title: subsidiary ? subsidiary.company_name : "Not found" };
}

export default async function ProductPage({ params }: Props) {
  const subsidiary = getStoreSubsidiaryBySlug((await params).slug);
  if (!subsidiary) notFound();

  return (
    <article className="product">
      <div className="product__intro stack">
        <p className="label">
          {subsidiary.category}
          {subsidiary.is_flagship ? " / Flagship" : null}
        </p>
        <h1>{subsidiary.company_name}</h1>
        <p>{subsidiary.product_name}</p>
        <p>{subsidiary.tagline}</p>
        <p className="muted">{subsidiary.claim}</p>

        <div className="product__purchase">
          <p className="product__price">{formatPrice(subsidiary.price_cents)}</p>
          {subsidiary.status === "active" ? (
            <BelieveButton slug={subsidiary.slug} initialBelievers={subsidiary.believers} />
          ) : (
            <p>This belief is no longer available.</p>
          )}
        </div>
      </div>

      <dl className="product__facts">
        <dt>Format</dt>
        <dd>{subsidiary.format}</dd>

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

        <dt>Founded</dt>
        <dd>
          <time dateTime={subsidiary.created_at}>{formatDate(subsidiary.created_at)}</time>
        </dd>

        <dt>Parent</dt>
        <dd>A Fidelis company.</dd>
      </dl>
    </article>
  );
}
