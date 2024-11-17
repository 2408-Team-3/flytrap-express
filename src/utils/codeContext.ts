export const getCodeContext = (
  source: string,
  lineNumber: number,
  contextLines: number = 5,
): string => {
  const lines = source.split("\n");
  const start = Math.max(lineNumber - contextLines - 1, 0);
  const end = Math.min(lineNumber + contextLines, lines.length);
  return lines.slice(start, end).join("\n");
};
