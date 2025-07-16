/* eslint-disable @typescript-eslint/no-explicit-any */

interface ValidationError {
  path: string;
  message: string;
}

const walk = (obj: unknown, currentPath: string[] = [], results: ValidationError[]): void => {
  if (typeof obj !== 'object' || obj === null) return;

  for (const [key, value] of Object.entries(obj)) {
    if (key === '_errors' && Array.isArray(value)) {
      value.forEach((message: string) => {
        if (typeof message === 'string') {
          results.push({
            path: currentPath.join('.'),
            message,
          });
        }
      });
    } else {
      walk(value, [...currentPath, key], results);
    }
  }
};

const parseZodErrors = (errors: Record<string, any>): ValidationError[] => {
  if (!errors) {
    return [];
  }

  const results: ValidationError[] = [];

  walk(errors, [], results);
  return results;
};

export default parseZodErrors;
