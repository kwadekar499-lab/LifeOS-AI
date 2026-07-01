import { useState, useRef, useEffect } from "react";
import { useAssistantStore } from "../../store/conversation-store";

interface MessageComposerProps {
  onSend: (content: string) => void;
  onStop: () => void;
  disabled?: boolean;
}

export function MessageComposer({ onSend, onStop, disabled }: MessageComposerProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSending = useAssistantStore((state) => state.isSending);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || isSending) return;
    
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="shrink-0 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-2xl border border-gray-300 bg-white p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:focus-within:border-blue-500">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="max-h-48 min-h-[24px] flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder-gray-400"
            aria-label="Message input"
          />
          
          {isSending ? (
            <button
              type="button"
              onClick={onStop}
              className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Stop generating"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
              aria-label="Send message"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </form>
  );
}