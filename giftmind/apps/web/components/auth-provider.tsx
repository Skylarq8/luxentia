"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("luxentia_session");
    if (!token) { setLoading(false); return; }

    apiFetch<{ user: AuthUser }>("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("luxentia_session"))
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem("luxentia_session");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
