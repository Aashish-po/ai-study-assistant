export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type KeyPoint = {
  id: string;
  text: string;
};

export const PROMPT_MODES = [
  { value: "simple", label: "Simple" },
  { value: "exam", label: "Exam" },
  { value: "detailed", label: "Detailed" },
] as const;

export const parseKeyPoints = (raw: string): KeyPoint[] => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item, index) => ({
          id: String(index + 1),
          text: String(item ?? "").trim(),
        }))
        .filter((item) => item.text.length > 0);
    }
  } catch {
    // Fallback to line-based parsing.
  }

  return raw
    .split("\n")
    .map((line) => line.replace(/^[\s\-*•\d.)]+/, "").trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: String(index + 1),
      text,
    }));
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
