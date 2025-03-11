import { Text, TouchableOpacity, View } from "react-native";
import RoundedImage from "@/components/ui/RoundedImage";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";

interface Props {
  className?: string;
  text?: string;
  onPress?: () => void;
}

export default function SubscriptionCards({ className, text, onPress }: Props) {
  return (
    <TouchableOpacity
      className={`w-full h-[150px]  rounded-[10px] ${className}`}
      onPress={onPress}
    >
      <View className={"items-center justify-center h-full flex-row gap-2.5"}>
        <RoundedImage
          imgSource={images.fashion}
          className={"w-[80px] h-[80px]"}
        />

        <View className={"gap-2.5"}>
          <Text className={"font-normal text-sm text-white"}>Run ads on</Text>

          <Text className={"font-semibold text-sm text-white"}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
