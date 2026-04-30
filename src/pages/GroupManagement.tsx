import projectService from "@/services/projectService";

export default function GroupManagement() {
  const allProjects = projectService.getAllProjects();

  const groups = Array.from(
    new Set(allProjects.map((project) => project.clientGroupName))
  );

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Group Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage portal groups, membership, and grouped permissions.
        </p>
      </div>

      <section className="rounded-2xl border border-border/80 bg-background/70 p-4">
        <h2 className="text-base font-semibold">Project Group Preview</h2>
        <p className="text-sm text-muted-foreground">
          Active client groups in project data: {groups.join(", ") || "None"}
        </p>
      </section>
    </main>
  );
}
