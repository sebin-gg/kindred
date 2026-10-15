// test/community-routes.test.js
// Integration tests for the /api/community routes against a real Express app.
// Models are test-doubled via the ESM loader redirect (models/User.js ->
// models/User.mock.js). Community routes are public, so no authentication is needed.
import { describe, it, before, after, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import request from 'supertest';
import express from 'express';
import communityRoutes from '../routes/community.js';
import User from '../models/User.mock.js';

describe('community routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/community', communityRoutes);

  afterEach(() => {
    User.store = {};
  });

  function createUser(id, doc) {
    const user = new User({ _id: id, ...doc });
    User.store[id] = user;
    return user;
  }

  describe('GET /api/community/members', () => {
    it('returns 200 with an empty array when there are no members', async () => {
      const { body, statusCode } = await request(app).get('/api/community/members');
      assert.strictEqual(statusCode, 200);
      assert.deepStrictEqual(body, []);
    });

    it('returns 200 with only community-visible members', async () => {
      createUser('507f1f77bcf86cd799439011', { name: 'Alice', email: 'alice@example.com', title: 'Newcomer', location: 'Portland', bio: 'Hi', interests: ['hiking'], isCommunityVisible: true });
      createUser('507f2f77bcf86cd799439022', { name: 'Bob', email: 'bob@example.com', title: 'Explorer', location: 'Seattle', bio: 'Hello', interests: ['coding'], isCommunityVisible: false });
      const { body, statusCode } = await request(app).get('/api/community/members');
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.length, 1);
      assert.strictEqual(body[0].name, 'Alice');
      assert.strictEqual(body[0].email, undefined, 'email must not be exposed');
      assert.strictEqual(body[0].isCommunityVisible, true);
    });

    it('returns 200 and filters by location', async () => {
      createUser('507f1f77bcf86cd799439011', { name: 'Alice', email: 'alice@example.com', location: 'Portland', interests: ['hiking'], isCommunityVisible: true });
      createUser('507f2f77bcf86cd799439022', { name: 'Bob', email: 'bob@example.com', location: 'Seattle', interests: ['coding'], isCommunityVisible: true });
      const { body, statusCode } = await request(app).get('/api/community/members?location=portland');
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.length, 1);
      assert.strictEqual(body[0].name, 'Alice');
    });

    it('returns 200 and filters by interest', async () => {
      createUser('507f1f77bcf86cd799439011', { name: 'Alice', email: 'alice@example.com', location: 'Portland', interests: ['hiking', 'coding'], isCommunityVisible: true });
      createUser('507f2f77bcf86cd799439022', { name: 'Bob', email: 'bob@example.com', location: 'Seattle', interests: ['reading'], isCommunityVisible: true });
      const { body, statusCode } = await request(app).get('/api/community/members?interest=coding');
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.length, 1);
      assert.strictEqual(body[0].name, 'Alice');
    });
  });

  describe('GET /api/community/members/:userId', () => {
    it('returns 200 for an existing community-visible member', async () => {
      const id = '507f1f77bcf86cd799439011';
      createUser(id, { name: 'Alice', email: 'alice@example.com', title: 'Newcomer', location: 'Portland', bio: 'Hi', interests: ['hiking'], isCommunityVisible: true });
      const { body, statusCode } = await request(app).get(`/api/community/members/${id}`);
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.name, 'Alice');
      assert.strictEqual(body.location, 'Portland');
      assert.strictEqual(body.isCommunityVisible, true);
    });

    it('returns 404 for a non-community-visible member', async () => {
      const id = '507f2f77bcf86cd799439022';
      createUser(id, { name: 'Bob', email: 'bob@example.com', title: 'Explorer', location: 'Seattle', interests: ['coding'], isCommunityVisible: false });
      const { body, statusCode } = await request(app).get(`/api/community/members/${id}`);
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'Member not found');
    });

    it('returns 404 for a non-existent member', async () => {
      const { body, statusCode } = await request(app).get('/api/community/members/507f1f77bcf86cd799439abc');
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'Member not found');
    });
  });

  describe('GET /api/community/stats', () => {
    it('returns 200 with correct statistics', async () => {
      createUser('507f1f77bcf86cd799439011', { name: 'Alice', email: 'alice@example.com', location: 'Portland', interests: ['hiking', 'coding'], isCommunityVisible: true });
      createUser('507f2f77bcf86cd799439022', { name: 'Bob', email: 'bob@example.com', location: 'Seattle', interests: ['coding'], isCommunityVisible: false });
      createUser('507f3f77bcf86cd799439033', { name: 'Carol', email: 'carol@example.com', location: 'Portland', interests: ['reading'], isCommunityVisible: true });
      const { body, statusCode } = await request(app).get('/api/community/stats');
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.totalMembers, 2);
      assert.ok(body.locations.includes('Portland'));
      assert.ok(body.interests.includes('hiking'));
      assert.ok(body.interests.includes('coding'));
    });
  });
});
