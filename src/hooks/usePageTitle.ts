import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_TITLE, getRouteTitle } from "@/config/navigation";

export function usePageTitle() {
  const location = useLocation();
  const routeTitle = getRouteTitle(location.pathname);

  useEffect(() => {
    document.title = `${APP_TITLE} | ${routeTitle}`;
  }, [routeTitle]);

  return routeTitle;
}
