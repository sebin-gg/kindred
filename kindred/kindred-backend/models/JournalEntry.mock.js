// models/JournalEntry.mock.js
// Test double for the JournalEntry mongoose model.
// Used via the ESM loader redirect in test/mocks-loader.mjs.

function selectDoc(doc, fields) {
  const out = { ...doc };
  // Object spread only copies own properties; also copy prototype methods
  // so selected docs remain usable.
  const proto = Object.getPrototypeOf(doc);
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (typeof doc[key] === 'function') {
      out[key] = doc[key];
    }
  }
  if (!fields) return out;
  const parts = fields.split(' ').filter((f) => f);
  const excludes = parts.filter((f) => f.startsWith('-')).map((f) => f.slice(1));
  const includes = parts.filter((f) => !f.startsWith('-'));
  for (const f of excludes) {
    delete out[f];
  }
  if (includes.length) {
    for (const key of Object.keys(out)) {
      if (!includes.includes(key)) {
        delete out[key];
      }
    }
  }
  return out;
}

class Query {
  constructor(doc, fields) {
    this._isArray = Array.isArray(doc);
    this._docs = this._isArray ? doc : [doc];
    this._fields = fields;
  }
  then(resolve, reject) {
    let result = this._docs.map((doc) => selectDoc(doc, this._fields));
    if (this._isArray) {
      if (this._limit) {
        result = result.slice(0, this._limit);
      }
    } else {
      result = result[0];
    }
    resolve(result);
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
    let result = this._docs.map((doc) => selectDoc(doc, this._fields));
    if (this._isArray) {
      if (this._limit) {
        result = result.slice(0, this._limit);
      }
    } else {
      result = result[0];
    }
    return Promise.resolve(result);
  }
}

class MockJournalEntry {
  constructor(doc = {}) {
    Object.assign(this, doc);
    this.userId = doc.userId || '507f1f77bcf86cd799439011';
    this.content = doc.content || '';
    this.category = doc.category || '';
    this.date = doc.date || new Date();
    this.pointsEarned = doc.pointsEarned || 10;
    this.createdAt = doc.createdAt || new Date();
    this._id = doc._id || `507f${Math.random().toString(36).slice(2, 12)}77bcf86cd799439011`;
  }

  async save() {
    MockJournalEntry.store[this._id] = this;
    return this;
  }

  async delete() {
    delete MockJournalEntry.store[this._id];
    return this;
  }
}

// In-memory store: map _id -> entry instance.
MockJournalEntry.store = {};

MockJournalEntry.findOne = function (query) {
  if (!query) return null;
  if (query.userId) {
    const entry = Object.values(MockJournalEntry.store).find((e) => e.userId === query.userId);
    return entry ? new Query(entry, null) : null;
  }
  return null;
};

MockJournalEntry.findById = function (id) {
  const entry = MockJournalEntry.store[id];
  return new Query(entry, null);
};

MockJournalEntry.find = function (query) {
  let entries = Object.values(MockJournalEntry.store).filter((e) => e && typeof e === 'object' && e._id);
  if (!query) return new Query(entries, null);
  if (query.userId) {
    entries = entries.filter((e) => e.userId === query.userId);
  }
  return new Query(entries, null);
};

MockJournalEntry.deleteOne = async function (query) {
  const entry = MockJournalEntry.store[query._id];
  const matchesId = !!entry;
  const matchesUser = entry && entry.userId === query.userId;
  const deleted = matchesId && matchesUser;
  if (deleted) delete MockJournalEntry.store[query._id];
  return { deletedCount: deleted ? 1 : 0 };
};

MockJournalEntry.exists = async function (query) {
  return !!(query && MockJournalEntry.store[query._id]);
};

export default MockJournalEntry;