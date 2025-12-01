import z from "zod";


const ENV_VARS = z.object({
  // env
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // logging
  MIN_LOG_LEVEL: z.enum([
    "error",
    "info",
    "debug",
  ]).default("info"),
  // api server
  PORT: z.coerce.number(),
}).parse({
  NODE_ENV: process.env.NODE_ENV,
  MIN_LOG_LEVEL: 'debug',
  PORT: 9000,
});

export const CONSTANTS = {
  // env
  IS_DEVELOPMENT: ENV_VARS.NODE_ENV === "development",
  IS_PRODUCTION: ENV_VARS.NODE_ENV === "production",
  // logging
  MIN_LOG_LEVEL: ENV_VARS.MIN_LOG_LEVEL,
  // api server
  PORT: ENV_VARS.PORT,
};

if (CONSTANTS.IS_DEVELOPMENT) {
  console.log({
    ENV_VARS,
    CONSTANTS,
  });
}