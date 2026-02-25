import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
interface RecentSession {
  id: string;
  title: string;
  subject: string;
  timestamp: string;
  progress: number;
}

const RECENT_SESSIONS: RecentSession[] = [
  {
    id: "1",
    title: "Biology Chapter 5",
    subject: "Biology",
    timestamp: "Today, 2:30 PM",
    progress: 75,
  },
  {
    id: "2",
    title: "Math Algebra",
    subject: "Mathematics",
    timestamp: "Yesterday, 4:15 PM",
    progress: 60,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleStartSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/study-session" as any);
  };

  const renderRecentSession = ({ item }: { item: RecentSession }) => (
    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.title}
          </Text>
          <Text className="text-sm text-muted">{item.subject}</Text>
        </View>
        <Text className="text-xs text-muted">{item.timestamp}</Text>
      </View>
      <View className="bg-border rounded-full h-2 overflow-hidden">
        <View
          className="bg-primary h-full"
          style={{ width: `${item.progress}%` }}
        />
      </View>
      <Text className="text-xs text-muted mt-2">{item.progress}% complete</Text>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header Section */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 pt-6 pb-8">
          <Text className="text-4xl font-bold text-foreground mb-2">
            Study Buddy
          </Text>
          <Text className="text-base text-muted">
            Your AI-powered study companion
          </Text>
        </View>

        {/* Main Content */}
        <View className="px-6 pb-6">
          {/* Study Streak Card */}
          <View className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 mb-6 shadow-sm">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-white/80 text-sm font-medium mb-1">
                  Study Streak
                </Text>
                <Text className="text-white text-3xl font-bold">
                  7 Days
                </Text>
              </View>
              <View className="bg-white/20 rounded-full p-3">
                <IconSymbol
                  name="lightbulb.fill"
                  size={24}
                  color="white"
                />
              </View>
            </View>
          </View>

          {/* Study Session Entry */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Today&apos;s Focus
            </Text>
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <Text className="text-base text-muted mb-4">
                Tell us what you&apos;re studying and AI will guide your full session.
              </Text>
              <TouchableOpacity
                onPress={handleStartSession}
                className="rounded-xl py-4 px-6 flex-row items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <IconSymbol name="play.circle.fill" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Start Study Session</Text>
              </TouchableOpacity>
              <Text className="text-xs text-muted mt-3">
                Includes summary, quiz generation, and session tracking.
              </Text>
            </View>
          </View>

          {/* Recent Sessions */}
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-foreground">
                Recent Sessions
              </Text>
              <TouchableOpacity onPress={() => router.push("/history" as any)}>
                <Text className="text-primary font-medium">View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={RECENT_SESSIONS}
              renderItem={renderRecentSession}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Daily Goal */}
          <View className="bg-success/10 border border-success/30 rounded-xl p-4 mt-6">
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol
                name="checkmark.circle.fill"
                size={20}
                color={colors.success}
              />
              <Text className="text-sm font-semibold text-foreground">
                Daily Goal
              </Text>
            </View>
            <Text className="text-sm text-muted">
              Study for 30 minutes today to maintain your streak
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
