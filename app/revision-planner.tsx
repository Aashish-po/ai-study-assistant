import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface RevisionTask {
  id: string;
  date: string;
  topic: string;
  duration: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

const REVISION_TASKS: RevisionTask[] = [
  {
    id: "1",
    date: "Today",
    topic: "Photosynthesis - Light Reactions",
    duration: "45 min",
    completed: true,
    priority: "high",
  },
  {
    id: "2",
    date: "Today",
    topic: "Photosynthesis - Calvin Cycle",
    duration: "30 min",
    completed: false,
    priority: "high",
  },
  {
    id: "3",
    date: "Tomorrow",
    topic: "Cellular Respiration",
    duration: "60 min",
    completed: false,
    priority: "medium",
  },
  {
    id: "4",
    date: "Tomorrow",
    topic: "Enzyme Kinetics",
    duration: "45 min",
    completed: false,
    priority: "medium",
  },
  {
    id: "5",
    date: "Feb 25",
    topic: "DNA Replication",
    duration: "50 min",
    completed: false,
    priority: "low",
  },
];

const EXAM_INFO = {
  subject: "Biology",
  date: "March 15, 2026",
  daysLeft: 22,
  totalTopics: 12,
  completedTopics: 3,
};

export default function RevisionPlannerScreen() {
  const router = useRouter();
  const colors = useColors();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const renderTask = ({ item }: { item: RevisionTask }) => (
    <TouchableOpacity
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      className={`rounded-xl p-4 mb-3 border border-border flex-row items-center gap-3 ${
        item.completed ? "bg-success/10" : "bg-surface"
      }`}
    >
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          item.completed
            ? "bg-success border-success"
            : "border-border"
        }`}
      >
        {item.completed && (
          <IconSymbol
            name="checkmark.circle.fill"
            size={16}
            color="white"
          />
        )}
      </View>

      <View className="flex-1">
        <Text className={`font-semibold ${item.completed ? "text-muted line-through" : "text-foreground"}`}>
          {item.topic}
        </Text>
        <View className="flex-row items-center gap-2 mt-1">
          <IconSymbol
            name="calendar"
            size={14}
            color={colors.muted}
          />
          <Text className="text-xs text-muted">{item.date}</Text>
          <Text className="text-xs text-muted">•</Text>
          <IconSymbol
            name="calendar"
            size={14}
            color={colors.muted}
          />
          <Text className="text-xs text-muted">{item.duration}</Text>
        </View>
      </View>

      <View
        className="px-2 py-1 rounded-full"
        style={{ backgroundColor: getPriorityColor(item.priority) + "20" }}
      >
        <Text
          className="text-xs font-semibold capitalize"
          style={{ color: getPriorityColor(item.priority) }}
        >
          {item.priority}
        </Text>
      </View>
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
          <Text className="text-2xl font-bold text-foreground">Revision Plan</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6">
          {/* Exam Info Card */}
          <View className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 mb-6 shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-white/80 text-sm font-medium mb-1">
                  {EXAM_INFO.subject} Exam
                </Text>
                <Text className="text-white text-2xl font-bold">
                  {EXAM_INFO.daysLeft} Days Left
                </Text>
              </View>
              <Text className="text-white/60 text-sm">
                {EXAM_INFO.date}
              </Text>
            </View>

            {/* Progress */}
            <View className="bg-white/20 rounded-full h-2 overflow-hidden mb-2">
              <View
                className="bg-white h-full"
                style={{
                  width: `${(EXAM_INFO.completedTopics / EXAM_INFO.totalTopics) * 100}%`,
                }}
              />
            </View>
            <Text className="text-white/80 text-xs">
              {EXAM_INFO.completedTopics}/{EXAM_INFO.totalTopics} topics completed
            </Text>
          </View>

          {/* Today's Goal */}
          <View className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol
                name="lightbulb.fill"
                size={20}
                color={colors.warning}
              />
              <Text className="font-semibold text-foreground">
                Today's Goal
              </Text>
            </View>
            <Text className="text-sm text-muted">
              Complete 75 minutes of revision to stay on track
            </Text>
          </View>

          {/* Revision Tasks */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              Revision Schedule
            </Text>
            <FlatList
              data={REVISION_TASKS}
              renderItem={renderTask}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Smart Tips */}
          <View className="bg-primary/10 border border-primary/30 rounded-xl p-4 mt-6">
            <View className="flex-row items-start gap-3">
              <IconSymbol
                name="brain"
                size={20}
                color={colors.primary}
              />
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">
                  Smart Revision Tips
                </Text>
                <Text className="text-sm text-muted">
                  Our AI adjusts your schedule based on spaced repetition principles to maximize retention.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
