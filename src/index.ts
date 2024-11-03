import axios from "axios";
import express, { Application, Request, Response, NextFunction } from 'express';
import { FlytrapError } from "./utils/FlytrapError";
import { LogData, RejectionValue } from "./types/types";
import { responseSchema } from "./types/schemas";
import { ZodError } from "zod";

export default class Flytrap {
  private projectId: string;
  private apiEndpoint: string;
  private apiKey: string;

  constructor(config: {
    projectId: string;
    apiEndpoint: string;
    apiKey: string;
  }) {
    this.projectId = config.projectId;
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
  }

  public setUpExpressErrorHandler(app: Application): void {
    const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
      (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
      };

    app._router.stack.forEach((layer: any) => {
      if (layer.route) {
        layer.route.stack.forEach((handler: any) => {
          handler.handle = asyncWrapper(handler.handle);
        });
      }
    });
    
    app.use((e: any, req: Request, res: Response, next: NextFunction) => {
      if (e instanceof Error) {
        this.logError(e, false);
      } else {
        this.logRejection(e, false);
      }

      next(e);
    });
  }

  public captureException(e: Error): void {
    this.logError(e, true);
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

      responseSchema.parse(response);
      console.log("[flytrap]", response.status, response.data);
    } catch (e) {
      if (e instanceof ZodError) {
        console.error("[flytrap] Response validation error:", e.errors);
      } else {
        console.error("[flytrap] An error occured sending error data.", e);
        throw new FlytrapError(
          "An error occurred logging error data.",
          e instanceof Error ? e : new Error(String(e)),
        );
      }
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
        `${this.apiEndpoint}/api/errors`,
        { data },
        { headers: { "x-api-key": this.apiKey } },
      );

      responseSchema.parse(response);
      console.log("[flytrap]", response.status, response.data);
    } catch (e) {
      if (e instanceof ZodError) {
        console.error("[flytrap] Response validation error:", e.errors);
      } else {
        console.error(
          "[error sdk] An error occurred sending rejection data.",
          e,
        );
        throw new FlytrapError(
          "An error occurred logging rejection data.",
          e instanceof Error ? e : new Error(String(e)),
        );
      }
    }
  }
}
