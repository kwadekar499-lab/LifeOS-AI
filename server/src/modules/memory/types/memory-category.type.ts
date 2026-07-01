export const MEMORY_CATEGORIES = [
  'preference',
  'project',
  'fact',
  'goal',
  'habit',
  'relationship',
  'decision',
  'ai_generated',
  'general',
] as const;

export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];
