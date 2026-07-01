import { useCallback, useEffect, useRef } from "react";

export function useAutoResizeTextarea(
  value: string,
  maxRows = 8,
): React.RefObject<HTMLTextAreaElement | null> {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
  }, [maxRows]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return textareaRef;
}