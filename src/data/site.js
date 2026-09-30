// Everything sitewide lives here. Edit text, not components.
export const site = {
  name: 'David Lee',
  title: 'David Lee, designer',
  description: 'Designer building identity systems, interfaces, and motion, from concept to code.',
  positioning: 'Designer building identity systems, interfaces, and motion, from concept to code.',
  status: ['Design Intern, McCann New York', 'Communication Design, Parsons, 2027', 'Available June 2027'],
  wordmark: null,              // set to '/wordmark.svg' once you export it from Glyphs
  email: 'dxxidlee@gmail.com',
  resume: '/resume.pdf',       // drop your PDF at public/resume.pdf
  links: [
    { label: 'LinkedIn', href: '[LINKEDIN URL]' },
    { label: 'Instagram', href: 'https://www.instagram.com/dxxidlee/' },
  ],
  location: 'New York',
  experience: [
    { org: 'McCann New York', role: 'Design Intern', dates: '[dates]' },
    { org: 'The Metropolitan Museum of Art, The Costume Institute', role: 'Intern', dates: '[dates]' },
    { org: 'Studio Betty Wang', role: 'Intern', dates: '[dates]' },
    { org: 'Hard Sun', role: 'Intern', dates: '[dates]' },
  ],
  education: [
    { org: 'Parsons School of Design', role: 'BFA Communication Design', dates: '2027' },
  ],
};
