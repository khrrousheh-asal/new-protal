import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type AuthenticatedUser } from "@/services/authService";
import { auth } from "@/store/auth";

interface AuthContextValue {
  user: AuthenticatedUser | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<AuthenticatedUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() =>
    auth.getUser()
  );
  const [loading, setLoading] = useState(false);
  const initialized = true;

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      auth.login(data);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, loading, initialized }),
    [user, login, logout, loading, initialized]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
