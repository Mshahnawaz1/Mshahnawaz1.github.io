import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blogs' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['Live', 'Building', 'Not Started']).optional(),
    tags: z.array(z.string()).default([]),
    live: z.string().url().optional(),
    source: z.string().url().optional(),
    image: z.string().optional(),   // path under public/, e.g. /medai.png
    order: z.number().default(0),   // lower comes first
  }),
});

export const collections = { blogs, projects };
