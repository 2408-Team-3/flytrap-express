import os from "os";

/**
 * Retrieves system details for the environment running the SDK.
 * @returns An object containing:
 * - `runtime`: The Node.js version, or `null` if unavailable.
 * - `os`: The operating system platform and release version as a string, or `null` if unavailable.
 */
export const getSystemDetails = (): {
  runtime: string | null;
  os: string | null;
} => {
  let runtime: string | null;
  let osDetails: string | null;

  try {
    runtime = `Node.js ${process.version}`;
  } catch {
    runtime = null;
  }

  try {
    const platform = os.platform();
    const release = os.release();
    osDetails = platform && release ? `${platform} ${release}` : null;
  } catch {
    osDetails = null;
  }

  return {
    runtime,
    os: osDetails,
  };
}
