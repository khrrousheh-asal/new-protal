import { type User } from "@/types/users";

export const users: User[] = [
  {
    email: "admin@asaltech.com",
    username: "admin",
    password: "123456",
    role: "admin",
    profile: {
      name: "Lena Hartmann",
      directSupervisor: "Marcus Webb",
      status: "active",
      startingDate: "2022-09-01",
      team: "Product Engineering",
      branch: "Rawabi",
      assignedTo: "https://maps.google.com/?q=Rawabi,Palestine",
      onsitePreference: "hybrid",
      employeeId: "EMP-00412",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    email: "user@asaltech.com",
    username: "john",
    password: "123456",
    role: "user",
    profile: {
      name: "John Evans",
      directSupervisor: "Lena Hartmann",
      status: "probation",
      startingDate: "2025-11-18",
      contractEnds: "2026-11-18",
      team: "Customer Success",
      branch: "Nablus",
      assignedTo: "https://maps.google.com/?q=Nablus,Palestine",
      onsitePreference: "onsite",
      employeeId: "EMP-01984",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    email: "manager@asaltech.com",
    username: "sara",
    password: "123456",
    role: "manager",
    profile: {
      name: "Sara Nasser",
      directSupervisor: "Nadia Karim",
      status: "on-leave",
      startingDate: "2020-04-15",
      contractEnds: "2027-04-15",
      team: "Operations",
      branch: "Ramallah",
      assignedTo: "https://maps.google.com/?q=Ramallah,Palestine",
      onsitePreference: "remote",
      employeeId: "EMP-00703",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    },
  },
];
