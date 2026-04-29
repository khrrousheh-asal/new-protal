export type UserRole = "admin" | "user" | "manager";

export interface User {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}