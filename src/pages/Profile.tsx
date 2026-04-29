import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { logout, user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="flex w-full max-w-3xl flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Signed in as
        </p>
        <h1 className="text-3xl font-semibold">{user.username}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        <p className="text-sm font-medium capitalize">Role: {user.role}</p>
      </section>

      <Button type="button" className="w-fit" onClick={logout}>
        Logout
      </Button>
    </main>
  );
}
