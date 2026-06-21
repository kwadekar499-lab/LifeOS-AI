const DEFAULT_APP_ENV = "development" as const;

function readEnv(key: keyof ImportMetaEnv): string | undefined {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export const env = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  appEnv: readEnv("VITE_APP_ENV") ?? DEFAULT_APP_ENV,
  apiBaseUrl: readEnv("VITE_API_BASE_URL") ?? "",
} as const;

export type AppEnv = typeof env;
