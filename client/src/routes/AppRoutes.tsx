import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";
import { ROUTES } from "@/constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const LandingPage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const AppShell = lazy(() => import("@/layouts/AppShell"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const AppHomePage = lazy(() => import("@/pages/app/AppHomePage"));
const MemoryPage = lazy(() => import("@/pages/app/MemoryPage"));
const AssistantPage = lazy(() => import("@/pages/app/AssistantPage"));
const TasksPage = lazy(() => import("@/pages/app/TasksPage"));
const JournalPage = lazy(() => import("@/pages/app/JournalPage"));
const KnowledgePage = lazy(() => import("@/pages/app/KnowledgePage"));
const SettingsPage = lazy(() => import("@/pages/app/SettingsPage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing is publicly accessible */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />

        {/* Public-only routes (redirects authenticated users to app dashboard) */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Private protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.APP} element={<AppShell />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<AppHomePage />} />
            <Route path="memory" element={<MemoryPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all 404 page */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
export default AppRoutes;
