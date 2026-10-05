// ONE file drives the homepage and every project page.
//
// status: 'live'  -> always shown
//         'draft' -> shown in `npm run dev` and when PUBLIC_SHOW_DRAFTS=true (Vercel previews),
//                    hidden in the production build. This enforces "no gray box goes live".
//
// Media: { src: '/media/<slug>/file.mp4', label: 'what goes here' }
//   no src  -> renders a labeled placeholder of the right ratio
//   .mp4    -> muted autoplay loop (plays only while on screen)
//   other   -> image
//
// Block types for project pages:
//   { type: 'full',  ratio: 'l' (16:10) | 'w' (16:9) | 'p' (4:5), media, caption }
//   { type: 'pair',  a: media (16:10), b: media (4:5), caption }
//   { type: 'embed', url: 'https://www.youtube.com/embed/ID', caption }   (full-length videos)
//   { type: 'text',  body: '...' }

const m = (label, src) => ({ label, src });

export const projects = [
  {
    slug: 'i-dentity',
    status: 'draft',
    title: 'I+DENTITY',
    line: 'A 260-page archive, website, and campaign that treat identity as tradeable data.',
    tags: 'Book, website, campaign',
    year: '2026',
    role: 'Design, code, art direction',
    tools: '[Tools]',
    live: 'https://alter-net-idsq.vercel.app/',
    cover: m('16:10 loop, site recording 8s'),
    portrait: m('4:5, book cover or spread'),
    intro: 'Framed as a forensic archive of breaches, synthetic personas, and data markets, I+DENTITY shows how identity systems reduce people to exploitable records, and the gap between lived experience and the data that stands in for it. [One more sentence: what you set out to make, or the key constraint.]',
    blocks: [
      { type: 'full', ratio: 'w', media: m('System overview 16:9: book, site, and campaign in one frame'), caption: 'Book, website, and campaign built from one visual system.' },
      { type: 'pair', a: m('Book spreads 16:10'), b: m('Book detail 4:5'), caption: '[Caption: what these spreads show.]' },
      { type: 'full', ratio: 'l', media: m('Website detail loop 16:10'), caption: '[Caption: the key interaction.]' },
      { type: 'pair', a: m('Campaign 16:10'), b: m('Campaign poster 4:5'), caption: '[Caption.]' },
    ],
  },
  {
    slug: 'design-tools-at-mccann',
    status: 'draft',
    title: 'Design Tools at McCANN',
    line: 'Internal tools I design and code for the design team at McCANN New York.',
    tags: 'Desktop app, web tools, scripts',
    year: '2026',
    role: 'Design Intern, then Freelance Designer',
    tools: '[Tauri, JavaScript, ExtendScript]',
    live: null,
    cover: m('16:10 loop, RefStrip with dummy references'),
    portrait: m('4:5, tool UI detail'),
    intro: 'Design Intern from June to August 2026, Freelance Designer since. At McCANN I work on client design and motion, and build tools that speed up the team: a desktop reference board, a lockup generator, and After Effects scripts. Client work is under NDA and available on request.',
    blocks: [
      { type: 'full', ratio: 'l', media: m('RefStrip loop 16:10: board fills, palette extracts, card pops out'), caption: 'RefStrip, a desktop reference board with palette extraction and pop-out cards.' },
      { type: 'full', ratio: 'l', media: m('Lockup Tool loop 16:10, dummy wordmark'), caption: 'Lockup Tool: outlined SVG and PNG export with calibrated clear space.' },
      { type: 'full', ratio: 'l', media: m('AE text splitter loop 16:10'), caption: 'After Effects script that splits text into animatable layers while keeping formatting.' },
    ],
  },
  {
    slug: 'greenwash',
    status: 'draft',
    title: 'Greenwash',
    line: 'A publication, responsive site, and animated poster set in a New York where collapse is sold as progress.',
    tags: 'Book, website, motion',
    year: '2025',
    role: 'Design, code',
    tools: '[Tools]',
    live: 'https://gw-37.vercel.app/',
    cover: m('16:10 loop, desktop + mobile side by side'),
    portrait: m('4:5, animated poster'),
    intro: 'A speculative near-future New York where environmental collapse is masked as progress through state-led green interventions. Greenwash shows how design and policy can make control look good and hide ecological loss. [One more sentence.]',
    blocks: [
      { type: 'full', ratio: 'l', media: m('Desktop + mobile synced recording 16:10'), caption: 'Responsive site, designed and coded for desktop and mobile.' },
      { type: 'pair', a: m('Publication spreads 16:10'), b: m('Animated poster loop 4:5'), caption: '[Caption.]' },
    ],
  },
  {
    slug: 'tnnt-alive',
    status: 'draft',
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
      { type: 'full', ratio: 'w', media: m('Overview 16:9'), caption: '[Caption.]' },
      { type: 'pair', a: m('Detail 16:10'), b: m('Detail 4:5'), caption: '[Caption.]' },
    ],
  },
  {
    slug: 'titles-gfx',
    status: 'draft',
    title: 'Titles and GFX',
    line: 'Title cards, credits, and graphics for music videos for Khalid, MegaETH, and [Can\u2019t FW Us artist].',
    tags: 'Motion, typography',
    year: '2025 to 2026',
    role: 'GFX artist',
    tools: '[After Effects, etc.]',
    live: null,
    cover: m('16:10 loop, best title moment'),
    portrait: m('4:5, credit frame'),
    intro: 'Title and graphics work for music videos, from single title cards to full credit sequences.',
    blocks: [
      { type: 'text', body: 'Something Special, Khalid and Ahn Hyo-seop. Official music video. Title card and credits. Director: [name].' },
      { type: 'full', ratio: 'l', media: m('Something Special title moment 6s'), caption: '' },
      { type: 'text', body: 'Fugue State, MegaETH. Music video by Oliver Shore and Kevin Puttkamer. GFX.' },
      { type: 'full', ratio: 'l', media: m('Fugue State GFX moment 6s'), caption: '' },
      { type: 'text', body: 'Can\u2019t FW Us, [artist]. Music video. Shooting, editing, title card, and GFX.' },
      { type: 'full', ratio: 'l', media: m('Can\u2019t FW Us moment 6s'), caption: '' },
    ],
  },
  {
    slug: 'protocol',
    status: 'draft',
    title: 'PROTOCOL / XR',
    line: 'A display typeface written as a rulebook: 26 rules, A to Z.',
    tags: 'Typeface, specimen',
    year: '[Year]',
    role: 'Type design',
    tools: 'Glyphs',
    live: null,
    cover: m('PROTOCOL / XR glyph grid', '/media/protocol/cover.jpg'),
    portrait: m('4:5, specimen booklet photo'),
    intro: 'PROTOCOL grew out of XR, a circular-unit Didone built in Glyphs at Parsons School of Design. Each letter carries one rule of a dystopian bureaucratic rulebook, published as a type specimen.',
    blocks: [
      { type: 'full', ratio: 'l', media: m('PROTOCOL / XR full character set', '/media/protocol/glyphs.mp4'), caption: 'Full character set.' },
      { type: 'pair', a: m('A to Z rules spread 16:10'), b: m('Specimen booklet 4:5'), caption: '[Caption.]' },
      { type: 'full', ratio: 'l', media: m('Type in use 16:10'), caption: '[Caption.]' },
    ],
  },
  {
    slug: 'naked',
    status: 'draft',
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
      { type: 'full', ratio: 'l', media: m('Interaction loop 16:10'), caption: '[Caption.]' },
      { type: 'pair', a: m('PRD excerpt 16:10'), b: m('Face-mesh detail 4:5'), caption: 'Written as a product requirements doc before building.' },
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
export const visible = projects.filter((p) => p.status === 'live' || showDrafts);
