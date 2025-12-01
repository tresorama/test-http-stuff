import z from "zod";

const schemaEmptyStringToUndefined = z
  .string()
  .optional()
  .transform(v => {
    if (v === "") return undefined;
    return v;
  });

const ENV_VARS = z.object({
  // env
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // logging
  MIN_LOG_LEVEL: schemaEmptyStringToUndefined.pipe(
    z.enum(["error", "info", "debug"]).default("info")
  ),
  // app
  PORT: z.coerce.number(),
}).parse(process.env);

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