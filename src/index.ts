import * as fs from 'fs';
import * as path from 'path';
import axios from "axios";
import { Application, Request, Response, NextFunction } from 'express';
import { FlytrapError } from "./utils/FlytrapError";
import { LogData, RejectionValue, CodeContext } from "./types/types";
import { ILayer } from 'express-serve-static-core';
import { fileURLToPath } from 'url';

export default class Flytrap {
  private projectId: string;
  private apiEndpoint: string;
  private apiKey: string;
  private loggedErrors: WeakSet<Error>;
  private includeContext: boolean;

  constructor(config: {
    projectId: string;
    apiEndpoint: string;
    apiKey: string;
    includeContext?: boolean;
  }) {
    this.projectId = config.projectId;
    this.apiEndpoint = config.apiEndpoint;
    this.apiKey = config.apiKey;
    this.loggedErrors = new WeakSet();
    this.includeContext = true;
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
          this.logError(e, false, req);
        }
      } else {
        this.logRejection(e, false, req);
      }

      next(e);
    });
  }

  public captureException(e: Error, req?: Request): void {
    this.logError(e, true, req);
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
    throw e;
  }

  private handleUnhandledRejection(reason: Error | RejectionValue): void {
    if (reason instanceof Error) {
      if (reason instanceof FlytrapError) return;
      this.logError(reason, false);
    } else {
      this.logRejection(reason, false);
    }
  }

  private async logError(error: Error, handled: boolean, req?: Request): Promise<void> {
    if (!error) return;

    const stackFrames = this.parseStackTrace(error.stack);

    let codeContexts: CodeContext[] = [];
    if (this.includeContext && stackFrames) {
      const contexts = await Promise.all(
        stackFrames.map(async (frame) => {
          const source = await this.readSourceFile(frame.file);
          
          if (source) {
            const context = this.getCodeContext(source, frame.line);

            return {
              file: frame.file,
              line: frame.line,
              column: frame.column,
              context,
            }
          }
          return null;
        })
      );
      codeContexts = contexts.filter(Boolean) as CodeContext[];
    }

    const data: LogData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      codeContexts,
      handled,
      timestamp: new Date().toISOString(),
      project_id: this.projectId,
      method: req ? req.method : undefined,
      path: req? req.path : undefined
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
    req?: Request
  ): Promise<void> {
    const data: LogData = {
      value,
      handled,
      timestamp: new Date().toISOString(),
      project_id: this.projectId,
      method: req? req.method : undefined,
      path: req ? req.path : undefined
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

  private parseStackTrace(stack: string | undefined) {
    if (!stack) return;

    const stackLines = stack.split('\n').slice(1); // Skip the error message
    const stackFrames = stackLines.map((line) => {
      const match = line.match(/\s+at\s+(?:.*\s\()?(.+):(\d+):(\d+)\)?/);
      if (match) {
        const [, file, lineNumber, columnNumber] = match;
        return {
          file,
          line: parseInt(lineNumber, 10),
          column: parseInt(columnNumber, 10),
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 10) as { file: string; line: number; column: number }[];

    return stackFrames;
  }

  private async readSourceFile(filePath: string): Promise<string| null> {
    try {
      const absolutePath = filePath.startsWith('file://')
        ? fileURLToPath(filePath)
        : path.resolve(filePath);
      return await fs.promises.readFile(absolutePath, 'utf-8');
    } catch (e) {
      console.error(`[flytrap] Could not read file: ${filePath}`, e);
      return null;
    }
  }

  private getCodeContext(source: string, lineNumber: number, contextLines: number = 5): string {
    const lines = source.split('\n');
    const start = Math.max(lineNumber - contextLines - 1, 0);
    const end = Math.min(lineNumber + contextLines, lines.length);
    return lines.slice(start, end).join('\n');
  }
}
