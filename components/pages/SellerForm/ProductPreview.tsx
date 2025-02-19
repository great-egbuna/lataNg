import { Image, ImageSourcePropType, Text, View } from "react-native";
import IconText from "@/components/general/IconText";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProductPreviewProps {
  imgSource?: ImageSourcePropType;
}

export default function ProductPreview({ imgSource }: ProductPreviewProps) {
  return (
    <View className={"border border-grey-1 rounded-lg p-3 gap-3"}>
      <Text className={"text-grey-8 text-sm font-normal"}>
        Your Product will be displayed like this
      </Text>

      <View
        className={
          "flex-1 h-[200px] rounded-[7px] bg-purple-3 items-center justify-center"
        }
      >
        {imgSource ? (
          <Image
            source={imgSource}
            resizeMode={"cover"}
            className={"w-full h-full rounded-lg"}
          />
        ) : (
          <Text className={"font-normal text-sm text-grey-8-100"}>
            Product Photo
          </Text>
        )}
      </View>

      <Text className={"text-purple font-semibold text-xs"}>Product name</Text>
      <Text className={"text-grey-9 font-normal text-small"}>
        Product price
      </Text>

      <IconText
        text={"location"}
        icon={<Ionicons name={"location-outline"} />}
        type={"icon"}
      />
    </View>
  );
}
