import { Application, Request, Response, NextFunction } from 'express';
import { ILayer } from 'express-serve-static-core';
import { logError } from '../logger/logError';
import { logRejection } from '../logger/logRejection';
import { RejectionValue } from '../types/types';
import loggedErrors from '../shared/loggedErrors';

export const setUpExpressErrorHandler = (app: Application, wrapAsync: boolean = true): void => {
  if (wrapAsync) {
    const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
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

  app.use((e: Error | RejectionValue, req: Request, res: Response, next: NextFunction) => {
    if (e instanceof Error) {
      if (!loggedErrors.has(e)) {
        logError(e, false, req);
      }
    } else {
      logRejection(e, false, req);
    }
    next(e);
  });
}
