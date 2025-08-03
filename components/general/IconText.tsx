import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface IProps {
  text: string;
  icon: any;
  type?: "icon" | "text";
}

export default function IconText({ text, icon, type = "text" }: IProps) {
  return (
    <View className={"flex-row items-center gap-0.5"}>
      {type === "text" ? <Ionicons name={icon} size={18} /> : icon}

      <Text
        className={
          "text-base md:text-lg text-gray-700 font-light tracking-[-0.72px]"
        }
      >
        {text}
      </Text>
    </View>
  );
}
