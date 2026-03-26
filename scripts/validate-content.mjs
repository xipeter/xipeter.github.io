#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const PLACEHOLDER_PHRASES = [
  'coming soon',
  'no content yet',
  'check back soon',
  'TBD',
  'placeholder',
  'under construction'
];

const contentDir = path.join(rootDir, 'src', 'content');

let errors = [];
let warnings = [];

function checkFile(filePath, type) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  for (const phrase of PLACEHOLDER_PHRASES) {
    if (content.toLowerCase().includes(phrase)) {
      warnings.push(`${type}: ${fileName} contains placeholder phrase "${phrase}"`);
    }
  }

  if (type === 'article' || type === 'tool' || type === 'promo') {
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatter) {
      const fm = frontmatter[1];
      if (!fm.includes('adEligible:')) {
        errors.push(`${type}: ${fileName} missing adEligible field`);
      }
    }
  }
}

function walkDir(dir, type) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.startsWith('_') || file.startsWith('.')) continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath, type);
    } else if (file.endsWith('.md')) {
      checkFile(fullPath, type);
    }
  }
}

console.log('Running content validation...\n');

['articles', 'tools', 'promos', 'news'].forEach(type => {
  const dir = path.join(contentDir, type);
  walkDir(dir, type);
});

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log('  ' + w));
}

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(e => console.log('  ' + e));
  console.log('\nValidation FAILED');
  process.exit(1);
} else {
  console.log('✅ Validation passed');
}
