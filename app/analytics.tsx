import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { type QuizHistoryItem } from "@/lib/quiz-history";
import { historyService } from "@/services/history.service";

const buildWeakTopics = (quizHistory: QuizHistoryItem[]) => {
  const weak = quizHistory
    .filter((item) => item.percentage < 70)
    .map((item) => item.topic);

  const counts = new Map<string, number>();
  weak.forEach((topic) =>
    counts.set(topic, (counts.get(topic) ?? 0) + 1)
  );

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const colors = useColors();

  const [totalSummaries, setTotalSummaries] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const [summaries, quizzes] = await Promise.all([
        historyService.listSummaries(),
        historyService.listQuizzes(),
      ]);

      setTotalSummaries(summaries?.length ?? 0);
      setQuizHistory(quizzes ?? []);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAnalytics();
  }, [loadAnalytics]);

  const quizzesAttempted = quizHistory.length;

  const averageScore = useMemo(() => {
    if (!quizHistory.length) return 0;
    const total = quizHistory.reduce(
      (sum, quiz) => sum + quiz.percentage,
      0
    );
    return Math.round(total / quizHistory.length);
  }, [quizHistory]);

  const weakTopics = useMemo(
    () => buildWeakTopics(quizHistory),
    [quizHistory]
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-6 border-b border-border">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
          >
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-foreground">
            Analytics
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View className="px-6 py-6">
            <Text className="text-sm text-muted mb-4">
              Personalized AI Learning Dashboard
            </Text>

            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1 bg-primary/10 border border-primary/30 rounded-xl p-4">
                <Text className="text-xs text-muted mb-1">
                  Total Summaries
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {totalSummaries}
                </Text>
              </View>

              <View className="flex-1 bg-success/10 border border-success/30 rounded-xl p-4">
                <Text className="text-xs text-muted mb-1">
                  Quizzes Attempted
                </Text>
                <Text className="text-2xl font-bold text-success">
                  {quizzesAttempted}
                </Text>
              </View>
            </View>

            <View className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
              <Text className="text-xs text-muted mb-1">
                Average Score
              </Text>
              <Text
                className="text-2xl font-bold"
                style={{ color: colors.warning }}
              >
                {averageScore}%
              </Text>
            </View>

            {/* Weak Topics */}
            <Text className="text-lg font-semibold text-foreground mb-3">
              Weak Topics
            </Text>

            <FlatList
              data={weakTopics}
              keyExtractor={(item) => item.topic}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className="bg-surface border border-border rounded-xl p-4">
                  <Text className="text-sm text-muted">
                    No weak topics identified yet. Complete quizzes to
                    unlock adaptive recommendations.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View className="bg-surface border border-border rounded-xl p-4 mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol
                      name="star.fill"
                      size={16}
                      color={colors.warning}
                    />
                    <Text className="font-semibold text-foreground">
                      {item.topic}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    Low-score hits: {item.count}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}