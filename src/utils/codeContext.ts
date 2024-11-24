/**
 * Extracts a snippet of code context around a specified line number.
 * @param source - The full source code as a string.
 * @param lineNumber - The line number to center the context around (1-based index).
 * @param contextLines - Optional, number of lines before and after to include (default: 5).
 * @returns A string containing the code context.
 */
export const getCodeContext = (
  source: string,
  lineNumber: number,
  contextLines: number = 5,
): string => {
  const lines = source.split("\n");
  const start = Math.max(lineNumber - contextLines - 1, 0);
  const end = Math.min(lineNumber + contextLines, lines.length);
  return JSON.stringify(lines.slice(start, end).join("\n"));
};
