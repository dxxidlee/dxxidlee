# dxxidlee.com

Astro static site, deployed on Vercel. One data file drives every page.

## Run locally
    npm install
    npm run dev          # http://localhost:4321  (drafts visible)

## Where to edit
- `src/data/site.js`      name, positioning, status lines, links, resume, wordmark
- `src/data/projects.js`  every project, its copy, media, and page blocks
- `public/media/<slug>/`  your loops and images (keep each MP4 under 4 MB)
- `public/resume.pdf`     resume
- `public/og.png`         1200x630 share image (then add `<meta property="og:image">` back in `src/layouts/Base.astro`)

## Swapping a placeholder for real media
In projects.js change
    cover: m('16:10 loop, site recording 8s'),
to
    cover: m('I+DENTITY website', '/media/i-dentity/cover.mp4'),
The label becomes the alt text.

## Draft vs live
- `status: 'live'` shows everywhere. `status: 'draft'` shows in dev and on Vercel previews, never on production.
- `[Bracketed text]` is a placeholder. It shows in dev and previews and is stripped on production.
  Put punctuation that belongs to it inside the brackets: `MegaETH[, and Artist].`
- Media with no file still shows as a grey labeled box on production, so add files before going live.
- Previews show drafts because Vercel > dxxidlee > Settings > Environment Variables has
  `PUBLIC_SHOW_DRAFTS = true` scoped to **Preview** only.
- The homepage Grid mosaic is laid out for exactly 5 projects (`mosaic` in `src/pages/index.astro`).
  Any other count falls back to equal tiles until you add slots for it.

## Deploy
Push to `build` for a preview URL (drafts visible). Merge `build` into `main` for production.

## Domain (do on launch day, not before)
1. Vercel > Project > Settings > Domains > add `dxxidlee.com` and `www.dxxidlee.com`.
2. At your domain registrar, set the DNS records Vercel shows you.
3. Only cancel Cargo after dxxidlee.com loads from Vercel.

## Export settings for loops
H.264 MP4, 1920x1200 (16:10) or 1200x1500 (4:5), 6 to 8 s, no audio, under 4 MB.
If a loop is still over 4 MB, raise `-crf` to 28. Longer reels can go higher but stay under ~10 MB.
    ffmpeg -i in.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart out.mp4
