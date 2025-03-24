import { useState, useEffect } from "react";
import { subscriptionService } from "@/services/subscription.service";

interface Plan {
  id: number;
  name: string;
}

interface Subscription {
  id: number;
  type: string;
  plans: Plan[];
}

interface UseSubscriptionsResult {
  subscriptionPackages: any[];
  userData: any;
  loading: boolean;
  error: string | null;
  tabs: { id: number; name: string }[];
  refetchSubscriptions: () => Promise<void>;
}

export function useSubscriptions(): UseSubscriptionsResult {
  const [subscriptionPackages, setSubscriptionPackages] = useState<any[]>([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const result = await subscriptionService.getSubscriptions();

      if (result instanceof Error) {
        setError(result.message);
      } else {
        // Extract unique plan names across all subscriptions
        const nameSet = new Set<string>();
        const extractedTabs: { id: number; name: string }[] = [];

        // Process all subscriptions to collect unique plan names
        result.subscriptions.forEach((subscription: any) => {
          if (subscription.plans && Array.isArray(subscription.plans)) {
            subscription.plans.forEach((plan: any) => {
              // Skip verified plans and duplicates
              if (
                plan.name &&
                !nameSet.has(plan.name) &&
                plan.name.toUpperCase() !== "VERIFIED"
              ) {
                nameSet.add(plan.name);
                extractedTabs.push({
                  id: plan.id,
                  name: plan.name,
                });
              }
            });
          }
        });

        const freeIndex = extractedTabs.findIndex(
          (tab) => tab.name.toUpperCase() === "FREE"
        );

        if (freeIndex > 0) {
          const freePlan = extractedTabs.splice(freeIndex, 1)[0];
          extractedTabs.unshift(freePlan);
        }

        setSubscriptionPackages(result.subscriptions || []);
        setTabs(extractedTabs);
        setUserData(result.userData);
      }
    } catch (err) {
      setError("Failed to load subscriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSubscriptions();
    })();
  }, []);

  const refetchSubscriptions = async () => {
    await fetchSubscriptions();
  };

  return {
    subscriptionPackages,
    userData,
    loading,
    error,
    tabs,
    refetchSubscriptions,
  };
}
