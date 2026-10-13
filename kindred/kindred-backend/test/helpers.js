// test/helpers.js
// Test helpers: express-like res, module cache patching for ES modules,
// and reset of mock data stores.
import Module from "node:module";
import path from "node:path";

export function makeRes(statusCode) {
  return {
    statusCode: statusCode ?? null,
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

export function makeReq(headers = {}, body = {}, params = {}) {
  return { headers, body, params };
}

export function patchModel(modelName) {
  const key = path.join(process.cwd(), "models", `${modelName}.js`);
  const original = Module._cache[key];
  return {
    key,
    restore() {
      if (original) Module._cache[key] = original;
      else delete Module._cache[key];
    },
  };
}

export async function makeTestApp(router) {
  const express = await import("express");
  const app = (express.default || express)();
  app.use(express.json());
  app.use("/api", router);
  return app;
}

export function makeTestReq(routerPath, method, headers, body) {
  const req = {
    method,
    url: routerPath,
    headers: { "content-type": "application/json", ...headers },
    body,
    params: {},
  };
  return req;
}

export function runRequest(app, req, res) {
  app(req, res, () => {});
}