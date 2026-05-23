import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('blog')).filter(p => !p.data.draft);
  const SITE = 'https://saburto.com';

  const urls = [
    { loc: '/', lastmod: new Date().toISOString() },
    { loc: '/about/', lastmod: new Date().toISOString() },
    ...posts.map(p => ({
      loc: `/blog/${p.id.replace(/\.mdx?$/, '')}/`,
      lastmod: p.data.date.toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
