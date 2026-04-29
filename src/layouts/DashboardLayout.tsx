import { Outlet } from "react-router-dom";
import AppsideBar from "@/components/ui/custom/AppsideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWorkspaceTitle } from "@/hooks/useWorkspaceTitle";

export default function DashboardLayout() {
  const workspaceTitle = useWorkspaceTitle();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppsideBar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{workspaceTitle}</p>
            </div>
          </header>
          <div className="flex flex-1 flex-col p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
