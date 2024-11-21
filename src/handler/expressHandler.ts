import { Application, Request, Response, NextFunction } from "express";
import { ILayer } from "express-serve-static-core";
import { logError } from "../logger/logError";
import { logRejection } from "../logger/logRejection";
import { RejectionValue } from "../types/types";
import loggedErrors from "../shared/loggedErrors";

interface ExpressErrorHandlerConfig {
  wrapAsync?: boolean;
}

/**
 * Sets up error handling and optional async wrapper for an Express application.
 * - Captures and logs errors and unhandled promise rejections.
 * - Prevents duplicate logging of the same error instance.
 * - Optionally wraps all asynchronous route handlers to catch and forward errors.
 *
 * @param app - The Express application instance.
 * @param config - Configuration options for the error handler.
 *   - `wrapAsync` (default: true): If true, wraps async route handlers to catch errors automatically.
 * @returns void
 */
export const setUpExpressErrorHandler = (
  app: Application,
  config: ExpressErrorHandlerConfig = { wrapAsync: true },
): void => {
  if (config.wrapAsync) {
    const asyncWrapper =
      (
        fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
      ) =>
      (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
      };

    app._router.stack.forEach((layer: ILayer) => {
      if (layer.route) {
        layer.route.stack.forEach((handler) => {
          handler.handle = asyncWrapper(handler.handle);
        });
      }
    });
  }

  app.use(
    (
      e: Error | RejectionValue,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      if (e instanceof Error) {
        if (!loggedErrors.has(e)) {
          logError(e, false, req);
        }
      } else {
        logRejection(e, false, req);
      }
      next(e);
    },
  );
};
