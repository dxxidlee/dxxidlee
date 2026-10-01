"use client";

import { useEffect, useState } from "react";
import { formatCount, formatLabel } from "@/lib/format";
import { pad } from "@/lib/pad";
import {
  HOLDINGS_PAGE_INTERVAL_MS,
  HOLDINGS_PAGE_SIZE,
  POLL_INTERVAL_MS,
} from "@/lib/realtime";
import type { HoldingsReport } from "@/lib/types";

const signed = (n: number) => (n > 0 ? `+${formatCount(n)}` : formatCount(n));

/** The portfolio in large type. Live, and paged when it outgrows the screen. */
export function KioskHoldings({ initial }: { initial: HoldingsReport }) {
  const [report, setReport] = useState(initial);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/holdings", { cache: "no-store" });
        if (res.ok) setReport((await res.json()) as HoldingsReport);
      } catch {
        // Keep the last good numbers.
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const pages = Math.max(1, Math.ceil(report.holdings.length / HOLDINGS_PAGE_SIZE));

  useEffect(() => {
    if (pages < 2) return;
    const timer = setInterval(() => setPage((p) => (p + 1) % pages), HOLDINGS_PAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [pages]);

  const current = Math.min(page, pages - 1);
  const rows = report.holdings.slice(
    current * HOLDINGS_PAGE_SIZE,
    (current + 1) * HOLDINGS_PAGE_SIZE,
  );
  const { totals } = report;

  return (
    <>
      <header className="kiosk-top">
        <span>Fidelis OS</span>
        <span>Holdings</span>
        <span>{pages > 1 ? `Page ${current + 1} / ${pages}` : "Live"}</span>
      </header>

      <main className="kiosk-holdings">
        <table className="ledger kiosk-ledger">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Subsidiary</th>
              <th scope="col" className="num">
                Believers
              </th>
              <th scope="col" className="num">
                24h
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.slug} className={h.status === "active" ? undefined : "dim"}>
                <td>{pad(h.rank)}</td>
                <th scope="row">{h.company_name}</th>
                <td className="num">{formatCount(h.believers)}</td>
                <td className="num">{signed(h.delta_24h)}</td>
                <td>{formatLabel(h.status)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <th scope="row">{formatCount(totals.subsidiaries)} subsidiaries held</th>
              <td className="num">{formatCount(totals.believers)}</td>
              <td className="num">{signed(totals.delta_24h)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </main>

      <footer className="kiosk-bottom">
        <p className="chip">
          <span>Trust, manufactured.</span>
          <span>Holdings</span>
        </p>
        <p className="bar">
          <span>A Fidelis company</span>
          <span>Ranked by believers</span>
        </p>
      </footer>
    </>
  );
}
