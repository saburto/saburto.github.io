import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Sebastian Aburto',
    description: 'Thoughts on software, testing, and learning',
    site: 'https://saburto.dev',
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description || '',
      pubDate: post.data.date,
      link: `/blog/${post.id.replace(/\.mdx?$/, '')}/`,
    })),
  });
}
