import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShellStore } from "@/stores/shellStore";
import { COMMAND_ITEMS, COMMAND_GROUPS, FAVORITES_STORAGE_KEY, MAX_RECENT_ITEMS, RECENT_STORAGE_KEY } from "@/features/command/constants/commands";
import { filterCommands } from "@/features/command/utils/fuzzySearch";
import type { CommandItem, CommandPaletteState } from "@/features/command/types/command";


const NAVIGATION_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
  "Enter",
  "Tab",
]);

export interface UseCommandPaletteReturn {
  state: CommandPaletteState;
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  addRecent: (route: string) => void;
  toggleFavorite: (id: string) => void;
  executeCommand: (item: CommandItem) => void;
  selectItem: (index: number) => void;
  navigateItems: (direction: "up" | "down" | "first" | "last") => void;
  filteredItems: CommandItem[];
  groupedItems: Array<{ category: string; label: string; items: CommandItem[] }>;
  flatItems: CommandItem[];
  listRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  favoriteIds: string[];
}

const initialState: CommandPaletteState = {
  isOpen: false,
  searchQuery: "",
  selectedIndex: 0,
  recentItems: [],
  favoriteIds: [],
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function useCommandPalette() {
  const navigate = useNavigate();
  const [state, setState] = useState<CommandPaletteState>(() => ({
    ...initialState,
    recentItems: loadFromStorage<string[]>(RECENT_STORAGE_KEY, []),
    favoriteIds: loadFromStorage<string[]>(FAVORITES_STORAGE_KEY, []),
  }));

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<Element | null>(null);
  const navigateItemsRef = useRef<(direction: "up" | "down" | "first" | "last") => void>(() => {});
  const selectItemRef = useRef<(index: number) => void>(() => {});
  const selectedIndexRef = useRef(state.selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = state.selectedIndex;
  }, [state.selectedIndex]);

  const open = useCallback(() => {
    previousActiveElementRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    setState((prev) => ({ ...prev, isOpen: true, searchQuery: "", selectedIndex: 0 }));
  }, []);

  const closeCommandPalette = useShellStore((state) => state.closeCommandPalette);

  const close = useCallback(() => {
    document.body.style.overflow = "";
    setState((prev) => ({ ...prev, isOpen: false, searchQuery: "", selectedIndex: 0 }));
    closeCommandPalette();
    if (previousActiveElementRef.current instanceof HTMLElement) {
      previousActiveElementRef.current.focus();
    }
  }, [closeCommandPalette]);

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query, selectedIndex: 0 }));
  }, []);

  const setSelectedIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, selectedIndex: index }));
  }, []);

  const addRecent = useCallback((route: string) => {
    setState((prev) => {
      const recent = [route, ...prev.recentItems.filter((r) => r !== route)].slice(0, MAX_RECENT_ITEMS);
      saveToStorage(RECENT_STORAGE_KEY, recent);
      return { ...prev, recentItems: recent };
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((prev) => {
      const favorites = prev.favoriteIds.includes(id)
        ? prev.favoriteIds.filter((f) => f !== id)
        : [...prev.favoriteIds, id];
      saveToStorage(FAVORITES_STORAGE_KEY, favorites);
      return { ...prev, favoriteIds: favorites };
    });
  }, []);

  const executeCommand = useCallback(
    (item: CommandItem) => {
      if (item.route) {
        addRecent(item.route);
        navigate(item.route);
      }
      item.action();
      close();
    },
    [addRecent, close, navigate],
  );

  const filteredItems = filterCommands(COMMAND_ITEMS, state.searchQuery) as CommandItem[];

  const groupedItems = useMemo(() => {
    const baseGroups = COMMAND_GROUPS.map((group) => ({
      ...group,
      items: filteredItems.filter((item) => item.category === group.category),
    })).filter((group) => group.items.length > 0);

    if (state.searchQuery.trim()) {
      return baseGroups;
    }

    const favoriteItems = filteredItems.filter((item) => state.favoriteIds.includes(item.id));
    const recentItems = state.recentItems
      .map((route) => filteredItems.find((item) => item.route === route))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const groups: Array<{ category: string; label: string; items: CommandItem[] }> = [];
    if (favoriteItems.length > 0) {
      groups.push({ category: "favorites", label: "Favorites", items: favoriteItems });
    }
    if (recentItems.length > 0) {
      groups.push({ category: "recent", label: "Recent", items: recentItems });
    }
    groups.push(...baseGroups);

    return groups;
  }, [filteredItems, state.searchQuery, state.favoriteIds, state.recentItems]);

  const flatItems = useMemo(() => {
    return groupedItems.flatMap((group) => group.items);
  }, [groupedItems]);

  const effectiveSelectedIndex = flatItems.length === 0
    ? 0
    : Math.min(state.selectedIndex, flatItems.length - 1);

  const selectItem = useCallback(
    (index: number) => {
      const item = flatItems[index];
      if (item) {
        executeCommand(item);
      }
    },
    [executeCommand, flatItems],
  );

  const navigateItems = useCallback(
    (direction: "up" | "down" | "first" | "last") => {
      setState((prev) => {
        if (flatItems.length === 0) return prev;
        let nextIndex = prev.selectedIndex;
        if (direction === "up") nextIndex = Math.max(0, prev.selectedIndex - 1);
        else if (direction === "down") nextIndex = Math.min(flatItems.length - 1, prev.selectedIndex + 1);
        else if (direction === "first") nextIndex = 0;
        else if (direction === "last") nextIndex = flatItems.length - 1;
        return { ...prev, selectedIndex: nextIndex };
      });
    },
    [flatItems],
  );

  useEffect(() => {
    navigateItemsRef.current = navigateItems;
    selectItemRef.current = selectItem;
  }, [navigateItems, selectItem]);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!NAVIGATION_KEYS.has(event.key)) return;

      event.preventDefault();
      event.stopPropagation();

      if (event.key === "ArrowDown") {
        navigateItemsRef.current("down");
      } else if (event.key === "ArrowUp") {
        navigateItemsRef.current("up");
      } else if (event.key === "Home") {
        navigateItemsRef.current("first");
      } else if (event.key === "End") {
        navigateItemsRef.current("last");
      } else if (event.key === "Enter") {
        selectItemRef.current(selectedIndexRef.current);
      } else if (event.key === "Tab") {
        navigateItemsRef.current(event.shiftKey ? "up" : "down");
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen || !listRef.current) return;
    const selected = listRef.current.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: "nearest" });
  }, [state.isOpen, state.selectedIndex]);

  return {
    state: {
      ...state,
      selectedIndex: effectiveSelectedIndex,
    },
    open,
    close,
    setQuery,
    setSelectedIndex,
    addRecent,
    toggleFavorite,
    executeCommand,
    selectItem,
    navigateItems,
    filteredItems,
    groupedItems,
    flatItems,
    listRef,
    inputRef,
    favoriteIds: state.favoriteIds,
  };
}