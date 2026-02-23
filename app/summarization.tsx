import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useMemo, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface KeyPoint {
  id: string;
  text: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const parseKeyPoints = (raw: string): KeyPoint[] => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: String(index + 1),
        text: String(item),
      }));
    }
  } catch {}

  return raw
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean)
    .map((text, index) => ({ id: String(index + 1), text }));
};

export default function SummarizationScreen() {
  const router = useRouter();
  const colors = useColors();

  const [activeTab, setActiveTab] = useState<
    "summary" | "keypoints" | "flashcards"
  >("summary");

  const [inputText, setInputText] = useState("");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const studyMutation = trpc.ai.generateStudyContent.useMutation();

  const handleGenerateAI = async () => {
    if (!inputText.trim()) return;

    if (inputText.length > 4000) {
      Alert.alert("Text too long", "Please paste shorter content (max 4000 characters).");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await studyMutation.mutateAsync({ content: inputText });
    } catch {
      Alert.alert("Error", "Failed to generate study content. Check backend.");
    }
  };

  const handleCopy = async () => {
    if (!studyMutation.data?.summary) return;
    await Clipboard.setStringAsync(studyMutation.data.summary);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Copied", "Summary copied to clipboard.");
  };

  const keyPoints = useMemo(() => {
    if (!studyMutation.data?.keyPoints) return [];
    return parseKeyPoints(studyMutation.data.keyPoints);
  }, [studyMutation.data?.keyPoints]);

  const flashcards: Flashcard[] =
    studyMutation.data?.flashcards?.map((f, index) => ({
      id: String(index),
      question: f.question,
      answer: f.answer,
    })) || [];

  const isLoading = studyMutation.isPending;

  const renderKeyPoint = ({ item }: { item: KeyPoint }) => (
    <View className="flex-row items-start gap-3 mb-3 bg-surface p-3 rounded-lg border border-border">
      <View className="bg-primary/20 rounded-full p-2 mt-0.5">
        <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary} />
      </View>
      <Text className="flex-1 text-foreground leading-relaxed">
        {item.text}
      </Text>
    </View>
  );

  const renderFlashcard = ({ item }: { item: Flashcard }) => (
    <TouchableOpacity
      onPress={() =>
        setFlipped((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
      }
      className="mb-4"
    >
      <View
        className="rounded-2xl p-6 min-h-48 justify-center items-center border border-border"
        style={{
          backgroundColor: flipped[item.id]
            ? colors.primary + "10"
            : colors.surface,
        }}
      >
        <Text className="text-sm text-muted mb-2">
          {flipped[item.id] ? "Answer" : "Question"}
        </Text>
        <Text className="text-lg font-semibold text-foreground text-center">
          {flipped[item.id] ? item.answer : item.question}
        </Text>
        <Text className="text-xs text-muted mt-4">Tap to flip</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-6 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">
            AI Study Assistant
          </Text>
          {studyMutation.data?.summary && (
            <TouchableOpacity onPress={handleCopy}>
              <IconSymbol name="doc.on.doc.fill" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Input */}
        <View className="px-6 py-5 border-b border-border">
          <Text className="text-sm text-muted mb-2">Paste study text</Text>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            placeholder="Paste topic, chapter, or notes..."
            placeholderTextColor={colors.muted}
          />

          <Text className="text-xs text-muted mt-2">
            {inputText.length} / 4000 characters
          </Text>

          <TouchableOpacity
            onPress={handleGenerateAI}
            disabled={isLoading || !inputText.trim()}
            className="rounded-xl py-3 px-4 mt-3 flex-row items-center justify-center"
            style={{
              backgroundColor: isLoading ? colors.muted : colors.primary,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <IconSymbol name="sparkles" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {studyMutation.data ? "Regenerate" : "Generate with AI"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        {studyMutation.data && (
          <>
            <View className="flex-row px-6 pt-4 pb-2 border-b border-border">
              {["summary", "keypoints", "flashcards"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab as any)}
                  className={`flex-1 pb-3 border-b-2 ${
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

            <View className="px-6 py-6">
              {activeTab === "summary" && (
                <View className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <Text className="text-base text-foreground leading-relaxed">
                    {studyMutation.data.summary}
                  </Text>
                </View>
              )}

              {activeTab === "keypoints" && (
                <FlatList
                  data={keyPoints}
                  renderItem={renderKeyPoint}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}

              {activeTab === "flashcards" && (
                <FlatList
                  data={flashcards}
                  renderItem={renderFlashcard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}