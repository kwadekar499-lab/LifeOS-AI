import { useEffect } from "react";

type KeyboardShortcutOptions = {
  enabled?: boolean;
};

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {},
): void {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      const isModKey = event.metaKey || event.ctrlKey;
      if (!isModKey || event.key.toLowerCase() !== key.toLowerCase()) return;

      event.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, enabled]);
}

export function useEscapeKey(callback: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, enabled]);
}
