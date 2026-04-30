import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import {
  CalendarDays,
  CalendarX2,
  ExternalLink,
  GitBranch,
  Hash,
  Layers,
  MapPin,
  ShieldCheck,
  Wifi,
  WifiOff,
  Building2,
} from "lucide-react";
import type {
  AuthenticatedUser,
  EmploymentStatus,
  OnsitePreference,
} from "@/types/users";

export interface ProfileHeaderProps {
  user: AuthenticatedUser;
}

const STATUS_MAP: Record<
  EmploymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; dot: string }
> = {
  active: { label: "Active", variant: "default", dot: "bg-emerald-400" },
  probation: { label: "Probation", variant: "secondary", dot: "bg-amber-400" },
  "on-leave": { label: "On Leave", variant: "outline", dot: "bg-sky-400" },
  terminated: { label: "Terminated", variant: "destructive", dot: "bg-red-500" },
};

const ONSITE_MAP: Record<OnsitePreference, { label: string; icon: ReactNode }> = {
  remote: { label: "Remote", icon: <WifiOff className="h-3.5 w-3.5" /> },
  onsite: { label: "Onsite", icon: <Building2 className="h-3.5 w-3.5" /> },
  hybrid: { label: "Hybrid", icon: <Wifi className="h-3.5 w-3.5" /> },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ChipProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  tooltip?: string;
}

function InfoChip({ icon, label, value, tooltip }: ChipProps) {
  const inner = (
    <div className="group flex min-w-0 w-full items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="mb-0.5 text-[10px] font-medium uppercase tracking-widest leading-none text-muted-foreground/50">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  if (!tooltip) {
    return inner;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-default">{inner}</div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const {
    name,
    directSupervisor,
    status,
    startingDate,
    contractEnds,
    team,
    branch,
    assignedTo,
    onsitePreference,
    employeeId,
    avatarUrl,
  } = user.profile;

  const { label: statusLabel, variant: statusVariant, dot } = STATUS_MAP[status];
  const { label: onsiteLabel, icon: onsiteIcon } = ONSITE_MAP[onsitePreference];

  return (
    <div className="w-full min-w-0 space-y-5 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16 shrink-0 rounded-2xl ring-2 ring-border shadow-sm">
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
          <AvatarFallback className="rounded-2xl bg-muted text-lg font-semibold">
            {initials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
            <Badge
              variant={statusVariant}
              className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
            >
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${dot}`} />
              {statusLabel}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Reports to</span>
              <span className="font-medium text-foreground">{directSupervisor}</span>
            </span>

            <span className="hidden text-border sm:inline">.</span>

            <span className="flex items-center gap-1 font-mono text-xs">
              <Hash className="h-3 w-3 shrink-0" />
              {employeeId}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="self-start inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:self-center"
        >
          {onsiteIcon}
          {onsiteLabel}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        <InfoChip icon={<Layers className="h-4 w-4" />} label="Team" value={team} />
        <InfoChip
          icon={<GitBranch className="h-4 w-4" />}
          label="Branch"
          value={
            assignedTo ? (
              <a
                href={assignedTo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary transition-colors hover:underline underline-offset-2"
              >
                {branch}
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </a>
            ) : (
              branch
            )
          }
          tooltip={assignedTo ? "Open location in maps" : undefined}
        />
        <InfoChip
          icon={<CalendarDays className="h-4 w-4" />}
          label="Started"
          value={fmt(startingDate)}
          tooltip={`Tenure: ${Math.floor(
            (Date.now() - new Date(startingDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
          )} months`}
        />
        <InfoChip
          icon={<CalendarX2 className="h-4 w-4" />}
          label="Contract ends"
          value={contractEnds ? fmt(contractEnds) : "Permanent"}
          tooltip={contractEnds ? `Ends on ${fmt(contractEnds)}` : "No fixed end date"}
        />
        <InfoChip
          icon={<MapPin className="h-4 w-4" />}
          label="Preference"
          value={onsiteLabel}
        />
      </div>
    </div>
  );
}
