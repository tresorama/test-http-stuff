import express from "express";

import type { Logger } from "@/utils/logger";

type AddRoutesOptions = {
  app: express.Express,
  logger: Logger,
};

export type AddRoutesFn = (options: AddRoutesOptions) => void;