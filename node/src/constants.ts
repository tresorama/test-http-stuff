import z from "zod";

// 1. get process env
const PROCESS_ENV = process.env;

// 2. parse env vars
const ENV_VARS = z.object({
  // env
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // logging
  MIN_LOG_LEVEL: z.enum(["error", "info", "debug"]),
  // app
  PORT: z.coerce.number(),
  SERVER_BASE_URL: z.string().min(1).startsWith("http"),
  SERVER_CORS_ALLOWED_CLIENTS_ORIGINS: z
    .string().min(1)
    .transform(v => JSON.parse(v ?? "[]"))
    .pipe(
      z.array(z.string().min(1))
    ),
}).parse(PROCESS_ENV);


// 3. build constants
export const CONSTANTS = {
  // env
  IS_DEVELOPMENT: ENV_VARS.NODE_ENV === "development",
  IS_PRODUCTION: ENV_VARS.NODE_ENV === "production",
  // logging
  MIN_LOG_LEVEL: ENV_VARS.MIN_LOG_LEVEL,
  // api server
  PORT: ENV_VARS.PORT,
  SERVER_BASE_URL: ENV_VARS.SERVER_BASE_URL,
  SERVER_CORS_ALLOWED_CLIENTS_ORIGINS: ENV_VARS.SERVER_CORS_ALLOWED_CLIENTS_ORIGINS,
};

// 4. log once
// if (CONSTANTS.IS_DEVELOPMENT) {
console.log({
  PROCESS_ENV,
  ENV_VARS,
  CONSTANTS,
});
// }