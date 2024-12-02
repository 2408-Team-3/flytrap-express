import { Request } from "express";

/**
 * Extracts the IP address from an Express request object.
 * Checks the `x-forwarded-for` header first, then falls back to `req.ip`.
 * @param req - The Express request object. Can be undefined.
 * @returns The extracted IP address as a string, or `null` if unavailable.
 */
export function getIpAddress(req: Request | undefined): string | null {
  if (!req) {
    return null;
  }

  const forwardedFor = req.headers["x-forwarded-for"];
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }

  return (forwardedFor as string) || req.ip || null;
}
