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
      {type === "text" ? <Ionicons name={icon} /> : icon}

      <Text className={"text-sm text-grey-5 font-normal"}>{text}</Text>
    </View>
  );
}
