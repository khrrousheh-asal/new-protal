import ProfileHeader from "@/components/ui/custom/personalProfiles/ProfileHeader";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="flex w-full max-w-3xl flex-col gap-6">
      <ProfileHeader user={user} />
    </main>
  );
}
