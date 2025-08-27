"use client";

import React, { useContext, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string; role?: string } | null;

const AuthContext = React.createContext<{
  user: User;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await authApi.loginAdmin(data);
    setUser(res.user || null);
    router.push("/users/account");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
