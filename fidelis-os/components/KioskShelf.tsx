"use client";

import { useEffect, useState } from "react";
import { Dieline } from "@/components/Dieline";
import { formatCount, formatPrice } from "@/lib/format";
import { pad } from "@/lib/pad";
import { SHELF_INTERVAL_MS } from "@/lib/realtime";
import type { Subsidiary } from "@/lib/types";

/** One product at a time, cycling through the store. The list refreshes on every step. */
export function KioskShelf({ initial }: { initial: Subsidiary[] }) {
  const [items, setItems] = useState(initial);
  const [slug, setSlug] = useState<string | null>(initial[0]?.slug ?? null);

  useEffect(() => {
    const timer = setInterval(async () => {
      let next = items;
      try {
        const res = await fetch("/api/shelf", { cache: "no-store" });
        if (res.ok) next = (await res.json()) as Subsidiary[];
      } catch {
        // Keep cycling through what we have.
      }
      setItems(next);
      const i = next.findIndex((s) => s.slug === slug);
      setSlug(next.length ? next[(i + 1) % next.length].slug : null);
    }, SHELF_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [items, slug]);

  const index = Math.max(0, items.findIndex((s) => s.slug === slug));
  const s = items[index];

  return (
    <>
      <header className="kiosk-top">
        <span>Fidelis OS</span>
        <span>Store</span>
        <span>{items.length ? `${pad(index + 1)} / ${pad(items.length)}` : ""}</span>
      </header>

      {s ? (
        <main className="kiosk-shelf" aria-live="polite">
          <div className="kiosk-copy">
            <p className="kiosk-display">
              <span className="nm">{s.company_name}.</span> {s.tagline}
            </p>
            <p className="kiosk-line">{s.claim}</p>
            <dl className="kv kiosk-kv">
              <div>
                <dt>Product</dt>
                <dd>{s.product_name}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{s.format}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>{formatPrice(s.price_cents)}</dd>
              </div>
              <div>
                <dt>Believers</dt>
                <dd>{formatCount(s.believers)}</dd>
              </div>
            </dl>
          </div>
          <figure className="kiosk-sheet">
            <Dieline subsidiary={s} id="kiosk-dieline" />
          </figure>
        </main>
      ) : (
        <main className="kiosk-shelf">
          <p className="kiosk-display">No beliefs are currently available.</p>
        </main>
      )}

      <footer className="kiosk-bottom">
        <p className="chip">
          <span>Trust, manufactured.</span>
          <span>Believe</span>
        </p>
        <p className="bar">
          <span>A Fidelis company</span>
        </p>
      </footer>
    </>
  );
}
