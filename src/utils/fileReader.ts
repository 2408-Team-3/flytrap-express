import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Reads the content of a source file asynchronously.
 * @param filePath - The path to the file. Can be a file URL or a standard file path.
 * @returns A promise resolving to the file content as a string, or `null` if the file cannot be read.
 */
export const readSourceFile = async (
  filePath: string,
): Promise<string | null> => {
  try {
    const absolutePath = filePath.startsWith("file://")
      ? fileURLToPath(filePath)
      : path.resolve(filePath);
    return await fs.promises.readFile(absolutePath, "utf-8");
  } catch {
    return null;
  }
};
