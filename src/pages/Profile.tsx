import ProjectCardInfo from "@/components/ui/custom/personalProfiles/PorjectCardInfo";
import ProfileHeader from "@/components/ui/custom/personalProfiles/ProfileHeader";
import { useAuth } from "@/hooks/useAuth";
import projectService from "@/services/projectService";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const userProjects = projectService.getProjectsByEmployeeId(
    user.profile.employeeId
  );

  return (
    <main className="flex w-full flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <ProfileHeader user={user} />
      <ProjectCardInfo projects={userProjects} />
    </main>
  );
}
