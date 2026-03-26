import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const siteUrl = 'https://xipeter.github.io';

// Use .html file format for all locales
const pages = [
  // Root
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  
  // English locale pages (.html)
  { loc: '/en.html', changefreq: 'weekly', priority: '1.0' },
  { loc: '/en/articles.html', changefreq: 'weekly', priority: '0.9' },
  { loc: '/en/tools.html', changefreq: 'weekly', priority: '0.9' },
  { loc: '/en/tools/previewer.html', changefreq: 'monthly', priority: '0.7' },
  { loc: '/en/tools/passport-photo-sizer.html', changefreq: 'monthly', priority: '0.7' },
  { loc: '/en/promos.html', changefreq: 'monthly', priority: '0.6' },
  { loc: '/en/promos/xfinity-referral.html', changefreq: 'monthly', priority: '0.6' },
  { loc: '/en/about.html', changefreq: 'yearly', priority: '0.5' },
  { loc: '/en/contact.html', changefreq: 'yearly', priority: '0.5' },
  { loc: '/en/privacy-policy.html', changefreq: 'yearly', priority: '0.3' },
  { loc: '/en/terms.html', changefreq: 'yearly', priority: '0.3' },
  { loc: '/en/editorial-policy.html', changefreq: 'yearly', priority: '0.3' },
  { loc: '/en/affiliate-disclosure.html', changefreq: 'yearly', priority: '0.3' },
  
  // Chinese locale pages (.html)
  { loc: '/zh.html', changefreq: 'weekly', priority: '1.0' },
  { loc: '/zh/articles.html', changefreq: 'weekly', priority: '0.9' },
  { loc: '/zh/tools.html', changefreq: 'weekly', priority: '0.9' },
  { loc: '/zh/tools/previewer.html', changefreq: 'monthly', priority: '0.7' },
  { loc: '/zh/tools/passport-photo-sizer.html', changefreq: 'monthly', priority: '0.7' },
  { loc: '/zh/promos.html', changefreq: 'monthly', priority: '0.6' },
  { loc: '/zh/promos/xfinity-referral.html', changefreq: 'monthly', priority: '0.6' },
  { loc: '/zh/about.html', changefreq: 'yearly', priority: '0.5' },
  { loc: '/zh/contact.html', changefreq: 'yearly', priority: '0.5' },
  { loc: '/zh/privacy-policy.html', changefreq: 'yearly', priority: '0.3' },
  { loc: '/zh/terms.html', changefreq: 'yearly', priority: '0.3' },
  { loc: '/zh/editorial-policy.html', changefreq: 'yearly', priority: '0.3' },
  { loc: '/zh/affiliate-disclosure.html', changefreq: 'yearly', priority: '0.3' },
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
console.log('Sitemap generated with .html locale routes');