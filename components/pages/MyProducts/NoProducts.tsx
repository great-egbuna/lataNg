import { images } from "@/constants/images";
import { Image, Text, View } from "react-native";

export default function NoProducts() {
  return (
    <View className="items-center w-full">
      <Image source={images.smileyEyes} />
      <Text className="text-grey-7b fon6-semibold">
        You do not have an advert for now
      </Text>
    </View>
  );
}
