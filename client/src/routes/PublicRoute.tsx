import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { PageLoader } from "@/components/common/PageLoader";
import { ROUTES } from "@/constants/routes";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0A0A0F]">
        <PageLoader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.APP_HOME} replace />;
  }

  return <Outlet />;
}
