import { useCallback, useEffect, useRef } from "react";

export function useAutoScroll(dependencies: unknown[] = []): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const threshold = 100;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    isUserAtBottomRef.current = isAtBottom;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isUserAtBottomRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollToBottom = () => {
      container.scrollTop = container.scrollHeight;
    };

    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return containerRef;
}