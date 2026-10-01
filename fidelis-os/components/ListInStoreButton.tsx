"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

type Props = {
  slug: string;
  listed: boolean;
};

export function ListInStoreButton({ slug, listed: initiallyListed }: Props) {
  const [listed, setListed] = useState(initiallyListed);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (listed) {
    return (
      <p>
        Listed. <Link href={`/store/${slug}`}>View in store</Link>
      </p>
    );
  }

  function list() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/subsidiaries/${encodeURIComponent(slug)}/list`, {
          method: "POST",
        });
        if (!res.ok) throw new Error(String(res.status));
        setListed(true);
      } catch {
        setError("This subsidiary could not be listed at this time.");
      }
    });
  }

  return (
    <div className="list-in-store">
      <button type="button" onClick={list} disabled={pending}>
        {pending ? "Listing" : "List in store"}
      </button>
      {error ? <p aria-live="polite">{error}</p> : null}
    </div>
  );
}
