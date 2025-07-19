import { Image, ImageSourcePropType, View } from "react-native";

interface RoundedImageProps {
  imgSource: ImageSourcePropType;
  className?: string;
  imgClassName?: string;
  objClassName?: any;
}

export default function RoundedImage({
  imgSource,
  className,
  imgClassName,
  objClassName,
}: RoundedImageProps) {
  return (
    <View className={`rounded-full  ${className}`}>
      <Image
        source={imgSource}
        className={`w-full h-full rounded-full  ${imgClassName}`}
        style={{ ...objClassName }}
      />
    </View>
  );
}
