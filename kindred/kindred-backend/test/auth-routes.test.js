// test/auth-routes.test.js
// Integration tests for the auth routes (register / login) against a real
// Express app. Models are test-doubled via the ESM loader redirect
// (models/User.js -> models/User.mock.js), so no database is needed.
import { describe, it, before, after, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import authRoutes from '../routes/auth.js';
import User from '../models/User.mock.js';

const JWT_SECRET = 'test-jwt-secret';

describe('auth routes', () => {
  before(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  after(() => {
    delete process.env.JWT_SECRET;
  });

  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);

  afterEach(() => {
    console.error('AFTEREACH: store ref =', User.store, 'keys before reset =', Object.keys(User.store));
    User.store = {};
    console.error('AFTEREACH: store after reset =', User.store);
  });

  function tokenFor(id, email = 'test@example.com') {
    return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
  }

  describe('POST /api/auth/register', () => {
    it('returns 400 when name is missing', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ email: 'alice@example.com', password: 'password123' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Name, email, and password are required');
    });

    it('returns 400 when email is missing', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', password: 'password123' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Name, email, and password are required');
    });

    it('returns 400 when password is missing', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Name, email, and password are required');
    });

    it('returns 400 when password is too short', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'abc' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Password must be 8-128 characters');
    });

    it('returns 400 when email is already registered', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
      assert.strictEqual(statusCode, 201);
      const { body: body2, statusCode: statusCode2 } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice Two', email: 'ALICE@EXAMPLE.COM', password: 'password123' });
      assert.strictEqual(statusCode2, 400);
      assert.strictEqual(body2.error, 'Email already registered');
    });

    it('returns 201 with a token on success', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });
      assert.strictEqual(statusCode, 201);
      assert.strictEqual(body.message, 'User registered successfully');
      assert.ok(body.token, 'returns a token');
      const decoded = jwt.verify(body.token, JWT_SECRET);
      assert.strictEqual(decoded.id, body.user.id);
      assert.strictEqual(decoded.email, 'alice@example.com');
      assert.strictEqual(body.user.name, 'Alice');
      assert.strictEqual(body.user.email, 'alice@example.com');
      assert.ok(body.user.id, 'user has an _id');
      console.error('TEST-201: store keys =', Object.keys(User.store));
      assert.ok(User.store[decoded.id], 'user saved in mock store');
      const stored = await User.findOne({ email: 'alice@example.com' });
      console.error('TEST-201: after findOne store =', Object.keys(User.store), stored ? stored.email : null);
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 when email is missing', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Invalid credentials');
    });

    it('returns 400 when password is missing', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Invalid credentials');
    });

    it('returns 400 for an unknown email', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(body.error, 'Invalid credentials');
    });

    it('returns 400 for a wrong password', async () => {
      const { statusCode } = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'correctpw' });
      assert.strictEqual(statusCode, 201);
      const { body, statusCode: s2 } = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alice@example.com', password: 'wrongpw' });
      assert.strictEqual(s2, 400);
      assert.strictEqual(body.error, 'Invalid credentials');
    });

    it('returns 200 with a token on successful login', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Alice', email: 'alice@example.com', password: 'correctpw' });
      console.error('REG:', reg.statusCode, reg.body);
      const { body, statusCode } = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ALICE@EXAMPLE.COM', password: 'correctpw' });
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body.message, 'Login successful');
      assert.ok(body.token, 'returns a token');
      assert.strictEqual(body.user.email, 'alice@example.com');
      assert.strictEqual(body.user.title, 'Newcomer');
    });

    it('returns 500 when JWT_SECRET is not configured', async () => {
      delete process.env.JWT_SECRET;
      let r1, r2;
      try {
        r1 = await request(app)
          .post('/api/auth/register')
          .send({ name: 'NoSecret', email: 'no-jwt@example.com', password: 'password123' });
      } catch (err) {
        console.error('register error:', err.message, err.stack);
        throw err;
      }
      assert.strictEqual(r1.statusCode, 500);
      assert.strictEqual(r1.body.error, 'Server authentication is not configured');
      try {
        r2 = await request(app)
          .post('/api/auth/login')
          .send({ email: 'no-jwt@example.com', password: 'password123' });
      } catch (err) {
        console.error('login error:', err.message, err.stack);
        throw err;
      }
      assert.strictEqual(r2.statusCode, 500);
      assert.strictEqual(r2.body.error, 'Server authentication is not configured');
      process.env.JWT_SECRET = JWT_SECRET;
    });
  });
});
