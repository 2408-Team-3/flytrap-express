import { logError } from "./logError";
import { Request } from "express";
import loggedErrors from "../shared/loggedErrors";

/**
 * Captures an exception, logs it to the Flytrap backend, and tracks it to avoid duplicate logging.
 * @param e - The error object to capture.
 * @param req - Optional, the Express request object for capturing additional request details.
 * @returns void
 */
export const captureException = (e: Error, req?: Request): void => {
  if (!e) return;
  logError(e, true, req);
  loggedErrors.add(e);
};
