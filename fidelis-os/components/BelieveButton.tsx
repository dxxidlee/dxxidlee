"use client";

import { useState, useTransition } from "react";
import { formatBelievers, formatCount } from "@/lib/format";

type Props = {
  slug: string;
  initialBelievers: number;
};

/** The buy button. Buying is believing. */
export function BelieveButton({ slug, initialBelievers }: Props) {
  const [believers, setBelievers] = useState(initialBelievers);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function believe() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/subsidiaries/${encodeURIComponent(slug)}/believe`, {
          method: "POST",
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { believers: number };
        setBelievers(data.believers);
        setMessage("Belief acquired.");
      } catch {
        setMessage("Your belief could not be processed at this time.");
      }
    });
  }

  return (
    <div className="bars">
      <button type="button" className="chip" onClick={believe} disabled={pending}>
        <span>{pending ? "Processing" : "Believe"}</span>
        <span className="believe-count">{formatCount(believers)}</span>
      </button>
      <p className="status dim" aria-live="polite">
        {message ?? formatBelievers(believers)}
      </p>
    </div>
  );
}
