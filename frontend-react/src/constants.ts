import z from "zod";

// get process env

// NOTE: at this point we are already in the frontend code, 
// so we can access only env vars that VITE provides to us
// that are safe to expose to the client
const safeProcessEnv = import.meta.env;

// parse env vars

const ENV_VARS = z.object({
  // env
  DEV: z.boolean(),
  PROD: z.boolean(),
}).parse(safeProcessEnv);

// create constants

export const CONSTANTS = {
  // env
  IS_DEVELOPMENT: ENV_VARS.DEV === true,
  IS_PRODUCTION: ENV_VARS.PROD === true,
};

// NOTE: we can log this also in prod because we are already in the frontend, and we have access only to 
// env vars that VITE provides to us, that are safe to expose to the client
console.log({
  safeProcessEnv,
  ENV_VARS,
  CONSTANTS,
});