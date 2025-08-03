import { FlatList, ScrollView, Text, View } from "react-native";
import IconText from "@/components/general/IconText";
import Entypo from "@expo/vector-icons/Entypo";

const safetyTips = [
  "Meet the seller at a safe place",
  "Check the items well before paying",
  "Don’t pay for items in advance",
  "Only pay when you are satisfied with the items",
];

export default function SafetyTips() {
  return (
    <View>
      <View className={"border border-grey-2 rounded-[10px] p-4"}>
        <Text
          className={
            "text-grey-10 font-medium text-base md:text-lg tracking-[-0.72px] mb-3"
          }
        >
          Safety tips
        </Text>

        {safetyTips.map((item, index) => (
          <IconText
            icon={<Entypo name={"dot-single"} color={"#464646"} />}
            text={item}
            type={"icon"}
            key={index}
          />
        ))}
      </View>
    </View>
  );
}
