import { getCollection } from 'astro:content';

/** All blog posts, newest first. */
export async function getPosts() {
  return (await getCollection('blogs')).sort((a, b) => +b.data.date - +a.data.date);
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });

/** All projects, in their `order`. */
export async function getProjects() {
  return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}
