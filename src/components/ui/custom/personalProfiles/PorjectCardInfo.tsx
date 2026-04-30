import * as React from "react";

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

const formatLabel = (value: string) =>
    value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

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
            <Card className="w-full max-w-sm self-start border border-dashed border-border/80 bg-background/80 lg:w-1/4 lg:max-w-none">
                <CardHeader>
                    <CardTitle>No Assigned Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        This user is not assigned to any project yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <section className="w-full max-w-sm self-start space-y-4 lg:w-1/4 lg:max-w-none">
            <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: projects.length > 1 }}
                className="w-full"
            >
                <CarouselContent>
                    {projects.map((project) => (
                        <CarouselItem key={project.id}>
                            <Card className="w-full border border-border/80 bg-background/95 shadow-lg shadow-primary/5">
                                <CardHeader>
                                    <div className="flex items-start gap-2">
                                        <img
                                            src={project.imageUrl}
                                            alt={`${project.clientName} logo`}
                                            className="size-10 shrink-0 rounded-xl border border-border/70 bg-muted p-1.5 object-contain"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="truncate">{project.clientName}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {project.teamName}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="shrink-0">
                                            {project.id}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Client Group:
                                        </span>{" "}
                                        {project.clientGroupName}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Team:
                                        </span>{" "}
                                        {project.teamName}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Client Job Title:
                                        </span>{" "}
                                        {project.clientJobTitle}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Seniority:
                                        </span>{" "}
                                        {formatLabel(project.clientSeniorityLevel)}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Contract Type:
                                        </span>{" "}
                                        {formatLabel(project.contractType)}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Start Contract:
                                        </span>{" "}
                                        {project.contractStartDate}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Contract End Date:
                                        </span>{" "}
                                        {project.contractEndDate}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-muted-foreground">
                                            Client Website:
                                        </span>{" "}
                                        <a
                                            href={project.clientWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="break-all text-primary underline-offset-4 hover:underline"
                                        >
                                            {project.clientWebsite}
                                        </a>
                                    </p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex w-full justify-end items-center gap-2 sm:self-auto">
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
