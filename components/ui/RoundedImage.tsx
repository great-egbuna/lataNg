import { Image, ImageSourcePropType, View } from "react-native";

interface RoundedImageProps {
  imgSource: ImageSourcePropType;
  className?: string;
}

export default function RoundedImage({
  imgSource,
  className,
}: RoundedImageProps) {
  return (
    <View className={`rounded-full w-[40px] h-[40px] ${className}`}>
      <Image
        source={imgSource}
        resizeMode="contain"
        className="w-full h-full rounded-full"
      />
    </View>
  );
}
