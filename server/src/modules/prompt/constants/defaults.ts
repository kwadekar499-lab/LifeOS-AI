export const PROMPT_BUILDER_VERSION = '1.0.0';

export const DEFAULT_SECTION_SEPARATOR = '\n\n---\n\n';

export const SECTION_HEADERS: Record<string, string> = {
  SYSTEM_PROMPT: 'System Directive',
  ASSISTANT_IDENTITY: 'Assistant Identity',
  USER_PROFILE: 'User Profile',
  CONVERSATION_SUMMARY: 'Conversation Summary',
  CONVERSATION_HISTORY: 'Conversation History',
  RELEVANT_MEMORIES: 'Relevant Memories',
  RELEVANT_TASKS: 'Relevant Tasks',
  RELEVANT_KNOWLEDGE: 'Relevant Knowledge',
  ACTIVE_PROJECT: 'Active Project',
  USER_PROMPT: 'User Request',
  OUTPUT_INSTRUCTIONS: 'Output Instructions',
};

export const MAX_PROMPT_CHARACTERS = 100000;

export const TOKEN_ESTIMATE_FACTOR = 4;
