import React, { useEffect, useState } from "react";
import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";
import { generalService } from "@/services/general.service";
import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "@/colors";
import Loader from "@/components/general/Loader";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import PromptLogin from "@/components/ui/PromptLogin";

export default function AnalyticsTotal() {
  const { isLoggedIn, user } = useAuth() as IAUTH;

  const [clickData, setClickData] = useState({
    productViews: 0,
    productClicks: 0,
    phoneClicks: 0,
    messageClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await generalService.getUserClicks();

        if (result instanceof Error) {
          setError(result.message);
        } else {
          setClickData({
            productViews: result.productViews || 0,
            productClicks: result.productClicks || 0,
            phoneClicks: result.phoneClicks || 0,
            messageClicks: result.messageClicks || 0,
          });
        }
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View className="h-full bg-white items-center justify-center py-6">
        <Loader size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center py-6">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <View className={"border border-grey-2 mb-3 rounded-lg py-4 px-2 gap-2"}>
      <AnalyticsCard
        text_one={"Total views"}
        text_two={formatNumber(clickData.productViews)}
        text_three={"Total view of all products"}
        textClassName={"text-white"}
      />
      <AnalyticsCard
        text_one={"Total product clicks"}
        text_two={formatNumber(clickData.productClicks)}
        text_three={"Total product clicks"}
        className={"bg-white"}
      />

      <AnalyticsCard
        text_one={"Total phone clicks"}
        text_two={formatNumber(clickData.phoneClicks)}
        text_three={"Total phone clicks"}
        className={"bg-white"}
      />

      <AnalyticsCard
        text_one={"Total message clicks"}
        text_two={formatNumber(clickData.messageClicks)}
        text_three={"Total message clicks"}
        className={"bg-white"}
      />
    </View>
  );
}
