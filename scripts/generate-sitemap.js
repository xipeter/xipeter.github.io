import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const siteUrl = 'https://xipeter.github.io';

const pages = [
  // Root
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  
  // English locale pages
  { loc: '/en/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/en/articles/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/en/tools/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/en/tools/previewer', changefreq: 'monthly', priority: '0.7' },
  { loc: '/en/tools/passport-photo-sizer', changefreq: 'monthly', priority: '0.7' },
  { loc: '/en/promos/', changefreq: 'monthly', priority: '0.6' },
  { loc: '/en/promos/xfinity-referral', changefreq: 'monthly', priority: '0.6' },
  { loc: '/en/about', changefreq: 'yearly', priority: '0.5' },
  { loc: '/en/contact', changefreq: 'yearly', priority: '0.5' },
  { loc: '/en/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/en/terms', changefreq: 'yearly', priority: '0.3' },
  { loc: '/en/editorial-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/en/affiliate-disclosure', changefreq: 'yearly', priority: '0.3' },
  
  // Chinese locale pages
  { loc: '/zh/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/zh/articles/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/zh/tools/', changefreq: 'weekly', priority: '0.9' },
  { loc: '/zh/tools/previewer', changefreq: 'monthly', priority: '0.7' },
  { loc: '/zh/tools/passport-photo-sizer', changefreq: 'monthly', priority: '0.7' },
  { loc: '/zh/promos/', changefreq: 'monthly', priority: '0.6' },
  { loc: '/zh/promos/xfinity-referral', changefreq: 'monthly', priority: '0.6' },
  { loc: '/zh/about', changefreq: 'yearly', priority: '0.5' },
  { loc: '/zh/contact', changefreq: 'yearly', priority: '0.5' },
  { loc: '/zh/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/zh/terms', changefreq: 'yearly', priority: '0.3' },
  { loc: '/zh/editorial-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/zh/affiliate-disclosure', changefreq: 'yearly', priority: '0.3' },
];

const urls = pages.map(p => `  <url>
    <loc>${siteUrl}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(path.join(projectRoot, 'dist', 'sitemap.xml'), sitemap);
console.log('Sitemap generated with locale routes');