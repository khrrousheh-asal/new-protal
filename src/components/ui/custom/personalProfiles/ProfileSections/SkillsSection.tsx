import * as React from "react";
import { Award, Layers3, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserSkill, UserSkillCategory } from "@/types/users";

interface SkillsSectionProps {
  skills: UserSkill[];
}

const CATEGORY_ORDER: UserSkillCategory[] = [
  "frontend",
  "backend",
  "platform",
  "soft-skills",
];

const CATEGORY_LABELS: Record<UserSkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  platform: "Platform",
  "soft-skills": "Soft Skills",
};

const CATEGORY_TONES: Record<UserSkillCategory, string> = {
  frontend: "bg-chart-1/25 text-foreground",
  backend: "bg-chart-3/25 text-foreground",
  platform: "bg-chart-2/20 text-foreground",
  "soft-skills": "bg-chart-5/25 text-foreground",
};

const averageLevel = (skills: UserSkill[]) =>
  Math.round(
    skills.reduce((total, skill) => total + skill.level, 0) / skills.length
  );

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = React.useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        skills: skills.filter((skill) => skill.category === category),
      })).filter((group) => group.skills.length > 0),
    [skills]
  );

  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        No skills are available for this profile.
      </div>
    );
  }

  const overall = averageLevel(skills);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <Card className="border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Skill Overview</CardTitle>
                <CardDescription>
                  Weighted view of current profile strengths.
                </CardDescription>
              </div>
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/20">
                <Sparkles className="size-5" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex aspect-square max-w-52 items-center justify-center rounded-full border-[18px] border-primary/25 bg-background shadow-inner">
              <div className="text-center">
                <p className="text-4xl font-semibold">{overall}%</p>
                <p className="text-xs uppercase text-muted-foreground">
                  Overall
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border/80 p-3">
                <Award className="mb-2 size-4 text-muted-foreground" />
                <p className="text-lg font-semibold">{skills.length}</p>
                <p className="text-xs text-muted-foreground">Tracked skills</p>
              </div>
              <div className="rounded-2xl border border-border/80 p-3">
                <Layers3 className="mb-2 size-4 text-muted-foreground" />
                <p className="text-lg font-semibold">{groupedSkills.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {groupedSkills.map((group) => {
            const categoryAverage = averageLevel(group.skills);

            return (
              <Card key={group.category} className="border-border/80">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {CATEGORY_LABELS[group.category]}
                      </CardTitle>
                      <CardDescription>
                        Average level {categoryAverage}%
                      </CardDescription>
                    </div>
                    <Badge className={CATEGORY_TONES[group.category]}>
                      {group.skills.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.skills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress value={skill.level} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
