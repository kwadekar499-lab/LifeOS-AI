import { memo } from "react";
import type { AssistantMessage } from "../types";
import { formatMessageRole, formatMessageTime } from "../utils/format";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type MessageBubbleProps = WithClassName & {
  message: AssistantMessage;
};

export const MessageBubble = memo(function MessageBubble({
  message,
  className,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <article
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        className,
      )}
      aria-label={`${formatMessageRole(message.role)} message`}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser &&
            "bg-white text-[#0A0A0F] rounded-br-md",
          !isUser &&
            !isSystem &&
            "bg-white/[0.06] text-white/90 ring-1 ring-white/[0.08] rounded-bl-md",
          isSystem &&
            "bg-white/[0.02] text-white/40 ring-1 ring-white/[0.04] text-xs italic",
        )}
      >
        {!isUser && !isSystem && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
            {formatMessageRole(message.role)}
          </p>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
        <time
          dateTime={message.createdAt}
          className={cn(
            "mt-2 block text-[10px]",
            isUser ? "text-[#0A0A0F]/40" : "text-white/25",
          )}
        >
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
    </article>
  );
});
