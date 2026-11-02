// ONE file drives the homepage and every project page.
//
// status: 'live'  -> always shown
//         'draft' -> shown in `npm run dev` and when PUBLIC_SHOW_DRAFTS=true (Vercel previews),
//                    hidden in the production build.
//
// [Bracketed text] is a placeholder: shown wherever drafts show, stripped (with the space before it)
// in production. Put punctuation that belongs to the placeholder inside the brackets.
//
// Media: { src: '/media/<slug>/file.mp4', label: 'what goes here' }
//   no src  -> renders a labeled placeholder of the right ratio
//   .mp4    -> muted autoplay loop (plays only while on screen)
//   other   -> image
//   page    -> false for a project with no case study: its tile and Expanded module link nowhere
//   cover2  -> optional second cover video; clicking the cover switches between the two
//   hero    -> optional sharper copy of the cover for the full-width case study top (2560 wide);
//              the small cover keeps the homepage light
//
// Block types for project pages:
//   { type: 'full',  ratio: 'l' (16:10) | 'w' (16:9) | 'p' (4:5), media }
//   { type: 'pair',  a: media (16:10), b: media (4:5) }   (flip: true puts the 4:5 on the left;
//                                                                   mobileFirst: 'b' shows the 4:5 first on phones)
//   { type: 'tester', text: 'protocol' }   (live PROTOCOL type, one line)
//   { type: 'clip',  title, body, media, side?, video? }  (16:9 video + side: a 4:5 image or loop next to it;
//                    sides alternate;
//                    video: { src, small? } the full film, played there with our own controls, media as the cover;
//                    small: a lighter file for phones; strip: 12 frames in a row, the seek bar)
//   { type: 'embed', url }  (YouTube or Vimeo iframe, for full-length video)
//   { type: 'text',  body: '...' }

const m = (label, src) => ({ label, src });

