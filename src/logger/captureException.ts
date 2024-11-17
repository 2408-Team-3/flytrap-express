import { logError } from './logError';
import { Request } from 'express';
import loggedErrors from '../shared/loggedErrors';

export function captureException(e: Error, req?: Request): void {
  if (!e) return;
  logError(e, true, req);
  loggedErrors.add(e);
}
