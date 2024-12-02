import { logError } from "../logger/logError";
import { logRejection } from "../logger/logRejection";
import { FlytrapError } from "../utils/FlytrapError";
import { RejectionValue } from "../types/types";

let globalHandlersSet: boolean = false;

/**
 * Sets up global handlers for uncaught exceptions and unhandled promise rejections.
 * - Captures and logs uncaught exceptions unless they are `FlytrapError`.
 * - Captures and logs unhandled promise rejections, including both errors and other rejection values.
 * - Ensures handlers are only set up once per process.
 *
 * @returns void
 */
export const setUpGlobalErrorHandlers = (): void => {
  if (globalHandlersSet) return;
  globalHandlersSet = true;

  process.on("uncaughtException", async (error: Error) => {
    if (error instanceof FlytrapError) return;
    await logError(error, false);
    throw error;
  });

  process.on("unhandledRejection", async (reason: Error | RejectionValue) => {
    if (reason instanceof Error) {
      if (reason instanceof FlytrapError) return;
      await logError(reason, false);
    } else {
      await logRejection(reason, false);
    }
    process.exit(1);
  });
};
