import React from "react";
import type { AssistantMessage } from "../../types";

type MessageBubbleLegacyProps = {
  message: AssistantMessage;
  isLast?: boolean;
  onRegenerate?: () => void;
  onCopy?: () => void;
};

export const MessageBubbleLegacy = React.memo(({
  message,
  isLast,
  onRegenerate,
  onCopy
}: MessageBubbleLegacyProps) => {
  return (
    <div className="p-4 border border-white/5 rounded-lg my-2 bg-white/5">
      <div className="text-xs font-bold text-white/40 mb-1">{message.role}</div>
      <div className="text-sm text-white/90">{message.content}</div>
      <div className="flex gap-2 mt-2">
        {isLast && onRegenerate && (
          <button onClick={onRegenerate} className="text-xs text-indigo-400 hover:underline" type="button">
            Regenerate
          </button>
        )}
        {onCopy && (
          <button onClick={onCopy} className="text-xs text-white/40 hover:underline" type="button">
            Copy
          </button>
        )}
      </div>
    </div>
  );
});

MessageBubbleLegacy.displayName = "MessageBubbleLegacy";
export default MessageBubbleLegacy;
