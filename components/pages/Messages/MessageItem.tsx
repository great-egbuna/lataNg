import { Text, View } from "react-native";
import RoundedImage from "@/components/ui/RoundedImage";
import { images } from "@/constants/images";

export default function MessageItem() {
  return (
    <View className={"flex-row gap-4 my-2 border-b border-grey-1 py-3"}>
      <RoundedImage imgSource={images.fashion} className={"self-center"} />

      <View className={"gap-0.5 flex-1"}>
        <View className={"flex-row gap-1 justify-between pr-[43px] "}>
          <Text className={"font-normal text-small text-grey-8-100"}>
            Techking Gadgets
          </Text>

          <Text className={"font-normal text-[6px] text-grey-8-100"}>
            14:23
          </Text>
        </View>

        <Text className={"font-normal text-sm text-grey-11"}>
          Apple iphone 12pro
        </Text>

        <Text className={"font-normal text-xs text-grey-8-100"}>
          You: How much?
        </Text>
      </View>
    </View>
  );
}
