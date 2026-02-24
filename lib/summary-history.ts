import AsyncStorage from "@react-native-async-storage/async-storage";

const SUMMARY_HISTORY_KEY = "ai-study-assistant:summary-history";

export type SummaryMode = "simple" | "exam" | "detailed";

export interface SummaryHistoryItem {
  id: string;
  title: string;
  input: string;
  summary: string;
  keyPoints: string[];
  // eslint-disable-next-line @typescript-eslint/array-type
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
  mode: SummaryMode;
  timestamp: number;
}

export async function getSummaryHistory(): Promise<SummaryHistoryItem[]> {
  const raw = await AsyncStorage.getItem(SUMMARY_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.id === "string" && typeof item.input === "string")
      .map((item) => ({
        ...item,
        mode:
          item.mode === "simple" || item.mode === "exam" || item.mode === "detailed"
            ? item.mode
            : "simple",
      }));
  } catch {
    return [];
  }
}

export async function getSummaryHistoryItem(id: string): Promise<SummaryHistoryItem | null> {
  const history = await getSummaryHistory();
  return history.find((item) => item.id === id) ?? null;
}

export async function saveSummaryHistoryItem(
  item: Omit<SummaryHistoryItem, "id" | "title" | "timestamp">,
): Promise<SummaryHistoryItem> {
  const history = await getSummaryHistory();
  const timestamp = Date.now();
  const title = item.input.trim().slice(0, 40) || "Untitled summary";

  const entry: SummaryHistoryItem = {
    ...item,
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    timestamp,
  };

  const updated = [entry, ...history].slice(0, 100);
  await AsyncStorage.setItem(SUMMARY_HISTORY_KEY, JSON.stringify(updated));

  return entry;
}
