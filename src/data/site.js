// Everything sitewide lives here. Edit text, not components.
export const site = {
  name: '@dxxidlee',
  fullName: 'David (Seungmin) Lee',
  title: '@dxxidlee',
  description: 'Designer building identity systems, interfaces, and motion, from concept to code.',
  positioning: 'designer building identity systems, interfaces, and motion, from concept to code.',
  status: ['Freelance Designer, McCANN New York', 'BFA in Communication Design, Parsons School of Design'],
  wordmark: null,              // set to '/wordmark.svg' once you export it from Glyphs
  email: 'dxxidlee@gmail.com',
  resume: '/resume.pdf',       // drop your PDF at public/resume.pdf
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dxxidlee/' },
    { label: 'Instagram', href: 'https://www.instagram.com/dxxidlee/' },
  ],
  location: 'New York',
  // Source: resume. `note` shows on the info page only.
  experience: [
    { org: 'McCANN New York', role: 'Freelance Designer', dates: 'Aug 2026 to present',
      note: 'Continuing at McCANN New York to work on brand systems and build the tools behind them.' },
    { org: 'McCANN New York', role: 'Design Intern', dates: 'Jun to Aug 2026',
      note: 'Built and shipped an internal toolkit that sped up production across the design department, from a gradient generator to logo variation and After Effects automation, bringing AI into daily workflow. Designed for Ralph Lauren, Chick-fil-A, Lysol, State Street, and K-Y; art directed the agency\u2019s Summer Party.' },
    { org: 'Independent practice', role: 'Designer and Design Engineer', dates: 'Aug 2025 to present',
      note: 'Design and build for MegaETH, Khalid, Ahn Hyo-seop, and Made by Hob, spanning music video credit typesetting, campaign identity, and e-commerce sites.' },
    { org: 'Studio Betty Wang', role: 'Design Intern', dates: 'May to Sep 2025',
      note: 'Developed client-ready concepts through prototyping, visual research, and sketching for Midjourney, Aspen Art Museum, Arsham Studio, and Fig Mother.' },
    { org: 'Hard Sun', role: 'Design Intern', dates: 'Jun to Aug 2025',
      note: 'Built brand systems for a sunscreen brand through launch, contributing design research, brand-adjacent objects, and external work spanning book covers, billboards, and podcast visuals.' },
    { org: 'The Metropolitan Museum of Art', role: 'Intern, The Costume Institute', dates: 'Jun to Aug 2022',
      note: 'Designed exhibition labels for gallery installation, conserved garments using microscopy, and led exhibition-related design projects while managing the department\u2019s social media account.' },
  ],
  education: [
    { org: 'Parsons School of Design', role: 'BFA in Communication Design', dates: 'Aug 2023 to May 2027 (expected)',
      note: 'Dean\u2019s List' },
  ],
  skills: [
    { label: 'Design and prototyping', items: 'Figma, Illustrator, Photoshop, InDesign, After Effects, Premiere Pro, Glyphs, and TouchDesigner' },
    { label: 'Technical', items: 'HTML/CSS, JavaScript, React, Three.js, ExtendScript/JSX, Git' },
    { label: 'Languages', items: 'Korean and English, native proficiency' },
  ],
};
