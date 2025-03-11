import { colors } from "@/colors";
import { ActivityIndicator } from "react-native";

export default function Loader({
  size,
  color,
}: {
  size?: "small" | "large";
  color?: string;
}) {
  return (
    <ActivityIndicator
      size={size ? size : "large"}
      color={color ? color : colors.purple}
    />
  );
}
