import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { generalService } from "@/services/general.service";
import { months } from "@/constants/moths";
import DropdownInput from "@/components/general/Dropdown";
import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";
import Loader from "@/components/general/Loader";

export default function AnalyticsCharts() {
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
    <View className="mb-6">
      <View className={"flex-row justify-between  my-2"}>
        <Text className={"flex-1 text-lg"}>Product Insights</Text>

        <DropdownInput
          placeholder={months.find((m) => m.month === selectedMonth)?.name}
          data={months}
          onSelect={handleMonthSelect}
          className={"flex-1 relative"}
          scrollViewClassName="min-h-[400px]"
        />
      </View>
      {/*   <AnalyticsBarChart
        monthlyData={monthlyClicks}
        selectedMonth={selectedMonth}
      /> */}
      {error ? (
        <Text className="text-red-500 text-center my-2">{error}</Text>
      ) : (
        <View
          className={"border border-grey-2 mb-3 rounded-lg py-4 px-2 gap-2"}
        >
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
