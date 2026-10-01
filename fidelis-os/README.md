# Fidelis OS

Trust, manufactured. See `CLAUDE.md` for the full brief.

## First time on a Mac

From this folder:

    bash scripts/setup.sh

This installs Homebrew and Node 22 if they are missing, installs dependencies,
creates `.env.local`, and builds the local database. Then paste your Anthropic
key into `.env.local` (needed from milestone 2 on).

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

Needs `ANTHROPIC_API_KEY` in `.env.local`. Restart `npm run dev` after editing it.

## Database (v1)

Local SQLite at `data/fidelis.db`. It is created and seeded with the four
flagships on first run. It is not committed.

    npm run db:reset   # wipe and reseed (stop `npm run dev` first)

- Schema: `lib/schema.ts`
- Types and validation (zod): `lib/types.ts`
- Flagship seed copy: `lib/seed.ts`
- Queries: `lib/subsidiaries.ts`, the only place pages touch data

Supabase replaces SQLite later by reimplementing `lib/subsidiaries.ts`.

## Where to restyle

The prototype borrows the dxxidlee.com portfolio system: five-value palette,
Inter Tight, bars, chips and the 24-column unit grid.

- `styles/tokens.css`: every color, typeface, size and space
- `styles/globals.css`: the portfolio's classes (`.bar`, `.chip`, `.seg`, `.kv`, `.g24`, intro and module layouts), using tokens only

## Dieline

- Geometry: `lib/dieline.ts`, a reverse tuck end box at true size in millimetres
- Drawing: `components/Dieline.tsx` (cut lines solid, folds dashed)
- PDF: `components/DownloadDielineButton.tsx` (jsPDF and svg2pdf.js, in the browser)
