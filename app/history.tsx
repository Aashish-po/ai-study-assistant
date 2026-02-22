import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  score?: number;
  questionsAnswered?: number;
  type: "quiz" | "revision" | "voice" | "summary";
}

const STUDY_SESSIONS: StudySession[] = [
  {
    id: "1",
    title: "Photosynthesis Quiz",
    subject: "Biology",
    date: "Today, 2:30 PM",
    duration: "15 min",
    score: 85,
    questionsAnswered: 10,
    type: "quiz",
  },
  {
    id: "2",
    title: "Revision: Light Reactions",
    subject: "Biology",
    date: "Today, 1:00 PM",
    duration: "45 min",
    type: "revision",
  },
  {
    id: "3",
    title: "Voice: Cellular Respiration",
    subject: "Biology",
    date: "Yesterday, 4:15 PM",
    duration: "8 min",
    type: "voice",
  },
  {
    id: "4",
    title: "Summary: DNA Replication",
    subject: "Biology",
    date: "Yesterday, 2:00 PM",
    duration: "20 min",
    type: "summary",
  },
  {
    id: "5",
    title: "Enzyme Kinetics Quiz",
    subject: "Chemistry",
    date: "Feb 19, 3:45 PM",
    duration: "20 min",
    score: 92,
    questionsAnswered: 12,
    type: "quiz",
  },
];

const getSessionIcon = (type: string) => {
  switch (type) {
    case "quiz":
      return "pencil.and.list.clipboard";
    case "revision":
      return "calendar";
    case "voice":
      return "speaker.wave.2.fill";
    case "summary":
      return "doc.text.fill";
    default:
      return "book.fill";
  }
};

const getSessionColor = (type: string, colors: any) => {
  switch (type) {
    case "quiz":
      return colors.primary;
    case "revision":
      return colors.warning;
    case "voice":
      return colors.primary;
    case "summary":
      return colors.success;
    default:
      return colors.muted;
  }
};

export default function HistoryScreen() {
  const router = useRouter();
  const colors = useColors();

  const renderSession = ({ item }: { item: StudySession }) => (
    <TouchableOpacity
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center gap-3"
    >
      <View
        className="rounded-full p-3"
        style={{
          backgroundColor: getSessionColor(item.type, colors) + "20",
        }}
      >
        <IconSymbol
          name={getSessionIcon(item.type) as any}
          size={20}
          color={getSessionColor(item.type, colors)}
        />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-foreground">
          {item.title}
        </Text>
        <View className="flex-row items-center gap-2 mt-1">
          <Text className="text-xs text-muted">{item.subject}</Text>
          <Text className="text-xs text-muted">•</Text>
          <Text className="text-xs text-muted">{item.duration}</Text>
        </View>
        <Text className="text-xs text-muted mt-1">{item.date}</Text>
      </View>

      {item.score && (
        <View className="items-center">
          <Text className="text-lg font-bold text-primary">
            {item.score}%
          </Text>
          <Text className="text-xs text-muted">
            {item.questionsAnswered} Q
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
          <Text className="text-2xl font-bold text-foreground">Study History</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6">
          {/* Stats Cards */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-primary/10 border border-primary/30 rounded-xl p-4">
              <Text className="text-xs text-muted mb-1">Total Sessions</Text>
              <Text className="text-2xl font-bold text-primary">
                {STUDY_SESSIONS.length}
              </Text>
            </View>
            <View className="flex-1 bg-success/10 border border-success/30 rounded-xl p-4">
              <Text className="text-xs text-muted mb-1">Avg Score</Text>
              <Text className="text-2xl font-bold text-success">
                88%
              </Text>
            </View>
          </View>

          {/* Sessions List */}
          <Text className="text-lg font-semibold text-foreground mb-3">
            Recent Activity
          </Text>
          <FlatList
            data={STUDY_SESSIONS}
            renderItem={renderSession}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          {/* Insights */}
          <View className="bg-warning/10 border border-warning/30 rounded-xl p-4 mt-6">
            <View className="flex-row items-start gap-3">
              <IconSymbol
                name="lightbulb.fill"
                size={20}
                color={colors.warning}
              />
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">
                  Your Progress
                </Text>
               <Text className="text-sm text-muted">
                You&apos;ve completed 5 study sessions this week. Keep up the consistency
               </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
