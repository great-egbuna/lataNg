import { Link } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface Props {
  title: string;
  text: string;
  imgSource: ImageSourcePropType | string;
  id?: string;
}

export default function ImageText({ title, text, imgSource, id }: Props) {
  return (
    <Link href={`/seller/${id}`}>
      <View className={"flex-row items-start gap-2.5 w-full"}>
        {imgSource && (
          <Image
            className={"w-[70px] h-[70px] rounded-full "}
            resizeMode="cover"
            source={{ uri: imgSource as string }}
          />
        )}

        <View>
          <Text
            className={
              "text-black font-medium text-base md:text-lg tracking-[-0.72px]"
            }
          >
            {title}
          </Text>
          <Text
            className={"text-gray-700 font-light text-base md:text-lg mt-2"}
          >
            {text}
          </Text>
        </View>
      </View>
    </Link>
  );
}
