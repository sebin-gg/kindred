// test/test-loader.mjs
// Wrapper so node:test runs with the model-mock loader. This lets the real
// routes/models load the mock models (models/User.js -> models/User.mock.js).
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./test/mocks-loader.mjs', pathToFileURL('./'));