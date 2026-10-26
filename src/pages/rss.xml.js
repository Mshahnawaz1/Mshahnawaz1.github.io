import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'Mohammad Shahnawaz',
    description: 'Field notes on systems, AI agents, and the craft of building software.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blogs/${post.id}/`,
    })),
  });
}
