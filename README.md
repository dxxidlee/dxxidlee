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
- `public/wordmark.svg`   "David Lee" set in XR/PROTOCOL, then set `wordmark: '/wordmark.svg'`
- `public/og.png`         1200x630 share image (then add `<meta property="og:image">` back in `src/layouts/Base.astro`)

## Swapping a placeholder for real media
In projects.js change
    cover: m('16:10 loop, site recording 8s'),
to
    cover: m('I+DENTITY website', '/media/i-dentity/cover.mp4'),
The label becomes the alt text.

## Draft vs live
- `status: 'draft'` shows in dev and on Vercel previews.
- Right now `.env.production` sets `PUBLIC_SHOW_DRAFTS=true`, so production shows drafts too.
- Flip a project to `status: 'live'` only when every placeholder on its page is replaced.
- Delete `.env.production` once the projects you want public are live.

## Deploy
Push to `build` for a preview URL (drafts visible). Merge `build` into `main` for production.

## Domain (do on launch day, not before)
1. Vercel > Project > Settings > Domains > add `dxxidlee.com` and `www.dxxidlee.com`.
2. At your domain registrar, set the DNS records Vercel shows you.
3. Only cancel Cargo after dxxidlee.com loads from Vercel.

## Export settings for loops
H.264 MP4, 1920x1200 (16:10) or 1200x1500 (4:5), 6 to 8 s, no audio, under 4 MB.
    ffmpeg -i in.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart out.mp4
