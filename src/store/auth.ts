import type { AuthenticatedUser } from "@/services/authService";
import { users } from "@/dump/dummy_users";

const STORAGE_KEY = "user";

const isAuthenticatedUser = (value: unknown): value is AuthenticatedUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Partial<AuthenticatedUser>;

  return (
    typeof user.email === "string" &&
    typeof user.username === "string" &&
    typeof user.role === "string" &&
    users.some(
      (dummyUser) =>
        dummyUser.email === user.email &&
        dummyUser.username === user.username &&
        dummyUser.role === user.role
    )
  );
};

export const auth = {
  getUser(): AuthenticatedUser | null {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    try {
      const parsed = JSON.parse(stored);
      return isAuthenticatedUser(parsed) ? parsed : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  login(user: AuthenticatedUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated() {
    return this.getUser() !== null;
  },
};
