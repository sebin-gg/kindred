// test/mocks-loader.mjs
// ESM loader that redirects any `models/<name>.js` import to `models/<name>.mock.js`.
// This lets route tests inject test doubles (mock models) without changing
// route code or relying on module cache hacks, which don't work for ESM.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// models/ lives in the backend root; resolve relative to this loader's location.
const modelsDir = path.join(__dirname, '..', 'models');

const modelsRE = /(?:^|[/\\])models[/\\][A-Za-z0-9_.-]+\.js$/;

export async function resolve(specifier, context, nextResolve) {
  // First try normal resolution.
  const resolved = await nextResolve(specifier, context);
  if (!resolved.url) return resolved;
  console.error('RESOLVE:', specifier, '->', resolved.url);
  // Check if the resolved path points to a models/<name>.js file.
  const urlPath = resolved.url.replace(/^file:\/\//, '').replace(/\//g, '\\');
  const fileName = urlPath.split(/[/\\]/).pop();
  if (fileName.endsWith('.mock.js')) {
    return resolved;
  }
  if (modelsRE.test(urlPath)) {
    const name = path.basename(urlPath).replace('.js', '');
    const mockPath = path.join(modelsDir, name + '.mock.js');
    const redirectUrl = pathToFileURL(mockPath).href;
    console.error('LOADER redirecting:', specifier, '-> redirectUrl =', redirectUrl);
    return { url: redirectUrl };
  }
  return resolved;
}