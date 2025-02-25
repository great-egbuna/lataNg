import { Text, View } from "react-native";
import RoundedImage from "@/components/ui/RoundedImage";
import { images } from "@/constants/images";

export default function NotificationItem() {
  return (
    <View className={"flex-row gap-4 my-2 border-b border-grey-1 py-3"}>
      <RoundedImage imgSource={images.fashion} className={"self-center"} />

      <View className={"gap-0.5 flex-1"}>
        <Text className={"font-normal text-small text-grey-9"}>
          Apple iphone 12pro
        </Text>

        <Text className={"font-normal text-tiny text-grey-8-100"}>
          3 hours ago
        </Text>
      </View>
    </View>
  );
}
