import type { AssistantMessageRole } from "../types/assistant-message";

const ROLE_LABELS: Record<AssistantMessageRole, string> = {
  user: "You",
  assistant: "LifeOS",
  system: "System",
};

export function formatMessageRole(role: AssistantMessageRole): string {
  return ROLE_LABELS[role];
}

export function formatMessageTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
