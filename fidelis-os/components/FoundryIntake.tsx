"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FoundryResponse } from "@/lib/foundry/schema";

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
    <div className="foundry-intake">
      <form onSubmit={submit} className="foundry-intake__form">
        <h1>
          <label htmlFor="desire">What do you need to believe?</label>
        </h1>
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
        <div className="foundry-intake__actions">
          <button type="submit" disabled={generating || desire.trim().length < 3}>
            {generating ? "Manufacturing" : "Manufacture"}
          </button>
          <span className="muted">{desire.length} / 280</span>
        </div>
      </form>

      <div aria-live="polite" className="foundry-intake__status">
        {generating ? (
          <ol className="foundry-intake__progress">
            {PROGRESS.slice(0, step + 1).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        ) : null}
        {state.kind === "declined" ? <p>{state.message}</p> : null}
        {state.kind === "error" ? <p>{state.message}</p> : null}
      </div>
    </div>
  );
}
