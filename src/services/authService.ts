import type { AuthenticatedUser } from "@/types/users";
import { users } from "@/dump/dummy_users";

export interface LoginPayload {
  email: string;
  password: string;
}

export type { AuthenticatedUser };

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthenticatedUser> => {
    // simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    const foundUser = users.find(
      (u) => u.email === payload.email && u.password === payload.password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    // never return password
    return {
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role,
      profile: foundUser.profile,
    };
  },
};
