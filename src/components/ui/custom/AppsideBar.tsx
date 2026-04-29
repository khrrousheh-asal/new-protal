import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Check,
  ChevronsUpDown,
  ClipboardCheck,
  FileText,
  LogOut,
  Network,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import AsalIcon from "@/../public/favicon.ico";
import type { UserRole } from "@/types/users";

type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type WorkspaceOption = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  avatarSrc?: string;
  activePaths?: string[];
};

const managementRoles: UserRole[] = ["admin", "manager"];

const navigationItems: NavigationItem[] = [
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
    title: "Evaluation",
    href: "/evaluation",
    icon: ClipboardCheck,
  },
  {
    title: "Document Requests",
    href: "/document-requests",
    icon: FileText,
  },
];

const employeeWorkspaceOption: WorkspaceOption = {
  title: "Employee Portal",
  description: "Employee workspace",
  href: "/profile",
  icon: UserRound,
  avatarSrc: AsalIcon,
  activePaths: navigationItems.map((item) => item.href),
};

const managementWorkspaceOptions: WorkspaceOption[] = [
  {
    title: "Team Management",
    description: "Manage people",
    href: "/team-management",
    icon: UsersRound,
  },
  {
    title: "Group Management",
    description: "Manage groups",
    href: "/group-management",
    icon: Network,
  },
];

const managementItems: NavigationItem[] = managementWorkspaceOptions.map(
  ({ title, href, icon }) => ({
    title,
    href,
    icon,
  })
);

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActiveWorkspace(pathname: string, workspace: WorkspaceOption) {
  return (workspace.activePaths ?? [workspace.href]).some((path) =>
    isActivePath(pathname, path)
  );
}

function WorkspaceAvatar({ workspace }: { workspace: WorkspaceOption }) {
  const Icon = workspace.icon;

  return (
    <Avatar className="size-8 rounded-lg border border-sidebar-border">
      {workspace.avatarSrc ? (
        <AvatarImage src={workspace.avatarSrc} alt={workspace.title} />
      ) : null}
      <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Icon className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}

function getUserInitials(username?: string, email?: string) {
  const source = username?.trim() || email?.split("@")[0] || "User";
  const words = source.split(/[\s._-]+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function UserAvatar({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) {
  return (
    <Avatar className="size-8 rounded-lg border border-sidebar-border">
      <AvatarFallback className="rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
        {getUserInitials(username, email)}
      </AvatarFallback>
    </Avatar>
  );
}

function SidebarNavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavigationItem[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActivePath(pathname, item.href)}
                  tooltip={item.title}
                >
                  <NavLink to={item.href}>
                    <Icon />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default function AppsideBar() {
  const { logout, user } = useAuth();
  const { isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const canManage = user ? managementRoles.includes(user.role) : false;
  const workspaceOptions = [
    employeeWorkspaceOption,
    ...(canManage ? managementWorkspaceOptions : []),
  ];
  const activeWorkspace =
    workspaceOptions.find((item) =>
      isActiveWorkspace(location.pathname, item)
    ) ?? employeeWorkspaceOption;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <WorkspaceAvatar workspace={activeWorkspace} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">
                      {activeWorkspace.title}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {activeWorkspace.description}
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side={isMobile ? "bottom" : "right"}
                className="w-[--radix-dropdown-menu-trigger-width] min-w-64"
              >
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {workspaceOptions.map((item) => {
                  const isActive = isActiveWorkspace(location.pathname, item);

                  return (
                    <DropdownMenuItem
                      key={item.href}
                      className={cn("gap-3 p-2", isActive && "bg-accent")}
                      onSelect={() => navigate(item.href)}
                    >
                      <WorkspaceAvatar workspace={item} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">
                          {item.title}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <Check
                        className={cn(
                          "ml-auto",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarNavGroup
          label="Workspace"
          items={navigationItems}
          pathname={location.pathname}
        />
        {/* {canManage ? (
          <SidebarNavGroup
            label="Management"
            items={managementItems}
            pathname={location.pathname}
          />
        ) : null} */}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserAvatar username={user?.username} email={user?.email} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">
                      {user?.username}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user?.email}
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side={isMobile ? "bottom" : "right"}
                className="w-[--radix-dropdown-menu-trigger-width] min-w-64"
              >
                <DropdownMenuLabel>
                  <span className="flex items-center gap-3">
                    <UserAvatar
                      username={user?.username}
                      email={user?.email}
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-popover-foreground">
                        {user?.username}
                      </span>
                      <span className="truncate text-xs font-normal">
                        {user?.email}
                      </span>
                    </span>
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-3 p-2" onSelect={handleLogout}>
                  <Avatar className="size-8 rounded-lg border border-sidebar-border">
                    <AvatarFallback className="rounded-lg bg-destructive text-white">
                      <LogOut className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
