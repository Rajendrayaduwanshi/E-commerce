"use client";

import { useState, useEffect, useCallback } from "react";

type User = {
  id: string;
  email: string;
  role: "user" | "admin";
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // LOGIN
  // ------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  // ------------------------------
  // LOGOUT
  // ------------------------------
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccessToken(null);
  }, []);

  // ------------------------------
  // REFRESH ACCESS TOKEN
  // ------------------------------
  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) {
      setUser(null);
      setAccessToken(null);
      return null;
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  }, []);

  // ------------------------------
  // Auto refresh on load
  // ------------------------------
  useEffect(() => {
    (async () => {
      try {
        const token = await refresh();
        if (token) {
          // optional: fetch profile if you want full data
          const res = await fetch("/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const profile = await res.json();
            setUser(profile.user);
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  return { user, accessToken, loading, login, logout, refresh };
}
