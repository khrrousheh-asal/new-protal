import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import About from "@/pages/About";
import type { ReactNode } from "react";

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return null;
  }

  return user ? <Navigate to="/about" replace /> : children;
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

  return <Navigate to={user ? "/about" : "/"} replace />;
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
        path="/about"
        element={
          <RequireAuth>
            <About />
          </RequireAuth>
        }
      />
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}
