import React from "react";
import type { CommandItem } from "../types/command";

export function fuzzyMatch(query: string, text: string): boolean {
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  let queryIndex = 0;
  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === normalizedQuery.length;
}

export function getMatchIndices(query: string, text: string): number[] {
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  const indices: number[] = [];

  if (!normalizedQuery) return indices;

  let queryIndex = 0;
  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      indices.push(i);
      queryIndex++;
    }
  }

  return indices;
}

export function filterCommands(items: CommandItem[], query: string): CommandItem[] {
  if (!query.trim()) return items;

  return items.filter((item) => {
    if (fuzzyMatch(query, item.label)) return true;
    if (item.keywords?.some((keyword) => fuzzyMatch(query, keyword))) return true;
    if (item.description && fuzzyMatch(query, item.description)) return true;
    return false;
  });
}

export function highlightText(text: string, indices: number[]): React.ReactNode {
  if (indices.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const index of indices) {
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }
    parts.push(
      <mark key={index} className="rounded-sm bg-white/20 px-0.5 text-inherit">
        {text[index]}
      </mark>,
    );
    lastIndex = index + 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}