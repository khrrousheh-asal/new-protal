import type { AuthenticatedUser, UserProfile } from "@/types/users";
import { users } from "@/dump/dummy_users";

const STORAGE_KEY = "user";

const EMPLOYMENT_STATUSES: UserProfile["status"][] = [
  "active",
  "on-leave",
  "terminated",
  "probation",
];

const ONSITE_PREFERENCES: UserProfile["onsitePreference"][] = [
  "remote",
  "onsite",
  "hybrid",
];

const isOptionalString = (value: unknown) =>
  typeof value === "undefined" || typeof value === "string";

const isUserProfile = (value: unknown): value is UserProfile => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const profile = value as Partial<UserProfile>;

  return (
    typeof profile.name === "string" &&
    typeof profile.directSupervisor === "string" &&
    typeof profile.status === "string" &&
    EMPLOYMENT_STATUSES.includes(profile.status) &&
    typeof profile.startingDate === "string" &&
    isOptionalString(profile.contractEnds) &&
    typeof profile.team === "string" &&
    typeof profile.branch === "string" &&
    isOptionalString(profile.assignedTo) &&
    typeof profile.onsitePreference === "string" &&
    ONSITE_PREFERENCES.includes(profile.onsitePreference) &&
    typeof profile.employeeId === "string" &&
    isOptionalString(profile.avatarUrl)
  );
};

const isAuthenticatedUser = (value: unknown): value is AuthenticatedUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Partial<AuthenticatedUser>;

  if (
    typeof user.email !== "string" ||
    typeof user.username !== "string" ||
    typeof user.role !== "string" ||
    !isUserProfile(user.profile)
  ) {
    return false;
  }

  const profile = user.profile;

  return users.some((dummyUser) => {
    return (
      dummyUser.email === user.email &&
      dummyUser.username === user.username &&
      dummyUser.role === user.role &&
      dummyUser.profile.employeeId === profile.employeeId
    );
  });
};

export const auth = {
  getUser(): AuthenticatedUser | null {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    try {
      const parsed = JSON.parse(stored);

      if (!isAuthenticatedUser(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed;
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
