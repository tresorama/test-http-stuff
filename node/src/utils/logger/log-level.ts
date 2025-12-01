import { CONSTANTS } from "@/constants";

// all log level we support

const LOG_LEVEL_MAP = {
  error: 2,
  info: 1,
  debug: 0,
} as const;

export type LogLevelKey = keyof typeof LOG_LEVEL_MAP;


// the current minimum log level to print (lower level are skipped)
const MIN_LOG_LEVEL_ENTRY = LOG_LEVEL_MAP[CONSTANTS.MIN_LOG_LEVEL];


/** Check if a log level is printable, baed on the current minimum log level */
export function isPrintable(logLevel: LogLevelKey) {
  const minValue = MIN_LOG_LEVEL_ENTRY;
  const value = LOG_LEVEL_MAP[logLevel];
  if (value >= minValue) return true;
  return false;
}