export const projects = [
  {
    slug: 'i-dentity',
    status: 'live',
    title: 'I+DENTITY',
    line: 'A 260-page archive, website, and campaign that treat identity as tradeable data.',
    tags: 'Book, website, campaign',
    year: '2026',
    role: 'Design, code, art direction',
    tools: '[Tools]',
    live: 'https://alter-net-idsq.vercel.app/',
    cover: m('AlterNet site film', '/media/i-dentity/AlterNet_site_film_16x10.mp4'),
    hero: m('AlterNet site film', '/media/i-dentity/AlterNet_site_film_16x10_hero.mp4'),
    portrait: m('4:5, book cover or spread'),
    intro: 'Framed as a forensic archive of breaches, synthetic personas, and data markets, I+DENTITY shows how identity systems reduce people to exploitable records, and the gap between lived experience and the data that stands in for it. [One more sentence: what you set out to make, or the key constraint.]',
    blocks: [
      { type: 'full', ratio: 'w', media: m('System overview 16:9: book, site, and campaign in one frame') },
      { type: 'pair', a: m('AlterNet feature loop', '/media/i-dentity/AlterNet_feature_loop_16x10.mp4'), b: m('AlterNet on desktop', '/media/i-dentity/AlterNet_mockup_desktop_4x5.mp4') },
      { type: 'full', ratio: 'l', media: m('I+DENTITY logo construction', '/media/i-dentity/IDENTITY_logo_construction_16x10_4K.mp4') },
      { type: 'pair', a: m('Campaign 16:10'), b: m('AlterNet on mobile', '/media/i-dentity/AlterNet_mockup_mobile_4x5.mp4') },
    ],
  },
  {
    // No case study (client work is under NDA): the tile links nowhere; clicking it switches between the logo film and a cut of the team's work.
    slug: 'mccann',
    status: 'live',
    page: false,
    title: 'McCANN New York',
    line: 'Campaigns, motion, and internal tools for Design at McCANN New York.',
    year: '2026',
    role: 'Design Intern, then Freelance Designer',
    cover: m('McCANN Truth Well Told', '/media/mccann/McCANN_TruthWellTold_16x10_1920x1200-hq.mp4'),
    cover2: m('McCANN New York design team work', '/media/mccann/McCANN_design_team_16x10.mp4'),
    intro: 'Design Intern from June to August 2026, Freelance Designer since, on client design and motion with the McCANN New York design team. Client work is under NDA; this is a selection, and more is available on request.',
  },
  {
    slug: 'greenwash',
    status: 'live',
    title: 'Greenwash',
    line: 'A publication, responsive site, and animated poster set in a New York where collapse is sold as progress.',
    tags: 'Book, website, motion',
    year: '2025',
    role: 'Design, code',
    tools: '[Tools]',
    live: 'https://gw-37.vercel.app/',
    cover: m('Greenwash film', '/media/greenwash/Greenwash_film_16x10.mp4'),
    hero: m('Greenwash film', '/media/greenwash/Greenwash_film_16x10_hero.mp4'),
    portrait: m('4:5, animated poster'),
    intro: 'A speculative near-future New York where environmental collapse is masked as progress through state-led green interventions. Greenwash shows how design and policy can make control look good and hide ecological loss. [One more sentence.]',
    blocks: [
      { type: 'full', ratio: 'l', media: m('Desktop + mobile synced recording 16:10') },
      { type: 'pair', a: m('Publication spreads 16:10'), b: m('Animated poster loop 4:5') },
    ],
  },
  {
    slug: 'tnnt-alive',
    status: 'live',
    title: 'TNNT Alive',
    line: '[One line: what TNNT Alive is and what it does.]',
    tags: '[Deliverables]',
    year: '[Year]',
    role: '[Role]',
    tools: '[Tools]',
    live: null,
    cover: m('16:10 loop'),
    portrait: m('4:5'),
    intro: '[Context: how TNNT Alive grows out of The New New Testament, a 152-page manifesto of ten rules built from found text and images.]',
    blocks: [
      { type: 'full', ratio: 'w', media: m('Overview 16:9') },
      { type: 'pair', a: m('Detail 16:10'), b: m('Detail 4:5') },
    ],
  },
  {
    slug: 'titles-gfx',
    status: 'live',
    title: 'Titles and GFX',
    line: 'Title cards, credits, and graphics for music videos for Khalid, MegaETH[, and Can\u2019t FW Us artist].',
    tags: 'Motion, typography',
    year: '2025 to 2026',
    role: 'GFX artist',
    tools: '[After Effects, etc.]',
    live: null,
    cover: m('Titles and GFX motion reel', '/media/title_gfx/motion-reel-hero-v3-hq.mp4'),
    coverRatio: 'w',
    portrait: m('4:5, credit frame'),
    intro: 'Title and graphics work for music videos, from single title cards to full credit sequences.',
    blocks: [
      { type: 'clip', title: 'Yin and Yang', body: 'Lyric video and billboard.',
        media: m('Yin and Yang lyric', '/media/title_gfx/01-yin-and-yang-lyric.mp4'),
        video: { src: '/media/title_gfx/01-yin-and-yang-1080.mp4', small: '/media/title_gfx/01-yin-and-yang-720.mp4', strip: '/media/title_gfx/01-yin-and-yang-strip.jpg' },
        side: m('Yin and Yang mobile', '/media/title_gfx/01-yin-and-yang-mobile.mp4') },
      { type: 'clip', title: 'Can\u2019t FW Us', body: '[Artist.] Music video. Shooting, editing, title card, and GFX.',
        media: m('Can\u2019t FW Us', '/media/title_gfx/03-jireh-cant-fw-us.mp4'),
        video: { src: '/media/title_gfx/03-cant-fw-us-1080.mp4', small: '/media/title_gfx/03-cant-fw-us-720.mp4', strip: '/media/title_gfx/03-cant-fw-us-strip.jpg' },
        side: m('Can\u2019t FW Us title card', '/media/title_gfx/03-cant-fw-us-poster.jpg') },
      { type: 'clip', title: 'Real Estate', body: 'Visualizer for Thomas Maggart.',
        media: m('Real Estate visualizer', '/media/title_gfx/04-real-estate.mp4'),
        video: { src: '/media/title_gfx/04-real-estate-1080.mp4', small: '/media/title_gfx/04-real-estate-720.mp4', strip: '/media/title_gfx/04-real-estate-strip.jpg' },
        side: m('Real Estate title card', '/media/title_gfx/04-real-estate-poster.jpg') },
      { type: 'clip', title: 'Fugue State', body: 'MegaETH. Music video by Oliver Shore and Kevin Puttkamer. GFX.',
        media: m('Fugue State GFX', '/media/title_gfx/05-fugue-state-gfx.mp4'),
        video: { src: '/media/title_gfx/05-fugue-state-1080.mp4', small: '/media/title_gfx/05-fugue-state-720.mp4', strip: '/media/title_gfx/05-fugue-state-strip.jpg' },
        side: m('Fugue State title card', '/media/title_gfx/05-fugue-state-poster.jpg') },
      { type: 'clip', title: 'Something Special', body: 'Khalid and Ahn Hyo-seop. Official music video. Title card and credits. [Director: name.]',
        media: m('Something Special type', '/media/title_gfx/06-something-special-type.mp4'),
        video: { src: '/media/title_gfx/06-something-special-1080.mp4', small: '/media/title_gfx/06-something-special-720.mp4', strip: '/media/title_gfx/06-something-special-strip.jpg' },
        side: m('Something Special title card', '/media/title_gfx/06-something-special-poster.jpg') },
    ],
  },
  {
    slug: 'protocol',
    status: 'live',
    title: 'PROTOCOL / XR',
    line: 'A display typeface written as a rulebook: 26 rules, A to Z.',
    tags: 'Typeface, specimen',
    year: '[Year]',
    role: 'Type design',
    tools: 'Glyphs',
    live: null,
    cover: m('PROTOCOL / XR reel', '/media/protocol/protocol-reel-16x9.mp4'),
    portrait: m('PROTOCOL / XR mockup', '/media/protocol/protocol_mockup.jpg'),
    intro: 'PROTOCOL grew out of XR, a circular-unit Didone built in Glyphs at Parsons School of Design. Each letter carries one rule of a dystopian bureaucratic rulebook, published as a type specimen.',
    blocks: [
      { type: 'pair', flip: true, a: m('PROTOCOL / XR full character set', '/media/protocol/glyphs.mp4'), b: m('PROTOCOL / XR mockup', '/media/protocol/protocol_mockup.jpg') },
      { type: 'pair', mobileFirst: 'b', a: m('PROTOCOL / XR example', '/media/protocol/protocol_example.svg'), b: m('PROTOCOL / XR specimen booklet scan', '/media/protocol/protocol-scan-black-new.jpg') },
      { type: 'tester', text: 'protocol' },
    ],
  },
  {
    slug: 'naked',
    status: 'live',
    title: 'Naked',
    line: 'A typing questionnaire that turns your pauses into letter spacing.',
    tags: 'Website, interaction',
    year: '[Year]',
    role: 'Design, code',
    tools: '[MediaPipe, MiDaS, JavaScript]',
    live: null,
    cover: m('16:10 loop: typing, spacing stretches'),
    portrait: m('4:5, face-mesh frame'),
    intro: 'Naked records the time between keystrokes and renders each pause as space between letters, so hesitation becomes visible. [One sentence on face tracking and depth.]',
    blocks: [
      { type: 'full', ratio: 'l', media: m('Interaction loop 16:10') },
      { type: 'pair', a: m('PRD excerpt 16:10'), b: m('Face-mesh detail 4:5') },
    ],
  },
];

