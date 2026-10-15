// test/users-routes.test.js
// Integration tests for the /api/users routes against a real Express app,
// authenticated via a JWT signed with the test secret. Models are test-doubled
// via the ESM loader redirect (models/User.js -> models/User.mock.js).
import { describe, it, before, after, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import userRoutes from '../routes/users.js';
import authRoutes from '../routes/auth.js';
import User from '../models/User.mock.js';

const JWT_SECRET = 'test-jwt-secret';

describe('users routes', () => {
  before(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  after(() => {
    delete process.env.JWT_SECRET;
  });

  const app = express();
  app.use(express.json());
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);

  afterEach(() => {
    User.store = {};
  });

  function tokenFor(id, email = 'test@example.com') {
    return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
  }

  describe('GET /api/users/profile', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const { body, statusCode } = await request(app).get('/api/users/profile');
      assert.strictEqual(statusCode, 401);
      assert.strictEqual(body.error, 'Access token required');
    });

    it('returns 401 when the token scheme is not Bearer', async () => {
      const { body, statusCode } = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Token invalid-token');
      assert.strictEqual(statusCode, 401);
      assert.strictEqual(body.error, 'Access token required');
    });

    it('returns 403 for an invalid token', async () => {
      const { body, statusCode } = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer not-a-real-token');
      assert.strictEqual(statusCode, 403);
      assert.strictEqual(body.error, 'Invalid or expired token');
    });

    it('returns 200 with the authenticated user for a valid token', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = tokenFor(userId);
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
      const stored = await User.findOne({ email: 'alice@example.com' });
      stored._id = userId;
      User.store[userId] = stored;
      const { body, statusCode } = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.email, 'alice@example.com');
      assert.strictEqual(body.name, 'Alice');
      assert.strictEqual(body.title, 'Newcomer');
      assert.strictEqual(body.currentTitle, 'Newcomer');
      assert.strictEqual(body.location, '');
      assert.strictEqual(body.bio, '');
      assert.strictEqual(body.isCommunityVisible, true);
      assert.ok(!body.password, 'password must not be in the response');
    });

    it('returns 404 when the token user is not in the store', async () => {
      const token = tokenFor('507faaaaaaaaaaaaaaaaaaaaaaaa');
      const { body, statusCode } = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'User not found');
    });
  });

  describe('PUT /api/users/profile', () => {
    const userId = '507f1f77bcf86cd799439011';

    function setupUser() {
      const user = new User({
        _id: userId,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        title: 'Newcomer',
        location: '',
        bio: '',
        interests: [],
        isCommunityVisible: true,
      });
      User.store[userId] = user;
      return user;
    }

    it('returns 404 when the token user does not exist', async () => {
      const token = tokenFor('507fb1b1b1b1b1b1b1b1b1b1');
      const { body, statusCode } = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Bobby' });
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'User not found');
    });

    it('returns 200 and updates name, location, title, and bio', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Bobby',
          location: 'Portland, OR',
          title: 'Explorer',
          bio: 'Hello world',
        });
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.message, 'Profile updated successfully');
      assert.strictEqual(body.user.name, 'Bobby');
      assert.strictEqual(body.user.location, 'Portland, OR');
      assert.strictEqual(body.user.title, 'Explorer');
      assert.strictEqual(body.user.bio, 'Hello world');
      assert.strictEqual(body.user.isCommunityVisible, true);
    });

    it('returns 200 and updates interests (deduped and capped)', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          interests: ['hiking', 'coding', 'hiking', 'read'],
        });
      assert.strictEqual(statusCode, 200);
      assert.deepStrictEqual(body.user.interests, ['hiking', 'coding', 'read']);
    });

    it('returns 200 and updates isCommunityVisible to false', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ isCommunityVisible: false });
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.user.isCommunityVisible, false);
    });
  });

  describe('PUT /api/users/tracks/:trackName', () => {
    const userId = '507f1f77bcf86cd799439011';

    function setupUser() {
      const user = new User({
        _id: userId,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        tracks: [
          { name: 'Environment', points: 0 },
          { name: 'Education', points: 0 },
        ],
      });
      User.store[userId] = user;
      return user;
    }

    it('returns 404 when the token user does not exist', async () => {
      const token = tokenFor('507fc2c2c2c2c2c2c2c2c2c2');
      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ points: 50 });
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'User not found');
    });

    it('returns 400 for a negative point value', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ points: -5 });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Points must be a number 0-100000');
    });

    it('returns 400 for a non-finite point value', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ points: Infinity });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Points must be a number 0-100000');
    });

    it('returns 400 for a point value over 100000', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ points: 100001 });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Points must be a number 0-100000');
    });

    it('returns 404 when the track name does not match', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .send({ points: 50 });
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(body.error, 'Track not found');
    });

    it('returns 200 and updates the track points', async () => {
      setupUser();
      const token = tokenFor(userId);
      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Environment')
        .set('Authorization', `Bearer ${token}`)
        .send({ points: 50 });
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.message, 'Track updated successfully');
      const environment = body.tracks.find((t) => t.name === 'Environment');
      assert.strictEqual(environment.points, 50);
    });
  });
});
