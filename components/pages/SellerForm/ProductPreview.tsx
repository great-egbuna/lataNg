import React from "react";

import { Image, ImageSourcePropType, Text, View } from "react-native";
import IconText from "@/components/general/IconText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome6 } from "@expo/vector-icons";

interface ProductPreviewProps {
  imgSource?: ImageSourcePropType;
  name?: string;
  price?: string;
}

function ProductPreview({ imgSource, name, price }: ProductPreviewProps) {
  return (
    <View className={"border border-grey-1 rounded-lg p-3 gap-3"}>
      <Text className={"text-grey-8 text-lg font-normal"}>
        Your Product will be displayed like this
      </Text>

      <View
        className={
          "flex-1 h-[200px] rounded-[7px] bg-purple-3 items-center justify-center"
        }
      >
        {imgSource ? (
          <Image
            source={{ uri: imgSource as string }}
            resizeMode={"cover"}
            className={"w-full h-full rounded-lg"}
          />
        ) : (
          <Text className={"font-normal text-lg text-grey-8-100"}>
            Product Photo
          </Text>
        )}
      </View>

      <Text className={"text-purple font-semibold text-lg"}>
        {name || "Product name"}
      </Text>
      <Text className={"text-grey-9 font-normal text-lg"}>
        {" "}
        <FontAwesome6 name="naira-sign" size={20} />
        {price?.toLocaleString()
          ? `N${price?.toLocaleString()}`
          : " Product price"}
      </Text>

      <IconText
        text={"location"}
        icon={<Ionicons name={"location-outline"} />}
        type={"icon"}
      />
    </View>
  );
}

export default React.memo(ProductPreview);
