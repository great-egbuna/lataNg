import { ScrollView, Text, View } from "react-native";
import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";
import AnalyticsTotal from "@/components/pages/Analytics/AnalyticsTotal";
import AnalyticsCharts from "@/components/pages/Analytics/AnalyticsCharts";

export default function AnalyticsPageComponent() {
  return (
    <ScrollView className={" h-full bg-white px-4 py-6"}>
      <View className={"gap-2 mb-4"}>
        <Text className={"font-normal text-sm text-grey-10 "}>
          Seller's Analytic
        </Text>
        <Text className={"font-normal text-xs text-grey-7 "}>
          Hi Great Welcome back!
        </Text>
      </View>

      <AnalyticsTotal />

      <AnalyticsCharts />
    </ScrollView>
  );
}
