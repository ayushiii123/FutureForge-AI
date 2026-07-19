import assert from 'assert';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeImagePath = (file) => {
  if (!file) return '';

  if (typeof file === 'string') {
    const value = file.trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) return value;
    const normalized = value.replace(/\\/g, '/');
    const fileName = path.basename(normalized);
    return fileName ? `/uploads/${fileName}` : '';
  }

  if (typeof file.path === 'string') {
    const value = file.path.trim();
    if (/^https?:\/\//i.test(value) || /^data:/i.test(value)) return value;
    const normalized = value.replace(/\\/g, '/');
    const fileName = path.basename(normalized);
    return fileName ? `/uploads/${fileName}` : '';
  }

  if (typeof file.filename === 'string' && file.filename.trim()) {
    return `/uploads/${file.filename}`;
  }

  return '';
};

const uploadFile = { path: '/tmp/device.png', filename: 'device.png' };
const stringImage = 'https://example.com/device.png';

assert.strictEqual(normalizeImagePath(uploadFile), '/uploads/device.png');
assert.strictEqual(normalizeImagePath(stringImage), stringImage);
assert.strictEqual(normalizeImagePath(null), '');

console.log('product image normalization checks passed');
