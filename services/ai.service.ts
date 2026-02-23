export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Parses raw AI output into structured flashcards.
 * Supports JSON arrays or simple line-based format.
 */
export const parseFlashcards = (raw: string): Flashcard[] => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item, index) => ({
          id: String(index + 1),
          question: String(item.question || item.q || ""),
          answer: String(item.answer || item.a || ""),
        }))
        .filter((item) => item.question && item.answer);
    }
  } catch {
    // Fallback to line-based parsing: each line is "Q: ... A: ..."
  }

  const lines = raw.split("\n").filter(Boolean);
  return lines
    .map((line, index) => {
      const match = line.match(/^Q[:\-]?\s*(.+)\s+A[:\-]?\s*(.+)$/i);
      if (match) {
        return { id: String(index + 1), question: match[1].trim(), answer: match[2].trim() };
      }
      return null;
    })
    .filter((item): item is Flashcard => item !== null);
};