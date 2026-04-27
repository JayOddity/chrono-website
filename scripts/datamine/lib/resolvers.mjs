import path from 'node:path';
import fs from 'node:fs';
import { EXPORTS_CONTENT_DIR } from './config.mjs';
import { loadTable } from './tables.mjs';

export function resolveText(tableName, textId, lang = 'ENG') {
  if (textId == null || textId === -1 || textId === 0) return null;
  const rows = loadTable(tableName);
  const row = rows[String(textId)];
  if (!row) return null;
  const val = row[`Text_${lang}`] ?? row.Text_ENG ?? null;
  return val && val.trim() ? val : null;
}

export function resolveUIMaterial(tableName, id) {
  if (id == null || id === -1) return null;
  const rows = loadTable(tableName);
  const row = rows[String(id)];
  const asset = row?.Path?.AssetPathName;
  if (!asset || asset.includes('TX_DummyImage')) return null;
  return asset;
}

const tagIndexCache = new Map();
function tagIndexFor(tableName) {
  if (tagIndexCache.has(tableName)) return tagIndexCache.get(tableName);
  const rows = loadTable(tableName);
  const idx = new Map();
  for (const row of Object.values(rows)) {
    const tag = row?.TagName;
    if (tag && tag !== 'None' && !idx.has(tag)) idx.set(tag, row);
  }
  tagIndexCache.set(tableName, idx);
  return idx;
}

export function resolveTagIcon(tag) {
  if (!tag || tag === 'None') return null;
  const dot = tag.indexOf('.');
  if (dot < 0) return null;
  const table = tag.slice(0, dot);
  const tagKey = tag.slice(dot + 1);
  const idx = tagIndexFor(table);
  const row = idx.get(tagKey);
  const asset = row?.Path?.AssetPathName;
  if (!asset || asset.includes('TX_DummyImage')) return null;
  return asset;
}

export function assetPathToIconFile(assetPath) {
  if (!assetPath) return null;
  if (!assetPath.startsWith('/Game/')) return null;
  const [pathPart] = assetPath.split('.', 1);
  const rel = pathPart.replace(/^\/Game\//, '');
  const fsPath = path.join(EXPORTS_CONTENT_DIR, rel + '.png');
  return fs.existsSync(fsPath) ? fsPath : null;
}
