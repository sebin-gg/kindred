// test/failure-handling.test.js
// Error-path tests. Internal failures must surface as 500s rather than a 2xx,
// a duplicate-key save must map to 400 on register, and a missing JWT secret
// must fail closed. Models are test-doubled via the ESM loader redirect.
import { describe, it, before, after, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/users.js';
import journalRoutes from '../routes/journal.js';
import communityRoutes from '../routes/community.js';
import User from '../models/User.mock.js';
import MockJournalEntry from '../models/JournalEntry.mock.js';

const JWT_SECRET = 'test-jwt-secret';
const OBJECT_ID = '507f1f77bcf86cd799439011';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/community', communityRoutes);

// Every stubbed member is restored after each test so one failure path cannot
// leak into the next one.
const originals = new Map();
function stub(target, key, value) {
  if (!originals.has(target)) originals.set(target, new Map());
  const replaced = originals.get(target);
  if (!replaced.has(key)) replaced.set(key, target[key]);
  target[key] = value;
}

const failsWith = (error) => () => { throw error; };

function tokenFor(id, email = 'test@example.com') {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
}

async function registerUser(name, email, password = 'password123') {
  const { body, statusCode } = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password });
  assert.equal(statusCode, 201, `register ${email} should succeed`);
  return body.user.id;
}

describe('failure handling', () => {
  before(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  after(() => {
    delete process.env.JWT_SECRET;
  });

  afterEach(() => {
    for (const [target, replaced] of originals) {
      for (const [key, value] of replaced) target[key] = value;
    }
    originals.clear();
    User.store = {};
    MockJournalEntry.store = {};
    process.env.JWT_SECRET = JWT_SECRET;
  });

  describe('authentication middleware', () => {
    it('fails closed with 500 when no JWT secret is configured', async () => {
      delete process.env.JWT_SECRET;

      const { body, statusCode } = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${tokenFor(OBJECT_ID)}`);

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Server authentication is not configured');
    });
  });

  describe('auth routes', () => {
    it('maps a duplicate-key save failure to 400', async () => {
      stub(User.prototype, 'save', failsWith(Object.assign(new Error('E11000 duplicate key'), { code: 11000 })));

      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Ada', email: 'ada@example.com', password: 'password123' });

      assert.equal(statusCode, 400);
      assert.equal(body.error, 'Email already registered');
    });

    it('returns 500 when registration fails unexpectedly', async () => {
      stub(User.prototype, 'save', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Ada', email: 'ada@example.com', password: 'password123' });

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Registration failed');
    });

    it('returns 500 when the login lookup fails', async () => {
      stub(User, 'findOne', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ada@example.com', password: 'password123' });

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Login failed');
    });
  });

  describe('user routes', () => {
    it('returns 500 when the profile lookup fails', async () => {
      const userId = await registerUser('Ada', 'ada@example.com');
      stub(User, 'findById', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${tokenFor(userId)}`);

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to load profile');
    });

    it('returns 500 when the profile update fails', async () => {
      const userId = await registerUser('Ada', 'ada@example.com');
      stub(User, 'findByIdAndUpdate', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${tokenFor(userId)}`)
        .send({ name: 'Ada Lovelace' });

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to update profile');
    });

    it('returns 404 for tracks of an unknown user', async () => {
      const { body, statusCode } = await request(app)
        .get('/api/users/tracks')
        .set('Authorization', `Bearer ${tokenFor(OBJECT_ID)}`);

      assert.equal(statusCode, 404);
      assert.equal(body.error, 'User not found');
    });

    it('returns 500 when the tracks lookup fails', async () => {
      stub(User, 'findById', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .get('/api/users/tracks')
        .set('Authorization', `Bearer ${tokenFor(OBJECT_ID)}`);

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to load tracks');
    });

    it('returns 500 when saving track points fails', async () => {
      const userId = await registerUser('Ada', 'ada@example.com');
      stub(User.prototype, 'save', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .put('/api/users/tracks/Environment')
        .set('Authorization', `Bearer ${tokenFor(userId)}`)
        .send({ points: 10 });

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to update track');
    });
  });

  describe('journal routes', () => {
    it('returns 404 when the entry owner no longer exists', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${tokenFor(OBJECT_ID)}`)
        .send({ content: 'Volunteered all afternoon', category: 'Animal Welfare' });

      assert.equal(statusCode, 404);
      assert.equal(body.error, 'User not found');
    });

    it('returns 500 when the entry cannot be saved', async () => {
      const userId = await registerUser('Ada', 'ada@example.com');
      stub(MockJournalEntry.prototype, 'save', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .post('/api/journal/entries')
        .set('Authorization', `Bearer ${tokenFor(userId)}`)
        .send({ content: 'Volunteered all afternoon', category: 'Animal Welfare' });

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to create entry');
    });

    it('returns 500 when listing entries fails', async () => {
      const userId = await registerUser('Ada', 'ada@example.com');
      stub(MockJournalEntry, 'find', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .get('/api/journal/entries')
        .set('Authorization', `Bearer ${tokenFor(userId)}`);

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to load entries');
    });

    it('returns 500 when deleting an entry fails', async () => {
      const userId = await registerUser('Ada', 'ada@example.com');
      stub(MockJournalEntry, 'deleteOne', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app)
        .delete(`/api/journal/entries/${OBJECT_ID}`)
        .set('Authorization', `Bearer ${tokenFor(userId)}`);

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to delete entry');
    });
  });

  describe('community routes', () => {
    it('returns 500 when the member list fails to load', async () => {
      stub(User, 'find', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app).get('/api/community/members');

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to load members');
    });

    it('returns 500 when a single member fails to load', async () => {
      stub(User, 'findById', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app).get(`/api/community/members/${OBJECT_ID}`);

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to load member');
    });

    it('returns 500 when community stats fail to load', async () => {
      stub(User, 'countDocuments', failsWith(new Error('boom')));

      const { body, statusCode } = await request(app).get('/api/community/stats');

      assert.equal(statusCode, 500);
      assert.equal(body.error, 'Failed to load stats');
    });
  });
});
