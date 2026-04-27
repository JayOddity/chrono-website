import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..', '..');
export const PROJECT_ROOT = path.resolve(REPO_ROOT, '..');

export const DATA_TABLE_DIR = path.join(PROJECT_ROOT, 'Datamined Stuff', 'Data', 'Table_P');
export const EXPORTS_CONTENT_DIR = path.join(
  PROJECT_ROOT,
  'Datamined Stuff',
  'Output',
  'Exports',
  'ChronoOdyssey',
  'Content',
);

export const OUT_DATA_DIR = path.join(REPO_ROOT, 'data');
export const OUT_ICONS_DIR = path.join(REPO_ROOT, 'public', 'images', 'game-icons');
export const PUBLIC_ICONS_URL_BASE = '/images/game-icons';
