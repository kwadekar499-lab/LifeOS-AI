export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  APP: "/app",
  APP_HOME: "/app/home",
  APP_MEMORY: "/app/memory",
  APP_ASSISTANT: "/app/assistant",
  APP_TASKS: "/app/tasks",
  APP_JOURNAL: "/app/journal",
  APP_KNOWLEDGE: "/app/knowledge",
  APP_SETTINGS: "/app/settings",
  NOT_FOUND: "*",
} as const;


export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** @deprecated Use ROUTES.LANDING */
export const HOME = ROUTES.LANDING;
