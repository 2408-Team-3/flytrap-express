export interface ErrorData {
  name: string;
  message: string;
  stack: string | undefined;
}

export interface ErrorLogData {
  error: ErrorData;
  codeContexts?: CodeContext[];
  handled: boolean;
  timestamp: string;
  project_id: string;
  method?: string;
  path?: string;
}

export type RejectionValue = string | number | boolean | object | null | undefined;

export interface RejectionLogData {
  value: RejectionValue
  handled: boolean;
  timestamp: string;
  project_id: string;
  method?: string;
  path?: string;
}

export interface CodeContext {
  file: string;
  line: number;
  column: number;
  context: string;
}