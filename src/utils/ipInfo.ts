import { Request } from 'express';

export function getIpAddress(req: Request | undefined): string {
  if (!req) {
    return "Unknown"
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }

  // If `x-forwarded-for` is not an array, return the first IP or fallback to `req.ip`
  return (forwardedFor as string) || req.ip || "Unknown";
}
