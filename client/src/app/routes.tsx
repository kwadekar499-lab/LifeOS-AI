import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";
import { ROUTES } from "@/constants/routes";

const LandingPage = lazy(() => import("@/pages/HomePage"));
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
        <Route path={ROUTES.LANDING} element={<LandingPage />} />

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

        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
