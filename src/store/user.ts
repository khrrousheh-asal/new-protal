import {
  userLeaveBalances,
  userPlanItems,
  userRequests,
  userSkills,
} from "@/dump/dummy_users";
import type {
  UserLeaveBalance,
  UserPlanItem,
  UserRequest,
  UserSkill,
} from "@/types/users";

const leaveBalances = userLeaveBalances.map((balance) => ({ ...balance }));
const requests = userRequests.map((request) => ({ ...request }));
const skills = userSkills.map((skill) => ({ ...skill }));
const planItems = userPlanItems.map((item) => ({
  ...item,
  skills: [...item.skills],
}));

const cloneLeaveBalance = (balance: UserLeaveBalance): UserLeaveBalance => ({
  ...balance,
});

const cloneRequest = (request: UserRequest): UserRequest => ({ ...request });

const cloneSkill = (skill: UserSkill): UserSkill => ({ ...skill });

const clonePlanItem = (item: UserPlanItem): UserPlanItem => ({
  ...item,
  skills: [...item.skills],
});

export const userStore = {
  getLeaveBalancesByEmployeeId(employeeId: string): UserLeaveBalance[] {
    return leaveBalances
      .filter((balance) => balance.employeeId === employeeId)
      .map(cloneLeaveBalance);
  },

  getRequestsByEmployeeId(employeeId: string): UserRequest[] {
    return requests
      .filter((request) => request.employeeId === employeeId)
      .map(cloneRequest);
  },

  getSkillsByEmployeeId(employeeId: string): UserSkill[] {
    return skills
      .filter((skill) => skill.employeeId === employeeId)
      .map(cloneSkill);
  },

  getPlanItemsByEmployeeId(employeeId: string): UserPlanItem[] {
    return planItems
      .filter((item) => item.employeeId === employeeId)
      .map(clonePlanItem);
  },
};
