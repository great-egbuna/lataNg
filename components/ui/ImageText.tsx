import { Image, ImageSourcePropType, Text, View } from "react-native";

interface Props {
  title: string;
  text: string;
  imgSource: ImageSourcePropType | string;
}

export default function ImageText({ title, text, imgSource }: Props) {
  return (
    <View className={"flex-row items-start gap-2.5"}>
      {imgSource && (
        <Image
          className={"w-[70px] h-[70px] rounded-full "}
          resizeMode="cover"
          source={{ uri: imgSource as string }}
        />
      )}

      <View>
        <Text className={"text-black font-semibold text-base"}>{title}</Text>
        <Text className={"text-grey-9 font-normal text-xs mt-2"}>{text}</Text>
      </View>
    </View>
  );
}
