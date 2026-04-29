import { useLocation } from "react-router-dom";
import { getWorkspaceByPath } from "@/config/navigation";

export function useWorkspaceTitle() {
  const location = useLocation();

  return getWorkspaceByPath(location.pathname).title;
}