export const inProgress = [
  { title: 'Aeternum', meta: 'Thesis, March 2027', line: 'A pharmaceutical brand selling a pill that tells you your afterlife.', image: m('Book photo 4:5') },
  { title: 'Cairn', meta: 'App, December 2026', line: 'An app for passing on your digital life.', image: null },
];

export const index = [
  { title: 'AIRNY', type: 'Website, live air quality data', year: '2025', href: 'https://dxxidlee.github.io/AIRNY/home/' },
  { title: '20X20', type: 'Interactive website', year: '2025', href: 'https://dxxidlee.github.io/20x20/home_page/' },
  { title: 'Real Estate', type: 'Visualizer for Thomas Maggart', year: '2025' },
  { title: 'EA$T$IDE E$$CO', type: 'Album cover for Kevin Wood$hack', year: '2026' },
  { title: 'Champagne Tears', type: 'Album cover for Daylan Gideon', year: '2025' },
  { title: 'Made by Hob', type: 'Website redesign for SAINTED', year: '2025' },
  { title: 'A Final Summer Sensation', type: 'Poster series for NXGN CBNT', year: '2025' },
  { title: 'Feel The Bass', type: 'Animation', year: '2026' },
  { title: 'PERFECT PIECE', type: 'Website', year: '2025' },
  { title: '0316', type: 'Zine', year: '2025' },
];

export const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';
// Production: drop every [placeholder] string, deep, so no bracket reaches the page.
const scrub = (v) => typeof v === 'string' ? v.replace(/\s*\[[^\]]*\]/g, '').trim()
  : Array.isArray(v) ? v.map(scrub)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scrub(x)]))
  : v;
export const visible = projects.filter((p) => p.status === 'live' || showDrafts).map((p) => (showDrafts ? p : scrub(p)));
