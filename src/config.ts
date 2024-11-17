import { setUpGlobalErrorHandlers } from "./handler/globalHandler";
import { FlytrapError } from "./utils/FlytrapError";

export interface FlytrapConfig {
  projectId: string;
  apiEndpoint: string;
  apiKey: string;
  includeContext?: boolean;
}

let _config: FlytrapConfig | null = null;

export const init = (config: FlytrapConfig, force: boolean = false): void => {
  if (_config && !force) {
    throw new FlytrapError("Flytrap has already been initialized.");
  }
  _config = { ...config, includeContext: config.includeContext ?? true };
  setUpGlobalErrorHandlers();
};

export const getConfig = (): FlytrapConfig => {
  if (!_config) {
    throw new FlytrapError("Flytrap is not initialized. Call init() first.");
  }
  return _config;
};
