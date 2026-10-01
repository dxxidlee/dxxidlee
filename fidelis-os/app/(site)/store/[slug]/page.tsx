import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BelieveButton } from "@/components/BelieveButton";
import { Dieline } from "@/components/Dieline";
import { Intro } from "@/components/Intro";
import { SubsidiaryDossier } from "@/components/SubsidiaryDossier";
import { formatPrice } from "@/lib/format";
import { getStoreSubsidiaryBySlug } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subsidiary = await getStoreSubsidiaryBySlug((await params).slug);
  return { title: subsidiary ? subsidiary.company_name : "Not found" };
}

export default async function ProductPage({ params }: Props) {
  const subsidiary = await getStoreSubsidiaryBySlug((await params).slug);
  if (!subsidiary) notFound();

  return (
    <>
      <Intro
        title={`${subsidiary.company_name}.`}
        lead={subsidiary.tagline}
        side={
          <>
            <p className="bar">
              <span>{subsidiary.product_name}</span>
              <span>{formatPrice(subsidiary.price_cents)}</span>
            </p>
            {subsidiary.status === "active" ? (
              <BelieveButton slug={subsidiary.slug} initialBelievers={subsidiary.believers} />
            ) : (
              <p className="status">This belief is no longer available.</p>
            )}
          </>
        }
      >
        <p className="line">{subsidiary.claim}</p>
      </Intro>

      <section className="g24 mod">
        <figure className="m-media sheet">
          <Dieline subsidiary={subsidiary} id="dieline" />
        </figure>
        <div className="m-info">
          <SubsidiaryDossier subsidiary={subsidiary} />
        </div>
      </section>
    </>
  );
}
