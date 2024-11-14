import axios from "axios";
import { Application, Request, Response, NextFunction } from 'express';
import { FlytrapError } from "./utils/FlytrapError";
import { LogData, RejectionValue } from "./types/types";
import { ILayer } from 'express-serve-static-core';

export default class Flytrap {
  private projectId: string;
  private apiEndpoint: string;
  private apiKey: string;
  private loggedErrors: WeakSet<Error>;

  constructor(config: {
    projectId: string;
    apiEndpoint: string;
    apiKey: string;
  }) {
    this.projectId = config.projectId;
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
    this.loggedErrors = new WeakSet();
    this.setUpGlobalErrorHandlers();
  }

  public setUpExpressErrorHandler(app: Application, wrapAsync: boolean = true): void {
    if (wrapAsync) {
      const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
        (req: Request, res: Response, next: NextFunction) => {
          Promise.resolve(fn(req, res, next)).catch(next);
        };

      app._router.stack.forEach((layer: ILayer) => {
        if (layer.route) {
          layer.route.stack.forEach((handler: ILayer) => {
            handler.handle = asyncWrapper(handler.handle);
          });
        }
      });
    }
    
    app.use((e: Error | RejectionValue, req: Request, res: Response, next: NextFunction) => {
      if (e instanceof Error) {
        if (!this.loggedErrors.has(e)) {
          this.logError(e, false);
        }
      } else {
        this.logRejection(e, false);
      }

      next(e);
    });
  }

  public captureException(e: Error): void {
    this.logError(e, true);
    this.loggedErrors.add(e);
  }

  // * --- Private Methods --- * //
  private setUpGlobalErrorHandlers(): void {
    process.on("uncaughtException", (e: Error) =>
      this.handleUncaughtException(e),
    );
    process.on("unhandledRejection", (reason: Error | RejectionValue) =>
      this.handleUnhandledRejection(reason),
    );
  }

  private handleUncaughtException(e: Error): void {
    if (e instanceof FlytrapError) return;
    this.logError(e, false);
    // process.exit(1); // Uncomment if needed
  }

  private handleUnhandledRejection(reason: Error | RejectionValue): void {
    if (reason instanceof Error) {
      if (reason instanceof FlytrapError) return;
      this.logError(reason, false);
    } else {
      this.logRejection(reason, false);
    }
    // process.exit(1); // Uncomment if needed
  }

  private async logError(error: Error, handled: boolean): Promise<void> {
    if (!error) return;

    const data: LogData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      handled,
      timestamp: new Date().toISOString(),
      project_id: this.projectId,
    };

    try {
      console.log("[flytrap] Sending error to backend...");
      const response = await axios.post(
        `${this.apiEndpoint}/api/errors`,
        { data },
        { headers: { "x-api-key": this.apiKey } },
      );

      console.log("[flytrap]", response.status, response.data);
    } catch (e) {
      console.error("[flytrap] An error occured sending error data.", e);
      throw new FlytrapError(
        "An error occurred logging error data.",
        e instanceof Error ? e : new Error(String(e)),
      );
    }
  }

  private async logRejection(
    value: RejectionValue,
    handled: boolean,
  ): Promise<void> {
    const data: LogData = {
      value,
      handled,
      timestamp: new Date().toISOString(),
      project_id: this.projectId,
    };

    try {
      console.log("[flytrap] Sending rejection to backend...");
      const response = await axios.post(
        `${this.apiEndpoint}/api/rejections`,
        { data },
        { headers: { "x-api-key": this.apiKey } },
      );

      console.log("[flytrap]", response.status, response.data);
    } catch (e) {
      console.error("[flytrap] An error occurred sending rejection data.", e);
      throw new FlytrapError(
        "An error occurred logging rejection data.",
        e instanceof Error ? e : new Error(String(e)),
      );
    }
  }
}
