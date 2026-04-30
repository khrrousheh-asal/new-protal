export type UserRole = "admin" | "user" | "manager";
export type EmploymentStatus = "active" | "on-leave" | "terminated" | "probation";
export type OnsitePreference = "remote" | "onsite" | "hybrid";
export type UserRequestType = "sick-leave" | "annual-vacation";
export type UserRequestStatus = "approved" | "pending" | "rejected";
export type UserSkillCategory =
  | "frontend"
  | "backend"
  | "platform"
  | "soft-skills";

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

export interface UserLeaveBalance {
  employeeId: string;
  type: UserRequestType;
  label: string;
  taken: number;
  have: number;
  yearlyAllowance: number;
  note: string;
}

export interface UserRequest {
  id: string;
  employeeId: string;
  request: string;
  type: UserRequestType;
  submitDate: string;
  issueDate: string;
  endDate?: string;
  status: UserRequestStatus;
  notes: string;
}

export interface UserSkill {
  id: string;
  employeeId: string;
  name: string;
  category: UserSkillCategory;
  level: number;
}

export interface UserPlanItem {
  id: string;
  employeeId: string;
  name: string;
  advisor: string;
  skills: string[];
  description: string;
  progress: number;
}

export interface UserPlanTaskReference {
  label: string;
  url: string;
}

export interface UserPlanTodoTask {
  id: string;
  planId: string;
  task: string;
  description: string;
  references: UserPlanTaskReference[];
}
