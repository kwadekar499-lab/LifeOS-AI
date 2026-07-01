import { useEffect } from "react";

type UseTaskKeyboardProps = {
  onNewTask: () => void;
  onFocusSearch?: () => void;
  onCloseDialog: () => void;
  dialogOpen: boolean;
};

export function useTaskKeyboard({
  onNewTask,
  onFocusSearch,
  onCloseDialog,
  dialogOpen,
}: UseTaskKeyboardProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape" && dialogOpen) {
        e.preventDefault();
        onCloseDialog();
        return;
      }

      // Only handle shortcuts when not typing
      if (isInput) return;

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          onNewTask();
          break;
        case "/":
          if (onFocusSearch) {
            e.preventDefault();
            onFocusSearch();
          }
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNewTask, onFocusSearch, onCloseDialog, dialogOpen]);
}
