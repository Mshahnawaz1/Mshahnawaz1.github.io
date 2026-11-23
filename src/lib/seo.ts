export const SITE = 'https://mshahnawaz.me';

export const sameAs = [
  'https://github.com/Mshahnawaz1',
  'https://linkedin.com/in/Mshahnawaz1',
  'https://x.com/Mshahnawaz0',
];

const personRef = { '@id': `${SITE}/#person` };

export const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Mohammad Shahnawaz',
  url: `${SITE}/`,
  image: `${SITE}/profile.png`,
  jobTitle: 'Backend AI Engineer',
  description:
    'Backend AI engineer in Bengaluru building LLM agents, RAG pipelines and FastAPI services. Backend AI Intern at dots.in; previously AI Engineering Intern at Flyrank.ai.',
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  worksFor: { '@type': 'Organization', name: 'dots.in' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Guru Ghasidas Vishwavidyalaya' },
  knowsAbout: [
    'Python', 'FastAPI', 'LangChain', 'LangGraph', 'Retrieval-augmented generation', 'LLM agents',
    'Model Context Protocol', 'PostgreSQL', 'ChromaDB', 'Redis', 'Docker',
  ],
  sameAs,
};

export const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'Mohammad Shahnawaz',
  inLanguage: 'en',
  publisher: personRef,
};

export const profilePage = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE}/#profile`,
  url: `${SITE}/`,
  name: 'Mohammad Shahnawaz — Backend AI Engineer',
  mainEntity: personRef,
  isPartOf: { '@id': `${SITE}/#website` },
};

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE}${item.path}`,
  })),
});

export const blogPosting = (post: { id: string; title: string; description: string; date: Date; tags: string[] }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date.toISOString(),
  dateModified: post.date.toISOString(),
  url: `${SITE}/blogs/${post.id}/`,
  mainEntityOfPage: `${SITE}/blogs/${post.id}/`,
  image: `${SITE}/profile.png`,
  keywords: post.tags.join(', '),
  inLanguage: 'en',
  author: personRef,
  publisher: personRef,
});
