"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCount, formatDate, formatLabel } from "@/lib/format";
import { pad } from "@/lib/pad";
import { POLL_INTERVAL_MS } from "@/lib/realtime";
import type { HoldingsReport } from "@/lib/types";


const signed = (n: number) => (n > 0 ? `+${formatCount(n)}` : formatCount(n));

export function HoldingsTable({ initial }: { initial: HoldingsReport }) {
  const [report, setReport] = useState(initial);

  useEffect(() => {
    let stopped = false;
    async function refresh() {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/holdings", { cache: "no-store" });
        if (res.ok && !stopped) setReport((await res.json()) as HoldingsReport);
      } catch {
        // Keep the last good numbers; the next poll will try again.
      }
    }
    const timer = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  const { holdings, totals } = report;

  return (
    <table className="ledger">
      <caption className="visually-hidden">
        Every Fidelis subsidiary, ranked by believers. Updates every {POLL_INTERVAL_MS / 1000}{" "}
        seconds.
      </caption>
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Subsidiary</th>
          <th scope="col" className="opt">
            Category
          </th>
          <th scope="col" className="num">
            Believers
          </th>
          <th scope="col" className="num">
            24h
          </th>
          <th scope="col">Status</th>
          <th scope="col" className="opt">
            Founded
          </th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((h) => (
          <tr key={h.slug} className={h.status === "active" ? undefined : "dim"}>
            <td>{pad(h.rank)}</td>
            <th scope="row">
              <Link href={`/foundry/${h.slug}`}>{h.company_name}</Link>
              {h.listed ? null : <span className="dim"> (unlisted)</span>}
            </th>
            <td className="opt">{formatLabel(h.category)}</td>
            <td className="num">{formatCount(h.believers)}</td>
            <td className="num">{signed(h.delta_24h)}</td>
            <td>{formatLabel(h.status)}</td>
            <td className="opt">
              <time dateTime={h.created_at}>{formatDate(h.created_at)}</time>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td />
          <th scope="row">{formatCount(totals.subsidiaries)} subsidiaries held</th>
          <td className="opt" />
          <td className="num">{formatCount(totals.believers)}</td>
          <td className="num">{signed(totals.delta_24h)}</td>
          <td />
          <td className="opt" />
        </tr>
      </tfoot>
    </table>
  );
}
