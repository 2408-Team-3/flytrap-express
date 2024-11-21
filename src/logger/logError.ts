import axios from "axios";
import { Request } from "express";
import { parseStackTrace } from "../utils/stackTrace";
import { readSourceFile } from "../utils/fileReader";
import { getCodeContext } from "../utils/codeContext";
import { getConfig } from "../config";
import { getSystemDetails } from "../utils/systemInfo";
import { getIpAddress } from "../utils/ipInfo";
import { ErrorLogData, CodeContext } from "../types/types";

/**
 * Logs an error to the Flytrap backend.
 * Includes metadata such as stack trace, code context, runtime, OS, and IP address.
 * @param error - The error object to log.
 * @param handled - Indicates whether the error was explicitly handled.
 * @param req - Optional, the Express request object for capturing request details.
 * @returns A promise that resolves when the log is sent or catches any error during the process.
 */
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

  const { runtime, os } = getSystemDetails();
  const ip = getIpAddress(req);

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
    method: req?.method || null,
    path: req?.path || null,
    ip,
    os,
    runtime,
  };

  try {
    await axios.post(
      `${config.apiEndpoint}/api/errors`,
      { data },
      {
        headers: { "x-api-key": config.apiKey },
      },
    );
  } catch {
    return;
  }
};
