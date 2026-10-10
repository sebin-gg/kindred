import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";

const JWT_SECRET = "test-secret";
const OTHER_SECRET = "other-secret";

function makeRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function makeReq(token) {
  return { headers: { authorization: token } };
}

describe("authenticateToken (ownership gate for every protected route)", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  it("rejects requests with no Authorization header", () => {
    const res = makeRes();
    let nextCalled = false;
    authenticateToken(makeReq(undefined), res, () => {
      nextCalled = true;
    });
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
  });

  it("rejects a non-Bearer scheme", () => {
    const res = makeRes();
    let nextCalled = false;
    authenticateToken(makeReq(`Basic ${"x".repeat(20)}`), res, () => {
      nextCalled = true;
    });
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
  });

  it("rejects a token signed with a different secret", () => {
    const forged = jwt.sign({ id: "656565656565656565656565" }, OTHER_SECRET);
    const res = makeRes();
    let nextCalled = false;
    authenticateToken(makeReq(`Bearer ${forged}`), res, () => {
      nextCalled = true;
    });
    assert.equal(res.statusCode, 403);
    assert.equal(nextCalled, false);
  });

  it("rejects an expired token", () => {
    const expired = jwt.sign({ id: "656565656565656565656565" }, JWT_SECRET, {
      expiresIn: -10,
    });
    const res = makeRes();
    let nextCalled = false;
    authenticateToken(makeReq(`Bearer ${expired}`), res, () => {
      nextCalled = true;
    });
    assert.equal(res.statusCode, 403);
    assert.equal(nextCalled, false);
  });

  it("fails closed when JWT_SECRET is not configured", () => {
    delete process.env.JWT_SECRET;
    const token = jwt.sign({ id: "656565656565656565656565" }, "ignored");
    const res = makeRes();
    let nextCalled = false;
    authenticateToken(makeReq(`Bearer ${token}`), res, () => {
      nextCalled = true;
    });
    assert.equal(res.statusCode, 500);
    assert.equal(nextCalled, false);
  });

  it("attaches the verified user identity for a valid token", () => {
    const userId = "656565656565656565656565";
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();
    let nextCalled = false;
    authenticateToken(req, res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(req.user.id, userId);
    assert.equal(res.statusCode, null);
  });
});