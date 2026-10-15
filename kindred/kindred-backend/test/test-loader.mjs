// test/test-loader.mjs
// Wrapper so node:test runs with the model-mock loader. This lets the real
// routes/models load the mock models (models/User.js -> models/User.mock.js).
// The loader path is resolved from this file rather than the process CWD, so
// coverage runs can be started from the repository root (SonarCloud resolves
// lcov `SF:` paths relative to the project base directory).
import { register } from 'node:module';

register('./mocks-loader.mjs', import.meta.url);