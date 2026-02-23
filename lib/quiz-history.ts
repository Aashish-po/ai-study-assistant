import AsyncStorage from "@react-native-async-storage/async-storage";

const QUIZ_HISTORY_KEY = "ai-study-assistant:quiz-history";

export interface QuizHistoryItem {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: number;
}

export async function getQuizHistory(): Promise<QuizHistoryItem[]> {
  const raw = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) => item && typeof item.id === "string" && typeof item.score === "number",
    );
  } catch {
    return [];
  }
}

export async function saveQuizHistoryItem(
  item: Omit<QuizHistoryItem, "id" | "timestamp" | "percentage">,
): Promise<QuizHistoryItem> {
  const history = await getQuizHistory();
  const timestamp = Date.now();

  const entry: QuizHistoryItem = {
    ...item,
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    percentage: Math.round((item.score / item.totalQuestions) * 100),
    timestamp,
  };

  const updated = [entry, ...history].slice(0, 100);
  await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));

  return entry;
}
