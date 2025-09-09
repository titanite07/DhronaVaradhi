import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const GLOB_PATHS = [
  'src',
  'scripts',
  'postcss.config.mjs',
  'next.config.ts',
  'package.json',
];

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function shouldProcess(file) {
  const exts = ['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.jsx'];
  const ext = path.extname(file).toLowerCase();
  return exts.includes(ext) && !file.includes('node_modules');
}

function processFile(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let stripped = content;
    if (file.endsWith('.json')) {
      stripped = content.replace(/^\s*\/\/.+$/gm, '');
    } else {
      // Remove /* */ block comments
      stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove // line comments
      stripped = stripped.replace(/(^|[^:])\/\/.*$/gm, '$1');
    }
    if (stripped !== content) {
      fs.copyFileSync(file, file + '.bak');
      fs.writeFileSync(file, stripped, 'utf8');
      console.log('Stripped comments:', path.relative(ROOT, file));
    }
  } catch (err) {
    console.error('Failed to process', file, err.message);
  }
}

function main() {
  GLOB_PATHS.forEach((p) => {
    const full = path.join(ROOT, p);
    if (!fs.existsSync(full)) return;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      const files = walk(full);
      files.forEach((f) => {
        if (shouldProcess(f)) processFile(f);
      });
    } else if (stat.isFile()) {
      if (shouldProcess(full)) processFile(full);
    }
  });
  console.log('Comment stripping completed. Backups saved with .bak extension.');
}

main();
