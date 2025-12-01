import { type LogLevelKey, isPrintable } from './log-level';
import { isArray, isNumber, isObject, isString } from './type-guards';

// public api

/** Reurn type of createLogger */
export type Logger = ReturnType<typeof createLogger>;

/** Create a {@link Logger} instance */
export function createLogger(name: string) {

  type LoggerInternalState = {
    outputMode: 'print' | 'return';
  };
  const internalState: LoggerInternalState = {
    outputMode: 'print',
  };

  const logger = {
    _setOutputMode: (mode: LoggerInternalState['outputMode']) => {
      internalState.outputMode = mode;
    },
    error: (...args: unknown[]) => {
      return print(internalState.outputMode, 'error', name, ...args);
    },
    info: (...args: unknown[]) => {
      return print(internalState.outputMode, 'info', name, ...args);
    },
    debug: (...args: unknown[]) => {
      return print(internalState.outputMode, 'debug', name, ...args);
    },
  };

  return logger;
}

/** Return a {@link Logger} with key augmented. */
export function wrapLogger(logger: Logger, logPrefix: string): Logger {
  return {
    ...logger,
    error: (...args: unknown[]) => logger.error(`[${logPrefix}]`, ...args),
    info: (...args: unknown[]) => logger.info(`[${logPrefix}]`, ...args),
    debug: (...args: unknown[]) => logger.debug(`[${logPrefix}]`, ...args),
  };
};



// internal api

function print(
  outputType: 'print' | 'return',
  logLevelKey: LogLevelKey,
  name: string,
  ...args: unknown[]
) {

  // skipp if not printable (min log level clause)
  const isPrintableThisLogLevel = isPrintable(logLevelKey);
  if (!isPrintableThisLogLevel) return;


  // parse stuff
  // NOTE: child loggers put their keys in args array
  const argsChildLoggerKeys: { keys: string[], done: boolean; } = {
    keys: [],
    done: false,
  };
  const argsNormal: unknown[] = [];
  for (const arg of args) {
    if (!argsChildLoggerKeys.done && isChildLoggerKey(arg)) {
      argsChildLoggerKeys.keys.push(arg);
    } else {
      argsNormal.push(arg);
      argsChildLoggerKeys.done = true;
    }
  }
  // console.log({
  //   args,
  //   argsChildLoggerKeys,
  //   argsNormal
  // });

  // print
  const outputParts = [
    new Date().toISOString(),
    `${logLevelKey}`,
    `[${name}]`,
    ...argsChildLoggerKeys.keys,
    argsNormal
      .map((arg, index) => {
        try {
          if (isString(arg) || isNumber(arg)) {
            // if is the first arg -> don't go to next line
            if (index === 0) {
              return `${arg}`;
            }
            return `\n${arg}`;
          }

          if (arg instanceof Error) {
            const json = {
              name: arg.name,
              message: arg.message,
              stack: arg.stack,
            };
            return `\nError Intance ${JSON.stringify(json, null, 2)}`;
          }

          if (isObject(arg)) {
            return `\n${JSON.stringify(arg, null, 2)}`;
          }

          if (isArray(arg)) {
            return `\n${JSON.stringify(arg, null, 2)}`;
          }



          return String(arg);

        } catch (error) {
          // error parsing or prinrting -> do nothing
          return "__FILTER_OUT_ME__";
        }
      })
      .filter((arg) => arg !== "__FILTER_OUT_ME__")
      .join(" ")
  ];
  // console.log(outputParts);
  const output = outputParts.join(' ');


  if (outputType === 'print') {
    console.log(output);
  } else {
    return output;
  }

}


function isChildLoggerKey(arg: unknown): arg is string {
  return isString(arg) && arg.startsWith("[") && arg.endsWith("]");
}