/**
 * Entry point for the Flytrap SDK.
 * Provides initialization, error handling, and logging utilities.
 */
import { init } from "./config";
import { setUpExpressErrorHandler } from "./handler/expressHandler";
import { captureException } from "./logger/captureException";
import { FlytrapError } from "./utils/FlytrapError";

/**
 * Flytrap SDK main object.
 * - `init`: Initializes the SDK with the required configuration.
 * - `setUpExpressErrorHandler`: Middleware for handling errors in Express apps.
 * - `captureException`: Captures and logs exceptions for monitoring.
 * - `FlytrapError`: Custom error class for SDK-related issues.
 */
const flytrap = {
  init,
  setUpExpressErrorHandler,
  captureException,
  FlytrapError,
};

export default flytrap;
