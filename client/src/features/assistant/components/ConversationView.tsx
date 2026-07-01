import { memo, useMemo } from "react";
import { useAssistantStore } from "../store/assistant-store";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { EmptyConversation } from "./EmptyConversation";
import { MessageBubbleLegacy as MessageBubble } from "./messages/MessageBubbleLegacy";
import { SuggestionCard } from "./SuggestionCard";
import { TypingIndicator } from "./TypingIndicator";
import type { AssistantSuggestion } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type ConversationViewProps = WithClassName & {
  suggestions?: AssistantSuggestion[];
  onSuggestionSelect?: (suggestion: AssistantSuggestion) => void;
  promptInput?: React.ReactNode;
};

export const ConversationView = memo(function ConversationView({
  suggestions = [],
  onSuggestionSelect,
  promptInput,
  className,
}: ConversationViewProps) {
  const messages = useAssistantStore((state) => state.messages);
  const status = useAssistantStore((state) => state.status);
  const isEmpty = messages.length === 0;

  const scrollDependencies = useMemo(
    () => [messages.length, status],
    [messages.length, status],
  );

  const containerRef = useAutoScroll(scrollDependencies);

  if (isEmpty) {
    return (
      <div
        className={cn("flex flex-col flex-1 min-h-0 overflow-y-auto", className)}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <EmptyConversation />
        </div>

        {promptInput}

        {suggestions.length > 0 && (
          <div
            className="shrink-0 mx-auto w-full max-w-2xl px-2 pb-6"
            role="list"
            aria-label="Suggested prompts"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} role="listitem">
                  <SuggestionCard
                    suggestion={suggestion}
                    onSelect={onSuggestionSelect}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div
        ref={containerRef}
        className={cn(
          "flex flex-1 flex-col gap-4 overflow-y-auto px-1 py-4",
          className,
        )}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
          />
        ))}

        {(status === "loading" || status === "streaming") && (
          <TypingIndicator />
        )}
      </div>
      {promptInput}
    </div>
  );
});