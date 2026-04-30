import { projectAssignments, projects } from "@/dump/dummy_projects";
import type { Project, ProjectAssignment } from "@/types/projects";

const cloneProject = (project: Project): Project => ({ ...project });
const cloneAssignment = (
  assignment: ProjectAssignment
): ProjectAssignment => ({ ...assignment });

const getAllProjects = (): Project[] => projects.map(cloneProject);

const getAllAssignments = (): ProjectAssignment[] =>
  projectAssignments.map(cloneAssignment);

const getProjectById = (projectId: string): Project | null => {
  const project = projects.find((entry) => entry.id === projectId);

  return project ? cloneProject(project) : null;
};

const getAssignmentsByEmployeeId = (employeeId: string): ProjectAssignment[] =>
  projectAssignments
    .filter((assignment) => assignment.employeeId === employeeId)
    .map(cloneAssignment);

const getProjectsByEmployeeId = (employeeId: string): Project[] => {
  const uniqueProjectIds = new Set(
    getAssignmentsByEmployeeId(employeeId).map(
      (assignment) => assignment.projectId
    )
  );

  return [...uniqueProjectIds]
    .map((projectId) => getProjectById(projectId))
    .filter((project): project is Project => project !== null);
};

const getProjectsByTeamName = (teamName: string): Project[] =>
  projects
    .filter((project) => project.teamName === teamName)
    .map(cloneProject);

const getProjectsByClientGroupName = (clientGroupName: string): Project[] =>
  projects
    .filter((project) => project.clientGroupName === clientGroupName)
    .map(cloneProject);

const projectService = {
  getAllProjects,
  getAllAssignments,
  getProjectById,
  getAssignmentsByEmployeeId,
  getProjectsByEmployeeId,
  getProjectsByTeamName,
  getProjectsByClientGroupName,
};

export default projectService;
