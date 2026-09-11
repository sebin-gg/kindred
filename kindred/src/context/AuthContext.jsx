import React, { createContext, useState, useEffect, useMemo } from 'react';
import { authAPI } from '../services/api.js';

export const AuthContext = createContext();

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

// What gets stored in the browser:
// - authToken: the backend JWT (7-day expiry), or a local-only guest marker
//   when the backend is unreachable (e.g. the static Vercel demo).
// - authUser: { id, name, email, isGuest } — display info only, no secrets.
// A guest's real password is random, bcrypt-hashed server-side, and never
// sent back to the client, so there is nothing sensitive to steal beyond the
// token itself. Logout wipes all of it.
const loadStoredSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { token: null, user: null };
    const rawUser = localStorage.getItem(USER_KEY);
    return { token, user: rawUser ? JSON.parse(rawUser) : null };
  } catch {
    return { token: null, user: null };
  }
};

const makeLocalGuest = () => {
  const id = `local-guest-${Math.random().toString(36).slice(2, 10)}`;
  return {
    token: `local-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`,
    user: {
      id,
      name: `Guest ${id.slice(-4).toUpperCase()}`,
      email: `${id}@kindred.guest`,
      isGuest: true,
      localOnly: true,
    },
  };
};

export const AuthProvider = ({ children }) => {
  const [stored] = useState(loadStoredSession);
  const [user, setUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(name, email, password);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // One-click guest login: try the backend first so the guest is a real
  // account (usable for journal/tracks). If the backend is unreachable,
  // fall back to a local-only guest so the demo still works offline.
  const continueAsGuest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.guest();
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch {
      const local = makeLocalGuest();
      setToken(local.token);
      setUser(local.user);
      return { ...local, localOnly: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentTitle');
  };

  const value = useMemo(
    () => ({ user, token, loading, error, register, login, continueAsGuest, logout }),
    [user, token, loading, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
