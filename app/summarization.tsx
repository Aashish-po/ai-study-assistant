import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Platform,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStudyAI } from "@/hooks/use-study-ai";
import { PROMPT_MODES } from "@/services/ai.service";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildStudyPackHtml = ({
  summary,
  keyPoints,
  flashcards,
}: {
  summary: string;
  keyPoints: string[];
  flashcards: Flashcard[];
}) => {
  const keyPointsHtml = keyPoints
    .map((point) => `<li>${escapeHtml(point)}</li>`)
    .join("");

  const flashcardsHtml = flashcards
    .map(
      (card) =>
        `<li><strong>Q:</strong> ${escapeHtml(card.question)}<br /><strong>A:</strong> ${escapeHtml(
          card.answer,
        )}</li>`,
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #111827; }
          h1, h2 { margin: 0 0 12px 0; }
          section { margin-bottom: 24px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; line-height: 1.45; }
          p { line-height: 1.5; }
        </style>
      </head>
      <body>
        <h1>AI Study Pack</h1>
        <section>
          <h2>Summary</h2>
          <p>${escapeHtml(summary)}</p>
        </section>
        <section>
          <h2>Key Points</h2>
          <ul>${keyPointsHtml || "<li>No key points available</li>"}</ul>
        </section>
        <section>
          <h2>Flashcards</h2>
          <ul>${flashcardsHtml}</ul>
        </section>
      </body>
    </html>
  `;
};

export default function SummarizationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ historyId?: string }>();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"summary" | "keypoints" | "flashcards">("summary");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [inputText, setInputText] = useState(
    "Photosynthesis is the process by which green plants use sunlight to synthesize foods from carbon dioxide and water. It mainly happens in chloroplasts, where light-dependent reactions produce ATP and NADPH, while the Calvin cycle uses these molecules to form glucose.",
  );

  const {
    summaryMode,
    setSummaryMode,
    generatedSummary,
    keyPoints,
    flashcards,
    savedMessage,
    isLoading,
    error,
    usage,
    generate,
    loadFromHistory,
  } = useStudyAI();

  useEffect(() => {
    const historyId = params.historyId;
    if (!historyId) return;

    const loadHistory = async () => {
      const item = await loadFromHistory(historyId);
      if (item) setInputText(item.input);
    };

    loadHistory();
  }, [loadFromHistory, params.historyId]);

  const handleGenerateQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/quiz" as any);
  };

  const handleGenerateAI = async () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await generate(inputText);
  };

  const handleSavePdf = async () => {
    if (!generatedSummary || generatedSummary === "Generate a summary to get started.") return;

    try {
      const summaryText = [
        "AI Study Pack",
        "",
        "Summary",
        generatedSummary,
        "",
        "Key Points",
        ...keyPoints.map((item) => `- ${item.text}`),
      ].join("\n");

      if (Platform.OS === "web" && typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title: "AI Study Pack",
          text: summaryText,
        });
        return;
      }

      await Share.share({
        title: "AI Study Pack",
        message: summaryText,
      });
    } catch {
      Alert.alert("Export failed", "Could not share study pack. Please try again.");
    }
  };

  const handlePrintPreview = async () => {
    try {
      const html = buildStudyPackHtml({
        summary: generatedSummary,
        keyPoints: keyPoints.map((item) => item.text),
        flashcards,
      });

      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
          if (!popup) {
            Alert.alert("Popup blocked", "Allow popups to open the print preview.");
            return;
          }
          popup.document.write(html);
          popup.document.close();
          popup.focus();
          popup.print();
        }
        return;
      }
      Alert.alert("Web only", "Print preview is currently available on web.");
    } catch {
      Alert.alert("Preview failed", "Could not open print preview.");
    }
  };

  const renderFlashcard = ({ item }: { item: Flashcard }) => (
    <TouchableOpacity
      onPress={() => {
        setFlipped((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      className="mb-4"
    >
      <View
        className="rounded-2xl p-6 min-h-48 justify-center items-center border border-border"
        style={{
          backgroundColor: flipped[item.id] ? colors.primary + "10" : colors.surface,
        }}
      >
        <Text className="text-sm text-muted mb-2">{flipped[item.id] ? "Answer" : "Question"}</Text>
        <Text className="text-lg font-semibold text-foreground text-center">
          {flipped[item.id] ? item.answer : item.question}
        </Text>
        <Text className="text-xs text-muted mt-4">Tap to flip</Text>
      </View>
    </TouchableOpacity>
  );

  const SkeletonSummary = () => (
    <View className="bg-surface border border-border rounded-2xl p-6 mb-6">
      <View className="h-4 bg-border rounded mb-3 w-1/3" />
      <View className="h-3 bg-border rounded mb-2" />
      <View className="h-3 bg-border rounded mb-2" />
      <View className="h-3 bg-border rounded w-5/6" />
    </View>
  );

  const SkeletonKeypoints = () => (
    <View>
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          className="flex-row items-center gap-3 mb-3 bg-surface p-3 rounded-lg border border-border"
        >
          <View className="w-8 h-8 bg-border rounded-full" />
          <View className="h-3 bg-border rounded flex-1" />
        </View>
      ))}
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground flex-1">Summary</Text>
          <TouchableOpacity onPress={() => router.push("/history" as any)}>
            <IconSymbol name="book.fill" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Input & AI Controls */}
        <View className="px-6 py-5 border-b border-border">
          <Text className="text-sm text-muted mb-2">Paste study text</Text>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            placeholder="Paste a topic, chapter, or lecture notes to summarize"
            placeholderTextColor={colors.muted}
          />

          <Text className="text-xs text-muted mt-3">
            Today&apos;s usage: {usage?.usedToday ?? 0} / {usage?.dailyLimit ?? 10}
          </Text>
          <Text className="text-xs text-muted mb-2">
            Remaining today: {usage?.remainingToday ?? 10}
          </Text>

          <Text className="text-sm text-muted mb-2">Prompt mode</Text>
          <View className="flex-row gap-2">
            {PROMPT_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                onPress={() => setSummaryMode(mode.value)}
                className="flex-1 rounded-lg px-2 py-2 border"
                style={{
                  borderColor: summaryMode === mode.value ? colors.primary : colors.border,
                  backgroundColor: summaryMode === mode.value ? colors.primary + "15" : colors.surface,
                }}
              >
                <Text
                  className="text-xs text-center font-medium"
                  style={{ color: summaryMode === mode.value ? colors.primary : colors.muted }}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleGenerateAI}
            disabled={isLoading || !inputText.trim()}
            className="rounded-xl py-3 px-4 mt-3 flex-row items-center justify-center"
            style={{
              backgroundColor: isLoading ? colors.muted : colors.primary,
              opacity: !inputText.trim() ? 0.7 : 1,
            }}
          >
            <IconSymbol name="star.fill" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Generate with AI</Text>
          </TouchableOpacity>

          {savedMessage && <Text className="text-xs text-success mt-2">{savedMessage}</Text>}
          {error && (
            <Text className="text-xs mt-2" style={{ color: "#ef4444" }}>
              Could not generate output. You may have hit rate/daily limits or backend config issues.
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 pt-4 pb-2 border-b border-border">
          {(["summary", "keypoints", "flashcards"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 pb-3 px-2 border-b-2 ${
                activeTab === tab ? "border-primary" : "border-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  activeTab === tab ? "text-primary" : "text-muted"
                }`}
              >
                {tab === "keypoints" ? "Key Points" : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="px-6 py-6">
          {activeTab === "summary" && (
            <View>
              {isLoading ? (
                <SkeletonSummary />
              ) : (
                <View className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                  <View className="flex-row items-center gap-2 mb-3">
                    <IconSymbol name="book.fill" size={20} color={colors.primary} />
                    <Text className="font-semibold text-foreground">AI-Generated Summary</Text>
                  </View>
                  <Text className="text-base text-foreground leading-relaxed">{generatedSummary}</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handlePrintPreview}
                className="rounded-xl py-4 px-6 flex-row items-center justify-center mb-3 border border-border"
              >
                <IconSymbol name="paperplane.fill" size={18} color={colors.foreground} />
                <Text className="text-foreground font-semibold ml-2">Print Preview</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSavePdf}
                className="rounded-xl py-4 px-6 flex-row items-center justify-center mb-3 border border-border"
              >
                <IconSymbol name="paperplane.fill" size={18} color={colors.foreground} />
                <Text className="text-foreground font-semibold ml-2">Share Study Pack</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGenerateQuiz}
                className="rounded-xl py-4 px-6 flex-row items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <IconSymbol name="play.circle.fill" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Generate Quiz</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "keypoints" &&
            (isLoading ? (
              <SkeletonKeypoints />
            ) : (
              <FlatList
                data={keyPoints}
                renderItem={({ item }) => (
                  <View className="flex-row items-start gap-3 mb-3 bg-surface p-3 rounded-lg border border-border">
                    <View className="bg-primary/20 rounded-full p-2 mt-0.5">
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary} />
                    </View>
                    <Text className="flex-1 text-foreground leading-relaxed">{item.text}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text className="text-muted text-sm">Generate AI output to view key points.</Text>
                }
              />
            ))}

          {activeTab === "flashcards" && (
            <FlatList
              data={flashcards}
              renderItem={renderFlashcard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
