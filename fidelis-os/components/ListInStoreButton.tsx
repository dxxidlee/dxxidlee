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
      <Link className="bar" href={`/store/${slug}`}>
        <span>Listed in store</span>
        <span>View +</span>
      </Link>
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
    <>
      <button type="button" className="chip" onClick={list} disabled={pending}>
        <span>{pending ? "Listing" : "List in store"}</span>
        <span>+</span>
      </button>
      {error ? (
        <p className="status" aria-live="polite">
          {error}
        </p>
      ) : null}
    </>
  );
}
