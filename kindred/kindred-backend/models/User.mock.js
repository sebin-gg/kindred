// models/User.mock.js
// Test double for the User mongoose model (real schema fields preserved).
// Used via the ESM loader redirect in test/mocks-loader.mjs.

function selectDoc(doc, fields) {
  if (doc == null) return null;
  const out = { ...doc };
  // Object spread only copies own properties; also copy prototype methods
  // (e.g., comparePassword) so selected docs remain usable.
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
    this._id = doc._id || `507f${Math.random().toString(36).slice(2, 12)}77bcf86cd799439011`;
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

const storeLoadCount = (function () { let n = 0; return () => ++n; })();
console.error('USERS.JS store ref loaded at:', MockUser.store, '| uid:', storeLoadCount());

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

MockUser.deleteOne = async function (query) {
  const entry = MockUser.store[query._id];
  const matchesId = !!entry;
  const matchesUser = entry && entry.userId === query.userId;
  const deleted = matchesId && matchesUser;
  if (deleted) delete MockUser.store[query._id];
  return { deletedCount: deleted ? 1 : 0 };
};

MockUser.exists = async function (query) {
  return !!(query && MockUser.store[query._id]);
};

MockUser.findByIdAndUpdate = function (id, updates, options = {}) {
  const user = MockUser.store[id];
  if (!user) return new Query(null, null);
  const keys = Object.keys(updates);
  for (const key of keys) {
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
  return options && options.new ? new Query(user, '-password') : user;
};

MockUser.countDocuments = async function (query) {
  const users = Object.values(MockUser.store).filter((u) => u && typeof u === 'object' && u._id);
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