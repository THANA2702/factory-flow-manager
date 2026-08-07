import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppUser, Role } from "@/interfaces";

const STORAGE_KEY = "factoryflow.user";

const DEMO_USER: AppUser = {
  email: "demo@factoryflow.app",
  name: "ผู้ใช้งาน",
  role: "Planner",
};

interface AuthValue {
  user: AppUser | null;
  hydrated: boolean;
  login: (email: string, role: Role) => void;
  register: (email: string, role: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setUser(raw ? (JSON.parse(raw) as AppUser) : DEMO_USER);
    } catch {
      setUser(DEMO_USER);
    }
    setHydrated(true);
  }, []);

  const persist = (next: AppUser | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<AuthValue>(
    () => ({
      user,
      hydrated,
      login: (email, role) => persist({ email, name: "ผู้ใช้งาน", role }),
      register: (email, role) => persist({ email, name: "ผู้ใช้งานใหม่", role }),
      logout: () => persist(null),
      setRole: (role) => persist({ ...(user ?? DEMO_USER), role }),
    }),
    [user, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
