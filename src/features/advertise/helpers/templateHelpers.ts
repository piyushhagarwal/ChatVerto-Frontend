// Helper function to count positional arguments in text
export const countPositionalArgs = (text: string): number => {
  const matches = text.match(/\{\{\d+\}\}/g);
  return matches ? matches.length : 0;
};

// Helper function to get positional arguments from text
export const getPositionalArgs = (text: string): number[] => {
  const matches = text.match(/\{\{\d+\}\}/g) || [];
  return matches
    .map(match => parseInt(match.replace(/[{}]/g, '')))
    .sort((a, b) => a - b);
};

// Helper function to render text with positional arguments
export const renderTextWithArgs = (
  text: string,
  examples: string[]
): string => {
  let result = text;
  const args = getPositionalArgs(text);

  args.forEach((argNum, index) => {
    const exampleValue = examples[index] || `Example ${argNum}`;
    result = result.replace(`{{${argNum}}}`, exampleValue);
  });

  return result;
};
