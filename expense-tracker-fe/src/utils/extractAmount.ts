export const extractAmount = (text: string): number | null => {
    const match = text.match(/(\d+[.,]?\d{0,2})\s?(INR|Rs|₹)?/i);
    return match ? parseFloat(match[1].replace(',', '')) : null;
  };
  