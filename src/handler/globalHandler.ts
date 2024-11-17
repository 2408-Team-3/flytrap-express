import { logError } from "../logger/logError";
import { logRejection } from "../logger/logRejection";
import { FlytrapError } from "../utils/FlytrapError";
import { RejectionValue } from "../types/types";

let globalHandlersSet: boolean = false;

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
