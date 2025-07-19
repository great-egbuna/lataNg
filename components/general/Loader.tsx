import { colors } from "@/colors";
import { ActivityIndicator, Text, View } from "react-native";

export default function Loader({
  size,
  color,
}: {
  size?: "small" | "large";
  color?: string;
}) {
  return (
    <ActivityIndicator
      size={!!size ? size : "large"}
      color={!!color ? color : colors.purple}
    />
  );
}

export const FullScreenLoader = ({ label }: { label?: string }) => {
  return (
    <View className="absolute inset-0 z-[100] bg-white flex items-center justify-center">
      <Loader size="small" />
      <Text className="text-gray-700/70 text-xs sm:text-sm md:text-base">
        {!!label ? label : "Please Wait..."}
      </Text>
    </View>
  );
};
