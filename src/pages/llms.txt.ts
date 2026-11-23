import type { APIRoute } from 'astro';
import { getPosts, getProjects } from '../lib/posts';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const lines = [
    '# Mohammad Shahnawaz',
    '',
    '> Backend AI engineer in Bengaluru, India. Builds LLM agents, RAG pipelines and FastAPI services. Backend AI Intern at dots.in (Nov 2026 to present); previously AI Engineering Intern at Flyrank.ai.',
    '',
    '## About',
    `- [Portfolio home](${SITE}/): experience, projects, open source contributions, skills`,
    '- [GitHub](https://github.com/Mshahnawaz1)',
    '- [LinkedIn](https://linkedin.com/in/Mshahnawaz1)',
    `- [Resume (PDF)](${SITE}/MShahnawaz.pdf)`,
    '',
    '## Projects',
    ...projects.map((p) => `- [${p.data.title}](${p.data.live ?? p.data.source ?? SITE}): ${p.data.description}`),
    '',
    '## Writing',
    ...posts.map((p) => `- [${p.data.title}](${SITE}/blogs/${p.id}/): ${p.data.excerpt ?? ''}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
