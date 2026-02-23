import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { title } from "node:process";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "upload",
    title: "Upload Notes",
    description: "Add study materials",
    icon: "cloud.upload.fill",
    route: "/upload-notes",
    color: "#0a7ea4",
  },
  {
    id: "quiz",
    title: "Start Quiz",
    description: "Practice questions",
    icon: "pencil.and.list.clipboard",
    route: "/quiz",
    color: "#7C3AED",
  },
  {
    id: "revision",
    title: "Revision Plan",
    description: "Smart study schedule",
    icon: "calendar",
    route: "/revision-planner",
    color: "#F59E0B",
  },
  {
    id: "voice",
    title: "Voice Mode",
    description: "Listen to explanations",
    icon: "speaker.wave.2.fill",
    route: "/voice-explanations",
    color: "#22C55E",
  },
];
 {
    id: "analytics",
    title: "Analytics",
    description: "Track adaptive progress",
    icon: "star.fill",
    route: "/analytics",
    color: "#EF4444",
  },
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

  const handleQuickAction = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity
      onPress={() => handleQuickAction(item.route)}
      style={{
        transform: [{ scale: 1 }],
      }}
      activeOpacity={0.8}
    >
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        <View className="flex-row items-center gap-3">
          <View
            className="rounded-full p-3"
            style={{ backgroundColor: item.color + "20" }}
          >
            <IconSymbol
              name={item.icon as any}
              size={24}
              color={item.color}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {item.title}
            </Text>
            <Text className="text-sm text-muted">
              {item.description}
            </Text>
          </View>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.muted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

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

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Quick Actions
            </Text>
            <FlatList
              data={QUICK_ACTIONS}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
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
