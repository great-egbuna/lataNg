import React from "react";
import { colors } from "@/colors";
import { Text, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";
import { months } from "@/constants/moths";

interface AnalyticsBarChartProps {
  monthlyData: {
    phoneClicks: number;
    productClicks: number;
    messageClicks: number;
    productViews: number;
  };
  selectedMonth: number;
}

export default function AnalyticsBarChart({
  monthlyData,
  selectedMonth,
}: AnalyticsBarChartProps) {
  // Get current month name
  const currentMonthName =
    months.find((m) => m.month === selectedMonth)?.name || "";

  // Create data array with real values from the API
  const data = [
    {
      category: "Views",
      value: monthlyData.productViews,
    },
    {
      category: "Product Clicks",
      value: monthlyData.productClicks,
    },
    {
      category: "Phone Clicks",
      value: monthlyData.phoneClicks,
    },
    {
      category: "Message Clicks",
      value: monthlyData.messageClicks,
    },
  ];

  // Find the maximum value for domain scaling
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <View className="my-6 border border-grey-2 p-4 rounded-lg">
      <Text className="font-semibold text-grey-8 mb-2">
        Analytics for {currentMonthName}
      </Text>
      <View
        className="border border-grey-2 p-3 rounded-lg"
        style={{ height: 300 }}
      >
        <CartesianChart
          data={data}
          xKey="category"
          yKeys={["value"]}
          domain={{ y: [0, maxValue * 1.1 || 1000] }} // Add 10% padding to the max value
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            formatXLabel(label) {
              return label;
            },
            formatYLabel(label) {
              return Number(label) >= 1000
                ? `${(Number(label) / 1000).toFixed(1).toString()}k`
                : label.toString();
            },
            tickCount: { x: 4, y: 5 },
            labelColor: colors.offWhite || "#444",
          }}
          style={{
            backgroundColor: "transparent",
          }}
        >
          {({ points, chartBounds }) => {
            // Create an array of colors for different bar categories
            const barColors = [
              colors.purple,
              colors.offWhite || "#B39DDB",
              "#4CAF50",
              "#FF9800",
            ];

            return (
              <>
                {points.value.map((point, index) => (
                  <Bar
                    key={`bar-${index}`}
                    point={point}
                    color={barColors[index % barColors?.length]}
                    animate={{
                      type: "timing",
                      duration: 1000,
                      delay: index * 150,
                    }}
                    chartBounds={chartBounds}
                    roundedCorners={{ topLeft: 5, topRight: 5 }}
                  />
                ))}
              </>
            );
          }}
        </CartesianChart>
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap justify-center mt-4">
        {data.map((item, index) => (
          <View
            key={`legend-${index}`}
            className="flex-row items-center mr-4 mb-2"
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor:
                  index === 0
                    ? colors.purple
                    : index === 1
                    ? colors.offWhite || "#B39DDB"
                    : index === 2
                    ? colors.green || "#4CAF50"
                    : colors.orange || "#FF9800",
                marginRight: 4,
              }}
            />
            <Text className="text-grey-7 text-xs">
              {item.category}: {item.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
