import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import type { ReactNode } from "react";

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
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}
