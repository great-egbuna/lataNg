import { Text, View } from "react-native";
import IconText from "@/components/general/IconText";

interface IProductDetails {
  price: string;
  name: string;
  description: string;
  location: string;
  postTime: string;
}

export default function ProductDescription({
  price,
  name,
  description,
  location,
  postTime,
}: IProductDetails) {
  return (
    <View className={"flex-col gap-2.5"}>
      <Text className={"text-purple font-semibold text-base"}> #{price}</Text>

      <Text className={"text-grey-10 font-semibold text-base"}>{name}</Text>

      <View className={"flex-row gap-3 items-center"}>
        <IconText text={postTime} icon={"time-outline"} />
        <IconText text={location} icon={"location-outline"} />
      </View>

      <View>
        <Text className={"text-grey-8-100 font-semibold text-sm"}>
          Product Description
        </Text>

        <Text className={"text-grey-8 font-medium text-sm mt-1-5 max-w-2xl"}>
          {description}
        </Text>
      </View>
    </View>
  );
}
