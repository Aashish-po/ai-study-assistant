import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface KeyPoint {
  id: string;
  text: string;
}

const SAMPLE_SUMMARY = "This chapter covers the fundamental concepts of photosynthesis, including the light-dependent and light-independent reactions. Plants convert light energy into chemical energy through a series of complex biochemical processes.";

const KEY_POINTS: KeyPoint[] = [
  { id: "1", text: "Photosynthesis occurs in chloroplasts" },
  { id: "2", text: "Light reactions produce ATP and NADPH" },
  { id: "3", text: "Calvin cycle fixes CO2 into glucose" },
  { id: "4", text: "Chlorophyll absorbs light energy" },
  { id: "5", text: "Water is split in the light reactions" },
];

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: "1",
    question: "What is photosynthesis?",
    answer: "The process by which plants convert light energy into chemical energy stored in glucose.",
  },
  {
    id: "2",
    question: "Where does photosynthesis occur?",
    answer: "In the chloroplasts of plant cells.",
  },
];

export default function SummarizationScreen() {
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"summary" | "keypoints" | "flashcards">("summary");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleGenerateQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/quiz" as any);
  };

  const renderKeyPoint = ({ item }: { item: KeyPoint }) => (
    <View className="flex-row items-start gap-3 mb-3 bg-surface p-3 rounded-lg border border-border">
      <View className="bg-primary/20 rounded-full p-2 mt-0.5">
        <IconSymbol
          name="checkmark.circle.fill"
          size={16}
          color={colors.primary}
        />
      </View>
      <Text className="flex-1 text-foreground leading-relaxed">{item.text}</Text>
    </View>
  );

  const renderFlashcard = ({ item }: { item: Flashcard }) => (
    <TouchableOpacity
      onPress={() => {
        setFlipped((prev) => ({
          ...prev,
          [item.id]: !prev[item.id],
        }));
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-6 border-b border-border">
          <TouchableOpacity onPress={handleBack} className="mr-3">
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground flex-1">
            Summary
          </Text>
          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <IconSymbol
              name="paperplane.fill"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row px-6 pt-4 pb-2 border-b border-border">
          {["summary", "keypoints", "flashcards"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab as any);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 pb-3 px-2 border-b-2 ${
                activeTab === tab
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-muted"
                }`}
              >
                {tab === "keypoints" ? "Key Points" : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {activeTab === "summary" && (
            <View>
              <View className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                <View className="flex-row items-center gap-2 mb-3">
                  <IconSymbol
                    name="doc.text.fill"
                    size={20}
                    color={colors.primary}
                  />
                  <Text className="font-semibold text-foreground">
                    AI-Generated Summary
                  </Text>
                </View>
                <Text className="text-base text-foreground leading-relaxed">
                  {SAMPLE_SUMMARY}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleGenerateQuiz}
                className="rounded-xl py-4 px-6 flex-row items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <IconSymbol
                  name="pencil.and.list.clipboard"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-semibold ml-2">
                  Generate Quiz
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "keypoints" && (
            <View>
              <FlatList
                data={KEY_POINTS}
                renderItem={renderKeyPoint}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {activeTab === "flashcards" && (
            <View>
              <FlatList
                data={FLASHCARDS}
                renderItem={renderFlashcard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
