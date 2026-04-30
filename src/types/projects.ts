export type ProjectContractType = "full-time" | "part-time" | "contractor" | "internship";

export type ProjectSeniorityLevel =
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "principal";

export interface Project {
  id: string;
  imageUrl: string;
  clientGroupName: string;
  teamName: string;
  clientName: string;
  clientWebsite: string;
  clientJobTitle: string;
  clientSeniorityLevel: ProjectSeniorityLevel;
  contractStartDate: string;
  contractType: ProjectContractType;
  contractEndDate: string;
}

export interface ProjectAssignment {
  employeeId: string;
  projectId: string;
}
