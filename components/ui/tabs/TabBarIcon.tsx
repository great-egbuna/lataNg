// components/ui/tabs/TabBarIcon.tsx
import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  icon: any;
  text: string;
  focused: boolean;
  customStyles?: string;
  showDot?: boolean; // Add this prop
}

export default function TabBarIcon({
  icon,
  text,
  focused,
  customStyles,
  showDot,
}: Props) {
  return (
    <View className="w-full items-center relative">
      <View className="relative">
        <MaterialIcons
          name={icon}
          color={focused ? "#f6f6f6" : "#ababab"}
          size={24}
          className={customStyles}
        />
        {showDot && (
          <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </View>
      <Text
        className={`${
          focused ? "text-grey-1" : "text-grey-5"
        } text-[10px] mt-1`}
      >
        {text}
      </Text>
    </View>
  );
}
