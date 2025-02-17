import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  icon: any;
  text: string;
  focused: boolean;
  customStyles?: string;
}

export default function TabBarIcon({
  icon,
  text,
  focused,
  customStyles,
}: Props) {
  return (
    <View className="w-full  items-center">
      <MaterialIcons
        name={icon}
        color={focused ? "#f6f6f6" : "#ababab"}
        size={28}
        className={customStyles}
      />
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
