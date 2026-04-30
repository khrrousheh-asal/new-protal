export type UserRole = "admin" | "user" | "manager";
export type EmploymentStatus = "active" | "on-leave" | "terminated" | "probation";
export type OnsitePreference = "remote" | "onsite" | "hybrid";

export interface UserProfile {
  name: string;
  directSupervisor: string;
  status: EmploymentStatus;
  startingDate: string;
  contractEnds?: string;
  team: string;
  branch: string;
  assignedTo?: string;
  onsitePreference: OnsitePreference;
  employeeId: string;
  avatarUrl?: string;
}

export interface User {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
}

export type AuthenticatedUser = Omit<User, "password">;
