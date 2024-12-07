/**
 * Custom error class for Flytrap SDK.
 * Extends the native `Error` class to include additional context.
 */
export class FlytrapError extends Error {
  /**
   * Creates a new FlytrapError instance.
   * @param message - The error message.
   * @param originalError - Optional, the original error that caused this error.
   */
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = "FlytrapError";
    if (originalError) {
      this.stack = originalError.stack;
    }
    Object.setPrototypeOf(this, FlytrapError.prototype);
  }
}
