import React, { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";

type MessageComposerProps = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export const MessageComposer = ({ onSend, disabled }: MessageComposerProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 4000;

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;

    onSend(input.trim());
    setInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remainingChars = maxChars - input.length;

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto w-full px-4 pb-4 md:pb-6">
      <div className="relative flex flex-col rounded-2xl border border-white/10 bg-[#0E0E15] focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
          onKeyDown={handleKeyDown}
          placeholder="Ask LifeOS anything..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent py-4 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none min-h-[52px] max-h-[200px]"
          aria-label="Ask assistant"
        />

        {/* Bottom controls panel */}
        <div className="flex items-center justify-between px-4 pb-3 border-t border-white/[0.02] pt-2 text-[10px] text-white/40">
          <div className="flex items-center gap-2">
            <span>Enter to send, Shift+Enter for newline</span>
          </div>
          <div className={cn("font-mono", remainingChars < 200 ? "text-amber-500" : "")}>
            {input.length} / {maxChars}
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black transition-all",
            (!input.trim() || disabled)
              ? "opacity-30 cursor-not-allowed bg-white/10 text-white/40"
              : "hover:bg-indigo-500 hover:text-white"
          )}
          aria-label="Send message"
        >
          {disabled ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
};
