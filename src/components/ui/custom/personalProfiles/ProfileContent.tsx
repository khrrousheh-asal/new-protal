import { useMemo, useState, type ComponentType } from "react";
import { ClipboardList, ListChecks, Sparkles } from "lucide-react";

import OverviewSection from "@/components/ui/custom/personalProfiles/ProfileSections/OverviewSection";
import PlanSection from "@/components/ui/custom/personalProfiles/ProfileSections/PlanSection";
import SkillsSection from "@/components/ui/custom/personalProfiles/ProfileSections/SkillsSection";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import userService from "@/services/userService";
import type { AuthenticatedUser } from "@/types/users";

type ProfileSectionId = "overview" | "skills" | "plan";

interface ProfileContentProps {
  user: AuthenticatedUser;
}

interface SectionItem {
  id: ProfileSectionId;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const SECTIONS: SectionItem[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "plan", label: "Plan", icon: ListChecks },
];

export default function ProfileContent({ user }: ProfileContentProps) {
  const [activeSection, setActiveSection] =
    useState<ProfileSectionId>("overview");
  const employeeId = user.profile.employeeId;

  const leaveBalances = useMemo(
    () => userService.getLeaveBalancesByEmployeeId(employeeId),
    [employeeId]
  );
  const requests = useMemo(
    () => userService.getRequestsByEmployeeId(employeeId),
    [employeeId]
  );
  const skills = useMemo(
    () => userService.getSkillsByEmployeeId(employeeId),
    [employeeId]
  );
  const planItems = useMemo(
    () => userService.getPlanItemsByEmployeeId(employeeId),
    [employeeId]
  );

  return (
    <section className="min-w-0 flex-1 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Profile Content
          </h2>
          <p className="text-sm text-muted-foreground">
            Overview, skills, and development plan for {user.profile.name}.
          </p>
        </div>

        <Menubar className="h-auto w-full flex-wrap rounded-3xl bg-background/80 sm:w-fit">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <MenubarMenu key={section.id}>
                <MenubarTrigger
                  aria-pressed={isActive}
                  className={cn(
                    "gap-2 px-3 py-1.5",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon className="size-4" />
                  {section.label}
                </MenubarTrigger>
              </MenubarMenu>
            );
          })}
        </Menubar>
      </div>

      {activeSection === "overview" ? (
        <OverviewSection
          employeeId={employeeId}
          leaveBalances={leaveBalances}
          requests={requests}
        />
      ) : null}
      {activeSection === "skills" ? <SkillsSection skills={skills} /> : null}
      {activeSection === "plan" ? (
        <PlanSection planItems={planItems} />
      ) : null}
    </section>
  );
}
