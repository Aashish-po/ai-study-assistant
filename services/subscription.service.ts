import AsyncStorage from "@react-native-async-storage/async-storage";

export type PlanType = "free" | "pro";

const PLAN_KEY = "ai-study-assistant:plan";

export const subscriptionService = {
  async getPlan(): Promise<PlanType> {
    const value = await AsyncStorage.getItem(PLAN_KEY);
    return value === "pro" ? "pro" : "free";
  },

  async setPlan(plan: PlanType): Promise<void> {
    await AsyncStorage.setItem(PLAN_KEY, plan);
  },
};