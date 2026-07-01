import { useAssistantStore } from "../store/conversation-store";

export function useSidebarToggle() {
  const setSidebarOpen = useAssistantStore((state) => state.setSidebarOpen);
  const isSidebarOpen = useAssistantStore((state) => state.isSidebarOpen);

  const toggle = () => setSidebarOpen(!isSidebarOpen);
  const open = () => setSidebarOpen(true);
  const close = () => setSidebarOpen(false);

  return { isSidebarOpen, toggle, open, close };
}