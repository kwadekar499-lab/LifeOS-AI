import { useCallback, useEffect } from "react";
import { useAssistantStore } from "../store/conversation-store";

export function useConversation() {
  const loadConversations = useAssistantStore((state) => state.loadConversations);
  const selectConversation = useAssistantStore((state) => state.selectConversation);
  const createConversation = useAssistantStore((state) => state.createConversation);
  const currentConversation = useAssistantStore((state) => state.currentConversation);
  const conversations = useAssistantStore((state) => state.conversations);
  const isLoading = useAssistantStore((state) => state.isLoading);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleNewConversation = useCallback(async () => {
    await createConversation();
  }, [createConversation]);

  const handleSelectConversation = useCallback(async (id: string) => {
    await selectConversation(id);
  }, [selectConversation]);

  return {
    conversations,
    currentConversation,
    isLoading,
    handleNewConversation,
    handleSelectConversation,
  };
}