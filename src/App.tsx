import ProtectedRoute from "@/routes/ProtectedRoute";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function App() {
  usePageTitle();

  return <ProtectedRoute />;
}
