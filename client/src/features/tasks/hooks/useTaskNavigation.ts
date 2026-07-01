import { useCallback, useMemo, useRef, useReducer, useEffect } from "react";

type UseTaskNavigationProps = {
  tasks: { id: string }[];
};

type State = {
  highlightedId: string | null;
  hoveredId: string | null;
};

type Action =
  | { type: "setHighlighted"; id: string | null }
  | { type: "setHovered"; id: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setHighlighted":
      return { ...state, highlightedId: action.id };
    case "setHovered":
      return { ...state, hoveredId: action.id };
    default:
      return state;
  }
}

export function useTaskNavigation({
  tasks,
}: UseTaskNavigationProps) {
  const [state, dispatch] = useReducer(reducer, {
    highlightedId: null,
    hoveredId: null,
  });
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Sync highlightedId with first task when tasks change
  const tasksKey = useMemo(() => tasks.map(t => t.id).join(","), [tasks]);
  useEffect(() => {
    dispatch({ type: "setHighlighted", id: tasks.length > 0 ? tasks[0]!.id : null });
    // We intentionally use `tasksKey` instead of `tasks` to avoid
    // cascading renders from syncing state on every tasks reference change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksKey]);

  const registerCard = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) {
      cardRefs.current!.set(id, el);
    } else {
      cardRefs.current!.delete(id);
    }
  }, []);

  const scrollToCard = useCallback((id: string) => {
    const el = cardRefs.current.get(id);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (tasks.length === 0) return;

      const currentIndex = tasks.findIndex((t) => t.id === state.highlightedId);

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight": {
          e.preventDefault();
          const nextIndex = currentIndex < tasks.length - 1 ? currentIndex + 1 : 0;
          const nextId = tasks[nextIndex]?.id ?? null;
          dispatch({ type: "setHighlighted", id: nextId });
          if (nextId) scrollToCard(nextId);
          return;
        }
        case "ArrowUp":
        case "ArrowLeft": {
          e.preventDefault();
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : tasks.length - 1;
          const nextId = tasks[nextIndex]?.id ?? null;
          dispatch({ type: "setHighlighted", id: nextId });
          if (nextId) scrollToCard(nextId);
          return;
        }
        default:
          return;
      }

    },
    [tasks, state.highlightedId, scrollToCard],
  );

  const handleMouseEnter = useCallback((id: string) => {
    dispatch({ type: "setHovered", id });
    dispatch({ type: "setHighlighted", id });
  }, []);

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: "setHovered", id: null });
  }, []);

  // Listen for search selection events to highlight and scroll to a task
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ taskId: string }>;
      const { taskId } = customEvent.detail;
      if (taskId) {
        dispatch({ type: "setHighlighted", id: taskId });
        // Small delay to allow the DOM to update after navigation
        setTimeout(() => scrollToCard(taskId), 100);
      }
    };

    window.addEventListener("search-select-task", handler);
    return () => window.removeEventListener("search-select-task", handler);
  }, [scrollToCard]);

  return {
    highlightedId: state.highlightedId,
    hoveredId: state.hoveredId,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    registerCard,
    isHighlighted: (id: string) => id === state.highlightedId,
    isHovered: (id: string) => id === state.hoveredId,
  };
}