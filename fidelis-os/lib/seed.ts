import type Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { insertSubsidiary } from "./rows";
import type { NewSubsidiary } from "./types";

type Flagship = {
  subsidiary: NewSubsidiary;
  /** Believers acquired before records began. One belief row is written per believer. */
  believers: number;
  /** How long ago the subsidiary was founded. */
  founded_days_ago: number;
};

export const FLAGSHIPS: Flagship[] = [
  {
    believers: 412,
    founded_days_ago: 61,
    subsidiary: {
      is_flagship: true,
      desire: "I want to feel at home again.",
      category: "object",
      company_name: "Hearth",
      product_name: "Home Candle, Personalized",
      tagline: "It smells like you never left.",
      claim: "A personalized candle that smells like your childhood home.",
      format: "1 candle, 240 g",
      active_ingredients: [
        "Soy and coconut wax",
        "Personalized domestic accord",
        "Cedar (hallway)",
        "Line-dried laundry",
        "Trace warm dust",
      ],
      side_effects: [
        "Recollection of a specific doorway",
        "Urge to call a parent",
        "Mild dissatisfaction with current address",
        "Brief certainty that someone is cooking",
      ],
      price_cents: 6800,
      trust_devices: ["origin_myth", "purity", "ritual"],
      manual_entry:
        "Hearth does not sell a scent. It sells the assurance that the past is intact and can be retrieved on demand. Every unit is described as personalized. The intake questionnaire is the product: the customer supplies the memory, and the candle receives credit for it. Copy refers to \"your home,\" never \"a home.\" Keep the accord general. The less specific the scent, the more precisely it is recognized. The flame is a ritual device. Instruct the customer to light it at the same hour each evening. Repetition is what makes a house.",
      packaging: {
        width: 90,
        height: 110,
        depth: 90,
        panels: {
          front: "HEARTH\nHome Candle, Personalized\nIt smells like you never left.",
          back: "A personalized candle that smells like your childhood home.\nPoured for one address only.\nBurn within sight. Do not leave home unattended.",
          left: "Soy and coconut wax, personalized domestic accord, cedar (hallway), line-dried laundry, trace warm dust.",
          right: "1 candle, 240 g\nA Fidelis company.",
          top: "Light it. You're back.",
          bottom: "Lot 0001\nPoured to order.",
        },
      },
    },
  },
  {
    believers: 254,
    founded_days_ago: 54,
    subsidiary: {
      is_flagship: true,
      desire: "I want to stop being afraid of how people see me.",
      category: "object",
      company_name: "Neutral",
      product_name: "Neutral Face",
      tagline: "Wear no face, fear nothing.",
      claim:
        "A face with no expression, for use in public. Nothing is shown, so nothing can be read.",
      format: "1 face, one size",
      active_ingredients: [
        "Matte polymer shell",
        "Zero-expression finish",
        "Breathable anonymity layer",
      ],
      side_effects: [
        "Being mistaken for staff",
        "Reduced eye contact from strangers",
        "Loss of a preferred angle",
        "Calm",
      ],
      price_cents: 14000,
      trust_devices: ["purity", "belonging", "authority"],
      manual_entry:
        "Neutral is positioned as removal, not addition. The customer is not buying a mask. The customer is buying the absence of being read. Communication is quiet and unadorned, as the product is. Never show the product being worn. Show it on a plinth, or on no one. Fear is not named in customer-facing copy, except in the tagline, where it is promised away in full. The promise is total and is never qualified. Belonging is implied by uniformity: every unit is identical, and identical people do not stand out.",
      packaging: {
        width: 180,
        height: 240,
        depth: 70,
        panels: {
          front: "NEUTRAL\nNeutral Face\nWear no face, fear nothing.",
          back: "A face with no expression, for use in public.\nNothing is shown, so nothing can be read.\nOne size. Every unit is identical.",
          left: "Matte polymer shell, zero-expression finish, breathable anonymity layer.",
          right: "1 face, one size\nA Fidelis company.",
          top: "Open in private.",
          bottom: "Unit 000000\nNo two units differ.",
        },
      },
    },
  },
  {
    believers: 1088,
    founded_days_ago: 47,
    subsidiary: {
      is_flagship: true,
      desire: "I want to stop hearing what everyone thinks.",
      category: "object",
      company_name: "Quiet",
      product_name: "Opinion-Cancelling Earbuds",
      tagline: "Hear everything except what they think.",
      claim: "Earbuds that cancel other people's opinions.",
      format: "1 pair, charging case",
      active_ingredients: [
        "Adaptive opinion cancellation",
        "Consensus filter (on by default)",
        "Transparency mode, compliments only",
      ],
      side_effects: [
        "Agreement with self",
        "Shorter meetings",
        "Unanswered questions",
        "Increased confidence in prior positions",
      ],
      price_cents: 24900,
      trust_devices: ["authority", "proof", "scarcity"],
      manual_entry:
        "Quiet borrows the language of noise cancellation because the customer already trusts it. Opinions are described as an environmental condition, like traffic or wind, and never as coming from people. Cite proprietary measurement: \"up to 94.3% reduction in outside perspective.\" The figure is never rounded. Specificity reads as testing. Scarcity is introduced through limited colorways. The product cannot be shown to fail: any complaint about performance is itself an opinion and is cancelled.",
      packaging: {
        width: 80,
        height: 100,
        depth: 40,
        panels: {
          front: "QUIET\nOpinion-Cancelling Earbuds\nHear everything except what they think.",
          back: "Earbuds that cancel other people's opinions.\nUp to 94.3% reduction in outside perspective.\nTransparency mode passes compliments only.",
          left: "Adaptive opinion cancellation, consensus filter (on by default), transparency mode (compliments only).",
          right: "1 pair, charging case\nA Fidelis company.",
          top: "Put them in. Keep your position.",
          bottom: "Colorway: Bone\nLimited.",
        },
      },
    },
  },
  {
    believers: 736,
    founded_days_ago: 40,
    subsidiary: {
      is_flagship: true,
      desire: "I want to have enough sleep for once.",
      category: "subscription",
      company_name: "Reservoir",
      product_name: "Bottled Sleep",
      tagline: "Rest, banked.",
      claim:
        "Bottled sleep. Take tonight's 8 hours now, store the rest for later.",
      format: "30 nights, delivered monthly",
      active_ingredients: [
        "Stored sleep, harvested overnight",
        "Still water",
        "Dark (concentrate)",
      ],
      side_effects: [
        "Waking early with nowhere to be",
        "A sense of surplus",
        "Dreams arriving out of order",
        "Owing yourself time",
      ],
      price_cents: 3900,
      trust_devices: ["proof", "scarcity", "ritual", "testimony"],
      manual_entry:
        "Reservoir reframes sleep as an asset that can be saved, deferred, and spent. Customers do not lose sleep. They draw it down. All copy uses the vocabulary of accounts: balance, deposit, reserve, maturity. Testimony is sourced from customers who report feeling ahead. Their statements are not verified and do not need to be. Every bottle is sealed and dated, because a date makes a substance real. Monthly delivery establishes the ritual and keeps the reserve from ever feeling full.",
      packaging: {
        width: 70,
        height: 160,
        depth: 70,
        panels: {
          front: "RESERVOIR\nBottled Sleep\nRest, banked.",
          back: "Take tonight's 8 hours now, store the rest for later.\nKeep sealed until needed. Unused sleep is held in reserve.",
          left: "Stored sleep (harvested overnight), still water, dark (concentrate).",
          right: "30 nights, delivered monthly\nA Fidelis company.",
          top: "Sealed. Dated. Yours.",
          bottom: "Bottled on: see seal\nBest before: indefinitely",
        },
      },
    },
  },
];

// Small deterministic PRNG so every fresh database has the same history shape.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Seeds the flagships and their belief history, but only into an empty database. */
export function seedIfEmpty(db: Database.Database): void {
  const run = db.transaction(() => {
    const { n } = db.prepare("SELECT COUNT(*) AS n FROM subsidiaries").get() as {
      n: number;
    };
    if (n > 0) return;

    const now = Date.now();
    const random = mulberry32(1);
    const insertBelief = db.prepare(
      "INSERT INTO beliefs (id, subsidiary_id, created_at) VALUES (?, ?, ?)",
    );

    for (const flagship of FLAGSHIPS) {
      const founded = now - flagship.founded_days_ago * DAY_MS;
      const subsidiary = insertSubsidiary(db, flagship.subsidiary, {
        believers: flagship.believers,
        created_at: new Date(founded).toISOString(),
      });
      // Spread belief timestamps between founding and now, weighted toward recent.
      for (let i = 0; i < flagship.believers; i++) {
        const t = founded + Math.sqrt(random()) * (now - founded);
        insertBelief.run(randomUUID(), subsidiary.id, new Date(t).toISOString());
      }
    }
  });
  // IMMEDIATE takes the write lock up front, so parallel workers cannot both seed.
  run.immediate();
}
