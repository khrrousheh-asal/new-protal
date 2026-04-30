import type { Project, ProjectAssignment } from "@/types/projects";

const createProjectLogo = (
  initials: string,
  backgroundColor: string,
  textColor = "#111827"
) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="${backgroundColor}" />
      <text
        x="20"
        y="21"
        fill="${textColor}"
        font-family="Inter, Arial, sans-serif"
        font-size="13"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${initials}
      </text>
    </svg>
  `)}`;

export const projects: Project[] = [
  {
    id: "PRJ-1001",
    imageUrl: createProjectLogo("NP", "#FACC15"),
    clientGroupName: "Fintech Strategic Accounts",
    teamName: "Product Engineering",
    clientName: "NovaPay Solutions",
    clientWebsite: "https://novapay.example.com",
    clientJobTitle: "Frontend Engineer",
    clientSeniorityLevel: "senior",
    contractStartDate: "2024-01-15",
    contractType: "full-time",
    contractEndDate: "2026-12-31",
  },
  {
    id: "PRJ-1002",
    imageUrl: createProjectLogo("MC", "#B8E6D3"),
    clientGroupName: "Healthcare Portfolio",
    teamName: "Customer Success",
    clientName: "Medisync Cloud",
    clientWebsite: "https://medisync.example.com",
    clientJobTitle: "Support Analyst",
    clientSeniorityLevel: "mid",
    contractStartDate: "2025-03-01",
    contractType: "part-time",
    contractEndDate: "2026-03-01",
  },
  {
    id: "PRJ-1003",
    imageUrl: createProjectLogo("AR", "#D8C7FF"),
    clientGroupName: "Enterprise Operations",
    teamName: "Operations",
    clientName: "Atlas Retail Group",
    clientWebsite: "https://atlasretail.example.com",
    clientJobTitle: "Operations Coordinator",
    clientSeniorityLevel: "lead",
    contractStartDate: "2023-09-10",
    contractType: "contractor",
    contractEndDate: "2026-09-10",
  },
  {
    id: "PRJ-1004",
    imageUrl: createProjectLogo("CG", "#FECACA"),
    clientGroupName: "Public Sector Programs",
    teamName: "Product Engineering",
    clientName: "CityGrid Services",
    clientWebsite: "https://citygrid.example.com",
    clientJobTitle: "UI Engineer",
    clientSeniorityLevel: "junior",
    contractStartDate: "2025-08-01",
    contractType: "internship",
    contractEndDate: "2026-02-01",
  },
  {
    id: "PRJ-1005",
    imageUrl: createProjectLogo("LW", "#BFDBFE"),
    clientGroupName: "Fintech Strategic Accounts",
    teamName: "Operations",
    clientName: "LedgerWorks",
    clientWebsite: "https://ledgerworks.example.com",
    clientJobTitle: "Program Manager",
    clientSeniorityLevel: "principal",
    contractStartDate: "2022-11-20",
    contractType: "full-time",
    contractEndDate: "2027-11-20",
  },
];

export const projectAssignments: ProjectAssignment[] = [
  { employeeId: "EMP-00412", projectId: "PRJ-1001" },
  { employeeId: "EMP-00412", projectId: "PRJ-1004" },
  { employeeId: "EMP-01984", projectId: "PRJ-1002" },
  { employeeId: "EMP-01984", projectId: "PRJ-1001" },
  { employeeId: "EMP-00703", projectId: "PRJ-1003" },
  { employeeId: "EMP-00703", projectId: "PRJ-1005" },
  { employeeId: "EMP-00703", projectId: "PRJ-9999" },
];
