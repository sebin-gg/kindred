import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createLocalEntry,
  getLocalEntries,
  getLocalTracks,
  POINTS_PER_ENTRY,
  TRACK_NAMES,
} from '../../src/services/localDemo.js';

const STORAGE_KEY = 'kindred_demo_entries_guest-1';

class MemoryStorage {
  values = new Map();
  readError = null;
  writeError = null;
  reads = 0;

  getItem(key) {
    this.reads += 1;
    if (this.readError) throw this.readError;
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    if (this.writeError) throw this.writeError;
    this.values.set(key, String(value));
  }
}

describe('local demo journal storage', () => {
  let storage;
  let originalStorageDescriptor;

  beforeEach(() => {
    storage = new MemoryStorage();
    originalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage,
    });
  });

  afterEach(() => {
    if (originalStorageDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', originalStorageDescriptor);
    } else {
      delete globalThis.localStorage;
    }
  });

  it('normalizes stored entries, derives trusted fields, and rejects malformed values', () => {
    storage.values.set(STORAGE_KEY, JSON.stringify([
      {
        _id: 'unsafe id',
        id: 'fallback-id',
        content: 'Recorded action',
        category: 'Environment',
        pointsEarned: 999,
        date: 'x'.repeat(65),
        createdAt: '2024-02-03T00:00:00Z',
        unexpected: 'discard this',
      },
      null,
      [],
      { _id: 'no-content', category: 'Environment', content: 12, createdAt: '2024-02-03' },
      { _id: 'bad-category', content: 'No track', category: 'Other', createdAt: '2024-02-03' },
      { _id: 'bad-date', content: 'No date', category: 'Education', createdAt: 'not a date' },
      { _id: 'non-string-date', content: 'No string date', category: 'Education', createdAt: 42 },
      { _id: 'bad-id!', content: 'No safe id', category: 'Education', createdAt: '2024-02-03' },
    ]));

    assert.deepEqual(getLocalEntries('guest-1'), [{
      _id: 'fallback-id',
      id: 'fallback-id',
      content: 'Recorded action',
      category: 'Environment',
      pointsEarned: POINTS_PER_ENTRY,
      date: new Date('2024-02-03T00:00:00Z').toLocaleDateString(),
      createdAt: '2024-02-03T00:00:00.000Z',
    }]);
  });

  it('rejects invalid new entries and truncates accepted content to 5000 characters', () => {
    assert.throws(
      () => createLocalEntry('guest-1', { content: 12, category: 'Environment' }),
      { name: 'TypeError', message: 'Invalid local demo entry' },
    );
    assert.throws(
      () => createLocalEntry('guest-1', { content: 'Valid text', category: 'Other' }),
      { name: 'TypeError', message: 'Invalid local demo entry' },
    );

    const entry = createLocalEntry('guest-1', {
      content: 'x'.repeat(6000),
      category: 'Environment',
    });

    assert.equal(entry.content.length, 5000);
    assert.equal(entry.pointsEarned, POINTS_PER_ENTRY);
    assert.equal(entry.id, entry._id);
    assert.match(entry.id, /^local-[\w-]+$/);
    assert.equal(JSON.parse(storage.values.get(STORAGE_KEY))[0].content.length, 5000);
  });

  it('caps loaded and newly created journals at 200 entries, newest first', () => {
    const existingEntries = Array.from({ length: 201 }, (_, index) => ({
      _id: `entry-${index}`,
      content: `Action ${index}`,
      category: 'Education',
      createdAt: '2024-02-03T00:00:00Z',
    }));
    storage.values.set(STORAGE_KEY, JSON.stringify(existingEntries));

    const loaded = getLocalEntries('guest-1');
    assert.equal(loaded.length, 200);
    assert.equal(loaded[0].id, 'entry-0');
    assert.equal(loaded.at(-1).id, 'entry-199');

    const created = createLocalEntry('guest-1', {
      content: 'Newest action',
      category: 'Environment',
    });
    const afterCreate = getLocalEntries('guest-1');

    assert.equal(afterCreate.length, 200);
    assert.equal(afterCreate[0].id, created.id);
    assert.equal(afterCreate.at(-1).id, 'entry-198');
  });

  it('derives track points from normalized entries instead of stored totals', () => {
    storage.values.set(STORAGE_KEY, JSON.stringify([
      { _id: 'env-1', content: 'One', category: 'Environment', pointsEarned: 500, createdAt: '2024-02-03' },
      { _id: 'env-2', content: 'Two', category: 'Environment', pointsEarned: 0, createdAt: '2024-02-03' },
      { _id: 'education-1', content: 'Three', category: 'Education', pointsEarned: 1, createdAt: '2024-02-03' },
    ]));

    const tracks = getLocalTracks('guest-1');
    assert.equal(tracks.length, TRACK_NAMES.length);
    assert.deepEqual(tracks.find(({ name }) => name === 'Environment'), {
      name: 'Environment', points: 2 * POINTS_PER_ENTRY,
    });
    assert.deepEqual(tracks.find(({ name }) => name === 'Education'), {
      name: 'Education', points: POINTS_PER_ENTRY,
    });
  });

  it('rejects unsafe user ids without touching storage', () => {
    for (const userId of ['', '../guest', 'guest/name', 'x'.repeat(129), null, undefined]) {
      const readsBefore = storage.reads;
      assert.deepEqual(getLocalEntries(userId), []);
      assert.equal(storage.reads, readsBefore);
      assert.throws(
        () => createLocalEntry(userId, { content: 'Action', category: 'Environment' }),
        { name: 'TypeError', message: 'Invalid local demo user id' },
      );
      assert.deepEqual(getLocalTracks(userId), TRACK_NAMES.map((name) => ({ name, points: 0 })));
      assert.equal(storage.reads, readsBefore);
    }
  });

  it('returns an empty journal for invalid stored JSON or storage read failures', () => {
    storage.values.set(STORAGE_KEY, '{broken json');
    assert.deepEqual(getLocalEntries('guest-1'), []);

    storage.values.set(STORAGE_KEY, JSON.stringify({ entries: [] }));
    assert.deepEqual(getLocalEntries('guest-1'), []);

    storage.readError = new Error('Storage unavailable');
    assert.deepEqual(getLocalEntries('guest-1'), []);
    assert.deepEqual(getLocalTracks('guest-1'), TRACK_NAMES.map((name) => ({ name, points: 0 })));
  });

  it('propagates storage write failures so HeroJournal can show the error', () => {
    const quotaError = new Error('Storage quota exceeded');
    storage.writeError = quotaError;

    assert.throws(
      () => createLocalEntry('guest-1', { content: 'Action', category: 'Environment' }),
      (error) => error === quotaError,
    );
  });
});
