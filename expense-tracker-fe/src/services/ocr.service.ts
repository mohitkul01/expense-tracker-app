import Tesseract from "tesseract.js";
import { extractAmountFromLines } from "../utils/ocr.utils";


export async function extractTextFromImage(file: File) {
  const { data: { text } } = await Tesseract.recognize(file, 'eng', {
    logger: m => console.log(m),
  });

  const rawLines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const title = rawLines[0]; // assuming first line is business name/title
  const amount = extractAmountFromLines(rawLines);

  return {
    rawLines,
    title,
    amount
  };
}
