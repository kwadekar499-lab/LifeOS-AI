import { useCallback } from "react";
import { useAssistantStore } from "../store/assistant-store";

export function useAssistantChat() {
  const {
    messages,
    status,
    input,
    error,
    setInput,
    sendMessage,
    stopGenerating,
    clearConversation,
    regenerateLastMessage,
    copyMessage,
    setContext,
    setStatus,
    setError,
  } = useAssistantStore();

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || status === "loading" || status === "streaming") return;
    sendMessage(trimmed);
  }, [input, status, sendMessage]);

  const handleSuggestionSelect = useCallback(
    (suggestion: { prompt: string }) => {
      if (status === "loading" || status === "streaming") return;
      setInput(suggestion.prompt);
    },
    [status, setInput],
  );

  const handleStop = useCallback(() => {
    stopGenerating();
  }, [stopGenerating]);

  const handleRegenerate = useCallback(() => {
    if (status === "loading" || status === "streaming") return;
    regenerateLastMessage();
  }, [status, regenerateLastMessage]);

  const handleCopy = useCallback(
    (messageId: string) => {
      copyMessage(messageId);
    },
    [copyMessage],
  );

  return {
    messages,
    status,
    input,
    error,
    handleSend,
    handleSuggestionSelect,
    handleStop,
    handleRegenerate,
    handleCopy,
    handleInputChange: setInput,
    handleClear: clearConversation,
    handleSetContext: setContext,
    handleSetStatus: setStatus,
    handleSetError: setError,
  };
}