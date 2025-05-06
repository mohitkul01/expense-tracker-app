// ocr.utils.ts
const AMOUNT_KEYWORDS = ['total', 'amount', 'grand total', 'balance due', 'amount due'];

export function extractAmountFromLines(lines: string[]): number | null {
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].toLowerCase().replace(/[:,]/g, '');

    for (const keyword of AMOUNT_KEYWORDS) {
      if (line.includes(keyword)) {
        const match = line.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/g);
        if (match) {
          const lastAmount = match[match.length - 1].replace(/,/g, '');
          const parsed = parseFloat(lastAmount);
          if (!isNaN(parsed)) return parsed;
        }
      }
    }
  }

  // fallback: find biggest number in case nothing matches
  let maxAmount = 0;
  for (const line of lines) {
    const matches = line.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/g);
    if (matches) {
      for (const val of matches) {
        const clean = parseFloat(val.replace(/,/g, ''));
        if (!isNaN(clean) && clean > maxAmount) {
          maxAmount = clean;
        }
      }
    }
  }

  return maxAmount > 0 ? maxAmount : null;
}
