import axios from "axios";
import { Request } from "express";
import { getConfig } from "../config";
import { getSystemDetails } from "../utils/systemInfo";
import { getIpAddress } from "../utils/ipInfo";
import { RejectionLogData, RejectionValue } from "../types/types";

/**
 * Logs a rejected value (e.g., from an unhandled Promise rejection) to the Flytrap backend.
 * Includes metadata such as runtime, operating system, IP address, and request details (if available).
 * @param value - The rejected value.
 * @param handled - Indicates whether the rejection was handled explicitly.
 * @param req - Optional, the Express request object for capturing request details.
 * @returns A promise that resolves when the log is sent or catches any error during the process.
 */
export const logRejection = async (
  value: RejectionValue,
  handled: boolean,
  req?: Request,
): Promise<void> => {
  const config = getConfig();

  const { runtime, os } = getSystemDetails();
  const ip = getIpAddress(req);

  const data: RejectionLogData = {
    value,
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
      `${config.apiEndpoint}/api/rejections`,
      { data },
      { headers: { "x-api-key": config.apiKey } },
    );
  } catch {
    return;
  }
};
