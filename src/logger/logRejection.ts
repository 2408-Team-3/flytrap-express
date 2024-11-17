import axios from "axios";
import { Request } from "express";
import { getConfig } from "../config";
// import { FlytrapError } from '../utils/FlytrapError';
import { RejectionLogData, RejectionValue } from "../types/types";

export const logRejection = async (
  value: RejectionValue,
  handled: boolean,
  req?: Request,
): Promise<void> => {
  const config = getConfig();

  const data: RejectionLogData = {
    value,
    handled,
    timestamp: new Date().toISOString(),
    project_id: config.projectId,
    method: req?.method,
    path: req?.path,
  };

  try {
    console.log("[flytrap] Sending rejection to backend...");
    const response = await axios.post(
      `${config.apiEndpoint}/api/rejections`,
      { data },
      { headers: { "x-api-key": config.apiKey } },
    );
    console.log("[flytrap]", response.status, response.data);
  } catch (e) {
    console.warn("[flytrap] An error occurred sending rejection data.", e);
  }
};
