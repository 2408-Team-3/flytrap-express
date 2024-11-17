export const parseStackTrace = (stack: string | undefined) => {
  if (!stack) return;

  const stackLines = stack.split('\n').slice(1); // Skip the error message
  const stackFrames = stackLines
    .map((line) => {
      const match = line.match(/\s+at\s+(?:.*\s\()?(.+):(\d+):(\d+)\)?/);
      if (match) {
        const [, file, lineNumber, columnNumber] = match;
        return {
          file,
          line: parseInt(lineNumber, 10),
          column: parseInt(columnNumber, 10),
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 10) as { file: string; line: number; column: number }[];

  return stackFrames;
}
