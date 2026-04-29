import {type User} from "@/types/users";
import {users} from "@/dump/dummy_users";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  email: string;
  username: string;
  role: User["role"];
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthenticatedUser> => {
    // simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    const foundUser = users.find(
      (u) =>
        u.email === payload.email && u.password === payload.password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    // never return password
    const { password, ...safeUser } = foundUser;

    return safeUser;
  },
};