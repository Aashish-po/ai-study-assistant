import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function StudySessionScreen() {
  const router = useRouter();
  const colors = useColors();
  const [topic, setTopic] = useState("");

  const handleContinue = () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/upload-notes",
      params: { topic: trimmedTopic },
    });
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        <View className="flex-row items-center px-6 pt-4 pb-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Start Study Session</Text>
        </View>

        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-foreground mb-2">
            What are you studying today?
          </Text>
          <Text className="text-sm text-muted mb-4">
            Share your topic and AI will handle notes parsing, summary, quiz creation, and tracking.
          </Text>

          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g., Photosynthesis chapter 5"
            placeholderTextColor={colors.muted}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground mb-4"
            style={{ color: colors.foreground }}
          />

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!topic.trim()}
            className="rounded-xl py-4 px-6 flex-row items-center justify-center"
            style={{
              backgroundColor: topic.trim() ? colors.primary : colors.muted,
              opacity: topic.trim() ? 1 : 0.8,
            }}
          >
            <IconSymbol name="play.circle.fill" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Continue Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
