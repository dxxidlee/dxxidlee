import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "@/components/Intro";
import { formatLabel } from "@/lib/format";
import { pad } from "@/lib/pad";
import { listAllSubsidiaries } from "@/lib/subsidiaries";
import { TRUST_DEVICE_DEFINITIONS } from "@/lib/trust-devices";
import { TRUST_DEVICES } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Trust Manual" };

/** Every subsidiary's manual entry, filed under each trust device it uses. */
export default function TrustManualPage() {
  const subsidiaries = listAllSubsidiaries();
  const chapters = TRUST_DEVICES.map((device) => ({
    device,
    entries: subsidiaries.filter((s) => s.trust_devices.includes(device)),
  }));

  return (
    <>
      <Intro
        title="Trust Manual."
        lead="How Fidelis manufactures belief, compiled from every subsidiary. For internal use."
        side={
          <nav aria-label="Trust devices">
            <ol className="rows">
              {chapters.map(({ device, entries }, i) => (
                <li key={device}>
                  <a href={`#${device}`}>
                    <span className="no">{pad(i + 1)}</span>
                    {formatLabel(device)}
                  </a>
                  <span className="dim">{entries.length}</span>
                </li>
              ))}
            </ol>
          </nav>
        }
      />

      {chapters.map(({ device, entries }, i) => (
        <section key={device} id={device} className="g24 mod chapter">
          <header className="col-left">
            <h2 className="bar">
              <span>
                <span className="no">{pad(i + 1)}</span>
                {formatLabel(device)}
              </span>
              <span>{entries.length}</span>
            </h2>
            <p className="line">{TRUST_DEVICE_DEFINITIONS[device]}</p>
          </header>
          <div className="col-right bars">
            {entries.length === 0 ? (
              <p className="status dim">No subsidiary currently relies on this device.</p>
            ) : (
              entries.map((s) => (
                <article key={s.id} className="entry">
                  <Link className="bar" href={`/foundry/${s.slug}`}>
                    <span>{s.company_name}</span>
                    <span className="dim">{formatLabel(s.category)}</span>
                  </Link>
                  <p className="entry__body">{s.manual_entry}</p>
                </article>
              ))
            )}
          </div>
        </section>
      ))}
    </>
  );
}
