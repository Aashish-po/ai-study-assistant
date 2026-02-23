import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { subscriptionService, type PlanType } from "@/services/subscription.service";

export function useSubscription() {
  const [plan, setPlan] = useState<PlanType>("free");
  const [loading, setLoading] = useState(true);

  // Fetch current plan from service
  const refreshPlan = useCallback(async () => {
    setLoading(true);
    try {
      const next = await subscriptionService.getPlan();
      setPlan(next);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh plan when screen gains focus
  useFocusEffect(
    useCallback(() => {
      refreshPlan();
    }, [refreshPlan])
  );

  // Upgrade user to Pro plan
  const upgradeToPro = useCallback(async () => {
    setLoading(true);
    try {
      await subscriptionService.setPlan("pro");
      setPlan("pro");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    plan,
    loading,
    isPro: plan === "pro",
    refreshPlan,
    upgradeToPro,
  };
}