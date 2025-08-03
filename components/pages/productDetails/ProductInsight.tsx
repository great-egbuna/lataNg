import { colors } from "@/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

export default function ProductInsight({
  views,
  saved,
  clicks,
  visits,
}: {
  views: number;
  saved: number;
  clicks: number;
  visits: number;
}) {
  const insights = [
    {
      label: "Views",
      icon: (
        <MaterialIcons name="remove-red-eye" size={24} color={colors.purple} />
      ),
      count: views,
    },
    {
      label: "Saved",
      icon: <MaterialIcons name="bookmark" size={24} color={colors.purple} />,
      count: saved,
    },

    {
      label: "Call clicks",
      icon: <MaterialIcons name="call" size={24} color={colors.purple} />,
      count: clicks,
    },

    {
      label: "Profile visit",
      icon: <MaterialIcons name="person" size={24} color={colors.purple} />,
      count: visits,
    },
  ];

  return (
    <View className={"border border-grey-2 rounded-[10px] p-4"}>
      <Text className={"text-grey-10 font-medium text-base md:text-lg mb-3"}>
        Product insights
      </Text>

      <View>
        {insights.map((insight, i) => {
          return (
            <View
              className="flex-row items-center border-y border-grey-2 py-2"
              key={i}
            >
              <View className="flex-1 flex-row gap-3 items-center">
                {insight.icon}
                <Text className="text-base md:text-lg">{insight.label}</Text>
              </View>

              <Text className="text-base md:text-lg">{insight.count || 0}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
