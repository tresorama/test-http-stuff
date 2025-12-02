import { createLogger } from "@/utils/logger";
import type { Request, RequestHandler, Response } from "express";


const logger = createLogger('mrl');

export const middlewareRequestLogger: RequestHandler = (req, res, next) => {
  const responseStartTime = Date.now();
  const requestId = Math.random().toString(36).slice(2, 9);

  const originalResEnd = res.end;
  // @ts-expect-error
  res.end = function (chunk, encoding, callback) {
    logEverything(req, res, requestId, responseStartTime);
    return originalResEnd.call(res, chunk, encoding, callback);
  };

  next();
};


function logEverything(req: Request, res: Response, requestId: string, startTime: number) {
  const reqData = extractRequestData(req);
  const resData = extractResponseData(res, startTime);
  logger.info(` [${requestId}] ${resData.statusCode} ${reqData.method} ${reqData.url.path_with_query} - ${resData.responseTime}ms`);
  logger.debug(`[${requestId}]`, { REQUEST: reqData, RESPONSE: resData });
}

function extractRequestData(req: Request) {
  return {
    method: req.method,
    url: {
      full: req.protocol + '://' + req.get('host') + req.originalUrl,
      path: req.path,
      path_with_query: req.originalUrl,
      query: req.query,
    },
    cookies_parsed: req.headers.cookie?.split('; ').reduce(
      (acc, cookieRaw) => {
        const [name, value] = cookieRaw.split('=');
        acc[name] = value;
        return acc;
      },
      {} as Record<string, string>
    ),
    // cookies_raw: req.headers.cookie,
    // headers: req.headers,
  };
}

function extractResponseData(res: Response, startTime: number) {
  return {
    statusCode: res.statusCode,
    headers: res.getHeaders(),
    responseTime: Date.now() - startTime,
  };
}

