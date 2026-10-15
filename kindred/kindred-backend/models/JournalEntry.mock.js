// models/JournalEntry.mock.js
// Test double for the JournalEntry mongoose model.
// Used via the ESM loader redirect in test/mocks-loader.mjs.
// Shared machinery lives in models/mock-shared.mjs.
import { makeQuery, nextMockId, storeDeleteOne, storeExists } from './mock-shared.mjs';

class MockJournalEntry {
  constructor(doc = {}) {
    Object.assign(this, doc);
    this.userId = doc.userId || '507f1f77bcf86cd799439011';
    this.content = doc.content || '';
    this.category = doc.category || '';
    this.date = doc.date || new Date();
    this.pointsEarned = doc.pointsEarned || 10;
    this.createdAt = doc.createdAt || new Date();
    this._id = doc._id || nextMockId();
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
  if (!query || !query.userId) return null;
  const entry = Object.values(MockJournalEntry.store).find((e) => e.userId === query.userId);
  return entry ? makeQuery(entry, null) : null;
};

MockJournalEntry.findById = function (id) {
  const entry = MockJournalEntry.store[id];
  return makeQuery(entry, null);
};

MockJournalEntry.find = function (query) {
  let entries = Object.values(MockJournalEntry.store);
  if (!query) return makeQuery(entries, null);
  if (query.userId) {
    entries = entries.filter((e) => e.userId === query.userId);
  }
  return makeQuery(entries, null);
};

MockJournalEntry.deleteOne = function (query) {
  return storeDeleteOne(MockJournalEntry.store, query);
};

MockJournalEntry.exists = async function (query) {
  return storeExists(MockJournalEntry.store, query);
};

export default MockJournalEntry;
