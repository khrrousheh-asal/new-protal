import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Attendance from "@/pages/Attendance";
import DocumentRequests from "@/pages/DocumentRequests";
import Evaluation from "@/pages/Evaluation";
import GroupManagement from "@/pages/GroupManagement";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { ReactNode } from "react";
import TeamManagement from "@/pages/TeamManagement";
import type { UserRole } from "@/types/users";

const managementRoles: UserRole[] = ["admin", "manager"];

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return null;
  }

  return user ? <Navigate to="/profile" replace /> : children;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return null;
  }

  return user ? children : <Navigate to="/" replace />;
}

function RequireRole({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
}) {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(user.role) ? (
    children
  ) : (
    <Navigate to="/profile" replace />
  );
}

function AuthRedirect() {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return null;
  }

  return <Navigate to={user ? "/profile" : "/"} replace />;
}

export default function ProtectedRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/document-requests" element={<DocumentRequests />} />
        <Route
          path="/team-management"
          element={
            <RequireRole allowedRoles={managementRoles}>
              <TeamManagement />
            </RequireRole>
          }
        />
        <Route
          path="/group-management"
          element={
            <RequireRole allowedRoles={managementRoles}>
              <GroupManagement />
            </RequireRole>
          }
        />
      </Route>
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}
