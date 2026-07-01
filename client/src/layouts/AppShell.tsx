import { Suspense, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { PageTransition } from "@/components/shell/PageTransition";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { GlobalSearch } from "@/features/search/components/GlobalSearch";
import { useSearchStore } from "@/features/search/store/search-store";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { MOBILE_QUERY, useMediaQuery } from "@/hooks/useMediaQuery";
import { useShellStore } from "@/stores/shellStore";
import { NotificationToast } from "@/components/common/NotificationToast";

export default function AppShell() {
  const location = useLocation();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const mobileMenuOpen = useShellStore((state) => state.mobileMenuOpen);
  const toggleCommandPalette = useShellStore((state) => state.toggleCommandPalette);
  const openMobileMenu = useShellStore((state) => state.openMobileMenu);
  const closeMobileMenu = useShellStore((state) => state.closeMobileMenu);

  const handleToggleCommandPalette = useCallback(() => {
    toggleCommandPalette();
  }, [toggleCommandPalette]);

  useKeyboardShortcut("k", handleToggleCommandPalette);
  
  const openSearch = useSearchStore((state) => state.openSearch);
  const handleOpenSearch = useCallback(() => {
    openSearch();
  }, [openSearch]);
  
  useKeyboardShortcut("f", handleOpenSearch);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F] text-white">
      {!isMobile && <Sidebar />}

      {isMobile && mobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          />
          <div className="fixed inset-y-0 left-0 z-40 md:hidden">
            <Sidebar mobile />
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          showMenuButton={isMobile}
          onMenuClick={openMobileMenu}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
      <GlobalSearch />
      <NotificationToast />
    </div>
  );
}

