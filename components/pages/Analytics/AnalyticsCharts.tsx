import { Text, View } from "react-native";
import DropdownInput from "@/components/general/Dropdown";
import { months } from "@/constants/moths";
import AnalyticsBarChart from "@/components/pages/Analytics/AnalyticsBarChart";
import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";

export default function AnalyticsCharts() {
  return (
    <View>
      <View className={"flex-row  justify-between items-center "}>
        <Text className={"flex-1"}>Sales Chart</Text>

        <DropdownInput
          placeholder={"Select month"}
          data={months}
          onSelect={() => {}}
          className={"flex-1"}
        />
      </View>

      <AnalyticsBarChart />

      <AnalyticsCard
        text_one={"Total product clicks"}
        text_two={"5,000"}
        text_three={"Total product clicks"}
        className={"bg-white"}
      />
    </View>
  );
}
