import {
  getSummaryHistory,
  getSummaryHistoryItem,
  saveSummaryHistoryItem,
  type SummaryHistoryItem,
  type SummaryMode,
} from "@/lib/summary-history";
import { getQuizHistory, saveQuizHistoryItem, type QuizHistoryItem } from "@/lib/quiz-history";

export type SummaryGenerationInput = {
  input: string;
  summary: string;
  keyPoints: string[];
  flashcards: Array<{ question: string; answer: string }>;
  mode: SummaryMode;
};

export const historyService = {
  listSummaries: (): Promise<SummaryHistoryItem[]> => getSummaryHistory(),
  getSummary: (id: string): Promise<SummaryHistoryItem | null> => getSummaryHistoryItem(id),
  saveSummary: (payload: SummaryGenerationInput): Promise<SummaryHistoryItem> =>
    saveSummaryHistoryItem(payload),

  listQuizzes: (): Promise<QuizHistoryItem[]> => getQuizHistory(),
  saveQuizAttempt: (payload: Omit<QuizHistoryItem, "id" | "timestamp" | "percentage">) =>
    saveQuizHistoryItem(payload),
};
