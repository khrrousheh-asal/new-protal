import * as React from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CalendarRange,
  ExternalLink,
  Globe2,
  Layers3,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectCardInfoProps {
  projects: Project[];
}

interface ProjectDetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function ProjectDetailRow({ icon, label, value }: ProjectDetailRowProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase leading-none tracking-widest text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-sm font-medium leading-5 text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function ProjectCardInfo({ projects }: ProjectCardInfoProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(1);
  const [projectCount, setProjectCount] = React.useState(projects.length);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const updateSlideState = () => {
      setProjectCount(api.scrollSnapList().length);
      setCurrentIndex(api.selectedScrollSnap() + 1);
    };

    updateSlideState();
    api.on("reInit", updateSlideState);
    api.on("select", updateSlideState);

    return () => {
      api.off("reInit", updateSlideState);
      api.off("select", updateSlideState);
    };
  }, [api]);

  if (projects.length === 0) {
    return (
      <Card className="flex min-h-[28rem] w-full min-w-0 flex-col border border-dashed border-border/80 bg-background/80 lg:sticky lg:top-6 lg:min-h-[calc(100vh-14rem)] lg:w-[22rem] lg:shrink-0 xl:w-[24rem]">
        <CardHeader className="mt-auto">
          <CardTitle>No Assigned Projects</CardTitle>
          <CardDescription>
            Project information will appear here after assignment.
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-auto">
          <p className="text-sm text-muted-foreground">
            This user is not assigned to any project yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="w-full min-w-0 lg:sticky lg:top-6 lg:w-[22rem] lg:shrink-0 xl:w-[24rem]">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: projects.length > 1 }}
        className="w-full"
      >
        <CarouselContent className="items-stretch">
          {projects.map((project) => (
            <CarouselItem key={project.id} className="flex">
              <Card className="flex min-h-[34rem] w-full flex-col border border-border/80 bg-background/95 shadow-sm lg:min-h-[calc(100vh-14rem)]">
                <CardHeader className="border-b border-border/70">
                  <div className="flex items-start gap-3">
                    <img
                      src={project.imageUrl}
                      alt={`${project.clientName} logo`}
                      className="size-12 shrink-0 rounded-2xl border border-border/70 bg-muted p-2 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg">
                        {project.clientName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {project.teamName}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0 font-mono">
                      {project.id}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4 pt-5">
                  <div className="grid gap-3">
                    <ProjectDetailRow
                      icon={<Layers3 className="size-4" />}
                      label="Client Group"
                      value={project.clientGroupName}
                    />
                    <ProjectDetailRow
                      icon={<BriefcaseBusiness className="size-4" />}
                      label="Team"
                      value={project.teamName}
                    />
                    <ProjectDetailRow
                      icon={<UserRound className="size-4" />}
                      label="Client Job Title"
                      value={project.clientJobTitle}
                    />
                    <ProjectDetailRow
                      icon={<ShieldCheck className="size-4" />}
                      label="Seniority"
                      value={formatLabel(project.clientSeniorityLevel)}
                    />
                    <ProjectDetailRow
                      icon={<CalendarRange className="size-4" />}
                      label="Contract"
                      value={formatLabel(project.contractType)}
                    />
                  </div>

                  <div className="mt-auto space-y-3 rounded-2xl border border-border/80 bg-background p-4">
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <CalendarDays className="size-4" />
                          Starts
                        </span>
                        <span className="font-medium">
                          {formatDate(project.contractStartDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <CalendarDays className="size-4" />
                          Ends
                        </span>
                        <span className="font-medium">
                          {formatDate(project.contractEndDate)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border/70 pt-3">
                      <span className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        <Globe2 className="size-3.5" />
                        Website
                      </span>
                      <a
                        href={project.clientWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {project.clientWebsite}
                        <ExternalLink className="size-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/80 bg-background/90 p-2">
          <div className="flex min-w-0 flex-col px-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Assigned Projects
            </span>
            <span className="text-sm font-semibold">{projectCount} active</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentIndex} / {projectCount}
            </Badge>
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
      </Carousel>
    </section>
  );
}
