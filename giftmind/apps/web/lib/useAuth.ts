"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
};

export function useAuth() {
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

  return { user, loading, logout };
}
