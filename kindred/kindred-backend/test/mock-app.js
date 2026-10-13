// test/mock-app.js
// Shared test doubles so the real express routes can be exercised without a DB.

const mockId = () => `507f${Math.random().toString(36).slice(2, 12)}77bcf86cd799439011`;

function makeRes() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

function makeReq(headers = {}) {
  return { headers, body: {}, params: {} };
}

function makeAuthReq(user) {
  return { headers: { authorization: `Bearer fake-token` }, body: {}, params: {}, user };
}

function makeTestUser(extra = {}) {
  const base = {
    name: "Alice",
    email: "alice@example.com",
    password: "password123",
    isGuest: false,
    title: "Newcomer",
    currentTitle: "Newcomer",
    location: "",
    bio: "",
    interests: [],
    isCommunityVisible: true,
    tracks: [
      { name: "Environment", points: 0 },
      { name: "Education", points: 0 },
      { name: "Social Work", points: 0 },
      { name: "Healthcare", points: 0 },
      { name: "Animal Welfare", points: 0 },
      { name: "Disaster Relief", points: 0 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const user = { _id: mockId(), ...base, ...extra };
  user.comparePassword = async (pw) => pw === "password123";
  user.save = async function () { return this; };
  return user;
}

export { mockId, makeRes, makeReq, makeAuthReq, makeTestUser };