export class FlytrapError extends Error {
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
