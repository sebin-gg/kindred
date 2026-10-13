// models/mock-shared.mjs
// Machinery shared by the mongo model test doubles (models/*.mock.js):
// deterministic id minting, projection selection, and a minimal
// thennable mongoose-like Query. File extension is .mjs so the
// models/*.js redirect in test/mocks-loader.mjs never rewrites it.

let mockIdCounter = 0;
export function nextMockId() {
  mockIdCounter += 1;
  return `507f${String(mockIdCounter).padStart(3, '0')}99439011`;
}

export function selectDoc(doc, fields) {
  if (doc == null) return null;
  const out = { ...doc };
  // Object spread only copies own properties; also copy prototype methods
  // (e.g., comparePassword) so selected docs remain usable.
  const proto = Object.getPrototypeOf(doc);
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (typeof doc[key] === 'function') {
      out[key] = doc[key];
    }
  }
  if (!fields) return out;
  const parts = fields.split(' ').filter(Boolean);
  for (const f of parts.filter((p) => p.startsWith('-'))) {
    delete out[f.slice(1)];
  }
  const includes = parts.filter((p) => !p.startsWith('-'));
  if (includes.length) {
    for (const key of Object.keys(out)) {
      if (!includes.includes(key)) delete out[key];
    }
  }
  return out;
}

function project(docs, fields, limit) {
  let result = docs.map((doc) => selectDoc(doc, fields));
  if (limit !== undefined) result = result.slice(0, limit);
  return result;
}

export class Query {
  constructor(doc, fields) {
    this._isArray = Array.isArray(doc);
    this._docs = this._isArray ? doc : [doc];
    this._fields = fields;
  }
  _toResult() {
    if (this._isArray) return project(this._docs, this._fields, this._limit);
    return selectDoc(this._docs[0], this._fields);
  }
  then(resolve, reject) {
    resolve(this._toResult());
  }
  catch() {
    return this;
  }
  select(fields) {
    this._fields = fields;
    return this;
  }
  sort() {
    return this;
  }
  limit(n) {
    this._limit = n;
    return this;
  }
  exec() {
    return Promise.resolve(this._toResult());
  }
}

export async function storeDeleteOne(store, query) {
  const entry = store[query._id];
  const matchesId = !!entry;
  const matchesUser = entry && entry.userId === query.userId;
  const deleted = matchesId && matchesUser;
  if (deleted) delete store[query._id];
  return { deletedCount: deleted ? 1 : 0 };
}

export async function storeExists(store, query) {
  return !!(query && store[query._id]);
}
