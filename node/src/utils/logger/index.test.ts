import { describe, expect, it } from 'vitest';

import { createLogger, wrapLogger } from ".";


describe('logger - test output', () => {
  const LOGGER_KEY = 'ONE';
  const logger = createLogger(LOGGER_KEY);
  logger._setOutputMode('return');

  it('logger.error', () => {
    const OUTPUT = logger.error('E');
    const EXPECTED_OUTPUT = `error [${LOGGER_KEY}] E`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });

  it('logger.info', () => {
    const OUTPUT = logger.info('I');
    const EXPECTED_OUTPUT = `info [${LOGGER_KEY}] I`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });

  it('logger.debug', () => {
    const OUTPUT = logger.debug('D');
    const EXPECTED_OUTPUT = `debug [${LOGGER_KEY}] D`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });
});

describe('logger - wrapLogger - test keys', () => {

  //cretea base logger
  const loggerBase = createLogger('base');
  // create child1 logger from base logger
  const loggerChild1 = wrapLogger(loggerBase, 'child1');
  const loggerChild1SubChild = wrapLogger(loggerChild1, 'subchild');
  // create child2 logger from base logger
  const loggerChild2 = wrapLogger(loggerBase, 'child2');

  // set output mode to return
  loggerBase._setOutputMode('return');

  it('loggerBase', () => {
    const OUTPUT = loggerBase.info('demo');
    const EXPECTED_OUTPUT = `info [base] demo`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });

  it('loggerChild1', () => {
    const OUTPUT = loggerChild1.info('demo');
    const EXPECTED_OUTPUT = `info [base] [child1] demo`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });

  it('loggerChild1SubChild', () => {
    const OUTPUT = loggerChild1SubChild.info('demo');
    const EXPECTED_OUTPUT = `info [base] [child1] [subchild] demo`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });

  it('loggerChild2', () => {
    const OUTPUT = loggerChild2.info('demo');
    const EXPECTED_OUTPUT = `info [base] [child2] demo`;
    expectLoggerOutputMatchPartialString(OUTPUT, EXPECTED_OUTPUT);
  });


});


// util

function expectLoggerOutputMatchPartialString(output: string | undefined, expectedOutput: string) {

  // if outputType work a expected -> output must be a string
  expect(output).toBeTypeOf('string');

  if (typeof output === 'string') {
    expect(output).toEqual(expect.stringContaining(expectedOutput));
  }
}