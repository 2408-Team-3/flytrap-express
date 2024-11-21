import { setUpGlobalErrorHandlers } from "./handler/globalHandler";
import { FlytrapError } from "./utils/FlytrapError";

/**
 * Configuration object for Flytrap SDK.
 */
export interface FlytrapConfig {
  projectId: string;
  apiEndpoint: string;
  apiKey: string;
  includeContext?: boolean;
}

let _config: FlytrapConfig | null = null;

/**
 * Initializes the Flytrap SDK with the provided configuration.
 * Sets up global error handlers.
 * @param config - The configuration object.
 * @param force - Optional, forces reinitialization if already initialized (default: false).
 * @throws FlytrapError if already initialized and force is not true.
 */
export const init = (config: FlytrapConfig, force: boolean = false): void => {
  if (_config && !force) {
    throw new FlytrapError("Flytrap has already been initialized.");
  }
  _config = { ...config, includeContext: config.includeContext ?? true };
  setUpGlobalErrorHandlers();
};

/**
 * Retrieves the current Flytrap SDK configuration.
 * @returns The current Flytrap configuration.
 * @throws FlytrapError if the SDK has not been initialized.
 */
export const getConfig = (): FlytrapConfig => {
  if (!_config) {
    throw new FlytrapError("Flytrap is not initialized. Call init() first.");
  }
  return _config;
};
