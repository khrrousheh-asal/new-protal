import { useState } from "react";
import { authService, type AuthenticatedUser } from "@/services/authService";

export const useAuth = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return { user, login, logout, loading };
};