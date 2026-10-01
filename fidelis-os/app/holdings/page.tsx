import type { Metadata } from "next";
import { HoldingsTable } from "@/components/HoldingsTable";
import { Intro } from "@/components/Intro";
import { POLL_INTERVAL_MS } from "@/lib/realtime";
import { DISCONTINUE_AFTER_DAYS, getHoldings } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Holdings" };

export default function HoldingsPage() {
  const report = getHoldings();

  return (
    <>
      <Intro
        title="Holdings."
        lead="Every subsidiary Fidelis holds, ranked by believers."
        side={
          <ul className="rows">
            <li>
              <span>Ranking</span>
              <span>By believers</span>
            </li>
            <li>
              <span>Updates</span>
              <span>Every {POLL_INTERVAL_MS / 1000} seconds</span>
            </li>
            <li>
              <span>Discontinued after</span>
              <span>{DISCONTINUE_AFTER_DAYS} days without a believer</span>
            </li>
          </ul>
        }
      />
      <section className="mod" aria-label="Portfolio">
        <HoldingsTable initial={report} />
      </section>
    </>
  );
}
