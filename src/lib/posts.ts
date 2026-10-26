import { getCollection } from 'astro:content';

/** All blog posts, newest first. */
export async function getPosts() {
  return (await getCollection('blogs')).sort((a, b) => +b.data.date - +a.data.date);
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
