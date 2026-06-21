import { memo } from "react";
import { EmptyConversation } from "./EmptyConversation";
import { MessageBubble } from "./MessageBubble";
import { SuggestionCard } from "./SuggestionCard";
import type { AssistantMessage, AssistantSuggestion } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type ConversationViewProps = WithClassName & {
  messages: AssistantMessage[];
  suggestions?: AssistantSuggestion[];
  onSuggestionSelect?: (suggestion: AssistantSuggestion) => void;
};

export const ConversationView = memo(function ConversationView({
  messages,
  suggestions = [],
  onSuggestionSelect,
  className,
}: ConversationViewProps) {
  const isEmpty = messages.length === 0;

  if (isEmpty) {
    return (
      <div
        className={cn("flex flex-1 flex-col overflow-y-auto", className)}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        <EmptyConversation />

        {suggestions.length > 0 && (
          <div
            className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 px-2 pb-8 sm:grid-cols-2"
            role="list"
            aria-label="Suggested prompts"
          >
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} role="listitem">
                <SuggestionCard
                  suggestion={suggestion}
                  onSelect={onSuggestionSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-4 overflow-y-auto px-1 py-4",
        className,
      )}
      role="log"
      aria-label="Conversation"
      aria-live="polite"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
});
