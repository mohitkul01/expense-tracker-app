import { extractAmount } from './extractAmount';

export interface ParsedReceipt {
  title: string;
  amount: number | null;
  rawLines: string[];
}

export const parseReceiptText = (text: string): ParsedReceipt => {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line && /[a-zA-Z0-9]/.test(line)); // Remove empty or non-readable lines

  // Heuristic: the first non-empty line that isn't a number is usually the title
  let title = '';
  for (const line of lines) {
    if (!line.match(/^\d+[.,]?\d{0,2}$/)) {
      title = line;
      break;
    }
  }

  const amount = extractAmount(text);

  return {
    title,
    amount,
    rawLines: lines
  };
};
