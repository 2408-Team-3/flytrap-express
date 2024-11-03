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
  }

  private handleUncaughtException(e: Error): void {
    if (e.error instanceof FlytrapError) return;
    this.logError(e, false);
    // process.exit(1); // Uncomment if needed
  }
}