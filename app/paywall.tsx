import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSubscription } from "@/hooks/use-subscription";

export default function PaywallScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isPro, upgradeToPro } = useSubscription();

  const handleUpgrade = async () => {
    if (isPro) return;
    await upgradeToPro();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/summarization" as any);
  };

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
          <Text className="text-2xl font-bold text-foreground">Upgrade Plan</Text>
        </View>

        {/* Plan Info */}
        <View className="px-6 py-8">
          <Text className="text-base text-muted mb-6">
            Unlock unlimited AI generations with Pro. Free plan includes 10 generations/day.
          </Text>

          {/* Free Plan */}
          <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
            <Text className="text-lg font-bold text-foreground mb-1">Free Plan</Text>
            <Text className="text-sm text-muted mb-2">$0 / month</Text>
            <Text className="text-sm text-foreground">• 10 generations/day</Text>
            <Text className="text-sm text-foreground">• Summary + key points</Text>
          </View>

          {/* Pro Plan */}
          <View className="bg-primary/10 border border-primary rounded-2xl p-5 mb-6">
            <Text className="text-lg font-bold text-primary mb-1">Pro Plan</Text>
            <Text className="text-sm text-muted mb-2">$9 / month (demo)</Text>
            <Text className="text-sm text-foreground">• Unlimited generations</Text>
            <Text className="text-sm text-foreground">• Priority processing</Text>
            <Text className="text-sm text-foreground">• Advanced study exports</Text>
          </View>

          {/* Upgrade Button */}
          <TouchableOpacity
            onPress={handleUpgrade}
            disabled={isPro}
            className="rounded-xl py-4 px-6 items-center"
            style={{ backgroundColor: isPro ? colors.muted : colors.primary }}
          >
            <Text className="text-white font-semibold">
              {isPro ? "You are on Pro" : "Upgrade to Pro (Demo)"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}