// test/models.test.js
// Unit tests for the real mongoose model definitions. The mocks loader only
// redirects model imports made by application code, so importing a model from
// this test file loads the real schema. Defining and validating a schema needs
// no database connection.
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import User from '../models/User.js';
import JournalEntry from '../models/JournalEntry.js';

const OBJECT_ID = '507f1f77bcf86cd799439011';

async function validationError(doc) {
  return doc.validate().then(() => null, (error) => error);
}

describe('User model schema', () => {
  it('trims the name and caps it at 100 characters', () => {
    const name = User.schema.path('name');
    assert.equal(name.options.trim, true);
    assert.equal(name.options.maxlength, 100);
  });

  it('normalizes email and keeps it unique', () => {
    const email = User.schema.path('email');
    assert.equal(email.options.lowercase, true);
    assert.equal(email.options.trim, true);
    assert.equal(email.options.unique, true);
  });

  it('requires at least 8 characters of password', () => {
    assert.equal(User.schema.path('password').options.minlength, 8);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const doc = new User({ name: 'Ada', email: 'ada@example.com', password: 'short' });
    const error = await validationError(doc);
    assert.ok(error?.errors?.password, 'short password should fail validation');
  });

  it('rejects a name longer than 100 characters', async () => {
    const doc = new User({
      name: 'x'.repeat(101),
      email: 'ada@example.com',
      password: 'password123'
    });
    const error = await validationError(doc);
    assert.ok(error?.errors?.name, 'over-long name should fail validation');
  });
});

describe('JournalEntry model schema', () => {
  it('indexes userId and caps content at 5000 characters', () => {
    const userId = JournalEntry.schema.path('userId');
    assert.equal(userId.options.index, true);
    assert.equal(userId.options.required, true);
    assert.equal(JournalEntry.schema.path('content').options.maxlength, 5000);
  });

  it('rejects content longer than 5000 characters', async () => {
    const doc = new JournalEntry({
      userId: OBJECT_ID,
      content: 'x'.repeat(5001),
      category: 'Environment'
    });
    const error = await validationError(doc);
    assert.ok(error?.errors?.content, 'over-long content should fail validation');
  });

  it('rejects a category outside the allowed set', async () => {
    const doc = new JournalEntry({
      userId: OBJECT_ID,
      content: 'Volunteered all afternoon',
      category: 'Not a real category'
    });
    const error = await validationError(doc);
    assert.ok(error?.errors?.category, 'unknown category should fail validation');
  });

  it('accepts a valid entry', async () => {
    const doc = new JournalEntry({
      userId: OBJECT_ID,
      content: 'Volunteered all afternoon',
      category: 'Environment'
    });
    assert.equal(await validationError(doc), null, 'valid entry should pass validation');
    assert.equal(doc.pointsEarned, 10);
  });
});
