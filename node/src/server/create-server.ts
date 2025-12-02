import path from 'path';
import { fileURLToPath } from 'url';
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors';

import { middlewareRequestLogger } from './middleware/request-logger.';
import { homePage_addRoutes } from './views/home/routes';

import { CONSTANTS } from '@/constants';
import { createLogger } from "@/utils/logger";
import type { AddRoutesFn } from './types/add-route';

type CreateApiServerOptions = {
  /** A name for the APi Server. Used in logger @example "api" */
  name: string,
  /** The base url of the api server. @example "http://localhost:3000" */
  baseUrl: string,
  /** The port of the api server. @example 3000 */
  port: number,
};

export async function createServer(options: CreateApiServerOptions) {

  // 0. create logger instance
  const apiLogger = createLogger(options.name);

  // 1. create express instance
  const expressApp = express();

  // 2. add render plugin (pug)
  apiLogger.info('Adding render plugin (pug)...');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  expressApp.set('views', path.resolve(__dirname, "./views"));
  expressApp.set('view engine', 'pug');
  apiLogger.info('Adding render plugin (pug)... ✅');

  // 3. add request components parser
  apiLogger.info('Adding request components parser...');
  // cookie
  expressApp.use(cookieParser());
  // body: application/json
  expressApp.use(express.json());
  // body: application/x-www-form-urlencoded
  expressApp.use(express.urlencoded({ extended: false }));
  // body: multipart/form-data
  expressApp.use(multer().any());
  apiLogger.info('Adding request components parser... ✅');

  // 3. Add middlewares
  apiLogger.info('Adding middlewares...');
  // cors
  expressApp.use(cors({
    origin: [
      CONSTANTS.SERVER_BASE_URL,
      ...CONSTANTS.SERVER_CORS_ALLOWED_CLIENTS_ORIGINS,
    ]
  }));
  // request logger
  expressApp.use(middlewareRequestLogger);
  apiLogger.info('Adding middlewares... ✅');

  // 4. mount endpoints
  apiLogger.info('Mount routes...');
  addEndpoints({ app: expressApp, logger: apiLogger });
  addErrorEndpoints({ app: expressApp, logger: apiLogger });
  apiLogger.info('Mount routes... ✅');

  // 5. launch server
  apiLogger.info('Launching server...');
  expressApp.listen(options.port, () => {
    apiLogger.info(`Server "${options.name}" running on ${options.baseUrl}`);
    apiLogger.info('Launching server... ✅');
  });

  return expressApp;
}


const addEndpoints: AddRoutesFn = ({ app, logger }) => {
  homePage_addRoutes({ app, logger });
};

const addErrorEndpoints: AddRoutesFn = ({ app, logger }) => {
  const notFoundThrower: RequestHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };

  const globalErrorCatcher: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res
      .status(statusCode)
      .json({
        message: err.message,
        stack: err.stack,
      });
  };

  app.use(notFoundThrower);
  app.use(globalErrorCatcher);
};