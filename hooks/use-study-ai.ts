import { useCallback, useMemo, useState } from "react";

import { trpc } from "@/lib/trpc";
import type { SummaryMode } from "@/lib/summary-history";
import { parseKeyPoints, parseFlashcards } from "@/services/ai.service";
import { historyService } from "@/services/history.service";

const DEFAULT_FLASHCARDS = [
  {
    id: "1",
    question: "What is active recall?",
    answer:
      "A study technique where you actively retrieve information from memory without looking at your notes.",
  },
  {
    id: "2",
    question: "Why are summaries useful?",
    answer:
      "Summaries compress long material into key ideas, helping you revise faster and identify weak areas.",
  },
];

export function useStudyAI() {
  const [summaryMode, setSummaryMode] = useState<SummaryMode>("simple");
  const [generatedSummary, setGeneratedSummary] = useState(
    "Generate a summary to get started."
  );
  const [generatedKeyPointsRaw, setGeneratedKeyPointsRaw] = useState("");
  const [generatedFlashcardsRaw, setGeneratedFlashcardsRaw] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const studyPackMutation = trpc.ai.generateStudyPack.useMutation();
  const usageQuery = trpc.ai.usage.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  // Parse key points
  const keyPoints = useMemo(() => {
    if (!generatedKeyPointsRaw) return [];
    return parseKeyPoints(generatedKeyPointsRaw);
  }, [generatedKeyPointsRaw]);

  // Parse flashcards dynamically
  const flashcards = useMemo(() => {
    if (!generatedFlashcardsRaw) return DEFAULT_FLASHCARDS;
    return parseFlashcards(generatedFlashcardsRaw);
  }, [generatedFlashcardsRaw]);

  // Generate summary, key points, and flashcards via AI
  const generate = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      try {
        const response = await studyPackMutation.mutateAsync({
          content: input,
          mode: summaryMode,
        });

        const summary =
          typeof response.summary === "string" ? response.summary : "No summary generated.";
        const rawKeyPoints =
          typeof response.keyPoints === "string" ? response.keyPoints : "";
        const rawFlashcards =
          typeof response.flashcards === "string" ? response.flashcards : "";

        setGeneratedSummary(summary);
        setGeneratedKeyPointsRaw(rawKeyPoints);
        setGeneratedFlashcardsRaw(rawFlashcards);

        // Save all to history
        await historyService.saveSummary({
          input,
          summary,
          keyPoints: parseKeyPoints(rawKeyPoints).map((item) => item.text),
          flashcards: parseFlashcards(rawFlashcards),
          mode: summaryMode,
        });

        setSavedMessage(`Saved to history (${summaryMode})`);
        usageQuery.refetch();
      } catch (err) {
        console.error("AI generation failed", err);
        setSavedMessage("");
      }
    },
    [studyPackMutation, summaryMode, usageQuery]
  );

  // Load from history
  const loadFromHistory = useCallback(async (historyId: string) => {
    const item = await historyService.getSummary(historyId);
    if (!item) return null;

    setGeneratedSummary(item.summary);
    setGeneratedKeyPointsRaw(JSON.stringify(item.keyPoints));
    setGeneratedFlashcardsRaw(JSON.stringify(item.flashcards ?? DEFAULT_FLASHCARDS));
    setSummaryMode(item.mode);
    setSavedMessage("Loaded from history");

    return item;
  }, []);

  return {
    summaryMode,
    setSummaryMode,
    generatedSummary,
    keyPoints,
    flashcards, // <-- dynamic AI flashcards ready for UI
    savedMessage,
    isLoading: studyPackMutation.isPending,
    error: studyPackMutation.error,
    usage: usageQuery.data,
    generate,
    loadFromHistory,
  };
}