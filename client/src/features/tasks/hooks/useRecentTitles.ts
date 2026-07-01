import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "lifeos-recent-task-titles";
const MAX_HISTORY = 20;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function saveHistory(titles: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(titles));
  } catch {
    // ignore storage errors
  }
}

export function useRecentTitles() {
  const [history, setHistory] = useState<string[]>(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addTitle = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const deduped = prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...deduped];
      return next.slice(0, MAX_HISTORY);
    });
  }, []);

  const uniqueHistory = useMemo(() => {
    const seen = new Set<string>();
    return history.filter((t) => {
      const lower = t.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [history]);

  return {
    history: uniqueHistory,
    addTitle,
  };
}