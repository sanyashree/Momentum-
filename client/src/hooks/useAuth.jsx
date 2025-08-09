// Minimal client-only auth store using React Context.
// This file uses JSX (the Provider), so the extension must be .jsx.

import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = logged out
  const [token, setToken] = useState(null);

  // Load any previously "logged-in" user from localStorage on first mount.
  useEffect(() => {
    // New storage format
    const rawAuth = localStorage.getItem("momentum_auth");
    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
        return;
      } catch {}
    }
    // Backward compatibility (old format)
    const rawUser = localStorage.getItem("momentum_user");
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
        setToken(null);
      } catch {}
    }
  }, []);

  function persistAuth(next) {
    localStorage.setItem("momentum_auth", JSON.stringify(next));
    // Clean up old key
    localStorage.removeItem("momentum_user");
  }

  const loginWithCredentials = async ({ email, password }) => {
    const res = await AuthAPI.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    persistAuth({ user: res.user, token: res.token });
    return res.user;
  };

  const signupWithCredentials = async ({ name, email, password }) => {
    const res = await AuthAPI.signup({ name, email, password });
    setUser(res.user);
    setToken(res.token);
    persistAuth({ user: res.user, token: res.token });
    return res.user;
  };

  // Clear stored user (logout)
  const logout = () => {
    localStorage.removeItem("momentum_auth");
    localStorage.removeItem("momentum_user");
    setUser(null);
    setToken(null);
  };

  // The Provider is JSX — this is why the file must be .jsx
  return (
    <AuthCtx.Provider value={{ user, token, loginWithCredentials, signupWithCredentials, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}