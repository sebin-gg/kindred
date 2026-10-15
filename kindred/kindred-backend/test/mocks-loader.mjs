// test/mocks-loader.mjs
// ESM loader that redirects `models/<name>.js` imports coming from application
// code to `models/<name>.mock.js`. This lets route tests inject test doubles
// (mock models) without changing route code or relying on module cache hacks,
// which don't work for ESM. Importers inside test/ keep the real module, so
// tests can still assert the real model definitions.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// models/ lives in the backend root; resolve relative to this loader's location.
const modelsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'models');

function isTestModule(url) {
  if (!url?.startsWith('file:')) return false;
  return path.basename(path.dirname(fileURLToPath(url))) === 'test';
}

export async function resolve(specifier, context, nextResolve) {
  // First try normal resolution.
  const resolved = await nextResolve(specifier, context);
  if (!resolved.url?.startsWith('file:')) return resolved;

  const target = fileURLToPath(resolved.url);
  const name = path.basename(target);
  if (name.endsWith('.mock.js')) return resolved;
  // Only redirect code files under a models/ directory.
  if (!name.endsWith('.js') || path.basename(path.dirname(target)) !== 'models') return resolved;
  // A test importing a real model means it: leave the real module alone.
  if (isTestModule(context.parentURL)) return resolved;

  const mockPath = path.join(modelsDir, name.replace(/\.js$/, '.mock.js'));
  return { url: pathToFileURL(mockPath).href };
}
