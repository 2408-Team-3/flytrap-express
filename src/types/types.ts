/**
 * Represents basic error details.
 * - `name`: The name of the error (e.g., `TypeError`).
 * - `message`: The error message.
 * - `stack`: The stack trace as a string (or `undefined` if unavailable).
 */
export interface ErrorData {
  name: string;
  message: string;
  stack: string | undefined;
}

/**
 * Represents detailed error log data.
 * - `error`: The basic error details.
 * - `codeContexts`: Optional, an array of code contexts related to the error.
 * - `handled`: Indicates if the error was handled explicitly.
 * - `timestamp`: ISO timestamp when the error occurred.
 * - `project_id`: The associated project ID.
 * - Additional metadata: HTTP method, path, IP, OS, and runtime details (all optional).
 */
export interface ErrorLogData {
  error: ErrorData;
  codeContexts?: CodeContext[];
  handled: boolean;
  timestamp: string;
  project_id: string;
  method?: string | null;
  path?: string | null;
  ip?: string | null;
  os?: string | null;
  runtime?: string | null;
}

/**
 * Possible types for a rejection value.
 * Includes primitives, objects, or `null`/`undefined`.
 */
export type RejectionValue =
  | string
  | number
  | boolean
  | object
  | null
  | undefined;

/**
 * Represents detailed rejection log data.
 * - `value`: The rejected value (e.g., from a Promise rejection).
 * - `handled`: Indicates if the rejection was handled explicitly.
 * - `timestamp`: ISO timestamp when the rejection occurred.
 * - `project_id`: The associated project ID.
 * - Additional metadata: HTTP method, path, IP, OS, and runtime details (all optional).
 */
export interface RejectionLogData {
  value: RejectionValue;
  handled: boolean;
  timestamp: string;
  project_id: string;
  method?: string | null;
  path?: string | null;
  ip?: string | null;
  os?: string | null;
  runtime?: string | null;
}

/**
 * Represents a snippet of code context.
 * - `file`: The file name where the context originates.
 * - `line`: The line number (1-based index).
 * - `column`: The column number (1-based index).
 * - `context`: The code snippet.
 */
export interface CodeContext {
  file: string;
  line: number;
  column: number;
  context: string;
}
