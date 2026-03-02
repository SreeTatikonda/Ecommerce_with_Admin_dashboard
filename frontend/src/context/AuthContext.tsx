import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, type AuthUser } from "../api/client";

interface AuthCtx { user: AuthUser | null; loading: boolean; refresh: () => void; }
const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    getMe().then(setUser).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  return <Ctx.Provider value={{ user, loading, refresh }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
