import projectService from "@/services/projectService";

export default function TeamManagement() {
  const allProjects = projectService.getAllProjects();

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Team Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage employee team assignments and team-level access.
        </p>
      </div>

      <section className="rounded-2xl border border-border/80 bg-background/70 p-4">
        <h2 className="text-base font-semibold">Project Data Preview</h2>
        <p className="text-sm text-muted-foreground">
          Total projects available for team assignment views: {allProjects.length}
        </p>
      </section>
    </main>
  );
}
