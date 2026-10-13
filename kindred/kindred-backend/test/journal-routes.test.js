// test/journal-routes.test.js
// Integration tests for the /api/journal routes against a real Express app,
// authenticated via a JWT. Models are test-doubled via the ESM loader
// redirect (models/JournalEntry.js -> models/JournalEntry.mock.js).
import { describe, it, before, after, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import journalRoutes from '../routes/journal.js';
import authRoutes from '../routes/auth.js';
import User from '../models/User.mock.js';
import MockJournalEntry from '../models/JournalEntry.mock.js';

const JWT_SECRET = 'test-jwt-secret';

describe('journal routes', () => {
  before(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  after(() => {
    delete process.env.JWT_SECRET;
  });

  const app = express();
  app.use(express.json());
  app.use('/api/journal', journalRoutes);
  app.use('/api/auth', authRoutes);

  afterEach(() => {
    User.store = {};
    MockJournalEntry.store = {};
  });

  function tokenFor(id, email = 'test@example.com') {
    return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
  }

  async function registerUser(name, email, password) {
    const { body, statusCode } = await request(app)
      .post('/api/auth/register')
      .send({ name, email, password });
    assert.strictEqual(statusCode, 201, `register ${email} should succeed`);
    return body.user.id;
  }

  describe('POST /api/journal/entries', () => {
    it('returns 401 when not authenticated', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .send({ content: 'Test entry', category: 'Environment' });
      assert.strictEqual(statusCode, 401);
      assert.strictEqual(body.error, 'Access token required');
    });

    it('returns 400 when content is missing', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ category: 'Environment' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Content and category required');
    });

    it('returns 400 when category is missing', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Test entry' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Content and category required');
    });

    it('returns 201 with the created entry on success', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'My first journal entry', category: 'Environment' });
      assert.strictEqual(statusCode, 201);
      assert.strictEqual(body.message, 'Journal entry created successfully');
      assert.strictEqual(body.entry.userId, userId);
      assert.strictEqual(body.entry.content, 'My first journal entry');
      assert.strictEqual(body.entry.category, 'Environment');
      assert.strictEqual(body.entry.pointsEarned, 10);
      assert.ok(body.entry.createdAt);
      assert.ok(body.entry._id);
      const stored = await MockJournalEntry.findOne({ userId });
      assert.ok(stored);
    });

    it('returns 201 with content trimmed to 5000 characters', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const longContent = 'x'.repeat(6000);
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: longContent, category: 'Education' });
      assert.strictEqual(statusCode, 201);
      assert.strictEqual(body.entry.content.length, 5000);
    });

    it('updates the user track points when the entry category matches a track', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Tracking environment work', category: 'Environment' });
      const user = await User.findById(userId);
      const track = user.tracks.find((t) => t.name === 'Environment');
      assert.strictEqual(track.points, 10);
    });

    it('does not crash when the entry category is not a tracked category', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Random note', category: 'Other' });
      assert.strictEqual(statusCode, 201);
      assert.strictEqual(body.entry.category, 'Other');
    });
  });
  describe('GET /api/journal/entries', () => {
    it('returns 401 when not authenticated', async () => {
      const { body, statusCode } = await request(app).get('/api/journal/entries');
      assert.strictEqual(statusCode, 401);
      assert.strictEqual(body.error, 'Access token required');
    });

    it('returns 200 with only the authenticated user entries', async () => {
      const aliceId = await registerUser('Alice', 'alice@example.com', 'password123');
      const bobId = await registerUser('Bob', 'bob@example.com', 'password123');
      const aliceToken = tokenFor(aliceId);
      const bobToken = tokenFor(bobId);
      await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${aliceToken}`)
        .send({ content: "Alice's entry", category: 'Environment' });
      await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${bobToken}`)
        .send({ content: "Bob's entry", category: 'Education' });
      const { body, statusCode } = await request(app)
        .get('/api/journal/entries')
        .set('Authorization', `Bearer ${aliceToken}`);
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.length, 1);
      assert.strictEqual(body[0].content, "Alice's entry");
      assert.strictEqual(body[0].userId, aliceId);
    });
  });

  describe('DELETE /api/journal/entries/:entryId', () => {
    it('returns 401 when not authenticated', async () => {
      const entryId = '507f1f77bcf86cd799439011';
      const { body, statusCode } = await request(app)
        .delete(`/api/journal/entries/${entryId}`);
      assert.strictEqual(statusCode, 401);
      assert.strictEqual(body.error, 'Access token required');
    });

    it("returns 200 and deletes the authenticated user's own entry", async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const { body: createBody } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'To be deleted', category: 'Environment' });
      const entryId = createBody.entry._id;
      const { body, statusCode } = await request(app)
        .delete(`/api/journal/entries/${entryId}`)
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.message, 'Entry deleted successfully');
      const exists = await MockJournalEntry.exists({ _id: entryId });
      assert.strictEqual(exists, false);
    });

    it('returns 403 when trying to delete another user entry (BOLA)', async () => {
      const aliceId = await registerUser('Alice', 'alice@example.com', 'password123');
      const bobId = await registerUser('Bob', 'bob@example.com', 'password123');
      const aliceToken = tokenFor(aliceId);
      const bobToken = tokenFor(bobId);
      const { body: createBody } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${aliceToken}`)
        .send({ content: "Alice's secret entry", category: 'Environment' });
      const entryId = createBody.entry._id;
      const { body, statusCode } = await request(app)
        .delete(`/api/journal/entries/${entryId}`)
        .set('Authorization', `Bearer ${bobToken}`);
      assert.strictEqual(statusCode, 403);
      assert.strictEqual(body.error, 'Unauthorized');
    });

    it('returns 404 when deleting a non-existent entry', async () => {
      const userId = await registerUser('Alice', 'alice@example.com', 'password123');
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .delete('/api/journal/entries/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'Entry not found');
    });
  });
});
