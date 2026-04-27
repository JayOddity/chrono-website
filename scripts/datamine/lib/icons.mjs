import fs from 'node:fs';
import path from 'node:path';
import { OUT_ICONS_DIR, PUBLIC_ICONS_URL_BASE } from './config.mjs';

const copied = new Set();

export function copyIcon(srcPng, domain, fileName) {
  if (!srcPng) return null;
  const key = `${domain}/${fileName}`;
  const url = `${PUBLIC_ICONS_URL_BASE}/${domain}/${fileName}`;
  if (copied.has(key)) return url;
  const destDir = path.join(OUT_ICONS_DIR, domain);
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, fileName);
  fs.copyFileSync(srcPng, dest);
  copied.add(key);
  return url;
}

export function iconBasenameFromAsset(assetPath) {
  if (!assetPath) return null;
  const [pathPart] = assetPath.split('.', 1);
  const parts = pathPart.split('/');
  return parts[parts.length - 1] + '.png';
}
