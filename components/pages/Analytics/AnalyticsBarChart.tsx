import { colors } from "@/colors";
import { Text, View } from "react-native";
import { Bar, CartesianChart, Line } from "victory-native";

const DATA = Array.from({ length: 31 }, (_, i) => {
  return {
    i: i,
    highTmp: 30 * 30 * Math.random(),
  };
});

const data = [
  {
    month: "Jan",
    clicks: 1000,
    productClicks: 500,
  },
  {
    month: "Feb",
    clicks: 5000,
    productClicks: 2500,
  },
  {
    month: "Mar",
    clicks: 4000,
    productClicks: 2000,
  },
  {
    month: "April",
    clicks: 8000,
    productClicks: 4000,
  },
  {
    month: "May",
    clicks: 6000,
    productClicks: 3000,
  },
  {
    month: "Jun",
    clicks: 1000,
    productClicks: 500,
  },
  {
    month: "Jul",
    clicks: 3000,
    productClicks: 1500,
  },
  {
    month: "Aug",
    clicks: 1000,
    productClicks: 500,
  },
  {
    month: "Sep",
    clicks: 2500,
    productClicks: 1250,
  },
  {
    month: "Oct",
    clicks: 4000,
    productClicks: 2000,
  },
  {
    month: "Nov",
    clicks: 1000,
    productClicks: 500,
  },
  {
    month: "Dec",
    clicks: 1000,
    productClicks: 500,
  },
];

export default function AnalyticsBarChart() {
  return (
    <View className="h-full my-6 border border-grey-2 p-4 rounded-lg">
      <View className=" h-full border border-grey-2 p-3 rounded-lg">
        <CartesianChart
          data={data}
          xKey={"month"}
          yKeys={["clicks", "productClicks"]}
          domain={{ y: [0, 10000] }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            formatXLabel(label) {
              return label;
            },
            labelColor: "red",
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <Bar
                points={points.clicks}
                color={colors.purple}
                /*  strokeWidth={3} */
                animate={{ type: "timing", duration: 1000 }}
                chartBounds={chartBounds}
                roundedCorners={{ topLeft: 5, topRight: 5 }}
              ></Bar>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
}
