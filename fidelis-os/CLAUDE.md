# Fidelis OS

Thesis project by David Lee (Parsons Communication Design).
Fidelis is a fictional holding company whose actual product is belief.
Fidelis OS is the company running as live software: anyone states a desire, Fidelis manufactures a belief to meet it, sells it back to them, and adds it to the portfolio.

Tone: deadpan corporate. Never winks. The satire lives in how sincere it is.

## Three layers, one database

1. **Foundry (make)**: user states what they want to feel or believe. Claude generates a complete subsidiary: name, product, category, claim, packaging dieline, storefront copy, ad line, Trust Manual entry.
2. **Storefront (sell)**: every subsidiary is listed in a shared store. "Believe" is the buy button. Buying = believing.
3. **Holdings (hold)**: live portfolio of every subsidiary, ranked by believers, with deltas and status.

Go deep on Foundry. Storefront and Holdings are thinner views over the same data.

## Stack

- Next.js (App Router) + TypeScript
- Supabase (Postgres + Realtime) for shared data and live Holdings
- Anthropic API, model `claude-sonnet-5-5`, called only from server routes. Ask Claude for JSON only, validate with zod, retry once on parse failure
- Packaging dielines as parametric SVG (tuck-end box), export to PDF with svg2pdf.js + jsPDF. Geometry in `lib/dieline.ts` (reverse tuck end, true millimetres), drawing in `components/Dieline.tsx`. The PDF uses Helvetica because PDF viewers lack the web font
- Deploy target: Vercel
- Env: `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **v1 decision (David):** SQLite instead of Supabase. `@libsql/client` uses the local file `data/fidelis.db` in development and Turso (hosted SQLite) when `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set, as on Vercel (milestone 5 decision). Env for v1: `ANTHROPIC_API_KEY`, plus the two `TURSO_*` values when deployed; the Supabase vars above are not used. All data access goes through `lib/subsidiaries.ts` (async). Realtime in v1 means polling.

## Design rules (important)

Prototype styling uses the design system from David's portfolio (the `dxxidlee` repo, `src/styles/global.css` and `system.css`). David will redesign everything afterward. Build structure, not style.
- All colors, type, spacing in one tokens file (`/styles/tokens.css`). Five-value palette only: black, gray `#767676`, silver `#D9D9D9`, smoke `#F0F0F0`, white. No accent color.
- Typeface: Inter Tight 300 and 400 (`@fontsource/inter-tight`). 12px UI, 14px body, 18px light lines, light display headlines with the lead phrase in ink and the rest in gray.
- Components from the portfolio system: `.bar` (smoke strip), `.chip` (black action), `.seg` nav, `.kv` and `.rows` lists with silver rules, the 24-column `.g24` grid with 5px gap, intro (16 units text, 6 units side) and module (16 units media, 6 units info) layouts, fixed top header and bottom bar.
- Copy: sentence case, no em dashes.
- Brand marks (supplied by David): `public/fidelis-favicon.svg` (black mark, transparent) is both the favicon (`metadata.icons` in `app/layout.tsx`) and the top-left logo in the site and kiosk headers (`components/Logo.tsx`), set like the portfolio logo with no box. `public/fidelis-vw-logo.svg` (white wordmark) is kept but not used.
- No gradients, shadows, rounded corners, icon libraries, or decorative motion.
- Components small and semantic so they are easy to restyle.

## Data model

`subsidiaries`
- id, slug, created_at
- desire (raw user input), category (object | ritual | subscription | service | institution)
- company_name, product_name, tagline, claim
- format (e.g. "30 count", "8 fl oz", "monthly")
- active_ingredients (text[]), side_effects (text[])
- price_cents
- trust_devices (text[]: authority, proof, scarcity, belonging, purity, testimony, origin_myth, ritual)
- manual_entry (text: how this belief is manufactured, written as internal brand guidelines)
- packaging (jsonb: width, height, depth in mm, panel copy)
- believers (int, default 0)
- status (active | merged | acquired | discontinued)
- is_flagship (bool)
- listed_at (timestamp, null until "List in store"; added in milestone 2. The Store shows only listed subsidiaries; Holdings shows all)

`beliefs` (purchases): id, subsidiary_id, created_at

## Seed: flagship subsidiaries

- **Hearth**: a personalized candle that smells like your childhood home.
- **Neutral**: Wear no face, fear nothing.
- **Quiet**: earbuds that cancel other people's opinions.
- **Reservoir**: Bottled sleep. Take tonight's 8 hours now, store the rest for later.

Fill remaining fields in the same voice.

## Routes

- `/` landing: "Trust, manufactured." Entry points to the three layers.
- `/foundry` intake ("What do you need to believe?") → generating state → result: full subsidiary card, dieline preview, "Download dieline (PDF)", "List in store".
- `/store` grid of all active subsidiaries. `/store/[slug]` product page with Believe button.
- `/holdings` ranked table: name, category, believers, 24h delta, status, founded date. Realtime updates. Totals row: subsidiaries held, total believers.
- `/manual` the Trust Manual, compiled from every subsidiary's manual_entry, grouped by trust device.
- `/install/shelf` and `/install/holdings` fullscreen kiosk modes for the exhibition (no nav, auto-cycling, large type).

## Generation guardrails

- Never use real brand names, real companies, or real people.
- No real dosing or real medical instructions. Products are fictional.
- Reject hateful or harassing input with a deadpan corporate decline ("Fidelis does not manufacture this belief.").
- Rate limit Foundry per IP: `lib/rate-limit.ts`, 6 per 10 minutes by default, hashed addresses in `foundry_requests`, `FOUNDRY_RATE_LIMIT=0` disables.
- Input moderation before generation (`lib/foundry/moderate.ts`): a free local screen for links, emails, phone numbers and handles, then `claude-haiku-4-5` returns allow, decline, or care. Care (self-harm) shows the decline plus a 988 line instead of the bare corporate decline.

## Holdings logic (v1)

- Rank by believers.
- 24h delta from `beliefs` timestamps.
- Mark `discontinued` if zero new believers in 14 days (computed on read). The clock starts at the latest of: newest belief, listing date, founding date, so new subsidiaries get a full 14 days. Flagships are exempt (decision in milestone 4: their seeded history is relative to database creation). Computed status applies everywhere: Holdings shows it, the Store hides discontinued subsidiaries, and Believe refuses them. SQL lives in `lib/subsidiaries.ts`.
- Realtime in v1: the Holdings table polls `GET /api/holdings` every 5 seconds (`lib/realtime.ts`).
- Mergers and acquisitions: v2, not now.

## Milestones

1. Scaffold Next.js + Supabase, tokens file, schema, seed flagships, `/store` and `/store/[slug]` with working Believe button.
2. Foundry: intake, Claude generation route, zod validation, save to DB, result view.
3. Dieline: parametric SVG tuck-end box from packaging json, PDF export.
4. Holdings with Realtime, Trust Manual page.
5. Kiosk modes, rate limiting, input moderation, deploy to Vercel.

Stop after each milestone, summarize what changed, and wait for David before continuing.
