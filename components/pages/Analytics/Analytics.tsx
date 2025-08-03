import { ScrollView, Text, View } from "react-native";
import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";
import AnalyticsTotal from "@/components/pages/Analytics/AnalyticsTotal";
import AnalyticsCharts from "@/components/pages/Analytics/AnalyticsCharts";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";
import PromptLogin from "@/components/ui/PromptLogin";

export default function AnalyticsPageComponent() {
  const { user } = useAuth() as IAUTH;

  if (!user) {
    return <PromptLogin />;
  }

  if (user?.role !== "SELLER") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Only sellers can view this page</Text>
      </View>
    );
  }

  return (
    <ScrollView className={" h-full bg-white px-2 py-4"}>
      <View className={"gap-2 mb-4"}>
        <Text className={"font-semibold text-lg text-grey-10 "}>
          Seller's Analytic
        </Text>
        <Text className={"font-normal text-lg text-grey-7 "}>
          Hi {user?.name}, Welcome back!
        </Text>
      </View>

      <AnalyticsTotal />

      <AnalyticsCharts />
    </ScrollView>
  );
}
