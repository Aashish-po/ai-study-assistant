import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface VoiceExplanation {
  id: string;
  topic: string;
  subject: string;
  duration: string;
  isPlaying?: boolean;
}

const VOICE_EXPLANATIONS: VoiceExplanation[] = [
  {
    id: "1",
    topic: "Photosynthesis Overview",
    subject: "Biology",
    duration: "5:32",
  },
  {
    id: "2",
    topic: "Light Reactions Explained",
    subject: "Biology",
    duration: "8:15",
  },
  {
    id: "3",
    topic: "Calvin Cycle Deep Dive",
    subject: "Biology",
    duration: "6:48",
  },
  {
    id: "4",
    topic: "Chlorophyll Function",
    subject: "Biology",
    duration: "4:22",
  },
];

export default function VoiceExplanationsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setPlayingId(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderExplanation = ({ item }: { item: VoiceExplanation }) => (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.topic}
          </Text>
          <Text className="text-sm text-muted mt-1">{item.subject}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handlePlayPause(item.id)}
          className="rounded-full p-3"
          style={{
            backgroundColor:
              playingId === item.id ? colors.primary : colors.primary + "20",
          }}
        >
          <IconSymbol
            name={playingId === item.id ? "paperplane.fill" : "play.circle.fill"}
            size={24}
            color={playingId === item.id ? "white" : colors.primary}
          />
        </TouchableOpacity>
      </View>

      {playingId === item.id && (
        <View className="bg-primary/5 rounded-xl p-4">
          {/* Progress Bar */}
          <View className="mb-3">
            <View className="bg-border rounded-full h-1 overflow-hidden mb-2">
              <View
                className="bg-primary h-full"
                style={{ width: "45%" }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">
                {formatTime(currentTime)}
              </Text>
              <Text className="text-xs text-muted">{item.duration}</Text>
            </View>
          </View>

          {/* Playback Controls */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => {
                  setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : 1);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className={`px-3 py-1 rounded-full ${
                  playbackSpeed === 1.25
                    ? "bg-primary"
                    : "bg-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    playbackSpeed === 1.25
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {playbackSpeed}x
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="px-3 py-1 rounded-full bg-border"
            >
              <IconSymbol
                name="doc.text.fill"
                size={16}
                color={colors.foreground}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Voice Mode</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6">
          {/* Info Card */}
          <View className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
            <View className="flex-row items-start gap-3">
              <IconSymbol
                name="speaker.wave.2.fill"
                size={20}
                color={colors.primary}
              />
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">
                  AI Voice Explanations
                </Text>
                <Text className="text-sm text-muted">
                  Listen to detailed explanations of key concepts. Perfect for learning on the go.
                </Text>
              </View>
            </View>
          </View>

          {/* Explanations List */}
          <Text className="text-lg font-semibold text-foreground mb-3">
            Available Explanations
          </Text>
          <FlatList
            data={VOICE_EXPLANATIONS}
            renderItem={renderExplanation}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          {/* Features */}
          <View className="mt-6 pt-6 border-t border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Features
            </Text>

            <View className="flex-row items-start gap-3 mb-4">
              <View className="bg-success/20 rounded-full p-2">
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={20}
                  color={colors.success}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  Adjustable Speed
                </Text>
                <Text className="text-sm text-muted">
                  Listen at 1x or 1.25x speed
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3 mb-4">
              <View className="bg-success/20 rounded-full p-2">
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={20}
                  color={colors.success}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  Transcript View
                </Text>
                <Text className="text-sm text-muted">
                  Read along with the audio
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <View className="bg-success/20 rounded-full p-2">
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={20}
                  color={colors.success}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  Download for Offline
                </Text>
                <Text className="text-sm text-muted">
                  Save and listen anytime
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
