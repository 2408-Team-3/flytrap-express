import axios from "axios";
import { Request } from "express";
import { parseStackTrace } from "../utils/stackTrace";
import { readSourceFile } from "../utils/fileReader";
import { getCodeContext } from "../utils/codeContext";
import { getConfig } from "../config";
// import { FlytrapError } from '../utils/FlytrapError';
import { ErrorLogData, CodeContext } from "../types/types";

export const logError = async (
  error: Error,
  handled: boolean,
  req?: Request,
): Promise<void> => {
  if (!error) return;

  const config = getConfig();
  const stackFrames = parseStackTrace(error.stack);

  let codeContexts: CodeContext[] = [];
  if (config.includeContext && stackFrames) {
    const contexts = await Promise.all(
      stackFrames.map(async (frame) => {
        const source = await readSourceFile(frame.file);

        if (source) {
          const context = getCodeContext(source, frame.line);

          return {
            file: frame.file,
            line: frame.line,
            column: frame.column,
            context,
          };
        }
        return null;
      }),
    );
    codeContexts = contexts.filter(Boolean) as CodeContext[];
  }

  const data: ErrorLogData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    codeContexts,
    handled,
    timestamp: new Date().toISOString(),
    project_id: config.projectId,
    method: req?.method,
    path: req?.path,
  };

  try {
    console.log("[flytrap] Sending error to backend...");
    const response = await axios.post(
      `${config.apiEndpoint}/api/errors`,
      { data },
      {
        headers: { "x-api-key": config.apiKey },
      },
    );
    console.log("[flytrap]", response.status, response.data);
  } catch (e) {
    console.warn("[flytrap] Failed to send error data.", e);
  }
};
