import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import AsalIcon from "@/../public/favicon.ico";
import type { UserRole } from "@/types/users";

type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type ManagementHeaderOption = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
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

const managementItems: NavigationItem[] = [
  {
    title: "Team Management",
    href: "/team-management",
    icon: UsersRound,
  },
  {
    title: "Group Management",
    href: "/group-management",
    icon: Network,
  },
];

const managementHeaderOptions: ManagementHeaderOption[] = [
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

export default function AppsideBar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const canManage = user ? managementRoles.includes(user.role) : false;
  const activeHeaderOption = managementHeaderOptions.find(
    (item) => item.href === location.pathname
  );
  const headerTitle = canManage
    ? activeHeaderOption?.title ?? "Management"
    : "Employee Portal";
  const headerDescription = canManage
    ? activeHeaderOption?.description ?? "Choose workspace"
    : "Employee workspace";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src={AsalIcon}
            alt="Asal Technologies"
            className="size-8 grayscale-50"
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">{headerTitle}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {headerDescription}
            </p>
          </div>
        </div>
        {canManage ? (
          <SidebarMenu>
            {managementHeaderOptions.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
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
        ) : null}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[...navigationItems, ...(canManage ? managementItems : [])].map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium">{user?.username}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {user?.email}
              </p>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
