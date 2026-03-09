import esbuild from 'esbuild';
import { copyFileSync, mkdirSync } from 'fs';

mkdirSync('dist', { recursive: true });

await esbuild.build({
  entryPoints: ['src/content.js'],
  bundle: true,
  outfile: 'dist/content.js',
  format: 'iife',
  target: 'chrome120',
  minify: true,
});

copyFileSync('src/content.css', 'dist/content.css');
copyFileSync('manifest.json', 'dist/manifest.json');

console.log('Built to dist/');
