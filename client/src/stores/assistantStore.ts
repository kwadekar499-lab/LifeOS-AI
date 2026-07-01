import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AssistantState {
  activeConversationId: string | null;
  isRightPanelOpen: boolean;
  setActiveConversationId: (id: string | null) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      activeConversationId: null,
      isRightPanelOpen: false,

      setActiveConversationId: (id) => set({ activeConversationId: id }),
      toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
      setRightPanelOpen: (open) => set({ isRightPanelOpen: open }),
    }),
    {
      name: "lifeos-assistant-store",
      partialize: (state) => ({
        activeConversationId: state.activeConversationId,
        isRightPanelOpen: state.isRightPanelOpen,
      }),
    }
  )
);
