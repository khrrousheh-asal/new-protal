import { users } from "@/dump/dummy_users";
import { userStore } from "@/store/user";
import type {
  AuthenticatedUser,
  User,
  UserLeaveBalance,
  UserPlanItem,
  UserPlanTodoTask,
  UserProfile,
  UserRequest,
  UserSkill,
} from "@/types/users";

const cloneProfile = (profile: UserProfile): UserProfile => ({ ...profile });

const cloneUser = (user: User): User => ({
  ...user,
  profile: cloneProfile(user.profile),
});

const toAuthenticatedUser = (user: User): AuthenticatedUser => ({
  email: user.email,
  username: user.username,
  role: user.role,
  profile: cloneProfile(user.profile),
});

const getAllUsers = (): User[] => users.map(cloneUser);

const getUserByEmployeeId = (employeeId: string): AuthenticatedUser | null => {
  const user = users.find((entry) => entry.profile.employeeId === employeeId);

  return user ? toAuthenticatedUser(user) : null;
};

const getLeaveBalancesByEmployeeId = (
  employeeId: string
): UserLeaveBalance[] => userStore.getLeaveBalancesByEmployeeId(employeeId);

const getRequestsByEmployeeId = (employeeId: string): UserRequest[] =>
  userStore.getRequestsByEmployeeId(employeeId);

const getSkillsByEmployeeId = (employeeId: string): UserSkill[] =>
  userStore.getSkillsByEmployeeId(employeeId);

const getPlanItemsByEmployeeId = (employeeId: string): UserPlanItem[] =>
  userStore.getPlanItemsByEmployeeId(employeeId);

const getPlanTodoTasksByPlanId = (planId: string): UserPlanTodoTask[] =>
  userStore.getPlanTodoTasksByPlanId(planId);

const userService = {
  getAllUsers,
  getUserByEmployeeId,
  getLeaveBalancesByEmployeeId,
  getRequestsByEmployeeId,
  getSkillsByEmployeeId,
  getPlanItemsByEmployeeId,
  getPlanTodoTasksByPlanId,
};

export default userService;
