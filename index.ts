class Flytrap {
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

  // * --- Private Methods --- * //
  private setUpGlobalErrorHandlers(): void {
    process.on('uncaughtException', (e: Error) => this.handleUncaughtException(e));
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => 
      this.handleUnhandledRejection(reason, promise)
    );
  }

  private handleUncaughtException(e: Error): void {
    if (e instanceof FlytrapError) return;
    this.logError(e, false);
    // process.exit(1); // Uncomment if needed
  }

  private handleUnhandledRejection(reason: any, promise: Promise<any>): void {
    if (reason instanceof Error) {
      if (reason instanceof FlytrapError) return;
      this.#logError(reason, false);
    } else {
      this.#logPromiseRejection(reason, false);
    }
    // process.exit(1); // Uncomment if needed
  }
}