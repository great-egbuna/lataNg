import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import IonIcons from "@expo/vector-icons/Ionicons";
import { truncateString } from "@/utils/utils";

interface Props {
  discount?: string;
  price: string;
  name: string;
  desc: string;
  location: string;
  imgSource: ImageSourcePropType;
  label?: string;
  onPress?: () => void;
}

export default function ProductCard({
  discount,
  price,
  name,
  desc,
  location,
  imgSource,
  label,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      className="flex-1 max-w-[194px] border border-grey-2 p-2 rounded-lg relative"
      onPress={onPress}
    >
      <Image
        className="w-full h-[148px] rounded-md"
        resizeMode="contain"
        source={imgSource}
      />

      <View className="my-8 gap-[6px]">
        {discount && (
          <Label text={`${discount}% OFF`} className="bg-[#fe0707]" />
        )}

        <Text className="text-purple font-semibold text-xs">#{price}</Text>

        <View className="flex-row justify-between items-center">
          <Text>{name}</Text>

          <Pressable className="w-6 h-6 rounded-full flex items-center justify-center bg-offwhite">
            <IonIcons name="bookmarks-outline" size={16} />
          </Pressable>
        </View>

        <Text className="text-xs text-grey-8 font-normal w-full max-w-[92px]">
          {truncateString(desc)}
        </Text>

        <View className="flex-row items-center">
          <IonIcons name="location-outline" />

          <Text className="text-xs text-grey-8 font-normal w-full max-w-[92px]">
            {location}
          </Text>
        </View>
      </View>

      <Label text={label as string} className="absolute left-0 top-0" />
    </TouchableOpacity>
  );
}

const Label = ({ text, className }: { text: string; className?: string }) => {
  return (
    <View
      className={`bg-purple w-[67px] py-1.5 px-3 rounded-br-[3px] justify-center items-center ${className}`}
    >
      <Text className="text-white font-normal text-[10px]">{text}</Text>
    </View>
  );
};
