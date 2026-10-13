// models/User.mock.js
// Test double for the User mongoose model (real schema fields preserved).
// Used via the ESM loader redirect in test/mocks-loader.mjs.
// Shared machinery lives in models/mock-shared.mjs.
import { Query, nextMockId, selectDoc, storeDeleteOne, storeExists } from './mock-shared.mjs';

class MockUser {
  constructor(doc = {}) {
    Object.assign(this, doc);
    this.name = doc.name || '';
    this.email = doc.email || '';
    this.password = doc.password || '';
    this.isGuest = !!doc.isGuest;
    this.title = doc.title || 'Newcomer';
    this.location = doc.location || '';
    this.bio = doc.bio || '';
    this.interests = Array.isArray(doc.interests) ? doc.interests : [];
    this.isCommunityVisible = doc.isCommunityVisible !== undefined ? !!doc.isCommunityVisible : true;
    this.tracks = Array.isArray(doc.tracks) ? doc.tracks : [];
    this.currentTitle = doc.currentTitle || 'Newcomer';
    this.createdAt = doc.createdAt || new Date();
    this.updatedAt = doc.updatedAt || new Date();
    this._id = doc._id || nextMockId();
  }

  async comparePassword(candidate) {
    return this.password === candidate;
  }

  async save() {
    MockUser.store[this._id] = this;
    this.updatedAt = new Date();
    return this;
  }

  async delete() {
    delete MockUser.store[this._id];
    return this;
  }
}

// In-memory store: map _id -> user instance.
MockUser.store = {};

MockUser.findOne = async function (query) {
  if (!query || !query.email) return null;
  const normalized = String(query.email).toLowerCase();
  const user = Object.values(MockUser.store).find((u) => u.email === normalized);
  return user ? new Query(user, null) : null;
};

MockUser.findById = function (id) {
  const user = MockUser.store[id];
  return new Query(user, null);
};

MockUser.find = function (query) {
  let users = Object.values(MockUser.store).filter((u) => u && typeof u === 'object' && u._id);
  if (!query) return new Query(users, null);
  if (query.isCommunityVisible === true) {
    users = users.filter((u) => u.isCommunityVisible);
  }
  if (query.isCommunityVisible === false) {
    users = users.filter((u) => !u.isCommunityVisible);
  }
  if (typeof query.location === 'object' && query.location?.$regex) {
    const re = new RegExp(query.location.$regex, query.location.$options);
    users = users.filter((u) => re.test(u.location));
  }
  if (query.interests && query.interests.$in) {
    users = users.filter((u) => query.interests.$in.some((i) => u.interests.includes(i)));
  }
  if (Array.isArray(query.interests)) {
    users = users.filter((u) => query.interests.some((i) => u.interests.includes(i)));
  }
  return new Query(users, null);
};

MockUser.deleteOne = function (query) {
  return storeDeleteOne(MockUser.store, query);
};

MockUser.exists = async function (query) {
  return storeExists(MockUser.store, query);
};

MockUser.findByIdAndUpdate = function (id, updates, options = {}) {
  const user = MockUser.store[id];
  if (!user) return new Query(null, null);
  for (const key of Object.keys(updates)) {
    if (key === 'updatedAt') { user.updatedAt = updates.updatedAt; continue; }
    if (key === 'name' && typeof updates.name === 'string') user.name = updates.name.trim().slice(0, 100);
    else if (key === 'location' && typeof updates.location === 'string') user.location = updates.location.slice(0, 200);
    else if (key === 'title' && typeof updates.title === 'string') user.title = updates.title.slice(0, 100);
    else if (key === 'bio' && typeof updates.bio === 'string') user.bio = updates.bio.slice(0, 1000);
    else if (key === 'interests' && Array.isArray(updates.interests)) user.interests = [...new Set(updates.interests.filter((i) => typeof i === 'string').map((i) => i.slice(0, 100)))].slice(0, 50);
    else if (key === 'isCommunityVisible' && typeof updates.isCommunityVisible === 'boolean') user.isCommunityVisible = updates.isCommunityVisible;
    else user[key] = updates[key];
  }
  user.updatedAt = new Date();
  if (!options || !options.new) return user;
  return new Query(selectDoc(user, '-password'), null);
};

MockUser.countDocuments = async function (query) {
  const users = Object.values(MockUser.store);
  if (!query || query.isCommunityVisible === true) return users.filter((u) => u.isCommunityVisible).length;
  if (query.isCommunityVisible === false) return users.filter((u) => !u.isCommunityVisible).length;
  return users.length;
};

MockUser.distinct = async function (field, query) {
  const users = Object.values(MockUser.store).filter((u) => u && typeof u === 'object' && u._id);
  const selected = query && query.isCommunityVisible === false
    ? users.filter((u) => !u.isCommunityVisible)
    : users.filter((u) => u.isCommunityVisible);
  const values = [];
  for (const u of selected) {
    const val = u[field];
    if (Array.isArray(val)) {
      values.push(...val.filter((v) => typeof v === 'string' && v));
    } else if (typeof val === 'string' && val) {
      values.push(val);
    }
  }
  return Array.from(new Set(values));
};

export default MockUser;
