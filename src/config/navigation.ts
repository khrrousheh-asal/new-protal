import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  Network,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/users";

export const APP_TITLE = "Asal Protal";
export const managementRoles: UserRole[] = ["admin", "manager"];

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type WorkspaceOption = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  items: NavigationItem[];
};

const employeeNavigationItems: NavigationItem[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarDays,
  },
  {
    title: "Document Requests",
    href: "/document-requests",
    icon: FileText,
  },
];

const teamManagementItems: NavigationItem[] = [
  {
    title: "Overview Performance",
    href: "/team-management/overview-performance",
    icon: ClipboardCheck,
  },
  {
    title: "Individual Evaluations",
    href: "/team-management/individual-evaluations",
    icon: UserRound,
  },
  {
    title: "Team Attendance Sheet",
    href: "/team-management/team-attendance-sheet",
    icon: CalendarDays,
  },
];

const groupManagementItems: NavigationItem[] = [
  {
    title: "Teams Performance",
    href: "/group-management/teams-performance",
    icon: UsersRound,
  },
  {
    title: "Individual Profiles",
    href: "/group-management/individual-profiles",
    icon: UserRound,
  },
  {
    title: "Team Expansion Requests",
    href: "/group-management/team-expansion-requests",
    icon: FileText,
  },
];

export const employeeWorkspaceOption: WorkspaceOption = {
  title: "Employee Portal",
  description: "Employee workspace",
  href: "/profile",
  icon: UserRound,
  items: employeeNavigationItems,
};

export const managementWorkspaceOptions: WorkspaceOption[] = [
  {
    title: "Team Management",
    description: "Manage people",
    href: "/team-management/overview-performance",
    icon: UsersRound,
    items: teamManagementItems,
  },
  {
    title: "Group Management",
    description: "Manage groups",
    href: "/group-management/teams-performance",
    icon: Network,
    items: groupManagementItems,
  },
];

export const routeTitles: Record<string, string> = {
  "/": "Login",
  "/evaluation": "Evaluation",
  "/team-management": "Team Management",
  "/group-management": "Group Management",
};

export function getWorkspaceOptions(canManage: boolean) {
  return [
    employeeWorkspaceOption,
    ...(canManage ? managementWorkspaceOptions : []),
  ];
}

export function isActivePath(pathname: string, href: string) {
  return pathname === href;
}

export function isActiveWorkspace(
  pathname: string,
  workspace: WorkspaceOption
) {
  return (
    workspace.items.some((item) => isActivePath(pathname, item.href)) ||
    isActivePath(pathname, workspace.href)
  );
}

export function getWorkspaceByPath(pathname: string) {
  return (
    [employeeWorkspaceOption, ...managementWorkspaceOptions].find((workspace) =>
      isActiveWorkspace(pathname, workspace)
    ) ?? employeeWorkspaceOption
  );
}

export function getRouteTitle(pathname: string) {
  const workspace = getWorkspaceByPath(pathname);
  const routeItem = workspace.items.find((item) =>
    isActivePath(pathname, item.href)
  );

  return routeItem?.title ?? routeTitles[pathname] ?? workspace.title;
}
