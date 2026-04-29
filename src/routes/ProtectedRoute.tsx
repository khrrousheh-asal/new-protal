import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Attendance from "@/pages/Attendance";
import DocumentRequests from "@/pages/DocumentRequests";
import Evaluation from "@/pages/Evaluation";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { ReactNode } from "react";
import IndividualEvaluations from "@/pages/IndividualEvaluations";
import IndividualProfiles from "@/pages/IndividualProfiles";
import TeamAttendanceSheet from "@/pages/TeamAttendanceSheet";
import TeamExpansionRequests from "@/pages/TeamExpansionRequests";
import TeamOverviewPerformance from "@/pages/TeamOverviewPerformance";
import TeamsPerformance from "@/pages/TeamsPerformance";
import { managementRoles } from "@/config/navigation";
import type { UserRole } from "@/types/users";

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

function ManagementRoute({ children }: { children: ReactNode }) {
  return <RequireRole allowedRoles={managementRoles}>{children}</RequireRole>;
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
            <ManagementRoute>
              <Navigate to="/team-management/overview-performance" replace />
            </ManagementRoute>
          }
        />
        <Route
          path="/team-management/overview-performance"
          element={
            <ManagementRoute>
              <TeamOverviewPerformance />
            </ManagementRoute>
          }
        />
        <Route
          path="/team-management/individual-evaluations"
          element={
            <ManagementRoute>
              <IndividualEvaluations />
            </ManagementRoute>
          }
        />
        <Route
          path="/team-management/team-attendance-sheet"
          element={
            <ManagementRoute>
              <TeamAttendanceSheet />
            </ManagementRoute>
          }
        />
        <Route
          path="/group-management"
          element={
            <ManagementRoute>
              <Navigate to="/group-management/teams-performance" replace />
            </ManagementRoute>
          }
        />
        <Route
          path="/group-management/teams-performance"
          element={
            <ManagementRoute>
              <TeamsPerformance />
            </ManagementRoute>
          }
        />
        <Route
          path="/group-management/individual-profiles"
          element={
            <ManagementRoute>
              <IndividualProfiles />
            </ManagementRoute>
          }
        />
        <Route
          path="/group-management/team-expansion-requests"
          element={
            <ManagementRoute>
              <TeamExpansionRequests />
            </ManagementRoute>
          }
        />
      </Route>
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}
