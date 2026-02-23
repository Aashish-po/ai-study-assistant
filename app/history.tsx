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
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { type SummaryHistoryItem } from "@/lib/summary-history";
import { historyService } from "@/services/history.service";

const formatDate = (timestamp: number) => {
  try {
    return new Date(timestamp).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};

const modeLabel: Record<SummaryHistoryItem["mode"], string> = {
  simple: "Simple",
  exam: "Exam",
  detailed: "Detailed",
};

export default function HistoryScreen() {
  const router = useRouter();
  const colors = useColors();

  const [summaryHistory, setSummaryHistory] = useState<SummaryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const history = await historyService.listSummaries();
      setSummaryHistory(history ?? []);
    } catch (error) {
      console.error("Failed to load summary history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, [loadHistory]);

  const totalKeyPoints = useMemo(
    () =>
      summaryHistory.reduce(
        (count, item) => count + (item.keyPoints?.length ?? 0),
        0
      ),
    [summaryHistory]
  );

  const renderSummaryItem = ({ item }: { item: SummaryHistoryItem }) => (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
          pathname: "/summarization",
          params: { historyId: item.id },
        });
      }}
      className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center gap-3"
    >
      <View
        className="rounded-full p-3"
        style={{ backgroundColor: colors.success + "20" }}
      >
        <IconSymbol name="book.fill" size={20} color={colors.success} />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-foreground">
          {item.title || "Untitled Summary"}
        </Text>

        <View className="flex-row items-center gap-2 mt-1">
          <Text className="text-xs text-muted">
            {formatDate(item.timestamp)}
          </Text>
          <Text className="text-xs text-muted">•</Text>
          <Text className="text-xs text-primary font-medium">
            {modeLabel[item.mode]}
          </Text>
        </View>

        <Text
          className="text-xs text-muted mt-1"
          numberOfLines={1}
        >
          {item.summary}
        </Text>
      </View>

      <IconSymbol
        name="chevron.right"
        size={18}
        color={colors.muted}
      />
    </TouchableOpacity>
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
            Study History
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View className="px-6 py-6">
            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-primary/10 border border-primary/30 rounded-xl p-4">
                <Text className="text-xs text-muted mb-1">
                  Saved Summaries
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {summaryHistory.length}
                </Text>
              </View>

              <View className="flex-1 bg-success/10 border border-success/30 rounded-xl p-4">
                <Text className="text-xs text-muted mb-1">
                  Key Points Saved
                </Text>
                <Text className="text-2xl font-bold text-success">
                  {totalKeyPoints}
                </Text>
              </View>
            </View>

            {/* History List */}
            <Text className="text-lg font-semibold text-foreground mb-3">
              Summary History
            </Text>

            <FlatList
              data={summaryHistory}
              renderItem={renderSummaryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className="bg-surface border border-border rounded-xl p-4">
                  <Text className="text-sm text-muted">
                    No saved summaries yet. Generate a summary to store input,
                    output, key points, and flashcards.
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}