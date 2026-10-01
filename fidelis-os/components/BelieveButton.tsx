"use client";

import { useState, useTransition } from "react";
import { formatBelievers } from "@/lib/format";

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
    <div className="believe">
      <button type="button" onClick={believe} disabled={pending}>
        {pending ? "Processing" : "Believe"}
      </button>
      <div aria-live="polite">
        <p className="believe__count">{formatBelievers(believers)}</p>
        {message ? <p className="believe__message">{message}</p> : null}
      </div>
    </div>
  );
}
