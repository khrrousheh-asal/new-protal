import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown, LogOut } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  employeeWorkspaceOption,
  getWorkspaceOptions,
  isActivePath,
  isActiveWorkspace,
  managementRoles,
  type NavigationItem,
  type WorkspaceOption,
} from "@/config/navigation";

function WorkspaceAvatar({ workspace }: { workspace: WorkspaceOption }) {
  const Icon = workspace.icon;

  return (
    <Avatar className="size-8 rounded-lg border border-sidebar-border">
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
                  className="data-active:bg-sidebar-accent/70 data-active:text-sidebar-accent-foreground"
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
  const workspaceOptions = getWorkspaceOptions(canManage);
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
                      className="gap-3 p-2"
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
          label={activeWorkspace.title}
          items={activeWorkspace.items}
          pathname={location.pathname}
        />
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
