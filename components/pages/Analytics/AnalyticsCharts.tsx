import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import AnalyticsBarChart from "./AnalyticsBarChart";

import { generalService } from "@/services/general.service";
import { months } from "@/constants/moths";
import DropdownInput from "@/components/general/Dropdown";
import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";
import { useAuth } from "@/context/AuthContext";
import PromptLogin from "@/components/ui/PromptLogin";
import Loader from "@/components/general/Loader";
import { IAUTH } from "@/interfaces/context/auth";

export default function AnalyticsCharts() {
  const { isLoggedIn, user } = useAuth() as IAUTH;

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [monthlyClicks, setMonthlyClicks] = useState({
    phoneClicks: 0,
    productClicks: 0,
    messageClicks: 0,
    productViews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyClicks = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generalService.getClicksByMonth(selectedMonth);

        if (result instanceof Error) {
          setError(result.message);
        } else {
          setMonthlyClicks({
            phoneClicks: result.phoneClicks || 0,
            productClicks: result.productClicks || 0,
            messageClicks: result.messageClicks || 0,
            productViews: result.productViews || 0,
          });
        }
      } catch (err) {
        setError("Failed to fetch monthly statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyClicks();
  }, [selectedMonth]);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Handle month selection
  const handleMonthSelect = (value: any) => {
    setSelectedMonth(value.month);
  };

  if (loading) {
    return <Loader size="large" />;
  }

  return (
    <View>
      <View className={"flex-row justify-between items-center"}>
        <Text className={"flex-1"}>Sales Chart</Text>

        <DropdownInput
          placeholder={months.find((m) => m.month === selectedMonth)?.name}
          data={months}
          onSelect={handleMonthSelect}
          className={"flex-1"}
        />
      </View>
      {/*   <AnalyticsBarChart
        monthlyData={monthlyClicks}
        selectedMonth={selectedMonth}
      /> */}
      {error ? (
        <Text className="text-red-500 text-center my-2">{error}</Text>
      ) : (
        <View>
          <AnalyticsCard
            text_one={"Product Views"}
            text_two={formatNumber(monthlyClicks.productViews)}
            text_three={`Product views for ${
              months.find((m) => m.month === selectedMonth)?.name
            }`}
            className={"bg-white mt-4"}
          />

          <AnalyticsCard
            text_one={"Product Clicks"}
            text_two={formatNumber(monthlyClicks.productClicks)}
            text_three={`Product clicks for ${
              months.find((m) => m.month === selectedMonth)?.name
            }`}
            className={"bg-white mt-4"}
          />

          <AnalyticsCard
            text_one={"Phone Clicks"}
            text_two={formatNumber(monthlyClicks.phoneClicks)}
            text_three={`Phone clicks for ${
              months.find((m) => m.month === selectedMonth)?.name
            }`}
            className={"bg-white mt-4"}
          />

          <AnalyticsCard
            text_one={"Message Clicks"}
            text_two={formatNumber(monthlyClicks.messageClicks)}
            text_three={`Message clicks for ${
              months.find((m) => m.month === selectedMonth)?.name
            }`}
            className={"bg-white mt-4"}
          />
        </View>
      )}
    </View>
  );
}
