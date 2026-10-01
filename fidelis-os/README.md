# Fidelis OS

Trust, manufactured. See `CLAUDE.md` for the full brief.

## First time on a Mac

From this folder:

    bash scripts/setup.sh

This installs Homebrew and Node 22 if they are missing, installs dependencies,
creates `.env.local`, and builds the local database. Then paste your Anthropic
key into `.env.local`.

## Run

    npm run dev        # http://localhost:3000

## Foundry

`/foundry` takes a desire, calls Claude (`claude-sonnet-5-5`) from
`app/api/foundry/route.ts`, validates the JSON with zod (one retry), saves the
subsidiary unlisted, and opens its record at `/foundry/[slug]`. "List in store"
puts it in `/store`.

- Prompt and house voice: `lib/foundry/prompt.ts` (the flagships are its examples)
- Output schema and limits: `lib/foundry/schema.ts`
- API call, retry, decline handling: `lib/foundry/generate.ts`
- Input moderation: `lib/foundry/moderate.ts`. Links, emails, phone numbers and
  handles are declined without an API call; then `claude-haiku-4-5` sorts each
  desire into allow, decline, or care (self-harm, which gets a 988 line)
- Rate limit: `lib/rate-limit.ts`, 6 requests per 10 minutes per address by
  default. Addresses are stored hashed. Set `FOUNDRY_RATE_LIMIT=0` to turn it
  off, for example on a gallery network where every visitor shares one address

Needs `ANTHROPIC_API_KEY` in `.env.local`. Restart `npm run dev` after editing it.

## Holdings and Trust Manual

- `/holdings`: every subsidiary ranked by believers, with 24h change and
  status. Polls `/api/holdings` every 5 seconds (`lib/realtime.ts`).
- `/manual`: every manual entry, filed under each trust device it uses.
  Device definitions are in `lib/trust-devices.ts`.

## Exhibition kiosks

- `/install/shelf`: one product at a time with its dieline, 12 seconds each
- `/install/holdings`: the portfolio in large type, live, paged 8 rows at a time

No navigation and no cursor. Click once to enter fullscreen; the screen is kept
awake where the browser allows it. For an unattended screen, launch Chrome in
kiosk mode: `open -a "Google Chrome" --args --kiosk https://YOUR-SITE/install/shelf`

## Database

SQLite through `@libsql/client`. Locally it is the file `data/fidelis.db`
(not committed). Deployed, `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` point it
at a Turso database. Same SQL either way. Tables are created and the four
flagships seeded automatically on first use.

    npm run db:init                   # create and seed if empty (safe)
    npm run db:reset                  # wipe the local file and reseed (stop `npm run dev` first)
    npm run db:reset -- --remote      # wipe the Turso database and reseed (asks for the flag on purpose)

- Schema: `lib/schema.ts`
- Types and validation (zod): `lib/types.ts`
- Flagship seed copy: `lib/seed.ts`
- Queries: `lib/subsidiaries.ts`, the only place pages touch data

## Deploy to Vercel

1. Turso: sign up at turso.tech, create a database, and copy its URL
   (`libsql://...`) and an auth token. With the CLI:
   `turso db create fidelis`, `turso db show fidelis --url`,
   `turso db tokens create fidelis`.
2. Vercel: Add New > Project > import `dxxidlee/dxxidlee`.
   Set Root Directory to `fidelis-os`. Framework: Next.js (auto).
3. Environment variables: `ANTHROPIC_API_KEY`, `TURSO_DATABASE_URL`,
   `TURSO_AUTH_TOKEN`. Optional: `FOUNDRY_RATE_LIMIT`, `FOUNDRY_RATE_WINDOW_MINUTES`.
4. Deploy. The first request creates the tables and seeds the flagships.
   To seed ahead of time instead, put the two `TURSO_*` values in `.env.local`
   and run `npm run db:init`.

Vercel builds the branch you push. Production comes from the production branch
(usually `main`); other branches get preview URLs. The Foundry route allows up to
120 seconds, within Vercel's limits on new projects.

## Where to restyle

The prototype borrows the dxxidlee.com portfolio system: five-value palette,
Inter Tight, bars, chips and the 24-column unit grid.

- `styles/tokens.css`: every color, typeface, size and space
- `styles/globals.css`: the portfolio's classes (`.bar`, `.chip`, `.seg`, `.kv`, `.g24`, intro and module layouts), using tokens only

## Dieline

- Geometry: `lib/dieline.ts`, a reverse tuck end box at true size in millimetres
- Drawing: `components/Dieline.tsx` (cut lines solid, folds dashed)
- PDF: `components/DownloadDielineButton.tsx` (jsPDF and svg2pdf.js, in the browser)
