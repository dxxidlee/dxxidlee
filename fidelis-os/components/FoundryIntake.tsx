"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FoundryResponse } from "@/lib/foundry/schema";
import { pad } from "@/lib/pad";

// Shown one after another while the Foundry works. The last one holds.
const PROGRESS = [
  "Desire received.",
  "Assessing the market.",
  "Sourcing belief.",
  "Drafting the claim.",
  "Writing the Trust Manual.",
  "Measuring the packaging.",
  "Registering the subsidiary.",
];
const PROGRESS_INTERVAL_MS = 3000;

type State =
  | { kind: "idle" }
  | { kind: "generating" }
  | { kind: "declined"; message: string }
  | { kind: "error"; message: string };

export function FoundryIntake() {
  const router = useRouter();
  const [desire, setDesire] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [step, setStep] = useState(0);

  const generating = state.kind === "generating";

  useEffect(() => {
    if (!generating) return;
    setStep(0);
    const timer = setInterval(
      () => setStep((s) => Math.min(s + 1, PROGRESS.length - 1)),
      PROGRESS_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [generating]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "generating" });
    try {
      const res = await fetch("/api/foundry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desire }),
      });
      const data = (await res.json()) as FoundryResponse;
      if (data.status === "manufactured") {
        router.push(`/foundry/${data.slug}`);
        return; // Keep the generating state until the result page loads.
      }
      setState(
        data.status === "declined"
          ? { kind: "declined", message: data.message }
          : { kind: "error", message: data.message },
      );
    } catch {
      setState({ kind: "error", message: "The Foundry could not be reached." });
    }
  }

  return (
    <section className="g24 intro">
      <form id="foundry-form" className="i-text" onSubmit={submit}>
        <h1>
          <label className="nm" htmlFor="desire">
            What do you need to believe?
          </label>{" "}
          State a desire. Fidelis will manufacture the belief and found a company to sell it.
        </h1>
        <div className="intake">
          <textarea
            id="desire"
            name="desire"
            value={desire}
            onChange={(e) => setDesire(e.target.value)}
            minLength={3}
            maxLength={280}
            rows={3}
            required
            disabled={generating}
            placeholder="I want to feel..."
          />
          <p className="bar">
            <span className="dim">Stated in your own words</span>
            <span className="dim">{desire.length} / 280</span>
          </p>
        </div>
      </form>

      <aside className="i-side">
        <ol className="rows" aria-live="polite">
          {generating
            ? PROGRESS.slice(0, step + 1).map((line, i) => (
                <li key={line}>
                  <span>
                    <span className="no">{pad(i + 1)}</span>
                    {line}
                  </span>
                </li>
              ))
            : null}
          {state.kind === "declined" || state.kind === "error" ? (
            <li>
              <span>{state.message}</span>
            </li>
          ) : null}
        </ol>
        <button
          type="submit"
          form="foundry-form"
          className="chip go"
          disabled={generating || desire.trim().length < 3}
        >
          <span>{generating ? "Manufacturing" : "Manufacture"}</span>
          <span>+</span>
        </button>
      </aside>
    </section>
  );
}
