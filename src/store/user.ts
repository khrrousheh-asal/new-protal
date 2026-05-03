import {
  userLeaveBalances,
  userPlanItems,
  userPlanTodoTasks,
  userRequests,
  userSkills,
} from "@/dump/dummy_users";
import type {
  UserLeaveBalance,
  UserPlanItem,
  UserPlanTodoTask,
  UserRequest,
  UserSkill,
} from "@/types/users";

const PLAN_TODO_STORAGE_KEY = "profile-plan-todo-tasks";

const leaveBalances = userLeaveBalances.map((balance) => ({ ...balance }));
const requests = userRequests.map((request) => ({ ...request }));
const skills = userSkills.map((skill) => ({ ...skill }));
const planItems = userPlanItems.map((item) => ({
  ...item,
  skills: [...item.skills],
}));
let fallbackPlanTodoTasks = userPlanTodoTasks.map((task) => ({
  ...task,
  references: task.references.map((reference) => ({ ...reference })),
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

const clonePlanTodoTask = (task: UserPlanTodoTask): UserPlanTodoTask => ({
  ...task,
  references: task.references.map((reference) => ({ ...reference })),
});

const isPlanTodoTask = (value: unknown): value is UserPlanTodoTask => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Partial<UserPlanTodoTask>;

  return (
    typeof task.id === "string" &&
    typeof task.planId === "string" &&
    typeof task.task === "string" &&
    typeof task.description === "string" &&
    Array.isArray(task.references) &&
    task.references.every(
      (reference) =>
        reference &&
        typeof reference === "object" &&
        typeof reference.label === "string" &&
        typeof reference.url === "string"
    )
  );
};

const readPlanTodoTasks = (): UserPlanTodoTask[] => {
  if (typeof localStorage === "undefined") {
    return fallbackPlanTodoTasks.map(clonePlanTodoTask);
  }

  const storedTasks = localStorage.getItem(PLAN_TODO_STORAGE_KEY);

  if (!storedTasks) {
    localStorage.setItem(
      PLAN_TODO_STORAGE_KEY,
      JSON.stringify(fallbackPlanTodoTasks)
    );
    return fallbackPlanTodoTasks.map(clonePlanTodoTask);
  }

  try {
    const parsed = JSON.parse(storedTasks);

    if (!Array.isArray(parsed) || !parsed.every(isPlanTodoTask)) {
      localStorage.setItem(
        PLAN_TODO_STORAGE_KEY,
        JSON.stringify(fallbackPlanTodoTasks)
      );
      return fallbackPlanTodoTasks.map(clonePlanTodoTask);
    }

    return parsed.map(clonePlanTodoTask);
  } catch {
    localStorage.setItem(
      PLAN_TODO_STORAGE_KEY,
      JSON.stringify(fallbackPlanTodoTasks)
    );
    return fallbackPlanTodoTasks.map(clonePlanTodoTask);
  }
};

const writePlanTodoTasks = (tasks: UserPlanTodoTask[]) => {
  fallbackPlanTodoTasks = tasks.map(clonePlanTodoTask);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(PLAN_TODO_STORAGE_KEY, JSON.stringify(tasks));
  }
};

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

  getPlanTodoTasksByPlanId(planId: string): UserPlanTodoTask[] {
    return readPlanTodoTasks()
      .filter((task) => task.planId === planId)
      .map(clonePlanTodoTask);
  },

  resetPlanTodoTasks() {
    writePlanTodoTasks(userPlanTodoTasks.map(clonePlanTodoTask));
  },
};
