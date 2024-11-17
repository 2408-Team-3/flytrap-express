import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const readSourceFile = async (
  filePath: string,
): Promise<string | null> => {
  try {
    const absolutePath = filePath.startsWith("file://")
      ? fileURLToPath(filePath)
      : path.resolve(filePath);
    return await fs.promises.readFile(absolutePath, "utf-8");
  } catch (e) {
    console.error(`[flytrap] Could not read file: ${filePath}`, e);
    return null;
  }
};
