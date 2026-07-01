import { useRef, useEffect } from "react";
import type { AssistantMessage } from "../../types";
import { MessageBubbleLegacy as MessageBubble } from "./MessageBubbleLegacy";
import { TypingIndicator } from "../TypingIndicator";


interface MessageListProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  onRegenerate: (messageId: string) => void;
  onCopy: (messageId: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  isStreaming,
  onRegenerate,
  onCopy,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6"
      role="log"
      aria-label="Conversation messages"
      aria-live="polite"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
            onRegenerate={() => onRegenerate(message.id)}
            onCopy={() => onCopy(message.id)}
          />
        ))}

        {isStreaming && <TypingIndicator />}

        {isLoading && !isStreaming && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}