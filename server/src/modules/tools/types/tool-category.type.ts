export const TOOL_CATEGORIES = [
  'Tasks',
  'Memory',
  'Knowledge',
  'Journal',
  'Conversation',
  'Files',
  'Calendar',
  'Notifications',
  'System',
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];
